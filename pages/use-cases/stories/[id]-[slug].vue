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
            :logo="story.logo"
            :kpi1="story.kpi1"
            :kpi2="story.kpi2"
            :kpi3="story.kpi3"
        />

        <NuxtLazyHydrate when-visible>
            <div class="container">
                <div class="business-container">
                    <div class="business-by-us">
                        <div class="info-content">
                            <div class="info-item w-75">
                                <h3>{{story.quote}}</h3>
                            </div>
                            <div class="vertical-line"></div>
                            <div class="info-item">
                                <p>{{story.quotePerson}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8 mb-4">
                        <div class="story-container">
                            <ContentRenderer class="bd-markdown" :value="content" />
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="story-info">
                            <div class="mx-auto">
                                <img
                                    width="112"
                                    height="68"
                                    loading="lazy"
                                    :src="story.logo"
                                    :alt="story.logo"
                                />
                            </div>
                            <div class="info-block">
                                <p class="title">
                                    Industry
                                </p>
                                <p class="subtitle">{{story.industry}}</p>
                            </div>
                            <div class="info-block">
                                <p class="title">
                                    Headquarters
                                </p>
                                <p class="subtitle">{{story.headquarter}}</p>
                            </div>
                            <div class="info-block">
                                <p class="title">
                                    Solution
                                </p>
                                <p class="subtitle">{{story.solution}}</p>
                            </div>
                            <div>
                                <p>Data Stack</p>
                                <div class="d-flex flex-wrap gap-2 justify-content-center">
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
                            </div>
                        </div>
                        <div class="ready-bar btn-animated btn-purple-animated">
                            <div class="d-flex flex-column px-lg-5 px-0">
                                <p>Ready to explore Kestra solutions?</p>
                                <NuxtLink
                                    href="/demo"
                                    class="btn text-white btn-animated btn-purple-animated mt-2"
                                >
                                    get a demo
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
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
    const content = ref('')
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
        return $fetch(`${config.public.apiUrl}/customer-stories-v2/${route.params.id}`)
    })

    if (data.value === null) {
        throw createError({statusCode: 404, message: `Unable to find id '${route.params.id}'`, fatal: true})
    }

    story.value = data.value;

    content.value = await parseMarkdown(story.value.content, {});

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
        return $fetch(`${config.public.apiUrl}/customer-stories-v2?size=3`)
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
        :deep(.bd-markdown) {
            p {
                font-size: $h6-font-size;
                line-height: calc($spacer * 1.6);
            }

            h3 {
                margin-top: calc($spacer * 4.12);
                margin-bottom: 3rem;
                padding-left: calc($spacer * 0.6) !important;
                font-size: calc($font-size-base * 2.25);
                line-height: calc($spacer * 2.3);
            }

            h2 {
                margin-top: auto;
                padding-top: 3rem;
                margin-bottom: 1rem;
                font-size: calc($font-size-base * 2.25);
                line-height: calc($spacer * 2.3);
            }


            ul > li::marker {
                color: #736BCD ;
            }
        }


    }

    .story-info {
        padding: calc($spacer * 2);
        border: 1px solid $black-6;
        background-color: $black-2;
        border-radius: calc($spacer / 2);
        display: flex;
        flex-direction: column;
        gap: 2rem;

        .info-block {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;

            .title {
                font-size: $h6-font-size;
                font-weight: 600;
                color: $white;
                margin: 0;
            }

            .subtitle {
                font-size: $h6-font-size;
                font-weight: 300;
                color: $white-1;
                margin: 0;
            }
        }
    }


    .ready-bar {
        margin-top: 2rem;
        padding: 2rem;
        &, &::after {
            border-radius: 8px;
            background: $black-4 !important;
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
        background-color: $black-3;
        min-width: 9rem;
        :deep(.icon-wrapper) {
            width: 42px;
            height: 42px;
        }
    }

    .business-container {
        margin-top: calc($spacer * 11.3);
        margin-bottom: calc($spacer * 2.8);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: calc($spacer * 2);
        background-color: $black-2;
        border-radius: calc($spacer * 0.5);
        border: 1px solid #252526;
        overflow: hidden;
        position: relative;
        z-index: 10;

        @include media-breakpoint-down(lg) {
            margin-top: 22.3rem;
        }

        &::after,
        &::before {
            content: "";
            position: absolute;
            width: 18rem;
            height: 18rem;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
            filter: blur(60px);
            z-index: 0;
        }
        &::after {
            left: 80%;
            top: -43%;
        }

        &::before {
            right: 77%;
            bottom: -15%;
        }

        .business-by-us {
            .info-content {
                position: relative;
                z-index: 10;
                display: flex;
                gap: 2rem;
                justify-content: center;
                align-items: center;

                @include media-breakpoint-down(lg) {
                    flex-direction: column;
                }

                .vertical-line {
                    background-color: #FFFFFF30;
                    min-height: calc($spacer * 6.875);
                    width: 1px;
                    @include media-breakpoint-down(lg) {
                        height: 1px;
                        min-height: 1px;
                        width: 100%;
                    }
                }

                .info-item {
                    display: flex;
                    flex-direction: column;

                    h3 , p  {
                        margin: 0;
                        font-weight: 600;
                        color: $white;
                    }

                    h3 {
                        font-size: $h3-font-size;
                        line-height: 48px;
                        margin-top: 0 !important;
                    }

                    p {
                        font-size: $font-size-lg;
                        line-height: 30px;
                    }

                    span {
                        font-size: $font-size-sm;
                        line-height: 30px;
                        color: $purple;
                        font-weight: 400;
                    }
                }
            }
        }
    }
</style>