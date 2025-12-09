    import url from "node:url";
    import type {NitroRuntimeConfig} from "nitropack/types";
    import type {RuntimeConfig} from "nuxt/schema";
    import type {JSONProperty, JSONSchema, Plugin, PluginElement, PluginMetadata} from "@kestra-io/ui-libs";
    import {isEntryAPluginElementPredicate, slugify, subGroupName} from "@kestra-io/ui-libs";
    import type {NavItem} from "../../utils/navigation";

    type PageType = "allPluginsIcons" | "definitions" | "plugin" | "navigation" | "allPlugins" | "metadata";

    export interface TocLink {
        id: string;
        depth: number;
        text: string;
        children?: TocLink[];
    }

    function nuxtBlocksFromJsonSchema(jsonSchema: JSONSchema) {
        return {
            body: {
                jsonSchema,
                toc: {
                    links: tocFromJsonSchema(jsonSchema)
                }
            },
            description: jsonSchema.properties?.description,
            title: jsonSchema.properties?.title
        };
    }

    function nuxtBlocksFromSubGroupsWrappers(subGroupsWrappers: Plugin[]) {
        return {
            body: {
                title: subGroupsWrappers?.[0]?.title,
                description: subGroupsWrappers?.[0]?.description,
                plugins: subGroupsWrappers,
                group: subGroupsWrappers?.[0]?.group
            }
        };
    }

    /**
     * Hack to get the subpackage from a cls if subGroup is not directly provided.
     * Extracts the first-level subpackage from a class name for grouping.
     * E.g., "io.kestra.plugin.github.actions" with base "io.kestra.plugin.github" returns "actions".
     */
    function getSubpackage(cls: string, baseGroup: string): string | undefined {
        const parts = cls.replace(`${baseGroup}.`, "").split(".");
        return parts.length >= 2 ? parts[0] : undefined;
    }

    /**
     * Checks if a plugin has multiple subpackages to determine auto-grouping.
     * Returns true if 2+ unique subpackages are found.
     */
    function hasMultipleSubpackages(plugin: Plugin): boolean {
        const elements = Object.entries(plugin)
            .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
            .flatMap(([_, value]) => value as PluginElement[]);
        
        const subpackages = new Set(
            elements
                .map(el => getSubpackage(el.cls, plugin.group))
                .filter(Boolean)
        );
        
        return subpackages.size > 1;
    }

    /**
     * Groups plugin elements by subpackage for hierarchical navigation.
     * Creates separate Plugin objects per subpackage (e.g., "actions", "issues" for GitHub).
     * Uses provided metadata to add descriptions.
     *
     * @example
     * Groups GitHub plugin tasks into subgroups like "actions", "code", "commits", "issues", etc.
     */
    function groupBySubpackage(
        plugin: Plugin,
        allMetadata: PluginMetadata[]
    ): Plugin[] {
        const groups = new Map<string, Record<string, PluginElement[]>>();
        
        Object.entries(plugin)
            .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
            .forEach(([elementType, elements]) => {
                (elements as PluginElement[]).forEach(element => {
                    const subpackage = getSubpackage(element.cls, plugin.group);
                    if (!subpackage) return;
                    
                    if (!groups.has(subpackage)) {
                        groups.set(subpackage, {});
                    }
                    
                    const group = groups.get(subpackage)!;
                    if (!group[elementType]) {
                        group[elementType] = [];
                    }
                    group[elementType].push(element);
                });
            });
        
        return Array.from(groups.entries()).map(([subpackage, elementsByType]) => {
            const formattedSubpackage = toNavTitle(subpackage).replace(/([A-Z])/g, " $1").trim();
            const subGroupCls = `${plugin.group}.${subpackage}`;
            const metadata = allMetadata?.find(m => m.group === subGroupCls);
            
            return {
                name: plugin.name,
                title: subpackage,
                group: plugin.group,
                subGroup: subpackage,
                description: metadata?.description ?? `This Sub-Group Of Plugin Contains Tasks For Using ${plugin.name} ${formattedSubpackage}`,
                categories: plugin.categories ?? [],
                ...elementsByType
            };
        });
    }

    function tocFromJsonSchema(schema: JSONSchema): TocLink[] {

        const buildPropertiesToc = (prefix: string, properties: Record<string, JSONProperty>): TocLink[] => {
            return Object.entries(properties)
                .sort(([_, a], [__, b]) => {
                    return Boolean(b.$required) === Boolean(a.$required)
                        ? 0
                        : Boolean(a.$required)
                            ? 1
                            : -1;
                })
                .map(([key, prop]) => ({id: prefix + key, depth: 3, text: key.split("_")[0]}));
        };

        const links: TocLink[] = [];

        if (schema.properties?.["$examples"]) {
            links.push({
                id: "examples",
                depth: 2,
                text: "Examples"
            });
        }

        if (schema.properties?.properties) {
            links.push({
                id: "properties",
                depth: 2,
                text: "Properties",
                children: buildPropertiesToc("properties_", schema.properties.properties)
            });
        }

        if (schema.outputs?.properties) {
            links.push({
                id: "outputs",
                depth: 2,
                text: "Outputs",
                children: buildPropertiesToc("outputs_", schema.outputs.properties)
            });
        }

        if (schema.properties?.["$metrics"]) {
            links.push({
                id: "metrics",
                depth: 2,
                text: "Metrics"
            });
        }

        return links;
    }

    function toNavTitle(title: string): string {
        let startCaseTitle = title.charAt(0).toUpperCase() + title.slice(1);
        if (title.match(/^[a-z]+[A-Z][a-z]/)) {
            startCaseTitle = title.replace(/[A-Z][a-z]/, match => ` ${match}`);
        }
        return startCaseTitle
            .split(".")
            .map(s => s.charAt(0).toUpperCase() + s.slice(1))
            .join("");
    }

    function buildNav(plugin: Plugin, parentUrl: string): NavItem[] {
        return Object.entries(plugin)
            .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
            .map(([key, value]) => ({
                title: toNavTitle(key),
                isPage: false,
                path: `${parentUrl}#${slugify(key)}`,
                children: (value as PluginElement[])
                    .filter(({deprecated}) => !deprecated)
                    .map(item => ({
                        title: item.cls.substring(item.cls.lastIndexOf(".") + 1),
                        path: `${parentUrl}/${slugify(item.cls)}`
                    }))
            }));
    }

    async function fetchSubGroups(config: RuntimeConfig): Promise<Plugin[]> {
        return await $fetch<Plugin[]>(`${config.public.apiUrl}/plugins/subgroups`);
    }

    async function generateNavigation(config: RuntimeConfig | NitroRuntimeConfig): Promise<NavItem[]> {
        const pluginsSubGroups = await fetchSubGroups(config);
        const allMetadata = await $fetch<PluginMetadata[]>(`${config.public.apiUrl}/plugins/metadata`);
        
        const subGroupsByGroup = pluginsSubGroups.reduce((result, sg) => {
            const filteredElementsByTypeEntries = Object.entries(sg)
                .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
                .map(([elementType, elements]) => [
                    elementType,
                    (elements as PluginElement[]).filter(({deprecated}) => !deprecated)
                ])
                .filter(([, elements]) => elements.length > 0);

            if (filteredElementsByTypeEntries.length === 0) {
                return result;
            }

            const filtered = Object.fromEntries([
                ...Object.entries(sg).filter(
                    ([key, value]) => !isEntryAPluginElementPredicate(key, value)
                ),
                ...filteredElementsByTypeEntries
            ]);

            if (!result[sg.group]) {
                result[sg.group] = [];
            }
            result[sg.group].push(filtered);
            return result;
        }, {} as Record<string, Plugin[]>);
        
        const hierarchy = await Promise.all(
            Object.values(subGroupsByGroup).map(async subGroupsWrappers => {
                const plugin = subGroupsWrappers.find(sg => sg.subGroup === undefined);
                if (!plugin) return null;
                
                const rootUrl = `/plugins/${slugify(plugin.name)}`;
                const hasExplicit = subGroupsWrappers.length > 1;
                const needsGrouping = !hasExplicit && hasMultipleSubpackages(plugin);
                
                let children: NavItem[];
                
                if (hasExplicit) {
                    children = subGroupsWrappers
                        .filter(sg => sg.subGroup !== undefined)
                        .map(sg => {
                            const subGroupUrl = `${rootUrl}/${slugify(subGroupName(sg))}`;
                            return {
                                title: toNavTitle(sg.title),
                                path: subGroupUrl,
                                children: buildNav(sg, subGroupUrl)
                            };
                        });
                } else if (needsGrouping) {
                    const subGroups = groupBySubpackage(plugin, allMetadata);
                    children = subGroups.map(sg => {
                        const subGroupUrl = `${rootUrl}/${slugify(sg.subGroup!)}`;
                        return {
                            title: toNavTitle(sg.subGroup!),
                            path: subGroupUrl,
                            children: buildNav(sg, subGroupUrl)
                        };
                    });
                } else {
                    children = buildNav(subGroupsWrappers[0], rootUrl);
                }
                
                return {
                    title: toNavTitle(plugin.title),
                    path: rootUrl,
                    group: plugin.group,
                    children
                };
            })
        );
        
        const sortedHierarchy = hierarchy
            .filter(Boolean)
            .sort((a, b) => {
                if (!a || !b) return 0;
                if (a.group === "io.kestra.plugin.core") return -1;
                if (b.group === "io.kestra.plugin.core") return 1;
                return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
            });
        
        return [{
            title: "Plugins",
            path: "/plugins",
            children: sortedHierarchy as NavItem[]
        }];
    }

    export default defineEventHandler(async event => {
        try {
            const requestUrl = new url.URL("http://localhost" + event.node.req.url);
            const page = requestUrl.searchParams.get("page");
            const type = requestUrl.searchParams.get("type") as PageType;
            const config = useRuntimeConfig();

            switch (type) {
                case "allPluginsIcons": {
                    const subGroups = await fetchSubGroups(config);
                    const pluginNames = [...new Set(subGroups?.map(p => p.name) ?? [])];
                    
                    const iconsArrays = await Promise.all(
                        pluginNames.map(pluginName =>
                            $fetch<Record<string, {icon: string}>>(
                                `${config.public.apiUrl}/plugins/${pluginName}/icons/subgroups`
                            )
                        )
                    );

                    return Object.fromEntries(
                        iconsArrays.flatMap(icons =>
                            Object.entries(icons ?? {}).map(([key, {icon}]) => [
                                key,
                                Buffer.from(
                                    Buffer.from(icon, "base64").toString("utf-8")
                                ).toString("base64")
                            ])
                        )
                    );
                }

                case "allPlugins": {
                    const subGroups = await fetchSubGroups(config);
                    return subGroups ?? [];
                }

                case "definitions": {
                    const pageData = await $fetch<{markdown: string; schema: JSONSchema}>(
                        `${config.public.apiUrl}/plugins/definitions/${page}`
                    );

                    const name = /^title: (.*)$/m.exec(pageData?.markdown)?.[1];
                    const definitionType = /^type: "(.*)"$/m.exec(pageData?.markdown)?.[1];
                    
                    return {
                        name,
                        type: definitionType,
                        ...nuxtBlocksFromJsonSchema(pageData.schema)
                    };
                }

                case "plugin": {
                    let subgroups = await $fetch<Plugin[]>(
                        `${config.public.apiUrl}/plugins/${page}/subgroups`
                    );
                    
                    const rootPlugin = subgroups?.find(sg => sg.subGroup === undefined);
                    if (rootPlugin && subgroups.length === 1 && hasMultipleSubpackages(rootPlugin)) {
                        if (!rootPlugin.categories) {
                            rootPlugin.categories = [];
                        }
                        const allMetadata = await $fetch<PluginMetadata[]>(`${config.public.apiUrl}/plugins/metadata`);
                        subgroups = [rootPlugin, ...groupBySubpackage(rootPlugin, allMetadata)];
                    }

                    return nuxtBlocksFromSubGroupsWrappers(subgroups ?? []);
                }

                case "navigation": {
                    return await generateNavigation(config);
                }

                case "metadata": {
                    const groupId = requestUrl.searchParams.get("group");
                    const artifactGroupId = requestUrl.searchParams.get("artifactGroupId");
                    const artifactId = requestUrl.searchParams.get("artifactId");

                    if (groupId) {
                        return await $fetch<PluginMetadata>(
                            `${config.public.apiUrl}/plugins/metadata/group/${encodeURIComponent(groupId)}`
                        );
                    }

                    if (artifactGroupId && artifactId) {
                        return await $fetch<PluginMetadata>(
                            `${config.public.apiUrl}/plugins/metadata/plugin/${encodeURIComponent(artifactGroupId)}/${encodeURIComponent(artifactId)}`
                        );
                    }

                    return await $fetch<PluginMetadata[]>(
                        `${config.public.apiUrl}/plugins/metadata`
                    );
                }

                default: {
                    return {
                        message: "Invalid type parameter",
                        error: null
                    };
                }
            }
        } catch (error) {
            return {
                message: "Failed to fetch or parse data",
                error: error
            };
        }
    });