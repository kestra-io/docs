<template>
    <div class="container-fluid bd-gutter bd-layout type-docs">
        <NavSideBar type="docs" :navigation="navigation"/>
        <article class="bd-main order-1 docs" :class="{'full': page?.rightBar === false , 'homepage': page?.isHomepage}">
            <ContentRenderer :value="page">
                <div class="bd-title">
                    <Breadcrumb :slug="slug" :pageList="pageList" :pageNames="pageNames" :pageTitle="page.title"/>
                    <h1 v-if="page && page.title" class="py-0 title">
                        <NuxtImg
                            v-if="page.icon"
                            :src="page.icon"
                            :alt="page.title"
                            width="40px"
                            height="40px"
                            loading="lazy"
                            format="webp"
                            quality="80"
                            densities="x1 x2"
                            class="me-3 page-icon"
                        />
                        <span v-html="transformTitle(page.title)"></span>
                    </h1>
                </div>

                <NavToc :page="page" class="my-md-0 my-4 right-menu" />

                <div class="bd-content">
                    <DocsFeatureScopeMarker v-if="page.editions || page.version || page.deprecated || page.release" :page="page"/>
                    <ContentRendererMarkdown
                        class="bd-markdown"
                        :value="page"
                        data-bs-spy="scroll"
                        data-bs-target="#nav-toc"
                    />
                    <template v-if="!page?.isHomepage">
                        <HelpfulVote />
                        <PrevNext :navigation="navigation" />
                    </template>
                </div>
            </ContentRenderer>
        </article>
    </div>
</template>

<script setup>
  import PrevNext from "~/components/layout/PrevNext.vue";
  import NavSideBar from "~/components/docs/NavSideBar.vue";
  import Breadcrumb from "~/components/layout/Breadcrumb.vue";
  import NavToc from "~/components/docs/NavToc.vue";
  import HelpfulVote from "~/components/docs/HelpfulVote.vue";
  import {hash} from "ohash";
  import {recursivePages, generatePageNames} from "~/utils/navigation.js";

  const config = useRuntimeConfig();

  const route = useRoute()
  const slug = computed(() => `/docs/${route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug}`);
  let page;

  const fetchNavigation = async () => {
    let navigationFetch;
    let pageList = null;
    let pageNames = null;


      const queryBuilder = queryContent('/docs/');

      navigationFetch = await useAsyncData(
        `NavSideBar-docs`,
        () => fetchContentNavigation(queryBuilder)
      );

      if (navigationFetch.data && navigationFetch.data.value && !navigationFetch.data.value[0].children.find((item) => (item.title === "Videos Tutorials"))) {
        navigationFetch.data.value[0].children.splice(navigationFetch.data.value[0].children.length - 3, 0 , {
          title: "Videos Tutorials",
          _path: "/tutorial-videos",
        });
      }
      pageList = recursivePages(navigationFetch.data.value[0]);
      pageNames = generatePageNames(navigationFetch.data.value[0]);

      const sections = config.public.docs.sections;

      const newData = [];

      Object.entries(sections).forEach(([sectionName, titles]) => {
        // Add the section object
        newData.push({ title: sectionName, isSection: true, _path: "/" });

        // Add the matching items from the data array
        titles.forEach(title => {
          const matchedItem = navigationFetch.data.value[0].children.find(item => item.title === title);
          if (matchedItem) {
            newData.push(matchedItem);
          }
        });
      });

      navigationFetch.data.value[0].children = newData;
      const navigation = navigationFetch.data;

      return {navigation, pageList, pageNames};
    }


  const transformTitle = (text) => {
    return text
      .replace(/([A-Z])/g, '&#x200B;$1')
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  }

  if (slug.value.endsWith(".md")) {
    await navigateTo(slug.value.substring(0, slug.value.length - 3));
  }

  const {origin} = useRequestURL()

  let ogImage = `${origin}/landing/home/header-bg.png`;


    const {data, error} = await useAsyncData(`Container-${hash(slug.value)}`, () => {
      try {
        return queryContent(slug.value).findOne();
      } catch (error) {
        throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
      }
    });
    page = data.value;
    if (error && error.value) {
      throw error.value;
    }
    const iconPath = page.icon?.split('/');
    const pageName = iconPath && iconPath[iconPath?.length - 1]?.split('.')[0];
    ogImage = `${origin}/meta/docs/${pageName || 'default'}.svg?title=${page.title || ''}`


  const {navigation, pageList, pageNames} = await fetchNavigation();

  useContentHead(page);

  const {description, title} = page;
    useHead({
      meta: [
        {property: 'og:title', content: title},
        {property: 'og:description', content: description},
        {property: 'og:image', content: ogImage},
        {property: 'og:image:type', content: "image/svg+xml"},
        {property: 'og:image:alt', content: title},
        {property: 'og:url', content: `${origin}${route.path}`},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'twitter:site', content: '@kestra_io'},
        {name: 'twitter:title', content: title},
        {name: 'twitter:description', content: description},
        {name: 'twitter:image', content: ogImage},
        {name: 'twitter:image:alt', content: title}
      ]
    })
</script>
<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        gap: calc($spacer * 4);
        overflow-x: unset;

        .bd-title {
            margin-top: calc($spacer * 4);
            @include media-breakpoint-down(lg) {
                margin-top: calc($spacer * 1);
            }
            h1 {
                max-width: calc($spacer * 43.7);
                @media only screen and (min-width: 1920px) {
                    max-width: 71.25rem;
                }
            }
        }
        .bd-main {
            gap: calc($spacer * 2) $spacer;
            @include media-breakpoint-down(sm) {
                gap: calc($spacer * 2) calc($spacer * 7);
            }
        }
        .bd-content {
            margin: 0 auto 2em auto;
            max-width: calc($spacer * 43.7);
            @media only screen and (min-width: 1920px) {
                max-width: 71.25rem;
            }

        }
        .title {
            font-size: $h2-font-size;
            font-weight: 400;
            line-height: 3.25rem;
            margin: 0 auto;
        }

        &.type-plugins {
            :deep(.bd-content) {
                img {
                    width: 25px;
                }
            }
        }
    }


    :deep(p) {
        font-weight: 400;
        line-height: 1.75rem;
        font-size: $h6-font-size;
    }

    :deep(.bd-markdown > h2) {
        margin-top: calc($spacer * 4.12);
        border-top: 1px solid $black-6;
        padding-top: calc($spacer * 3.125);
        margin-bottom: 2rem;

        a {
            border-left: 5px solid $purple-36;
            padding-left: calc($spacer * 0.6);
            font-size: calc($font-size-base * 1.87);
            display: block;
        }
    }


    :deep(p > a) {
        text-decoration: underline;
    }

    :deep(h2 > a) {
        font-weight: 600;
        line-height: 2.375rem;
        margin: 0;
    }

    :deep(h3 > a ) {
        color: $white !important;
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 2.375rem;
    }

    :deep(h4 > a ) {
        color: $white !important;
        font-weight: 600;
    }

    :deep(h5) {
        color: $white !important;
        font-weight: 600;
    }

    .bd-main :deep(p > a), .bd-main :deep(ul a) {
        color: $purple-36;
    }

    .container, :deep(h2 > a) {
        color: $white !important;
    }

    :deep(p > code), :deep(li > code), :deep(a > code), :deep(table code) {
        color: $white-3;
        text-decoration: none !important;
    }

    :deep(.code-block), :deep(p > code), :deep(li > code), :deep(a > code), :deep(table code) {
        border: $block-border;
        background-color: $black-2 !important;
    }

    :deep(li > mark) {
        background-color: $link-color;
    }

    :deep(.docs-prev-next a) {
        span {
            color: $link-color;
        }

        .directory {
            color: $white;
        }
    }

    :deep(.btn) {
        span {
            color: $link-color;
        }

        &:hover {

            span {
                color: $white;
            }
        }
    }

    :deep(table) {
        td, th {
            background-color: transparent;
            border-bottom: 1px solid #3D3D3F;
            color: $white;

            a {
                color: $link-color;
            }
        }
    }

    .docs :deep(.img-block) {
        text-align: left !important;
    }

    .homepage {
        .bd-content {
            background: radial-gradient(ellipse closest-side, rgba($primary, .1) 0%, #DDC4FF00 100%) no-repeat, url('/docs/ui/homepage-bg.webp') no-repeat;
            background-size: 500px 250px, 1261px 984px;
            background-position: top 110px right -30px, top -200px right -350px;
            margin-bottom: 2em;
        }

        @include media-breakpoint-up(lg) {
            .bd-content {
                max-width: 733px;
            }

            .bd-title{
                margin: 0 auto;
            }

            .bd-title, .bd-title h1, .bd-title .slug{
                max-width: 733px;
                width: 100%;
            }

            :deep(.video-container){
                padding-top: 56.25%;
                height: auto;
                overflow: hidden;
                iframe{
                    max-width: none;
                    max-height: none;
                }
            }
        }
    }
</style>