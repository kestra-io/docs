import { createMarkdownParser } from "@nuxtjs/mdc/runtime"
import {
    buildDocTree,
    currentDocKey,
    docChildHref,
    directDocChildren,
    docLinkBaseDir,
    frontmatterField,
    isRelativeDocHref,
    isVersionedAssetRef,
    plainDocText,
    prevNextDocs,
    resolveVersionedDocLink,
    versionedAssetUrl,
    versionSelectOptions,
    NAV,
    type DocChildren,
    type DocTreeNode,
    type DocVersion,
    type HomePageButton,
} from "~/utils/versionedDocs"
import { editionLabelAndColorByPrefix } from "~/utils/badgeMaps.mjs"
// Inlined like the real Header.vue (logo-light/logo-dark): the standalone page
// has no bootstrap/JS, so dark mode is keyed off prefers-color-scheme instead.
import logoLight from "~/assets/logo-black.svg?raw"
import logoDark from "~/assets/logo-white.svg?raw"

// The @nuxtjs/mdc parser emits a hast-like tree: element nodes carry a kebab-case
// `tag` and a `props` map (camelCase hast attrs), text nodes a `value`. We walk
// it ourselves to emit JS-less HTML — the MDC Vue renderer needs a Vue runtime,
// which the standalone page deliberately has none of.
interface MdcNode {
    type: string
    tag?: string
    props?: Record<string, unknown>
    children?: MdcNode[]
    value?: string
}

// Tags passed straight through as HTML. Anything else is treated as a bespoke
// MDC component (alert/collapse/badge/home-page-buttons get styled; the rest
// fall through to just their children — no "::"/component-name leak).
const HTML_TAGS = new Set([
    "p", "a", "strong", "em", "del", "code", "pre", "blockquote", "hr", "br",
    "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "table", "thead",
    "tbody", "tr", "th", "td", "img", "span", "div", "sup", "sub", "kbd",
    "figure", "figcaption", "details", "summary", "section", "video", "source",
    "iframe", "picture",
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

/** "Available on:" pill row for ::badge{version editions}. */
function badgeHtml(props: Record<string, unknown>): string {
    const pills: string[] = []
    if (props.version) {
        pills.push(`<span class="vd-badge-v">${escapeHtml(String(props.version))}</span>`)
    }
    for (const e of String(props.editions ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)) {
        const label = editionLabelAndColorByPrefix[e]?.label ?? e
        pills.push(`<span class="vd-badge-v">${escapeHtml(label)}</span>`)
    }
    if (!pills.length) return ""
    return `<div class="vd-badge"><span class="vd-badge-k">Available on:</span>${pills.join("")}</div>`
}

// Everything the serializer needs beyond the tree itself: version/apiUrl for
// URL building and the children map for the data-driven components (ChildCard
// grids, prev/next). pageKey is the children key of the page being rendered.
interface RenderCtx {
    version: string
    apiUrl: string
    children: DocChildren
    pageKey: string
}

// Style the handful of known MDC components with our self-contained vd-* markup.
// `inner` is always appended: MDC's "::" (no closing fence) is a *block*
// component that swallows the following content as its body, so dropping
// children would drop real page content. Unknown components render as just
// their children — graceful, no leak.
function componentHtml(
    tag: string,
    props: Record<string, unknown>,
    inner: string,
    ctx: RenderCtx,
): string {
    switch (tag) {
        case "alert":
            return `<div class="vd-alert vd-alert-${escapeHtml(String(props.type ?? "info"))}">${inner}</div>`
        case "collapse":
            return `<details class="vd-collapse"><summary>${escapeHtml(String(props.title ?? "Details"))}</summary>${inner}</details>`
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
        // The home hero component only contributes its section title here.
        case "home-page-header":
            return (
                (props.title ? `<h2>${escapeHtml(String(props.title))}</h2>` : "") +
                inner
            )
        // Inline live-count island; a static quantity beats a hole mid-sentence
        // ("Thanks to  plugins…").
        case "plugin-count":
            return "hundreds of" + inner
        // Static on the live site too — mirrored as a JS-less card row.
        case "support-links":
            return SUPPORT_LINKS_HTML + inner
        // Card grids of a directory's pages, fed by the children map already on
        // hand for the sidebar. Bare ChildCard lists the current page's own
        // children; pageUrl (0.19 era) / directory (BigChildCards) target
        // another node. Renders nothing when the data isn't there.
        case "child-card":
        case "big-child-cards": {
            const target = props.pageUrl ?? props.directory
            const key =
                typeof target === "string"
                    ? `docs/${target.replace(/^\/?docs\/?/, "").replace(/\/+$/, "")}`.replace(/\/$/, "")
                    : ctx.pageKey
            const title = props.title
                ? `<h2>${escapeHtml(String(props.title))}</h2>`
                : ""
            return title + childCardsHtml(key, ctx) + inner
        }
        default:
            return inner
    }
}

/** The vd- card grid for a node's direct children (title, description, icon). */
function childCardsHtml(parentKey: string, ctx: RenderCtx): string {
    const cards = directDocChildren(ctx.children, parentKey)
    if (!cards.length) return ""
    const items = cards
        .map(({ key, meta }) => {
            const icon =
                meta.icon && isVersionedAssetRef(meta.icon)
                    ? `<img class="vd-card-icon" src="${escapeHtml(
                          versionedAssetUrl(ctx.apiUrl, ctx.version, meta.icon),
                      )}" alt="" width="24" height="24" loading="lazy">`
                    : ""
            const desc = meta.description
                ? `<p>${escapeHtml(plainDocText(meta.description))}</p>`
                : ""
            return `<a class="vd-card" href="${escapeHtml(
                docChildHref(ctx.version, key),
            )}">${icon}<h3>${escapeHtml(meta.title ?? key.split("/").pop() ?? key)}</h3>${desc}</a>`
        })
        .join("")
    return `<div class="vd-cards">${items}</div>`
}

const SUPPORT_LINKS_HTML = `<div class="vd-support"><a href="https://kestra.io/slack"><h3>Community Slack</h3><p>Discuss topics with other users and kestra Team</p></a><a href="https://github.com/kestra-io/kestra"><h3>GitHub</h3><p>Give our open-source project a star</p></a><a href="https://kestra.io/demo"><h3>Help Center</h3><p>Contact support for help with your Enterprise account</p></a></div>`

/** Walk the MDC tree, emitting JS-less HTML. */
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

const slugify = (s: string): string =>
    s
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

interface TransformCtx {
    apiUrl: string
    version: string
    /** directory of the page's own markdown, for relative link resolution */
    baseDir: string
    /** flat children map, to validate absolute /docs/... link targets */
    children: DocChildren
    /** per-render slug dedup (the parser's own slugger leaks across renders) */
    slugCounts: Map<string, number>
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
// - heading ids regenerated per render: the memoized parser's slugger state
//   leaks across renders, minting "foo-2", "foo-3"… for the same heading
// - fence language surfaced as data-lang for the CSS label
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
            const slug = slugify(textOf(node)) || "section"
            const n = ctx.slugCounts.get(slug) ?? 0
            ctx.slugCounts.set(slug, n + 1)
            node.props.id = n ? `${slug}-${n}` : slug
        }
        if (node.tag === "pre" && typeof node.props.language === "string") {
            node.props["data-lang"] = node.props.language
        }
    }
    for (const child of node.children ?? []) {
        transformTree(child, ctx)
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
// and ":::" (1.0/1.1) — including `:prop='json'` v-bind props, so no bespoke
// pre-processing of the markdown is needed. It's expensive to build; reuse one.
let parserPromise: ReturnType<typeof createMarkdownParser> | null = null
function getParser() {
    if (!parserPromise) parserPromise = createMarkdownParser()
    return parserPromise
}

const escapeHtml = (s: string) =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")

/**
 * Render the homepage CTA buttons as a row of styled links, mirroring the live
 * site's HomePageButtons: the first button is primary, the rest secondary.
 */
const buttonRowHtml = (buttons: HomePageButton[]): string =>
    `<div class="vd-buttons">${buttons
        .map(
            (b, i) =>
                `<a class="vd-button ${i === 0 ? "vd-button-primary" : "vd-button-secondary"}" href="${escapeHtml(b.href)}">${escapeHtml(b.label)}</a>`,
        )
        .join("")}</div>`

/**
 * Primary nav, mirroring the real site header: plain top-level links plus
 * grouped-section dropdowns. The inline script toggles `.vd-open` on click
 * (mouse, keyboard and touch alike, like the real header's Bootstrap dropdowns),
 * and the hamburger collapses the whole nav into a drawer on mobile — so every
 * section (Docs included) stays reachable on any device.
 */
const navHtml = (): string =>
    NAV.map((g) => {
        if (!g.columns) {
            return `<a class="vd-nav-link" href="${escapeHtml(g.href ?? "#")}">${escapeHtml(g.label)}</a>`
        }
        const cols = g.columns
            .map(
                (c) =>
                    `<div class="vd-nav-col">${
                        c.heading
                            ? `<p class="vd-nav-col-h">${escapeHtml(c.heading)}</p>`
                            : ""
                    }${c.links
                        .map(
                            (l) =>
                                `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`,
                        )
                        .join("")}</div>`,
            )
            .join("")
        return `<div class="vd-nav-item"><button type="button" class="vd-nav-link vd-nav-toggle" aria-haspopup="true" aria-expanded="false">${escapeHtml(g.label)}<span class="vd-chev" aria-hidden="true">▾</span></button><div class="vd-dropdown"><div class="vd-dropdown-cols">${cols}</div></div></div>`
    }).join("")

/** <option> list for the version <select>: "Latest" + each MAJOR.MINOR. */
function versionOptions(
    versions: DocVersion[],
    current: string,
    path: string,
): string {
    return versionSelectOptions(versions, current, path)
        .map(
            (o) =>
                `<option value="${o.value}"${o.selected ? " selected" : ""}>${o.label}</option>`,
        )
        .join("")
}

// The keys to pre-expand: every ancestor of the current page, plus the page
// itself ("docs/ui/dashboard" -> docs, docs/ui, docs/ui/dashboard). The whole
// path to the active node is rendered open server-side, so it's visible without
// JS and middle-/cmd-click on any link still works.
function ancestorOpenKeys(activeKey: string): Set<string> {
    const keys = new Set<string>()
    let acc = ""
    for (const part of activeKey.split("/")) {
        acc = acc ? `${acc}/${part}` : part
        keys.add(acc)
    }
    return keys
}

/** One tree node: a plain link if it's a leaf, else a <details> with its kids. */
function sidebarNodeHtml(
    node: DocTreeNode,
    version: string,
    activeKey: string,
    openKeys: Set<string>,
): string {
    const isActive = node.path === activeKey
    const link = `<a class="vd-tree-link${isActive ? " vd-tree-active" : ""}" href="${escapeHtml(
        docChildHref(version, node.path),
    )}"${isActive ? ' aria-current="page"' : ""}>${escapeHtml(node.title)}</a>`
    if (!node.children.length) {
        return `<li>${link}</li>`
    }
    const kids = node.children
        .map((c) => sidebarNodeHtml(c, version, activeKey, openKeys))
        .join("")
    return `<li><details${openKeys.has(node.path) ? " open" : ""}><summary class="vd-tree-summary">${link}<span class="vd-tree-caret" aria-hidden="true">▸</span></summary><ul class="vd-tree-list">${kids}</ul></details></li>`
}

/**
 * The left navigation sidebar, built server-side from the flat children map.
 * The single "docs" root is surfaced as a top-level home link with its sections
 * listed below it. Returns "" when there are no children (e.g. the endpoint
 * failed) so the page degrades to a single content column.
 */
function sidebarHtml(
    version: string,
    children: DocChildren,
    path: string,
): string {
    const tree = buildDocTree(children)
    if (!tree.length) return ""
    const activeKey = currentDocKey(path)
    const openKeys = ancestorOpenKeys(activeKey)
    const docsRoot = tree.find((n) => n.path === "docs")
    const topNodes = docsRoot ? docsRoot.children : tree
    const homeActive = activeKey === "docs"
    const home = `<li><a class="vd-tree-link vd-tree-home${
        homeActive ? " vd-tree-active" : ""
    }" href="${escapeHtml(docChildHref(version, "docs"))}"${
        homeActive ? ' aria-current="page"' : ""
    }>${escapeHtml(docsRoot?.title ?? "Documentation")}</a></li>`
    const items = topNodes
        .map((n) => sidebarNodeHtml(n, version, activeKey, openKeys))
        .join("")
    return `<aside class="vd-sidebar" id="vd-sidebar">
<button type="button" class="vd-sidebar-toggle" aria-controls="vd-sidebar-nav" aria-expanded="false">Documentation menu</button>
<nav class="vd-sidebar-nav" id="vd-sidebar-nav" aria-label="Documentation">
<ul class="vd-tree-list vd-tree-root">${home}${items}</ul>
</nav>
</aside>`
}

/** "Docs / Tutorial / Outputs" trail above the h1, titles from the children map. */
function breadcrumbHtml(
    version: string,
    path: string,
    children: DocChildren,
): string {
    if (!path || !children.docs) return ""
    const segs = path.split("/")
    const crumbs = [
        `<a href="${escapeHtml(docChildHref(version, "docs"))}">Docs</a>`,
    ]
    let acc = "docs"
    for (const seg of segs.slice(0, -1)) {
        acc = `${acc}/${seg}`
        const title = children[acc]?.title ?? seg
        crumbs.push(
            `<a href="${escapeHtml(docChildHref(version, acc))}">${escapeHtml(title)}</a>`,
        )
    }
    const lastTitle =
        children[`docs/${path}`]?.title ?? segs[segs.length - 1]
    crumbs.push(`<span>${escapeHtml(lastTitle)}</span>`)
    return `<nav class="vd-breadcrumb" aria-label="Breadcrumb">${crumbs.join(
        '<span class="vd-bc-sep">/</span>',
    )}</nav>`
}

/** Previous/Next footer cards from the children map's nav order. */
function prevNextHtml(
    version: string,
    children: DocChildren,
    pageKey: string,
): string {
    const { prev, next } = prevNextDocs(children, pageKey)
    if (!prev && !next) return ""
    const card = (
        node: { key: string; title: string } | undefined,
        label: string,
        cls: string,
    ) =>
        node
            ? `<a class="vd-pn ${cls}" href="${escapeHtml(
                  docChildHref(version, node.key),
              )}"><span class="vd-pn-k">${label}</span><span class="vd-pn-t">${escapeHtml(node.title)}</span></a>`
            : "<span></span>"
    return `<nav class="vd-pn-row" aria-label="Pagination">${card(prev, "Previous", "vd-pn-prev")}${card(next, "Next", "vd-pn-next")}</nav>`
}

/** h2/h3 entries for the right-rail TOC (ids already stabilized by the pre-pass). */
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

/** Right-rail "On this page" TOC; skipped when the page has < 2 headings. */
function tocHtml(headings: { id: string; text: string; level: number }[]): string {
    if (headings.length < 2) return ""
    const items = headings
        .map(
            (h) =>
                `<li${h.level === 3 ? ' class="vd-toc-sub"' : ""}><a href="#${escapeHtml(h.id)}">${escapeHtml(h.text)}</a></li>`,
        )
        .join("")
    return `<aside class="vd-toc"><nav aria-label="On this page"><p class="vd-toc-title">On this page</p><ul>${items}</ul></nav></aside>`
}

const STYLES = `
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body { margin: 0; font-family: "Mona Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    line-height: 1.5; color: #131316; background: #fff; }
pre, code, kbd { font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace; }
.vd-bar { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;
    padding: 0.75rem 1.5rem; border-bottom: 1px solid #e3e5e8; background: #fff;
    font-size: 0.9rem; }
.vd-logo { display: inline-flex; align-items: center; }
.vd-logo svg { height: 26px; width: auto; display: block; }
.vd-logo-light, .vd-logo-dark { display: inline-flex; align-items: center; }
.vd-logo-dark { display: none; }
.vd-drawer { display: contents; }
.vd-links { display: flex; align-items: center; gap: 0.25rem; flex-wrap: wrap; }
.vd-nav-item { position: relative; }
.vd-nav-link { display: inline-flex; align-items: center; gap: 0.2rem; color: #1c1e21;
    text-decoration: none; font: inherit; font-weight: 500; background: none; border: 0;
    cursor: pointer; padding: 0.5rem 0.6rem; border-radius: 0.375rem; white-space: nowrap; }
.vd-nav-link:hover, .vd-nav-toggle[aria-expanded="true"] { color: #7e3fef; }
.vd-chev { font-size: 0.7em; opacity: 0.7; transition: transform 0.15s; }
.vd-nav-item.vd-open .vd-chev, .vd-nav-toggle[aria-expanded="true"] .vd-chev { transform: rotate(180deg); }
.vd-dropdown { position: absolute; top: 100%; left: 0; display: none; margin-top: 0.25rem;
    background: #fff; border: 1px solid #e3e5e8; border-radius: 0.5rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.12); padding: 0.85rem; z-index: 20; }
.vd-nav-item.vd-open .vd-dropdown { display: block; }
.vd-dropdown-cols { display: flex; gap: 1.75rem; }
.vd-nav-col { display: flex; flex-direction: column; gap: 0.1rem; min-width: 11rem; }
.vd-nav-col-h { margin: 0 0 0.35rem; font-size: 0.7rem; text-transform: uppercase;
    letter-spacing: 0.05em; color: #9aa0a6; font-weight: 700; }
.vd-nav-col a { color: #1c1e21; text-decoration: none; padding: 0.35rem 0.5rem;
    border-radius: 0.375rem; font-weight: 500; white-space: nowrap; }
.vd-nav-col a:hover { background: #f5f3ff; color: #7e3fef; }
.vd-burger { display: none; flex-direction: column; justify-content: center; gap: 4px;
    width: 2.25rem; height: 2.25rem; padding: 0.45rem; background: none; border: 0;
    cursor: pointer; border-radius: 0.375rem; }
.vd-burger span { display: block; height: 2px; background: #1c1e21; border-radius: 2px; }
.vd-bar .vd-spacer { flex: 1; }
.vd-bar label { color: #5c6370; }
.vd-bar select { font: inherit; padding: 0.25rem 0.5rem; border: 1px solid #c9ccd1;
    border-radius: 0.25rem; background: #fff; color: inherit; }
.vd-cta { background: #7e3fef; color: #fff; text-decoration: none; font-weight: 600;
    padding: 0.4rem 0.9rem; border-radius: 0.375rem; white-space: nowrap; }
.vd-cta:hover { background: #6b2fd6; }
.vd-cta-secondary { background: #1c1e21; }
.vd-cta-secondary:hover { background: #000; }
.vd-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.5rem 0 3rem; }
.vd-content .vd-button { display: inline-block; font-weight: 700; line-height: 1.5;
    padding: 0.5rem 1rem; border-radius: 0.375rem; text-decoration: none; white-space: nowrap;
    border: 1px solid transparent; }
.vd-content .vd-button-primary { background: #631bff; color: #fff;
    box-shadow: 0 0 14px 0 #BE62FF inset, 2px 2px 11px 0 #0000001a; }
.vd-content .vd-button-primary:hover { background: #8465ff; color: #fff; }
.vd-content .vd-button-secondary { background: #fff; color: #131316; border-color: #131316; }
.vd-content .vd-button-secondary:hover { background: #131316; color: #fff; }
.vd-layout { display: flex; align-items: flex-start; }
.vd-sidebar { flex: 0 0 18rem; width: 18rem; align-self: stretch; position: sticky; top: 0;
    max-height: 100vh; overflow-y: auto; border-right: 1px solid #e3e5e8; padding: 1.5rem 1rem; }
.vd-sidebar-toggle { display: none; }
.vd-sidebar-nav { font-size: 0.9rem; }
.vd-tree-list { list-style: none; margin: 0; padding: 0; }
.vd-tree-list .vd-tree-list { margin-left: 0.6rem; padding-left: 0.4rem; border-left: 1px solid #e3e5e8; }
.vd-tree-link { display: block; padding: 0.3rem 0.5rem; border-radius: 0.375rem; color: #1c1e21;
    text-decoration: none; }
.vd-tree-link:hover { background: #f5f3ff; color: #7e3fef; }
.vd-tree-active { background: #f0eefe; color: #7e3fef; font-weight: 600; }
.vd-tree-root > li > .vd-tree-link, .vd-tree-root > li > details > .vd-tree-summary { font-weight: 600; }
.vd-tree-summary { display: flex; align-items: center; cursor: pointer; list-style: none; }
.vd-tree-summary .vd-tree-link { flex: 1; }
.vd-tree-caret { font-size: 0.7em; opacity: 0.6; padding: 0 0.4rem; transition: transform 0.15s; }
details[open] > .vd-tree-summary .vd-tree-caret { transform: rotate(90deg); }
.vd-layout .vd-content { flex: 1 1 auto; min-width: 0; }
.vd-content { max-width: 768px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
.vd-content h1 { font-size: 2.5rem; font-weight: 600; line-height: 1.2; margin: 0 0 1.5rem; }
.vd-content h2 { font-size: 2.125rem; font-weight: 600; margin-top: 4rem; }
.vd-content pre { background: #f5f5f7; padding: 1rem; border-radius: 0.5rem; overflow: auto;
    font-size: 0.875rem; position: relative; }
.vd-copy { position: absolute; top: 0.35rem; right: 0.5rem; font: inherit;
    font-size: 0.7rem; padding: 0.15rem 0.5rem; border: 1px solid #c9ccd1;
    border-radius: 0.25rem; background: #fff; color: #5c6370; cursor: pointer; }
.vd-copy:hover { color: #7e3fef; border-color: #7e3fef; }
.vd-content code { background: #f0eefe; padding: 0.1em 0.35em; border-radius: 0.25rem;
    font-size: 0.875rem; }
.vd-content pre code { background: none; padding: 0; font-size: inherit; }
.vd-content pre[data-lang] { position: relative; padding-top: 1.5rem; }
/* single-colon :after — double-colon anywhere on the page trips the MDC-leak canary */
.vd-content pre[data-lang]:after { content: attr(data-lang); position: absolute;
    top: 0.5rem; right: 3.5rem; font-size: 0.7rem; text-transform: uppercase;
    letter-spacing: 0.05em; color: #9aa0a6; }
.vd-content a { color: #631bff; text-decoration: none; }
.vd-content a:hover { text-decoration: underline; }
.vd-content img { max-width: 100%; height: auto; }
.vd-content table { border-collapse: collapse; width: 100%; }
.vd-content th, .vd-content td { border: 0; border-bottom: 1px solid #e3e5e8;
    padding: 0.75rem 1rem; text-align: left; }
.vd-content .vd-support { display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; margin: 1.5rem 0 3rem; }
.vd-content .vd-support a { border: 1px solid #e3e5e8; border-radius: 0.5rem;
    padding: 1rem; color: inherit; }
.vd-content .vd-support a:hover { border-color: #7e3fef; text-decoration: none; }
.vd-content .vd-support h3 { margin: 0; font-size: 1.125rem; }
.vd-content .vd-support p { color: #5c6370; margin: 0.5rem 0 0; font-size: 0.875rem;
    line-height: 1.6; }
.vd-content .vd-cards { display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 1rem; margin: 1.5rem 0; }
.vd-content .vd-card { border: 1px solid #e3e5e8; border-radius: 0.75rem;
    padding: 1rem; color: inherit; }
.vd-content .vd-card:hover { border-color: #7e3fef; text-decoration: none; }
.vd-content .vd-card-icon { display: block; margin-bottom: 0.6rem; }
.vd-content .vd-card h3 { margin: 0; font-size: 1.06rem; }
.vd-content .vd-card p { color: #5c6370; margin: 0.4rem 0 0; font-size: 0.875rem;
    line-height: 1.6; }
.vd-breadcrumb { font-size: 0.85rem; margin-bottom: 1rem; color: #5c6370; }
.vd-breadcrumb a { color: #5c6370; }
.vd-bc-sep { margin: 0 0.4rem; opacity: 0.6; }
.vd-pn-row { display: flex; justify-content: space-between; gap: 1rem;
    margin-top: 3rem; border-top: 1px solid #e3e5e8; padding-top: 1.5rem; }
.vd-content .vd-pn { display: flex; flex-direction: column; gap: 0.2rem;
    border: 1px solid #e3e5e8; border-radius: 0.5rem; padding: 0.75rem 1rem;
    color: inherit; max-width: 48%; }
.vd-content .vd-pn:hover { border-color: #7e3fef; text-decoration: none; }
.vd-pn-next { margin-left: auto; text-align: right; }
.vd-pn-k { font-size: 0.75rem; color: #5c6370; }
.vd-pn-t { font-weight: 600; }
.vd-toc { flex: 0 0 14rem; width: 14rem; position: sticky; top: 0;
    max-height: 100vh; overflow-y: auto; padding: 2.5rem 1rem; font-size: 0.85rem; }
.vd-toc-title { margin: 0 0 0.5rem; font-weight: 700; font-size: 0.75rem;
    text-transform: uppercase; letter-spacing: 0.05em; color: #9aa0a6; }
.vd-toc ul { list-style: none; margin: 0; padding: 0; }
.vd-toc li { margin: 0.3rem 0; }
.vd-toc-sub { padding-left: 0.85rem; }
.vd-toc a { color: #5c6370; text-decoration: none; }
.vd-toc a:hover { color: #7e3fef; }
@media (max-width: 1199px) { .vd-toc { display: none; } }
.video-container { position: relative; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; }
.video-container iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.vd-alert { margin: 1.5rem 0; padding: 0.75rem 1rem; border-left: 4px solid #7e3fef;
    border-radius: 0.25rem; background: #f6f3ff; }
.vd-alert > :first-child { margin-top: 0; }
.vd-alert > :last-child { margin-bottom: 0; }
.vd-alert-info { border-left-color: #4d62e5; background: #dbe0ff; color: #0542b6; }
.vd-alert-warning { border-left-color: #e8a33d; background: #fdf6ec; }
.vd-alert-danger { border-left-color: #e5484d; background: #fdecec; }
.vd-alert-success { border-left-color: #46a758; background: #ecf6ee; }
.vd-collapse { margin: 1.5rem 0; border: 1px solid #e3e5e8; border-radius: 0.5rem;
    padding: 0.5rem 1rem; }
.vd-collapse > summary { cursor: pointer; font-weight: 600; }
.vd-collapse[open] > summary { margin-bottom: 0.5rem; }
.vd-badge { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;
    margin: 1rem 0; font-size: 0.85rem; }
.vd-badge-k { color: #5c6370; font-weight: 600; }
.vd-badge-v { padding: 0.1rem 0.55rem; border-radius: 1rem; font-weight: 600;
    background: #f0eefe; color: #7e3fef; }
@media (max-width: 860px) {
    .vd-burger { display: flex; }
    .vd-drawer { display: none; order: 99; width: 100%; flex-direction: column;
        align-items: stretch; gap: 0.25rem; margin-top: 0.25rem; }
    .vd-drawer.vd-open { display: flex; }
    .vd-drawer .vd-spacer { display: none; }
    .vd-links { flex-direction: column; align-items: stretch; gap: 0; width: 100%; }
    .vd-nav-item { width: 100%; }
    .vd-nav-link { width: 100%; }
    .vd-dropdown { position: static; display: none; margin: 0 0 0.25rem; border: 0;
        box-shadow: none; padding: 0 0 0 1rem; }
    .vd-nav-item.vd-open .vd-dropdown { display: block; }
    .vd-dropdown-cols { flex-direction: column; gap: 0.75rem; }
    .vd-cta { text-align: center; }
    .vd-bar label { margin-left: auto; }
    /* stretch, not flex-start — and no auto margins: cross-axis auto margins
       defeat stretch, shrink-to-fitting the content column to its widest <pre> */
    .vd-layout { flex-direction: column; align-items: stretch; }
    .vd-layout .vd-content { margin: 0; }
    .vd-content .vd-support { grid-template-columns: 1fr; }
    .vd-content .vd-cards { grid-template-columns: 1fr; }
    .vd-sidebar { position: static; flex: none; width: 100%; max-height: none; overflow: visible;
        border-right: 0; border-bottom: 1px solid #e3e5e8; padding: 0.5rem 1rem; }
    .vd-sidebar-toggle { display: block; width: 100%; text-align: left; font: inherit;
        font-weight: 600; color: #1c1e21; background: none; border: 0; cursor: pointer;
        padding: 0.5rem; }
    .vd-sidebar-nav { display: none; }
    .vd-sidebar.vd-open .vd-sidebar-nav { display: block; }
}
@media (prefers-color-scheme: dark) {
    body { color: #e3e5e8; background: #16181d; }
    .vd-bar { background: #1c1e24; border-color: #2b2e36; }
    .vd-logo-light { display: none; }
    .vd-logo-dark { display: inline-flex; }
    .vd-nav-link { color: #e3e5e8; }
    .vd-burger span { background: #e3e5e8; }
    .vd-dropdown { background: #1c1e24; border-color: #2b2e36; }
    .vd-nav-col a { color: #e3e5e8; }
    .vd-nav-col a:hover { background: #2b2540; color: #b9a8ff; }
    .vd-cta-secondary { background: #2b2e36; }
    .vd-cta-secondary:hover { background: #3a3e48; }
    .vd-bar select { background: #16181d; border-color: #2b2e36; }
    .vd-content a { color: #cdc5ff; }
    .vd-content pre { background: #1c1e24; }
    .vd-content code { background: #2b2540; }
    .vd-content th, .vd-content td { border-color: #2b2e36; }
    .vd-content .vd-support a { border-color: #2b2e36; }
    .vd-content .vd-support a:hover { border-color: #7e3fef; }
    .vd-content .vd-support p { color: #9aa0a6; }
    .vd-content .vd-card { border-color: #2b2e36; }
    .vd-content .vd-card:hover { border-color: #7e3fef; }
    .vd-content .vd-card p { color: #9aa0a6; }
    .vd-breadcrumb, .vd-breadcrumb a { color: #9aa0a6; }
    .vd-pn-row { border-color: #2b2e36; }
    .vd-content .vd-pn { border-color: #2b2e36; }
    .vd-content .vd-pn:hover { border-color: #7e3fef; }
    .vd-pn-k { color: #9aa0a6; }
    .vd-toc a { color: #9aa0a6; }
    .vd-toc a:hover { color: #b9a8ff; }
    .vd-copy { background: #1c1e24; border-color: #2b2e36; color: #9aa0a6; }
    .vd-copy:hover { color: #b9a8ff; border-color: #b9a8ff; }
    .vd-alert-info { background: #1a2040; color: #aab8ff; }
    .vd-content .vd-button-secondary { background: #1c1c20; color: #fff; border-color: #fff; }
    .vd-content .vd-button-secondary:hover { background: #fff; color: #131316; }
    .vd-alert { background: #201c30; }
    .vd-alert-warning { background: #2a2417; }
    .vd-alert-danger { background: #2a1a1b; }
    .vd-alert-success { background: #18271b; }
    .vd-collapse { border-color: #2b2e36; }
    .vd-badge-v { background: #2b2540; color: #b9a8ff; }
    .vd-sidebar { border-color: #2b2e36; }
    .vd-tree-link { color: #e3e5e8; }
    .vd-tree-link:hover { background: #2b2540; color: #b9a8ff; }
    .vd-tree-active { background: #2b2540; color: #b9a8ff; }
    .vd-tree-list .vd-tree-list { border-color: #2b2e36; }
    .vd-sidebar-toggle { color: #e3e5e8; }
}
`

// Tiny self-contained menu script (no framework, no build). Section dropdowns
// are click-to-toggle on every device — matching the real header's Bootstrap
// dropdowns and behaving identically on mouse, keyboard (Enter on the button)
// and touch; the hamburger collapses the whole nav into a drawer on mobile.
// Kept inline so the standalone page stays a single request with no asset graph.
const NAV_SCRIPT = `(function(){
var burger=document.querySelector('.vd-burger'),drawer=document.getElementById('vd-drawer');
if(burger&&drawer){burger.addEventListener('click',function(){var o=drawer.classList.toggle('vd-open');burger.setAttribute('aria-expanded',o?'true':'false');});}
var items=document.querySelectorAll('.vd-nav-item');
items.forEach(function(it){var b=it.querySelector('.vd-nav-toggle');if(!b)return;
b.addEventListener('click',function(){var o=it.classList.toggle('vd-open');b.setAttribute('aria-expanded',o?'true':'false');
items.forEach(function(x){if(x!==it){x.classList.remove('vd-open');var xb=x.querySelector('.vd-nav-toggle');if(xb)xb.setAttribute('aria-expanded','false');}});});});
document.addEventListener('click',function(e){if(!e.target.closest('.vd-nav-item'))items.forEach(function(x){x.classList.remove('vd-open');var xb=x.querySelector('.vd-nav-toggle');if(xb)xb.setAttribute('aria-expanded','false');});});
})();`

// Sidebar behaviour, also framework-free: the mobile toggle reveals the tree
// (collapsed by default to keep the small-screen header tidy), and on load the
// active link is scrolled into the centre of the sidebar's OWN scroll area
// (never the window) so deep pages don't open with their entry off-screen. The
// tree's collapsible sections are native <details> with their ancestors opened
// server-side, so they work with JS disabled too.
const SIDEBAR_SCRIPT = `(function(){
var sb=document.getElementById('vd-sidebar');
if(!sb)return;
var t=sb.querySelector('.vd-sidebar-toggle');
if(t){t.addEventListener('click',function(){var o=sb.classList.toggle('vd-open');t.setAttribute('aria-expanded',o?'true':'false');});}
var a=sb.querySelector('.vd-tree-active');
if(a&&sb.scrollHeight>sb.clientHeight){var r=a.getBoundingClientRect(),sr=sb.getBoundingClientRect();sb.scrollTop+=(r.top-sr.top)-sb.clientHeight/2+a.offsetHeight/2;}
})();`

// Copy buttons are injected at runtime (needs the clipboard API anyway), so the
// serialized HTML stays plain and clipboard-less contexts get no dead button.
const COPY_SCRIPT = `(function(){
if(!navigator.clipboard)return;
document.querySelectorAll('.vd-content pre').forEach(function(p){
var b=document.createElement('button');b.type='button';b.className='vd-copy';b.textContent='Copy';
b.addEventListener('click',function(){var c=p.querySelector('code');navigator.clipboard.writeText(c?c.innerText:p.innerText).then(function(){b.textContent='Copied!';setTimeout(function(){b.textContent='Copy';},1500);});});
p.appendChild(b);});
})();`

export interface VersionedDocInput {
    version: string
    /** path after the version, no leading slash, e.g. "tutorial/inputs" */
    path: string
    markdown: string
    versions: DocVersion[]
    /** flat children map for the nav sidebar; omit/{} renders sidebar-less */
    children?: DocChildren
    /** API base for versioned asset URLs (injected; defaulted for tests) */
    apiUrl?: string
}

/** Render a versioned doc page to a full standalone HTML document. */
export async function renderVersionedDocHtml({
    version,
    path,
    markdown,
    versions,
    children = {},
    apiUrl = "https://api.kestra.io/v1",
}: VersionedDocInput): Promise<string> {
    const title = frontmatterField(markdown, "title") ?? "Documentation"
    const h1 = frontmatterField(markdown, "h1") ?? title
    const description = frontmatterField(markdown, "description")

    const parse = await getParser()
    // The parser strips frontmatter and parses the MDC body (both "::" and
    // ":::" dialects, plus `:prop='json'` props) into a hast-like tree we
    // serialize ourselves — no Vue runtime, no "::"/component-name leak.
    const { body } = await parse(markdown)
    transformTree(body as MdcNode, {
        apiUrl,
        version,
        baseDir: docLinkBaseDir(path, children),
        children,
        slugCounts: new Map(),
    })
    trimTrailingResidue(body as MdcNode)
    const pageKey = currentDocKey(path)
    const ctx: RenderCtx = { version, apiUrl, children, pageKey }
    const bodyHtml = serialize(body as MdcNode, ctx)
    const headings: { id: string; text: string; level: number }[] = []
    collectHeadings(body as MdcNode, headings)

    const sidebar = sidebarHtml(version, children, path)
    const toc = tocHtml(headings)
    const article = `<main class="vd-content">
${breadcrumbHtml(version, path, children)}<h1>${escapeHtml(h1)}</h1>
${bodyHtml}
${prevNextHtml(version, children, pageKey)}
</main>`
    // With a sidebar or TOC, lay them out beside the content; without either
    // (children empty or the endpoint failed, few headings) keep the single
    // centred content column.
    const main =
        sidebar || toc
            ? `<div class="vd-layout">
${sidebar}
${article}
${toc}
</div>`
            : article

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} | Kestra ${escapeHtml(version)} docs</title>
${description ? `<meta name="description" content="${escapeHtml(description)}">` : ""}
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap">
<style>${STYLES}</style>
</head>
<body>
<header class="vd-bar">
<a class="vd-logo" href="/" aria-label="Kestra">
<span class="vd-logo-light">${logoLight}</span>
<span class="vd-logo-dark">${logoDark}</span>
</a>
<div class="vd-drawer" id="vd-drawer">
<nav class="vd-links">
${navHtml()}
</nav>
<span class="vd-spacer"></span>
<a class="vd-cta vd-cta-secondary" href="/demo">Contact Sales</a>
<a class="vd-cta" href="/get-started">Get Started</a>
</div>
<label for="vd-version">Version</label>
<select id="vd-version" onchange="if(this.value)location.href=this.value">
${versionOptions(versions, version, path)}
</select>
<button type="button" class="vd-burger" aria-label="Toggle navigation" aria-controls="vd-drawer" aria-expanded="false"><span></span><span></span><span></span></button>
</header>
${main}
<script>${NAV_SCRIPT}${SIDEBAR_SCRIPT}${COPY_SCRIPT}</script>
</body>
</html>`
}
