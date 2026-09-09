/**
 * Single source of truth for "what version is this plugin page rendering?".
 *
 * Two-phase derivation:
 *
 *   1. parseRequestedVersion(splitSlug, pathname) — pure URL parse.
 *      Knows: does the URL have a `/vX.Y.Z/` segment, and what is the unversioned canonical path.
 *
 *   2. resolveVersionState(requested, latestVersion) — folds in the catalog.
 *      Knows: is the requested version actually archived (older than latest), or just latest-in-disguise.
 *
 * Callers (the slug page) consume the resolved state and never re-derive "is this archived?" on their own.
 * That conflation between "URL has a version" and "doc is old" caused the inconsistent banner/sidebar bug.
 */

const VERSIONED_URL_SEGMENT_REGEX = /^v\d+\.\d+\.\d+$/

export interface RequestedVersion {
    /** The X.Y.Z from the URL (without the leading "v"), or undefined if the URL has no version segment. */
    version?: string
    /** Route slug with the version segment stripped, used for all downstream routing. */
    splitRouteSlug: string[]
    /** /plugins/... pathname stripped of the version segment. */
    canonicalPathname: string
}

export function parseRequestedVersion(
    rawSplitRouteSlug: string[],
    pathname: string,
): RequestedVersion {
    const versionSegment = rawSplitRouteSlug[1]
    const version = versionSegment && VERSIONED_URL_SEGMENT_REGEX.test(versionSegment)
        ? versionSegment.slice(1)
        : undefined
    const splitRouteSlug = version
        ? [rawSplitRouteSlug[0], ...rawSplitRouteSlug.slice(2)]
        : rawSplitRouteSlug
    const canonicalPathname = version
        ? "/plugins/" + splitRouteSlug.join("/")
        : pathname
    return { version, splitRouteSlug, canonicalPathname }
}

export interface VersionState extends RequestedVersion {
    /** True iff the URL requested a specific version that is older than the latest known. */
    isArchived: boolean
    /** True iff the URL requested a specific version that is the latest. Caller should 301 to canonicalPathname. */
    isLatestRequested: boolean
    /** Latest version from the catalog, if known. */
    latestVersion?: string
}

export function resolveVersionState(
    requested: RequestedVersion,
    latestVersion: string | undefined,
): VersionState {
    const isLatestRequested =
        !!requested.version && !!latestVersion && requested.version === latestVersion
    const isArchived = !!requested.version && !isLatestRequested
    return { ...requested, isArchived, isLatestRequested, latestVersion }
}
