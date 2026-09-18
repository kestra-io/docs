import { describe, expect, it } from "vitest"
import { resolveRelativeDocLink } from "./resolve-doc-link"

const leaf = {
    basename: "internal-error.md",
    dirname: "/repo/src/contents/docs/api-reference/03.problems",
}
const index = {
    basename: "index.md",
    dirname: "/repo/src/contents/docs/05.workflow-components/07.triggers/06.mcp-tool-trigger",
}

describe("resolveRelativeDocLink", () => {
    it("keeps the previous resolution for regular relative links", () => {
        expect(resolveRelativeDocLink("./realtime-trigger/index.md", index)).toBe(
            "mcp-tool-trigger/realtime-trigger",
        )
        expect(resolveRelativeDocLink("../02.flow-trigger/index.md#x", index)).toBe(
            "./flow-trigger#x",
        )
        expect(resolveRelativeDocLink("./resource-expired.md", leaf)).toBe("./resource-expired")
        expect(resolveRelativeDocLink("/docs/absolute", leaf)).toBe("/docs/absolute")
        expect(resolveRelativeDocLink("https://example.com", index)).toBe("https://example.com")
    })

    it("points ./index.md from a leaf file at the directory URL", () => {
        // /docs/api-reference/problems/internal-error + ../problems -> /docs/api-reference/problems
        expect(resolveRelativeDocLink("./index.md", leaf)).toBe("../problems")
    })

    it("points ../index.md from an index file at the parent directory URL", () => {
        // /docs/workflow-components/triggers/mcp-tool-trigger + ../triggers
        expect(resolveRelativeDocLink("../index.mdx#trigger-common-properties", index)).toBe(
            "../triggers#trigger-common-properties",
        )
    })

    it("climbs one extra level for a leaf file and strips numeric prefixes", () => {
        // /docs/api-reference/problems/internal-error + ../../api-reference -> /docs/api-reference
        expect(resolveRelativeDocLink("../index.md", leaf)).toBe("../../api-reference")
        expect(resolveRelativeDocLink("../../index.md", index)).toBe("../../workflow-components")
    })

    it("still treats ./index.md from an index file as before", () => {
        expect(resolveRelativeDocLink("./index.md", index)).toBe("mcp-tool-trigger")
    })
})
