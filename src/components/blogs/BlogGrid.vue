<template>
    <div class="contain">
        <Tabs
            v-model="activeCategory"
            :categories="allBlogCategories"
            root-href="/blogs"
            class="m-0 mb-4"
        />

        <div class="grid mb-5">
            <BlogCard
                v-for="(blog, index) in visibleBlogs"
                :key="blog.path"
                :blog="blog"
                :eager="index === 0"
            />
        </div>

        <div v-if="overflowBlogs.length" class="text-center my-5">
            <button @click="showMore" class="btn btn-secondary">
                Show more
            </button>
        </div>

        <!-- The cards stop at visibleCount, so these keep every post one hop
             from /blogs for crawlers without shipping 200 card subtrees. -->
        <ul v-if="overflowBlogs.length" class="overflow-links" aria-hidden="true">
            <li v-for="blog in overflowBlogs" :key="blog.path">
                <a :href="blog.path" tabindex="-1">{{ blog.title }}</a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue'
    import Tabs from '~/components/common/Tabs.vue'
    import BlogCard from './BlogCard.vue'
    import { allBlogCategories, ALL_NEWS, categoryMap } from "~/components/blogs/categories"
    import type { BlogCardEntry } from "~/components/blogs/types"

    const props = defineProps<{
        blogs: BlogCardEntry[]
        slug: string
    }>()

    const activeCategory = ref(props.slug || ALL_NEWS)
    const visibleCount = ref(8)

    const normalizedBlogs = computed(() => {
        return props.blogs.map(blog => ({
            ...blog,
            normalizedCategory: categoryMap[blog.category] || blog.category
        }))
    })

    const filteredBlogs = computed(() => {
        if (activeCategory.value === ALL_NEWS) {
            return normalizedBlogs.value
        }
        return normalizedBlogs.value.filter(blog => blog.normalizedCategory === allBlogCategories.get(activeCategory.value))
    })

    // Cap what is rendered: hiding the overflow with CSS instead still ships
    // ~200 card subtrees in the HTML, for Vue to hydrate on first paint.
    const visibleBlogs = computed(() => filteredBlogs.value.slice(0, visibleCount.value))
    const overflowBlogs = computed(() => filteredBlogs.value.slice(visibleCount.value))

    watch(() => props.slug, (newSlug) => {
        activeCategory.value = newSlug || ALL_NEWS
    })

    watch(activeCategory, () => {
        // update the URL without reloading the page
        window.history.pushState(null, '', `/blogs/${activeCategory.value}`)
    })

    const showMore = () => {
        visibleCount.value += 8
    }
</script>

<style lang="scss" scoped>


    .contain {
        width: 100%;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;

        @include media-breakpoint-up(md) {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    // Crawlable, not rendered: `display: none` costs no layout, and the same
    // posts become real cards as soon as "Show more" is pressed.
    .overflow-links {
        display: none;
    }
</style>
