import type { APIRoute } from "astro"
import { $fetchApi } from "~/utils/fetch"
import { API_URL } from "astro:env/client"

export const prerender = false

function resolveGithubReleaseRepo(pluginName: string): string {
    switch (true) {
        case pluginName === "core":
            return "kestra"
        case pluginName.startsWith("plugin-jdbc-") ||
            pluginName === "plugin-jdbc":
            return "plugin-jdbc"
        case pluginName.startsWith("plugin-script-") ||
            pluginName === "plugin-script":
            return "plugin-scripts"
        case pluginName.startsWith("plugin-debezium-") ||
            pluginName === "plugin-debezium":
            return "plugin-debezium"
        case pluginName.startsWith("plugin-transform-") ||
            pluginName === "plugin-transform":
            return "plugin-transform"
        default:
            return pluginName
    }
}

const cachingConfig: RequestInit = {
    cf: {
        cacheTtl: 60 * 60,
        cacheEverything: true,
    },
}

export const GET: APIRoute = async ({ url }) => {
    const pluginName = url.searchParams.get("pluginName")
    if (!pluginName) {
        return new Response(JSON.stringify({ versions: [] }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        })
    }

    const repo = resolveGithubReleaseRepo(pluginName)
    const isEe = repo.includes("plugin-ee")

    try {
        if (isEe) {
            const eeData = await $fetchApi<{
                results: {
                    version: string
                    kestraVersion: string
                    releaseDate: string | null
                }[]
                total: number
            }>(`/plugins/artifacts/ee/releases?artifactId=${repo}&size=100`)

            return new Response(
                JSON.stringify({
                    versions: eeData.results.map((r) => ({
                        version: r.version,
                        publishedAt: r.releaseDate,
                        minCoreCompatibilityVersion: r.kestraVersion,
                        releaseNotesUrl: `${API_URL}/plugins/artifacts/ee/release-notes/${repo}?version=${r.version}`,
                    })),
                    releasesUrl: null,
                }),
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "public, max-age=3600",
                    },
                },
            )
        }

        const artifactsData = await $fetchApi<{
            artifacts?: Record<string, any[]>
        }>("/plugins/artifacts", cachingConfig)

        const { artifacts = {} } = artifactsData
        const normalizeRepoUrl = (repoUrl?: string) => {
            if (!repoUrl) return undefined
            return repoUrl
                .replace(/^git@github\.com:/, "https://github.com/")
                .replace(/\.git$/, "")
        }

        const repoUrl = normalizeRepoUrl(`https://github.com/kestra-io/${repo}`)

        // Retrieve GitHub releases and annotate with minCoreCompatibilityVersion
        const { retrieveRepoReleases } = await import("./github-releases")
        const releaseData = await retrieveRepoReleases(repo)

        releaseData.versions.forEach((v: any) => {
            v.minCoreCompatibilityVersion = (
                Object.values(artifacts).flat() as any[]
            ).find(
                (a) =>
                    a.version === v.version &&
                    normalizeRepoUrl(a.repository) === repoUrl,
            )?.minCoreCompatibilityVersion
        })

        return new Response(
            JSON.stringify({
                versions: releaseData.versions,
                releasesUrl: `https://github.com/kestra-io/${repo}/releases`,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "public, max-age=3600",
                },
            },
        )
    } catch (e) {
        console.error("Plugin versions fetch failed", e)
        return new Response(
            JSON.stringify({
                versions: [],
                releasesUrl: isEe
                    ? null
                    : `https://github.com/kestra-io/${repo}/releases`,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
    }
}
