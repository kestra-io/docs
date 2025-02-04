<template>
    <div class="container-fluid bd-gutter bd-layout">
        <NavSideBar :type="type" :navigation="navigation"/>
        <article class="bd-main order-1" :class="{'full': page?.rightBar === false , 'docs' : isDoc}">
            <div class="bd-title">
                <Breadcrumb :slug="slug" :pageList="pageList" :pageNames="pageNames"/>
                <h1 v-if="page && getPageTitle()" class="py-0 title">
                    <NuxtImg
                        v-if="pageIcon"
                        :src="pageIcon"
                        :alt="getPageTitle()"
                        width="40px"
                        height="40px"
                        loading="lazy"
                        format="webp"
                        quality="80"
                        densities="x1 x2"
                        class="me-3 page-icon"
                    />
                    <span v-html="transformTitle(getPageTitle())"></span>
                </h1>
            </div>
            <NavToc :rate-helpful="true" :page="page" class="my-md-0 my-4 right-menu"/>

            <div class="bd-content">
                <DocsFeatureScopeMarker v-if="page.editions || page.version" :editions="page.editions"
                                        :version="page.version"/>
                <Suspense v-if="page.pluginType === 'definitions'">
                    <SchemaToHtml class="plugin-schema" :schema="page.body.jsonSchema" :plugin-type="getPageName()">
                        <template v-slot:markdown="{ content }">
                            <MDC :value="content" />
                        </template>
                    </SchemaToHtml>
                </Suspense>
                <ContentRendererMarkdown
                    class="bd-markdown"
                    :value="page"
                    data-bs-spy="scroll"
                    data-bs-target="#nav-toc"
                    v-else
                />
                <PrevNext v-if="prevNext" :navigation="navigation"/>
            </div>
        </article>
    </div>
</template>

<script setup>
    import PrevNext from "~/components/layout/PrevNext.vue";
    import NavSideBar from "~/components/docs/NavSideBar.vue";
    import Breadcrumb from "~/components/layout/Breadcrumb.vue";
    import NavToc from "~/components/docs/NavToc.vue";
    import {SchemaToHtml} from '@kestra-io/ui-libs'
    import {hash} from "ohash";
    import {recursivePages, generatePageNames} from "~/utils/navigation.js";

    const isDoc = computed(() => props.type === 'docs');
    const config = useRuntimeConfig();

    const route = useRoute()
    const slug = computed(() => `/${props.type}/${route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug}`);
    let page;


    const fetchNavigation = async () => {
        let navigationFetch;
        if (props.type === "plugins") {
            navigationFetch = await useFetch(`/api/plugins?type=navigation`);
        } else {
            const queryBuilder = queryContent('/' + props.type + '/');

            navigationFetch = await useAsyncData(
                `NavSideBar-${hash(props.type)}`,
                () => fetchContentNavigation(queryBuilder)
            );

            if (navigationFetch.data && navigationFetch.data.value && props.type === 'docs' && !navigationFetch.data.value[0].children.find((item) => (item.title === "Videos tutorials"))) {
                navigationFetch.data.value[0].children.splice(navigationFetch.data.value[0].children.length - 3, 0, {
                    title: "Videos Tutorials",
                    _path: "/tutorial-videos",
                });
            }
        }

        const navigation = navigationFetch.data;

        const pageList = recursivePages(navigation.value[0]);
        const pageNames = generatePageNames(navigation.value[0]);

        return {navigation, pageList, pageNames};
    }

    const transformTitle = (text) => {
        return text
            .replace(/([A-Z])/g, '&#x200B;$1')
            .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    }

    const props = defineProps({
        type: {
            type: String,
            required: true
        },
        prevNext: {
            type: Boolean,
            required: false,
            default: true
        },
    })

    if (props.type === 'plugins') {
        const parts = slug.value.split('/');
        let pageUrl;
        if (parts?.length > 3) {
            pageUrl = `/api/plugins?page=${parts[parts?.length - 1].replace(/.md$/, "")}&type=definitions`
        } else {
            pageUrl = `/api/plugins?page=${parts[2]}&type=plugin`
        }

        const {data: pluginInformation} = await useAsyncData(`Container-${hash(pageUrl)}`, () => {
            return $fetch(pageUrl)
        });

        if (pluginInformation?.value?.error) {
            throw createError({statusCode: 404, message: pluginInformation?.value?.message, fatal: true})
        }
        page = pluginInformation?.value;
    } else {
        const {data, error} = await useAsyncData(`Container-${hash(slug.value)}`, () => {
            try {
                return queryContent(slug.value).findOne();
            } catch (error) {
                throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
            }
        });
        page = data.value;

        if (error && error.value) {
            throw error.value;
        }
    }

    const {navigation, pageList, pageNames} = await fetchNavigation();

    useContentHead(page);

    const getPageType = () => {
        const paths = route.path.split('/');
        return paths[paths?.length - 1];
    }

    const getPageName = () => {
        const pageType = getPageType().split('.');
        pageType[pageType?.length - 1] = pageNames[getPageType()];
        return pageType.join('.');
    }

    let pageIcon = page.icon;
    if (page.pluginType === 'definitions') {
        const iconB64 = await $fetch(`/api/plugins?page=${getPageName()}&type=icon`);
        pageIcon = `data:image/svg+xml;base64,${iconB64}`;
    }

    const getPageTitle = () => {
        return pageNames[getPageType()];
    }

    const {description, title} = page;
    const {origin} = useRequestURL();
    useHead({
        meta: [
            {name: 'twitter:card', content: 'summary_large_image'},
            {name: 'twitter:site', content: '@kestra_io'},
            {name: 'twitter:title', content: title},
            {name: 'twitter:description', content: description},
            {name: 'twitter:image', content: `${origin}/landing/home/header-bg.png`},
            {name: 'twitter:image:alt', content: title}
        ]
    })
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
            gap: calc($spacer * 2) $spacer;
            @include media-breakpoint-down(sm) {
                gap: calc($spacer * 2) calc($spacer * 7);
            }
        }

        .bd-content {
            margin: 0 auto 2em auto;
            @media only screen and (min-width: 1920px) {
                max-width:71.25rem
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

    :deep(.doc-alert) {
        border: 1px solid #3A3C55;
        background-color: #18131F;
        color: #B9BEF8;

        p {
            font-size: $font-size-base;
        }
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

        :deep(.plugin-section) {
            & .material-design-icon {
                &, & * {
                    bottom: 0;
                }
            }

            p {
                margin-bottom: 0;

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

            .collapsible-body > .border {
                border-color: var(--kestra-io-token-color-border-secondary) !important;

                > .property:not(:first-child) {
                    border-top: var(--bs-border-width) var(--bs-border-style) var(--kestra-io-token-color-border-secondary);
                }

                > * {
                    background: var(--kestra-io-token-color-background-secondary);

                    &:not(:has(.collapse-button.collapsed)) {
                        background: var(--kestra-io-token-color-background-primary);

                        > button {
                            background: var(--kestra-io-neutral-gray300);
                            outline: $spacer solid var(--kestra-io-neutral-gray300);
                        }

                        .property-detail > *:first-child {
                            border-top: none;
                        }
                    }
                }
            }

            .property-detail {
                color: var(--kestra-io-token-color-white);

                .property-description p {
                    color: var(--kestra-io-neutral-gray700);
                }

                > * {
                    border-top: var(--bs-border-width) var(--bs-border-style) var(--kestra-io-token-color-border-secondary);
                }

                .border:not(.type-box) {
                    border-color: var(--kestra-io-neutral-gray500) !important;
                }
            }

            .type-box{
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
</style>