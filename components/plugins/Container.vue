<template>
    <div class="container bd-gutter bd-layout margin">
        <NavSideBar :plugins="plugins" />
        <div class="container" v-if="slug === '/plugins/'">
            <PluginsLists :plugins="plugins" :categories="categories" />
        </div>
        <article v-else class="bd-main order-1 plugins" v-if="content" :class="{'full': content.rightBar === false}">
            <ContentRenderer :value="content">
                <div class="bd-title">
                    <Breadcrumb :slug="props.slug" />
                    <h1 class="py-0 title ">{{content.title}}</h1>
                </div>

                <NavToc :page="content"/>

                <div class="bd-content">
                    <ContentRendererMarkdown
                        class="bd-markdown"
                        :value="content"
                    />
                </div>
            </ContentRenderer>
        </article>
    </div>
</template>

<script setup>
    import NavSideBar from "./NavSideBar.vue";
    import Breadcrumb from "./Breadcrumb.vue";
    import NavToc from "./NavToc.vue";
    import {hash} from "ohash";
    import { kestraInstance } from "~/utils/api.js";

    let content = ref();
    let categories = ref([]);
    let plugins = ref([]);

    const props = defineProps({
        slug: {
            type: String,
            required: true
        },
    });

    const { data: pluginsData } = await useAsyncData('plugins', () => {
        return kestraInstance.get(`/plugins`);
    });

    plugins.value = pluginsData.value.data;

    if(props.slug === '/plugins/') {
        const { data: categoriesData } = await useAsyncData('plugin-categories', () => {
            return kestraInstance.get(`/plugins/categories`);
        });

        categories.value = categoriesData.value.data;
    }

    const parts = props.slug.split('/');
    const pageName = parts[parts.length - 1];

    if (pageName) {
        const {data: pluginInformation} = await useAsyncData(`Container-${hash(props.slug)}`, () => {
            if (parts.length === 3) {
                return $fetch(`/api/plugins?page=${pageName}&type=plugin`)
            } else {
                return $fetch(`/api/plugins?page=${pageName}&type=definitions`)
            }
        });
        content.value = pluginInformation.value.descriptionAsMd;
    } else {
        const {data: page, error} = await useAsyncData(`Container-${hash(props.slug)}`, () => {
            try {
                return queryContent(props.slug).findOne();
            } catch (error) {
                throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
            }
        });
        content = page
    }

    useContentHead(content);

    const description = content.value?.description || '';
    const title = content.value?.title || '';
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: `${origin}/landing/home/header-bg.png` },
            { name: 'twitter:image:alt', content: title }
        ]
    })
</script>
<style lang="scss" scoped >
@import "../../assets/styles/variable";
.container{
    max-width: 1500px;
    .title{
        font-size: 2.375rem;
        font-weight: 600;
        line-height: 3.25rem;
    }
}
:deep(p){
    font-weight: 400;
    line-height: 1.75rem;
}
:deep(p > a){
    text-decoration: underline;
}
:deep(h2 > a){
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2.375;
    margin: 0px;
}
:deep(h3 > a ){
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2.375;
}


.docs :deep(img){
    width: 100%;
}
</style>



