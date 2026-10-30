import { describe, expect, it, vi } from "vitest"
import { docAssetUrl, docSourceFile, latestDocLinkResolver } from "./latestDocLinks"

const fundamentals = docSourceFile("src/contents/docs/03.tutorial/01.fundamentals/index.md")
const fundamentalsUrl = "https://kestra.io/docs/tutorial/fundamentals"
const leaf = docSourceFile("src/contents/docs/api-reference/03.problems/internal-error.md")
const leafUrl = "https://kestra.io/docs/api-reference/problems/internal-error"

const noAssets = () => undefined

describe("docSourceFile", () => {
    it("splits a content entry path the way the remark pipeline sees it", () => {
        expect(fundamentals).toEqual({
            basename: "index.md",
            dirname: "src/contents/docs/03.tutorial/01.fundamentals",
        })
    })
})

describe("latestDocLinkResolver: page links", () => {
    const resolve = latestDocLinkResolver(fundamentalsUrl, fundamentals, noAssets)

    it("resolves the issue's dead link to the page the rendered <a> points at", () => {
        expect(resolve("../../01.quickstart/index.md")).toBe("https://kestra.io/docs/quickstart")
        expect(resolve("../../02.installation/index.mdx")).toBe("https://kestra.io/docs/installation")
    })

    it("keeps anchors and query strings", () => {
        expect(resolve("../../05.workflow-components/07.triggers/index.mdx#trigger-common-properties")).toBe(
            "https://kestra.io/docs/workflow-components/triggers#trigger-common-properties",
        )
        expect(resolve("./index.md?tab=2#x")).toBe("https://kestra.io/docs/tutorial/fundamentals?tab=2#x")
    })

    it("resolves siblings, children and ancestors of an index page", () => {
        expect(resolve("../05.flowable/index.md")).toBe("https://kestra.io/docs/tutorial/flowable")
        expect(resolve("./child/index.md")).toBe("https://kestra.io/docs/tutorial/fundamentals/child")
        expect(resolve("../index.md")).toBe("https://kestra.io/docs/tutorial")
        expect(resolve("../../index.mdx")).toBe("https://kestra.io/docs")
    })

    it("treats an extensionless or version-shaped target as a page", () => {
        expect(resolve("../../11.migration-guide/v0.19.0")).toBe(
            "https://kestra.io/docs/migration-guide/v0.19.0",
        )
        expect(resolve("./plugin-defaults-removed")).toBe(
            "https://kestra.io/docs/tutorial/fundamentals/plugin-defaults-removed",
        )
    })

    it("resolves from a leaf file one level up, like the HTML does", () => {
        const fromLeaf = latestDocLinkResolver(leafUrl, leaf, noAssets)
        expect(fromLeaf("./resource-expired.md")).toBe(
            "https://kestra.io/docs/api-reference/problems/resource-expired",
        )
        expect(fromLeaf("./index.md")).toBe("https://kestra.io/docs/api-reference/problems")
        expect(fromLeaf("../index.md")).toBe("https://kestra.io/docs/api-reference")
    })
})

describe("latestDocLinkResolver: assets", () => {
    const assets: Record<string, string> = {
        "src/contents/docs/03.tutorial/01.fundamentals/create-button-2-0.png":
            "/_astro/create-button-2-0.e1eiSacd.png",
        "src/contents/docs/03.tutorial/okta/sso.png": "/_astro/sso.Ab12Cd34.png",
    }
    const lookup = vi.fn((sourcePath: string) => assets[sourcePath])
    const resolve = latestDocLinkResolver(fundamentalsUrl, fundamentals, lookup)

    it("maps a colocated image to its served file, keyed by source path", () => {
        expect(resolve("./create-button-2-0.png")).toBe(
            "https://kestra.io/_astro/create-button-2-0.e1eiSacd.png",
        )
        expect(lookup).toHaveBeenLastCalledWith(
            "src/contents/docs/03.tutorial/01.fundamentals/create-button-2-0.png",
        )
    })

    it("walks up directories and keeps a hash or query", () => {
        expect(resolve("../okta/sso.png#zoom")).toBe("https://kestra.io/_astro/sso.Ab12Cd34.png#zoom")
    })

    it("leaves an asset the build doesn't serve as written", () => {
        expect(resolve("./missing.png")).toBeUndefined()
        expect(resolve("./clip.mp4")).toBeUndefined()
    })

    it("roots an absolute source path at the content directory", () => {
        const absolute = docSourceFile("/repo/src/contents/docs/03.tutorial/01.fundamentals/index.md")
        expect(latestDocLinkResolver(fundamentalsUrl, absolute, lookup)("./create-button-2-0.png")).toBe(
            "https://kestra.io/_astro/create-button-2-0.e1eiSacd.png",
        )
    })
})

describe("docAssetUrl", () => {
    it("knows the colocated doc images and nothing else", () => {
        expect(docAssetUrl("src/contents/docs/03.tutorial/01.fundamentals/create-button-2-0.png")).toEqual(
            expect.any(String),
        )
        expect(docAssetUrl("src/contents/docs/03.tutorial/01.fundamentals/index.md")).toBeUndefined()
        expect(docAssetUrl("src/contents/docs/nope.png")).toBeUndefined()
    })
})
