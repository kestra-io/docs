<template>
    <section>
        <div class="container">
            <div class="row content mb-2">
                <div class="col-12">
                    <h1 data-usal="fade-left title">Video Tutorials</h1>
                    <h4 data-usal="fade-r" class="fw-normal">
                        Get started with our video tutorials
                    </h4>
                    <ul id="myTab" class="nav nav-tabs mt-3 flex-nowrap overflow-x-auto overflow-y-hidden"
                        role="tablist">
                        <li
                            v-for="category in categories"
                            :key="category"
                            class="nav-item text-nowrap"
                            role="presentation"
                        >
                            <a class="nav-link" :class="{ active: currentCategory === category }" type="button"
                                :href="`/tutorial-videos/${categoryToSlug[category]}`">
                                {{ category }}
                            </a>
                        </li>
                    </ul>
                    <div id="myTabContent" class="tab-content">
                        <div class="tutorials-container" role="tabpanel">
                            <div v-if="featuredVideo" class="row">
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
                                            <p class="category">{{ featuredVideo.category }}</p>
                                            <h3 class="title">{{ featuredVideo.title }}</h3>
                                            <p v-if="featuredVideo.publicationDate" class="video-info">
                                                {{ formatDate(featuredVideo.publicationDate) }}
                                            </p>
                                            <p class="canal-name">{{ featuredVideo.author }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tutorials-list">
                                <div class="row">
                                    <div
                                        v-for="video in videos"
                                        :key="video.title"
                                        class="col-12 col-md-6 col-lg-4 mb-4"
                                    >
                                        <VideosTutorialVideo
                                            :video="video"
                                            @click="openVideoModal(video)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PaginationContainer
                    :current-url="currentUrl"
                    :total-items="totalItems"
                    :show-total="false"
                    @update="onPaginationUpdate"
                />
            </div>
        </div>

        <Modal v-model:show="videoVisible" class="video-modal">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="video-container">
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
        </Modal>
    </section>
</template>

<script setup lang="ts">
    import { ref, watch } from "vue"
    import { navigate } from "astro:transitions/client"
    import { useYoutube } from "~/utils/useYoutube"
    import Modal from "~/components/common/Modal.vue"
    import VideosTutorialVideo from "~/components/videos/TutorialVideo.vue"
    import PaginationContainer from "~/components/common/PaginationContainer.vue"

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

    const props = withDefaults(
        defineProps<{
            page?: number
            itemsPerPage?: number
            currentCategory?: string
            currentUrl: string
            tutorialVideo?: TutorialVideoResponse
        }>(),
        {
            page: 1,
            itemsPerPage: 24,
            currentCategory: "All videos",
            tutorialVideo: undefined,
        },
    )

    const { extractVideoId } = useYoutube()

    const videos = ref<VideoData[]>([])
    const featuredVideo = ref<VideoData | null>(null)
    const videoVisible = ref(false)
    const visibleVideoData = ref<VideoData>({} as VideoData)
    const totalItems = ref(0)

    const categories = [
        "All videos",
        "Deep Dive Tutorials",
        "Quick Start Tutorials",
        "Feature Highlight",
    ] as const

    const categoryToSlug: Record<string, string> = {
        "All videos": "all",
        "Deep Dive Tutorials": "deep-dive",
        "Quick Start Tutorials": "quick-start",
        "Feature Highlight": "feature-highlight",
    }

    function formatDate(dateString: string): string {
        try {
            return new Intl.DateTimeFormat("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).format(new Date(dateString))
        } catch {
            return dateString
        }
    }

    function embedUrl(url: string): string {
        const videoId = extractVideoId(url)
        return videoId ? `https://www.youtube.com/embed/${videoId}` : ""
    }

    function setVideos(data: VideoData[], total: number): void {
        const videoData = data.map((item) => ({
            ...item,
            iframeUrl: embedUrl(item.url),
            youtubeUrl: item.url,
        }))

        if (props.currentCategory === "All videos") {
            featuredVideo.value = videoData.find((item) => item.isFeatured) || null
            videos.value = videoData.filter((video) => !video.isFeatured)
        } else {
            featuredVideo.value = null
            videos.value = [...videoData]
        }

        totalItems.value = total
    }

    function closeModal(): void {
        videoVisible.value = false
        visibleVideoData.value = {} as VideoData
    }

    function openVideoModal(video: VideoData): void {
        videoVisible.value = true
        visibleVideoData.value = video
    }

    const onPaginationUpdate = (payload: { size: number; page: number }) => {
        if (typeof window === "undefined") return

        if (payload.size === props.itemsPerPage && payload.page === props.page) {
            return
        }

        const newUrl = new URL(window.location.href)
        newUrl.searchParams.set("size", payload.size.toString())
        newUrl.searchParams.set("page", payload.page.toString())

        navigate(newUrl.pathname + newUrl.search)
    }

    watch(
        () => props.tutorialVideo,
        (newVal) => {
            if (newVal?.total !== undefined) {
                setVideos(newVal.results, newVal.total)
                if (typeof window !== "undefined") {
                    window.scrollTo(0, 0)
                }
            }
        },
        { immediate: true },
    )
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section {
        padding: $rem-4 $rem-1;
        position: relative;
        &::after {
            content: "";
            position: absolute;
            height: 12.5rem;
            width: 20%;
            top: 3%;
            left: 10%;
            z-index: 1;
            filter: blur(110px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
            pointer-events: none;
        }
    }

    :deep(.modal-content) {
        background-color: var(--ks-background-secondary);
    }

    .modal-header {
        background-color: var(--ks-background-secondary);
        border-bottom-color: var(--ks-border-secondary);
        padding: 1rem 1rem 0;
        display: flex;
        justify-content: flex-end;
        button {
            background: transparent;
            border: none;
            color: var(--ks-content-primary);
            outline: var(--ks-border-secondary) dotted 1px;
        }
    }

    .modal-body {
        background-color: var(--ks-background-secondary);
        padding: 1rem;
    }

    .nav-tabs {
        border-bottom: 1px solid var(--ks-border-secondary);
    }

    .nav-item {
        .nav-link {
            color: var(--ks-content-primary);
            font-size: $font-size-md;
            font-weight: 400;
            border: none;
            &:focus-visible {
                box-shadow: none;
            }
            &.active {
                color: var(--ks-content-link);
                font-weight: 700;
                background-color: transparent;
                border-bottom: 2px solid var(--ks-content-link);
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

    .content {
        @include media-breakpoint-up(md) {
            margin-right: $rem-1;
        }
        h1 {
            color: var(--ks-content-primary);
            margin-bottom: $rem-1;
        }
        h4 {
            color: var(--ks-content-secondary);
            margin-bottom: 2rem;
        }
    }

    .tutorials-container {
        padding: 2rem 0 1rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        iframe {
            border: 1px solid var(--ks-border-secondary);
            border-radius: calc($spacer * 0.5);
            width: 100%;
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
                    &.category {
                        color: var(--ks-content-link);
                    }
                    &.video-info,
                    &.canal-name {
                        color: var(--ks-content-tertiary);
                    }
                }
                h3.title {
                    font-size: $h3-font-size;
                    font-weight: 400;
                    line-height: calc($spacer * 2.375);
                    color: var(--ks-content-primary);
                    margin: 0;
                }
            }
            @include media-breakpoint-down(lg) {
                max-width: unset;
                .content h3.title {
                    line-height: unset;
                }
            }
        }
    }
</style>