import { describe, expect, it, vi } from "vitest"

// The module also exports the API fetcher, whose import chain needs astro:env.
vi.mock("~/utils/fetch", () => ({ $fetchApiCachedOptional: vi.fn() }))
import { collectDeprecatedOnlyPlugins } from "./deprecatedOnlyPlugins"
import type { Plugin } from "./plugin"

const plugin = (name: string, extra: Partial<Plugin>): Plugin =>
    ({ name, title: name, group: `io.kestra.plugin.${name}`, ...extra }) as Plugin

describe("collectDeprecatedOnlyPlugins", () => {
    it("flags a plugin whose tasks and triggers are all deprecated", () => {
        const dead = collectDeprecatedOnlyPlugins([
            plugin("plugin-notifications", {
                tasks: [{ cls: "a", deprecated: true }, { cls: "b", deprecated: true }],
                triggers: [{ cls: "c", deprecated: true }],
                categories: ["ALERTING"],
            }),
        ])
        expect([...dead]).toEqual(["plugin-notifications"])
    })

    it("keeps a plugin with at least one live element, across its subgroups", () => {
        const dead = collectDeprecatedOnlyPlugins([
            plugin("plugin-slack", { tasks: [{ cls: "a", deprecated: true }] }),
            plugin("plugin-slack", { subGroup: "x", tasks: [{ cls: "b" }] }),
        ])
        expect(dead.size).toBe(0)
    })

    it("ignores plugins with no elements and non-element arrays", () => {
        const dead = collectDeprecatedOnlyPlugins([
            plugin("plugin-empty", { categories: ["OTHER"], aliases: ["x"] }),
        ])
        expect(dead.size).toBe(0)
    })
})
