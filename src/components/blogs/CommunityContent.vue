<template>
    <div class="mt-5 mb-2 container" ref="blogs">
        <div v-if="slug === '/blogs/community'">
            <h2 data-usal="fade-l">Community News</h2>
            <div class="row row-gap-4 mt-5">
                <div v-for="news in externalNews" :key="news.id" class="col-lg-4 col-md-6 col-12">
                    <BlogCard :blog="news" data-usal="zoomin" />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import BlogCard from "~/components/blogs/BlogCard.vue"

    defineProps<{
        externalNews: any[]
        slug?: string
    }>()
</script>