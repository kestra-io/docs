import { commitUrl, type ChangelogEntry } from "./parseRelease"

const ISSUE_BASE_URL = "https://github.com/kestra-io/kestra/issues"

export function formatReleaseDate(publishedAt: string): string {
    return new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export function buildChangelogMarkdown(entries: ChangelogEntry[]): string {
    const lines: string[] = ["# Changelog", "", "Product updates and improvements.", ""]

    for (const entry of entries) {
        lines.push(
            `## ${entry.title} — ${entry.isMajor ? "Major" : "Minor"} · ${formatReleaseDate(entry.publishedAt)}`,
            "",
            entry.summary,
            "",
        )

        for (const edition of entry.editions) {
            if (edition.label) {
                lines.push(`### ${edition.label}`, "")
            }

            for (const group of edition.groups) {
                lines.push(`${edition.label ? "####" : "###"} ${group.title}`, "")

                for (const change of group.changes) {
                    const url = commitUrl(change)
                    const sha = change.sha
                        ? url
                            ? `[\`${change.sha}\`](${url}) `
                            : `\`${change.sha}\` `
                        : ""
                    const scope = change.scope ? `**${change.scope}**: ` : ""
                    const pr = change.pr
                        ? ` ([#${change.pr}](${ISSUE_BASE_URL}/${change.pr}))`
                        : ""
                    lines.push(`- ${sha}${scope}${change.message}${pr}`)
                }

                lines.push("")
            }
        }

        lines.push(`[Release notes on GitHub](${entry.githubUrl})`, "")
    }

    return lines.join("\n")
}
