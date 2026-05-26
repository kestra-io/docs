import { API_URL } from "astro:env/client"
import type { JSONSchema } from "./schema"
import type { Plugin, PluginMetadata } from "./plugin"

import { $fetchApiCached, $fetchApiRawCached } from "~/utils/fetch"
import loadBlogPostsMetadata from "~/utils/loadBlogPostsMetadata"
import { nuxtBlocksFromJsonSchema } from "~/utils/plugins/nuxtBlocks"
import { retrieveRepoReleases } from "../../pages/api/github-releases"
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

            githubVersions.versions?.forEach((v: any) => {
                v.minCoreCompatibilityVersion = (
                    Object.values(artifactsData).flat() as any[]
                ).find(
                    (a) => a.version === v.version && normalizeRepoUrl(a.repository) === repoUrl,
                )?.minCoreCompatibilityVersion
            })
        } catch (e) {
            console.error("Artifacts annotation failed", e)
        }
    }

    return { githubVersions, allPlugins, allPluginMetadata, pluginsInformations }
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
            const response = await $fetchApiRawCached(url)
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

export async function fetchVersionedElements(
    pluginName: string,
    version: string,
): Promise<Set<string> | null> {
    try {
        const data = await $fetchApiCached<{
            byKind: Record<string, string[]>
        }>(`/plugins/${pluginName}/versions/${version}/elements`)

        const all = new Set<string>()
        for (const list of Object.values(data.byKind ?? {})) {
            for (const fqcn of list) all.add(fqcn)
        }
        return all
    } catch {
        return null
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

