<template>
    <PluginsPluginPageRender
        v-if="rootPlugin && allPlugins && subGroupsIcons && pageWithToc"
        :slug
        :page-list
        :page-names-heading
        :plugins-without-deprecated
        :page
        :page-with-toc
        :plugin-name
        :sub-group
        :plugin-type
        :root-plugin
        :all-plugins
        :blueprint-counts="pluginBlueprintCounts"
        :current-page-icon
        :current-plugin-categories
        :current-plugin-metadata
        :current-plugin-videos
        :github-versions
        :github-releases-url
        :heading-title
        :origin
        :related-blogs
        :subgroup-blueprint-counts
        :route-parts
        :blueprints-section-heading
        :current-subgroup-plugin
        :element-title="{el:{title: 'cs'}}"
        :metadata-map
        :sub-groups-icons
    />
</template>

<script setup lang="ts">
    import {useEventListener} from "@vueuse/core";
    import {isEntryAPluginElementPredicate, subGroupName, slugify, filterPluginsWithoutDeprecated, type PluginMetadata, type Plugin} from "@kestra-io/ui-libs";
    import {useBlueprintsCounts} from "~/composables/useBlueprintsCounts";
    import {generatePageNames, recursivePages} from "~/utils/navigation";
    import {formatElementType, formatElementName, getBlueprintsHeading, getPluginTitle} from "../../utils/pluginUtils";

    const route = useRoute();
    const {origin} = useRequestURL();
    const {public:{CollectionNames}} = useRuntimeConfig();

    const routeSlug: string = route.params.slug instanceof Array
        ? route.params.slug.join("/")
        : route.params.slug ?? "";

    const splitRouteSlug = routeSlug.split("/");

    const pluginName = computed(() => splitRouteSlug?.[0] ?? "");

    const routeParts = computed<string[]>(() =>
        Array.isArray(route.params.slug) ? (route.params.slug as string[]) : [String(route.params.slug)]
    );

    const subGroup = computed(() => {
        const maybeSubGroup = splitRouteSlug[1];
        return maybeSubGroup?.includes(".") ? undefined : maybeSubGroup;
    });

    const pluginType = computed(() => {
        const lastSegment = splitRouteSlug[splitRouteSlug.length - 1];
        if (!lastSegment || !lastSegment.includes(".")) return undefined;

        const parts = lastSegment.replace(/.md$/, "").split(".");
        return `${parts.slice(0, -1).join(".")}.${
            pageNames.value?.[slug.value] ?? parts[parts.length - 1]
        }`;
    });

    const slug = computed(() => `/plugins/${routeSlug}`);

    const {data: navigation} = await useFetch("/api/plugins?type=navigation");
    const {data: aliasMapping} = await useFetch<Record<string, string>>(
        "/api/plugins?type=aliasMapping",
        {key: "AliasMapping"}
    );

    const pageList = computed(() => recursivePages(navigation.value?.[0] ?? {}));
    const pageNames = computed(() => generatePageNames(navigation.value?.[0] ?? {}));

    /**
     * Handle alias redirects before fetching page data to avoid broken layout.
     * This ensures instant redirects for old URLs that use plugin aliases.
     *
     * @example
     * Old URL: /plugins/plugin-notifications/tasks/twilio/io.kestra.plugin.notifications.twilio.twilioalert
     * Redirects to: /plugins/plugin-twilio/notify/io.kestra.plugin.twilio.notify.twilioalert
     */
    if (pluginType.value && aliasMapping.value && !pageList.value?.includes(slug.value)) {
        let redirectPath = pageList.value?.find(page => page?.endsWith("/" + pluginType.value));

        if (!redirectPath) {
            const actualClass = aliasMapping.value[pluginType.value.toLowerCase()];
            if (actualClass) {
                redirectPath = pageList.value?.find(page =>
                    page?.toLowerCase().endsWith("/" + actualClass.toLowerCase())
                );
            }
        }

        if (redirectPath) {
            await navigateTo(redirectPath, { replace: true });
        } else {
            throw createError({
                statusCode: 404,
                message: `Plugin page not found: ${slug.value}`,
                fatal: true
            });
        }
    }

    interface PluginFetchResponse {
        body: {
            group: string;
            plugins: Plugin[];
            toc: {links: any[]};
        };
        title?: string;
        description?: string;
        error?: boolean;
        message?: string;
        image?: string;
        rightBar?: boolean;
    }

    const defaultPluginFetchResponse: PluginFetchResponse = {
        body: {
            group: "",
            plugins: [],
            toc: {links: []}
        },
        title: "",
        description: "",
        error: false,
        message: "",
        image: ""
    };

    const {data: pageData} = await useFetch<PluginFetchResponse>(
        computed(() =>
            pluginType.value === undefined
                ? `/api/plugins?page=${splitRouteSlug[0]}&type=plugin`
                : `/api/plugins?page=${pluginType.value}&type=definitions`
        ),
        {key: pluginType.value ?? splitRouteSlug[0]}
    );

    const {data: sidebarPluginData} = await useFetch<{
        body: {
            group: string;
            plugins: Plugin[];
            toc: {links: any[]};
        };
    }>(`/api/plugins?page=${splitRouteSlug[0]}&type=plugin`, {
        key: `Sidebar-${splitRouteSlug[0]}`
    });

    const {data: subGroupsIcons} = await useFetch<Record<string, string>>('/api/plugins?type=subGroupsIcons', {
        key: 'SubGroupsIcons'
    });

    const {data: elementIcons} = await useAsyncData(
        `ElementsIcons-${pluginName.value}-${pluginType.value}`,
        async () => {
            if (!pluginType.value) return null;
            return $fetch<Record<string, string>>(`/api/plugins?page=${pluginName.value}&type=elementsIcons`);
        },
        {
            watch: [pluginType]
        }
    );

    const githubReleaseRepo = computed(() => {
        const name = pluginName.value ?? "";
        // because core plugin is part of kestra repo
        if (name === "core") {
            return "kestra";
        }
         // because plugin-jdbc is the parent for many subgroups in same repo.
        if (name.startsWith("plugin-jdbc-") || name === "plugin-jdbc") {
            return "plugin-jdbc";
        }
        return name;
    });

    const {data: githubVersions} = await useAsyncData(
        `GitHubVersions-${githubReleaseRepo.value}`,
        () => {
            return $fetch(`/api/github-releases?repo=${githubReleaseRepo.value}`);
        }
    );

    const {data: allPlugins} = await useFetch<Plugin[]>(
        "/api/plugins?type=allPlugins",
        {key: "AllPlugins"}
    );

    const {data: allPluginMetadata} = await useFetch<PluginMetadata[]>(
        "/api/plugins?type=metadata",
        {key: "AllPluginMetadata"}
    );

    const metadataMap = computed(() =>
        allPluginMetadata.value?.reduce((acc, meta) => {
            acc[meta.group] = meta;
            return acc;
        }, {} as Record<string, PluginMetadata>) ?? {}
    );

    const elementTitle = computed(() => Object.fromEntries(
        (pluginsWithoutDeprecated.value ?? []).flatMap(p => Object.entries(p)
            .filter(([k, v]) => isEntryAPluginElementPredicate(k, v))
            .flatMap(([_, els]) => (Array.isArray(els) ? els : [])
                .filter(el => el?.title)
                .map(el => [el.cls, {title: el.title}] as [string, {title?: string}])
            )
        ).filter(([_, v]) => Boolean(v?.title))
    ));

    const { counts } = await useBlueprintsCounts();

    const subgroupBlueprintCounts = computed(() => {
        const result: Record<string, number> = {};

        pluginsWithoutDeprecated.value?.forEach((subgroupWrapper) => {
            const subgroupKey = subgroupWrapper.subGroup;
            if (subgroupKey !== undefined) {
                const formattedKey = `${subgroupWrapper.group ?? subgroupWrapper.name}-${slugify(subGroupName(subgroupWrapper))}`;
                result[formattedKey] = counts.value?.[subgroupKey] ?? 0;
            }
        });

        return result;
    });

    const pluginBlueprintCounts = computed(() => counts.value);

    const { data: relatedBlogs } = await useAsyncData(
        `Plugin-Related-Blogs-${pluginName.value}`,
        () => queryCollection(CollectionNames.blogs as keyof typeof CollectionNames)
            .where('plugins', 'LIKE', `%${pluginName.value}%`)
            .order("date", "DESC")
            .limit(4)
            .all()
    );

    const page = computed(() => {
        return pageData.value ?? defaultPluginFetchResponse;
    });

    const pluginsWithoutDeprecated = computed(() =>
        filterPluginsWithoutDeprecated(
            pluginType.value
                ? sidebarPluginData.value?.body?.plugins ?? []
                : page.value?.body?.plugins ?? []
        )
    );

    const rootPlugin = computed(() =>
        pluginsWithoutDeprecated.value?.find((p: Plugin) => p.subGroup === undefined)
    );

    const currentSubgroupPlugin = computed(() => {
        if (!subGroup.value || pluginType.value) return undefined;

        return pluginsWithoutDeprecated.value?.find(p => {
            const subgroupLastSegment = p.subGroup?.split(".").pop();
            const possibleSubgroupMatches = [
                slugify(subGroupName(p)),
                subgroupLastSegment,
                slugify(subgroupLastSegment ?? "")
            ];
            return possibleSubgroupMatches.includes(subGroup.value);
        });
    });



    /**
     * currentPluginMetadata provides the raw array of metadata,
     * while currentPageMetadata filters it down to the exact metadata for the page being viewed.
     */

    const currentPluginMetadata = computed(() => {

        const subgroupId = currentSubgroupPlugin.value?.subGroup ?? currentSubgroupPlugin.value?.group;
        const rootGroupId = rootPlugin.value?.group ?? pluginName.value;

        if (subgroupId) {
            const found = allPluginMetadata.value?.find(m => m.group === subgroupId);
            return found ? [found] : [];
        }

        if (rootGroupId) {
            return allPluginMetadata.value?.filter(m => m.group && (m.group === rootGroupId || m.group.startsWith(rootGroupId + "."))) ?? [];
        }

        return [];
    });

    const currentPageMetadata = computed(() => {
        const meta = currentPluginMetadata.value;
        if (!meta) return null;

        if (Array.isArray(meta)) {
            const rootGroup = rootPlugin.value?.group;
            const subgroupGroup = currentSubgroupPlugin.value?.subGroup ?? currentSubgroupPlugin.value?.group;
            return meta.find(m => m.group === rootGroup || m.group === subgroupGroup) ?? null;
        }
        return meta;
    });

    const currentPluginVideos = computed(() => {
        const meta = currentPluginMetadata.value;
        if (!meta) return [];

        const subgroupId = currentSubgroupPlugin.value?.subGroup ?? currentSubgroupPlugin.value?.group;
        const rootGroup = rootPlugin.value?.group;
        const entries = Array.isArray(meta) ? meta : [meta];

        return entries
            .filter(m => {
                if (!m) return false;

                if (subgroupId) {
                    return typeof m.group === "string" &&
                        (m.group === subgroupId || m.group.startsWith(subgroupId + "."));
                } else if (m.name === pluginName.value) {
                    return true;
                }

                return typeof m.group === "string" &&
                    (m.group === rootGroup || m.group?.startsWith(rootGroup ?? ""));
            })
            .flatMap(m => m?.videos ?? [])
            .filter(Boolean);
    });

    const currentPageIcon = computed(() => {
        const icons = subGroupsIcons.value;
        if (!icons) return undefined;

        let icon;

        if (pluginType.value) {
            icon = elementIcons.value?.[pluginType.value];
        } else if (!subGroup.value && page.value?.body?.group) {
            icon = icons[page.value.body.group];
        } else if (currentSubgroupPlugin.value) {
            icon = icons[currentSubgroupPlugin.value.subGroup ?? ""] ?? icons[currentSubgroupPlugin.value.group];
        }

        return icon ? `data:image/svg+xml;base64,${icon}` : undefined;
    });

    const headingTitle = computed(() => {
        if (pluginType.value) {
            return formatElementName(pluginType.value);
        }
        return getPluginTitle(
            currentSubgroupPlugin.value ?? rootPlugin.value,
            metadataMap.value
        ) ?? pluginName.value;
    });

    const pageNamesHeading = computed(() => ({
        ...(pageNames.value ?? {}),
        [route.path]: headingTitle.value,
        [`/plugins/${pluginName.value}`]: getPluginTitle(
            rootPlugin.value,
            metadataMap.value,
        ) ?? pluginName.value
    }));

    const currentPluginCategories = computed(() => {
        const subgroupCats = currentSubgroupPlugin.value?.categories;
        const pluginCats = rootPlugin.value?.categories;
        return subGroup.value === undefined
            ? pluginCats ?? []
            : (subgroupCats?.length ? subgroupCats : pluginCats ?? []);
    });

    const githubReleasesUrl = computed(() =>
        `https://github.com/kestra-io/${githubReleaseRepo.value}/releases`
    );

    const generateTocForPluginElements = (wrapper: Plugin) =>
        Object.entries(wrapper)
            .filter(([key]) => isEntryAPluginElementPredicate(key, wrapper[key as keyof Plugin]))
            .map(([key]) => {
                const formattedElementType = key.replace(/[A-Z]/g, match => ` ${match}`);
                return {
                    id: `section-${slugify(formattedElementType)}`,
                    depth: 3,
                    text: formatElementType(key)
                };
            });

    const blueprintsSectionHeading = computed(() => getBlueprintsHeading(
            pluginName.value,
            rootPlugin.value,
            subGroup.value,
            pluginType.value
        )
    );

    const pluginToc = computed(() => {
        if (!rootPlugin.value) return [];

        if (subGroup.value && currentSubgroupPlugin.value) {
            return generateTocForPluginElements(currentSubgroupPlugin.value);
        }

        if (!subGroup.value && !pluginType.value) {
            const subGroups = pluginsWithoutDeprecated.value?.filter(p => p.subGroup) ?? [];
            return subGroups.length
                ? subGroups.map(sub => ({
                    id: slugify(subGroupName(sub)),
                    depth: 3,
                    text: subGroupName(sub)
                }))
                : generateTocForPluginElements(rootPlugin.value);
        }

        return [];
    });

    const pageWithToc = computed(() => {
        const currentPage = page.value;
        if (!currentPage?.body || !rootPlugin.value) return currentPage;

        const baseTocLinks = pluginType.value
            ? currentPage.body.toc?.links?.map(l => ({...l, children: undefined})) ?? []
            : currentPage.body?.toc ? [] : pluginToc.value;

        const hasBlueprints = pluginType.value
            ? counts.value?.[pluginType.value] > 0
            : subGroup.value
                ? subgroupBlueprintCounts.value?.[
                    `${rootPlugin.value.group ?? pluginName.value}-${subGroup.value}`
                ] > 0
                : pluginBlueprintCounts.value?.[
                    rootPlugin.value.group ?? pluginName.value
                ] > 0;

        const tocLinks = [
            ...baseTocLinks,
            ...(pluginType.value === undefined && rootPlugin.value.longDescription
                ? [{id: "how-to-use-this-plugin", depth: 2, text: "How to use this plugin"}]
                : []
            ),
            ...(pluginType.value === undefined && currentPluginVideos.value?.length > 0
                ? [{id: "see-it-in-action", depth: 3, text: "See it in action"}]
                : []
            ),
            ...(hasBlueprints && blueprintsSectionHeading.value?.id && blueprintsSectionHeading.value?.text
                ? [{id: blueprintsSectionHeading.value.id, depth: 3, text: blueprintsSectionHeading.value.text}]
                : []
            ),
            ...(pluginType.value === undefined && subGroup.value === undefined && relatedBlogs?.value?.length > 0
                ? [{id: "latest-blog-posts", depth: 3, text: "Latest Blog Posts"}]
                : []
            ),
            ...(allPlugins.value?.some(p => p.name !== pluginName.value && p.categories?.some(cat => currentPluginCategories.value?.includes(cat))) ?? false
                ? [{
                    id: "more-plugins-in-this-category",
                    depth: 3,
                    text: "More Plugins in this Category"
                }]
                : []
            )
        ];

        return {
            ...currentPage,
            body: {
                ...currentPage.body,
                toc: {
                    links: tocLinks
                }
            }
        };
    });

    const activeSectionId = ref("");

    onMounted(async () => {
        activeSectionId.value = window.location.hash.slice(1);
        useEventListener(window, "hashchange", () => {
            activeSectionId.value = window.location.hash.slice(1);
        });
    });

    if (page?.value?.error) {
        throw createError({
            statusCode: 404,
            message: page?.value?.message,
            fatal: true
        });
    }

    if (pluginType.value === undefined && page.value && rootPlugin.value) {
        page.value.title = rootPlugin.value?.title.charAt(0).toUpperCase() +
            rootPlugin.value?.title.slice(1) +
            (subGroup.value === undefined
                ? ""
                : ` - ${subGroupName({title: subGroup.value} as any)}`
            );

        let combinedDescription = currentPageMetadata.value?.description;
        const body = currentPageMetadata.value?.body;
        if (body && body !== combinedDescription) {
            combinedDescription += (combinedDescription ? "\n\n" : "") + body;
        }
        page.value.description = combinedDescription ??
            (subGroup.value === undefined
                ? rootPlugin.value?.description
                : currentSubgroupPlugin.value?.description
            );
    }

    if (page?.value) {
        if (pluginType.value) {
            page.value.image = `${origin}/meta/plugins/${pluginType.value || pluginName.value}.svg?type=${pluginType.value ? "definitions" : "plugin"}`;
        }
        await useContentHead(page);
    }
</script>