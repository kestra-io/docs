<template>
    <div class="container">
        <BlogsList v-if="slug === '/blogs/' || slug === '/blogs/community'" :blogs="page" :external-news="externalNews"/>

        <div v-else class="container bd-gutter bd-layout margin">
            <article class="bd-main order-1" v-if="page" :class="{'full': page.rightBar === false}">
                <ContentRenderer :value="page">
                    <div class="bd-title">
                        <p class="top-breadcrumb" data-aos="fade-right">
                            <NuxtLink href="/blogs">Blog</NuxtLink>
                        </p>
                        <h1 data-aos="fade-left">{{ page.title }}</h1>
                    </div>

                    <NavToc data-aos="fade-zoom" :page="page">
                        <template #header>
                            <BlogDetails :blog="page"/>
                        </template>
                    </NavToc>

                    <div class="bd-content">
                        <NuxtImg loading="lazy" format="webp" quality="80" densities="x1 x2" data-aos="fade-right" class="mb-5 rounded-3 " :alt="page.title" :src="page.image" fit="inside"/>

                        <ContentRendererMarkdown
                            data-aos="fade-zoom"
                            class="bd-markdown"
                            :value="page"
                            data-bs-spy="scroll"
                            data-bs-target="#nav-toc"
                        />
                    </div>
                </ContentRenderer>
            </article>
        </div>

        <div class="bottom">
            <LayoutBlogs v-if="slug !== '/blogs/' && slug !== '/blogs/community'" />
            <LayoutNewsletter />
        </div>
    </div>
</template>

<script setup >
    import NavToc from "~/components/docs/NavToc.vue";
    import BlogDetails from "~/components/blogs/BlogDetails.vue";
    const route = useRoute()
    const slug = "/blogs/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const externalNews = ref()
    const page = ref([]);
    if (slug === "/blogs/" || slug === '/blogs/community') {

        if(slug === "/blogs/") {
            const {data: pageData} = await useAsyncData(
                `Blog-Page-List`,
                () => queryContent("/blogs/").find()
            );
    
            page.value = pageData.value;
        }

        const {data: externalNewsData} = await useAsyncData(`blog-external-news`, () => {
            return $fetch(`https://api.kestra.io/v1/external-blogs${slug === '/blogs/' ? '?size=4' : ''}`)
        });

        externalNews.value = externalNewsData.value.results.map((data) => {
            return {
                id: data.id,
                _path: data.link,
                image: data.image,
                category: data.media,
                author: { name: data.author },
                title: data.title,
                date: data.publicationDate
            }
        })
        useHead({
            title: "Insights & News on Data Orchestration",
            description: "Explore the Kestra Blog for the latest articles, insights, product updates & engineering deep dives."
        })
    }
    else {
        const {data, error} = await useAsyncData(`Blog-Page-Item-${slug}`, () => {
            try {
                return queryContent(slug).findOne();
            } catch (error) {
                throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
            }
        });

        if (error && error.value) {
            throw error.value;
        }

        page.value = data.value;
        useContentHead(page)
        const {title,description,image} = page.value
        useHead({
            meta:[
                {name:'twitter:card',content:'summary-large-image'},
                {name : 'twitter:site',content:'@kaestra_io'},
                {name : 'twitter:title',content:title},
                {name:'twitter:description',content:description},
                {name : 'twitter:image' ,content:image},
                {name : 'twitter:image:alt',content : title}
            ]
        })
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    @import '../../assets/styles/docs.scss';

    :deep(.slug) {
        margin-left: 0;
    }

    .bd-layout {
        display: block;
    }

</style>