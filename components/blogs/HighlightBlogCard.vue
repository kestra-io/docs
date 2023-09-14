<template>
    <div class="d-md-flex flex-row justify-content-between" role="button">
        <NuxtLink class="text-dark" :href="blog._path">
            <div class="row g-0">
                <div class="col-md-6">
                    <NuxtImg width="512" loading="lazy" format="webp" quality="80" class="col-md-12 rounded-3 img-fluid" :alt="blog.image" :src="blog.image" />
                </div>
                <div class="col-md-6 description">
                    <span class="small-text category">{{ blog.category }}</span>
                    <h3>
                        {{ blog.title }}
                    </h3>
                    <p>{{ blog.description }}</p>
                    <BlogCardDetails :name="blog.author.name" :date="blog.date"/>
                </div>
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

    .row {

        span {
            color: var(--bs-primary);
            font-size: $font-size-sm;
        }

        .description {
            @include media-breakpoint-up(md) {
                padding: 0 0 0 4rem;
            }

            @include media-breakpoint-up(lg) {
                padding: 0 6rem 0 4rem;
            }
        }
    }


</style>