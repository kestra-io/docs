import type { APIRoute, ImageMetadata } from "astro"
import { getEntry } from "astro:content"
import { mdxToMarkdown } from "~/components/vra-migration-guide/mdxToMarkdown"
import {
    VERDICT_LABELS,
    type VerdictKind,
} from "~/components/vra-migration-guide/blocks/verdict"
import { resolveTotalPluginsPlaceholder } from "~/utils/plugins/pluginCount"
import startHereSource from "~/components/vra-migration-guide/StartHere.mdx?raw"
import handoutsSource from "~/components/vra-migration-guide/ReferenceHandouts.mdx?raw"

/** The guide's figures, keyed by the relative path the MDX uses. */
const FIGURES = import.meta.glob<ImageMetadata>(
    "../../../contents/resources/vra-migration-guide/*.webp",
    { eager: true, import: "default" },
)

/**
 * The guide's markdown variant. Its entry sets `href`, which excludes it from
 * the per-topic endpoint, so it needs its own.
 */
export const GET: APIRoute = async ({ site, url }) => {
    const post = await getEntry("resources", "vra-migration-guide")
    if (!post) return new Response("Not found", { status: 404 })
    const source = await resolveTotalPluginsPlaceholder(
        (post.body ?? "").replaceAll("{props.totalPlugins}", "{totalPlugins}"),
    )
    const link = (path: string) => new URL(path, site).href
    const faq = (post.data.faq ?? [])
        .map(
            ({ question, answer }) =>
                `**${question}**\n\n${mdxToMarkdown(answer).trimEnd()}`,
        )
        .join("\n\n")

    const body = [
        mdxToMarkdown(startHereSource),
        mdxToMarkdown(source, {
            replacements: {
                GuideCta: ({ kind }) =>
                    ({
                        calc: `_Interactive: work out your payback in the calculator at ${link("/resources/migration/vra/payback")}._`,
                        assistant: `_Get the Migration Assistant for vRA: ${link("/resources/migration/vra/assistant")}_`,
                        talk: `_Talk to our team: ${link("/demo")}_`,
                    })[kind] ?? "",
                Verdict: ({ kind }) =>
                    `**${VERDICT_LABELS[kind as VerdictKind] ?? kind}**`,
            },
            /**
             * Against the request origin rather than `site`, so the dev
             * server's image URLs stay reachable.
             */
            images: Object.fromEntries(
                Object.entries(FIGURES).map(([path, image]) => [
                    `./${path.split("/").pop()}`,
                    new URL(image.src, url.origin).href,
                ]),
            ),
        }),
        mdxToMarkdown(handoutsSource),
        ...(faq ? [`## Questions\n\n${faq}\n`] : []),
    ].join("\n")

    return new Response(`# ${post.data.title}\n\n${body}`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
