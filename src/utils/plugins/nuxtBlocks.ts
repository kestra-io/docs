import type {JSONProperty, JSONSchema, Plugin} from "@kestra-io/ui-libs";

export function nuxtBlocksFromJsonSchema(jsonSchema: JSONSchema) {
    return {
        body: {
            jsonSchema,
            toc: {
                links: tocFromJsonSchema(jsonSchema)
            },
        },
        description: jsonSchema.properties?.description,
        title: jsonSchema.properties?.title
    };
}

export function nuxtBlocksFromSubGroupsWrappers(subGroupsWrappers: Plugin[]) {
    return {
        body: {
            plugins: subGroupsWrappers,
            group: subGroupsWrappers?.[0]?.group,
        }
    };
}

const jsonSchemaPropertiesChildrenToc = (hrefPrefix = "", properties: Record<string, JSONProperty>, usePropertyTitle = false) => {
    const children = [];

    const sortedProperties = Object.entries(properties).sort(([_, valueA], [__, valueB]) => {
        return Boolean(valueB.$required) === Boolean(valueA.$required) ? 0 : Boolean(valueA.$required) ? 1 : -1;
    });

    for (const [key, property] of sortedProperties) {
        children.push({
            id: hrefPrefix + key,
            depth: 3,
            text: (usePropertyTitle ? property.title : undefined) ?? key.split("_")[0],
        });
    }

    return children;
}

const tocFromJsonSchema = (schema: JSONSchema) => {
    const links = [];

    if (schema.properties?.["$examples"]) {
        links.push({
            id: 'examples',
            depth: 2,
            text: 'Examples'
        });
    }

    if (schema.properties?.properties) {
        links.push({
            id: 'properties',
            depth: 2,
            text: 'Properties',
            children: jsonSchemaPropertiesChildrenToc("properties_", schema.properties.properties)
        });
    }

    if (schema.outputs?.properties) {
        links.push({
            id: 'outputs',
            depth: 2,
            text: 'Outputs',
            children: jsonSchemaPropertiesChildrenToc("outputs_", schema.outputs.properties)
        });
    }

    if (schema.definitions) {
        links.push({
            id: 'definitions',
            depth: 2,
            text: 'Definitions',
            children: jsonSchemaPropertiesChildrenToc(undefined, schema.definitions, true)
        });
    }

    return links;
};