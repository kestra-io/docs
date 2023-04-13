<template>
    <div class="d-md-flex flex-row justify-content-between container" role="button">
        <a class="text-dark" :href="blog._path">
            <div class="row">
                <div class="col">
                    <img class="col-md-12 blog-img" :alt="blog.image" :src="blog.image">
                </div>
                <div class="col description">
                    <span class="small-text category">News & Product Updates</span>
                    <h3>
                        {{ blog.title }}
                    </h3>
                    <p>{{ blog.description }}</p>
                    <BlogCardDetails :name="blog.author.name" :date="blog.date"/>
                </div>
            </div>
        </a>
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

<style scoped>

    .col {
        padding: 0;
    }

    .description {
        margin: 0 8rem 0 4rem;
    }


</style>