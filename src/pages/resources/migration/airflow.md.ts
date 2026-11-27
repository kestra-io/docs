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
    PITFALLS,
    STEPS,
    COMPARE_ROWS,
} from "~/components/airflow-migration-guide/guide"
import { fence, groupedTable, table } from "~/components/migration/markdown"

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
        `## Airflow vs Kestra\n\n${table(["", "Airflow", "Kestra"], COMPARE_ROWS(plugins).map((r) => [r.label, ...r.values]))}`,
        `## Why teams leave Airflow\n\n${cards(LEAVE)}\n\n> Apache Airflow is complex and has been challenging to manage, with significant operational overhead. (Senior engineering manager, Apple's ML team: ${link("/stories/apple")})`,
        `## ${HOW.title}\n\n${HOW.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.text}`).join("\n")}\n\n${fence("yaml", HOW.flow)}`,
        `## Three Airflow DAGs, translated\n\nEach Airflow DAG parses on Airflow 2.10, and each flow validates on Kestra.\n\n${EXAMPLES.map(
            (example) =>
                `### ${example.title}\n\n${example.text}\n\n${example.panes
                    .map((pane) => `${pane.label}:\n\n${fence(pane.lang, pane.code)}`)
                    .join("\n\n")}\n\n${example.after}`,
        ).join("\n\n")}`,
        `## Migration plan\n\n${STEPS.map(
            (step, i) =>
                `${i + 1}. **${step.title}.** ${step.text} Checks: ${step.visual.checks.join("; ")}.`,
        ).join("\n")}`,
        `## Airflow to Kestra mapping\n\n### Concepts\n\n${groupedTable(["Airflow", "Kestra", "Watch out"], MAPPING)}\n\n### Operators\n\n${groupedTable(["Airflow operator", "Kestra task type", "Note"], OPERATORS)}\n\n### Pitfalls in translated flows\n\n${groupedTable(["In the translated flow", "What to do"], PITFALLS)}`,
        `## Before you move, read the whitepaper\n\nThe [whitepaper](${link("/resources/airflow-2-eol-whitepaper")}) covers where the Airflow model works against growing teams and when to move.`,
        ...(faq ? [`## FAQ\n\n${faq}`] : []),
    ].join("\n\n")

    return new Response(`${body.replaceAll("](/", `](${link("/")}`)}\n`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
