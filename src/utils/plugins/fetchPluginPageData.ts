import { API_URL } from "astro:env/client"
import type { JSONSchema } from "./schema"
import type { Plugin, PluginMetadata } from "./plugin"

import { $fetchApiCached } from "~/utils/fetch"
import loadBlogPostsMetadata from "~/utils/loadBlogPostsMetadata"
import { nuxtBlocksFromJsonSchema } from "~/utils/plugins/nuxtBlocks"
import { retrieveRepoReleases } from "~/utils/plugins/repoReleases"
import { compareVersionsDesc } from "~/utils/plugins/compareVersions"
import type { PluginPage } from "./types"

const EE_RELEASES_PAGE_SIZE = 100

// HTTP status used by the versioned endpoint to signal a background generation is in progress.
const HTTP_ACCEPTED = 202

export type PageFetchStatus = "ready" | "pending" | "unavailable"

export interface PageFetchResult {
    status: PageFetchStatus
    page: PluginPage | null
}

export async function fetchInitialPluginData(pluginName: string, githubReleaseRepo: string, isEePlugin: boolean) {
    const [githubVersions, artifactsData, allPlugins, allPluginMetadata, pluginsInformations] =
        await Promise.all([
            isEePlugin
                ? Promise.resolve({ versions: [] as any[] })
                : retrieveRepoReleases(githubReleaseRepo),
            !isEePlugin
                ? $fetchApiCached(`/plugins/artifacts/${pluginName}`).catch((e) => {
                      console.error("Artifacts fetch failed", e)
                      return {}
                  })
                : Promise.resolve({}),
            $fetchApiCached<Plugin[]>(`/plugins/subgroups`),
            $fetchApiCached<PluginMetadata[]>(`/plugins/metadata?icons=false`),
            $fetchApiCached<{ byPlugin: Record<string, any> }>(
                `/plugins/pluginsInformation?icons=false`,
            ),
        ])

    if (isEePlugin) {
        try {
            const eeData = await $fetchApiCached<{
                results: { version: string; kestraVersion: string; releaseDate: string | null }[]
                total: number
            }>(
                `/plugins/artifacts/ee/releases?artifactId=${pluginName}&size=${EE_RELEASES_PAGE_SIZE}`,
            )
            githubVersions.versions = eeData.results.map((r) => ({
                version: r.version,
                publishedAt: r.releaseDate,
                minCoreCompatibilityVersion: r.kestraVersion,
                releaseNotesUrl: `${API_URL}/plugins/artifacts/ee/release-notes/${githubReleaseRepo}?version=${r.version}`,
            }))
        } catch (e) {
            console.error("EE releases fetch failed", e)
        }
    } else {
        try {
            const normalizeRepoUrl = (url?: string) =>
                url
                    ?.replace(/^git@github\.com:/, "https://github.com/")
                    .replace(/\.git$/, "")
            const repoUrl = `https://github.com/kestra-io/${githubReleaseRepo}`

            // Index min-core by version once, instead of scanning the flattened artifact list per release.
            const minCoreByVersion = new Map<string, string>()
            for (const a of Object.values(artifactsData).flat() as any[]) {
                if (a?.minCoreCompatibilityVersion && normalizeRepoUrl(a.repository) === repoUrl) {
                    minCoreByVersion.set(a.version, a.minCoreCompatibilityVersion)
                }
            }

            githubVersions.versions?.forEach((v: any) => {
                v.minCoreCompatibilityVersion = minCoreByVersion.get(v.version)

                // Fallback for pre-1.0.0 versions not in the artifacts index:
                // plugin 0.X.Y always required Kestra 0.X.0 by convention.
                if (!v.minCoreCompatibilityVersion) {
                    const parts = v.version.split(".")
                    if (parts.length >= 2 && parseInt(parts[0]) === 0) {
                        v.minCoreCompatibilityVersion = `0.${parts[1]}.0`
                    }
                }
            })
        } catch (e) {
            console.error("Artifacts annotation failed", e)
        }
    }

    // Fallback so a rate-limited/empty GitHub releases response does not blank the version panel.
    // OSS plugins are in the artifacts catalog (already fetched above); core ships in the CLI and is
    // not a catalog artifact, so it falls back to the core versions endpoint instead. Dates are kept
    // when present (EE artifacts carry publishedAt; OSS/core fallbacks have none until the backend fills it).
    if (!isEePlugin && !githubVersions.versions?.length) {
        try {
            if (pluginName === "core") {
                const coreVersions = await $fetchApiCached<{ version: string }[]>(`/versions`)
                githubVersions.versions = coreVersions
                    .filter((v) => {
                        const major = parseInt(v.version.split(".")[0])
                        return !isNaN(major) && major >= 1
                    })
                    .map((v) => ({ version: v.version, publishedAt: null }))
                    .toSorted((a, b) => compareVersionsDesc(a.version, b.version))
            } else {
                githubVersions.versions = (Object.values(artifactsData).flat() as any[])
                    .filter((a) => a?.version)
                    .map((a) => ({
                        version: a.version,
                        publishedAt: a.publishedAt ?? null,
                        minCoreCompatibilityVersion: a.minCoreCompatibilityVersion,
                        releaseNotesUrl: a.releaseNotesUrl,
                    }))
                    .toSorted((a, b) => compareVersionsDesc(a.version, b.version))
            }
        } catch (e) {
            console.error("Version list fallback failed", e)
        }
    }

    // Restrict the dropdown to versions that actually exist for THIS artifact. GitHub releases are
    // repo-wide, so a monorepo (e.g. plugin-scripts ships dotnet, python, shell...) lists every repo
    // release for each sub-plugin — a sub-plugin like plugin-script-dotnet (introduced at 1.9.0) would
    // otherwise offer 1.2.0 etc. and 404 on archived docs. The artifacts index holds the full per-artifact
    // history, so intersect with it. Guarded: if the intersection is empty (index lag, EE, or core, which
    // is not a catalog artifact), keep the original list so the panel never blanks.
    if (!isEePlugin && pluginName !== "core" && githubVersions.versions?.length) {
        const artifactVersions = new Set(
            (Object.values(artifactsData).flat() as any[]).map((a) => a?.version).filter(Boolean),
        )
        if (artifactVersions.size) {
            const filtered = githubVersions.versions.filter((v: any) => artifactVersions.has(v.version))
            if (filtered.length) githubVersions.versions = filtered
        }
    }

    return { githubVersions, allPlugins, allPluginMetadata, pluginsInformations }
}

// Versions where an element exists (class fqcn or subpackage prefix). [] on failure so callers keep the full list.
export async function fetchElementVersions(fqcn: string): Promise<string[]> {
    try {
        const res = await $fetchApiCached<{ version: string }[]>(`/plugins/${fqcn}/versions`)
        return res.map((v) => v.version)
    } catch (e) {
        console.error("Element versions fetch failed", e)
        return []
    }
}

// Versioned endpoints return 202 while a version's docs are still generating. We need the raw Response
// to read that status, and no edge-caching so a transient 202 isn't pinned (which would reload-loop the
// page while it polls). So fetch directly rather than via the cached helpers.
async function fetchVersionedRaw(url: string): Promise<Response> {
    return fetch(`${API_URL}${url}`)
}

/**
 * Versioned endpoint may return 202 while the backend is generating docs for a cold (artifactId, version).
 * Caller can use status to render the latest version as fallback content with a loading banner, then poll.
 */
export async function fetchPageDefinition(
    pluginType: string,
    pluginName?: string,
    version?: string,
): Promise<PageFetchResult> {
    const isVersioned = Boolean(version && pluginName)
    const url = isVersioned
        ? `/plugins/${pluginName}/versions/${version}/definitions/${pluginType}`
        : `/plugins/definitions/${pluginType}?markdown=false`

    try {
        if (isVersioned) {
            const response = await fetchVersionedRaw(url)
            if (response.status === HTTP_ACCEPTED) {
                return { status: "pending", page: null }
            }
            if (!response.ok) {
                return { status: "unavailable", page: null }
            }
            const pageData = await response.json() as {
                markdown: string
                schema: JSONSchema & { properties: { $deprecated?: "true" | "false" } }
            }
            return { status: "ready", page: pageDataToPluginPage(pageData) }
        }

        const pageData = await $fetchApiCached<{
            markdown: string
            schema: JSONSchema & { properties: { $deprecated?: "true" | "false" } }
        }>(url)
        return { status: "ready", page: pageDataToPluginPage(pageData) }
    } catch {
        return { status: "unavailable", page: null }
    }
}

function pageDataToPluginPage(pageData: {
    markdown: string
    schema: JSONSchema & { properties: { $deprecated?: "true" | "false" } }
}): PluginPage | null {
    if (pageData.schema.properties.$deprecated === "true") return null
    const name = /^title: (.*)$/m.exec(pageData?.markdown)?.[1]
    const definitionType = /^type: "(.*)"$/m.exec(pageData?.markdown)?.[1]
    return { name, type: definitionType, ...nuxtBlocksFromJsonSchema(pageData.schema) } as any
}

export interface VersionedSubgroupsResult {
    status: PageFetchStatus
    subgroups: Plugin[] | null
}

export async function fetchVersionedSubgroups(
    pluginName: string,
    version: string,
): Promise<VersionedSubgroupsResult> {
    const url = `/plugins/${pluginName}/versions/${version}/subgroups`
    try {
        const response = await fetchVersionedRaw(url)
        if (response.status === HTTP_ACCEPTED) {
            return { status: "pending", subgroups: null }
        }
        if (!response.ok) {
            return { status: "unavailable", subgroups: null }
        }
        return { status: "ready", subgroups: (await response.json()) as Plugin[] }
    } catch {
        return { status: "unavailable", subgroups: null }
    }
}

export async function fetchSecondaryData(pluginName: string) {
    const [{ countByPlugins: blueprintCounts }, blogs] = await Promise.all([
        $fetchApiCached<{ countByPlugins: Record<string, number> }>(`/blueprints/countByPlugins`),
        loadBlogPostsMetadata(),
    ])

    const relatedBlogs = blogs
        .filter((b) => b.data.plugins?.includes(pluginName ?? ""))
        .sort(
            (a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime(),
        )

    return { blueprintCounts, relatedBlogs }
}

