<template>
    <div class="mt-5 mb-2 row">
        <div class="px-5 col-12 col-md-8">
            <DocsBreadcrumb :slug="slug" :page-list="[]"></DocsBreadcrumb>
            <h1 data-aos="fade-left">All things Kestra</h1>
            <h4 data-aos="fade-right" class="fw-normal">Company news, product updates, and engineering deep dives.</h4>
            <ul class="nav nav-tabs mt-3" id="myTab" role="tablist">
                <li v-for="cat in categories" :key="cat.name" class="nav-item" role="presentation" @click="setFilterBlogs(cat.name)">
                    <button class="nav-link" :class="{ 'active': filter === cat.name }" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">{{ cat.name }}</button>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div v-for="cat in categories" :key="cat.name" class="tab-pane fade" :class="{ 'show active': filter === cat.name }" :id="cat.name" role="tabpanel" :aria-labelledby="`${cat.name}-tab`">
                    <HighlightBlogCard :blog="getHighlightBlog(cat.name)" class="mt-5" />
                </div>
            </div>
            <div class="row mt-5">
                <div v-for="blog in blogsList" :key="blog._path" class="col-lg-6 col-md-6">
                    <BlogCard :blog="blog" data-aos="zoom-in" />
                </div>
            </div>
        </div>
        <div class="right-side-bar rounded-3 col-12 col-md-4 col-lg-3">
            <h5 class="heading mb-4">Last Community’s News</h5>
            <div v-for="news in externalNews" :key="news.id">
                <BlogsBlogCard :blog="news" data-aos="zoom-in" />
            </div>
            <NuxtLink href="/blogs/community">
                <button class="btn btn-light w-100">
                    More news
                </button>
            </NuxtLink>
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
            externalNews: {
                type: Array,
                required: true
            }
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
                slug: ""
            }
        },
        computed: {
            blogsList() {
                const blogs = this.blogs.filter(e => e.category === this.filter || this.filter === 'All news')
                return blogs.filter(e => e.category === this.filter || this.filter === 'All news').slice(0, blogs.length - 1).reverse();
            },
        },
        created() {
            this.slug = "/blogs/" + (this.$route.params.slug instanceof Array ? this.$route.params.slug.join('/') : this.$route.params.slug);
        },
        methods: {
            setFilterBlogs(id) {
                this.filter = id;
            },
            getHighlightBlog(filter) {
                const blogs = this.blogs.filter(e => e.category === filter || filter === 'All news')
                return blogs[blogs.length - 1];
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .right-side-bar {
        background-color: $purple-17;
        height: fit-content;
        padding: 2.25rem 2rem;

        .heading {
            line-height: 1.875rem;
        }
        .btn {
            border: 1px solid #E5E4F7;
            --bs-btn-bg: #ffff
        }
    }

    .nav-item {
        .nav-link {
            color: $black;
        }
        .active {
            color: $indigo;
            border: none;
            border-bottom: 2px solid $primary;
        }

    }
</style>