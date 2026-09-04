import { describe, it, expect, vi } from "vitest"
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
    isRelativeDocHref,
    isVersionedAssetRef,
    resolveVersionedDocLink,
    versionedAssetUrl,
    decideVersionedRoute,
    isAssetShapedDocPath,
    missingDocFallbackHref,
    resolveVersionSwitchHref,
    stripFrontmatter,
    switchVersionHref,
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
        expect(versionSelectOptions(versions, null)).toEqual([
            { version: "", label: "Latest (1.3)", selected: true },
            { version: "1.2", label: "1.2", selected: false },
        ])
    })

    it("marks an older current version selected (not Latest)", () => {
        const opts = versionSelectOptions(versions, "1.2")
        expect(opts.find((o) => o.selected)?.label).toBe("1.2")
        expect(opts[0].selected).toBe(false)
    })

    it("selects Latest when viewing the newest version", () => {
        const opts = versionSelectOptions(versions, "1.3")
        expect(opts[0]).toEqual({ version: "", label: "Latest (1.3)", selected: true })
        expect(opts.some((o) => o.label === "1.3")).toBe(false)
    })

    it("returns only Latest when there are no versions", () => {
        expect(versionSelectOptions([], null)).toEqual([
            { version: "", label: "Latest", selected: true },
        ])
    })
})

describe("switchVersionHref", () => {
    it("re-roots a latest sub-path under the version", () => {
        expect(switchVersionHref("1.3", "/docs/tutorial/inputs")).toBe(
            "/docs/1.3/tutorial/inputs",
        )
    })

    it("maps the docs home to the version home", () => {
        expect(switchVersionHref("1.3", "/docs")).toBe("/docs/1.3")
    })

    it("re-roots a sub-path from one version directly to another", () => {
        expect(switchVersionHref("1.3", "/docs/1.2/tutorial/inputs")).toBe(
            "/docs/1.3/tutorial/inputs",
        )
    })

    it("switches from a version home to another version home", () => {
        expect(switchVersionHref("1.3", "/docs/1.2")).toBe("/docs/1.3")
    })

    it("switches from a version back to latest", () => {
        expect(switchVersionHref("", "/docs/1.2/tutorial/inputs")).toBe(
            "/docs/tutorial/inputs",
        )
    })

    it("switches from a version home back to the latest home", () => {
        expect(switchVersionHref("", "/docs/1.2")).toBe("/docs")
    })

    it("falls back to the bare path for a malformed version instead of embedding it", () => {
        expect(switchVersionHref("javascript:alert(1)", "/docs/1.2/tutorial/inputs")).toBe(
            "/docs/tutorial/inputs",
        )
    })
})

describe("resolveVersionSwitchHref", () => {
    const probeWith = (status: number) =>
        vi.fn(async () => ({ status })) as unknown as typeof fetch & ReturnType<typeof vi.fn>

    it("returns a versioned target without probing", async () => {
        const probe = probeWith(404)
        expect(await resolveVersionSwitchHref("1.3", "/docs/1.2/tutorial", probe)).toBe(
            "/docs/1.3/tutorial",
        )
        expect(probe).not.toHaveBeenCalled()
    })

    it("HEAD-probes the latest target and keeps it when it exists", async () => {
        const probe = probeWith(200)
        expect(await resolveVersionSwitchHref("", "/docs/1.2/tutorial", probe)).toBe(
            "/docs/tutorial",
        )
        expect(probe).toHaveBeenCalledWith(
            "/docs/tutorial",
            expect.objectContaining({ method: "HEAD" }),
        )
    })

    it("falls back to the docs home when the latest target 404s", async () => {
        expect(
            await resolveVersionSwitchHref("", "/docs/1.2/removed-page", probeWith(404)),
        ).toBe("/docs")
    })

    it("keeps the direct target on a non-404 probe status, like the middleware's 404-vs-transient split", async () => {
        expect(await resolveVersionSwitchHref("", "/docs/1.2/tutorial", probeWith(503))).toBe(
            "/docs/tutorial",
        )
    })

    it("still attempts direct navigation when the probe itself fails", async () => {
        const fetchThrows = (async () => {
            throw new Error("network down")
        }) as unknown as typeof fetch
        expect(await resolveVersionSwitchHref("", "/docs/1.2/tutorial", fetchThrows)).toBe(
            "/docs/tutorial",
        )
    })

    it("skips the probe when the target is already the docs home", async () => {
        const probe = probeWith(404)
        expect(await resolveVersionSwitchHref("", "/docs/1.2", probe)).toBe("/docs")
        expect(probe).not.toHaveBeenCalled()
    })
})

describe("decideVersionedRoute", () => {
    const versions: DocVersion[] = [
        { label: "1.3", major: 1, minor: 3 },
        { label: "1.2", major: 1, minor: 2 },
    ]
    const base = { path: "tutorial", isMarkdownRequest: false, search: "", versionsOk: true }

    it("passes an unknown version through to the natural 404", () => {
        expect(decideVersionedRoute({ ...base, version: "9.9", versions })).toEqual({
            kind: "pass",
        })
    })

    it("reports unavailable when the version list itself could not be fetched", () => {
        expect(
            decideVersionedRoute({ ...base, version: "1.2", versions: [], versionsOk: false }),
        ).toEqual({ kind: "unavailable" })
    })

    it("still passes an unknown version through when a stale list is available", () => {
        expect(
            decideVersionedRoute({ ...base, version: "9.9", versions, versionsOk: false }),
        ).toEqual({ kind: "pass" })
    })

    it("redirects the newest version to the canonical latest page, keeping the query", () => {
        expect(
            decideVersionedRoute({ ...base, version: "1.3", versions, search: "?ref=changelog" }),
        ).toEqual({ kind: "redirect", location: "/docs/tutorial?ref=changelog" })
    })

    it("redirects the newest version home to the docs home, honoring the .md contract", () => {
        expect(
            decideVersionedRoute({
                ...base,
                version: "1.3",
                path: "",
                isMarkdownRequest: true,
                versions,
            }),
        ).toEqual({ kind: "redirect", location: "/docs.md" })
    })

    it("fetches the archived copy for an older known version", () => {
        expect(decideVersionedRoute({ ...base, version: "1.2", versions })).toEqual({
            kind: "fetch",
        })
    })
})

describe("missingDocFallbackHref", () => {
    it("falls back to the version home", () => {
        expect(missingDocFallbackHref("1.2", false, "")).toBe("/docs/1.2")
    })

    it("stays on the .md contract and keeps the query string", () => {
        expect(missingDocFallbackHref("1.2", true, "?ref=x")).toBe("/docs/1.2.md?ref=x")
    })
})

describe("isAssetShapedDocPath", () => {
    it("matches stale asset hotlinks", () => {
        expect(isAssetShapedDocPath("tutorial/x.png")).toBe(true)
        expect(isAssetShapedDocPath("x.mp4")).toBe(true)
        expect(isAssetShapedDocPath("fonts/a.woff2")).toBe(true)
    })

    it("does not match real pages, including digit-named migration guides", () => {
        expect(isAssetShapedDocPath("tutorial")).toBe(false)
        expect(isAssetShapedDocPath("migration-guide/0.19.0")).toBe(false)
        expect(isAssetShapedDocPath("migration-guide/1.10")).toBe(false)
        expect(isAssetShapedDocPath("")).toBe(false)
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

    it("ignores a body-level key: line inside a fenced YAML flow sample", () => {
        const withFlowSample = `---
title: Only Title
---
# Body

\`\`\`yaml
id: my-flow
namespace: company.team
description: This is a demo flow
\`\`\``
        expect(frontmatterField(withFlowSample, "description")).toBeUndefined()
    })

    it("prefers the real frontmatter value over a same-key body match", () => {
        const withFlowSample = `---
title: Only Title
description: Real description
---
# Body

\`\`\`yaml
description: This is a demo flow
\`\`\``
        expect(frontmatterField(withFlowSample, "description")).toBe(
            "Real description",
        )
    })

    it("handles CRLF frontmatter", () => {
        const crlf = "---\r\ntitle: CRLF Title\r\n---\r\n# Body"
        expect(frontmatterField(crlf, "title")).toBe("CRLF Title")
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

    it("prefers sidebarTitle over the long SEO title, when present", () => {
        const children: DocChildren = {
            docs: { title: "Documentation" },
            "docs/quickstart": {
                title: "Kestra Quickstart Guide – Run Your First Workflow",
                sidebarTitle: "Quickstart",
            },
        }
        const roots = buildDocTree(children)
        expect(roots[0].children[0].title).toBe("Quickstart")
    })

    it("falls back to title when sidebarTitle is absent (older versions)", () => {
        const children: DocChildren = {
            docs: { title: "Documentation" },
            "docs/quickstart": { title: "Quickstart" },
        }
        const roots = buildDocTree(children)
        expect(roots[0].children[0].title).toBe("Quickstart")
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
