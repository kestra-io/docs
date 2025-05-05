<template>
    <div class="container-fluid bd-gutter bd-layout">
        <NavSideBar type="plugins" :navigation="navigation"/>
        <article class="bd-main order-1" :class="{'full': page?.rightBar === false }">
            <div class="bd-title">
                <Breadcrumb :slug="slug" :pageList="pageList" :pageNames="pageNames"/>
                <h1 v-if="page && pageName" class="py-0 title">
                    <NuxtImg
                        v-if="pageIcon"
                        :src="pageIcon"
                        :alt="pageName"
                        width="40"
                        height="40"
                        loading="lazy"
                        format="webp"
                        quality="80"
                        densities="x1 x2"
                        class="me-3 page-icon"
                    />
                    <span class="text-capitalize" v-html="transformTitle(pageName)" />
                </h1>
            </div>
            <NavToc :rate-helpful="true" :page="page" capitalize class="my-md-0 my-4 right-menu"/>

            <div class="bd-content" v-if="page">
                <DocsFeatureScopeMarker v-if="page.editions || page.version || page.deprecated || page.release"
                                        :page="page"/>
                <PluginIndex v-if="pluginType === undefined"
                            class="plugin-index"
                            :icons="icons"
                            :plugins="page.body.plugins"
                            :plugin-name="pluginName"
                            :sub-group="subGroup">
                    <template v-slot:markdown="{ content }">
                        <MDC :value="content">
                            <template #default="mdcProps">
                                <pre v-if="mdcProps.error" style="color: white;">{{ mdcProps.error }}</pre>
                                <ContentRenderer v-else class="markdown" :value="mdcProps?.body"/>
                            </template>
                        </MDC>
                    </template>
                </PluginIndex>
                <Suspense v-else>
                    <SchemaToHtml class="plugin-schema" :schema="page.body.jsonSchema" :plugin-type="pluginType"
                            :props-initially-expanded="true">
                        <template #markdown="{ content }">
                            <MDC :value="content">
                                <template #default="mdcProps">
                                    <pre v-if="mdcProps.error" style="color: white;">{{ mdcProps.error }}</pre>
                                    <ContentRenderer v-else class="markdown" :value="mdcProps?.body"/>
                                </template>
                            </MDC>
                        </template>
                    </SchemaToHtml>
                </Suspense>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
    import {SchemaToHtml, PluginIndex, isEntryAPluginElementPredicate, subGroupName, slugify} from '@kestra-io/ui-libs'
    import type {Plugin} from "@kestra-io/ui-libs";
    import NavSideBar from "~/components/docs/NavSideBar.vue";
    import Breadcrumb from "~/components/layout/Breadcrumb.vue";
    import NavToc from "~/components/docs/NavToc.vue";
    import {generatePageNames, recursivePages} from "~/utils/navigation.js";

    const route = useRoute()
    const routeSlug: string = route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug;
    const slug = computed(() => `/plugins/${routeSlug}`);
    const splitRouteSlug = routeSlug.split("/");
    const pluginName = computed(() => splitRouteSlug?.[0]);

    const {data: navigation} = await useFetch(`/api/plugins?type=navigation`);
    const pageList = computed(() => recursivePages(navigation.value?.[0]));
    const pageNames = computed(() => generatePageNames(navigation.value?.[0]));

    const pluginType = computed(() => {
        const lowerCasePluginType = splitRouteSlug[splitRouteSlug.length - 1].includes(".") ? splitRouteSlug[splitRouteSlug?.length - 1].replace(/.md$/, "") : undefined;
        if (lowerCasePluginType === undefined) {
            return undefined;
        }

        let splitPluginType = lowerCasePluginType.split(".");
        const packageName = splitPluginType.slice(0, splitPluginType.length - 1).join(".");
        return `${packageName}.${pageNames.value[slug.value] ?? splitPluginType[splitPluginType.length - 1]}`;
    });

    onMounted(async () => {
        if (pluginType.value !== undefined && !pageList.value.includes(slug.value)) {
            const redirect = pageList.value.find(page => page.endsWith("/" + pluginType.value));
            if (redirect !== undefined) {
                await navigateTo({
                    path: redirect
                });
            }
        }
    })

    function pluginToc(subGroupsWrappers: Plugin[]) {
        return subGroupsWrappers.filter(subGroupWrapper => subGroupWrapper.subGroup !== undefined)
            .map(subGroupWrapper => {
                let subGroup = subGroupName(subGroupWrapper);
                return ({
                    id: `group-${slugify(subGroup)}`,
                    depth: 2,
                    text: subGroup
                });
            });
    }

    function pluginSubGroupToc(subGroupWrapper: Plugin) {
        return Object.entries(subGroupWrapper).filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
            .map(([key, value]) => {
                let text = key.replaceAll(/[A-Z]/g, match => ` ${match}`);
                text = text.charAt(0).toUpperCase() + text.slice(1);

                return {
                    id: `section-${slugify(key)}`,
                    depth: 2,
                    text,
                    children: value.map((element) => ({
                        id: slugify(element),
                        depth: 3,
                        text: element.substring(element.lastIndexOf('.') + 1)
                    }))
                };
            });
    }

    const transformTitle = (text) => {
        return text
            .replace(/([A-Z])/g, '&#x200B;$1')
            .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    }

    const subGroup = computed(() => {
        const maybeSubGroup = splitRouteSlug?.[1];
        return maybeSubGroup?.includes(".") ? undefined : maybeSubGroup;
    });

    const pageUrl = computed(() => pluginType.value === undefined ? `/api/plugins?page=${splitRouteSlug[0]}&type=plugin` : `/api/plugins?page=${pluginType.value}&type=definitions`);
    const dataKey = computed(() => pluginType.value === undefined ? splitRouteSlug[0] : pluginType.value);

    const {data: pageData} = await useFetch<{
        body: {
            group: string,
            plugins: any[],
            toc: {links: any[]}
        }
        title?: string,
        description?: string,
        error?: boolean,
        message?: string,
    }>(pageUrl.value, {key:`Container-${dataKey.value}`});

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
        }
    });

    if (page?.value?.error) {
        throw createError({statusCode: 404, message: page?.value?.message, fatal: true})
    }

    if (page.value?.body && page.value.body?.toc === undefined) {
        let links;
        if (subGroup.value !== undefined) {
            links = pluginSubGroupToc(page.value.body.plugins.find(p => slugify(subGroupName(p)) === subGroup.value));
        } else if (page?.value.body.plugins.length === 1) {
            links = pluginSubGroupToc(page.value.body.plugins[0]);
        } else {
            links = pluginToc(page.value.body.plugins)
        }
        page.value.body.toc = {
            links
        }
    }

    const pluginWrapper = computed(() => page.value?.body.plugins.find(p => p.subGroup === undefined));
    const subGroupWrapper = computed(() => subGroup.value === undefined || pluginType.value !== undefined ? undefined : page.value.body.plugins.find(p => slugify(subGroupName(p)) === subGroup.value));

    if (pluginType.value === undefined && page.value) {
        page.value.title = pluginWrapper.value.title.charAt(0).toUpperCase() + pluginWrapper.value.title.slice(1) + (subGroup.value === undefined ? "" : ` - ${subGroupName({title: subGroup.value})}`);

        page.value.description = subGroup.value === undefined ? pluginWrapper.value.description : subGroupWrapper.value.description;
    }

    const {origin} = useRequestURL();

    if (page?.value){
        page.value.image = `${origin}/landing/home/header-bg.png`
        await useContentHead(page);
    }

    const pageName = computed(() => pageNames.value[route.path]);

    let {data: iconsData} = await useAsyncData(`PluginSubgroupsIcon-${pluginName.value}`, () => {
        try {
            return $fetch(`/api/plugins?page=${pluginName.value}&type=subGroupsIcons`);
        } catch (error) {
            throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
        }
    });

    const {data: elementsIcons} = await useAsyncData(`PluginElementsIcon-${pluginName.value}`, () => {
        try {
            return $fetch(`/api/plugins?page=${pluginName.value}&type=elementsIcons`);
        } catch (error) {
            throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
        }
    });

    const icons = computed<Record<string, any>>(() => ({
        ...iconsData.value,
        ...elementsIcons.value
    }));

    const pageIcon = computed(() => {
        let icon;
        if (pluginType.value !== undefined) {
            icon = icons.value[pluginType.value];
            if (icon === undefined) {
                icon = Object.entries(icons.value).filter(([key]) => pluginType.value?.includes(key))
                    .sort(([key1], [key2]) => key2.length - key1.length)?.[0]?.[1];
            }
        } else if (subGroup.value === undefined && page.value?.body.group) {
            icon = icons.value[page.value.body.group];
        } else {
            icon = icons.value[subGroupWrapper.value.subGroup]
        }

        return `data:image/svg+xml;base64,${icon}`;
    });
</script>
<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    :deep(.plugin-title) {
        font-size: 1.5em;
    }

    .container-fluid {
        gap: calc($spacer * 4);
        overflow-x: unset;

        .bd-title {
            margin-top: calc($spacer * 4);
            @include media-breakpoint-down(lg) {
                margin-top: calc($spacer * 1);
            }

            h1 {
                @media only screen and (min-width: 1920px) {
                    max-width: 71.25rem;
                }
            }
        }

        .bd-main {
            gap: calc($spacer * 2) calc($spacer * 4);
            @include media-breakpoint-down(sm) {
                gap: calc($spacer * 2) calc($spacer * 7);
            }
        }

        .bd-content {
            margin: 0 auto 2em auto;
            @media only screen and (min-width: 1920px) {
                max-width: 71.25rem
            }
        }

        .title {
            font-size: $h2-font-size;
            font-weight: 400;
            line-height: 3.25rem;
            margin: 0 auto;
        }
    }

    :deep(p) {
        line-height: 1.75rem;
        font-size: $h6-font-size !important;
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

    :deep(h3 > a ) {
        color: $white !important;
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 2.375rem;
    }

    :deep(h4 > a ) {
        color: $white !important;
        font-weight: 600;
    }

    :deep(h5) {
        color: $white !important;
        font-weight: 600;
    }

    .bd-main :deep(p > a), .bd-main :deep(ul a) {
        color: $purple-36;
    }

    .container, :deep(h2 > a) {
        color: $white !important;
    }

    :deep(p > code), :deep(li > code), :deep(a > code), :deep(table code) {
        color: $white-3;
        text-decoration: none !important;
        border-radius: 0.25rem;
        padding: 0 calc($spacer / 4);
    }

    :deep(.code-block), :deep(p > code), :deep(li > code), :deep(a > code), :deep(table code) {
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
            color: $link-color;
        }

        &:hover {

            span {
                color: $white;
            }
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

    .plugin-schema {
        :deep(hr) {
            opacity: 1;
            border-top: calc(2 * var(--bs-border-width)) solid var(--kestra-io-token-color-border-secondary);
        }

        :deep(article) {
            display: flex;
            flex-direction: column;
            gap: var(--spacer);
        }

        :deep(.code-block) {
            background-color: var(--kestra-io-token-color-background-secondary);
            border: 1px solid var(--kestra-io-token-color-border-secondary);
        }

        :deep(.language), :deep(.copy) {
            color: var(--kestra-io-neutral-gray700) !important;
        }

        :deep(#copied-tooltip) {
            background: $gray-500;
            color: #fff;
        }

        :deep(.markdown) {
            display: flex;
            flex-direction: column;
            gap: var(--spacer);
        }

        :deep(.plugin-section) {
            p {
                &:not(.doc-alert p) {
                    margin-bottom: 0;
                }

                & > code {
                    color: var(--kestra-io-neutral-gray900);
                    background-color: transparent !important;
                    border: none;
                }
            }

            .border, .property:not(:first-child) {
                border-color: var(--kestra-io-token-color-border-secondary) !important;
            }

            .collapse-button {
                font-size: var(--font-size-lg);
                line-height: 1.5rem;
                color: var(--kestra-io-token-color-white);
            }

            > .collapse-button {
                line-height: 2.375rem;

                &:not(.collapsed) {
                    color: var(--kestra-io-token-text-link-default);

                    & .material-design-icon {
                        background-color: var(--kestra-io-neutral-gray400);
                    }
                }
            }

            .collapsible-body .border {
                #{--collapsible-border-color}: var(--kestra-io-token-color-border-secondary);
                border-color: var(--kestra-io-token-color-border-secondary) !important;

                > .property {
                    background: var(--kestra-io-token-color-background-secondary);

                    &:not(:has(.collapse-button.collapsed)) {
                        background: var(--kestra-io-neutral-gray300);

                        > .collapsible-body {
                            background: var(--kestra-io-token-color-background-primary);
                        }
                    }
                }
            }

            .property-detail {
                color: var(--kestra-io-token-color-white);

                .property-description p {
                    color: var(--kestra-io-neutral-gray700);
                }

                > *:not(:first-child) {
                    border-top: var(--bs-border-width) var(--bs-border-style) var(--kestra-io-token-color-border-secondary);
                }

                .border:not(.type-box) {
                    border-color: var(--kestra-io-neutral-gray500) !important;
                }
            }

            .type-box {
                color: var(--kestra-io-token-color-white);

                .ref-type {
                    border-right: 1px solid var(--kestra-io-token-color-border-primary);
                }

                &:has(.ref-type):hover {
                    background: var(--kestra-io-token-color-background-hover-primary) !important;

                    .ref-type {
                        border-right: 1px solid var(--ks-border-secondary);
                    }
                }
            }
        }
    }

    :deep(.bd-markdown > h2 > a > span ) {
        display: inline !important;
    }

    .plugin-index {
        :deep(div):has(> .row-link) {
            gap: var(--spacer);
        }

        :deep(.elements-section) {
            gap: calc(2 * var(--spacer));
        }

        :deep(.row-link) {
            padding: calc(.5 * var(--spacer)) calc(2 * var(--spacer));
            background: var(--kestra-io-token-color-background-secondary);
            color: var(--kestra-io-token-color-white);
            border: 1px solid var(--kestra-io-token-color-border-secondary);

            &:hover, &:focus {
                outline: none;
                background: var(--kestra-io-neutral-gray300);
                border: 1px solid var(--tokens-border-border-active);

                .material-design-icon {
                    color: var(--kestra-io-neutral-white);
                }
            }

            img {
                width: 3.375rem;
                height: 3.375rem;
            }

            .material-design-icon {
                color: var(--kestra-io-neutral-gray700);

                &, & * {
                    width: 1.5rem;
                    height: 1.5rem;
                    bottom: 0;
                }
            }
        }
    }

    :deep(.alert-info) {
        display: flex;
        gap: 12px;
        padding: 16px;
        background-color: var(--ks-background-info);
        border: 1px solid var(--ks-border-info);
        border-left-width: 5px;
        border-radius: 8px;

        &::before {
            content: '!';
            min-width: 20px;
            height: 20px;
            margin-top: 4px;
            border-radius: 50%;
            background: var(--ks-content-info);
            color: $black;
            font: 600 13px/20px sans-serif;
            text-align: center;
        }

        p { color: var(--ks-content-info); }
    }
</style>