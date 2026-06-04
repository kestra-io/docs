import { createMarkdownProcessor } from "@astrojs/markdown-remark"
import remarkDirective from "remark-directive"
import {
    frontmatterField,
    parseHomePageButtons,
    stripFrontmatter,
    stripUnsupportedMdc,
    versionSelectOptions,
    HOMEPAGE_BUTTONS_RE,
    NAV,
    type DocVersion,
    type HomePageButton,
} from "~/utils/versionedDocs"
import { editionLabelAndColorByPrefix } from "~/utils/badgeMaps.mjs"
// Inlined like the real Header.vue (logo-light/logo-dark): the standalone page
// has no bootstrap/JS, so dark mode is keyed off prefers-color-scheme instead.
import logoLight from "~/assets/logo-black.svg?raw"
import logoDark from "~/assets/logo-white.svg?raw"

// Minimal mdast node shape for the directive nodes remark-directive emits and
// the hast-override children we build (type + data.hName/hProperties).
interface MdcNode {
    type: string
    name?: string
    attributes?: Record<string, string>
    data?: { hName?: string; hProperties?: Record<string, unknown> }
    children?: MdcNode[]
    value?: string
}

const hastEl = (
    hName: string,
    cls: string,
    children: MdcNode[],
): MdcNode => ({
    type: "element",
    data: { hName, hProperties: cls ? { class: cls } : {} },
    children,
})
const hastText = (value: string): MdcNode => ({ type: "text", value })

// Style the known MDC components by setting hast overrides on their directive
// nodes — the same mechanism remark-custom-elements uses, but scoped to this
// page: no bootstrap classes (only our self-contained vd-* classes) and no
// throwing (a badge with no attributes just renders nothing). Unknown/relic
// directives are left untouched so mdast-util-to-hast's default handler renders
// them as a plain <div> with content preserved (no "::" leak).
function styleDirective(node: MdcNode): void {
    const name = (node.name ?? "").toLowerCase()
    const attrs = node.attributes ?? {}
    const data = node.data ?? (node.data = {})
    if (name === "alert") {
        data.hName = "div"
        data.hProperties = { class: `vd-alert vd-alert-${attrs.type ?? "info"}` }
    } else if (name === "collapse") {
        data.hName = "details"
        data.hProperties = { class: "vd-collapse" }
        node.children = [
            hastEl("summary", "", [hastText(attrs.title ?? "Details")]),
            ...(node.children ?? []),
        ]
    } else if (name === "badge") {
        const pills: MdcNode[] = []
        if (attrs.version) {
            pills.push(hastEl("span", "vd-badge-v", [hastText(attrs.version)]))
        }
        for (const e of (attrs.editions ?? "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)) {
            const label = editionLabelAndColorByPrefix[e]?.label ?? e
            pills.push(hastEl("span", "vd-badge-v", [hastText(label)]))
        }
        data.hName = "div"
        data.hProperties = { class: "vd-badge" }
        node.children = pills.length
            ? [hastEl("span", "vd-badge-k", [hastText("Available on:")]), ...pills]
            : []
    }
}

function remarkVersionedDocComponents() {
    return (tree: MdcNode) => {
        const walk = (node: MdcNode) => {
            if (
                node.type === "containerDirective" ||
                node.type === "leafDirective" ||
                node.type === "textDirective"
            ) {
                styleDirective(node)
                // An inline (text) directive we don't style — e.g. :PluginCount,
                // an island with no SSR equivalent here — must stay inline so it
                // doesn't split the surrounding paragraph into <p>…</p><div></div>.
                if (node.type === "textDirective" && !node.data?.hName) {
                    ;(node.data ??= {}).hName = "span"
                }
            }
            node.children?.forEach(walk)
        }
        walk(tree)
    }
}

// createMarkdownProcessor is expensive to build; reuse one instance.
// Syntax highlighting (shiki) themes aren't bundled for the Worker runtime,
// so it's disabled — code blocks render as plain <pre><code>.
//
// remark-directive parses MDC "::" blocks (e.g. ::alert) into directive nodes;
// remarkVersionedDocComponents then styles the known components (alert/collapse/
// badge) and leaves everything else for mdast-util-to-hast's default <div>
// handler, mirroring how the Kestra UI's MDC renderer styles known components
// and falls back gracefully on unknown/relic ones — without leaking "::" text.
let processorPromise: ReturnType<typeof createMarkdownProcessor> | null = null
function getProcessor() {
    if (!processorPromise) {
        processorPromise = createMarkdownProcessor({
            syntaxHighlight: false,
            remarkPlugins: [remarkDirective, remarkVersionedDocComponents],
        })
    }
    return processorPromise
}

const escapeHtml = (s: string) =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")

/** Render the homepage CTA buttons as a row of styled links. */
const buttonRowHtml = (buttons: HomePageButton[]): string =>
    `<div class="vd-buttons">${buttons
        .map(
            (b) =>
                `<a class="vd-button" href="${escapeHtml(b.href)}">${escapeHtml(b.label)}</a>`,
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

const STYLES = `
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    line-height: 1.7; color: #1c1e21; background: #fff; }
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
.vd-buttons { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1.5rem 0 2rem; }
.vd-button { display: inline-block; background: #7e3fef; color: #fff; text-decoration: none;
    font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 0.5rem; }
.vd-button:hover { background: #6b2fd6; }
.vd-content { max-width: 880px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
.vd-content h1 { font-size: 2.25rem; line-height: 1.2; margin: 0 0 1.5rem; }
.vd-content h2 { margin-top: 2.5rem; border-bottom: 1px solid #e3e5e8; padding-bottom: 0.3rem; }
.vd-content pre { background: #f5f5f7; padding: 1rem; border-radius: 0.5rem; overflow: auto; }
.vd-content code { background: #f0eefe; padding: 0.1em 0.35em; border-radius: 0.25rem;
    font-size: 0.9em; }
.vd-content pre code { background: none; padding: 0; }
.vd-content a { color: #7e3fef; }
.vd-content img { max-width: 100%; height: auto; }
.vd-content table { border-collapse: collapse; width: 100%; }
.vd-content th, .vd-content td { border: 1px solid #e3e5e8; padding: 0.5rem 0.75rem; }
.video-container { position: relative; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; }
.video-container iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.vd-alert { margin: 1.5rem 0; padding: 0.75rem 1rem; border-left: 4px solid #7e3fef;
    border-radius: 0.25rem; background: #f6f3ff; }
.vd-alert > :first-child { margin-top: 0; }
.vd-alert > :last-child { margin-bottom: 0; }
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
    .vd-content h2 { border-color: #2b2e36; }
    .vd-content pre { background: #1c1e24; }
    .vd-content code { background: #2b2540; }
    .vd-content th, .vd-content td { border-color: #2b2e36; }
    .vd-alert { background: #201c30; }
    .vd-alert-warning { background: #2a2417; }
    .vd-alert-danger { background: #2a1a1b; }
    .vd-alert-success { background: #18271b; }
    .vd-collapse { border-color: #2b2e36; }
    .vd-badge-v { background: #2b2540; color: #b9a8ff; }
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

export interface VersionedDocInput {
    version: string
    /** path after the version, no leading slash, e.g. "tutorial/inputs" */
    path: string
    markdown: string
    versions: DocVersion[]
}

/** Render a versioned doc page to a full standalone HTML document. */
export async function renderVersionedDocHtml({
    version,
    path,
    markdown,
    versions,
}: VersionedDocInput): Promise<string> {
    const title = frontmatterField(markdown, "title") ?? "Documentation"
    const h1 = frontmatterField(markdown, "h1") ?? title
    const description = frontmatterField(markdown, "description")

    const processor = await getProcessor()
    let md = stripFrontmatter(markdown)
    // Render the homepage CTA buttons in place (their `:buttons` syntax leaks
    // otherwise), then drop the remaining empty bespoke MDC blocks.
    const buttons = parseHomePageButtons(md)
    if (buttons?.length) {
        md = md.replace(HOMEPAGE_BUTTONS_RE, () => buttonRowHtml(buttons))
    }
    md = stripUnsupportedMdc(md)
    const { code: body } = await processor.render(md)

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} | Kestra ${escapeHtml(version)} docs</title>
${description ? `<meta name="description" content="${escapeHtml(description)}">` : ""}
<meta name="robots" content="noindex">
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
<main class="vd-content">
<h1>${escapeHtml(h1)}</h1>
${body}
</main>
<script>${NAV_SCRIPT}</script>
</body>
</html>`
}
