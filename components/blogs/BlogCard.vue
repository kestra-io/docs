<template>
    <div class="mb-5 mt-1" role="button">
        <NuxtLink class="text-dark" :href="blog.path">
            <NuxtImg
                width="300"
                loading="lazy"
                format="webp"
                quality="80"
                densities="x1 x2"
                :alt="blog.title"
                :src="blog.image"
                class="card-image w-100 rounded-3"
            />
            <div class="mt-1">
                <span class="small-text category">{{ blog.category }}</span>
                <h6 class="my-1">{{ blog.title }}</h6>
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
    @import "../../assets/styles/variable";

    h6 {
        color: $white;
        font-size: $font-size-md;
        font-weight: 400;
    }

    span {
        color: #CDD5EF;
        font-size: $font-size-sm;
        font-weight: 400;
    }
    .card-image {
        object-fit: cover;
        aspect-ratio: 16/9;
        border: 1.091px solid $black-3;
    }
</style>