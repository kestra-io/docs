<template>
    <div class="content">
        <div class="tab-content">
            <div class="tutorials-container" role="tabpanel">
                <div v-if="featuredVideo" class="row">
                    <div>
                        <iframe
                            width="764"
                            height="424"
                            :src="featuredVideo.iframeUrl"
                            :title="featuredVideo.title"
                            frameborder="0"
                            allow="
                                accelerometer;
                                autoplay;
                                clipboard-write;
                                encrypted-media;
                                gyroscope;
                                picture-in-picture;
                                web-share;
                            "
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                        />
                    </div>
                    <div>
                        <div class="info-block">
                            <div class="content">
                                <p class="category">
                                    {{ featuredVideo.category }}
                                </p>
                                <h3 class="title">{{ featuredVideo.title }}</h3>
                                <p
                                    v-if="featuredVideo.publicationDate"
                                    class="video-info"
                                >
                                    {{
                                        formatDate(
                                            featuredVideo.publicationDate,
                                        )
                                    }}
                                </p>
                                <p class="canal-name">
                                    {{ featuredVideo.author }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tutorials-list">
                    <div v-for="video in paginatedVideos" :key="video.title">
                        <VideosTutorialVideo
                            :video="video"
                            @click="openVideoModal(video)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <PaginationContainer
            :current-url="currentLocationHref ?? 'https://example.com'"
            :total-items="tutorialVideo?.total ?? 0"
            :show-total="false"
            @update="onPaginationUpdate"
        />
    </div>

    <Modal v-model:show="videoVisible" class="video-modal">
        <div class="modal-header">
            <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="closeModal"
            >
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
                    allow="
                        accelerometer;
                        autoplay;
                        clipboard-write;
                        encrypted-media;
                        gyroscope;
                        picture-in-picture;
                        web-share;
                    "
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen
                />
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from "vue"
    import { useYoutube } from "~/utils/useYoutube"
    import Modal from "~/components/common/Modal.vue"
    import VideosTutorialVideo from "~/components/videos/TutorialVideo.vue"
    import PaginationContainer from "~/components/common/PaginationContainer.vue"

    const currentLocationHref = ref(
        typeof window !== "undefined" ? window.location.href : undefined,
    )

    const urlObject = computed(() => {
        return currentLocationHref.value
            ? new URL(currentLocationHref.value)
            : ({} as URL)
    })

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
            categories: Map<string, string>
            currentCategory?: string
            tutorialVideo?: TutorialVideoResponse
        }>(),
        {
            currentCategory: "All videos",
            tutorialVideo: undefined,
        },
    )

    const { extractVideoId } = useYoutube()

    const featuredVideo = ref<VideoData | null>(null)
    const videoVisible = ref(false)
    const visibleVideoData = ref<VideoData>({} as VideoData)

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

    function closeModal(): void {
        videoVisible.value = false
        visibleVideoData.value = {} as VideoData
    }

    function openVideoModal(video: VideoData): void {
        videoVisible.value = true
        visibleVideoData.value = video
    }

    function onPaginationUpdate(payload: { size: number; page: number }) {
        if (
            payload.page === currentPage.value &&
            payload.size === itemsPerPage.value
        ) {
            return
        }

        // force calculation of browserLocation to take new page into account
        // force calculation of browserLocation to take new page into account
        const newUrl = new URL(
            currentLocationHref.value ?? "https://example.com",
        )

        newUrl.searchParams.set("page", payload.page.toString())
        newUrl.searchParams.set("size", payload.size.toString())
        currentLocationHref.value = newUrl.href
        window.scrollTo(0, 0)
    }

    const itemsPerPage = computed(() => {
        const sizeParam = urlObject.value.searchParams?.get("size")
        return sizeParam ? parseInt(sizeParam) : 24
    })

    const currentPage = computed(() => {
        const pageParam = urlObject.value.searchParams?.get("page")
        return pageParam ? parseInt(pageParam) : 1
    })

    const paginatedVideos = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value
        return props.tutorialVideo?.results
            .slice(start, start + itemsPerPage.value)
            .map((item) => ({
                ...item,
                iframeUrl: embedUrl(item.url),
                youtubeUrl: item.url,
            }))
    })

    watch(
        () => props.tutorialVideo,
        (newVal) => {
            if (newVal?.total !== undefined) {
                if (typeof window !== "undefined") {
                    window.scrollTo(0, 0)
                }
            }
        },
        { immediate: true },
    )
</script>

<style lang="scss" scoped>
    section {
        position: relative;
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

    .content {
        @include media-breakpoint-up(md) {
            margin-right: $rem-1;
        }
    }

    .tab-content {
        margin: 0;
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

        .tutorials-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            row-gap: 3rem;
            column-gap: 1.5rem;
        }
    }
</style>
