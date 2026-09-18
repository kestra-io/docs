import { describe, expect, it } from "vitest"
import type { Plugin } from "~/utils/plugins/plugin"
import { buildPluginUrlIndex } from "~/utils/plugins/canonicalUrl"
import { prunePluginsForCards } from "~/utils/plugins/pruneForClient"

const gcpRoot = { name: "plugin-gcp", title: "Google Cloud", group: "io.kestra.plugin.gcp" }
const gcpPubSub = {
    name: "plugin-gcp",
    title: "Google Cloud Pub/Sub",
    group: "io.kestra.plugin.gcp",
    subGroup: "io.kestra.plugin.gcp.pubsub",
    tasks: [{ cls: "io.kestra.plugin.gcp.pubsub.Publish" }],
}
const gcpGcs = {
    name: "plugin-gcp",
    title: "Google Cloud Storage (GCS)",
    group: "io.kestra.plugin.gcp",
    subGroup: "io.kestra.plugin.gcp.gcs",
    tasks: [{ cls: "io.kestra.plugin.gcp.gcs.Upload" }],
}
const airtableRoot = {
    name: "plugin-airtable",
    title: "Airtable",
    group: "io.kestra.plugin.airtable",
}
const airtableRecord = {
    name: "plugin-airtable",
    title: "Airtable Record",
    group: "io.kestra.plugin.airtable",
    subGroup: "io.kestra.plugin.airtable.records",
    tasks: [{ cls: "io.kestra.plugin.airtable.records.Create" }],
}

const plugins = [
    gcpRoot,
    gcpPubSub,
    gcpGcs,
    airtableRoot,
    airtableRecord,
] as unknown as Plugin[]

const index = buildPluginUrlIndex(plugins)

const hrefOf = (plugin: unknown) =>
    prunePluginsForCards([plugin as Plugin], {}, index)[0].href

describe("prunePluginsForCards href", () => {
    // The plugin index keeps the subgroup entry when a plugin has exactly one, so the card
    // was linking /plugins/plugin-airtable/airtable-record — a 301 to the plugin root.
    it("omits the subgroup segment for a plugin exposing a single subgroup", () => {
        expect(hrefOf(airtableRecord)).toBe("/plugins/plugin-airtable")
    })

    it("keeps the subgroup segment for a plugin exposing several", () => {
        expect(hrefOf(gcpPubSub)).toBe("/plugins/plugin-gcp/google-cloud-pubsub")
        expect(hrefOf(gcpGcs)).toBe("/plugins/plugin-gcp/google-cloud-storage-gcs")
    })

    it("links the plugin root for an entry with no subgroup", () => {
        expect(hrefOf(gcpRoot)).toBe("/plugins/plugin-gcp")
        expect(hrefOf(airtableRoot)).toBe("/plugins/plugin-airtable")
    })

    it("leaves href unset when no index is supplied, so other callers keep their own logic", () => {
        expect(prunePluginsForCards([airtableRecord as Plugin], {})[0].href).toBeUndefined()
    })
})

describe("prunePluginsForCards subgroup info lookup", () => {
    // core's "io.kestra.plugin.ee.assets" subgroup owns its own pluginsData entry — it must not be
    // swallowed into core's own "Core Plugins and tasks" tile just because it lives in a package tree
    // that isn't a child of core's own group.
    it("uses the subgroup's own info when the subgroup is not another plugin's root group", () => {
        const coreEeAssets = {
            name: "core",
            title: "Core Plugins and tasks",
            group: "io.kestra.plugin.core",
            subGroup: "io.kestra.plugin.ee.assets",
        } as unknown as Plugin

        const pluginsData = {
            "io.kestra.plugin.core": { title: "Core Plugins and tasks", elementCounts: 109, blueprints: 585 },
            "io.kestra.plugin.ee.assets": { title: "Asset (EE)", elementCounts: 2 },
        }

        const result = prunePluginsForCards([coreEeAssets], pluginsData)[0]
        expect(result.title).toBe("Asset (EE)")
        expect(result.elementCounts).toBe(2)
    })

    // plugin-ee-git's subgroup value IS plugin-git's own root group — a genuine identity collision,
    // so it must fall back to its own group's info rather than borrowing plugin-git's.
    it("falls back to the plugin's own group info when the subgroup collides with another plugin's root group", () => {
        const eeGit = {
            name: "plugin-ee-git",
            title: "Git",
            group: "io.kestra.plugin.ee.git",
            subGroup: "io.kestra.plugin.git",
        } as unknown as Plugin

        const pluginsData = {
            "io.kestra.plugin.git": { title: "Git", elementCounts: 9 },
            "io.kestra.plugin.ee.git": { title: "Git (EE)", elementCounts: 2 },
        }

        const rootGroups = new Set(["io.kestra.plugin.git"])

        const result = prunePluginsForCards([eeGit], pluginsData, undefined, rootGroups)[0]
        expect(result.title).toBe("Git (EE)")
        expect(result.elementCounts).toBe(2)
    })
})
