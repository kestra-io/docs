import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { mdxToMarkdown } from "~/components/vra-migration-guide/mdxToMarkdown"

// Markdown variant of the vRA migration guide, like
// airflow-2-eol-whitepaper.md.ts. The entry sets `href`, which excludes it
// from the per-topic endpoint, so it needs its own. The body is MDX, so the
// component markup is stripped and the calculators point to the web page.
const PAGE = "https://kestra.io/resources/vra-migration-guide"

export const GET: APIRoute = async () => {
    const post = await getEntry("resources", "vra-migration-guide")
    if (!post) return new Response("Not found", { status: 404 })
    const body = mdxToMarkdown(post.body ?? "", {
        CalculatorFunnel: `_Interactive: size your own workflow counts in the calculator at ${PAGE}#section-3-2-2._`,
        CalculatorPayback: `_Interactive: work out your payback in the calculator at ${PAGE}#section-7-2._`,
    })
    return new Response(`# ${post.data.title}\n\n${body}`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
