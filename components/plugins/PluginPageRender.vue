<template>
    <div class="container-fluid bd-gutter bd-layout">
        <PluginSidebar
            :plugin-wrapper="rootPlugin"
            :plugins-without-deprecated="pluginsWithoutDeprecated"
            :plugin-name="pluginName"
            :title="headingTitle"
            :route-parts="routeParts"
            @navigate="(path0) => navigateTo({path: path0})"
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
                :schemas="elementTitle"
            />

            <PluginVideos
                v-if="pluginType === undefined && currentPluginVideos && currentPluginVideos?.length > 0"
                :videos="currentPluginVideos"
            />

            <RelatedBlueprints
                :plugin-name="pluginName"
                :plugin-wrapper="rootPlugin"
                :current-subgroup-plugin="currentSubgroupPlugin"
                :sub-group-name="currentSubgroupPlugin ? slugify(subGroupName(currentSubgroupPlugin)) : subGroup"
                :plugin-type="pluginType"
                :custom-id="blueprintsSectionHeading?.id"
            />

            <RelatedBlogs
                v-if="pluginType === undefined && subGroup === undefined && relatedBlogs && relatedBlogs.length > 0"
                :posts="relatedBlogs"
            />

            <SimilarPlugins
                v-if="currentPluginCategories && currentPluginCategories.length > 0"
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
    import { ref } from "vue";
    import {useEventListener} from "@vueuse/core";
    import {subGroupName, slugify, type PluginMetadata, type Plugin} from "@kestra-io/ui-libs";

    import NavToc from "../../components/docs/NavToc.vue";
    import Breadcrumb from "../../components/layout/Breadcrumb.vue";
    import PluginMDC from "../../components/plugins/PluginMDC.vue";
    import RelatedBlogs from "../../components/plugins/RelatedBlogs.vue";
    import PluginVideos from "../../components/plugins/PluginVideos.vue";
    import PluginSidebar from "../../components/plugins/PluginSidebar.vue";
    import SimilarPlugins from "../../components/plugins/SimilarPlugins.vue";
    import RelatedBlueprints from "../../components/plugins/RelatedBlueprints.vue";
    import type { ReleaseInfo } from "../../server/api/github-releases";

    const props = defineProps<{
        slug: string;
        pageList: string[];
        pluginsWithoutDeprecated: Plugin[];
        pageNamesHeading: Record<string, string>;
        page: any;
        pageWithToc: any;
        pluginName: string;
        pluginType?: string;
        subGroup?: string;
        rootPlugin: Plugin;
        allPlugins: Plugin[];
        subGroupsIcons: Record<string, string>;
        route: any;
        githubVersions?: {
            versions?: ReleaseInfo[] | undefined;
        };
        githubReleasesUrl: string;
        relatedBlogs?: any[];
        metadataMap: Record<string, PluginMetadata>;
        elementTitle: Record<string, {title: string;}>;
        currentPluginVideos?: string[];
        routeParts: string[];
        headingTitle: string;
        currentPluginCategories?: string[];
        currentPluginMetadata?: PluginMetadata[];
        currentSubgroupPlugin?: Plugin;
        subgroupBlueprintCounts: Record<string, number>;
        currentPageIcon?: string;
        blueprintsSectionHeading?: {id: string; title: string};
    }>();


    const activeSectionId = ref("");

    function navigateTo(options: {path: string}) {
        return window.location.href = options.path;
    }

    activeSectionId.value = window.location.hash.slice(1);
    useEventListener(window, "hashchange", () => {
        activeSectionId.value = window.location.hash.slice(1);
    });

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