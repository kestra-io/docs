import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { mdxToMarkdown } from "~/components/vra-migration-guide/mdxToMarkdown"
import {
    AFTER_SCRIPT,
    BEFORE,
    COMPOSE,
    FLOW,
    GAPS,
    MAPPING,
    SHUTDOWN,
    STEPS,
} from "~/components/pipedream-migration-guide/guide"

const fence = (lang: string, code: string) => `\`\`\`${lang}\n${code}\n\`\`\``
const table = (head: string[], rows: readonly (readonly string[])[]) =>
    [
        `| ${head.join(" | ")} |`,
        `| ${head.map(() => "---").join(" | ")} |`,
        ...rows.map((row) => `| ${row.map((cell) => cell.replaceAll("|", "\\|")).join(" | ")} |`),
    ].join("\n")

export const GET: APIRoute = async ({ site }) => {
    const post = await getEntry("resources", "pipedream-migration-guide")
    if (!post) return new Response("Not found", { status: 404 })
    const link = (path: string) => new URL(path, site).href
    const faq = (post.data.faq ?? [])
        .map(
            ({ question, answer }) =>
                `**${question}**\n\n${mdxToMarkdown(answer.replace(/<code>(.*?)<\/code>/g, "`$1`")).trimEnd()}`,
        )
        .join("\n\n")

    const steps = STEPS.map(
        (step, i) => `${i + 1}. **${step.title}.** ${step.text}`,
    ).join("\n")

    const body = [
        `# ${post.data.title}`,
        post.data.description,
        `## Pipedream Workflows shutdown dates\n\n${SHUTDOWN.map((d) => `- **${d.title}.** ${d.text}`).join("\n")}`,
        "## Where each part of a workflow goes\n\nPipedream keeps the trigger, the code and the connected accounts in its workspace. In Kestra, a Webhook, Schedule or polling trigger starts a flow stored as YAML in your Git repository, a worker runs it on Kestra Cloud or in your own cloud, and credentials come from a secret manager scoped per namespace.",
        `## From export to cutover\n\n${steps}\n\nWhat the export leaves out, and where it goes in Kestra:\n\n${table(["Pipedream", "In Kestra"], GAPS)}\n\nAgent skills: ${link("/docs/develop-with-ai/agent-skills")}`,
        `## One workflow, before and after\n\nPipedream code step:\n\n${fence("python", BEFORE)}\n\ntransform.py, a namespace file in Kestra:\n\n${fence("python", AFTER_SCRIPT)}\n\ninvoice_intake.yaml:\n\n${fence("yaml", FLOW)}`,
        `## Pipedream to Kestra mapping\n\n${MAPPING.map((group) => `### ${group.title}\n\n${table(["Pipedream", "Kestra", "In the flow YAML"], group.rows.map(([pd, kestra, yaml, href]) => [pd, `[${kestra}](${link(href)})`, yaml]))}`).join("\n\n")}`,
        `## Where to run the flows\n\nKestra Cloud adds SSO, RBAC, audit logs, a secret manager and task runners in your own cloud; start a trial at ${link("/cloud")}. Kestra Enterprise runs self-hosted, hybrid or air-gapped. The open-source edition runs the same flows:\n\n${fence("bash", COMPOSE)}`,
        ...(faq ? [`## Questions\n\n${faq}`] : []),
    ].join("\n\n")

    return new Response(`${body}\n`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
