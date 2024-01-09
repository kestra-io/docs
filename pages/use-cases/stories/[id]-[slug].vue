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
        />

        <div class="container ">
            <ContentRendererMarkdown class="bd-markdown" :value="content1" />
            <div class="d-flex flex-wrap gap-2 my-5 justify-content-center">
                <div class="card" v-for="task in story.tasks" :key="task">
                    <div class="card-body">
                        <CommonTaskIcon :cls="task" />
                    </div>
                </div>
            </div>

            <ContentRendererMarkdown class="bd-markdown" :value="content2" />

            <LayoutSection title="Similar Kestra Stories" v-if="related">
                <div class="row">
                    <div class="col-12 col-md-6 col-lg-4" v-for="(story, index) in related.results"
                         :key="index">
                        <StoriesCard :story="story" />
                    </div>
                </div>
            </LayoutSection>
        </div>
        <StoriesFooter />
    </div>
</template>
<script setup>
    import {parseMarkdown} from '@nuxtjs/mdc/runtime'

    const route = useRoute()
    const config = useRuntimeConfig();
    const slug = (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const story = ref({})
    const content1 = ref('')
    const content2 = ref('')

    const {data} = await useAsyncData('stories', () => {
        return $fetch(`${config.public.apiUrl}/customer-stories/${route.params.id}`)
    })

    if (data.value === null) {
        throw createError({statusCode: 404, message: `Unable to find id '${route.params.id}'`, fatal: true})
    }

    story.value = data.value;

    content1.value = await parseMarkdown(story.value.content_1, {});
    content2.value = await parseMarkdown(story.value.content_2, {});

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
        return $fetch(`${config.public.apiUrl}/customer-stories?size=3`)
    })

</script>
<style scoped lang="scss">
    @import "../../../assets/styles/variable";

    p, ul > li {
        line-height: 1.5rem;
    }

    :deep(h3 > a) {
        color: $black !important;
        font-size: $h2-font-size;
    }

    :deep(h3) {
        margin-top: $h1-font-size !important;
        padding: 0 !important;
        font-weight: 800;
    }

    :deep(.icon-wrapper) {
        width: 42px;
        height: 42px;
    }
</style>