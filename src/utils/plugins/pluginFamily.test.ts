import { describe, expect, it } from "vitest"
import type { Plugin } from "~/utils/plugins/plugin"
import {
    buildFamilyIndex,
    familyNameForPlugin,
    findFamilySiblings,
    type FamilyIndex,
} from "~/utils/plugins/pluginFamily"

const plugin = (name: string, extra: Partial<Plugin> = {}): Plugin => ({
    name,
    title: name,
    group: `io.kestra.${name}`,
    tasks: [{ cls: `io.kestra.${name}.Task` }],
    ...extra,
})

const release = (artifactId: string, repository: string) => ({ artifactId, repository })

describe("buildFamilyIndex", () => {
    it("groups artifacts sharing a repo into a family, keyed by the repo's own name", () => {
        const index = buildFamilyIndex({
            artifacts: {
                "io.kestra.plugin:plugin-jdbc-oracle": [
                    release("plugin-jdbc-oracle", "https://github.com/kestra-io/plugin-jdbc"),
                ],
                "io.kestra.plugin:plugin-jdbc-postgres": [
                    release("plugin-jdbc-postgres", "https://github.com/kestra-io/plugin-jdbc"),
                ],
            },
        })

        expect(index.familyByPlugin).toEqual({
            "plugin-jdbc-oracle": "plugin-jdbc",
            "plugin-jdbc-postgres": "plugin-jdbc",
        })
        expect(index.membersByFamily["plugin-jdbc"]).toEqual(
            expect.arrayContaining(["plugin-jdbc-oracle", "plugin-jdbc-postgres"]),
        )
    })

    it("leaves a single-artifact repo out of both maps", () => {
        const index = buildFamilyIndex({
            artifacts: {
                "io.kestra.plugin:plugin-redis": [
                    release("plugin-redis", "https://github.com/kestra-io/plugin-redis"),
                ],
            },
        })

        expect(index.familyByPlugin["plugin-redis"]).toBeUndefined()
        expect(index.membersByFamily["plugin-redis"]).toBeUndefined()
    })

    it("only looks at the latest (first) release entry per artifact", () => {
        const index = buildFamilyIndex({
            artifacts: {
                "io.kestra.plugin:plugin-jdbc-oracle": [
                    release("plugin-jdbc-oracle", "https://github.com/kestra-io/plugin-jdbc"),
                    // An older release under a since-renamed repo must not split the family.
                    release("plugin-jdbc-oracle", "https://github.com/kestra-io/old-jdbc-name"),
                ],
                "io.kestra.plugin:plugin-jdbc-postgres": [
                    release("plugin-jdbc-postgres", "https://github.com/kestra-io/plugin-jdbc"),
                ],
            },
        })

        expect(index.familyByPlugin["plugin-jdbc-oracle"]).toBe("plugin-jdbc")
    })

    it("excludes an aggregator artifact literally named after the repo from its own family", () => {
        const index = buildFamilyIndex({
            artifacts: {
                "io.kestra.plugin:plugin-jdbc": [
                    release("plugin-jdbc", "https://github.com/kestra-io/plugin-jdbc"),
                ],
                "io.kestra.plugin:plugin-jdbc-oracle": [
                    release("plugin-jdbc-oracle", "https://github.com/kestra-io/plugin-jdbc"),
                ],
                "io.kestra.plugin:plugin-jdbc-postgres": [
                    release("plugin-jdbc-postgres", "https://github.com/kestra-io/plugin-jdbc"),
                ],
            },
        })

        expect(index.familyByPlugin["plugin-jdbc"]).toBeUndefined()
        expect(index.membersByFamily["plugin-jdbc"]).not.toContain("plugin-jdbc")
    })
})

describe("familyNameForPlugin", () => {
    const index: FamilyIndex = {
        familyByPlugin: { "plugin-jdbc-oracle": "plugin-jdbc" },
        membersByFamily: { "plugin-jdbc": ["plugin-jdbc-oracle"] },
    }

    it("resolves a family member to its family", () => {
        expect(familyNameForPlugin("plugin-jdbc-oracle", index)).toBe("plugin-jdbc")
    })

    it("returns undefined for a plugin outside any detected family", () => {
        expect(familyNameForPlugin("plugin-redis", index)).toBeUndefined()
    })
})

describe("findFamilySiblings", () => {
    const index: FamilyIndex = {
        familyByPlugin: {
            "plugin-debezium-mysql": "plugin-debezium",
            "plugin-debezium-postgres": "plugin-debezium",
            "plugin-jdbc-postgres": "plugin-jdbc",
            "plugin-jdbc-mysql": "plugin-jdbc",
        },
        membersByFamily: {
            "plugin-debezium": ["plugin-debezium-mysql", "plugin-debezium-postgres"],
            "plugin-jdbc": ["plugin-jdbc-postgres", "plugin-jdbc-mysql"],
        },
    }

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

    it("finds siblings belonging to the family", () => {
        const result = findFamilySiblings(plugins, "plugin-debezium", index)
        expect(result.map((p) => p.name)).toEqual([
            "plugin-debezium-mysql",
            "plugin-debezium-postgres",
        ])
    })

    it("excludes a plugin whose every element is deprecated", () => {
        const result = findFamilySiblings(plugins, "plugin-jdbc", index)
        expect(result.map((p) => p.name)).toEqual(["plugin-jdbc-postgres"])
    })

    it("never includes a subgroup entry as a sibling", () => {
        const result = findFamilySiblings(plugins, "plugin-debezium", index)
        expect(result.every((p) => p.subGroup === undefined)).toBe(true)
    })

    it("returns nothing for a family the index has no members for", () => {
        expect(findFamilySiblings(plugins, "plugin-transform", index)).toEqual([])
        expect(findFamilySiblings(plugins, "plugin", index)).toEqual([])
    })
})
