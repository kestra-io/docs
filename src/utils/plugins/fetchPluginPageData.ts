import { API_URL } from "astro:env/client"
import type { JSONSchema } from "./schema"
import type { Plugin, PluginMetadata } from "./plugin"

import { $fetchApiCached } from "~/utils/fetch"
import loadBlogPostsMetadata from "~/utils/loadBlogPostsMetadata"
import { nuxtBlocksFromJsonSchema } from "~/utils/plugins/nuxtBlocks"
import { retrieveRepoReleases } from "../../pages/api/github-releases"
import type { PluginPage } from "./types"

const EE_RELEASES_PAGE_SIZE = 100

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

export async function fetchPageDefinition(pluginType: string): Promise<PluginPage | null> {
    try {
        const pageData = await $fetchApiCached<{
            markdown: string
            schema: JSONSchema & { properties: { $deprecated?: "true" | "false" } }
        }>(`/plugins/definitions/${pluginType}?markdown=false`)

        if (pageData.schema.properties.$deprecated === "true") return null

        const name = /^title: (.*)$/m.exec(pageData?.markdown)?.[1]
        const definitionType = /^type: "(.*)"$/m.exec(pageData?.markdown)?.[1]

        return { name, type: definitionType, ...nuxtBlocksFromJsonSchema(pageData.schema) } as any
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

