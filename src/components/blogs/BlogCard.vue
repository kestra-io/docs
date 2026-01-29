<template>
    <div class="mb-5 mt-1" role="button">
        <a :href="blog.path">
            <img
                v-if="typeof blog.image === 'string' && blog.image?.startsWith('https://')"
                width="300"
                loading="lazy"
                :alt="blog.title"
                :src="blog.image"
                class="card-image w-100 rounded-3"
            />
            <NuxtImg
                v-else
                width="300"
                loading="lazy"
                :alt="blog.title"
                :src="blog.image"
                class="card-image w-100 rounded-3"
            />
            <div class="mt-1">
                <span class="small-text category">{{ blog.category }}</span>
                <h6 class="my-1">{{ blog.title }}</h6>
                <BlogCardDetails
                    :authors="blog.authors || (blog.author ? [blog.author] : [])"
                    :date="blog.date.toString()"
                />
            </div>
        </a>
    </div>
</template>

<script lang="ts" setup>
    import BlogCardDetails from "~/components/blogs/BlogCardDetails.vue"
    defineProps<{
        blog: {
            path: string
            image?: string
            category?: string
            authors?: { name: string }[]
            author?: { name: string }
            title: string
            date: Date | string
        }
    }>()
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    h6 {
        color: $white;
        font-size: $font-size-md;
        font-weight: 400;
    }

    span {
        color: #cdd5ef;
        font-size: $font-size-sm;
        font-weight: 400;
    }
    .card-image {
        object-fit: cover;
        aspect-ratio: 16/9;
        border: 1.091px solid $black-3;
    }
</style>