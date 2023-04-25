<template>
    <div class="mt-5">
        <p class="subtitle" data-aos="fade-right">
            Community
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
        <Newsletter/>
    </div>
</template>

<script>
    import HighlightBlogCard from "./HighlightBlogCard.vue";
    import BlogCard from "./BlogCard.vue";
    import Newsletter from "~/components/layout/Newsletter.vue";

    export default {
        name: "BlogsList",
        components: {BlogCard, HighlightBlogCard, Newsletter},
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

    .subtitle {
        font-size: $font-size-sm;
        color: var(--bs-primary);
        font-family: var(--bs-font-monospace);
        font-weight: 800;
        text-transform: uppercase;

        &:after {
            content: '';
            position: absolute;
            margin-top: calc($font-size-sm / 1.5);
            margin-left: $spacer;
            display: inline-block;
            height: 2px;
            width: 51px;
            background: var(--bs-pink);
        }
    }
</style>