import url from "node:url";
import type {JSONProperty, JSONSchema, Plugin} from "@kestra-io/ui-libs";
import {isEntryAPluginElementPredicate, slugify, subGroupName} from "@kestra-io/ui-libs";
import type {RuntimeConfig} from "nuxt/schema";
import type {NitroRuntimeConfig} from "nitropack/types";

type PageType = "subGroupsIcons" | "elementsIcons" | "definitions" | "plugin" | "navigation";

function nuxtBlocksFromJsonSchema(jsonSchema: JSONSchema) {
    return {
        body: {
            jsonSchema,
            toc: {
                links: tocFromJsonSchema(jsonSchema)
            },
        },
        description: jsonSchema.properties.description,
        title: jsonSchema.properties.title
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

const jsonSchemaPropertiesChildrenToc = (hrefPrefix = "", properties: Record<string, JSONProperty>) => {
    const children = [];

    const sortedKeys = Object.keys(properties).sort((a, b) => {
        return (properties[b].$required || false) - (properties[a].$required || false);
    });

    for (const key of sortedKeys) {
        children.push({
            id: hrefPrefix + key,
            depth: 3,
            text: key,
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
            children: jsonSchemaPropertiesChildrenToc(undefined, schema.definitions)
        });
    }

    return links;
};

function toNavTitle(title: string) {
    let startCaseTitle = title;
    if (title.match(/^[a-z]+[A-Z][a-z]/)) {
        startCaseTitle = title.replace(/[A-Z][a-z]/, match => " " + match);
    }
    return startCaseTitle.split(".")
        .map(string => string.charAt(0).toUpperCase() + string.slice(1))
        .join("");
}

function subGroupWrapperNav(subGroupWrapper: Plugin, parentUrl: string) {
    return Object.entries(subGroupWrapper).filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
        .map(([key, value]) => {
            return ({
                title: toNavTitle(key),
                isPage: false,
                path: parentUrl + "#" + slugify(key),
                children: value.map(item => ({
                    title: toNavTitle(item.substring(item.lastIndexOf('.') + 1)),
                    path: `${parentUrl}/${slugify(item)}`
                }))
            });
        });
}

async function generateNavigation(config: RuntimeConfig | NitroRuntimeConfig) {
    const pluginsSubGroups = await $fetch<Plugin[]>(`${config.public.apiUrl}/plugins/subgroups`);
    const subGroupsByGroup = pluginsSubGroups.reduce(
        (result, subGroupWrapper) => {
            if (!result[subGroupWrapper.group]) {
                result[subGroupWrapper.group] = [];
            }
            result[subGroupWrapper.group].push(subGroupWrapper);
            return result;
        }, {} as Record<string, Plugin[]>);
    let sortedPluginsHierarchy = Object.entries(subGroupsByGroup).map(([group, subGroupsWrappers]) => {
        let plugin = subGroupsWrappers.find(subGroupWrapper => subGroupWrapper.subGroup === undefined);
        let rootPluginUrl = "/plugins/" + slugify(plugin.name);
        let pluginChildren;
        if (subGroupsWrappers.length > 1) {
            pluginChildren = subGroupsWrappers.filter(subGroupWrapper => subGroupWrapper.subGroup !== undefined).map(subGroupWrapper => {
                const subGroupUrl = `${rootPluginUrl}/${slugify(subGroupName(subGroupWrapper))}`;
                return {
                    title: toNavTitle(subGroupWrapper.title),
                    path: subGroupUrl,
                    children: subGroupWrapperNav(subGroupWrapper, subGroupUrl)
                }
            });
        }
        // There is no subgroups, we skip that part and directly put plugin elements below
        else {
            pluginChildren = subGroupWrapperNav(subGroupsWrappers[0], rootPluginUrl);
        }
        return {
            title: toNavTitle(plugin.title),
            path: rootPluginUrl,
            children: pluginChildren
        }
    }).sort((a, b) => {
        const nameA = a.title.toLowerCase(),
            nameB = b.title.toLowerCase();

        if (nameA === "core") {
            return -1;
        }
        if (nameB === "core") {
            return 1;
        }

        return nameA === nameB ? 0 : nameA < nameB ? -1 : 1;
    });
    return [{
        title: "Plugins",
        path: "/plugins",
        children: sortedPluginsHierarchy
    }];
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