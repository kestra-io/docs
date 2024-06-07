<template>
    <div class="container-fluid bd-gutter bd-layout">
        <NavSideBar :type="type" :navigation="navigation"/>
        <article class="bd-main order-1" :class="{'full': page?.rightBar === false , 'docs' : isDoc}">
            <ContentRenderer :value="page">
                <div class="bd-title">
                    <Breadcrumb :slug="slug" :pageList="pageList" :pageNames="pageNames" />
                    <h1 v-if="page && page.title" class="py-0 title">
                        <NuxtImg
                            v-if="page.icon"
                            :src="page.icon"
                            :alt="page.title"
                            width="40px"
                            height="40px"
                            loading="lazy"
                            format="webp"
                            quality="80"
                            densities="x1 x2"
                            class="me-3 page-icon"
                        />
                        <span v-html="transformTitle(page.title)"></span>
                    </h1>
                </div>

                <NavToc :page="page" class="my-md-0 my-4 right-menu" />

                <div class="bd-content">
                    <DocsFeatureScopeMarker v-if="page.editions || page.version" :editions="page.editions" :version="page.version" />
                    <ContentRendererMarkdown
                        class="bd-markdown"
                        :value="page"
                        data-bs-spy="scroll"
                        data-bs-target="#nav-toc"
                    />
                    <HelpfulVote />
                    <PrevNext v-if="prevNext" :navigation="navigation" />
                </div>
            </ContentRenderer>
        </article>
    </div>
</template>

<script setup>
    import PrevNext from "~/components/layout/PrevNext.vue";
    import NavSideBar from "~/components/docs/NavSideBar.vue";
    import Breadcrumb from "~/components/layout/Breadcrumb.vue";
    import NavToc from "~/components/docs/NavToc.vue";
    import HelpfulVote from "~/components/docs/HelpfulVote.vue";
    import {hash} from "ohash";
    import {recursivePages, generatePageNames} from "~/utils/navigation.js";

    const isDoc = computed(() => props.type === 'docs');

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

            if (navigationFetch.data && navigationFetch.data.value && props.type === 'docs' && !navigationFetch.data.value[0].children.find((item) => (item.title === "Videos Tutorials"))) {
              navigationFetch.data.value[0].children.splice(navigationFetch.data.value[0].children.length - 3, 0 , {
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

    if (slug.value.endsWith(".md")) {
        await navigateTo(slug.value.substring(0, slug.value.length - 3));
    }

    if (props.type === 'plugins') {
        const parts = slug.value.split('/');
        let pageUrl;
        if (parts.length > 3) {
            pageUrl = `/api/plugins?page=${parts[parts.length - 1].replace(/.md$/, "")}&type=definitions`
        } else {
            pageUrl = `/api/plugins?page=${parts[2]}&type=plugin`
        }

        const {data: pluginInformation} = await useAsyncData(`Container-${hash(pageUrl)}`, () => {
            return $fetch(pageUrl)
        });

        if (pluginInformation?.value?.error) {
            throw createError({statusCode: 404, message: pluginInformation?.value?.message, fatal: true})
        }
        page = pluginInformation.value;
        const updateObject = function(obj) {
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }

            if (Array.isArray(obj)) {
                return obj.map(updateObject);
            }

            let newObj = { ...obj };
            for (const key in newObj) {
                if (newObj.tag === 'binding') {
                    newObj.children = [{
                        type: 'text',
                        value: newObj.props.value ? "{{ " + newObj.props.value + " }}" : ""
                    }];
                    newObj.tag = 'span'
                }
                newObj[key] = updateObject(newObj[key]);
            }
            return newObj;
        }
        page = updateObject(pluginInformation.value);

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

    const {description, title, ogImage} = page;
    const {origin} = useRequestURL()
    console.log(process.env.NUXT_PUBLIC_SITE_URL);
    useHead({
      meta: [
        {property: 'og:title', content: title},
        {property: 'og:description', content: description},
        {property: 'og:image', content: `https://kestra.io/${ogImage}`},
        {property: 'og:image:alt', content: title},
        {property: 'og:url', content: 'https://kestra.io'},
      ],
    })
</script>
<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        gap: calc($spacer * 4);
        overflow-x: unset;

        .bd-title {
            margin-top: calc($spacer * 4);
            @include media-breakpoint-down(lg) {
                margin-top: calc($spacer * 1);
            }
            h1 {
                max-width: calc($spacer * 43.7);
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
            margin: 0 auto;
            max-width: calc($spacer * 43.7);
            @media only screen and (min-width: 1920px) {
                max-width: 71.25rem;
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
        font-weight: 400;
        line-height: 1.75rem;
        font-size: $h6-font-size;
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
            display: block;
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
    }

    :deep(.code-block), :deep(p > code), :deep(li > code), :deep(a > code), :deep(table code) {
        border: $block-border;
        background-color: $black-2 !important;
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
            background-color: transparent;
            border-bottom: 1px solid #3D3D3F;
            color: $white;

            a {
                color: $link-color;
            }
        }
    }

    .docs :deep(img:not(.page-icon)) {
        width: 100%;
    }
</style>