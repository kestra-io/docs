import { describe, expect, it, vi } from "vitest"

// The module also exports the API fetcher, whose import chain needs astro:env.
vi.mock("~/utils/fetch", () => ({ $fetchApiCachedOptional: vi.fn() }))
import { pluginPagePredicate } from "./pluginPagePredicate"
import type { Plugin } from "./plugin"

const plugin = (name: string, extra: Partial<Plugin>): Plugin =>
    ({
        name,
        title: name,
        group: `io.kestra.plugin.${name}`,
        ...extra,
    }) as Plugin

describe("pluginPagePredicate", () => {
    it("rejects a plugin whose tasks and triggers are all deprecated", () => {
        const hasPage = pluginPagePredicate([
            plugin("plugin-notifications", {
                tasks: [
                    { cls: "a", deprecated: true },
                    { cls: "b", deprecated: true },
                ],
                triggers: [{ cls: "c", deprecated: true }],
                categories: ["ALERTING"],
            }),
        ])
        expect(hasPage("plugin-notifications")).toBe(false)
    })

    it("keeps a plugin with at least one live element, across its subgroups", () => {
        const hasPage = pluginPagePredicate([
            plugin("plugin-slack", { tasks: [{ cls: "a", deprecated: true }] }),
            plugin("plugin-slack", { subGroup: "x", tasks: [{ cls: "b" }] }),
        ])
        expect(hasPage("plugin-slack")).toBe(true)
        expect(hasPage("Plugin-Slack")).toBe(true)
    })

    it("rejects names with no element or no /plugins entry, as the router does", () => {
        const hasPage = pluginPagePredicate([
            plugin("plugin-slack", { tasks: [{ cls: "a" }] }),
            plugin("plugin-empty", { categories: ["OTHER"], aliases: ["x"] }),
        ])
        expect(hasPage("plugin-empty")).toBe(false)
        expect(hasPage("script")).toBe(false)
    })

    it("keeps everything when the payload is empty", () => {
        expect(pluginPagePredicate([])("plugin-slack")).toBe(true)
    })
})
