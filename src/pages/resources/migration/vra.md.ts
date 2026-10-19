import type { APIRoute, ImageMetadata } from "astro"
import { getEntry } from "astro:content"
import { mdxToMarkdown } from "~/components/vra-migration-guide/mdxToMarkdown"
import { VERDICT_LABELS } from "~/components/vra-migration-guide/blocks/verdict"
import { resolveTotalPluginsPlaceholder } from "~/utils/plugins/pluginCount"
import startHereSource from "~/components/vra-migration-guide/StartHere.mdx?raw"
import handoutsSource from "~/components/vra-migration-guide/ReferenceHandouts.mdx?raw"

// The guide's figures, keyed by the relative path the MDX uses, so the
// markdown can point at where Astro serves them.
const FIGURES = import.meta.glob<ImageMetadata>(
    "../../../contents/resources/vra-migration-guide/*.png",
    { eager: true, import: "default" },
)

// Markdown variant of the vRA migration guide, like
// airflow-2-eol-whitepaper.md.ts. The entry sets `href`, which excludes it
// from the per-topic endpoint, so it needs its own. The body is MDX, so the
// component markup is stripped and the calculators point to the web page.
/** An FAQ answer as markdown: anchors become links, other tags are dropped. */
function faqAnswer(html: string): string {
    return html
        .replace(/<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/g, "[$2]($1)")
        .replace(/<[^>]+>/g, "")
}

export const GET: APIRoute = async ({ site, url }) => {
    const post = await getEntry("resources", "vra-migration-guide")
    if (!post) return new Response("Not found", { status: 404 })
    const source = await resolveTotalPluginsPlaceholder(
        (post.body ?? "").replaceAll("{props.totalPlugins}", "{totalPlugins}"),
    )
    // Against the request origin rather than `site`, so the dev server's
    // own image URLs stay reachable; at build time the two are the same.
    const images = Object.fromEntries(
        Object.entries(FIGURES).map(([path, image]) => [
            `./${path.split("/").pop()}`,
            new URL(image.src, url.origin).href,
        ]),
    )
    const body = mdxToMarkdown(source, {
        replacements: {
            // The CTA buttons, as plain links so the mirror still points at the
            // calculator, the Migration Assistant page and the team.
            GuideCta: ({ kind }) =>
                ({
                    calc: `_Interactive: work out your payback in the calculator at ${new URL("/resources/migration/vra/payback", site).href}._`,
                    assistant: `_Get the Migration Assistant for vRA: ${new URL("/resources/migration/vra/assistant", site).href}_`,
                    talk: `_Talk to our team: ${new URL("/demo", site).href}_`,
                })[kind] ?? "",
            Verdict: ({ kind }) =>
                `**${VERDICT_LABELS[kind as keyof typeof VERDICT_LABELS] ?? kind}**`,
        },
        images,
    })

    const startHere = mdxToMarkdown(startHereSource)
    const handouts = mdxToMarkdown(handoutsSource)
    // The FAQ lives in the front-matter (rendered by the page and its JSON-LD),
    // so the mirror writes it out too. Answers may hold in-page links.
    const faq = (post.data.faq ?? [])
        .map(({ question, answer }) => `**${question}**\n\n${faqAnswer(answer)}`)
        .join("\n\n")
    const questions = faq ? `\n## Questions\n\n${faq}\n` : ""
    return new Response(
        `# ${post.data.title}\n\n${startHere}\n${body}\n${handouts}${questions}`,
        {
            status: 200,
            headers: { "Content-Type": "text/markdown; charset=utf-8" },
        },
    )
}
