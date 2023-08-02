<template>
    <div class="mt-5">
        <p class="subtitle" data-aos="fade-right">
            Blogs
        </p>
        <h1 data-aos="fade-left">All things Kestra</h1>
        <h5 data-aos="fade-right">Company news, product updates, and engineering deep dives.</h5>
        <div class="grid gap-3 mt-5" data-aos="fade-left">
            <button
                :class="filter === cat.name ? 'active': ''"
                @click="setFilterBlogs(cat.name)"
                class="rounded-button m-1"
                v-for="cat in categories">
                {{ cat.name }}
            </button>
        </div>
        <HighlightBlogCard v-if="highlightBlog" :blog="highlightBlog" class="mt-5" data-aos="fade-left" />
        <div class="row mt-5">
            <div v-for="blog in blogsList" class="col-lg-4 col-md-6">
                <BlogCard :blog="blog" data-aos="zoom-in" />
            </div>
        </div>
    </div>
</template>

<script>
    import HighlightBlogCard from "./HighlightBlogCard.vue";
    import BlogCard from "./BlogCard.vue";

    export default {
        name: "BlogsList",
        components: {BlogCard, HighlightBlogCard},
        props: {
            blogs: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                filter: 'All news',
                categories: [
                    {
                        name: 'All news'
                    },
                    {
                        name: 'Company News'
                    },
                    {
                        name: 'News & Products Updates'
                    },
                    {
                        name: 'Solutions'
                    },
                ],
            }
        },
        computed: {
            highlightBlog() {
                const blogs = this.blogs.filter(e => e.category === this.filter || this.filter === 'All news')
                return blogs[blogs.length - 1];
            },
            blogsList() {
                const blogs = this.blogs.filter(e => e.category === this.filter || this.filter === 'All news')
                return blogs.filter(e => e.category === this.filter || this.filter === 'All news').slice(0, blogs.length - 1).reverse();
            },
        },
        methods: {
            setFilterBlogs(id) {
                this.filter = id;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    h5 {
        font-weight: 300;
    }

    .rounded-button {
        border-radius: 2rem;
        padding: calc($spacer / 2) calc($spacer / 1);
        margin-right: calc($spacer / 2);
        background-color: var(--bs-white);
        color: $purple;
        border: 0.05rem solid $purple;
        font-weight: lighter;

        &.active {
            background-color: var(--bs-primary);
            color: var(--bs-white);
            font-weight: bold;
        }
    }
</style>