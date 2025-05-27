<template>
    <div class="container-fluid">
        <div class="container">
            <BlogsList v-if="slug === '/blogs/' || slug === '/blogs/community'" :blogs="page"
                       :external-news="externalNews"/>
            <div v-else class="container bd-gutter bd-layout margin">
                <article class="bd-main order-1" v-if="page" :class="{'full': page.rightBar === false}">
                    <div class="bd-content">
                        <div class="bd-title">
                            <p class="d-flex breadcrumb" data-aos="fade-right">
                                <NuxtLink to="/">Home </NuxtLink> / <NuxtLink to="/blogs"> Blog</NuxtLink>
                            </p>
                            <h2 data-aos="fade-left" class="pt-0">{{ page.title }}</h2>
                            <BlogDetails :blog="page" class="mt-3"/>
                            <div class="d-lg-none d-block" data-aos="fade-zoom">
                                <NavToc :page="page">
                                    <template #header>
                                    </template>
                                </NavToc>
                            </div>
                        </div>
                        <NuxtImg
                            loading="lazy"
                            data-aos="fade-right"
                            class="mb-2 rounded-3 img"
                            :alt="page.title"
                            :src="page.image"
                            fit="cover"
                        />
                        <div class="subtitle">
                            <p>
                                {{ page.description }}
                            </p>
                        </div>
                        <ClientOnly>
                            <ContentRenderer
                                class="bd-markdown mt-4"
                                :value="page"
                                data-bs-spy="scroll"
                                data-bs-target="#nav-toc"
                            />
                        </ClientOnly>
                    </div>
                    <NavToc class="d-lg-block d-none right-menu" :page="page">
                        <template #header>
                        </template>
                    </NavToc>
                </article>
            </div>
        </div>
    </div>
    <div class="bottom">
        <Updateletter/>
    </div>
</template>
<script setup>
    import NavToc from "~/components/docs/NavToc.vue";
    import BlogDetails from "~/components/blogs/BlogDetails.vue";
    import Updateletter from "~/components/layout/Updateletter.vue";
    const {public:{CollectionNames}} = useRuntimeConfig()

    const route = useRoute()
    const slug = "/blogs/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const externalNews = ref()
    const page = ref([]);
    const config = useRuntimeConfig();

    const handleHash = (hashValue) => {
        setTimeout(() => {
          const element = window.document.getElementById(hashValue);
          if (element) {
            const offset = element?.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: offset - 70 });
          }
        }, 3000)
    };

    const extractHash = () => {
      const hash = route.hash;
      if (hash) {
        const hashValue = hash.substring(1);
        handleHash(hashValue);
      }
    }

    if (slug === "/blogs/" || slug === '/blogs/community') {

        if (slug === "/blogs/") {
            const {data: pageData} = await useAsyncData(
                `Blog-Page-List`,
                () => queryCollection(CollectionNames.blogs).order("date", "ASC").all()
            );
            page.value = pageData.value;
        }

        const {data: externalNewsData} = await useAsyncData(`blog-external-news`, () => {
            return $fetch(`${config.public.apiUrl}/external-blogs${slug === '/blogs/' ? '?size=4' : ''}`)
        });

        externalNews.value = externalNewsData.value.results.map((data) => {
            return {
                id: data.id,
                path: data.link,
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
                return queryCollection(CollectionNames.blogs).path(slug).first();
            } catch (error) {
                throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
            }
        });

        if (error && error.value) {
            throw error.value;
        }

        page.value = data.value;
        const {title, description, image, date} = page.value
        const { origin } = useRequestURL()
        const { getAuthors } = useBlogAuthors(page.value);

        const setContentHead = async () => {
            await useContentHead(page);
            setTimeout(() => {
              extractHash()
            }, 1000)
          };

          setContentHead()

        const authors = getAuthors();
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
                        "author": authors.map(author => ({ "@type": "Person", "name": author.name })),
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

    :deep(main > div ) {
        overflow-x: unset;
    }

    .container-fluid {
        @include media-breakpoint-up(lg) {
            margin: 0;
            overflow-x: unset;
        }
    }

    .blog-content {
        padding-bottom: calc($spacer * 8.75);
    }
    :deep(.slug) {
        margin-left: 0;
    }

    :deep(main) {
        position: relative;
    }
    :deep(.bd-toc .btn) {
        position: relative;
    }

    :deep(.code-block) {
        margin-bottom: calc($spacer * 2) !important;
    }

    .bd-layout {
        display: block;
        height: 100%;
    }
    .bd-main{
        row-gap: 0px;
        display: flex;
        justify-content: space-between;
        @include media-breakpoint-down(lg) {
            padding-right: 0;
        }
    }

    .bd-content {
        max-width: 100%;
        margin: 0;

        @include media-breakpoint-up(xxl) {
            padding-right: calc($spacer * 2.75);
        }

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

        .subtitle {
            padding: 2rem 0 calc($spacer * 1.75);
            border-bottom: 1px solid $black-6;
            p {
                font-size: calc($font-size-base * 1.438);
                font-weight: 400;
                line-height: calc($spacer * 1.75);
                color: #CDD5EF;
                margin: 0;
            }
        }
    }

    .bd-gutter {
        padding: 0 !important;
    }

    :deep(.bd-markdown > h3) {
        margin-top: 0 !important;
        padding-top: 2rem;
        margin-bottom: calc($spacer * 0.75);
    }

    :deep(.bd-markdown > hr) {
        display: none;
    }

    :deep(.bd-markdown) {
        h2 {
            margin-top: calc($spacer * 4.12);
            border-top: 1px solid $black-6;
            padding-top: calc($spacer * 3.125);
            margin-bottom: 2rem;

            a {
                border-left: 5px solid $purple-36;
                padding-left: calc($spacer * 0.6);
                font-size: calc($font-size-base * 2.25);
                display: block;
            }
        }

        h2:first-of-type {
            border-top: none;
            padding-top: 0;
            margin-top: calc($spacer * 3.12);
        }
    }

    :deep(.bd-markdown > ul) {
        ul {
            list-style: disc;
            li::marker {
                color: #736BCD ;
            }
        }

        li::marker {
            color: #5A3ABC;
        }
    }

    :deep(p) {
        font-weight: 400;
        line-height: 2rem;
        font-size: $h6-font-size;
        margin-bottom: 2rem;
    }

    :deep(.bd-content) {
        img {
            width: 100%;
        }
    }

    .right-menu {
        min-width: 19.3rem;
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
        font-size: $h2-font-size !important;
    }
    .para{
        line-height: 1.375rem;
        font-size: $font-size-sm;
        margin-bottom: $font-size-xs;
        font-weight: 600;
    }
</style>