import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { mdxToMarkdown } from "~/components/vra-migration-guide/mdxToMarkdown"
import { resolveTotalPluginsPlaceholder } from "~/utils/plugins/pluginCount"
import startHereSource from "~/components/pipedream-migration-guide/StartHere.mdx?raw"

/**
 * The guide's markdown variant. Its entry sets `href`, which excludes it from
 * the per-topic endpoint, so it needs its own.
 */
export const GET: APIRoute = async ({ site }) => {
    const post = await getEntry("resources", "pipedream-migration-guide")
    if (!post) return new Response("Not found", { status: 404 })
    const source = await resolveTotalPluginsPlaceholder(
        (post.body ?? "").replaceAll("{props.totalPlugins}", "{totalPlugins}"),
    )
    const link = (path: string) => new URL(path, site).href
    // Answers quote `{{ trigger.body }}`, which MDX would parse as an
    // expression inside <code>, but not inside a backtick span.
    const toMarkdown = (answer: string) =>
        mdxToMarkdown(answer.replace(/<code>(.*?)<\/code>/g, "`$1`"))
    const faq = (post.data.faq ?? [])
        .map(
            ({ question, answer }) =>
                `**${question}**\n\n${toMarkdown(answer).trimEnd()}`,
        )
        .join("\n\n")

    const body = [
        mdxToMarkdown(startHereSource),
        mdxToMarkdown(source, {
            replacements: {
                GuideCta: ({ kind }) =>
                    ({
                        cloud: `_Start your Cloud trial: ${link("/cloud")}_`,
                        talk: `_Talk to our team: ${link("/demo")}_`,
                    })[kind] ?? "",
            },
        }),
        ...(faq ? [`## Questions\n\n${faq}\n`] : []),
    ].join("\n")

    return new Response(`# ${post.data.title}\n\n${body}`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
