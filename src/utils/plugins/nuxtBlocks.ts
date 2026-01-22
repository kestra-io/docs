import type { JSONProperty, JSONSchema, Plugin } from "@kestra-io/ui-libs"

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
    return {
        title: subGroupsWrappers?.[0]?.title,
        description: subGroupsWrappers?.[0]?.description,
        body: {
            plugins: subGroupsWrappers,
            group: subGroupsWrappers?.[0]?.group,
        },
    }
}

interface TocLink {
    id: string
    depth: number
    text: string
    children?: TocLink[]
}

const tocFromJsonSchema = (schema: JSONSchema) => {
    const buildPropertiesToc = (
        prefix: string,
        properties: Record<string, JSONProperty>,
    ): TocLink[] => {
        return Object.entries(properties)
            .sort(([_, a], [__, b]) => {
                return Boolean(b.$required) === Boolean(a.$required) ? 0 : a.$required ? 1 : -1
            })
            .map(([key, _prop]) => ({
                id: prefix + key,
                depth: 3,
                text: key.split("_")[0],
            }))
    }

    const links: TocLink[] = []

    if (schema.properties?.["$examples"]) {
        links.push({
            id: "examples",
            depth: 2,
            text: "Examples",
        })
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
        links.push({
            id: "metrics",
            depth: 2,
            text: "Metrics",
        })
    }

    return links
}