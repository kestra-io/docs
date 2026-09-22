import { describe, expect, it } from "vitest"
import type { Plugin } from "~/utils/plugins/plugin"
import { familyArtifactPrefix, findFamilySiblings } from "~/utils/plugins/pluginFamily"

const plugin = (name: string, extra: Partial<Plugin> = {}): Plugin => ({
    name,
    title: name,
    group: `io.kestra.${name}`,
    tasks: [{ cls: `io.kestra.${name}.Task` }],
    ...extra,
})

describe("familyArtifactPrefix", () => {
    it("resolves a known family to its artifact prefix", () => {
        expect(familyArtifactPrefix("plugin-jdbc")).toBe("plugin-jdbc")
        expect(familyArtifactPrefix("plugin-debezium")).toBe("plugin-debezium")
        expect(familyArtifactPrefix("plugin-transform")).toBe("plugin-transform")
    })

    it("resolves plugin-scripts (repo name) to the singular plugin-script artifact prefix", () => {
        expect(familyArtifactPrefix("plugin-scripts")).toBe("plugin-script")
    })

    it("returns undefined for a name outside the known family allowlist", () => {
        expect(familyArtifactPrefix("plugin")).toBeUndefined()
        expect(familyArtifactPrefix("plugin-ee")).toBeUndefined()
        expect(familyArtifactPrefix("plugin-redis")).toBeUndefined()
    })
})

describe("findFamilySiblings", () => {
    const plugins = [
        plugin("plugin-debezium-mysql"),
        plugin("plugin-debezium-postgres"),
        plugin("plugin-jdbc-postgres"),
        plugin("plugin-jdbc-mysql", {
            tasks: [{ cls: "io.kestra.plugin.jdbc.mysql.Task", deprecated: true }],
        }),
        plugin("plugin-redis"),
        // A subgroup entry named "plugin-debezium-mysql" (subGroup set) must never be
        // mistaken for a top-level sibling.
        plugin("plugin-debezium-mysql", {
            subGroup: "io.kestra.plugin.debezium.mysql.extra",
            tasks: [{ cls: "io.kestra.plugin.debezium.mysql.extra.Task" }],
        }),
    ]

    it("finds siblings sharing the family's artifact prefix", () => {
        const result = findFamilySiblings(plugins, "plugin-debezium")
        expect(result.map((p) => p.name)).toEqual([
            "plugin-debezium-mysql",
            "plugin-debezium-postgres",
        ])
    })

    it("excludes a plugin whose every element is deprecated", () => {
        const result = findFamilySiblings(plugins, "plugin-jdbc")
        expect(result.map((p) => p.name)).toEqual(["plugin-jdbc-postgres"])
    })

    it("never includes a subgroup entry as a sibling", () => {
        const result = findFamilySiblings(plugins, "plugin-debezium")
        expect(result.every((p) => p.subGroup === undefined)).toBe(true)
    })

    it("returns nothing for a name outside the known family allowlist, even with matching prefixed plugins", () => {
        // Regression: unbounded prefix matching used to turn "/plugins/plugin",
        // "/plugins/plugin-ee", "/plugins/plugin-jdbc-arrow" etc. into 200s.
        expect(findFamilySiblings(plugins, "plugin")).toEqual([])
        expect(findFamilySiblings(plugins, "plugin-red")).toEqual([])
    })

    it("returns nothing for a family with no siblings present", () => {
        expect(findFamilySiblings(plugins, "plugin-transform")).toEqual([])
    })
})
