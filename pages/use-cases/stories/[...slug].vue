<template>
    <div class="main">
        <div v-if="slug === '/stories/'">
            <Head>
                <Title>Kestra's Customers Stories</Title>
                <Meta name="description"
                    content="Learn how we helped companies manage their critical operations."/>
            </Head>
            <StoriesList :stories="stories" :icons="icons" :total-stories="totalStories" @fetch-page-data="fetchStories" />
        </div>
        
        <div v-else>

            <Head>
                <Title>{{ story.metaTitle }}</Title>
                <Meta name="description"
                    :content="story.metaDescription"/>
            </Head>
            
            <StoriesHeader :slug="slug" :title="story.title" :meta-description="story.description" :hero-image="story.heroImage" />
            <div class="container ">
                <ContentRendererMarkdown class="bd-markdown" :value="content_1"/>
                <div class="d-flex flex-wrap gap-2 my-5 justify-content-center" v-if="icons">
                    <div class="card" v-for="task in story.tasks" :key="task">
                        <div class="card-body">
                            <div class="icon" data-bs-toggle="tooltip" data-bs-placement="top" :title="task">
                                <CommonTaskIcon :cls="icons[task]"/>
                            </div>
                        </div>
                    </div>
                </div>

                <ContentRendererMarkdown class="bd-markdown" :value="content_2"/>
                <LayoutSection title="Similar Kestra Stories">
                    <div class="row">
                        <div class="col-12 col-md-6 col-lg-4" v-for="(story, index) in stories.slice(0, 3)" :key="index">
                            <StoriesCard :story="story" :icons="icons"/>
                        </div>
                    </div>
                </LayoutSection>
            </div>
        </div>
        <StoriesFooter/>
    </div>
</template>
<script setup>
import markdownParser from '@nuxt/content/transformers/markdown';
const { $bootstrap } = useNuxtApp()
const route = useRoute()
const slug = "/stories/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
const stories = ref([])
const totalStories = ref(0)
const story = ref({})
const content_1 = ref('')
const content_2 = ref('')
const icons = ref({})

onMounted(() => {
    if (process.client) {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new $bootstrap.Tooltip(tooltipTriggerEl))
    }
})

const fetchStories = async ({ currentPage, itemsPerPage }) => {
    const { data } = await useAsyncData('stories', () => {
        return $fetch(`https://api.kestra.io/v1/customer-stories?page=${currentPage}&size=${itemsPerPage}`)
    })
    stories.value = data.value.results
    totalStories.value = data.value.total
}

await fetchStories({ currentPage: 1, itemsPerPage: 25 })

const { data } = await useAsyncData('icons', () => {
    return $fetch('https://api.kestra.io/v1/plugins/icons')
})

icons.value = data.value

const storyName = slug.replace('/stories/', '').split('-').join(' ')

    if(slug != '/stories/') {
    story.value = stories.value.find(story => story.title.toLowerCase() === storyName)

    content_1.value = await markdownParser.parse("md",story.value.content_1,{})
    content_2.value = await markdownParser.parse("md",story.value.content_2,{})
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: story.value.metaTitle },
            {
                name: 'twitter:description',
                content: story.value.metaDescription
            },
            { name: 'twitter:image', content: story.value.heroImage },
            {
                name: 'twitter:image:alt',
                content: story.value.title
            }
        ]
    })
}
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

.icon {
    width: 42px;
    height: 42px;
}
</style>