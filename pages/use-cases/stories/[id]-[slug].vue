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
            :logo="story.logoDark"
            :kpi1="story.kpi1"
            :kpi2="story.kpi2"
            :kpi3="story.kpi3"
        />

        <NuxtLazyHydrate when-visible>
            <div class="container pt-5">
                <div class="row position-relative">
                    <div class="col-md-4 mb-4" style="align-self: start;">
                        <div class="sidebar-wrapper">
                            <div class="story-info">
                                <div class="info-block">
                                    <p class="title">Industry</p>
                                    <p class="subtitle">{{story.industry}}</p>
                                </div>
                                <div class="info-block">
                                    <p class="title">Headquarters</p>
                                    <p class="subtitle">{{story.headquarter}}</p>
                                </div>
                                <div class="info-block">
                                    <p class="title">Solution</p>
                                    <p class="subtitle">{{story.solution}}</p>
                                </div>

                                <div class="info-block">
                                    <p class="title mb-2">Data Stack</p>
                                    <div class="d-flex flex-column gap-3 justify-content-start">
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

                                <div class="info-block pt-4 w-100 d-flex justify-content-center">
                                    <NuxtLink
                                        href="/demo"
                                        class="btn btn-gradient mx-auto"
                                    >
                                        Book a demo
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- OPTIONAL: remove bottom margin here if you want even less gap -->
                    <div class="col-md-8 mb-4">
                        <div class="business-container">
                            <div class="business-by-us">
                                <div class="info-content">
                                    <div class="info-item w-100">
                                        <h3>{{story.quote}}</h3>
                                        <p class="mt-3 text-muted">— {{story.quotePerson}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="story-container">
                            <ContentRenderer class="bd-markdown" :value="content" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="section-content-wrapper">
                <div class="container">
                    <div class="section-content">
                        <LayoutSection subtitle-before="Similar" subtitle="Kestra" subtitle-after="Stories" v-if="related">
                            <div class="row">
                                <div class="col-12 col-md-6 col-lg-4 mb-4 d-flex align-items-stretch" v-for="(relatedStory, index) in related.results" :key="index">
                                    <NuxtLink :href="`/use-cases/stories/${relatedStory.id}-${slugify(relatedStory.title)}`" class="text-decoration-none w-100">
                                        <div class="card similar-story-card h-100">
                                            <div class="card-body p-3 d-flex flex-column">
                                                <img
                                                    loading="lazy"
                                                    :src="relatedStory.featuredImage"
                                                    :alt="relatedStory.title"
                                                    class="card-img-top"
                                                />

                                                <p class="card-title mt-3 mb-2">{{ relatedStory.title }}</p>

                                                <div class="d-flex flex-wrap gap-2 my-3">
                                                    <div class="icon-box" v-for="task in relatedStory.tasks.slice(0,4)" :key="task">
                                                        <CommonTaskIcon :cls="task" />
                                                    </div>
                                                </div>

                                                <span class="author mt-auto">
                                                    Read the story >
                                                </span>
                                            </div>
                                        </div>
                                    </NuxtLink>
                                </div>
                            </div>
                        </LayoutSection>

                       
                    </div>
                </div>
            </div>
        </NuxtLazyHydrate>

    </div>
</template>

<script setup>
    import {parseMarkdown} from '@nuxtjs/mdc/runtime'
    import {slugify} from "@kestra-io/ui-libs";

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

    const {data} = await useAsyncData(`useCases/stories/${route.params.id}`, () => {
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

    .main {
        background-color: $white;
        color: $black-2;
    }

    .btn-gradient {
        display: flex;
        width: 202px;
        height: 50px;
        padding: 8px 20px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 0 auto !important;

        border-radius: 8px;
        border: 1px solid #FFF;
        background: linear-gradient(180deg, #694EFF 0%, #5233FF 104.54%);
        box-shadow: 2px 2px 11px 0 rgba(0, 0, 0, 0.45), 0 0 14px 0 #BE62FF inset;

        color: white !important;
        font-weight: 600;
        text-decoration: none;

        &:hover {
            opacity: 0.9;
            color: white !important;
        }
    }

    .business-container {
        margin-bottom: 3rem;
        padding: 2rem;
        background-color: #F9F9FB;
        border-radius: 8px;
        border-left: 4px solid #631BFF;

        .business-by-us {
            .info-content {
                display: flex;
                flex-direction: column;

                h3 {
                    font-size: 1.5rem;
                    line-height: 1.4;
                    font-weight: 500;
                    font-style: italic;
                    color: $black-2;
                    margin: 0;
                }

                p {
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin: 0;
                    color: #666;
                }
            }
        }
    }

    .story-container {
        :deep(.bd-markdown) {
            p {
                font-size: $h6-font-size;
                line-height: 1.6;
                color: $black-2;
                font-weight: 400;
            }

            h2 {
                margin-top: 3rem;
                margin-bottom: 1rem;
                font-size: 2rem;
                font-weight: 700;
                color: $black-2 !important;
            }

            h3 {
                margin-top: 2rem;
                font-size: 1.5rem;
                font-weight: 600;
                color: $black-2 !important;
            }

            h2 > a, h3 > a {
                color: $black-2 !important;
                text-decoration: none;
            }

            strong {
                font-weight: 700;
                color: $black-2;
            }

            ul > li {
                color: $black-2;
                line-height: 1.6;
            }

            ul > li::marker {
                color: #631BFF;
            }

            blockquote {
                border-left: 4px solid #631BFF;
                background-color: #F9F9FB;
                padding: 1.5rem;
                margin: 2rem 0;
                border-radius: 0 8px 8px 0;

                p {
                    margin: 0;
                    font-style: italic;
                    color: $black-2;
                }
            }
        }
    }

    .story-info {
        padding: 2rem;
        background-color: $white;
        border: 1px solid #E5E5E5;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);

        .info-block {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            width: 100%;

            .title {
                font-size: 0.875rem;
                font-weight: 700;
                color: $black-2;
                text-transform: uppercase;
                margin: 0;
            }

            .subtitle {
                font-size: 1rem;
                font-weight: 400;
                color: #555;
                margin: 0;
            }
        }
    }

    .card {
        border: none;
        background-color: transparent;
        box-shadow: none;
        width: 100%;
        padding: 0;

        .card-body {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0;
            gap: 1rem;
        }

        .card-title {
            font-size: 0.875rem;
            font-weight: 600;
            margin: 0;
            color: $black-2;
        }
    }

    .task-card {
        background-color: transparent;
        :deep(.icon-wrapper) {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        img {
            width: 32px;
            height: 32px;
            object-fit: contain;
        }
    }



    .section-content-wrapper {
        background-color: #F4F4F4;
        width: 100vw;
        margin-left: calc(-50vw + 50%);


        margin-top: 0.5rem; 
        padding: 4rem 0;


        position: relative;
        overflow: hidden;
    }

    .section-content-wrapper::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-image: url("/stories/square.svg");

        background-repeat: repeat;
    }

    .section-content-wrapper > .container {
        position: relative;
        z-index: 1;
    }

    .section-content {
        border: none;

        :deep(.subtitle > p), :deep(h2), :deep(.main-title) {
            color: #101828 !important;
            text-align: center;
            font-family: "Mona Sans", sans-serif;
            font-size: 32px !important;
            font-weight: 700;
            line-height: 48px;
            background: none !important;
            -webkit-text-fill-color: initial !important;

            span {
                color: #101828 !important;
                background: none !important;
                -webkit-text-fill-color: initial !important;
            }
        }

        .similar-story-card {
            background-color: #FFFFFF !important;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            .card-body {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 1rem !important;
            }

            .card-img-top {
                width: 100%;
                height: 232.19px !important;
                align-self: stretch;
                aspect-ratio: 337.33/232.19;
                object-fit: cover;
                border-radius: 8px;
                background-color: lightgray;
                border: 1px solid #E5E5E5;
            }

            .card-title {
                 display: block !important;
                 color: #101828 !important;
                 font-family: "Public Sans", sans-serif;
                 font-size: 16px;
                 font-weight: 700;
                 margin-top: 1rem;
                 margin-bottom: 0.5rem;
                 text-transform: none !important;
                 text-align: left;
            }

            .icon-box {
                width: 44px;
                height: 44px;
                border-radius: 4px;
                border: 1px solid #E5E5E5;
                padding: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: transparent;

                :deep(img), :deep(svg) {
                    max-width: 100%;
                    max-height: 100%;
                }
            }

            .author {
                display: flex !important;
                width: 100%;
                justify-content: flex-end;
                align-items: center;
                gap: 5px;
                margin-top: auto;

                color: #000 !important;
                text-shadow: 0 7.333px 15.333px rgba(255, 255, 255, 0.13);
                font-family: "Public Sans", sans-serif;
                font-size: 16px;
                font-weight: 700;
                line-height: 24px;
            }
        }
    }

    .see-all-container {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        gap: 5px;
        align-self: stretch;
        margin-top: 1.5rem;
    }

    .see-all-link {
        color: $black-2;
        font-weight: 600;
        text-decoration: none;
        font-family: "Public Sans", sans-serif;

        &:hover {
            text-decoration: underline;
        }
    }
</style>
