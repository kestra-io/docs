import { describe, expect, it } from "vitest"
import {
    docsSearchResults,
    type DocsIndex,
    type DocsPage,
} from "~/utils/search/docs"

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
        concepts: { title: "Concepts", order: 6, reference: false },
        "how-to-guides": {
            title: "How-to Guides",
            order: 15,
            reference: false,
        },
        terraform: { title: "Terraform", order: 13, reference: true },
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
    it("groups unfinished-word matches by section, the best match's section first", () => {
        expect(rows("secr")).toEqual([
            ["concepts/secret", true, 2],
            ["concepts/kv-store", false, 2],
            ["how-to-guides/kubernetes-secrets", true, 1],
            ["terraform/resources/namespace_secret", true, 1],
        ])
    })

    it("builds rows linking to the page, titled with its sidebar name", () => {
        expect(docsSearchResults(docs, "secr").results[0]).toMatchObject({
            url: "docs/concepts/secret",
            type: "DOCS",
            title: "Secrets",
        })
    })

    it("lists the sections in sidebar order before anything is typed, minus reference ones", () => {
        const withRoots = {
            ...docs,
            pages: [
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
