import { describe, expect, it } from "vitest"
import { markdownHeadings } from "~/utils/search/markdownHeadings"

describe("markdownHeadings", () => {
    it("lists the second-level headings as plain text", () => {
        const body =
            "# Title\n## Use `secret()` in a [flow](/docs/flows)\n### Deeper\n## **Rotate** keys"
        expect(markdownHeadings(body)).toEqual([
            "Use secret() in a flow",
            "Rotate keys",
        ])
    })

    it("skips comment lines inside code blocks", () => {
        const body = [
            "## Install",
            "```bash",
            "## Perform the GET request",
            "curl https://kestra.io",
            "```",
            "~~~~yaml",
            "## not a heading",
            "~~~",
            "## still in the block",
            "~~~~",
            "## Configure",
        ].join("\n")
        expect(markdownHeadings(body)).toEqual(["Install", "Configure"])
    })
})
