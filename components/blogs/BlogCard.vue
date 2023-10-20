<template>
    <div class="mb-5 mt-1" role="button">
        <NuxtLink class="text-dark" :href="blog._path">
            <NuxtImg loading="lazy" format="webp" quality="80" densities="x1 x2" :alt="blog.image" :src="blog.image" class="card-image w-100 rounded-3" fit="cover"/>
            <div class="mt-3">
                <span class="small-text category">{{ blog.category }}</span>
                <h6 class="mt-2">{{ blog.title }}</h6>
                <BlogCardDetails :name="blog.author.name" :date="blog.date"/>
            </div>
        </NuxtLink>
    </div>
</template>

<script>
    import BlogCardDetails from "~/components/blogs/BlogCardDetails.vue";

    export default {
        name: "BlogCard",
        components: {BlogCardDetails},
        props: {
            blog: {
                type: Object,
                required: true,
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    h6 {
        font-weight: 700;
        color: var(--bs-black)
    }

    span {
        color: var(--bs-primary);
        font-size: $font-size-sm;
    }

    .card-image {
        object-fit: cover;
        aspect-ratio: 16/9;
    }
</style>