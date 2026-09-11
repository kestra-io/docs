// Cache keys for `experimental.incrementalBuild`. A page is only restored from
// the previous build while every build-time input it renders is unchanged.

type KeyedEntry = {
    id: string
    filePath?: string
    digest?: string | number
    data: unknown
}

/** Two FNV-1a passes with different primes, concatenated as a 64-bit hex digest. */
export function hashString(value: string): string {
    let a = 0x811c9dc5
    let b = 0xc2b2ae35
    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i)
        a = Math.imul(a ^ code, 0x01000193) >>> 0
        b = Math.imul(b ^ code, 0x85ebca6b) >>> 0
    }
    return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0")
}

/** Digest of every entry's metadata, covering what siblings contribute to a page
 * (sidebar, prev/next, child cards, related lists). */
export function collectionMetadataDigest(entries: readonly KeyedEntry[]): string {
    const metadata = entries
        .map((entry) => JSON.stringify([entry.id, entry.filePath ?? "", entry.data]))
        .sort()
    return hashString(metadata.join("\n"))
}

/** Digest of every entry's metadata and body, for pages that render sibling
 * content rather than only sibling frontmatter. */
export function collectionContentDigest(entries: readonly KeyedEntry[]): string {
    const contents = entries
        .map((entry) => JSON.stringify([entry.id, entry.digest ?? "", entry.data]))
        .sort()
    return hashString(contents.join("\n"))
}

/** Digest of a set of file contents keyed by path, order-independent so glob
 * iteration order doesn't matter. */
export function fileContentsDigest(files: Record<string, string>): string {
    const content = Object.keys(files)
        .sort()
        .map((path) => JSON.stringify([path, files[path]]))
        .join("\n")
    return hashString(content)
}

// A scss partial reached via `@use`/`@import` isn't a rollup module, so
// Astro's own module-graph-based cache invalidation can't see it change.
export const scssModules = import.meta.glob("~/**/*.scss", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>

if (Object.keys(scssModules).length === 0) {
    throw new Error(
        'layoutDigest: glob "~/**/*.scss" matched no files — shared style changes would silently stop invalidating the cache',
    )
}

/** Build-time inputs the shared layout bakes into every page from outside the
 * module graph: the latest docs version, fetched from the API, and the
 * shared stylesheets every cached route's chrome is built from. */
export async function layoutDigest(): Promise<string> {
    const { getDocsLatestVersion } = await import("~/utils/docVersionsFetch")
    return `l${(await getDocsLatestVersion()) ?? "unknown"}|${fileContentsDigest(scssModules)}`
}

/** Key for one entry, or undefined when the loader reports no digest, which
 * leaves the page out of the cache instead of guessing. */
export function entryCacheKey(
    entry: KeyedEntry,
    ...scope: string[]
): string | undefined {
    return entry.digest === undefined ? undefined : [entry.digest, ...scope].join("|")
}
