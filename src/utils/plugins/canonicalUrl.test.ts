import { describe, expect, it } from "vitest"
import type { Plugin } from "~/utils/plugins/plugin"
import {
    buildPluginUrlIndex,
    canonicalPluginPath,
    canonicalPluginUrl,
} from "~/utils/plugins/canonicalUrl"

// Shaped like the /plugins/subgroups payload: one entry per plugin with subGroup unset,
// then one entry per subgroup. Titles carry the subgroup label, which is what the URL
// segment is slugified from.
const plugins = [
    { name: "plugin-gcp", title: "Google Cloud", group: "io.kestra.plugin.gcp" },
    {
        name: "plugin-gcp",
        title: "Google Cloud Pub/Sub",
        group: "io.kestra.plugin.gcp",
        subGroup: "io.kestra.plugin.gcp.pubsub",
        tasks: [{ cls: "io.kestra.plugin.gcp.pubsub.Publish" }],
    },
    {
        name: "plugin-gcp",
        title: "Google Cloud Storage (GCS)",
        group: "io.kestra.plugin.gcp",
        subGroup: "io.kestra.plugin.gcp.gcs",
        tasks: [{ cls: "io.kestra.plugin.gcp.gcs.Upload" }],
    },
    { name: "plugin-airtable", title: "Airtable", group: "io.kestra.plugin.airtable" },
    {
        name: "plugin-airtable",
        title: "Airtable Record",
        group: "io.kestra.plugin.airtable",
        subGroup: "io.kestra.plugin.airtable.records",
        tasks: [
            { cls: "io.kestra.plugin.airtable.records.Create" },
            { cls: "io.kestra.plugin.airtable.records.Legacy", deprecated: true },
        ],
    },
    {
        name: "core",
        title: "Core Plugins and tasks",
        group: "io.kestra.plugin.core",
        tasks: [{ cls: "io.kestra.plugin.core.log.Log" }],
        triggers: [{ cls: "io.kestra.plugin.core.trigger.Schedule" }],
        categories: ["CORE"],
        aliases: ["io.kestra.core.tasks.flows.If"],
    },
    {
        name: "plugin-ee-git",
        title: "Git (EE)",
        group: "io.kestra.plugin.ee.git",
        tasks: [{ cls: "io.kestra.plugin.git.TenantSync" }],
    },
    {
        name: "plugin-git",
        title: "Git",
        group: "io.kestra.plugin.git",
        tasks: [{ cls: "io.kestra.plugin.git.TenantSync" }],
    },
] as unknown as Plugin[]

const index = buildPluginUrlIndex(plugins)

describe("buildPluginUrlIndex", () => {
    it("keeps the subgroup segment for a plugin exposing several subgroups", () => {
        expect(canonicalPluginUrl("io.kestra.plugin.gcp.pubsub.Publish", index)).toBe(
            "/plugins/plugin-gcp/google-cloud-pubsub/io.kestra.plugin.gcp.pubsub.publish",
        )
        expect(canonicalPluginUrl("io.kestra.plugin.gcp.gcs.Upload", index)).toBe(
            "/plugins/plugin-gcp/google-cloud-storage-gcs/io.kestra.plugin.gcp.gcs.upload",
        )
    })

    // The case that produced 123 redirecting sitemap URLs and 561 redirecting inlinks.
    it("drops the subgroup segment for a plugin exposing exactly one", () => {
        expect(canonicalPluginUrl("io.kestra.plugin.airtable.records.Create", index)).toBe(
            "/plugins/plugin-airtable/io.kestra.plugin.airtable.records.create",
        )
    })

    it("builds URLs for a plugin with no subgroup at all", () => {
        expect(canonicalPluginUrl("io.kestra.plugin.core.log.Log", index)).toBe(
            "/plugins/core/io.kestra.plugin.core.log.log",
        )
        expect(canonicalPluginUrl("io.kestra.plugin.core.trigger.Schedule", index)).toBe(
            "/plugins/core/io.kestra.plugin.core.trigger.schedule",
        )
    })

    it("lowercases the class in the path but keeps the index keyed on the real class name", () => {
        expect(index.clsToUrl["io.kestra.plugin.core.log.Log"]).toContain(
            "io.kestra.plugin.core.log.log",
        )
        expect(canonicalPluginUrl("io.kestra.plugin.core.log.log", index)).toBeUndefined()
    })

    it("skips deprecated elements and non-element keys", () => {
        expect(
            canonicalPluginUrl("io.kestra.plugin.airtable.records.Legacy", index),
        ).toBeUndefined()
        expect(canonicalPluginUrl("io.kestra.core.tasks.flows.If", index)).toBeUndefined()
        expect(canonicalPluginUrl("CORE", index)).toBeUndefined()
    })

    it("prefers the OSS plugin when a class is exposed by both OSS and EE", () => {
        expect(canonicalPluginUrl("io.kestra.plugin.git.TenantSync", index)).toBe(
            "/plugins/plugin-git/io.kestra.plugin.git.tenantsync",
        )
    })

    it("returns undefined for an unknown class", () => {
        expect(canonicalPluginUrl("io.kestra.plugin.nope.Nope", index)).toBeUndefined()
    })
})

describe("canonicalPluginPath", () => {
    it("returns the subgroup page only when the plugin has several subgroups", () => {
        const gcpPubSub = plugins[1]
        const airtableRecord = plugins[4]

        expect(canonicalPluginPath(gcpPubSub, index)).toBe(
            "/plugins/plugin-gcp/google-cloud-pubsub",
        )
        expect(canonicalPluginPath(airtableRecord, index)).toBe("/plugins/plugin-airtable")
    })

    it("returns the plugin root for an entry without a subgroup", () => {
        expect(canonicalPluginPath(plugins[0], index)).toBe("/plugins/plugin-gcp")
    })

    it("returns undefined for an unnamed plugin", () => {
        expect(canonicalPluginPath({} as Plugin, index)).toBeUndefined()
    })
})
