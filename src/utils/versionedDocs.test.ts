import { describe, it, expect } from "vitest"
import {
    VERSIONED_DOCS_PATH,
    apiDocPath,
    buildDocTree,
    currentDocKey,
    docChildHref,
    docVersions,
    directDocChildren,
    docLinkBaseDir,
    frontmatterField,
    plainDocText,
    prevNextDocs,
    isRelativeDocHref,
    isVersionedAssetRef,
    resolveVersionedDocLink,
    versionedAssetUrl,
    parseHomePageButtons,
    stripFrontmatter,
    stripUnsupportedMdc,
    versionedHref,
    versionSelectOptions,
    type DocChildren,
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

describe("isVersionedAssetRef", () => {
    it("matches a root-absolute path with a file extension", () => {
        expect(isVersionedAssetRef("/docs/tutorial/x.png")).toBe(true)
        expect(isVersionedAssetRef("/autocompletion.gif")).toBe(true)
        expect(isVersionedAssetRef("/docs/a/b.c.svg")).toBe(true)
    })

    it("strips a query/hash before checking the extension", () => {
        expect(isVersionedAssetRef("/docs/x.png?v=2")).toBe(true)
        expect(isVersionedAssetRef("/docs/x.png#frag")).toBe(true)
    })

    it("leaves external and protocol-relative refs alone", () => {
        expect(isVersionedAssetRef("https://cdn.example/x.png")).toBe(false)
        expect(isVersionedAssetRef("//cdn.example/x.png")).toBe(false)
        expect(isVersionedAssetRef("data:image/png;base64,AAAA")).toBe(false)
    })

    it("leaves relative refs and extension-less paths alone", () => {
        expect(isVersionedAssetRef("./x.png")).toBe(false)
        expect(isVersionedAssetRef("../x.png")).toBe(false)
        expect(isVersionedAssetRef("/docs/tutorial/inputs")).toBe(false)
        expect(isVersionedAssetRef("")).toBe(false)
    })
})

describe("versionedAssetUrl", () => {
    const api = "https://api.kestra.io/v1"

    it("doubles 'docs' for a /docs-rooted asset (in-app domain prepend)", () => {
        expect(versionedAssetUrl(api, "1.0", "/docs/tutorial/x.png")).toBe(
            "https://api.kestra.io/v1/docs/docs/tutorial/x.png/versions/1.0.0",
        )
    })

    it("keeps a single 'docs' for a bare-root asset", () => {
        expect(versionedAssetUrl(api, "0.19", "/autocompletion.gif")).toBe(
            "https://api.kestra.io/v1/docs/autocompletion.gif/versions/0.19.0",
        )
    })
})

describe("isRelativeDocHref", () => {
    it("matches source-relative doc links", () => {
        expect(isRelativeDocHref("./01.fundamentals.md")).toBe(true)
        expect(isRelativeDocHref("../07.architecture/09.internal-storage.md")).toBe(true)
        expect(isRelativeDocHref("plugins/plugin-script-python/foo.md")).toBe(true)
    })

    it("leaves absolute, anchor and scheme'd hrefs alone", () => {
        expect(isRelativeDocHref("/docs/getting-started/quickstart")).toBe(false)
        expect(isRelativeDocHref("#start-kestra")).toBe(false)
        expect(isRelativeDocHref("https://kestra.io")).toBe(false)
        expect(isRelativeDocHref("mailto:hello@kestra.io")).toBe(false)
        expect(isRelativeDocHref("")).toBe(false)
    })
})

describe("docLinkBaseDir", () => {
    const children: DocChildren = {
        docs: { title: "Docs" },
        "docs/tutorial": { title: "Tutorial" },
        "docs/tutorial/fundamentals": { title: "Fundamentals" },
    }

    it("is the page itself for a directory index (has children)", () => {
        expect(docLinkBaseDir("tutorial", children)).toBe("tutorial")
    })

    it("is the parent for a leaf page", () => {
        expect(docLinkBaseDir("tutorial/fundamentals", children)).toBe("tutorial")
        expect(docLinkBaseDir("why-kestra", children)).toBe("")
    })

    it("is the root for the version home", () => {
        expect(docLinkBaseDir("", children)).toBe("")
    })
})

describe("resolveVersionedDocLink", () => {
    it("strips ordering prefixes and .md, resolving against the base dir", () => {
        expect(
            resolveVersionedDocLink("1.0", "tutorial", "../07.architecture/09.internal-storage.md"),
        ).toBe("/docs/1.0/architecture/internal-storage")
        expect(resolveVersionedDocLink("1.0", "tutorial", "./01.fundamentals.md")).toBe(
            "/docs/1.0/tutorial/fundamentals",
        )
    })

    it("resolves version-home links without dropping the version segment", () => {
        expect(
            resolveVersionedDocLink("0.19", "", "./01.getting-started/01.quickstart.md"),
        ).toBe("/docs/0.19/getting-started/quickstart")
    })

    it("drops index segments and keeps the anchor", () => {
        expect(
            resolveVersionedDocLink("1.0", "tutorial", "../expressions/index.md#syntax"),
        ).toBe("/docs/1.0/expressions#syntax")
    })

    it("clamps .. at the docs root", () => {
        expect(resolveVersionedDocLink("1.0", "", "../../foo.md")).toBe("/docs/1.0/foo")
    })

    it("maps a link to a directory index onto the version home", () => {
        expect(resolveVersionedDocLink("1.0", "getting-started", "../index.md")).toBe(
            "/docs/1.0",
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

describe("buildDocTree", () => {
    it("nests children under parents from the flat, full-path keys", () => {
        const children: DocChildren = {
            docs: { title: "Documentation" },
            "docs/getting-started": { title: "Getting Started" },
            "docs/getting-started/quickstart": { title: "Quickstart" },
        }
        const roots = buildDocTree(children)
        expect(roots.map((n) => n.path)).toEqual(["docs"])
        const docs = roots[0]
        expect(docs.children.map((n) => n.path)).toEqual([
            "docs/getting-started",
        ])
        expect(docs.children[0].children.map((n) => n.title)).toEqual([
            "Quickstart",
        ])
    })

    it("handles a child listed BEFORE its parent (lazy parent build)", () => {
        // The endpoint sometimes emits a child ahead of its parent. The parent
        // must still get its real title (not a humanized placeholder) and the
        // child must nest under it exactly once.
        const children: DocChildren = {
            "docs/ui/dashboard": { title: "Dashboard" },
            "docs/ui": { title: "User Interface" },
            docs: { title: "Documentation" },
        }
        const roots = buildDocTree(children)
        expect(roots.map((n) => n.path)).toEqual(["docs"])
        const ui = roots[0].children.find((n) => n.path === "docs/ui")
        expect(ui?.title).toBe("User Interface") // real title, not "Ui"
        expect(ui?.children.map((n) => n.path)).toEqual(["docs/ui/dashboard"])
    })

    it("humanizes a node whose entry carries no title", () => {
        const children = {
            docs: { title: "Documentation" },
            "docs/work-flow": { title: "" },
            "docs/work-flow/tasks": { title: "Tasks" },
        } as DocChildren
        const roots = buildDocTree(children)
        const parent = roots[0].children[0]
        expect(parent.path).toBe("docs/work-flow")
        expect(parent.title).toBe("Work Flow") // derived from the slug
        expect(parent.children.map((n) => n.title)).toEqual(["Tasks"])
    })

    it("preserves the input (nav) order among siblings", () => {
        const children: DocChildren = {
            docs: { title: "Documentation" },
            "docs/b": { title: "B" },
            "docs/a": { title: "A" },
            "docs/c": { title: "C" },
        }
        const roots = buildDocTree(children)
        expect(roots[0].children.map((n) => n.title)).toEqual(["B", "A", "C"])
    })

    it("drops hideSidebar pages and their subtree (matches the latest sidebar)", () => {
        const children: DocChildren = {
            docs: { title: "Documentation" },
            "docs/brand-assets": { title: "Brand Assets", hideSidebar: true },
            "docs/why-kestra": { title: "Why Kestra", hideSidebar: true },
            "docs/why-kestra/details": { title: "Details" },
            "docs/getting-started": { title: "Getting Started" },
        }
        const roots = buildDocTree(children)
        expect(roots[0].children.map((n) => n.path)).toEqual([
            "docs/getting-started",
        ])
    })

    it("returns [] for an empty map", () => {
        expect(buildDocTree({})).toEqual([])
    })
})

describe("directDocChildren", () => {
    const children: DocChildren = {
        docs: { title: "Docs" },
        "docs/a": { title: "A" },
        "docs/a/one": { title: "One" },
        "docs/a/two": { title: "Two", hideSidebar: true },
        "docs/a/one/deep": { title: "Deep" },
        "docs/b": { title: "B" },
    }

    it("lists only one-segment-deeper children in map order", () => {
        expect(directDocChildren(children, "docs/a").map((c) => c.key)).toEqual([
            "docs/a/one",
        ])
        expect(directDocChildren(children, "docs").map((c) => c.key)).toEqual([
            "docs/a",
            "docs/b",
        ])
    })

    it("returns empty for a leaf or unknown key", () => {
        expect(directDocChildren(children, "docs/b")).toEqual([])
        expect(directDocChildren(children, "docs/nope")).toEqual([])
    })
})

describe("prevNextDocs", () => {
    const children: DocChildren = {
        docs: { title: "Docs" },
        "docs/a": { title: "A" },
        "docs/hidden": { title: "H", hideSidebar: true },
        "docs/b": { title: "B" },
    }

    it("returns nav-order neighbours, skipping hidden pages", () => {
        const { prev, next } = prevNextDocs(children, "docs/a")
        expect(prev?.key).toBe("docs")
        expect(next?.key).toBe("docs/b")
        expect(next?.title).toBe("B")
    })

    it("omits prev at the start and next at the end", () => {
        expect(prevNextDocs(children, "docs").prev).toBeUndefined()
        expect(prevNextDocs(children, "docs/b").next).toBeUndefined()
    })

    it("returns nothing for an unknown page", () => {
        expect(prevNextDocs(children, "docs/nope")).toEqual({})
    })
})

describe("plainDocText", () => {
    it("unwraps markdown links and strips inline markers", () => {
        expect(
            plainDocText("Follow the [Quickstart Guide](./01.quickstart.md) to install `kestra` **now**."),
        ).toBe("Follow the Quickstart Guide to install kestra now.")
    })
})

describe("docChildHref", () => {
    it("maps the docs root to the version home", () => {
        expect(docChildHref("1.3", "docs")).toBe("/docs/1.3")
    })

    it("maps a nested key to its versioned URL", () => {
        expect(docChildHref("0.19", "docs/ui/dashboard")).toBe(
            "/docs/0.19/ui/dashboard",
        )
    })
})

describe("currentDocKey", () => {
    it("maps the version home (empty path) to the docs root key", () => {
        expect(currentDocKey("")).toBe("docs")
    })

    it("prefixes a sub-path with docs/ and trims slashes", () => {
        expect(currentDocKey("/ui/dashboard/")).toBe("docs/ui/dashboard")
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
