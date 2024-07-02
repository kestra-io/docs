<template>
    <div class="container-fluid bd-gutter bd-layout">
        <NavSideBar :type="type" :navigation="navigation"/>
        <article class="bd-main order-1" :class="{'full': page?.rightBar === false , 'docs' : isDoc}">
            <ContentRenderer :value="page">
                <div class="bd-title">
                    <Breadcrumb :slug="slug" :pageList="pageList" :pageNames="pageNames" />
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

                <NavToc v-if="page" :page="page" class="my-md-0 my-4 right-menu" />

                <div class="bd-content">
                    <DocsFeatureScopeMarker v-if="page?.editions || page?.version" :editions="page.editions" :version="page.version" />
                    <ContentRendererMarkdown
                        class="bd-markdown"
                        v-if="page"
                        :value="page"
                        data-bs-spy="scroll"
                        data-bs-target="#nav-toc"
                    />
                    <HelpfulVote />
                    <PrevNext v-if="prevNext" :navigation="navigation" />
                </div>
            </ContentRenderer>
        </article>
    </div>
</template>

<script setup>
  import { computed } from 'vue';
  import PrevNext from '~/components/layout/PrevNext.vue';
  import NavSideBar from '~/components/docs/NavSideBar.vue';
  import Breadcrumb from '~/components/layout/Breadcrumb.vue';
  import NavToc from '~/components/docs/NavToc.vue';
  import HelpfulVote from '~/components/docs/HelpfulVote.vue';
  import { hash } from 'ohash';
  import { recursivePages, generatePageNames } from '~/utils/navigation.js';

  let page = ref(null);

  const isDoc = computed(() => props.type === 'docs');
  const route = useRoute();
  const slug = computed(() => {
    const paramSlug = route.params.slug;
    return `/${props.type}/${Array.isArray(paramSlug) ? paramSlug.join('/') : paramSlug}`;
  });
  let navigation = null;
  let pageList = [];
  let pageNames = [];

  const fetchNavigation = async () => {
    let navigationFetch;
    if (props.type === 'plugins') {
      navigationFetch = await useFetch(`/api/plugins?type=navigation`);
    } else {
      const queryBuilder = queryContent(`/${props.type}/`);
      navigationFetch = await useAsyncData(`NavSideBar-${hash(props.type)}`, () => fetchContentNavigation(queryBuilder));
      if (navigationFetch.data && navigationFetch.data.value && props.type === 'docs') {
        const videosTutorials = { title: 'Videos Tutorials', _path: '/tutorial-videos' };
        const children = navigationFetch.data.value[0].children;
        if (!children.find(item => item.title === videosTutorials.title)) {
          children.splice(children.length - 3, 0, videosTutorials);
        }
      }
    }
    navigation = navigationFetch.data;
    pageList = recursivePages(navigation.value[0]);
    pageNames = generatePageNames(navigation.value[0]);
  };

  const transformTitle = (text) => {
    return text.replace(/([A-Z])/g, '&#x200B;$1').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  };

  const props = defineProps({
    type: {
      type: String,
      required: true
    },
    prevNext: {
      type: Boolean,
      required: false,
      default: true
    }
  });

  const initializePage = async () => {
    const fetchPageData = async () => {
      try {
        if (slug.value.endsWith('.md')) {
          await navigateTo(slug.value.substring(0, slug.value.length - 3));
        }
        const { origin } = useRequestURL();
        let ogImage = `${origin}/landing/home/header-bg.png`;

        if (props.type === 'plugins') {
          const parts = slug.value.split('/');
          const pageName = parts.length > 3 ? parts[parts.length - 1].replace(/.md$/, '') : parts[2];
          const pageType = parts.length > 3 ? 'definitions' : 'plugin';
          const pageUrl = `/api/plugins?page=${pageName}&type=${pageType}`;
          const { data: pluginInformation } = await useAsyncData(`Container-${hash(pageUrl)}`, () => $fetch(pageUrl));

          if (pluginInformation?.value?.error) {
            throw createError({ statusCode: 404, message: pluginInformation.value.message, fatal: true });
          }

          const updateObject = (obj) => {
            if (typeof obj !== 'object' || obj === null) {
              return obj;
            }
            if (Array.isArray(obj)) {
              return obj.map(updateObject);
            }
            let newObj = { ...obj };
            if (newObj.tag === 'binding') {
              newObj.children = [{
                type: 'text',
                value: newObj.props.value ? `{{ ${newObj.props.value} }}` : ''
              }];
              newObj.tag = 'span';
            }
            for (const key in newObj) {
              newObj[key] = updateObject(newObj[key]);
            }
            return newObj;
          };
          page.value = updateObject(pluginInformation.value);
          ogImage = `${origin}/meta/plugins/${pageName}.svg?type=${pageType}`;
        } else {
          const { data, error } = await useAsyncData(`Container-${hash(slug.value)}`, () => queryContent(slug.value).findOne());

          if (error?.value) {
            throw createError({ statusCode: 404, message: error.value.message, data: error, fatal: true });
          }

          page.value = data.value;
          const iconPath = page.icon?.split('/');
          const pageName = iconPath ? iconPath[iconPath.length - 1]?.split('.')[0] : 'default';
          ogImage = `${origin}/meta/docs/${pageName}.svg?title=${page.title || ''}`;
        }

        useContentHead(page);

        useHead({
          meta: [
            { property: 'og:title', content: page.title },
            { property: 'og:description', content: page.description },
            { property: 'og:image', content: ogImage },
            { property: 'og:image:type', content: 'image/svg+xml' },
            { property: 'og:image:alt', content: page.title },
            { property: 'og:url', content: 'https://kestra.io' }
          ]
        });

      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };

    await fetchNavigation();
    await fetchPageData();
  };

  await initializePage();
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/variable';

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
            margin: 0 auto;
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
    }
</style>
