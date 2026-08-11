import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

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
        return `# ${title}\n\nURL: ${url}\n${description}\n${doc.body ?? ""}\n\n---\n`
    })

    const apiReference = `
# REST API Reference (Machine-Readable)

The complete API reference is available as standalone Markdown files generated from the OpenAPI specifications:

- Open Source API: https://kestra.io/api-reference/kestra.md
- Enterprise API: https://kestra.io/api-reference/kestra-ee.md

These files contain all endpoints, request/response schemas, parameters, and examples.

---
`

    return new Response(header + sections.join("\n") + apiReference, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    })
}
