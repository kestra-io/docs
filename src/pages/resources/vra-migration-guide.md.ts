import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { mdxToMarkdown } from "~/components/vra-migration-guide/mdxToMarkdown"
import startHereSource from "~/components/vra-migration-guide/StartHere.mdx?raw"
import handoutsSource from "~/components/vra-migration-guide/ReferenceHandouts.mdx?raw"

// Markdown variant of the vRA migration guide, like
// airflow-2-eol-whitepaper.md.ts. The entry sets `href`, which excludes it
// from the per-topic endpoint, so it needs its own. The body is MDX, so the
// component markup is stripped and the calculators point to the web page.
export const GET: APIRoute = async ({ site }) => {
    const PAGE = new URL("/resources/vra-migration-guide", site).href
    const post = await getEntry("resources", "vra-migration-guide")
    if (!post) return new Response("Not found", { status: 404 })
    const body = mdxToMarkdown(post.body ?? "", {
        CalculatorFunnel: `_Interactive: size your own workflow counts in the calculator at ${PAGE}#section-3-2-2._`,
        CalculatorPayback: `_Interactive: work out your payback in the calculator at ${PAGE}#section-7-2._`,
    })

    const startHere = mdxToMarkdown(startHereSource)
    const handouts = mdxToMarkdown(handoutsSource)
    return new Response(
        `# ${post.data.title}\n\n${startHere}\n${body}\n${handouts}`,
        {
            status: 200,
            headers: { "Content-Type": "text/markdown; charset=utf-8" },
        },
    )
}
