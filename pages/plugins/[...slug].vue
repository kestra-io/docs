<template>
    <div class="container-fluid bd-gutter bd-layout">
        <PluginSidebar 
            :plugin-wrapper="rootPlugin"
            :plugins-without-deprecated="pluginsWithoutDeprecated"
            :plugin-name="pluginName"
            :title="headingTitle"
        />
        <article class="bd-main order-1" :class="{full: page?.rightBar === false}">
            <div class="bd-title">
                <Breadcrumb :slug="slug" :pageList="pageList" :pageNames="pageNamesHeading" />
                <h1 v-if="page" class="py-0 title">
                    <div v-if="currentPageIcon" class="pageIcon">
                        <NuxtImg
                            :src="currentPageIcon"
                            :alt="headingTitle"
                            loading="lazy"
                            format="webp"
                            quality="80"
                            densities="x1 x2"
                            class="blurred-bg"
                        />
                        <NuxtImg
                            :src="currentPageIcon"
                            :alt="headingTitle"
                            width="80"
                            height="80"
                            loading="lazy"
                            format="webp"
                            quality="80"
                            densities="x1 x2"
                            class="page-icon"
                        />
                    </div>
                    <div class="title-content d-flex flex-column justify-space-between w-100">
                        <div class="d-flex align-items-center flex-wrap gap-3">
                            <span>{{ headingTitle }}</span>
                            <img src="/landing/plugins/certified.svg" alt="Certified" class="mt-1" />
                        </div>
                        <MDC v-if="pluginType ? page?.title : page?.description" :value="pluginType ? page.title : page.description">
                            <template #default="mdcProps">
                                <pre v-if="mdcProps?.error" style="color: white;">{{ mdcProps.error }}</pre>
                                <ContentRenderer v-else-if="mdcProps?.body" class="desc markdown" :value="mdcProps" />
                            </template>
                        </MDC>
                    </div>
                    <div v-if="rootPlugin?.license" class="title-actions d-flex flex-column gap-2 ps-4">
                        <span class="btn enterprise-badge">Enterprise Edition</span>
                        <NuxtLink href="/demo" class="btn btn-primary" target="_blank">
                            Talk to us
                        </NuxtLink>
                    </div>
                </h1>
            </div>

            <PluginMDC
                v-if="pageWithToc"
                :page="page"
                :plugin-type="pluginType"
                :icons="subGroupsIcons"
                :plugins-without-deprecated="pluginsWithoutDeprecated"
                :plugin-name="pluginName"
                :sub-group="subGroup"
                :route-path="route.path"
                :active-id="activeSectionId"
                :subgroup-blueprint-counts="subgroupBlueprintCounts"
                :metadata-map="metadataMap"
            />

            <PluginVideos 
                v-if="pluginType === undefined && currentPluginVideos?.length > 0" 
                :videos="currentPluginVideos" 
            />

            <RelatedBlueprints
                :plugin-name="pluginName"
                :plugin-wrapper="rootPlugin"
                :sub-group-name="currentSubgroupPlugin ? slugify(subGroupName(currentSubgroupPlugin)) : subGroup"
                :plugin-type="pluginType"
                :custom-id="blueprintsSectionHeading?.id"
            />

            <RelatedBlogs
                v-if="pluginType === undefined && subGroup === undefined && relatedBlogs && relatedBlogs.length > 0"
                :posts="relatedBlogs"
            />

            <SimilarPlugins
                v-if="currentPluginCategories?.length > 0"
                :all-plugins="allPlugins"
                :current-plugin-name="pluginName"
                :current-categories="currentPluginCategories"
                :icons="subGroupsIcons"
                :metadata-map="metadataMap"
            />
        </article>
        <NavToc
            :rate-helpful="true"
            :page="pageWithToc"
            :version="githubVersions"
            :releases-url="githubReleasesUrl"
            :categories="currentPluginCategories"
            :metadata="currentPluginMetadata"
            capitalize
            class="right-sidebar"
        />
    </div>
</template>

<script setup lang="ts">
    import {useEventListener} from "@vueuse/core";
    import {isEntryAPluginElementPredicate, subGroupName, slugify, filterPluginsWithoutDeprecated, extractPluginElements, type PluginMetadata, type Plugin} from "@kestra-io/ui-libs";
    import {useBlueprintsCounts} from "~/composables/useBlueprintsCounts";
    import {formatElementType, formatElementName, getBlueprintsHeading, getPluginTitle} from "../../utils/pluginUtils";
    import {generatePageNames, recursivePages} from "~/utils/navigation";

    import NavToc from "../../components/docs/NavToc.vue";
    import Breadcrumb from "../../components/layout/Breadcrumb.vue";
    import PluginMDC from "../../components/plugins/PluginMDC.vue";
    import RelatedBlogs from "../../components/plugins/RelatedBlogs.vue";
    import PluginVideos from "../../components/plugins/PluginVideos.vue";
    import PluginSidebar from "../../components/plugins/PluginSidebar.vue";
    import SimilarPlugins from "../../components/plugins/SimilarPlugins.vue";
    import RelatedBlueprints from "../../components/plugins/RelatedBlueprints.vue";

    const route = useRoute();
    const {origin} = useRequestURL();
    const {public:{CollectionNames}} = useRuntimeConfig();

    const routeSlug: string = route.params.slug instanceof Array
        ? route.params.slug.join("/")
        : route.params.slug;

    const splitRouteSlug = routeSlug.split("/");

    const pluginName = computed(() => splitRouteSlug?.[0]);

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

    const pageList = computed(() => recursivePages(navigation.value?.[0]));
    const pageNames = computed(() => generatePageNames(navigation.value?.[0]));

    const {data: pageData} = await useFetch<{
        body: {
            group: string;
            plugins: Plugin[];
            toc: {links: any[]};
        };
        title?: string;
        description?: string;
        error?: boolean;
        message?: string;
    }>(
        computed(() => 
            pluginType.value === undefined
                ? `/api/plugins?page=${splitRouteSlug[0]}&type=plugin`
                : `/api/plugins?page=${pluginType.value}&type=definitions`
        ),
        {key: computed(() => pluginType.value ?? splitRouteSlug[0])}
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

    const {data: subGroupsIcons} = await useFetch('/api/plugins?type=subGroupsIcons', {
        key: 'SubGroupsIcons'
    });

    const {data: elementIcons} = await useAsyncData(
        computed(() => `ElementsIcons-${pluginName.value}-${pluginType.value}`),
        () => {
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
        () => queryCollection(CollectionNames.blogs)
            .where('plugins', 'LIKE', `%${pluginName.value}%`)
            .order("date", "DESC")
            .limit(4)
            .all()
    );

    const page = computed(() => {
        return pageData.value ?? {
            body: {
                group: "",
                plugins: [],
                toc: {links: []}
            },
            title: "",
            description: "",
            error: false,
            message: ""
        };
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
            metadataMap.value
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
        if (pluginType.value !== undefined && !pageList.value?.includes(slug.value)) {
            const redirectPath = pageList.value?.find(
                page => page?.endsWith("/" + pluginType.value)
            );
            if (redirectPath !== undefined) {
                await navigateTo({path: redirectPath});
            }
        }

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
                : ` - ${subGroupName({title: subGroup.value})}`
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

<style lang="scss" scoped>
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;
    @import "../../assets/styles/variable";

    :deep(.plugin-title) {
        font-size: 1.5em;
    }

    .container-fluid {
        gap: 0;
        overflow-x: hidden;
        border-top: 1px solid $black-3;
        padding: 0;
        display: flex;
        flex-direction: column;

        @include media-breakpoint-up(lg) {
            display: grid;
            grid-template-columns: 250px 1fr 269px;
            grid-template-rows: auto 1fr;
            grid-template-areas:
                "sidebar article toc"
                "sidebar article toc";
        }

        >.plugin-sidebar {
            @include media-breakpoint-up(lg) {
                grid-area: sidebar;

            }
        }

        >.bd-main {
            @include media-breakpoint-up(lg) {
                grid-area: article;
            }
        }

        >.right-sidebar {
            @include media-breakpoint-up(lg) {
                grid-area: toc;
                background-color: #0A0B0D;
            }

            @include media-breakpoint-down(lg) {
                margin-top: 2rem;
                padding: 0 20px;
                width: 100%;
                box-sizing: border-box;
            }
        }

        .bd-title {
            margin-top: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid $black-3;
            width: 100%;
            box-sizing: border-box;

            @include media-breakpoint-up(lg) {
                margin-left: -2rem;
                margin-right: -2rem;
                padding-left: 2rem;
                padding-right: 2rem;
                width: calc(100% + 4rem);
            }

            @include media-breakpoint-down(lg) {
                margin-top: calc($spacer * 1);
            }

            nav,
            h1 {
                @include media-breakpoint-up(lg) {
                    max-width: 100%;
                }
            }
        }

        .bd-main {
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            width: 100%;
            box-sizing: border-box;

            @include media-breakpoint-up(lg) {
                padding: 0 2rem;
                padding-left: 2.7rem;
            }

            @include media-breakpoint-down(sm) {
                gap: 0 calc($spacer * 7);
            }
        }


        :deep(.bd-toc strong) {
            margin-left: 1.5rem;
            color: var(--ks-content-tertiary);
            font-weight: normal;
            padding-bottom: 0;
        }

        :deep(.bd-toc nav) {
            border: 0;
            padding: 0;
        }

        .title {
            font-size: 2rem;
            font-weight: 600;
            margin: 0 auto;
            display: flex;
            align-items: start;
            gap: 1rem;

            @include media-breakpoint-down(lg) {
                display: grid;
                grid-template-columns: 104px 1fr;
                grid-template-areas: "icon content" "actions content";
                column-gap: 1rem;
                row-gap: 0.875rem;
                align-items: start;

                .pageIcon {
                    grid-area: icon;
                    margin-right: 0;
                }

                .title-content {
                    grid-area: content;
                }

                .title-actions {
                    grid-area: actions;
                    justify-self: start;
                    padding-left: 0 !important;
                    display: flex;
                    flex-direction: row !important;
                    gap: 1rem !important;
                    margin-top: 0.25rem;

                    .btn {
                        min-width: unset;
                        flex: 0 0 auto;
                    }
                }
            }
        }

        .pageIcon {
            min-width: 104px;
            height: 104px;
            border-radius: 14px;
            background: $white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
            position: relative;
            z-index: 5;
            overflow: visible;
        }

        .blurred-bg {
            position: absolute;
            top: 40%;
            left: -30%;
            width: 120%;
            height: 50%;
            filter: blur(50px);
            object-fit: cover;
            object-position: center;
            z-index: -1;
            transform: translateX(-20px);
        }

        .desc {
            font-size: clamp(0.875rem, 0.8rem + 0.2vw, 1rem);
            max-width: 650px;

            @include media-breakpoint-up(md) {
                font-size: 1rem;
            }

            color: color-palette.$base-gray-200;
            margin-top: 0.25rem;
            font-weight: normal;
            line-height: 1.5;

            @include media-breakpoint-down(lg) {
                font-size: 12px;
            }

            @media screen and (max-width: 1100px) {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                line-clamp: 4;
                -webkit-line-clamp: 4;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
            }
        }

        .title {
            .btn {
                min-width: 116px;
                padding: 4px 10px;
                white-space: nowrap;
            }
        }
    }

    :deep(p) {
        line-height: 1.75rem;
        font-size: 1rem;
    }

    :deep(.bd-markdown > h2) {
        margin-top: calc($spacer * 4.12);
        border-top: 1px solid $black-6;
        padding-top: calc($spacer * 3.125);
        margin-bottom: 2rem;

        a {
            border-left: 5px solid $purple-36;
            padding-left: calc($spacer * 0.6);
            font-size: calc($font-size-base * 1.87);
        }
    }


    :deep(p > a) {
        text-decoration: underline;
    }

    :deep(h2 > a) {
        font-weight: 600;
        line-height: 2.375rem;
        margin: 0;
    }

    :deep(h3 > a) {
        color: $gray-200 !important;
        font-size: 18.4px;
        font-weight: 600;
        line-height: 2.375rem;
    }

    :deep(h4 > a) {
        color: $white !important;
        font-weight: 600;
        font-size: 1rem;
    }

    :deep(h5) {
        color: $white !important;
        font-weight: 600;
    }

    :deep(.bd-main h3), :deep(.bd-main h4) {
        padding-top: 0;
    }

    .bd-main :deep(p > a),
    .bd-main :deep(ul a) {
        color: $purple-36;
    }

    .container,
    :deep(h2 > a) {
        color: $white !important;
    }

    :deep(p > code),
    :deep(li > code),
    :deep(a > code),
    :deep(table code) {
        color: $white-3;
        text-decoration: none !important;
        border-radius: 0.25rem;
        padding: 0 calc($spacer / 4);
    }

    :deep(.code-block),
    :deep(p > code),
    :deep(li > code),
    :deep(a > code),
    :deep(table code) {
        border: $block-border;
        background-color: $black-2 !important;
    }

    :deep(p > strong > code) {
        color: $white-3;
        text-decoration: none !important;
        border-radius: 0.25rem;
        padding: 0 calc($spacer / 4);
    }

    :deep(li > mark) {
        background-color: $link-color;
    }

    :deep(.docs-prev-next a) {
        span {
            color: $link-color;
        }

        .directory {
            color: $white;
        }
    }

    :deep(.btn) {
        span {
            color: $white-1;
        }
    }

    :deep(table) {
        td, th {
            background-color: $black-2;
            border: $block-border;
            color: $white;

            a {
                color: $link-color;
            }
        }
    }


    :deep(.bd-markdown > h2 > a > span) {
        display: inline !important;
    }

    // Base layout for alerts (all types)
    :deep(.alert) {
        display: flex;
        gap: 12px;
        padding: 16px;
        border: 1px solid;
        border-left-width: 5px !important;
        border-radius: 8px;

        p, .material-design-icon, .material-design-icon * {
            color: inherit !important;
        }
    }

    $alert-types: (
        danger: (border: --ks-border-error, content: --ks-content-error, background: --ks-background-error),
        warning: (border: --ks-border-warning, content: --ks-content-warning, background: --ks-background-warning),
        info: (border: --ks-border-info, content: --ks-content-info, background: --ks-background-info),
        success: (border: --ks-border-success, content: --ks-content-success, background: --ks-background-success)
    );

    @mixin alert-variants($type, $vars) {
        :deep(.alert-#{$type}) {
            border-color: var(map-get($vars, border)) !important;
            color: var(map-get($vars, content)) !important;
            background-color: var(map-get($vars, background)) !important;

            p, .material-design-icon, .material-design-icon * {
                color: var(map-get($vars, content)) !important;
            }
        }

        :deep(.plugin-section .alert.alert-#{$type}[role="alert"] .material-design-icon),
        :deep(.plugin-section .alert.alert-#{$type}[role="alert"] .material-design-icon *) {
            color: var(map-get($vars, content)) !important;
        }

        :deep(.plugin-section .alert.alert-#{$type}[role="alert"] .material-design-icon > .material-design-icon__svg) {
            fill: var(map-get($vars, content)) !important;
            stroke: var(map-get($vars, content)) !important;
        }
    }

    @each $type, $vars in $alert-types {
        @include alert-variants($type, $vars);
    }

    .enterprise-badge {
        background: #130025;
        border: 1px solid color-palette.$base-yellow-700;
        gap: 4px;
        min-height: 20px;
        border-radius: 40px;
        border-width: 1px;
        font-size: 12px;
        color: color-palette.$base-yellow-100;
        cursor: default;
    }
</style>