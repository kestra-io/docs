import { describe, it, expect } from "vitest"
import { buildSubGroupSegmentPredicate, type Plugin } from "~/utils/plugins/plugin"

const entry = (name: string, subGroup?: string): Plugin =>
    ({ name, title: name, group: `io.kestra.plugin.${name}`, subGroup }) as Plugin

describe("buildSubGroupSegmentPredicate", () => {
    it("keeps the segment for a plugin exposing several subgroups", () => {
        // plugin-ee-dellemc: /plugins/plugin-ee-dellemc/dell-emc-powerstore-arrays serves 200.
        const hasSegment = buildSubGroupSegmentPredicate([
            entry("plugin-ee-dellemc"),
            entry("plugin-ee-dellemc", "io.kestra.plugin.ee.dellemc.powerstore.arrays"),
            entry("plugin-ee-dellemc", "io.kestra.plugin.ee.dellemc.powerstore.volumes"),
        ])

        expect(hasSegment("plugin-ee-dellemc")).toBe(true)
    })

    it("drops the segment for a plugin exposing a single subgroup", () => {
        // plugin-airtable: /plugins/plugin-airtable/airtable-records 301s to /plugins/plugin-airtable.
        const hasSegment = buildSubGroupSegmentPredicate([
            entry("plugin-airtable"),
            entry("plugin-airtable", "io.kestra.plugin.airtable.records"),
        ])

        expect(hasSegment("plugin-airtable")).toBe(false)
    })

    it("drops the segment for a plugin with no subgroup of its own", () => {
        // plugin-git shares its classes with plugin-ee-git, whose subgroup would
        // otherwise leak into /plugins/plugin-git/git/... through the global mapping.
        const hasSegment = buildSubGroupSegmentPredicate([
            entry("plugin-git"),
            entry("plugin-ee-git"),
            entry("plugin-ee-git", "io.kestra.plugin.git"),
        ])

        expect(hasSegment("plugin-git")).toBe(false)
    })

    it("returns false for a plugin absent from the list", () => {
        expect(buildSubGroupSegmentPredicate([])("plugin-unknown")).toBe(false)
    })
})
