<template>
    <div class="d-md-flex flex-row justify-content-between" role="button">
        <NuxtLink class="text-dark" :href="blog._path">
            <NuxtImg width="512" loading="lazy" format="webp" quality="80" densities="x1 x2" class="col-md-12 rounded-3 img-fluid" :alt="blog.image" :src="blog.image" />
            <div class="description mt-4">
                <span class="small-text category">{{ blog.category }}</span>
                <h3>
                    {{ blog.title }}
                </h3>
                <p>{{ blog.description }}</p>
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

    .description {
        span {
            color: var(--bs-primary);
            font-size: $font-size-sm;
        }
        h3{
            font-weight: 300;
            line-height: 2.375rem;
        }
        p{
            line-height: 1.625rem;
            margin-bottom: 0.75rem;
        }
    }


</style>