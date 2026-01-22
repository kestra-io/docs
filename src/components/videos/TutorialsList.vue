<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row content mt-5 mb-2">
                <div class="col-12">
                    <h1 data-usal="fade-left title">Video Tutorials</h1>
                    <h4 data-usal="fade-r" class="fw-normal">
                        Get started with our video tutorials
                    </h4>
                    <ul
                        class="nav nav-tabs mt-3 flex-nowrap overflow-x-auto overflow-y-hidden"
                        id="myTab"
                        role="tablist"
                    >
                        <li
                            v-for="category in categories"
                            :key="category"
                            class="nav-item text-nowrap"
                            role="presentation"
                        >
                            <a
                                class="nav-link"
                                :class="{
                                    active: currentCategory === category,
                                }"
                                id="home-tab"
                                type="button"
                                :href="`/tutorial-videos/${findKeyByValue(tags, category)}`"
                            >
                                {{ category }}
                            </a>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div
                            v-for="category in categories"
                            :key="category"
                            class="tab-pane fade"
                            :class="{
                                'show active': currentCategory === category,
                            }"
                            :id="category"
                            role="tabpanel"
                            :aria-labelledby="`${category}-tab`"
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
                                    <div class="col-12 col-lg-4">
                                        <div class="info-block">
                                            <div class="content">
                                                <p class="category">
                                                    {{ featuredVideo.category }}
                                                </p>
                                                <h3 class="title">
                                                    {{ featuredVideo.title }}
                                                </h3>
                                                <p
                                                    class="video-info"
                                                    v-if="featuredVideo.publicationDate"
                                                >
                                                    {{ getYMD(featuredVideo.publicationDate) }}
                                                </p>
                                                <p class="canal-name">
                                                    {{ featuredVideo.author }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tutorials-list">
                                    <div class="row">
                                        <div
                                            class="col-12 col-md-6 col-lg-4 mb-4"
                                            v-for="video in videos"
                                            :key="video.title"
                                        >
                                            <VideosTutorialVideo
                                                :video="video"
                                                :getYMD="getYMD"
                                                @click="openVideoModal(video)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <slot name="pagination" />
            </div>
        </div>
        <Modal v-model:show="videoVisible">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <button
                            type="button"
                            @click="closeModal"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
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
                </div>
            </div>
        </Modal>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from "vue"
    import { useYoutube } from "~/utils/useYoutube"
    import Modal from "~/components/common/Modal.vue"
    import VideosTutorialVideo from "~/components/videos/TutorialVideo.vue"

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
    const totalPages = ref(0)

    const categories = [
        "All videos",
        "Deep Dive Tutorials",
        "Quick Start Tutorials",
        "Feature Highlight",
    ] as const

    export type CategoryName = (typeof categories)[number]

    const tags = new Map([
        ["all", "All videos"],
        ["deep-dive", "Deep Dive Tutorials"],
        ["quick-start", "Quick Start Tutorials"],
        ["feature-highlight", "Feature Highlight"],
    ])

    function getYMD(dateString: string): string {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date)
    }

    const emit = defineEmits<{
        (e: "update:currentCategory", value: string): void
    }>()

    function embedUrl(url: string): string {
        const videoId = extractVideoId(url)
        return videoId ? `https://www.youtube.com/embed/${videoId}` : ""
    }

    function findKeyByValue(map: Map<string, string>, value: string): string | undefined {
        for (const [key, val] of map.entries()) {
            if (val === value) return key
        }
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

        totalPages.value = Math.ceil(total / props.itemsPerPage)
    }

    function closeModal(): void {
        videoVisible.value = false
        visibleVideoData.value = {} as VideoData
    }

    function openVideoModal(video: VideoData): void {
        videoVisible.value = true
        visibleVideoData.value = video
    }

    watch(
        () => props.tutorialVideo,
        (newVal) => {
            if (newVal?.total) {
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

    .modal-header {
        background-color: $black-2;
        border-bottom-color: $black-2;
        padding: 1rem;
        padding-bottom: 0;
        padding-top: 5px;
        display: flex;
        justify-content: flex-end;
        button {
            background: transparent;
            border: none;
            color: $white;
            outline: $black-5 dotted 1px;
        }
    }

    .modal-body {
        background-color: $black-2;
        padding: 1rem;
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
            &:hover,
            &:focus {
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

            &,
            &:hover,
            &:focus {
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
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
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