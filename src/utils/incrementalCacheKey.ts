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
    ...scope: (string | undefined)[]
): string | undefined {
    return entry.digest === undefined || scope.includes(undefined)
        ? undefined
        : [entry.digest, ...scope].join("|")
}

/** Canonical form of a payload, with object keys and array elements ordered, so
 * a digest tracks content rather than the order the API happened to return.
 * Lossy: reordering alone hashes the same, so don't key a page on an ordered
 * list through this. */
export function canonicalPayload(value: unknown): unknown {
    if (Array.isArray(value)) {
        // One stringify per element, rather than one per comparison.
        return value
            .map((item) => {
                const canonical = canonicalPayload(item)
                return [JSON.stringify(canonical), canonical] as const
            })
            .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
            .map(([, canonical]) => canonical)
    }
    if (value && typeof value === "object") {
        const source = value as Record<string, unknown>
        return Object.fromEntries(
            Object.keys(source)
                .sort()
                .map((key) => [key, canonicalPayload(source[key])]),
        )
    }
    return value
}

/** Digest of a set of remote payloads, or undefined when any of them can't be
 * read, which leaves the page uncached instead of keying it on a failure. */
async function remoteDigest(
    keys: readonly string[],
    load: (key: string) => Promise<unknown>,
): Promise<string | undefined> {
    try {
        // GETs are memoized per build, so these resolve to what the page renders.
        const payloads = await Promise.all(
            [...new Set(keys)]
                .sort()
                .map(async (key) =>
                    JSON.stringify([key, canonicalPayload(await load(key))]),
                ),
        )
        return hashString(payloads.join("\n"))
    } catch (error) {
        console.warn(`remoteDigest: leaving a page uncached, ${error}`)
        return undefined
    }
}

/** Digest of the Kestra API payloads a page bakes in, so a plugin or blueprint
 * release invalidates it. */
export async function apiPayloadDigest(
    ...paths: readonly string[]
): Promise<string | undefined> {
    const { $fetchApiCached } = await import("~/utils/fetch")
    return remoteDigest(paths, $fetchApiCached)
}

/** Digest of the plugin icons a page inlines, which are SVG text rather than
 * JSON, so a re-drawn icon invalidates the pages showing it. */
export async function pluginIconDigest(
    ...classes: readonly string[]
): Promise<string | undefined> {
    const { $fetchApiTextCached } = await import("~/utils/fetch")
    const { pluginIconPath } = await import("~/utils/pluginIcon")
    return remoteDigest(classes, (cls) => $fetchApiTextCached(pluginIconPath(cls)))
}
