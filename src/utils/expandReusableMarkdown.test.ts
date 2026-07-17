import { describe, expect, it } from "vitest"
import expandReusableMarkdown from "./expandReusableMarkdown"

// These tests run against the real snippet library so they double as a
// guard that cataloged snippets stay resolvable.

describe("expandReusableMarkdown", () => {
    it("expands a ::snippet directive into the snippet's markdown", () => {
        const output = expandReusableMarkdown(
            'Before.\n\n::snippet{name="terraform-resource-ee"}\n\nAfter.',
        )
        expect(output).toContain("Before.")
        expect(output).toContain("only available on the")
        expect(output).toContain("After.")
        expect(output).not.toContain("::snippet")
    })

    it("expands snippets in subdirectories, including nested code fences", () => {
        const output = expandReusableMarkdown('::snippet{name="install/ee-docker-login"}')
        expect(output).toContain("docker login registry.kestra.io")
        expect(output).not.toContain("::snippet")
    })

    it("expands an empty file= code fence into the file's content", () => {
        const output = expandReusableMarkdown(
            "```bash file=src/contents/docs/_snippets/install/docker-run.sh\n```",
        )
        expect(output).toContain("kestra/kestra:latest server local")
        expect(output).not.toContain("file=")
        expect(output.startsWith("```bash\n")).toBe(true)
    })

    it("supports line ranges on code imports", () => {
        const output = expandReusableMarkdown(
            "```bash file=src/contents/docs/_snippets/install/docker-run.sh#L1-L2\n```",
        )
        expect(output).toContain("docker run")
        expect(output).toContain("--name kestra")
        expect(output).not.toContain("server local")
    })

    it("leaves reuse syntax inside code fences untouched (docs about the syntax)", () => {
        const source = [
            "````markdown",
            '::snippet{name="worker-groups-cloud"}',
            "",
            "```bash file=src/contents/docs/_snippets/install/docker-run.sh",
            "```",
            "````",
            "",
            "```markdown",
            '::snippet{name="terraform-resource-ee"}',
            "```",
        ].join("\n")
        expect(expandReusableMarkdown(source)).toBe(source)
    })

    it("leaves markdown without reuse syntax byte-identical", () => {
        const source = "# Title\n\nSome `inline code` and a [link](/docs/enterprise).\n\n```bash\necho hi\n```\n"
        expect(expandReusableMarkdown(source)).toBe(source)
    })

    it("throws on unknown snippets rather than serving broken content", () => {
        expect(() => expandReusableMarkdown('::snippet{name="nope-not-real"}')).toThrow()
    })
})
