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

        <div class="container">
            <ContentRendererMarkdown class="bd-markdown" :value="content1" />
            <div class="d-flex flex-wrap gap-4 my-5 justify-content-center">
                <div class="card task-card" v-for="task in story.tasks" :key="task">
                    <div class="card-body">
                        <CommonTaskIcon :cls="task" />
                    </div>
                </div>
            </div>

            <ContentRendererMarkdown class="bd-markdown" :value="content2" />

            <div class="section-content">
                <LayoutSection subtitle-before="Similar" subtitle="Kestra" subtitle-after="Stories" v-if="related">
                    <div class="row">
                        <div class="col-12 col-md-6 col-lg-4" v-for="(story, index) in related.results"
                             :key="index">
                            <StoriesCard :story="story" />
                        </div>
                    </div>
                </LayoutSection>
                <div class="d-flex justify-content-center">
                    <NuxtLink href="/use-cases/stories">
                        <button class="btn btn-animated btn-purple-animated mb-2 aos-init aos-animate">See all stories</button>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <LayoutFooterContact
            title="Getting started with Kestra"
            subtitle="Start building with Kestra — Automate Everything Everywhere All at Once."
            darkButtonText="Read the docs"
            purpleButtonText="Get started!"
        />
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
        console.log(config.public.apiUrl);
        return $fetch(`${config.public.apiUrl}/customer-stories?size=3`)
    })

</script>
<style scoped lang="scss">
    @import "../../../assets/styles/variable";

    .container {
        padding-bottom: 5.625rem;
    }

    p, ul > li {
        line-height: 1.5rem;
    }

    :deep(h3 > a) {
        font-size: $h2-font-size;
        color: $white;
    }

    :deep(h3) {
        margin-top: $h1-font-size !important;
        padding: 0 !important;
        font-weight: 300;
    }

    :deep(p), :deep(li) {
        font-weight: 400;
        color: $white;
    }
    :deep(a) {
      color: $purple-35;
    }

    .section-content {
        border-top: 1px solid rgba(255, 255, 255, 0.10);
        padding: 2.875rem 0;
        :deep(.subtitle > p) {
            background: linear-gradient(90deg, #E151F7 65.38%, #5C47F5 82.43%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            span {
                color: $white;
                -webkit-background-clip: $white;
                -webkit-text-fill-color: $white;
            }
        }
    }

    .card {
        border: 1px solid $black-3;
        border-right: 8px;
        padding: calc($spacer * 0.938) calc($spacer * 2.813);
    }


    :deep(section div.main) {
        padding-top: 4rem;
    }


    .task-card {
        background-color: $black-2;
        :deep(.icon-wrapper) {
            width: 42px;
            height: 42px;
        }
    }
</style>