import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { mdxToMarkdown } from "~/components/vra-migration-guide/mdxToMarkdown"
import {
    CALLOUTS,
    COMPARE_MORE,
    COMPARE_ROWS,
    HERO,
    HOW,
    LEAVE,
    MAPPING,
    MAPPING_LEAD,
    PATTERNS,
    PITFALLS,
    RESULT,
    STARTS,
    STATUS,
    STEPS,
    SURVEY,
    runEditions,
} from "~/components/awx-migration-guide/guide"
import {
    PATCH_AWX,
    PATCH_KESTRA,
    RESTART_APP,
    RESTART_AWX,
    RESTART_CURL,
    RESTART_KESTRA,
} from "~/components/awx-migration-guide/code"
import { fence, groupedTable, table } from "~/components/migration/markdown"

const toMd = (html: string) =>
    mdxToMarkdown(html.replace(/<code>(.*?)<\/code>/g, "`$1`")).trimEnd()

const cards = (items: readonly { title: string; text: string }[]) =>
    items.map((item) => `- **${item.title}.** ${toMd(item.text)}`).join("\n")

const terminal = (lines: { cmd?: string; out?: string[]; note?: string }[]) =>
    fence(
        "",
        lines
            .flatMap((line) =>
                line.cmd
                    ? [`$ ${line.cmd}`]
                    : [...(line.out ?? []), ...(line.note ? [`# ${line.note}`] : [])],
            )
            .join("\n"),
    )

export const GET: APIRoute = async ({ site }) => {
    const post = await getEntry("resources", "awx-migration-guide")
    if (!post) return new Response("Not found", { status: 404 })
    const link = (path: string) => new URL(path, site).href
    const faq = (post.data.faq ?? [])
        .map(({ question, answer }) => `**${question}**\n\n${toMd(answer)}`)
        .join("\n\n")

    const plan = STEPS.map((step) => {
        const visuals = [step.visual.awx, step.visual.kestra]
            .filter((side) => side?.kind === "terminal")
            .map((side) => terminal(side!.kind === "terminal" ? side!.lines : []))
        return [
            `### ${step.title}`,
            step.text,
            step.ctas.map((cta) => `[${cta.label}](${cta.href})`).join(" · "),
            ...visuals,
            step.visual.checks.map((check, i) => `${i + 1}. ${check}`).join("\n"),
        ].join("\n\n")
    }).join("\n\n")

    const body = [
        `# ${post.data.title}`,
        HERO.lead,
        `## ${STATUS.title}\n\n${cards(STATUS.items)}\n\n${STATUS.after} [${STATUS.link.label}](${STATUS.link.href})`,
        `## Why Teams Leave AWX and AAP\n\n${cards(LEAVE)}`,
        `## AWX and AAP vs Kestra\n\n${table(["", "AWX / AAP", "Kestra"], COMPARE_ROWS.map((r) => [r.label, ...r.values]))}\n\n[${COMPARE_MORE.label}](${COMPARE_MORE.href})`,
        `## ${STARTS.title}\n\n${STARTS.lead}\n\n${cards(STARTS.items)}\n\n${STARTS.after}`,
        `## ${HOW.title}\n\n${HOW.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.text}`).join("\n")}\n\nlinux-patching.yml:\n\n${fence("yaml", PATCH_AWX)}\n\n${CALLOUTS.map((c, i) => `${i + 1}. ${c.label}`).join("\n")}\n\nlinux_patching.yaml:\n\n${fence("yaml", PATCH_KESTRA)}\n\n${table(RESULT.columns, RESULT.rows.map((r) => [`\`${r.host}\``, r.awx, r.kestra, "match"]))}\n\n**${RESULT.verdict.name}** ${RESULT.verdict.text}`,
        `## ${SURVEY.title}\n\n${SURVEY.lead}\n\n${fence("yaml", RESTART_AWX)}\n\n${fence("yaml", RESTART_KESTRA)}\n\n${fence("yaml", RESTART_APP)}\n\n${fence("", RESTART_CURL)}\n\n${SURVEY.callouts.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\n[${SURVEY.link.label}](${SURVEY.link.href})`,
        `## Migration Plan\n\n${plan}`,
        `## ${PATTERNS.title}\n\n${toMd(PATTERNS.lead)}\n\n${cards(PATTERNS.items)}`,
        `## AWX to Kestra Mapping\n\n${MAPPING_LEAD}\n\n### Concepts\n\n${groupedTable(["AWX / AAP", "Kestra", "In the flow YAML"], MAPPING)}\n\n### Pitfalls\n\n${PITFALLS[0].rows.map((r, i) => `${i + 1}. **${r.cells[0]}.** ${r.cells[1]}`).join("\n")}`,
        `## Where to Run the Flows\n\nThe same flows run on all three editions.\n\n${runEditions()
            .map((e) => `- **${e.title}.** ${e.text} [${e.cta.label}](${e.cta.href})`)
            .join("\n")}`,
        ...(faq ? [`## Questions from AWX and AAP Teams\n\n${faq}`] : []),
    ].join("\n\n")

    return new Response(`${body.replaceAll("](/", `](${link("/")}`)}\n`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
