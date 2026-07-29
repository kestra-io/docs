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

/** Where a failed/missing versioned sub-page degrades to: that version's home. */
export function versionHomeHref(version: string): string {
    return `/docs/${version}`
}

/**
 * True for a doc path that is asset-shaped (stale hotlink/crawler URL like
 * "1.2/x.png"), never a real page: apiDocPath deterministically 500s on these
 * (it always doubles "docs", unlike versionedAssetUrl), so they must be
 * treated as missing rather than fetched. Requires a letter in the extension —
 * migration-guide pages named like "0.19.0" end in digits and are real pages.
 */
export function isAssetShapedDocPath(path: string): boolean {
    return /\.(?=[a-z0-9]*[a-z])[a-z0-9]{2,5}$/i.test(path)
}

export type VersionedRouteDecision =
    | { kind: "pass" }
    | { kind: "unavailable" }
    | { kind: "redirect"; location: string }
    | { kind: "fetch" }

/**
 * Pre-fetch routing decision for a matched /docs/{version}/... URL, pure so
 * the middleware's branches are unit-testable:
 * - unknown version → "pass" (natural 404), except when the version list
 *   itself is unavailable (fetch failed, nothing stale) → "unavailable" (503),
 *   so an API outage isn't misreported as a missing page;
 * - the NEWEST version → "redirect" to the canonical latest page: it IS the
 *   latest docs, and the selector folds it into the already-selected "Latest"
 *   option, leaving no way off a degraded duplicate. Assumes the API's newest
 *   release has shipped its site pages (a pre-release in /versions, or an
 *   API-only page, would redirect onto latest content early/to a 404 — same
 *   assumption versionSelectOptions already makes for the dropdown);
 * - any other known version → "fetch" (serve the archived copy).
 */
export function decideVersionedRoute(input: {
    version: string
    path: string
    isMarkdownRequest: boolean
    /** URL query string incl. "?", or "" — preserved on redirects */
    search: string
    versions: DocVersion[]
    versionsOk: boolean
}): VersionedRouteDecision {
    const { version, path, isMarkdownRequest, search, versions, versionsOk } = input
    if (!versions.some((v) => v.label === version)) {
        if (!versionsOk && !versions.length) return { kind: "unavailable" }
        return { kind: "pass" }
    }
    if (version === versions[0]?.label) {
        const bare = path ? `/docs/${path}` : "/docs"
        return { kind: "redirect", location: `${isMarkdownRequest ? `${bare}.md` : bare}${search}` }
    }
    return { kind: "fetch" }
}

/**
 * 302 target for a sub-page missing within a known version: that version's
 * own home — a deliberate soft-404 (unlike the plugins hard-404 policy) that
 * keeps the reader on their version, not latest. Honors the .md contract and
 * keeps the query string.
 */
export function missingDocFallbackHref(
    version: string,
    isMarkdownRequest: boolean,
    search: string,
): string {
    const home = versionHomeHref(version)
    return `${isMarkdownRequest ? `${home}.md` : home}${search}`
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
 * Target URL when switching to `version` (empty string = latest) from
 * `pathname`, which may itself be a latest-docs path or already versioned
 * (`/docs/{otherVersion}/...`). Re-roots the bare sub-path under the new
 * version, e.g. ("1.3", "/docs/1.2/tutorial/inputs") -> "/docs/1.3/tutorial/inputs".
 */
export function switchVersionHref(version: string, pathname: string): string {
    const match = VERSIONED_DOCS_PATH.exec(pathname)
    const bare = match
        ? (match[2] ?? "").replace(/^\/+/, "")
        : pathname.replace(/^\/docs\/?/, "")
    // Only ever a same-origin "/docs/..." path, never a scheme (e.g. "javascript:")
    // even from a tampered `version` value, since it must match "1.2"-style versions.
    if (!version || !/^\d+\.\d+$/.test(version)) return bare ? `/docs/${bare}` : "/docs"
    return bare ? `/docs/${version}/${bare}` : `/docs/${version}`
}

/**
 * switchVersionHref, plus a reachability probe when switching to Latest:
 * versioned targets are soft-handled by the middleware (missing page → 302 to
 * the version home), but a Latest target hits static routing and hard-404s
 * whenever the page was removed — precisely the likeliest divergence when
 * coming from an old version. (Renamed pages redirect and probe fine.) Only a
 * confirmed 404 falls back to the docs home; any other status or a probe
 * error still attempts the direct navigation, mirroring the middleware's
 * 404-vs-transient split.
 */
export async function resolveVersionSwitchHref(
    version: string,
    pathname: string,
    fetcher: typeof fetch = fetch,
): Promise<string> {
    const target = switchVersionHref(version, pathname)
    if (/^\/docs\/\d+\.\d+(\/|$)/.test(target) || target === "/docs") return target
    try {
        // Bounded: an unbounded hung probe would leave the select switched
        // while the page never navigates.
        const res = await fetcher(target, {
            method: "HEAD",
            signal: AbortSignal.timeout(1500),
        })
        if (res.status === 404) return "/docs"
    } catch {
        // fall through to the direct attempt
    }
    return target
}

export interface VersionOption {
    /** version label, or "" for Latest — the <option> value */
    version: string
    /** "Latest (X)" or "1.3" */
    label: string
    selected: boolean
}

/**
 * Options for the version <select>. The newest version IS the latest docs, so
 * it's folded into a single "Latest (X)" entry rather than appearing twice;
 * the remaining MAJOR.MINOR versions follow. `current` is the version of the
 * page being viewed, or null on a latest-docs page (Latest selected).
 */
export function versionSelectOptions(
    versions: DocVersion[],
    current: string | null,
): VersionOption[] {
    const latest = versions[0]
    const options: VersionOption[] = [
        {
            version: "",
            label: latest ? `Latest (${latest.label})` : "Latest",
            selected: !current || current === latest?.label,
        },
    ]
    for (const v of versions.slice(1)) {
        options.push({ version: v.label, label: v.label, selected: v.label === current })
    }
    return options
}

const FRONTMATTER_BLOCK_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

/**
 * Extract a frontmatter field via /^key: value$/m, unwrapping YAML quotes.
 * Matches only within the leading frontmatter block, not the whole document —
 * flow YAML samples in the body routinely have their own column-0 `key:`
 * lines (e.g. `description:` on a flow) that would otherwise be picked up.
 */
export function frontmatterField(markdown: string, key: string): string | undefined {
    const block = FRONTMATTER_BLOCK_RE.exec(markdown)?.[1] ?? ""
    const raw = new RegExp(`^${key}: (.*)$`, "m").exec(block)?.[1]?.trim()
    return raw?.replace(/^(['"])(.*)\1$/, "$2")
}

/** Strip a leading ---...--- frontmatter block, returning the body only. */
export function stripFrontmatter(markdown: string): string {
    return markdown.replace(FRONTMATTER_BLOCK_RE, "")
}

export interface HomePageButton {
    label: string
    href: string
}

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
    /** short label for the sidebar/breadcrumb, mirroring the latest docs' frontmatter field */
    sidebarTitle?: string
    /** true for a directory's own index page */
    isIndex?: boolean
}
/** Flat children-endpoint payload, keyed by full path ("docs", "docs/x", ...). */
export type DocChildren = Record<string, DocChildMeta>

/** Data the versionedDocs middleware hands off to the `docs-versioned` SSR page via `Astro.locals`. */
export interface VersionedDocLocals {
    version: string
    path: string
    markdown: string
    children: DocChildren
}

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

// Rebuild the nav tree from the flat map. Parents are created lazily (a
// placeholder gets its real title once its own key is processed) because the
// endpoint sometimes lists a child before its parent. Drops hideSidebar subtrees.
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
        // Prefer the short sidebarTitle (matches the curated section map's
        // titles and avoids wrapping long SEO titles), falling back to title
        // on older versions that don't return sidebarTitle at all.
        const label = meta?.sidebarTitle ?? meta?.title
        if (label) node.title = label
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
