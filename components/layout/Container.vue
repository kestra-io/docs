<template>
    <div class="container bd-gutter bd-layout margin">
        <NavSideBar :type="type" :navigation="navigation"/>
        <article class="bd-main order-1" :class="{'full': page.rightBar === false , 'docs' : isDoc}">
            <ContentRenderer :value="page">
                <div class="bd-title">
                    <Breadcrumb :slug="slug" :pageList="pageList"/>
                    <h1 v-html="transformTitle(page.title)" class="py-0 title "></h1>
                </div>

                <NavToc :page="page"/>

                <div class="bd-content">
                    <ContentRendererMarkdown
                        class="bd-markdown"
                        :value="page"
                        data-bs-spy="scroll"
                        data-bs-target="#nav-toc"
                    />
                    <PrevNext v-if="prevNext" :base-path="`/${type}`"/>
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
    import {hash} from "ohash";
    import {recursivePages} from "~/utils/navigation.js";

    const fetchNavigation = async () => {
        const queryBuilder = queryContent('/' + props.type + '/').without("body");

        let navigationFetch;
        if (props.type === "plugins") {
            navigationFetch = await useFetch(`/api/plugins?type=navigation`);
        } else {
            navigationFetch = await useAsyncData(
                `NavSideBar-${hash(props.type)}`,
                () => fetchContentNavigation(queryBuilder)
            );
        }

        const navigation = navigationFetch.data;
        const pageList = recursivePages(navigation.value[0]);
        return {navigation, pageList};
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

    const isDoc = computed(() => props.type === 'docs');

    const route = useRoute()
    const slug = computed(() => `/${props.type}/${route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug}`);
    let page;

    const parts = slug.value.split('/');
    const pageName = parts[parts.length - 1].replace(/.md$/, "");
    if (props.type === 'plugins' && pageName) {
        const {data: pluginInformation} = await useAsyncData(`Container-${hash(slug.value)}`, () => {
            if (parts.length === 3) {
                return $fetch(`/api/plugins?page=${pageName}&type=plugin`)
            } else {
                return $fetch(`/api/plugins?page=${pageName}&type=definitions`)
            }
        });
        page = pluginInformation.value;
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

    const {navigation, pageList} = await fetchNavigation();

    useContentHead(page);

    const {description, title} = page;
    const {origin} = useRequestURL()
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

    .container {
        max-width: 1500px;

        .title {
            font-size: 2.375rem;
            font-weight: 600;
            line-height: 3.25rem;
        }
    }

    :deep(p) {
        font-weight: 400;
        line-height: 1.75rem;
    }

    :deep(p > a) {
        text-decoration: underline;
    }

    :deep(h2 > a) {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 2.375;
        margin: 0;
    }

    :deep(h3 > a ) {
        color: $white !important;
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 2.375;
    }

    .bd-main :deep(p > a), .bd-main :deep(ul a) {
        color: $purple-35;
    }

    .container, :deep(h2 > a) {
        color: $white !important;
    }

    :deep(.doc-alert) {
        border: 1px solid #3A3C55;
        background-color: #18131F;
        color: #B9BEF8;
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
        background-color: $purple-35;
    }

    :deep(.docs-prev-next a) {
        span {
            color: $purple-35;
        }

        .directory {
            color: $white;
        }
    }

    :deep(.btn) {
        span {
            color: $purple-35;
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
                color: $purple-35;
            }
        }
    }

    .docs :deep(img) {
        width: 100%;
    }
</style>