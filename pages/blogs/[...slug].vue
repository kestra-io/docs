<template>
    <div class="container">
        <BlogsList v-if="slug === '/blogs/' || slug === '/blogs/community'" :blogs="page"
                   :external-news="externalNews"/>

        <div v-else class="container bd-gutter bd-layout margin">
            <article class="bd-main order-1" v-if="page" :class="{'full': page.rightBar === false}">
                <ContentRenderer :value="page">
                    <div class="bd-title">
                        <p class="d-flex breadcrumb" data-aos="fade-right">
                            <NuxtLink to="/">Home </NuxtLink> / <NuxtLink to="/blogs"> Blog</NuxtLink>
                        </p>
                        <h2 data-aos="fade-left" class="pt-0">{{ page.title }}</h2>
                    </div>
                    <NavToc data-aos="fade-zoom" :page="page">
                        <template #header>
                            <BlogDetails :blog="page"/>
                        </template>
                    </NavToc>
                    <div class="bd-content">
                        <NuxtImg
                            loading="lazy"
                            format="webp"
                            quality="80"
                            densities="x1 x2"
                            data-aos="fade-right"
                            class="mb-2 rounded-3 img"
                            :alt="page.title"
                            :src="page.image"
                            fit="cover"
                        />
                        <ClientOnly>
                            <ContentRendererMarkdown
                                data-aos="fade-zoom"
                                class="bd-markdown mt-4"
                                :value="page"
                                data-bs-spy="scroll"
                                data-bs-target="#nav-toc"
                            />
                        </ClientOnly>
                    </div>
                </ContentRenderer>
            </article>
            <div class="bottom">
                <DocsBlogs title="More contents"/>
                <Updateletter/>
            </div>
        </div>

    </div>
</template>

<script setup>
    import NavToc from "~/components/docs/NavToc.vue";
    import BlogDetails from "~/components/blogs/BlogDetails.vue";
    import Updateletter from "~/components/layout/Updateletter.vue";

    const route = useRoute()
    const slug = "/blogs/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const externalNews = ref()
    const page = ref([]);
    const config = useRuntimeConfig();

    const sort = (data)=>{
        data.sort((a,b)=>
            new Date(a.date)-new Date(b.date)
        )
    }
    if (slug === "/blogs/" || slug === '/blogs/community') {

        if (slug === "/blogs/") {
            const {data: pageData} = await useAsyncData(
                `Blog-Page-List`,
                () => queryContent("/blogs/").find()
            );
            sort(pageData.value)
            page.value = pageData.value;
        }

        const {data: externalNewsData} = await useAsyncData(`blog-external-news`, () => {
            return $fetch(`${config.public.apiUrl}/external-blogs${slug === '/blogs/' ? '?size=4' : ''}`)
        });

        externalNews.value = externalNewsData.value.results.map((data) => {
            return {
                id: data.id,
                _path: data.link,
                image: data.image,
                category: data.media,
                author: {name: data.author},
                title: data.title,
                date: data.publicationDate
            }
        })

        useHead({
            title: "Insights & News on Data Orchestration",
            description: "Explore the Kestra Blog for the latest articles, insights, product updates & engineering deep dives."
        })
    } else {
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
        const {title,author,description,image,date} = page.value
        const { origin } = useRequestURL()
        useHead({
            meta: [
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:site', content: '@kestra_io' },
                { name: 'twitter:title', content: title },
                { name: 'twitter:description', content: description },
                { name: 'twitter:image', content: `${origin + image}` },
                { name: 'twitter:image:alt', content: title }
            ],
            script : [{
                    innerHTML : JSON.stringify({
                        "@context" : "http://schema.org",
                        "@type" : "BlogPosting",
                        "mainEntityofPage" : {
                            "@type" : "Webpage",
                            "@id" : slug,
                        },
                        "headline": title,
                        "image": [image ],
                        "datePublished": date,
                        "author": { "@type": "Person", "name": `${author.name}` },
                        "publisher": { "@type": "Organization", "name": "Kestra", "logo": { "@type": "ImageObject", "url": "https://kestra.io/logo.svg" } },
                        "description": description,

                    }),
                    type  : "application/ld+json"
                }]
            })
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    @import '../../assets/styles/docs.scss';

    :deep(.slug) {
        margin-left: 0;
    }

    :deep(main) {
        position: relative;
    }

    .bd-layout {
        display: block;
    }
    .bd-main{
        row-gap: 0px;
        column-gap: 4rem;
    }

    .bd-content{
        max-width: 100%;
        img {
            border: $block-border;
        }

        &::after {
            content: "";
            position: absolute;
            height: calc($spacer * 12.5);
            width: 20%;
            top: 2%;
            left: 20%;
            z-index: -147;
            filter: blur(100px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
        }
    }
    .breadcrumb {
        margin: 0;
        gap: 0.25rem;
        color: #CDD5EF;

        a {
            color: #CDD5EF !important;
            font-size: $font-size-sm;
            font-weight: 400;
        }
    }
    h2{
        color: $white !important;
        line-height: 3.25rem !important;
        font-weight: 600 !important;
        font-size: 2.375rem !important;
    }
    .para{
        line-height: 1.375rem;
        font-size: $font-size-sm;
        margin-bottom: $font-size-xs;
        font-weight: 600;
    }
    :deep(.bd-markdown){
        p, li {
            color: $white;
            line-height: 1.75rem;
            font-size: $font-size-md;
            font-weight: 400;

            a {
                color: $purple-36;
            }
        }
        h2, h2 a {
            color: $white;
            font-size: 1.75rem;
            line-height: 2.735rem;
            font-weight: 300;
        }

        h3 a {
            color: $white;
        }

        code {
            border: $block-border;
            background-color: $black-2;
            color: $purple-36;
        }

        .code-block, .doc-alert {
            background-color: $black-2;
            code {
                border: 0;
            }
        }

        .doc-alert {
            border: $block-border;
        }
    }
</style>