import { describe, expect, it } from "vitest"
import type { Plugin } from "~/utils/plugins/plugin"
import { pluginElementsPreview } from "~/utils/plugins/pluginElementsPreview"

const cls = (n: number) => `io.kestra.plugin.gcp.bigquery.Task${n}`

describe("pluginElementsPreview", () => {
    const plugin = {
        name: "plugin-gcp",
        title: "Google Cloud",
        group: "io.kestra.plugin.gcp",
        tasks: [
            ...Array.from({ length: 7 }, (_, i) => ({
                cls: cls(i),
                title: `Run \`task\` ${i}`,
            })),
            { cls: cls(99), deprecated: true },
        ],
        triggers: [
            {
                cls: "io.kestra.plugin.gcp.bigquery.Trigger",
                title: "Trigger on query results",
            },
        ],
        conditions: [],
    } as unknown as Plugin
    const index = {
        clsToUrl: {
            [cls(0)]: "/plugins/plugin-gcp/google-cloud-bigquery/task0",
        },
    }

    it("groups elements by type, counts them all and keeps the first five", () => {
        const [tasks, triggers] = pluginElementsPreview(plugin, index)
        expect(tasks.type).toBe("Tasks")
        expect(tasks.total).toBe(7)
        expect(tasks.items).toHaveLength(5)
        expect(tasks.items[0]).toEqual({
            title: "Run task 0",
            cls: cls(0),
            href: "/plugins/plugin-gcp/google-cloud-bigquery/task0",
        })
        expect(triggers).toMatchObject({ type: "Triggers", total: 1 })
    })

    it("leaves out deprecated elements and empty groups", () => {
        const groups = pluginElementsPreview(plugin, index)
        expect(groups.map((g) => g.type)).toEqual(["Tasks", "Triggers"])
        expect(groups[0].items.some((el) => el.cls === cls(99))).toBe(false)
    })
})
