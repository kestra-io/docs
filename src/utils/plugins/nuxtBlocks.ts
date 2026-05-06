import type { JSONProperty, JSONSchema, Plugin } from "@kestra-io/ui-libs"
import type { TocLink } from "./types"

export function nuxtBlocksFromJsonSchema(jsonSchema: JSONSchema) {
    return {
        body: {
            jsonSchema,
            toc: {
                links: tocFromJsonSchema(jsonSchema),
            },
        },
        description: jsonSchema.properties?.description,
        title: jsonSchema.properties?.title,
    }
}

export function nuxtBlocksFromSubGroupsWrappers(subGroupsWrappers: Plugin[]) {
    const first = subGroupsWrappers[0]
    return {
        title: first?.title,
        description: first?.description,
        body: {
            plugins: subGroupsWrappers,
            group: first?.group,
        },
    }
}

function buildPropertiesToc(prefix: string, properties: Record<string, JSONProperty>): TocLink[] {
    return Object.entries(properties)
        .sort(([, a], [, b]) => Number(Boolean(b.$required)) - Number(Boolean(a.$required)))
        .map(([key]) => ({
            id: prefix + key,
            depth: 3,
            text: key.split("_")[0],
        }))
}

function tocFromJsonSchema(schema: JSONSchema): TocLink[] {
    const links: TocLink[] = []

    if (schema.properties?.["$examples"]) {
        links.push({ id: "examples", depth: 2, text: "Examples" })
    }

    if (schema.properties?.properties) {
        links.push({
            id: "properties",
            depth: 2,
            text: "Properties",
            children: buildPropertiesToc("properties_", schema.properties.properties),
        })
    }

    if (schema.outputs?.properties) {
        links.push({
            id: "outputs",
            depth: 2,
            text: "Outputs",
            children: buildPropertiesToc("outputs_", schema.outputs.properties),
        })
    }

    if (schema.properties?.["$metrics"]) {
        links.push({ id: "metrics", depth: 2, text: "Metrics" })
    }

    return links
}

