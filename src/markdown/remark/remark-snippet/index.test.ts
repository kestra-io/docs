import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import remarkGfm from "remark-gfm"
import remarkDirective from "remark-directive"
import remarkSnippet from "./index"

let snippetsDir: string

function render(markdown: string) {
    return unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkDirective)
        .use(remarkSnippet, { snippetsDir })
        .use(remarkStringify)
        .processSync(markdown)
        .toString()
}

beforeAll(() => {
    snippetsDir = fs.mkdtempSync(path.join(os.tmpdir(), "snippets-"))
    fs.writeFileSync(
        path.join(snippetsDir, "ee-notice.md"),
        ':::alert{type="info"}\nThis resource is only available on the [Enterprise Edition](https://kestra.io/enterprise)\n:::\n',
    )
    fs.mkdirSync(path.join(snippetsDir, "install"))
    fs.writeFileSync(
        path.join(snippetsDir, "install", "nested.md"),
        "Some **install** steps.\n\n::snippet{name=\"ee-notice\"}\n",
    )
    fs.writeFileSync(path.join(snippetsDir, "cycle.md"), '::snippet{name="cycle"}\n')
})

afterAll(() => {
    fs.rmSync(snippetsDir, { recursive: true, force: true })
})

describe("remark-snippet", () => {
    it("expands a snippet in place, preserving surrounding content", () => {
        const output = render('Before.\n\n::snippet{name="ee-notice"}\n\nAfter.\n')
        expect(output).toContain("Before.")
        expect(output).toContain("only available on the")
        expect(output).toContain("After.")
        expect(output).not.toContain("::snippet")
    })

    it("expands snippets from subdirectories and nested includes", () => {
        const output = render('::snippet{name="install/nested"}\n')
        expect(output).toContain("install")
        expect(output).toContain("only available on the")
        expect(output).not.toContain("::snippet")
    })

    it("keeps directive content parseable by downstream plugins", () => {
        // The alert container inside the snippet must survive as a directive
        // node so remark-custom-elements can transform it later.
        const processor = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkDirective)
            .use(remarkSnippet, { snippetsDir })
        const tree: any = processor.runSync(processor.parse('::snippet{name="ee-notice"}\n'))
        const types = tree.children.map((child: any) => child.type)
        expect(types).toContain("containerDirective")
    })

    it("throws on an unknown snippet name", () => {
        expect(() => render('::snippet{name="does-not-exist"}\n')).toThrow(/not found/)
    })

    it("throws on a missing or malformed name attribute", () => {
        expect(() => render("::snippet\n")).toThrow(/name attribute/)
        expect(() => render('::snippet{name="../escape"}\n')).toThrow(/name attribute/)
    })

    it("throws on snippet cycles instead of looping forever", () => {
        expect(() => render('::snippet{name="cycle"}\n')).toThrow(/depth/)
    })
})
