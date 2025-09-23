<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row content mt-5 mb-2">
                <div class="col-12">
                    <h1 data-aos="fade-left title">Video Tutorials</h1>
                    <h4 data-aos="fade-right" class="fw-normal">
                        Get started with our video tutorials
                    </h4>
                    <ul
                        class="nav nav-tabs mt-3 flex-nowrap overflow-x-auto overflow-y-hidden"
                        id="myTab"
                        role="tablist"
                    >
                        <li
                            v-for="category in categories"
                            :key="category.name"
                            class="nav-item text-nowrap"
                            role="presentation"
                        >
                            <button
                                class="nav-link"
                                :class="{ 'active': activeTag.name === category.name }"
                                id="home-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#home"
                                type="button"
                                @click="setCatVideos(category)"
                            >
                                {{ category.name }}
                            </button>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div
                            v-for="category in categories"
                            :key="category.name"
                            class="tab-pane fade"
                            :class="{ 'show active': activeTag.name === category.name }"
                            :id="category.name"
                            role="tabpanel"
                            :aria-labelledby="`${category.name}-tab`"
                        >
                            <div class="tutorials-container">
                                <div class="row" v-if="featuredVideo">
                                    <div class="col-12 col-lg-8">
                                        <iframe
                                            width="764"
                                            height="424"
                                            :src="featuredVideo.iframeUrl"
                                            :title="featuredVideo.title"
                                            frameborder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerpolicy="strict-origin-when-cross-origin"
                                            allowfullscreen
                                        />
                                    </div>
                                    <div class="col-12 col-lg-4">
                                        <div class="info-block">
                                            <div class="content">
                                                <p class="category">{{featuredVideo.category}}</p>
                                                <h3 class="title">{{featuredVideo.title}}</h3>
                                                <p class="video-info" v-if="featuredVideo.publicationDate">
                                                    {{getYMD(featuredVideo.publicationDate)}}
                                                </p>
                                                <p class="canal-name">{{featuredVideo.author}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tutorials-list">
                                    <div class="row">
                                        <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="video in videos" :key="video.title">
                                            <VideosTutorialVideo
                                                :video="video"
                                                :getYMD="getYMD"
                                                @click="openVideoModal(video)"
                                                data-bs-toggle="modal"
                                                data-bs-target="#youtube-video"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class=" d-flex justify-content-between my-5">
                    <div class="items-per-page">
                        <select
                            class="form-select bg-dark-2"
                            aria-label="Default select example"
                            v-model="itemsPerPage"
                        >
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                        </select>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <CommonPagination
                            :totalPages="totalPages"
                            :currentPage="page"
                            @on-page-change="changePage"
                            v-if="totalPages > 1"
                        />
                        <div class="d-flex align-items-baseline">
                            <span class="total-pages">Total: {{ totalVideos }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-on="{
                'show.bs.modal': () => (videoVisible = true),
                'hidden.bs.modal': () => (videoVisible = false),
            }"
            class="modal fade"
            tabindex="-1"
            role="dialog"
            id="youtube-video"
            ref="youtubeVideoModal"
            aria-labelledby="youtube-video"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" @click="closeModal" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="video-responsive">
                            <iframe
                                v-if="videoVisible"
                                :src="`${visibleVideoData.iframeUrl}?autoplay=1`"
                                :title="visibleVideoData.title"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerpolicy="strict-origin-when-cross-origin"
                                allowfullscreen
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Category {
  name: string
}

interface VideoData {
  title: string
  category: string
  url: string
  publicationDate?: string
  author: string
  isFeatured?: boolean
  iframeUrl?: string
  youtubeUrl?: string
}

interface TutorialVideoResponse {
  results: VideoData[]
  total: number
}

const { $bootstrap } = useNuxtApp()
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const { start } = useLoadingIndicator()
const { extractVideoId } = useYoutube()

const youtubeVideoModal = ref<HTMLElement | null>(null)
const activeTag = ref<Category>({ name: 'All videos' })
const videos = ref<VideoData[]>([])
const featuredVideo = ref<VideoData | null>(null)
const videoVisible = ref(false)
const visibleVideoData = ref<VideoData>({} as VideoData)
const totalPages = ref(0)
const totalVideos = ref(0)
const itemsPerPage = ref(25)

const categories: Category[] = [
  { name: 'All videos' },
  { name: 'Deep Dive Tutorials' },
  { name: 'Quick Start Tutorials' },
  { name: 'Feature Highlight' }
]

const tags = new Map([
  ['all', 'All videos'],
  ['deep-dive', 'Deep Dive Tutorials'],
  ['quick-start', 'Quick Start Tutorials'],
  ['feature-highlight', 'Feature Highlight']
])

const page = computed(() =>
  route.query.page ? parseInt(route.query.page as string) : 1
)

const currentCategory = computed(() => {
  const slug = route.params.slug as string
  return slug === 'all' ? '' : tags.get(slug) || ''
})

function getYMD(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

function embedUrl(url: string): string {
  const videoId = extractVideoId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

function findKeyByValue(map: Map<string, string>, value: string): string | undefined {
  for (const [key, val] of map.entries()) {
    if (val === value) return key
  }
}

function setVideos(data: VideoData[], total: number): void {
  const videoData = data.map(item => ({
    ...item,
    iframeUrl: embedUrl(item.url),
    youtubeUrl: item.url
  }))

  if (activeTag.value.name === 'All videos') {
    featuredVideo.value = videoData.find(item => item.isFeatured) || null
    videos.value = videoData.filter(video => !video.isFeatured)
  } else {
    featuredVideo.value = null
    videos.value = [...videoData]
  }

  totalVideos.value = total
  totalPages.value = Math.ceil(total / itemsPerPage.value)
}

function changePage(pageNo: number): void {
  router.push({
    query: {
      ...route.query,
      page: pageNo
    }
  })
}

function closeModal(): void {
  if (process.client && youtubeVideoModal.value) {
    const modal = $bootstrap.Modal.getInstance(youtubeVideoModal.value)
    modal?.hide()
  }
}

function openVideoModal(video: VideoData): void {
  visibleVideoData.value = video
}

function setCatVideos(category: Category): void {
  start()
  router.push({
    query: {
      ...route.query,
      page: 1
    },
    params: {
      ...route.params,
      slug: findKeyByValue(tags, category.name)
    }
  })
}

watch(() => route.params.slug, (newSlug) => {
  const slug = newSlug as string
  activeTag.value = { name: tags.get(slug) || 'All videos' }
}, { immediate: true })

watch(() => route.query.size, (newSize) => {
  itemsPerPage.value = newSize ? parseInt(newSize as string) : 25
}, { immediate: true })

watch(itemsPerPage, (newVal) => {
  router.push({
    query: {
      ...route.query,
      size: newVal,
      page: 1
    }
  })
})

const { data: tutorialVideo } = await useFetch<TutorialVideoResponse>(
  () => `${config.public.apiUrl}/tutorial-videos?page=${page.value}&size=${itemsPerPage.value}&category=${currentCategory.value}`
)

watch(tutorialVideo, (newVal) => {
  if (newVal?.total) {
    setVideos(newVal.results, newVal.total)
    if (process.client) {
      window.scrollTo(0, 0)
    }
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .modal-header {
        background-color: $black-2;
        border-bottom-color: $black-2;
        padding-bottom: 0;
        padding-top: 5px;
        display: flex;
        justify-content: flex-end;
        button {
            background: transparent;
            border: none;
            color: $white;
        }
    }

    .modal-body {
        background-color: $black-2;
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
            border-width: 0;
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
                border-bottom: 2px solid $purple-36;
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

    .tutorials-container {
        padding: 2rem 0 1rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;

        iframe {
            border: 1px solid $black-6;
            border-radius: calc($spacer * 0.5);
            width: 100%;

            @include media-breakpoint-down(lg) {

            }
        }

        .info-block {
            display: flex;
            align-items: center;
            height: 100%;
            max-width: calc($spacer * 23.25);

            .content {
                display: flex;
                flex-direction: column;
                margin: 0 !important;

                p {
                    margin: 0;
                    font-size: $font-size-sm;
                    line-height: calc($spacer * 1.375);
                    font-weight: 400;
                }

                p.category {
                    color: $purple-36;
                }

                h3.title {
                    font-size: $h3-font-size;
                    font-weight: 400;
                    line-height: calc($spacer * 2.375);
                    color: $white;
                    margin: 0;
                }

                p.video-info {
                    color: $white-3;
                }

                p.canal-name {
                    color: $black-8;
                }
            }

            @include media-breakpoint-down(lg) {
                max-width: unset;
                .content {
                    h3.title {
                        line-height: unset;
                    }
                }
            }
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

    .total-pages {
        font-size: $font-size-sm;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-weight: 400;
        line-height: 22px;
    }
</style>
