<template>
    <div class="main">
        <Head>
            <Title>{{ story.metaTitle }}</Title>
            <Meta
                name="description"
                :content="story.metaDescription"
            />
        </Head>

        <StoriesHeader
            :slug="slug"
            :title="story.title"
            :meta-description="story.description"
            :hero-image="story.heroImage"
            :logo="story.logoDark"
            :kpi1="story.kpi1"
            :kpi2="story.kpi2"
            :kpi3="story.kpi3"
        />

        <NuxtLazyHydrate when-visible>
            <div class="container pt-5">
                <div class="row position-relative stories-row">
                    <StoriesSidebar :story="story" />
                    <StoriesRenderer :story="story" :content="content" />
                </div>
            </div>

            <StoriesMore :related="related" />
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>
    import {parseMarkdown} from '@nuxtjs/mdc/runtime'
    import {slugify} from "@kestra-io/ui-libs";

    const {$bootstrap} = useNuxtApp()
    const route = useRoute()
    const config = useRuntimeConfig();
    const slug = (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const story = ref({})
    const content = ref('')

    const {data} = await useAsyncData(`useCases/stories/${route.params.id}`, () => {
        return $fetch(`${config.public.apiUrl}/customer-stories-v2/${route.params.id}`)
    })

    if (data.value === null) {
        throw createError({statusCode: 404, message: `Unable to find id '${route.params.id}'`, fatal: true})
    }

    story.value = data.value;

    content.value = await parseMarkdown(story.value.content, {});

    useHead({
        meta: [
            {name: 'twitter:card', content: 'summary_large_image'},
            {name: 'twitter:site', content: '@kestra_io'},
            {name: 'twitter:title', content: story.value.metaTitle},
            {
                name: 'twitter:description',
                content: story.value.metaDescription
            },
            {name: 'twitter:image', content: story.value.heroImage},
            {
                name: 'twitter:image:alt',
                content: story.value.title
            }
        ]
    })

    const {data: related} = await useAsyncData('related-stories', () => {
        return $fetch(`${config.public.apiUrl}/customer-stories-v2?size=3`)
    })
</script>

<style scoped lang="scss">
    @import "../../../assets/styles/variable";

    .main {
        font-family: "Mona Sans", sans-serif !important;
        background-color: $white;
        color: $black-2;
    }

    .stories-row {
        align-items: stretch;
    }
</style>