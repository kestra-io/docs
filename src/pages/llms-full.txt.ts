import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import expandReusableMarkdown from "~/utils/expandReusableMarkdown"

export const GET: APIRoute = async () => {
    const docs = await getCollection("docs")

    const sorted = docs.sort((a, b) => a.id.localeCompare(b.id))

    const header = `# Kestra Complete Documentation

> Full content snapshot of all Kestra documentation pages. For the curated index, see /llms.txt.
> Append .md to any kestra.io/docs/* URL to retrieve that page as plain Markdown.

Total pages: ${sorted.length}

---

`

    const sections = sorted.map((doc) => {
        const path = doc.id === "<index>" ? "" : `/${doc.id}`
        const url = `https://kestra.io/docs${path}`
        const title = doc.data.title
        const description = doc.data.description ? `\n> ${doc.data.description}\n` : ""
        return `# ${title}\n\nURL: ${url}\n${description}\n${expandReusableMarkdown(doc.body ?? "")}\n\n---\n`
    })

    return new Response(header + sections.join("\n"), {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    })
}
