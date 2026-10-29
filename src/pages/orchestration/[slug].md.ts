import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import type { OrchestrationData } from "~/schemas/orchestration"
import { entryCacheKey } from "~/utils/incrementalCacheKey"
import {
    fetchTotalPluginsCount,
    pluginCountScope,
    replaceTotalPluginsPlaceholder,
} from "~/utils/plugins/pluginCount"

const SITE = "https://kestra.io"

// The YAML copy carries a little inline HTML (code, links, emphasis): turn it
// into Markdown so agents get the same text the page renders.
function toMarkdown(html: string): string {
    return html
        .replace(/<code>(.*?)<\/code>/g, "`$1`")
        .replace(
            /<a\s+href=['"]([^'"]+)['"][^>]*>(.*?)<\/a>/g,
            (_, href: string, text: string) =>
                `[${text}](${href.startsWith("/") ? SITE + href : href})`,
        )
        .replace(/<\/?(strong|b)>/g, "**")
        .replace(/<\/?(em|i)>/g, "_")
        .replace(/<br\s*\/?>/g, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim()
}

function absolute(href: string): string {
    return href.startsWith("/") ? SITE + href : href
}

function render(data: OrchestrationData): string {
    const lines: string[] = [`# ${toMarkdown(data.title)}`, ""]
    lines.push(`> ${toMarkdown(data.description)}`, "")
    lines.push(`## ${toMarkdown(data.hero.title)}`, "", toMarkdown(data.hero.description), "")
    if (data.nutshell) lines.push(toMarkdown(data.nutshell), "")

    lines.push(`## ${toMarkdown(data.pillars.title)}`, "")
    if (data.pillars.subtitle) lines.push(toMarkdown(data.pillars.subtitle), "")
    for (const pillar of data.pillars.items) {
        lines.push(`### ${toMarkdown(pillar.title)}`, "", toMarkdown(pillar.description), "")
    }

    lines.push(`## ${toMarkdown(data.useCases.title)}`, "")
    if (data.useCases.subtitle) lines.push(toMarkdown(data.useCases.subtitle), "")
    for (const useCase of data.useCases.items) {
        lines.push(`### ${toMarkdown(useCase.title)}`, "", toMarkdown(useCase.description), "")
        lines.push("Flow:", "")
        useCase.flow.forEach((step, idx) => {
            const label = step.label ? ` (${toMarkdown(step.label)})` : ""
            const plugin = step.pluginClass ? ` \`${step.pluginClass}\`` : ""
            lines.push(`${idx + 1}. ${toMarkdown(step.node)}${label}${plugin}`)
        })
        lines.push("")
        for (const item of useCase.items ?? []) {
            lines.push(`- **${toMarkdown(item.title)}**: ${toMarkdown(item.description)}`)
        }
        if (useCase.items?.length) lines.push("")
    }

    if (data.blueprints.items.length) {
        lines.push(`## ${toMarkdown(data.blueprints.title)}`, "")
        for (const blueprint of data.blueprints.items) {
            lines.push(
                `- [${toMarkdown(blueprint.title)}](${SITE}/blueprints/${blueprint.blueprintId}): ${toMarkdown(blueprint.description)}`,
            )
        }
        lines.push("")
    }

    const { comparison } = data
    lines.push(`## ${toMarkdown(comparison.title)}`, "")
    if (comparison.subtitle) lines.push(toMarkdown(comparison.subtitle), "")
    lines.push(`| Feature | Kestra | ${comparison.competitors.map((c) => c.name).join(" | ")} |`)
    lines.push(`| --- | --- | ${comparison.competitors.map(() => "---").join(" | ")} |`)
    for (const row of comparison.rows) {
        const cells = [row.feature, row.kestra, ...row.values].map((cell) =>
            toMarkdown(cell).replace(/\|/g, "\\|"),
        )
        lines.push(`| ${cells.join(" | ")} |`)
    }
    lines.push("")

    lines.push("## Frequently asked questions", "")
    for (const item of data.faq) {
        lines.push(`### ${toMarkdown(item.question)}`, "", toMarkdown(item.answer), "")
    }

    if (data.resources?.items.length) {
        lines.push(`## ${toMarkdown(data.resources.title)}`, "")
        for (const item of data.resources.items) {
            lines.push(`- [${toMarkdown(item.title)}](${absolute(item.href)}): ${toMarkdown(item.description)}`)
        }
        lines.push("")
    }

    lines.push(`Plugin reference: ${SITE}/plugins — \`${data.tool.pluginClass}\``)
    return lines.join("\n") + "\n"
}

export async function getStaticPaths() {
    const entries = await getCollection("orchestration")
    const totalPlugins = await fetchTotalPluginsCount()
    return entries.map((entry) => {
        const data = replaceTotalPluginsPlaceholder(entry.data, totalPlugins)
        return {
            params: { slug: entry.id },
            props: { markdown: render(data) },
            cacheKey: entryCacheKey(entry, ...pluginCountScope(totalPlugins, entry.data)),
        }
    })
}

export const GET: APIRoute = ({ props }) => {
    return new Response(props.markdown, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
