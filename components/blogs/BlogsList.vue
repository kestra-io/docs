<template>
    <div class="mt-5">
        <h1>All things Kestra</h1>
        <h5>Company news, product updates, and engineering deep dives.</h5>
        <div class="grid gap-3">
            <button
                :class="filter === cat.name ? 'active': ''"
                @click="setFilterBlogs(cat.name)"
                class="rounded-button m-1"
                v-for="cat in categories">
                {{ cat.name }}
            </button>
        </div>
        <HighlightBlogCard v-if="highlightBlog" :blog="highlightBlog" class="mt-5"/>
        <div class="row mt-5">
            <div v-for="blog in blogsList" class="col-lg-4 col-md-6">
                <BlogCard :blog="blog"/>
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
    h1 {
        font-weight: 900;
    }

    h5 {
        font-weight: 300;
    }
</style>