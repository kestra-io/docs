import url from "node:url";
import type {JSONProperty, JSONSchema, Plugin, PluginElement} from "@kestra-io/ui-libs";
import {isEntryAPluginElementPredicate, slugify} from "@kestra-io/ui-libs";
import type {RuntimeConfig} from "nuxt/schema";
import type {NitroRuntimeConfig} from "nitropack/types";
import { generateNavigationFromSubgroups } from "../../src/utils/plugins/generateNavigation";

type PageType = "subGroupsIcons" | "elementsIcons" | "definitions" | "plugin" | "navigation";

function nuxtBlocksFromJsonSchema(jsonSchema: JSONSchema) {
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

function nuxtBlocksFromSubGroupsWrappers(subGroupsWrappers: Plugin[]) {
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

function toNavTitle(title: string) {
    let startCaseTitle = title.charAt(0).toUpperCase() + title.slice(1);
    if (title.match(/^[a-z]+[A-Z][a-z]/)) {
        startCaseTitle = title.replace(/[A-Z][a-z]/, match => " " + match);
    }
    return startCaseTitle.split(".")
        .map(string => string.charAt(0).toUpperCase() + string.slice(1))
        .join("");
}

async function generateNavigation(config: RuntimeConfig | NitroRuntimeConfig) {
    const pluginsSubGroups = await $fetch<Plugin[]>(`${config.public.apiUrl}/plugins/subgroups`);
    return generateNavigationFromSubgroups(pluginsSubGroups);
}

export default defineEventHandler(async (event) => {
    try {
        const requestUrl = new url.URL("http://localhost" + event.node.req.url);
        const page = requestUrl.searchParams.get("page");
        const type = requestUrl.searchParams.get("type") as PageType;
        const config = useRuntimeConfig();

        const colorFixedB64Icon = (b64Icon: string) => {
            return Buffer.from(Buffer.from(b64Icon, 'base64').toString('utf-8').replaceAll("currentColor", "#CAC5DA")).toString('base64');
        }

        switch (type) {
            case "subGroupsIcons": {
                return Object.fromEntries(Object.entries(
                    await $fetch(`${config.public.apiUrl}/plugins/${page}/icons/subgroups`)
                ).map(([subGroup, {icon}]) => [subGroup, colorFixedB64Icon(icon)]));
            }
            case "elementsIcons": {
                return Object.fromEntries(Object.entries(
                    await $fetch(`${config.public.apiUrl}/plugins/${page}/icons`)
                ).map(([pluginElement, {icon}]) => {
                    return [pluginElement, colorFixedB64Icon(icon)]
                }));
            }
            case "definitions": {
                let pageData = await $fetch(`${config.public.apiUrl}/plugins/definitions/${page}`);

                return nuxtBlocksFromJsonSchema(pageData.schema);
            }
            case "plugin": {
                let subgroups = await $fetch(`${config.public.apiUrl}/plugins/${page}/subgroups`);

                return nuxtBlocksFromSubGroupsWrappers(subgroups);
            }
            case "navigation": {
                return await generateNavigation(config);
            }
        }
    } catch (error) {
        return {
            message: 'Failed to fetch or parse data',
            error: error,
        };
    }
});