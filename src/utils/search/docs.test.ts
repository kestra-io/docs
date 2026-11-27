import { describe, expect, it, vi } from "vitest"
import {
    docsSearchResults,
    type DocsIndex,
    type DocsPage,
} from "~/utils/search/docs"

vi.mock("astro:env/client", () => ({ API_URL: "https://api.test/v1" }))

const page = (
    id: string,
    title: string,
    extra: Partial<DocsPage> = {},
): DocsPage => ({
    id,
    title,
    short: title,
    description: "",
    headings: [],
    ...extra,
})

const docs: DocsIndex = {
    sections: {
        concepts: {
            title: "Concepts",
            order: 6,
            sidebar: true,
            reference: false,
        },
        "how-to-guides": {
            title: "How-to Guides",
            order: 15,
            sidebar: true,
            reference: false,
        },
        terraform: {
            title: "Terraform",
            order: 13,
            sidebar: true,
            reference: true,
        },
    },
    pages: [
        page("concepts/namespace-files", "Namespace Files"),
        page("concepts/secret", "Secrets", {
            headings: ["Use a secret in a flow"],
        }),
        page("concepts/kv-store", "KV Store", {
            description: "Keep secrets apart from shared state",
        }),
        page("how-to-guides/kubernetes-secrets", "Pass Kubernetes Secrets"),
        page(
            "terraform/resources/namespace_secret",
            "Manage Namespace Secrets",
        ),
    ],
}

const rows = (query: string) =>
    docsSearchResults(docs, query).results.map((r) => [
        r.doc.id,
        r.doc.groupStart,
        r.doc.groupCount,
    ])

describe("docsSearchResults", () => {
    it("keeps the relevance order, grouping only consecutive pages of a section", () => {
        expect(rows("secr")).toEqual([
            ["concepts/secret", true, 1],
            ["how-to-guides/kubernetes-secrets", true, 1],
            ["terraform/resources/namespace_secret", true, 1],
            ["concepts/kv-store", true, 1],
        ])
    })

    it("puts an exact title first, a tutorial step after the reference page", () => {
        const withInputs: DocsIndex = {
            sections: {
                ...docs.sections,
                tutorial: {
                    title: "Tutorial",
                    order: 3,
                    sidebar: true,
                    reference: false,
                    guide: true,
                },
                "workflow-components": {
                    title: "Workflow Components",
                    order: 5,
                    sidebar: true,
                    reference: false,
                },
            },
            pages: [
                page("tutorial/outputs", "Pass Outputs Between Tasks", {
                    short: "Outputs",
                    headings: ["Use inputs and outputs"],
                }),
                page("tutorial/inputs", "Add Inputs to Kestra Workflows", {
                    short: "Inputs",
                }),
                page("workflow-components/reusable-inputs", "Reusable Inputs"),
                page("workflow-components/inputs", "Workflow Inputs", {
                    short: "Inputs",
                }),
            ],
        }
        const results = docsSearchResults(withInputs, "Inputs").results
        expect(results.map((r) => r.doc.id)).toEqual([
            "workflow-components/inputs",
            "tutorial/inputs",
            "workflow-components/reusable-inputs",
            "tutorial/outputs",
        ])
    })

    it("adds the pages only the full-text search found after the others", () => {
        const { total, results } = docsSearchResults(docs, "secr", [
            "docs/concepts/namespace-files",
            "docs/concepts/secret",
        ])
        expect(total).toBe(5)
        expect(results.at(-1)?.doc.id).toBe("concepts/namespace-files")
    })

    it("builds rows linking to the page, titled with its sidebar name", () => {
        expect(docsSearchResults(docs, "secr").results[0]).toMatchObject({
            url: "docs/concepts/secret",
            type: "DOCS",
            title: "Secrets",
        })
    })

    it("lists the sidebar's sections in its order before anything is typed, minus reference ones", () => {
        const withRoots = {
            sections: {
                ...docs.sections,
                "why-kestra": {
                    title: "Why Kestra",
                    order: 40,
                    sidebar: false,
                    reference: false,
                },
            },
            pages: [
                page("why-kestra", "Why Kestra"),
                page("terraform", "Terraform"),
                page("how-to-guides", "How-to Guides"),
                page("concepts", "Concepts"),
                ...docs.pages,
            ],
        }
        expect(
            docsSearchResults(withRoots, "").results.map((r) => r.doc.id),
        ).toEqual(["concepts", "how-to-guides"])
    })
})
