<template>
    <div class="" role="button">
        <NuxtLink class="d-inline-block text-dark w-100" :href="blog._path">
            <NuxtImg width="840" loading="lazy" format="webp" quality="80" densities="x1 x2" class="w-100 col-md-12 rounded-3 img-fluid blog-image" :alt="blog.image" :src="blog.image" />
            <div class="description mt-4">
                <span class="small-text category">{{ blog.category }}</span>
                <h3>
                    {{ blog.title }}
                </h3>
                <p class="text">{{ blog.description }}</p>
                <BlogCardDetails :name="blog.author.name" :date="blog.date"/>
            </div>
        </NuxtLink>
    </div>
</template>

<script>
    import BlogCardDetails from "./BlogCardDetails.vue";

    export default {
        name: "HighlightBlogCard",
        components: {BlogCardDetails},
        props: {
            blog: {
                type: Object,
                required: true,
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/_variable.scss';

    .blog-image {
        border: $block-border;
    }

    .description {
        span {
            color: $purple-36;
            font-size: $font-size-sm;
            font-weight: 400;
        }
        h3 {
            color: $white;
            font-size: $h3-font-size;
            font-weight: 400;
            line-height: 2.375rem;
        }
        .text {
            color: $white-1;
            font-size: $h6-font-size;
            font-weight: 300;
            line-height: 1.625rem;
            margin-bottom: 0.75rem;
        }
    }


</style>