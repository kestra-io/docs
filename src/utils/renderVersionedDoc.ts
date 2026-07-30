import { createMarkdownParser } from "@nuxtjs/mdc/runtime"
import GithubSlugger from "github-slugger"
import { getHighlighterCore } from "~/components/plugins/schema/shikiToolset"
import {
    currentDocKey,
    docChildHref,
    directDocChildren,
    docLinkBaseDir,
    frontmatterField,
    isRelativeDocHref,
    isVersionedAssetRef,
    plainDocText,
    resolveVersionedDocLink,
    versionedAssetUrl,
    type DocChildren,
    type HomePageButton,
} from "~/utils/versionedDocs"
import { editionLabelAndColorByPrefix } from "~/utils/badgeMaps.mjs"

// @nuxtjs/mdc's hast-like tree, walked ourselves so the emitted HTML reuses
// the real site's markdown/component classes (inherits `.bd-content` styling).
interface MdcNode {
    type: string
    tag?: string
    props?: Record<string, unknown>
    children?: MdcNode[]
    value?: string
    /** Pre-rendered Shiki inner HTML for a `pre`, set by highlightCodeBlocks. */
    highlightedHtml?: string
}

// Tags passed straight through as HTML. Anything else is treated as a bespoke
// MDC component (alert/collapse/badge/home-page-buttons get styled; the rest
// fall through to just their children — no "::"/component-name leak). Not
// exhaustive — extend it when a legit tag shows up in unknownComponents.
const HTML_TAGS = new Set([
    "p", "a", "strong", "em", "del", "code", "pre", "blockquote", "hr", "br",
    "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "table", "thead",
    "tbody", "tr", "th", "td", "img", "span", "div", "sup", "sub", "kbd",
    "figure", "figcaption", "details", "summary", "section", "video", "source",
    "iframe", "picture", "input", "audio",
])
const VOID_TAGS = new Set(["img", "br", "hr", "source", "input", "meta", "link"])
// MDC-internal props that aren't real HTML attributes.
const DROP_PROPS = new Set(["code", "language", "meta", "__ignoreMap"])

/** Serialize an MDC props map to an HTML attribute string. */
function attrs(props: Record<string, unknown>): string {
    let out = ""
    for (const [k, v] of Object.entries(props)) {
        if (k.startsWith(":") || DROP_PROPS.has(k) || v === false || v == null) {
            continue
        }
        const name = k === "className" ? "class" : k === "htmlFor" ? "for" : k
        if (v === true) {
            out += ` ${name}`
            continue
        }
        const val = Array.isArray(v) ? v.join(" ") : String(v)
        if (name === "class" && !val) continue
        out += ` ${name}="${escapeHtml(val)}"`
    }
    return out
}

/** The MDC parser leaves `:buttons='[…]'` as a raw JSON string prop. */
function parseButtons(raw: unknown): HomePageButton[] {
    if (Array.isArray(raw)) return raw as HomePageButton[]
    if (typeof raw !== "string") return []
    try {
        const v = JSON.parse(raw)
        return Array.isArray(v)
            ? v.filter(
                  (b) =>
                      b &&
                      typeof b.label === "string" &&
                      typeof b.href === "string",
              )
            : []
    } catch {
        return []
    }
}

/** "Available on:" pill row for ::badge{version editions}, mirroring the real
 * remark badge directive's markup (`badge.mjs`) so it picks up the same
 * Bootstrap `.badge`/`.bg-*` styling as the latest docs. */
function badgeHtml(props: Record<string, unknown>): string {
    const pills: string[] = []
    if (props.version) {
        pills.push(
            `<span class="badge badge-secondary d-flex align-items-center">v${escapeHtml(String(props.version))}</span>`,
        )
    }
    for (const e of String(props.editions ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)) {
        const info = editionLabelAndColorByPrefix[e] ?? { label: e, color: "secondary" }
        pills.push(
            `<span class="badge d-flex align-items-center bg-${info.color}">${escapeHtml(info.label)}</span>`,
        )
    }
    if (!pills.length) return ""
    return `<div class="fw-bold d-flex gap-2 flex-wrap mb-3"><p class="mb-0">Available on:</p>${pills.join("")}</div>`
}

interface RenderCtx {
    version: string
    apiUrl: string
    children: DocChildren
    pageKey: string
    /** MDC components the serializer didn't recognize — the drift signal. */
    unknownComponents: Set<string>
}

// Style the handful of known MDC components with the site's own component
// classes. `inner` is always appended: MDC's "::" (no closing fence) is a
// *block* component that swallows the following content as its body, so
// dropping children would drop real page content. Unknown components render
// as just their children — graceful, no leak.
function componentHtml(
    tag: string,
    props: Record<string, unknown>,
    inner: string,
    ctx: RenderCtx,
): string {
    switch (tag) {
        case "alert":
            return `<div class="doc-alert alert-${escapeHtml(String(props.type ?? "info"))}">${inner}</div>`
        case "collapse":
            return `<details class="doc-collapse"><summary>${escapeHtml(String(props.title ?? "Details"))}</summary>${inner}</details>`
        case "badge":
            return badgeHtml(props) + inner
        case "home-page-buttons": {
            const buttons = parseButtons(props[":buttons"] ?? props.buttons).map(
                (b) =>
                    b.href.startsWith("/docs")
                        ? { ...b, href: repointAbsoluteDocHref(b.href, ctx) }
                        : b,
            )
            return (buttons.length ? buttonRowHtml(buttons) : "") + inner
        }
        // The home hero contributes only its section title, already lifted
        // into a real <h2> by transformTree.
        case "home-page-header":
            return inner
        // Inline live-count island; a static quantity beats a hole mid-sentence
        // ("Thanks to  plugins…").
        case "plugin-count":
            return "hundreds of" + inner
        // Static on the live site too — mirrored with the real SupportLinks
        // component's markup/classes.
        case "support-links":
            return SUPPORT_LINKS_HTML + inner
        // Card grids of a directory's pages, fed by the children map already on
        // hand for the sidebar. Bare ChildCard lists the current page's own
        // children; pageUrl (0.19 era) / directory (BigChildCards) target
        // another node. Renders nothing when the data isn't there.
        case "child-card":
        case "big-child-cards": {
            // The MDC parser kebab-cases camelCase attribute names, so a
            // 0.19-era `{pageUrl="..."}` directive lands as `page-url`, not
            // `pageUrl` — check both so the intended directory is honored.
            const target = props.pageUrl ?? props["page-url"] ?? props.directory
            const key =
                typeof target === "string"
                    ? `docs/${target.replace(/^\/?docs\/?/, "").replace(/\/+$/, "")}`.replace(/\/$/, "")
                    : ctx.pageKey
            return childCardsHtml(key, ctx) + inner
        }
        default:
            ctx.unknownComponents.add(tag)
            return inner
    }
}

/** The `.ks-card-grid` for a node's direct children, mirroring the real GuidesChildCard.vue's card markup. */
function childCardsHtml(parentKey: string, ctx: RenderCtx): string {
    const cards = directDocChildren(ctx.children, parentKey)
    if (!cards.length) return ""
    const items = cards
        .map(({ key, meta }) => {
            const title = meta.sidebarTitle ?? meta.title ?? key.split("/").pop() ?? key
            // The 1.2+ children API's `icon` field carries this repo's own
            // content-root path (a Vite import-glob key the live
            // GuidesChildCard.vue resolves at authoring time) instead of the
            // versioned-asset-API-servable form; strip it. Older versions
            // (<=1.1) already return the servable form with no prefix.
            const iconRef = meta.icon?.replace(/^\/src\/contents/, "")
            const icon =
                iconRef && isVersionedAssetRef(iconRef)
                    ? `<img class="ks-card-icon" src="${escapeHtml(
                          versionedAssetUrl(ctx.apiUrl, ctx.version, iconRef),
                      )}" alt="" width="48" height="48" />`
                    : ""
            const desc = meta.description
                ? `<p class="ks-card-text">${escapeHtml(plainDocText(meta.description))}</p>`
                : ""
            return `<a class="ks-card" href="${escapeHtml(
                docChildHref(ctx.version, key),
            )}">${icon}<h4 class="ks-card-title">${escapeHtml(title)}</h4>${desc}</a>`
        })
        .join("")
    return `<div class="ks-card-grid">${items}</div>`
}

const SUPPORT_LINKS_HTML = `<div class="support-links-row"><a class="support-link" href="https://kestra.io/slack"><h3>Community Slack</h3><p>Discuss topics with other users and kestra Team</p></a><a class="support-link" href="https://github.com/kestra-io/kestra"><h3>GitHub</h3><p>Give our open-source project a star</p></a><a class="support-link" href="https://kestra.io/demo"><h3>Help Center</h3><p>Contact support for help with your Enterprise account</p></a></div>`

// Mirrors the real docs' expressive-code copy button: same outline icon/
// checkmark glyphs (astro-expressive-code's built-in `.copy` icon), so
// versioned docs' code blocks look identical to the real ones, not just
// similarly-behaved.
const COPY_BUTTON = `<button class="copy" type="button" title="Copy to clipboard" aria-label="Copy code to clipboard"><svg class="icon-copy" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M3 19a2 2 0 0 1-1-2V2a2 2 0 0 1 1-1h13a2 2 0 0 1 2 1"/><rect x="6" y="5" width="16" height="18" rx="1.5" ry="1.5"/></svg><svg class="icon-check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg></button>`

/** Walk the MDC tree, emitting HTML that reuses the site's own component classes. */
function serialize(node: MdcNode | undefined, ctx: RenderCtx): string {
    if (!node) return ""
    if (node.type === "text") return escapeHtml(node.value ?? "")
    if (node.type === "comment") return ""
    if (node.type === "element") {
        const tag = node.tag ?? ""
        const inner = (node.children ?? []).map((c) => serialize(c, ctx)).join("")
        if (!tag) return inner
        if (!HTML_TAGS.has(tag)) {
            return componentHtml(tag, node.props ?? {}, inner, ctx)
        }
        if (tag === "pre" && node.highlightedHtml !== undefined) {
            const lang = node.props?.language
            const langClass = typeof lang === "string" && lang ? ` language-${escapeHtml(lang)}` : ""
            // Mirrors the real docs' expressive-code frame: the language label
            // shows top-right until hovered, when it's replaced by the copy
            // button (markdown.scss's `.astro-code` rules do the hover swap).
            const languageLabel = typeof lang === "string" && lang ? `<span class="language">${escapeHtml(lang)}</span>` : ""
            return `<pre class="astro-code${langClass}">${languageLabel}${COPY_BUTTON}<code>${node.highlightedHtml}</code></pre>`
        }
        if (VOID_TAGS.has(tag)) return `<${tag}${attrs(node.props ?? {})}>`
        return `<${tag}${attrs(node.props ?? {})}>${inner}</${tag}>`
    }
    return (node.children ?? []).map((c) => serialize(c, ctx)).join("")
}

// Media element attrs that hold an asset URL. `poster` is video-only (img has
// none). srcset and <a href>-to-asset are a conscious cut: zero occurrences in
// the corpus (assets are exclusively markdown `![](...)` images), and srcset
// would need descriptor-aware splitting.
const ASSET_ATTRS: Record<string, string[]> = {
    img: ["src"],
    source: ["src"],
    video: ["src", "poster"],
    audio: ["src"],
}

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"])

/** Concatenated text content of a node (for heading slugs). */
function textOf(node: MdcNode): string {
    if (node.type === "text") return node.value ?? ""
    return (node.children ?? []).map(textOf).join("")
}

interface TransformCtx {
    apiUrl: string
    version: string
    /** directory of the page's own markdown, for relative link resolution */
    baseDir: string
    /** flat children map, to validate absolute /docs/... link targets */
    children: DocChildren
    /** per-render heading slugger, matching the site's own rehypeHeadingIds */
    slugger: GithubSlugger
}

/**
 * Old markdown's absolute links ("/docs/getting-started/quickstart") point at
 * the LATEST docs, silently ejecting the reader from the version they chose.
 * Re-root them under /docs/{version} when the children map confirms the page
 * exists in this version; otherwise (page since added, or the map failed to
 * load) leave them on latest, which at least resolves.
 */
function repointAbsoluteDocHref(
    href: string,
    ctx: { version: string; children: DocChildren },
): string {
    const cut = href.search(/[?#]/)
    const path = cut === -1 ? href : href.slice(0, cut)
    const suffix = cut === -1 ? "" : href.slice(cut)
    const rel = path.replace(/^\/docs\/?/, "").replace(/\/+$/, "")
    if (/^\d+\.\d+(\/|$)/.test(rel)) return href // already versioned
    if (!rel) return ctx.children.docs ? `/docs/${ctx.version}${suffix}` : href
    if (!ctx.children[`docs/${rel}`]) return href
    return `/docs/${ctx.version}/${rel}${suffix}`
}

// Pre-pass over the parsed tree, mutating in place before serialize:
// - asset refs re-pointed at the versioned asset API (mirrors the in-app
//   ProseImg + doc store); only root-absolute refs with a file extension (see
//   isVersionedAssetRef) — external and protocol-relative refs are left alone
// - relative in-content links resolved to versioned pretty URLs (the raw
//   source-relative "NN.foo.md" hrefs are all dead routes)
// - heading ids assigned via a fresh GithubSlugger per render (the memoized
//   parser's own slugger state leaks across renders, and its scheme must
//   match rehypeHeadingIds' so authored #anchor links keep resolving)
function transformTree(node: MdcNode | undefined, ctx: TransformCtx): void {
    if (!node) return
    if (node.type === "element" && node.tag && node.props) {
        for (const attr of ASSET_ATTRS[node.tag] ?? []) {
            const v = node.props[attr]
            if (typeof v === "string" && isVersionedAssetRef(v)) {
                node.props[attr] = versionedAssetUrl(ctx.apiUrl, ctx.version, v)
            }
        }
        if (node.tag === "a") {
            const href = node.props.href
            if (typeof href === "string" && isRelativeDocHref(href)) {
                node.props.href = resolveVersionedDocLink(
                    ctx.version,
                    ctx.baseDir,
                    href,
                )
            } else if (
                typeof href === "string" &&
                (href === "/docs" || href.startsWith("/docs/") || href.startsWith("/docs#"))
            ) {
                node.props.href = repointAbsoluteDocHref(href, ctx)
            }
        }
        if (HEADING_TAGS.has(node.tag)) {
            node.props.id = ctx.slugger.slug(textOf(node) || "section")
        }
    }
    if (node.children?.length) {
        node.children = node.children.flatMap(liftComponentTitle)
    }
    for (const child of node.children ?? []) {
        transformTree(child, ctx)
    }
}

// Components whose `title` prop renders as a section heading. Lifted into a
// real sibling <h2> ahead of the component so the heading pass above slugs it
// and the TOC picks it up — a string-built h2 would get neither. Deliberate
// divergence from latest, where ChildCard's title never reaches the TOC.
const TITLED_COMPONENTS = new Set(["home-page-header", "child-card", "big-child-cards"])

function liftComponentTitle(child: MdcNode): MdcNode[] {
    if (
        child.type !== "element" ||
        !TITLED_COMPONENTS.has(child.tag ?? "") ||
        typeof child.props?.title !== "string" ||
        !child.props.title
    ) {
        return [child]
    }
    const title = child.props.title
    delete child.props.title
    return [
        { type: "element", tag: "h2", props: {}, children: [{ type: "text", value: title }] },
        child,
    ]
}

// Same shared core highlighter (Shiki's JS regex engine, no WASM — workerd
// refuses to compile the default Oniguruma engine) and theme pair as
// marked-shiki.ts, the in-app MDC renderers' highlighter, so versioned code
// fences get identical per-token colors and dark-mode behavior for free.
const SHIKI_LIGHT_THEME = "github-light-default"
const SHIKI_DARK_THEME = "github-dark-default"

/** Strip Shiki's own <pre><code> wrapper; we emit our own so `.astro-code` styling applies uniformly. */
function unwrapShikiHtml(html: string): string {
    return html
        .replace(/^<pre\b[^>]*>\s*<code\b[^>]*>/, "")
        .replace(/<\/code>\s*<\/pre>\s*$/, "")
}

/** Pre-pass: highlight every fenced code block in place, setting `highlightedHtml`. */
async function highlightCodeBlocks(node: MdcNode | undefined): Promise<void> {
    if (!node) return
    if (node.type === "element" && node.tag === "pre" && node.props) {
        const code = node.props.code
        if (typeof code === "string") {
            try {
                const highlighter = await getHighlighterCore()
                const lang = typeof node.props.language === "string" ? node.props.language.toLowerCase() : ""
                const usable = lang && highlighter.getLoadedLanguages().includes(lang) ? lang : "text"
                const html = highlighter.codeToHtml(code.replace(/\n$/, ""), {
                    lang: usable,
                    themes: { light: SHIKI_LIGHT_THEME, dark: SHIKI_DARK_THEME },
                })
                node.highlightedHtml = unwrapShikiHtml(html)
            } catch (error) {
                // An unsupported grammar can throw at tokenization time; degrade to
                // the plain (unhighlighted) <pre> path instead of failing the page.
                console.error("Shiki failed to highlight a versioned-doc code block:", error)
            }
        }
    }
    for (const child of node.children ?? []) {
        await highlightCodeBlocks(child)
    }
}

// Components whose HTML is (partly) built from attributes or page data, so
// they render content even with no children — never trailing residue.
const ATTR_DRIVEN_COMPONENTS = new Set([
    "badge", "home-page-buttons", "home-page-header", "plugin-count",
    "support-links", "child-card", "big-child-cards",
])

/**
 * A trailing node that serializes to nothing visible: whitespace, comments, an
 * <hr>, an empty spacer <div>, or a dropped bespoke component. Old homepages
 * end with "---" + component blocks we don't render, leaving a dangling rule
 * and spacer at the bottom of the page.
 */
function isTrailingResidue(node: MdcNode): boolean {
    if (node.type === "text") return !(node.value ?? "").trim()
    if (node.type === "comment") return true
    if (node.type !== "element") return false
    if (node.tag === "hr") return true
    const empty = !(node.children ?? []).some((c) => !isTrailingResidue(c))
    if (node.tag === "div") return empty
    if (!HTML_TAGS.has(node.tag ?? "") && !ATTR_DRIVEN_COMPONENTS.has(node.tag ?? "")) {
        return empty
    }
    return false
}

function trimTrailingResidue(body: MdcNode): void {
    const kids = body.children ?? []
    while (kids.length && isTrailingResidue(kids[kids.length - 1])) {
        kids.pop()
    }
}

// createMarkdownParser is framework-agnostic (no Vue runtime) and runs on the
// Worker. It natively parses both MDC dialects in the corpus — "::" (0.19–0.24)
// and ":::" (1.0/1.1) — including `:prop='json'` v-bind props. It's expensive
// to build; reuse one.
let parserPromise: ReturnType<typeof createMarkdownParser> | null = null
function getParser() {
    if (!parserPromise) {
        parserPromise = createMarkdownParser()
        // Don't memoize a rejection: a cold-start init failure would otherwise
        // fail every later render in this isolate (mirrors getHighlighterCore).
        parserPromise.catch(() => {
            parserPromise = null
        })
    }
    return parserPromise
}

// The homepage and every category-index page are authored as real Astro/MDX,
// with genuine ESM import lines for their Astro components (like ChildCard,
// aliased via "~/components/docs/ChildCard.astro"). Those lines are meaningless
// outside the Astro build and match neither MDC dialect, so the parser treats
// each line as its own paragraph and leaks it verbatim. Only the internal "~/"
// alias is used for these — real code samples in the corpus import from npm
// package names instead — so matching on it is unambiguous.
const ESM_IMPORT_LINE =
    /^import\s+[A-Za-z_$][\w$]*\s+from\s+["']~\/[^"'\n]+["'];?[ \t]*\r?\n?/gm

function stripEsmImports(markdown: string): string {
    return markdown.replace(ESM_IMPORT_LINE, "")
}

// The one spot in the corpus where a real Astro/JSX prop slips past both MDC
// dialects: the homepage's `<HomePageButtons buttons={[...]}/>` takes a JS
// array-literal prop (unquoted keys, multi-line) that isn't valid HTML or MDC
// syntax, so the whole tag falls back to raw text instead of being recognized
// as a component. Normalize it into the `:::HomePageButtons{ :buttons='json'}`
// MDC form the parser and componentHtml already handle, rather than teaching
// the parser JS-literal syntax for this single occurrence.
const HOME_PAGE_BUTTONS_JSX =
    /<HomePageButtons\s+buttons=\{(\[[\s\S]*?\])\}\s*\/>/g

function normalizeHomePageButtonsJsx(markdown: string): string {
    return markdown.replace(HOME_PAGE_BUTTONS_JSX, (_match, arrayLiteral: string) => {
        try {
            const json = arrayLiteral
                .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
                .replace(/,(\s*[\]}])/g, "$1")
            const buttons = JSON.parse(json)
            return `:::HomePageButtons{ :buttons='${JSON.stringify(buttons)}'}\n:::`
        } catch {
            // Unexpected shape: drop the tag rather than leak raw JSX.
            return ""
        }
    })
}

// Old homepages open with a genuinely self-closing `<HomePageHeader
// title="..." />` (no children, matching the real — now-removed — Astro
// component). The parser doesn't recognize the JSX self-close and instead
// treats the tag as an opener that swallows the following paragraph as
// unwrapped, un-parsed children (literal "**bold**", no <p>). Normalizing it
// into an empty-bodied MDC block first keeps it self-contained, so the
// following paragraph is parsed as its own, independent paragraph.
const HOME_PAGE_HEADER_JSX =
    /<HomePageHeader\s+title=(["'])((?:(?!\1)[\s\S])*)\1\s*\/>/g

function normalizeHomePageHeaderJsx(markdown: string): string {
    // Reuses whichever quote char the source used — the negative lookahead in
    // HOME_PAGE_HEADER_JSX already guarantees the title contains none of it.
    return markdown.replace(
        HOME_PAGE_HEADER_JSX,
        (_match, quote: string, title: string) => `:::HomePageHeader{title=${quote}${title}${quote}}\n:::`,
    )
}

const escapeHtml = (s: string) =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")

/**
 * Render the homepage CTA buttons as the real site's Button.vue markup
 * (`.btn.btn-primary`/`.btn.btn-secondary`), so they pick up global button
 * styling instead of a bespoke duplicate.
 */
const buttonRowHtml = (buttons: HomePageButton[]): string =>
    `<div class="docs-button-row">${buttons
        .map(
            (b, i) =>
                `<a class="btn btn-${i === 0 ? "primary" : "secondary"} btn-md" href="${escapeHtml(b.href)}">${escapeHtml(b.label)}</a>`,
        )
        .join("")}</div>`

/** h2/h3 entries for NavToc's right-rail TOC (ids already stabilized by the pre-pass). */
function collectHeadings(
    node: MdcNode,
    out: { id: string; text: string; level: number }[],
): void {
    if (node.type === "element" && (node.tag === "h2" || node.tag === "h3")) {
        const id = node.props?.id
        if (typeof id === "string") {
            out.push({
                id,
                text: textOf(node),
                level: node.tag === "h2" ? 2 : 3,
            })
        }
    }
    for (const child of node.children ?? []) collectHeadings(child, out)
}

export interface VersionedDocBodyInput {
    version: string
    /** path after the version, no leading slash, e.g. "tutorial/inputs" */
    path: string
    markdown: string
    /** flat children map, to repoint links/cards; omit/{} renders cards-less */
    children?: DocChildren
    /** API base for versioned asset URLs (injected; defaulted for tests) */
    apiUrl?: string
}

export interface VersionedDocBody {
    title: string
    h1: string
    description?: string
    /** content HTML, meant to be placed inside DocsLayout's `.bd-content` slot */
    html: string
    headings: { id: string; text: string; level: number }[]
    /**
     * MDC components in the source the serializer didn't recognize (each
     * rendered as bare children). Non-empty means a new component entered the
     * corpus and componentHtml needs a case for it — surface, don't swallow.
     */
    unknownComponents: string[]
}

/** Render a versioned doc's markdown body to HTML using the site's own component classes. */
export async function renderVersionedDocBody({
    version,
    path,
    markdown,
    children = {},
    apiUrl = "https://api.kestra.io/v1",
}: VersionedDocBodyInput): Promise<VersionedDocBody> {
    const title = frontmatterField(markdown, "title") ?? "Documentation"
    const h1 = frontmatterField(markdown, "h1") ?? title
    const description = frontmatterField(markdown, "description")

    const parse = await getParser()
    // The parser strips frontmatter and parses the MDC body (both "::" and
    // ":::" dialects, plus `:prop='json'` props) into a hast-like tree we
    // serialize ourselves — no Vue runtime, no "::"/component-name leak.
    const normalizedMarkdown = normalizeHomePageHeaderJsx(
        normalizeHomePageButtonsJsx(stripEsmImports(markdown)),
    )
    const { body } = await parse(normalizedMarkdown)
    transformTree(body as MdcNode, {
        apiUrl,
        version,
        baseDir: docLinkBaseDir(path, children),
        children,
        slugger: new GithubSlugger(),
    })
    trimTrailingResidue(body as MdcNode)
    await highlightCodeBlocks(body as MdcNode)
    const pageKey = currentDocKey(path)
    const ctx: RenderCtx = { version, apiUrl, children, pageKey, unknownComponents: new Set() }
    const html = serialize(body as MdcNode, ctx)
    const headings: { id: string; text: string; level: number }[] = []
    collectHeadings(body as MdcNode, headings)

    return { title, h1, description, html, headings, unknownComponents: [...ctx.unknownComponents].sort() }
}
