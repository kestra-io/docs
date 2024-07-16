<template>
    <div class="main">
        <Head>
            <Title>{{ story.metaTitle }}</Title>
            <Meta
                name="description"
                :content="story.metaDescription"
            />
        </Head>

        <StoriesHeader
            :slug="slug"
            :title="story.title"
            :meta-description="story.description"
            :hero-image="story.heroImage"
        />

        <NuxtLazyHydrate when-visible>
            <div class="container">
                <div class="story-container">
                    <ContentRendererMarkdown class="bd-markdown" :value="content1" />
                    <div class="d-flex flex-wrap gap-4 my-5">
                        <div class="card task-card">
                            <div class="card-body">
                                <div ref="root" class="icon-wrapper" data-bs-toggle="tooltip" data-bs-placement="top" title="Kestra">
                                    <img src="/landing/usecases/stories/monograme-kestra.svg" alt="Kestra">
                                </div>
                                <p class="card-title">Kestra</p>
                            </div>
                        </div>
                        <div class="card task-card" v-for="task in story.tasks" :key="task">
                            <div class="card-body">
                                <CommonTaskIcon :cls="task" />
                                <p class="card-title">{{generateTagName(task)}}</p>
                            </div>
                        </div>
                    </div>

                    <ContentRendererMarkdown class="bd-markdown" :value="content2" />
                </div>
                <div class="section-content">
                    <LayoutSection subtitle-before="Similar" subtitle="Kestra" subtitle-after="Stories" v-if="related">
                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-4" v-for="(story, index) in related.results"
                                 :key="index">
                                <StoriesCard :story="story" />
                            </div>
                        </div>
                    </LayoutSection>
                    <div class="d-flex justify-content-center">
                        <NuxtLink href="/use-cases/stories">
                            <button class="btn btn-animated btn-purple-animated mb-2 aos-init aos-animate">See all stories</button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Getting started with Kestra"
                subtitle="Start building with Kestra — Automate Everything Everywhere All at Once."
                darkButtonText="Read the docs"
                purpleButtonText="Get started!"
            />
        </NuxtLazyHydrate>
    </div>
</template>
<script setup>
    import {parseMarkdown} from '@nuxtjs/mdc/runtime'
    const {$bootstrap} = useNuxtApp()
    const route = useRoute()
    const config = useRuntimeConfig();
    const slug = (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const story = ref({})
    const content1 = ref('')
    const content2 = ref('')
    const root = ref(null)

    onMounted(() => {
      if (process.client) {
        new $bootstrap.Tooltip(root.value);
      }
    });

    onBeforeUnmount(() => {
      if (process.client) {
        const tooltip = $bootstrap.Tooltip.getInstance(root.value);
        if (tooltip) {
          tooltip.dispose();
        }
      }
    });

    const {data} = await useAsyncData('stories', () => {
        return $fetch(`${config.public.apiUrl}/customer-stories/${route.params.id}`)
    })

    if (data.value === null) {
        throw createError({statusCode: 404, message: `Unable to find id '${route.params.id}'`, fatal: true})
    }

    story.value = data.value;

    content1.value = await parseMarkdown(story.value.content_1, {});
    content2.value = await parseMarkdown(story.value.content_2, {});

    useHead({
        meta: [
            {name: 'twitter:card', content: 'summary_large_image'},
            {name: 'twitter:site', content: '@kestra_io'},
            {name: 'twitter:title', content: story.value.metaTitle},
            {
                name: 'twitter:description',
                content: story.value.metaDescription
            },
            {name: 'twitter:image', content: story.value.heroImage},
            {
                name: 'twitter:image:alt',
                content: story.value.title
            }
        ]
    })

    const {data: related} = await useAsyncData('related-stories', () => {
        return $fetch(`${config.public.apiUrl}/customer-stories?size=3`)
    })

    const generateTagName = (task) => {
      const splittedTask = task.split(".");
      const taskName = splittedTask[splittedTask.length - 1];

      return taskName.length > 13 ? taskName.slice(0,13) + "..." : taskName;
    };
</script>
<style scoped lang="scss">
    @import "../../../assets/styles/variable";

    .story-container {
        max-width: 55rem;
        margin: 0 auto calc($spacer * 5.6);

        :deep(.bd-markdown:first-child) {
            p:first-of-type {
                padding: calc($spacer * 2);
                border: 1px solid $black-6;
                background-color: $black-2;
                border-radius: calc($spacer / 2);
            }
        }

        :deep(.bd-markdown) {
            p {
                font-size: $h6-font-size;
                line-height: calc($spacer * 1.6);
            }

            h3 {
                margin-top: calc($spacer * 4.12);
                margin-bottom: 3rem;
                border-left: 5px solid $purple-36;
                padding-left: calc($spacer * 0.6) !important;
                font-size: calc($font-size-base * 2.25);
                line-height: calc($spacer * 2.3);
            }

            h2 {
                border-top: 1px solid $black-6;
                margin-top: 3rem !important;
                margin-top: calc($spacer * 4.12);
                margin-bottom: 3rem;
                font-size: calc($font-size-base * 2.25);
                line-height: calc($spacer * 2.3);

                a {
                    border-left: 5px solid $purple-36;
                    padding-left: calc($spacer * 0.6) !important;
                }
            }


            ul > li::marker {
                color: #736BCD ;
            }
        }


    }


    p, ul > li {
        line-height: 1.5rem;
    }

    :deep(h3 > a) {
        font-size: $h2-font-size;
        color: $white;
    }

    :deep(h3) {
        margin-top: $h1-font-size !important;
        padding: 0 !important;
        font-weight: 300;
    }

    :deep(p), :deep(li) {
        font-weight: 400;
        color: $white;
    }
    :deep(a) {
      color: $purple-35;
    }

    .section-content {
        border-top: 1px solid rgba(255, 255, 255, 0.10);
        padding: 2.875rem 0;
        :deep(.subtitle > p) {
            background: linear-gradient(90deg, #E151F7 65.38%, #5C47F5 82.43%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            span {
                color: $white;
                -webkit-background-clip: $white;
                -webkit-text-fill-color: $white;
            }
        }
    }

    .card {
        border: 1px solid $black-3;
        border-right: 8px;
        padding-top: calc($spacer * 0.938);
        padding-bottom: calc($spacer * 0.8);
        width: calc($spacer * 8.3);

        .card-body {
            display: flex;
            flex-direction: column;
            gap: calc($spacer / 4);
            align-items: center;
            padding: 0;
        }

        .card-title {
            margin: 0;
            font-size: 14px;
            font-weight: 700;
            line-height: 22px;
        }
    }


    :deep(section div.main) {
        padding-top: 4rem;
    }


    .task-card {
        background-color: $black-2;
        :deep(.icon-wrapper) {
            width: 42px;
            height: 42px;
        }
    }
</style>