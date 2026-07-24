// Helpers for the versioned documentation routing (kestra.io/docs/{major.minor}/...).
// Versioned doc pages are fetched at request time from api.kestra.io; the latest
// docs keep being served by Astro's static content collection.

// Matches a versioned docs URL: /docs/{major.minor}(/rest...)?
export const VERSIONED_DOCS_PATH = /^\/docs\/(\d+\.\d+)(\/.*)?$/

export interface DocVersion {
    /** "1.3" */
    label: string
    major: number
    minor: number
}

/**
 * API URL (relative to API_URL) for a versioned doc page.
 * Patch is always ".0".
 * path "" (home) -> /docs/docs/versions/{ver}.0
 * path "tutorial/inputs" -> /docs/docs/tutorial/inputs/versions/{ver}.0
 */
export function apiDocPath(version: string, path: string): string {
    const cleaned = path.replace(/^\/+|\/+$/g, "")
    const base = cleaned ? `docs/docs/${cleaned}` : "docs/docs"
    return `/${base}/versions/${version}.0`
}

/**
 * True for an asset reference we should re-point at the versioned asset API: a
 * root-absolute path ending in a file extension (e.g. "/docs/tutorial/x.png",
 * "/autocompletion.gif"). The whole doc corpus authors assets this way — there
 * are no "./"/"../" relative refs — so a relative ref (which we'd need the page's
 * own path to resolve, like the in-app ProseImg's "/./" substitution) is left
 * untouched: it renders no worse than today and never occurs in practice.
 * External (http(s)/protocol-relative/data/mailto/tel) and anchor refs are also
 * left alone, so an external <iframe src> or //cdn asset is never rewritten.
 */
export function isVersionedAssetRef(src: string): boolean {
    if (!src || !src.startsWith("/") || src.startsWith("//")) return false
    return /\.[a-z0-9]+$/i.test(src.split(/[?#]/)[0])
}

/**
 * Versioned asset URL, mirroring the Kestra in-app doc store's resourceUrl: the
 * "/docs" controller domain is prepended to the raw (root-absolute) ref, then
 * "/versions/{ver}.0". So "/docs/tutorial/x.png" -> {api}/docs/docs/tutorial/x.png
 * /versions/{ver}.0 (the doubled "docs"), while a bare "/autocompletion.gif" ->
 * {api}/docs/autocompletion.gif/versions/{ver}.0 (single "docs"). This is NOT
 * apiDocPath, which always doubles "docs" and so 500s on the root-asset form.
 */
export function versionedAssetUrl(
    apiUrl: string,
    version: string,
    src: string,
): string {
    return `${apiUrl}/docs${src}/versions/${version}.0`
}

/**
 * True for an in-content href that should be resolved against the versioned
 * docs tree: a relative path ("./x.md", "../y/z.md", "plugins/a.md"). Absolute
 * paths, anchors and anything with a scheme (http:, mailto:, data:) are left
 * alone.
 */
export function isRelativeDocHref(href: string): boolean {
    if (!href || href.startsWith("/") || href.startsWith("#")) return false
    return !/^[a-z][a-z0-9+.-]*:/i.test(href)
}

/**
 * The directory the page's own markdown lives in, which relative links resolve
 * against. A page that has children in the flat map is a directory index
 * (docs/06.tutorial/index.md) so its links resolve inside itself; a leaf page
 * (docs/06.tutorial/05.outputs.md) resolves against its parent. The version
 * home ("") is docs/index.md -> "".
 */
export function docLinkBaseDir(path: string, children: DocChildren): string {
    const cleaned = path.replace(/^\/+|\/+$/g, "")
    if (!cleaned) return ""
    const prefix = `docs/${cleaned}/`
    if (Object.keys(children).some((k) => k.startsWith(prefix))) return cleaned
    const slash = cleaned.lastIndexOf("/")
    return slash === -1 ? "" : cleaned.slice(0, slash)
}

/**
 * Rewrite a relative in-content link to its versioned pretty URL. Old markdown
 * links to the SOURCE files ("../07.architecture/09.internal-storage.md"),
 * whose "NN." ordering prefixes and ".md" extension never appear in routes —
 * left verbatim, every such link 302s back to the version home. So: resolve
 * against the page's own directory, dropping ordering prefixes, ".md" and
 * "index" segments, and re-root under /docs/{version} (like the live site's
 * link handling, but keeping the reader inside the version).
 */
export function resolveVersionedDocLink(
    version: string,
    baseDir: string,
    href: string,
): string {
    const cut = href.search(/[?#]/)
    const path = cut === -1 ? href : href.slice(0, cut)
    const suffix = cut === -1 ? "" : href.slice(cut)
    const parts: string[] = baseDir ? baseDir.split("/") : []
    for (const raw of path.split("/")) {
        if (raw === "" || raw === ".") continue
        if (raw === "..") {
            parts.pop()
            continue
        }
        const seg = raw.replace(/^\d+\./, "").replace(/\.md$/i, "")
        if (seg === "index") continue
        parts.push(seg)
    }
    const rel = parts.join("/")
    return (rel ? `/docs/${version}/${rel}` : `/docs/${version}`) + suffix
}

/**
 * Parse the raw /v1/versions payload into deduped MAJOR.MINOR doc versions,
 * keeping only >= 0.19 (versions before that have no versioned docs), sorted
 * newest first. Integer compare on major/minor (NOT parseFloat — 0.2 < 0.19).
 */
export function docVersions(versions: { version: string }[]): DocVersion[] {
    const seen = new Map<string, DocVersion>()
    for (const { version } of versions) {
        const m = /^(\d+)\.(\d+)/.exec(version)
        if (!m) continue
        const major = Number(m[1])
        const minor = Number(m[2])
        if (!(major > 0 || (major === 0 && minor >= 19))) continue
        const label = `${major}.${minor}`
        if (!seen.has(label)) seen.set(label, { label, major, minor })
    }
    return [...seen.values()].sort((a, b) =>
        b.major !== a.major ? b.major - a.major : b.minor - a.minor,
    )
}

/**
 * Target URL when switching to `version` from a latest-docs page at `pathname`.
 * Drops the "/docs" prefix and re-roots under the version, e.g.
 * ("1.3", "/docs/tutorial/inputs") -> "/docs/1.3/tutorial/inputs".
 */
export function versionedHref(version: string, pathname: string): string {
    const path = pathname.replace(/^\/docs\/?/, "")
    return path ? `/docs/${version}/${path}` : `/docs/${version}`
}

export interface VersionOption {
    /** target URL, e.g. "/docs/1.3/tutorial/inputs" or "/docs/tutorial/inputs" */
    value: string
    /** "Latest" or "1.3" */
    label: string
    selected: boolean
}

/**
 * Options for the version <select>. The newest version IS the latest docs, so
 * it's folded into a single "Latest (X)" entry pointing at /docs (the static
 * site) rather than appearing twice; the remaining MAJOR.MINOR versions follow,
 * pointing at the same `path` under that version. `current` is the version of
 * the page being viewed, or null on a latest-docs page (Latest selected).
 */
export function versionSelectOptions(
    versions: DocVersion[],
    current: string | null,
    path: string,
): VersionOption[] {
    const suffix = path ? `/${path}` : ""
    const latest = versions[0]
    const options: VersionOption[] = [
        {
            value: `/docs${suffix}`,
            label: latest ? `Latest (${latest.label})` : "Latest",
            selected: !current || current === latest?.label,
        },
    ]
    for (const v of versions.slice(1)) {
        options.push({
            value: `/docs/${v.label}${suffix}`,
            label: v.label,
            selected: v.label === current,
        })
    }
    return options
}

/** Extract a frontmatter field via /^key: value$/m, unwrapping YAML quotes. */
export function frontmatterField(markdown: string, key: string): string | undefined {
    const raw = new RegExp(`^${key}: (.*)$`, "m").exec(markdown)?.[1]?.trim()
    return raw?.replace(/^(['"])(.*)\1$/, "$2")
}

/** Strip a leading ---...--- frontmatter block, returning the body only. */
export function stripFrontmatter(markdown: string): string {
    return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")
}

// The homepage markdown carries its CTA links in a bespoke MDC component whose
// `:buttons` (Vue bind shorthand) is INVALID remark-directive attribute syntax,
// so it never parses as a directive and leaks as literal text. We extract the
// JSON payload ourselves and render it as a plain link row instead.
export const HOMEPAGE_BUTTONS_RE =
    /^:::HomePageButtons\{[^\n]*?:buttons='([\s\S]*?)'\s*\}[ \t]*\n(?:[ \t]*\n)*:::[ \t]*$/m

export interface HomePageButton {
    label: string
    href: string
}

/** Parse the `:buttons='[...]'` JSON from a :::HomePageButtons block, or null. */
export function parseHomePageButtons(markdown: string): HomePageButton[] | null {
    const m = markdown.match(HOMEPAGE_BUTTONS_RE)
    if (!m) return null
    try {
        return JSON.parse(m[1])
    } catch {
        return null
    }
}

// Primary site navigation for the standalone versioned page's navbar. Mirrors
// the link text + hrefs of `src/utils/menu-items.ts` (the real Header.vue's
// data), dropping the Vue icon components — importing that module would pull 28
// `.vue` icons into this JS-less Worker page. Kept in sync manually; structure
// follows the real header (Product / Solutions / Plugins / Learn / Company /
// Pricing). Groups with `columns` render as a click-to-toggle dropdown
// (collapsed into the hamburger drawer on mobile); groups with a bare `href`
// are plain top-level links.
export interface NavLink {
    label: string
    href: string
}
export interface NavColumn {
    heading?: string
    links: NavLink[]
}
export interface NavGroup {
    label: string
    href?: string
    columns?: NavColumn[]
}

export const NAV: NavGroup[] = [
    {
        label: "Product",
        columns: [
            {
                links: [
                    { label: "Core Features", href: "/features" },
                    { label: "Enterprise Edition", href: "/enterprise" },
                    { label: "Cloud Edition", href: "/cloud" },
                    { label: "Platform Overview", href: "/overview" },
                ],
            },
        ],
    },
    {
        label: "Solutions",
        columns: [
            {
                heading: "Use-cases",
                links: [
                    { label: "Data Workflow", href: "/data" },
                    { label: "Infrastructure Automation", href: "/infra-automation" },
                    { label: "AI Workflows", href: "/ai-automation" },
                ],
            },
            {
                heading: "Users",
                links: [
                    { label: "Data Engineers", href: "/use-cases/data-engineers" },
                    { label: "Software Engineers", href: "/use-cases/software-engineers" },
                    { label: "Platform Engineers", href: "/use-cases/platform-engineers" },
                ],
            },
            {
                heading: "Industries",
                links: [
                    { label: "Finance", href: "/use-cases/financial-services" },
                    { label: "Automotive", href: "/use-cases/automotive" },
                    { label: "Retail", href: "/use-cases/retail" },
                    { label: "Healthcare", href: "/use-cases/healthcare" },
                    { label: "Public Services", href: "/use-cases/public-services" },
                    { label: "Software & Services", href: "/use-cases/software-providers" },
                ],
            },
        ],
    },
    { label: "Plugins", href: "/plugins" },
    {
        label: "Learn",
        columns: [
            {
                links: [
                    { label: "Docs", href: "/docs" },
                    { label: "Integrations", href: "/orchestration" },
                    { label: "Blueprints", href: "/blueprints" },
                    { label: "Blog", href: "/blogs" },
                    { label: "Customer Stories", href: "/use-cases/stories" },
                    { label: "Courses", href: "https://academy.kestra.io" },
                ],
            },
        ],
    },
    {
        label: "Company",
        columns: [
            {
                links: [
                    { label: "About Us", href: "/about-us" },
                    { label: "Careers", href: "/careers" },
                    { label: "Partners", href: "/partners" },
                    { label: "Contact us", href: "/contact-us" },
                ],
            },
        ],
    },
    { label: "Pricing", href: "/pricing" },
]

// ---------------------------------------------------------------------------
// Documentation navigation tree (the versioned page's left sidebar).
//
// The /docs/docs/versions/{ver}.0/children endpoint returns a FLAT map keyed by
// full path ("docs", "docs/getting-started", "docs/getting-started/quickstart"),
// already sorted in navigation order. We rebuild the hierarchy from the path
// segments. This is the RAW path hierarchy — unlike the latest-docs sidebar,
// which groups pages into a handful of curated, hardcoded sections.
// ---------------------------------------------------------------------------
export interface DocChildMeta {
    title: string
    // Pages flagged hideSidebar (brand-assets, why-kestra) are omitted from the
    // tree, mirroring the latest-docs sidebar (RecursiveNavSidebar.vue).
    hideSidebar?: boolean
    /** short markdown-flavored summary, feeds the ChildCard grids */
    description?: string
    /** root-absolute icon ref ("/docs/icons/x.svg"), versioned like any asset */
    icon?: string
}
/** Flat children-endpoint payload, keyed by full path ("docs", "docs/x", ...). */
export type DocChildren = Record<string, DocChildMeta>

export interface DocTreeNode {
    /** full key, e.g. "docs/getting-started" */
    path: string
    title: string
    children: DocTreeNode[]
}

const humanizeSegment = (key: string): string =>
    (key.split("/").pop() ?? key)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())

/**
 * Rebuild the navigation tree from the flat, nav-ordered children map. Parents
 * are created LAZILY: the endpoint sometimes lists a child before its parent (15
 * such cases in 0.19), so a node may first appear as a placeholder (humanized
 * title) when referenced as a parent, then get its real title when its own entry
 * is reached. Each node is attached to its parent exactly once — when its OWN key
 * is processed — so per-parent child order follows the global nav order, and no
 * node is double-added regardless of input ordering.
 *
 * Relies on the parent-prefix invariant: every non-root key's parent prefix is
 * itself a key (verified across all served versions — 0.19/0.20/0.22/1.0 — with
 * 0 violations). If it ever breaks, an intermediate created only as a lazy parent
 * (never seen as its own key) is never pushed to roots, so its whole subtree is
 * silently dropped from the sidebar — acceptable while the invariant holds.
 *
 * Pages flagged hideSidebar (and their subtree) are dropped, matching the
 * latest-docs sidebar; in served data these are always leaves.
 */
export function buildDocTree(children: DocChildren): DocTreeNode[] {
    const hidden = Object.entries(children)
        .filter(([, meta]) => meta?.hideSidebar)
        .map(([key]) => key)
    const isHidden = (key: string): boolean =>
        hidden.some((h) => key === h || key.startsWith(`${h}/`))
    const nodes = new Map<string, DocTreeNode>()
    const roots: DocTreeNode[] = []
    const getOrCreate = (key: string): DocTreeNode => {
        let node = nodes.get(key)
        if (!node) {
            node = { path: key, title: humanizeSegment(key), children: [] }
            nodes.set(key, node)
        }
        return node
    }
    for (const [key, meta] of Object.entries(children)) {
        if (isHidden(key)) continue
        const node = getOrCreate(key)
        if (meta?.title) node.title = meta.title
        const slash = key.lastIndexOf("/")
        if (slash === -1) {
            roots.push(node)
        } else {
            getOrCreate(key.slice(0, slash)).children.push(node)
        }
    }
    return roots
}

/**
 * Direct (one-segment-deeper) children of a node in the flat map, in nav
 * order, skipping hideSidebar pages — the data behind the ChildCard grids.
 */
export function directDocChildren(
    children: DocChildren,
    parentKey: string,
): { key: string; meta: DocChildMeta }[] {
    const prefix = `${parentKey}/`
    return Object.entries(children)
        .filter(
            ([key, meta]) =>
                key.startsWith(prefix) &&
                !key.slice(prefix.length).includes("/") &&
                !meta?.hideSidebar,
        )
        .map(([key, meta]) => ({ key, meta }))
}

/**
 * Previous/next page around `currentKey` in the flat map's nav order (the map
 * is depth-first nav-ordered, so adjacency IS the reading order), skipping
 * hideSidebar pages like the sidebar does.
 */
export function prevNextDocs(
    children: DocChildren,
    currentKey: string,
): { prev?: { key: string; title: string }; next?: { key: string; title: string } } {
    const entries = Object.entries(children).filter(([, m]) => !m?.hideSidebar)
    const idx = entries.findIndex(([k]) => k === currentKey)
    if (idx === -1) return {}
    const at = (i: number) => {
        const e = entries[i]
        return e ? { key: e[0], title: e[1]?.title ?? e[0] } : undefined
    }
    return { prev: at(idx - 1), next: at(idx + 1) }
}

/**
 * Children descriptions are markdown-flavored ("Follow the [Quickstart
 * Guide](./01.quickstart.md)…"); cards want plain text, so unwrap links and
 * strip inline markers.
 */
export function plainDocText(md: string): string {
    return md
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[`*_]/g, "")
        .trim()
}

/** Versioned URL for a children key. "docs" -> /docs/{v}; "docs/x" -> /docs/{v}/x. */
export function docChildHref(version: string, key: string): string {
    const rel = key.replace(/^docs(?:\/|$)/, "")
    return rel ? `/docs/${version}/${rel}` : `/docs/${version}`
}

/** The children key for the page currently being viewed (path after the version). */
export function currentDocKey(path: string): string {
    const cleaned = path.replace(/^\/+|\/+$/g, "")
    return cleaned ? `docs/${cleaned}` : "docs"
}

// Bespoke MDC components from the latest build (HomePageHeader, WhatsNew,
// BigChildCards, SupportLinks, ...) have no markdown renderer here. Their
// empty-bodied `:::Name{...}\n:::` blocks otherwise emit stray empty <div>s (or
// leak, if they carry `:bind` attrs). Drop them. Blocks WITH a body — alert,
// collapse, relic containers — are left for remark-directive to render; the
// regex only matches an opening line followed by (blank lines then) the close.
export function stripUnsupportedMdc(markdown: string): string {
    return markdown.replace(
        /^:::[A-Za-z][\w-]*[^\n]*\n(?:[ \t]*\n)*:::[ \t]*$/gm,
        "",
    )
}
