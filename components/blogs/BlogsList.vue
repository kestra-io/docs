<template>
    <div class="mt-5 mb-2" ref='blogs'>
        <div v-if="slug === '/blogs/community'">
            <h2 data-aos="fade-left">Community News</h2>
            <div class="row mt-5">
                <div
                    v-for="news in externalNews"
                    :key="news.id"
                    class="col-lg-4 col-md-6 col-12"
                >
                    <BlogsBlogCard :blog="news" data-aos="zoom-in" />
                </div>
            </div>
        </div>
        <div class="row content justify-content-around" v-else>
            <div class="col-12 col-md-8">
                <h1 data-aos="fade-left title">All things Kestra</h1>
                <h4 data-aos="fade-right" class="fw-normal">
                    Company news, product updates, and engineering deep dives.
                </h4>
                <ul
                    class="nav nav-tabs mt-3 flex-nowrap overflow-x-auto overflow-y-hidden"
                    id="myTab"
                    role="tablist"
                >
                    <li
                        v-for="cat in categories"
                        :key="cat.name"
                        class="nav-item text-nowrap"
                        role="presentation"
                        @click="setFilterBlogs(cat.name)"
                    >
                        <button
                            class="nav-link"
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
                        <BlogsHighlightBlogCard
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
                        <BlogsBlogCard :blog="blog" data-aos="zoom-in" />
                    </div>
                </div>
            </div>
            <div class="right-side-bar bg-dark-2 rounded-3 col-12 col-md-4 col-lg-3">
                <h5 class="heading mb-4">Latest Community News</h5>
                <div v-for="news in externalNews" :key="news.id">
                    <BlogsBlogCard :blog="news" data-aos="zoom-in" />
                </div>
                <NuxtLink href="/blogs/community">
                    <button class="btn btn-dark w-100">More news</button>
                </NuxtLink>
            </div>
            <div class="d-flex justify-content-between my-5">
                <div class="items-per-page">
                    <select
                        class="form-select bg-dark-2"
                        aria-label="Default select example"
                        v-model="itemsPerPage"
                        @change="fetchPageData"
                    >
                        <option :value="10">10</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                    </select>
                </div>
                <CommonPagination
                    :totalPages="totalPages"
                    @on-page-change="changePage"
                    v-if="totalPages > 1"
                />
            </div>
        </div>
    </div>
</template>

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
                    name: "News & Products Updates",
                },
                {
                    name: "Solutions",
                },
            ],
            slug: "",
            pageList: [],
            itemsPerPage: 25,
            pageNo: 1,
        };
    },
    computed: {
        blogsList() {
            const blogs = this.blogs.filter(
                (e) => e.category === this.filter || this.filter === "All news",
            );
            return blogs
                .filter(
                    (e) =>
                        e.category === this.filter ||
                        this.filter === "All news",
                )
                .slice(0, blogs.length - 1)
                .reverse();
        },
        totalPages() {
            return Math.ceil(this.blogs.length / this.itemsPerPage);
        },
        paginatedBlogs() {
            return this.blogsList.slice(
                (this.pageNo - 1) * this.itemsPerPage,
                this.pageNo * this.itemsPerPage,
            );
        },
    },
    watch: {
        itemsPerPage(value, prev) {
            if (value !== prev) {
                if (value > prev) {
                    this.scrollToView({ el: prev });
                } else this.scrollToView({ ref: "blogs" });
            }
        },
        pageNo(value, prev) {
            if (value !== prev) {
                this.scrollToView({ ref: "blogs" });
            }
        },
    },
    created() {
        this.slug =
            "/blogs/" +
            (this.$route.params.slug instanceof Array
                ? this.$route.params.slug.join("/")
                : this.$route.params.slug);
        const breadcrumbs = [
            ...new Set(this.slug.split("/").filter((r) => r !== "")),
        ];
        this.pageList = breadcrumbs.map(
            (___, index) => "/" + breadcrumbs.slice(0, index + 1).join("/"),
        );
    },
    methods: {
        setFilterBlogs(id) {
            this.filter = id;
        },
        getHighlightBlog(filter) {
            const blogs = this.blogs.filter(
                (e) => e.category === filter || filter === "All news",
            );
            return blogs[blogs.length - 1];
        },

        changePage(value) {
            this.pageNo = value;
        },

        scrollToView({ el, ref }) {
            this.$nextTick(() => {
                const element = this.$refs[ref || `blog-${el}`];
                element.scrollIntoView({ behavior: "smooth" });
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";


::deep(main) {
    position: absolute;
}

.right-side-bar {
    border: $block-border;
    height: fit-content;
    padding: 2.25rem 2rem;

    .heading {
        color: $white;
        font-size: $font-size-lg;
        line-height: 1.875rem;
        font-weight: 100;
    }
}

.nav-tabs {
    border-bottom: 1px solid $black-6;
}

.nav-item {
    .nav-link {
        color: $white;
        font-size: $font-size-md;
        font-weight: 400;

        &:hover, &:focus {
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

        &, &:hover, &:focus {
            border-color: $purple-36;
            border-width: 0 0 1px 0;
            border-radius: 0;
        }
    }
}

.nav::-webkit-scrollbar {
    display: none;
}

.nav {
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
        margin-bottom: 2rem;
    }
    h4 {
        color: $white-1;
        font-size: $font-size-xl;
        font-weight: 400;
        margin-bottom: 2rem;
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
        background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
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
