import { describe, expect, it } from "vitest"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import { VFile } from "vfile"
import { readFileSync } from "node:fs"
import remarkGlossaryLinks, { parseGlossary, type GlossaryTerm } from "./index"

const DOC = "/repo/src/contents/docs/concepts/index.md"
const GLOSSARY = "/repo/src/contents/docs/glossary/index.md"

const TERMS: GlossaryTerm[] = [
    { term: "Tasks", anchor: "tasks", definition: "a unit of work." },
    { term: "Task runner", anchor: "task-runner", definition: "where a task runs." },
    { term: "Time To Live (TTL)", anchor: "ttl", definition: "how long a value is kept." },
    { term: "Instance", anchor: "instance", definition: "a Kestra deployment." },
]

async function render(md: string, path = DOC) {
    const out = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkGlossaryLinks, { terms: TERMS })
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(new VFile({ path, value: md }))
    return String(out)
}

const link = (anchor: string, text: string, title: string) =>
    `<a href="/docs/glossary#${anchor}" title="${title}">${text}</a>`

describe("remarkGlossaryLinks", () => {
    it("links only the first occurrence of a term, keeping its casing", async () => {
        const html = await render("A Task calls a task.\n\nAnother task.")
        expect(html).toContain(`A ${link("tasks", "Task", "a unit of work.")} calls a task.`)
        expect(html.match(/<a /g)).toHaveLength(1)
    })

    it("prefers the longest term at a position and accepts plurals and aliases", async () => {
        const html = await render("Task runners run tasks; set a TTL.")
        expect(html).toContain(link("task-runner", "Task runners", "where a task runs."))
        expect(html).toContain(link("tasks", "tasks", "a unit of work."))
        expect(html).toContain(link("ttl", "TTL", "how long a value is kept."))
    })

    it("leaves headings, code, existing links, table headers and hyphenated words alone", async () => {
        const html = await render(
            [
                "# Tasks",
                "",
                "`task` and [task](/x) and task-runner config.",
                "",
                "| Task | Value |",
                "| --- | --- |",
                "| task | 1 |",
                "",
                "```yaml",
                "task: a",
                "```",
            ].join("\n"),
        )
        expect(html.match(/glossary#/g)).toHaveLength(1)
        expect(html).toContain(`<td>${link("tasks", "task", "a unit of work.")}</td>`)
    })

    it("skips another product's noun and idioms, but not Kestra's or a sentence start", async () => {
        const html = await render("The Slack task is not ours. Task one.")
        expect(html).toContain(`ours. ${link("tasks", "Task", "a unit of work.")} one.`)
        expect(html.match(/<a /g)).toHaveLength(1)
        expect(await render("For instance, nothing.")).not.toContain("glossary#")
        expect(await render("A Kestra instance.")).toContain("glossary#instance")
    })

    it("does nothing outside the docs or on the glossary page itself", async () => {
        const blog = await render("A task.", "/repo/src/contents/blogs/post/index.md")
        const glossary = await render("A task.", GLOSSARY)
        expect(blog).not.toContain("glossary#")
        expect(glossary).not.toContain("glossary#")
    })
})

describe("parseGlossary", () => {
    it("reads nested entries and keeps the first sentence as the definition", () => {
        const terms = parseGlossary(
            [
                '<span id="apps"></span>',
                "- [Apps](#apps) - custom UIs for [workflows](../flows/index.md). See more.",
                '    <span id="form-apps"></span>',
                "    - [Form Apps](#form-apps) - forms that trigger flows, e.g. `x`. Second.",
                "Not an entry.",
            ].join("\n"),
        )
        expect(terms).toEqual([
            { term: "Apps", anchor: "apps", definition: "custom UIs for workflows." },
            { term: "Form Apps", anchor: "form-apps", definition: "forms that trigger flows, e.g. x." },
        ])
    })

    it("reads the real glossary, which the site build depends on", () => {
        const glossary = readFileSync(
            new URL("../../../contents/docs/glossary/index.md", import.meta.url),
            "utf8",
        )
        const anchors = parseGlossary(glossary).map((entry) => entry.anchor)
        expect(anchors.length).toBeGreaterThan(30)
        expect(anchors).toContain("namespace")
    })
})
