import { beforeEach, describe, expect, it, vi } from "vitest"

const fetchApiCached = vi.hoisted(() => vi.fn())

vi.mock("~/utils/fetch", () => ({ $fetchApiCached: fetchApiCached }))

const { buildTaskUrls } = await import("~/utils/plugins/taskUrls")

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
    {
        name: "core",
        title: "Core Plugins and tasks",
        group: "io.kestra.plugin.core",
        tasks: [{ cls: "io.kestra.plugin.core.log.Log" }],
    },
]

beforeEach(() => {
    fetchApiCached.mockReset()
    fetchApiCached.mockResolvedValue(plugins)
})

describe("buildTaskUrls", () => {
    it("resolves the classes a blueprint uses", async () => {
        const urls = await buildTaskUrls([
            "io.kestra.plugin.core.log.Log",
            "io.kestra.plugin.gcp.pubsub.Publish",
        ])

        expect(urls).toEqual({
            "io.kestra.plugin.core.log.Log": "/plugins/core/io.kestra.plugin.core.log.log",
            "io.kestra.plugin.gcp.pubsub.Publish":
                "/plugins/plugin-gcp/google-cloud-pubsub/io.kestra.plugin.gcp.pubsub.publish",
        })
    })

    it("omits classes the payload does not know, so the caller keeps its fallback", async () => {
        const urls = await buildTaskUrls([
            "io.kestra.plugin.core.log.Log",
            "io.kestra.plugin.notifications.slack.SlackIncomingWebhook",
        ])

        expect(Object.keys(urls)).toEqual(["io.kestra.plugin.core.log.Log"])
    })

    it("returns an empty map when the plugin API fails instead of throwing", async () => {
        fetchApiCached.mockRejectedValue(new Error("gateway timeout"))

        await expect(buildTaskUrls(["io.kestra.plugin.core.log.Log"])).resolves.toEqual({})
    })

    it("does not call the API when there is nothing to resolve", async () => {
        await expect(buildTaskUrls([])).resolves.toEqual({})
        await expect(buildTaskUrls()).resolves.toEqual({})
        expect(fetchApiCached).not.toHaveBeenCalled()
    })

    it("deduplicates repeated classes", async () => {
        await buildTaskUrls([
            "io.kestra.plugin.core.log.Log",
            "io.kestra.plugin.core.log.Log",
        ])

        expect(fetchApiCached).toHaveBeenCalledTimes(1)
    })
})
