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
