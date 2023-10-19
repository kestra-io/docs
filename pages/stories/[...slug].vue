<template>
    <div class="main">

        <StoriesList v-if="slug === '/stories/'" :stories="stories" :icons="icons" :total-stories="totalStories" @fetch-page-data="fetchStories" />

        <div v-else>
            <StoriesHeader :slug="slug" :title="story.title" :meta-description="story.metaDescription" :hero-image="story.heroImage" />
            <div class="container my-5">
                <div v-html="content_1" />
                <div v-html="content_2" />
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
import MarkdownIt from 'markdown-it'

const route = useRoute()
const slug = "/stories/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
const stories = ref([])
const totalStories = ref(0)
const story = ref({})
const content_1 = ref('')
const content_2 = ref('')
const icons = ref({})

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
    console.log(story.value);
    const md = new MarkdownIt()
    content_1.value = md.render(story.value.content_1)
    content_2.value = md.render(story.value.content_2)
}
</script>
<style scoped lang="scss">
p, ul > li {
    line-height: 1.5rem;
}
</style>