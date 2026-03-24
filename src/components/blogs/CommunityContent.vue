<template>
    <Squared>
        <h2 data-usal="fade-l">Community News</h2>
    </Squared>
    <section class="contents">
        <div class="container" ref="blogs">
            <div v-if="slug === '/blogs/community'">
                <div class="row row-gap-4 mt-5">
                    <div v-for="news in externalNews" :key="news.id" class="col-lg-4 col-md-6 col-12">
                        <BlogCard :blog="news" data-usal="zoomin" />
                    </div>
                </div>
            </div>
        </div>
    </section>
    <SubscribeToNewsletter />
</template>
<script lang="ts" setup>
    import BlogCard from "~/components/blogs/BlogCard.vue"
    import Squared from "~/components/layout/Squared.vue"
    import SubscribeToNewsletter from "~/components/layout/SubscribeToNewsletter.vue"

    defineProps<{
        externalNews: any[]
        slug?: string
    }>()
</script>

<style lang="scss">
    section.contents {
        background: var(--ks-background-body);
        padding: 4rem 1rem;
        padding-top: 0;
        margin-top: -3rem;
    }
</style>