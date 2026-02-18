<template>
    <div class="contain">
        <BlogTabs
            v-model="activeCategory"
            :categories="allCategories"
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
    import { ref, computed } from 'vue'
    import BlogTabs from './BlogTabs.vue'
    import BlogCard from './BlogCard.vue'

    const props = defineProps<{
        blogs: any[]
    }>()

    const ALL_NEWS = "All news"
    
    // Normalize categories to match the tabs
    const categoryMap: Record<string, string> = {
        "Company News": "Company news",
        "News & Products Updates": "News & Products Updates",
        "News & Product Updates": "News & Products Updates",
        "Solutions": "Solutions",
        "Solution": "Solutions"
    }

    const allCategories = [ALL_NEWS, "Company news", "News & Products Updates", "Solutions"]
    const activeCategory = ref(ALL_NEWS)
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
        return normalizedBlogs.value.filter(blog => blog.normalizedCategory === activeCategory.value)
    })

    const showMore = () => {
        visibleCount.value += 8
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

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
