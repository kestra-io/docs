import type { GitHubRelease } from "~/utils/fetchChangelogVersions"

export const CHANGELOG_BASE_URL = "https://kestra.io/docs/changelog"

/** Renders a single release as the Markdown served at `/docs/changelog/{tag}.md`. */
export function renderReleaseMarkdown(release: GitHubRelease): string {
    const title = release.name || release.tag_name
    return `# ${title}\n\n${release.body ?? ""}`
}

/** Renders the release index served at `/docs/changelog.md`. */
export function renderChangelogIndexMarkdown(
    releases: GitHubRelease[],
): string {
    const lines = releases.map((release) => {
        const title = release.name || release.tag_name
        const url = `${CHANGELOG_BASE_URL}/${release.tag_name}`
        const date = release.published_at?.slice(0, 10)
        return date ? `- [${title}](${url}) — ${date}` : `- [${title}](${url})`
    })

    return [
        "# Release Notes",
        "",
        "Stay up to date with the latest Kestra releases and updates.",
        "Append `.md` to any release URL below to retrieve its notes as plain Markdown.",
        "",
        ...lines,
        "",
    ].join("\n")
}
