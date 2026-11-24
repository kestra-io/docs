import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { fetchTotalPluginsCount } from "~/utils/plugins/pluginCount"
import {
    EXAMPLES,
    HERO,
    HOW,
    LEAVE,
    MAPPING,
    OPERATORS,
    PLAYBOOK_STEPS,
    COMPARE_ROWS,
} from "~/components/airflow-migration-guide/guide"

const toMd = (html: string) =>
    html
        .replace(/<ul>|<ol>/g, "")
        .replace(/<\/ul>|<\/ol>/g, "\n\n")
        .replace(/<li>(.*?)<\/li>/g, "- $1\n")
        .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
        .replace(/<code>(.*?)<\/code>/g, "`$1`")
        .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
        .replace(/<a href="([^"]+)">(.*?)<\/a>/g, "[$2]($1)")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&")
        .trim()

const fence = (lang: string, code: string) => `\`\`\`${lang}\n${code}\n\`\`\``

type Group = { title: string; rows: readonly { cells: readonly string[] }[] }
const table = (head: string[], groups: readonly Group[]) =>
    groups
        .map((group) =>
            [
                group.title ? `**${group.title}**\n` : "",
                `| ${head.join(" | ")} |`,
                `| ${head.map(() => "---").join(" | ")} |`,
                ...group.rows.map(
                    (row) =>
                        `| ${row.cells.map((cell) => cell.replaceAll("|", "\\|")).join(" | ")} |`,
                ),
            ]
                .filter(Boolean)
                .join("\n"),
        )
        .join("\n\n")

const cards = (items: readonly { title: string; text: string }[]) =>
    items.map((item) => `- **${toMd(item.title)}** ${toMd(item.text)}`).join("\n")

export const GET: APIRoute = async ({ site }) => {
    const post = await getEntry("resources", "airflow-migration-guide")
    if (!post) return new Response("Not found", { status: 404 })
    const plugins = await fetchTotalPluginsCount()
    const link = (path: string) => new URL(path, site).href
    const faq = (post.data.faq ?? [])
        .map(({ question, answer }) => `**${question}**\n\n${toMd(answer)}`)
        .join("\n\n")

    const body = [
        `# ${post.data.title}`,
        HERO.lead,
        `## Airflow vs Kestra\n\n| | Airflow | Kestra |\n| --- | --- | --- |\n${COMPARE_ROWS(plugins).map((r) => `| ${r.label} | ${r.values[0]} | ${r.values[1]} |`).join("\n")}`,
        `## Why teams leave Airflow\n\n${cards(LEAVE)}\n\n> Apache Airflow is complex and has been challenging to manage, with significant operational overhead. (Senior engineering manager, Apple's ML team: ${link("/stories/apple")})`,
        `## ${HOW.title}\n\n${HOW.lead}\n\n${HOW.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.text}`).join("\n")}\n\n${fence("yaml", HOW.flow)}`,
        `## Three Airflow DAGs, translated\n\nEach Airflow DAG parses on Airflow 2.10, and each flow validates on Kestra.\n\n${EXAMPLES.map(
            (example) =>
                `### ${example.title}\n\n${toMd(example.html)}\n\n${example.panes
                    .map((pane) => `${pane.label}:\n\n${fence(pane.lang, pane.code)}`)
                    .join("\n\n")}${example.after ? `\n\n${toMd(example.after)}` : ""}`,
        ).join("\n\n")}`,
        `## Migration plan\n\n${PLAYBOOK_STEPS.map(
            (step, i) =>
                `${i + 1}. **${step.title}.** ${step.text} Checks: ${step.visual.checks.join("; ")}.`,
        ).join("\n")}`,
        `## Airflow to Kestra mapping\n\n### Concepts\n\n${table(["Airflow", "Kestra", "Watch out"], MAPPING)}\n\n### Operators\n\n${table(["Airflow operator", "Kestra task type", "Note"], OPERATORS)}`,
        `## Before you move, read the whitepaper\n\nThe [whitepaper](${link("/resources/airflow-2-eol-whitepaper")}) covers where the Airflow model works against growing teams and when to move.`,
        ...(faq ? [`## FAQ\n\n${faq}`] : []),
    ].join("\n\n")

    return new Response(`${body.replaceAll("](/", `](${link("/")}`)}\n`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
