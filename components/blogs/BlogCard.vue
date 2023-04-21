<template>
    <div class="mb-5 mt-1" role="button">
        <NuxtLink class="text-dark" :href="blog._path">
            <img :alt="blog.image" :src="blog.image" class="small-img blog-img">
            <div class="mt-3">
                <span class="small-text category">{{ blog.category }}</span>
                <h6>{{ blog.title }}</h6>
                <BlogCardDetails :name="blog.author.name" :date="blog.date"/>
            </div>
        </NuxtLink>
    </div>
</template>

<script>
    import BlogCardDetails from "./BlogCardDetails.vue";

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
    h6 {
        font-weight: 700;
        color: var(--bs-black)
    }
</style>