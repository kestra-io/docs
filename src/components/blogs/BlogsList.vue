<template>
    <div class="mt-5 mb-2" ref="blogs">
        <div v-if="slug === '/blogs/community'">
            <h2 data-usal="fade-l">Community News</h2>
            <div class="row mt-5">
                <div v-for="news in externalNews" :key="news.id" class="col-lg-4 col-md-6 col-12">
                    <BlogCard :blog="news" data-usal="zoomin" />
                </div>
            </div>
        </div>
        <div class="row content justify-content-around" v-else>
            <div class="col-12 col-md-8">
                <h1 data-usal="fade-left title">All things Kestra</h1>
                <h4 data-usal="fade-r" class="fw-normal">
                    Company news, product updates, and engineering deep dives.
                </h4>
                <ul
                    class="ks-nav ks-nav-tabs mt-3 flex-nowrap overflow-x-auto overflow-y-hidden"
                    id="myTab"
                    role="tablist"
                >
                    <li
                        v-for="cat in categories"
                        :key="cat.name"
                        class="ks-nav-item text-nowrap"
                        role="presentation"
                        @click="setFilterBlogs(cat.name)"
                    >
                        <button
                            class="ks-nav-link"
                            :class="{ active: filter === cat.name }"
                            id="home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#home"
                            type="button"
                            role="tab"
                            aria-controls="home"
                            aria-selected="true"
                        >
                            {{ cat.name }}
                        </button>
                    </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div
                        v-for="cat in categories"
                        :key="cat.name"
                        class="tab-pane fade"
                        :class="{ 'show active': filter === cat.name }"
                        :id="cat.name"
                        role="tabpanel"
                        :aria-labelledby="`${cat.name}-tab`"
                    >
                        <HighlightBlogCard
                            v-if="getHighlightBlog(cat.name)"
                            :blog="getHighlightBlog(cat.name)"
                            class="mt-5"
                        />
                    </div>
                </div>
                <div class="row mt-5">
                    <div
                        v-for="(blog, index) in paginatedBlogs"
                        :key="blog.path"
                        :ref="`blog-${index}`"
                        class="col-lg-6 col-md-6"
                    >
                        <BlogCard :blog="blog" data-usal="zoomin" />
                    </div>
                </div>
                <CommonPaginationContainer
                    :current-url="fullPath"
                    :total-items="blogsList.length"
                    @update="
                        (payload) => {
                            pageNo = payload.page
                            itemsPerPage = payload.size
                        }
                    "
                />
            </div>
            <div class="right-side-bar bg-dark-2 rounded-3 col-12 col-md-4 col-lg-3 mb-4">
                <h5 class="heading mb-4">Latest Community News</h5>
                <div v-for="news in externalNews" :key="news.id">
                    <BlogCard :blog="news" data-usal="zoomin" />
                </div>
                <a href="/blogs/community">
                    <button class="btn btn-dark w-100">More news</button>
                </a>
            </div>
        </div>
    </div>
</template>
<script setup>
    import CommonPaginationContainer from "~/components/common/PaginationContainer.vue"
    import BlogCard from "~/components/blogs/BlogCard.vue"
    import HighlightBlogCard from "~/components/blogs/HighlightBlogCard.vue"
</script>
<script>
    export default {
        name: "BlogsList",
        props: {
            blogs: {
                type: Array,
                required: true,
            },
            externalNews: {
                type: Array,
                required: true,
            },
            slug: {
                type: String,
                required: false,
            },
            currentUrl: {
                type: String,
                required: false,
            },
        },
        data() {
            return {
                filter: "All news",
                categories: [
                    {
                        name: "All news",
                    },
                    {
                        name: "Company News",
                    },
                    {
                        name: "News & Product Updates",
                    },
                    {
                        name: "Solutions",
                    },
                ],
                fullSlug: "",
                pageList: [],
                itemsPerPage: 24,
                pageNo: 1,
                query: "",
            }
        },
        computed: {
            fullPath() {
                const url = new URL(this.currentUrl)
                url.search = this.query
                return url.toString()
            },
            blogsList() {
                const blogs = this.blogs.filter(
                    (e) => e.category === this.filter || this.filter === "All news",
                )
                return blogs
                    .filter((e) => e.category === this.filter || this.filter === "All news")
                    .slice(0, blogs.length - 1)
                    .reverse()
            },
            totalPages() {
                return Math.ceil(this.blogsList.length / this.itemsPerPage)
            },
            paginatedBlogs() {
                return this.blogsList.slice(
                    (this.pageNo - 1) * this.itemsPerPage,
                    this.pageNo * this.itemsPerPage,
                )
            },
        },
        watch: {
            itemsPerPage(value, prev) {
                if (value !== prev) {
                    if (value > prev) {
                        this.scrollToView({ el: prev })
                    } else this.scrollToView({ ref: "blogs" })
                }
            },
            pageNo(value, prev) {
                if (value !== prev) {
                    this.scrollToView({ ref: "blogs" })
                }
            },
        },
        created() {
            this.fullSlug = Array.isArray(this.slug)
                ? `/blogs/${this.slug.join("/")}`
                : this.slug || ""
            const breadcrumbs = [...new Set(this.fullSlug.split("/").filter((r) => r !== ""))]
            this.pageList = breadcrumbs.map(
                (___, index) => "/" + breadcrumbs.slice(0, index + 1).join("/"),
            )
        },
        methods: {
            setFilterBlogs(id) {
                this.filter = id
            },
            getHighlightBlog(filter) {
                const blogs = this.blogs.filter(
                    (e) => e.category === filter || filter === "All news",
                )
                return blogs[blogs.length - 1]
            },

            scrollToView({ el, ref }) {
                this.$nextTick(() => {
                    const element = this.$refs[ref || `blog-${el}`]
                    element.scrollIntoView({ behavior: "smooth" })
                })
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.query = window.location.search
            })
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    ::deep(main) {
        position: absolute;
    }

    .right-side-bar {
        border: $block-border;
        height: fit-content;
        padding: 2.25rem 2rem;
        position: sticky;
        top: 80px;

        .heading {
            color: $white;
            font-size: $font-size-lg;
            line-height: 1.875rem;
            font-weight: 100;
        }
    }

    .ks-nav-tabs {
        border-bottom: 1px solid $black-6;
        display: flex;
        padding: 0;
        list-style-type: none;
        justify-items: start;
    }

    .ks-nav-item {
        height: 41px;
        .ks-nav-link {
            border-color: transparent;
            color: $white;
            background-color: transparent;
            font-size: $font-size-md;
            font-weight: 400;
            padding: 0.5rem 1rem;

            &:hover,
            &:focus {
                border-color: transparent;
            }

            &:focus-visible {
                box-shadow: none;
            }
        }
        .active {
            color: $purple-36;
            font-size: $font-size-md;
            background-color: transparent;
            font-weight: 700;

            &,
            &:hover,
            &:focus {
                border-color: $purple-36;
                border-width: 0 0 1px 0;
                border-radius: 0;
            }
        }
    }

    .ks-nav::-webkit-scrollbar {
        display: none;
    }

    .ks-nav {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    h2 {
        color: $white;
    }

    .content {
        @include media-breakpoint-up(md) {
            margin-right: $rem-1;
        }

        h1 {
            font-size: $font-size-4xl;
            font-weight: 400;
            color: $white;
            margin-bottom: 2rem !important;
        }
        h4 {
            color: $white-1;
            font-size: $font-size-xl;
            font-weight: 400;
            margin-bottom: 2rem !important;
        }

        &::after {
            content: "";
            position: absolute;
            height: 12.5rem;
            width: 20%;
            top: 3%;
            left: 10%;
            z-index: -147;
            filter: blur(110px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
        }
    }

    .items-per-page .form-select {
        border-radius: 4px;
        border: $block-border;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
</style>