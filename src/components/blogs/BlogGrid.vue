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
                v-for="(blog, index) in filteredBlogs"
                :key="blog.path"
                :blog="blog"
                :class="{ hidden: index >= visibleCount }"
            />
        </div>

        <div v-if="filteredBlogs.length > visibleCount" class="text-center my-5">
            <button @click="showMore" class="btn btn-secondary">
                Show more
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue'
    import Tabs from '~/components/common/Tabs.vue'
    import BlogCard from './BlogCard.vue'
    import { allBlogCategories, ALL_NEWS, categoryMap } from "~/components/blogs/categories"

    const props = defineProps<{
        blogs: {
            path: string
            title: string
            category: string
            description: string
            publicationDate: string
        }[]
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

        .hidden {
            display: none;
        }
    }
</style>
