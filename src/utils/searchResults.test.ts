import { describe, expect, it } from "vitest"
import { prepareSearchResults } from "~/utils/searchResults"

const blog = (overrides: Record<string, unknown> = {}) => ({
    url: "blogs/hello-assets",
    type: "BLOGS",
    title: "Hello, Assets: Unifies Orchestration, Catalogs, and Lineage",
    highlights: [],
    ...overrides,
})

const doc = (url: string, title: string) => ({ url, title, type: "DOCS" })

describe("prepareSearchResults", () => {
    it.each([
        {
            query: "Inputs",
            results: [
                doc("docs/how-to-guides/dynamic-inputs", "Create a Dynamic Dropdown for Inputs"),
                doc("docs/tutorial/inputs", "Add Inputs to Kestra Workflows"),
                doc(
                    "docs/workflow-components/reusable-inputs",
                    "Reusable Inputs in Kestra Enterprise",
                ),
                doc(
                    "docs/workflow-components/inputs",
                    "Workflow Inputs in Kestra: Declare and Pass Parameters",
                ),
                doc(
                    "docs/migration-guide/v0.15.0/inputs-name",
                    "Inputs name Renamed to id in Kestra 0.15.0",
                ),
            ],
            expected: "docs/workflow-components/inputs",
        },
        {
            query: "Apps",
            results: [
                doc("docs/terraform/resources/app", "Terraform: Manage Apps in Kestra"),
                doc(
                    "docs/enterprise/scalability/apps",
                    "Apps in Kestra Enterprise: Frontends for Flows",
                ),
            ],
            expected: "docs/enterprise/scalability/apps",
        },
        {
            query: "Triggers",
            results: [
                doc(
                    "docs/migration-guide/v2.0.0/trigger-conditions-redesign",
                    "Trigger Conditions Redesign",
                ),
                doc(
                    "docs/enterprise/governance/assets/tasks-and-triggers",
                    "Asset Tasks, Triggers, and Functions Reference",
                ),
                doc(
                    "docs/workflow-components/triggers/webhook-trigger",
                    "Webhook Trigger in Kestra – Start Flows via HTTP",
                ),
                doc(
                    "docs/workflow-components/triggers",
                    "Triggers in Kestra: Schedule, Events, Webhooks",
                ),
            ],
            expected: "docs/workflow-components/triggers",
        },
        {
            query: "Playground",
            results: [
                doc(
                    "docs/how-to-guides/github-repo-backup",
                    "Back Up GitHub Repos with Kestra Playground",
                ),
                doc("docs/ui/playground", "Playground in Kestra UI: Build Flows Task by Task"),
            ],
            expected: "docs/ui/playground",
        },
    ])("puts the reference page first for $query", ({ query, results, expected }) => {
        const ranked = prepareSearchResults(results, query)

        expect(ranked[0].url).toBe(expected)
        expect(ranked.map((r) => r.url).sort()).toEqual(results.map((r) => r.url).sort())
    })

    it("matches an exact documentation title even when its URL differs", () => {
        const results = [blog(), doc("docs/ui/editor", "Flow Editor")]

        expect(prepareSearchResults(results, "flow editor")[0].url).toBe("docs/ui/editor")
    })

    it.each(["tutorial", "how-to-guides", "migration-guide"])(
        "prefers a reference page over an exact title in %s",
        (section) => {
            const results = [
                doc(`docs/${section}/inputs`, "Inputs"),
                doc("docs/workflow-components/inputs", "Workflow Inputs in Kestra"),
            ]

            expect(prepareSearchResults(results, "inputs")[0].url).toBe(
                "docs/workflow-components/inputs",
            )
        },
    )

    it.each([
        "/docs/workflow-components/worker-groups/",
        "docs/1.3/workflow-components/worker-groups",
        "docs/workflow-components/worker-groups#configuration",
    ])("matches a multiword query against the page name in %s", (url) => {
        const results = [blog(), doc(url, "Scale Workers in Kestra")]

        expect(prepareSearchResults(results, "  WORKER GROUPS  ")[0].url).toBe(url)
    })

    it("retains API order for equally relevant hits and does not reorder the input array", () => {
        const tutorial = doc("docs/tutorial/inputs", "Add Inputs")
        const reference = doc("docs/workflow-components/inputs", "Workflow Inputs")
        const anotherReference = doc("docs/expressions/inputs", "Input Expressions")
        const results = [tutorial, reference, anotherReference]

        expect(prepareSearchResults(results, "inputs").map((r) => r.url)).toEqual([
            reference.url,
            anotherReference.url,
            tutorial.url,
        ])
        expect(results.map((r) => r.url)).toEqual([
            tutorial.url,
            reference.url,
            anotherReference.url,
        ])
    })

    it.each([undefined, "", "   ", "input", "inputs", "input defaults"])(
        "preserves API relevance when there is no exact documentation match for %s",
        (query) => {
            const results = [
                blog({ title: "Inputs", url: "blogs/inputs" }),
                { title: "Inputs", url: "plugins/inputs", type: "PLUGINS" },
                doc("docs/workflow-components/reusable-inputs", "Reusable Inputs"),
            ]

            expect(prepareSearchResults(results, query).map((r) => r.url)).toEqual(
                results.map((r) => r.url),
            )
        },
    )

    it("keeps the API order of unmatched results after promoting a reference", () => {
        const results = [
            blog(),
            doc("docs/how-to-guides/dynamic-inputs", "Dynamic Inputs"),
            doc("docs/workflow-components/inputs", "Workflow Inputs"),
            { title: "Input", url: "plugins/input", type: "PLUGINS" },
            doc("docs/migration-guide/v1.0.0/inputs-defaults-property", "Input Defaults"),
        ]

        expect(prepareSearchResults(results, "inputs").map((r) => r.url)).toEqual([
            results[2].url,
            results[0].url,
            results[1].url,
            results[3].url,
            results[4].url,
        ])
    })

    it("still finds a migration guide when its specific title is requested", () => {
        const results = [
            doc("docs/workflow-components/inputs", "Workflow Inputs"),
            doc("docs/migration-guide/v0.15.0/inputs-name", "Inputs name Renamed to id"),
        ]

        expect(prepareSearchResults(results, "inputs name renamed to id")[0].url).toBe(
            results[1].url,
        )
    })

    // Regression: the BLOGS facet rendered "No results found" because the
    // index contained blogs/CLAUDE (a frontmatter-less file) with a null
    // title, and mapping over it threw before any result could render.
    it("drops entries with a null title instead of failing the whole list", () => {
        const results = prepareSearchResults(
            [
                blog(),
                { url: "blogs/CLAUDE", type: "BLOGS", title: null },
                blog({ url: "blogs/release-1-2", title: "Kestra 1.2" }),
            ],
            "assets",
        )

        expect(results.map((r) => r.url)).toEqual(["blogs/hello-assets", "blogs/release-1-2"])
    })

    it("drops entries missing the url or type the UI renders", () => {
        const results = prepareSearchResults(
            [blog({ url: undefined }), blog({ type: undefined }), blog()],
            "assets",
        )

        expect(results).toHaveLength(1)
    })

    it("marks the matched part of the title, case-insensitively", () => {
        const [result] = prepareSearchResults([blog()], "ASSETS")

        expect(result.highlightTitle).toBe(
            "Hello, <mark>Assets</mark>: Unifies Orchestration, Catalogs, and Lineage",
        )
    })

    it("leaves titles without a match unhighlighted", () => {
        const [result] = prepareSearchResults([blog()], "terraform")

        expect(result.highlightTitle).toBeUndefined()
    })

    it("skips highlighting for an empty or blank search value", () => {
        expect(prepareSearchResults([blog()], "")[0].highlightTitle).toBeUndefined()
        expect(prepareSearchResults([blog()], "   ")[0].highlightTitle).toBeUndefined()
        expect(prepareSearchResults([blog()], undefined)[0].highlightTitle).toBeUndefined()
    })

    it("returns an empty list for a missing or non-array response", () => {
        expect(prepareSearchResults(undefined, "assets")).toEqual([])
        expect(prepareSearchResults(null, "assets")).toEqual([])
        expect(prepareSearchResults({ results: [] }, "assets")).toEqual([])
    })
})