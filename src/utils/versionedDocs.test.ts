import { describe, it, expect } from "vitest"
import {
    VERSIONED_DOCS_PATH,
    apiDocPath,
    docVersions,
    frontmatterField,
    parseHomePageButtons,
    stripFrontmatter,
    stripUnsupportedMdc,
    versionedHref,
    versionSelectOptions,
    type DocVersion,
} from "./versionedDocs"

describe("VERSIONED_DOCS_PATH", () => {
    it("matches a bare version home", () => {
        const m = VERSIONED_DOCS_PATH.exec("/docs/1.3")
        expect(m?.[1]).toBe("1.3")
        expect(m?.[2]).toBeUndefined()
    })

    it("matches a version with a sub-path", () => {
        const m = VERSIONED_DOCS_PATH.exec("/docs/1.3/tutorial/inputs")
        expect(m?.[1]).toBe("1.3")
        expect(m?.[2]).toBe("/tutorial/inputs")
    })

    it("does NOT match a latest docs path (so it isn't shadowed)", () => {
        expect(VERSIONED_DOCS_PATH.test("/docs/tutorial")).toBe(false)
        expect(VERSIONED_DOCS_PATH.test("/docs/tutorial/inputs")).toBe(false)
        expect(VERSIONED_DOCS_PATH.test("/docs")).toBe(false)
    })

    it("does NOT match a partial version", () => {
        expect(VERSIONED_DOCS_PATH.test("/docs/1")).toBe(false)
    })
})

describe("apiDocPath", () => {
    it("builds the home URL with patch .0", () => {
        expect(apiDocPath("1.3", "")).toBe("/docs/docs/versions/1.3.0")
    })

    it("builds a sub-path URL", () => {
        expect(apiDocPath("1.3", "tutorial/inputs")).toBe(
            "/docs/docs/tutorial/inputs/versions/1.3.0",
        )
    })

    it("trims surrounding slashes from the path", () => {
        expect(apiDocPath("0.19", "/tutorial/inputs/")).toBe(
            "/docs/docs/tutorial/inputs/versions/0.19.0",
        )
    })
})

describe("docVersions", () => {
    const raw = [
        { version: "1.3.0" },
        { version: "1.3.1" }, // dedup to 1.3
        { version: "1.2.0" },
        { version: "0.20.0" },
        { version: "0.19.0" },
        { version: "0.18.0" }, // dropped: before versioned docs
        { version: "0.2.0" }, // float-trap: 0.2 looks > 0.19 but is OLDER
        { version: "not-a-version" },
    ]

    it("keeps only >= 0.19, deduped to MAJOR.MINOR, newest first", () => {
        expect(docVersions(raw).map((v) => v.label)).toEqual([
            "1.3",
            "1.2",
            "0.20",
            "0.19",
        ])
    })

    it("excludes the 0.2.x float trap", () => {
        expect(docVersions([{ version: "0.2.0" }])).toEqual([])
    })

    it("includes the 0.19 boundary", () => {
        expect(docVersions([{ version: "0.19.5" }]).map((v) => v.label)).toEqual(
            ["0.19"],
        )
    })

    it("parses major/minor as integers", () => {
        expect(docVersions([{ version: "1.10.0" }])[0]).toEqual({
            label: "1.10",
            major: 1,
            minor: 10,
        })
    })
})

describe("versionSelectOptions", () => {
    const versions: DocVersion[] = [
        { label: "1.3", major: 1, minor: 3 },
        { label: "1.2", major: 1, minor: 2 },
    ]

    it("folds the newest version into Latest (X) and lists older ones", () => {
        expect(versionSelectOptions(versions, null, "tutorial/inputs")).toEqual([
            {
                value: "/docs/tutorial/inputs",
                label: "Latest (1.3)",
                selected: true,
            },
            {
                value: "/docs/1.2/tutorial/inputs",
                label: "1.2",
                selected: false,
            },
        ])
    })

    it("marks an older current version selected (not Latest)", () => {
        const opts = versionSelectOptions(versions, "1.2", "tutorial/inputs")
        expect(opts.find((o) => o.selected)?.label).toBe("1.2")
        expect(opts[0].selected).toBe(false)
    })

    it("selects Latest when viewing the newest version", () => {
        const opts = versionSelectOptions(versions, "1.3", "tutorial/inputs")
        expect(opts[0]).toEqual({
            value: "/docs/tutorial/inputs",
            label: "Latest (1.3)",
            selected: true,
        })
        expect(opts.some((o) => o.label === "1.3")).toBe(false)
    })

    it("uses /docs (no suffix) for the home path", () => {
        expect(versionSelectOptions(versions, null, "")).toEqual([
            { value: "/docs", label: "Latest (1.3)", selected: true },
            { value: "/docs/1.2", label: "1.2", selected: false },
        ])
    })

    it("returns only Latest when there are no versions", () => {
        expect(versionSelectOptions([], null, "x")).toEqual([
            { value: "/docs/x", label: "Latest", selected: true },
        ])
    })
})

describe("versionedHref", () => {
    it("re-roots a latest sub-path under the version", () => {
        expect(versionedHref("1.3", "/docs/tutorial/inputs")).toBe(
            "/docs/1.3/tutorial/inputs",
        )
    })

    it("maps the docs home to the version home", () => {
        expect(versionedHref("1.3", "/docs")).toBe("/docs/1.3")
    })
})

describe("frontmatterField", () => {
    const md = `---
title: "Add Inputs to Kestra Workflows"
h1: Make Flows Dynamic
description: 'Single quoted'
---
# Body`

    it("reads a double-quoted value, unwrapping quotes", () => {
        expect(frontmatterField(md, "title")).toBe(
            "Add Inputs to Kestra Workflows",
        )
    })

    it("reads an unquoted value", () => {
        expect(frontmatterField(md, "h1")).toBe("Make Flows Dynamic")
    })

    it("unwraps single quotes", () => {
        expect(frontmatterField(md, "description")).toBe("Single quoted")
    })

    it("returns undefined for a missing field", () => {
        expect(frontmatterField(md, "missing")).toBeUndefined()
    })
})

describe("stripFrontmatter", () => {
    it("removes a leading frontmatter block", () => {
        expect(stripFrontmatter("---\ntitle: x\n---\n# Body")).toBe("# Body")
    })

    it("leaves body-only markdown untouched", () => {
        expect(stripFrontmatter("# Body\ntext")).toBe("# Body\ntext")
    })

    it("handles CRLF frontmatter", () => {
        expect(stripFrontmatter("---\r\ntitle: x\r\n---\r\n# Body")).toBe(
            "# Body",
        )
    })
})

describe("parseHomePageButtons", () => {
    it("extracts the buttons JSON from a :buttons='[...]' block", () => {
        const md = `Welcome.

:::HomePageButtons{ :buttons='[{"label":"Quickstart →","href":"/docs/quickstart#start-kestra"},{"label":"Why Kestra?","href":"/docs/why-kestra"}]'}
:::

More.`
        expect(parseHomePageButtons(md)).toEqual([
            { label: "Quickstart →", href: "/docs/quickstart#start-kestra" },
            { label: "Why Kestra?", href: "/docs/why-kestra" },
        ])
    })

    it("returns null when there is no HomePageButtons block", () => {
        expect(parseHomePageButtons("# Title\n\ntext")).toBeNull()
    })

    it("returns null on malformed JSON instead of throwing", () => {
        const md = `:::HomePageButtons{ :buttons='[{bad}]'}\n:::`
        expect(parseHomePageButtons(md)).toBeNull()
    })
})

describe("stripUnsupportedMdc", () => {
    it("removes an empty-bodied bespoke component block", () => {
        expect(stripUnsupportedMdc(`:::WhatsNew{title="x"}\n:::`).trim()).toBe("")
    })

    it("removes a HomePageButtons block, leaving no leak", () => {
        expect(stripUnsupportedMdc(`:::HomePageButtons{ :buttons='[]'}\n:::`).trim()).toBe(
            "",
        )
    })

    it("preserves a container directive that has a body (alert)", () => {
        const md = `:::alert{type="info"}\nHello body\n:::`
        expect(stripUnsupportedMdc(md)).toBe(md)
    })

    it("preserves a collapse block with a body", () => {
        const md = `:::collapse{title="More"}\nsome content\n:::`
        expect(stripUnsupportedMdc(md)).toBe(md)
    })

    it("leaves a leaf directive (::badge) untouched", () => {
        const md = `::badge{version=">=0.15"}`
        expect(stripUnsupportedMdc(md)).toBe(md)
    })

    it("does not disturb the surrounding markdown", () => {
        const md = `# Title\n\n:::HomePageHeader{}\n:::\n\nReal paragraph.`
        const out = stripUnsupportedMdc(md)
        expect(out).toContain("# Title")
        expect(out).toContain("Real paragraph.")
        expect(out).not.toContain("HomePageHeader")
    })
})
