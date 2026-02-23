<template>
    <section class="section">
        <h2>Video Tutorials</h2>

        <div class="grid">
            <div
                v-for="video in videos"
                :key="video.url"
                class="card"
                @click="openModal(video.youtubeUrl || video.url)"
            >
                <div class="img">
                    <img
                        :src="getThumbnailUrl(video.youtubeUrl || video.url) || '/logo.png'"
                        :alt="video.title"
                    />
                    <img
                        class="play-icon"
                        src="/landing/tutorial-videos/youtube-icon.svg"
                        alt="Play"
                    />
                </div>
                <div class="content">
                    <small class="meta">
                        {{ video.category }} •
                        {{ formatDate(video.publicationDate) }} • {{ video.author }}
                    </small>
                    <h6 class="title">{{ video.title }}</h6>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-end">
            <Link href="/tutorial-videos" text="More videos" />
        </div>

        <div
            v-if="modalOpen"
            class="modal open"
            aria-hidden="false"
            @click.self="closeModal"
        >
            <div class="modal-overlay" @click="closeModal"></div>
            <div class="modal-content">
                <button
                    class="close-modal"
                    aria-label="Close modal"
                    @click="closeModal"
                >
                    ×
                </button>
                <div class="video-container">
                    <iframe
                        :src="currentVideoUrl"
                        title="Video Player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from "vue"
    import Link from "~/components/common/Link.vue"
    import { useYoutube } from "~/utils/useYoutube"

    const props = defineProps<{
        videos: any[]
    }>()

    const modalOpen = ref(false)
    const currentVideoUrl = ref("")
    const { getThumbnailUrl, extractVideoId } = useYoutube()

    const getEmbedUrl = (url: string) => {
        const videoId = extractVideoId(url)
        return videoId
            ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
            : ""
    }

    const formatDate = (date: any) =>
        new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        })
            .format(new Date(date))
            .replace(",", "")

    const openModal = (url: string) => {
        const embedUrl = getEmbedUrl(url)
        if (embedUrl) {
            currentVideoUrl.value = embedUrl
            modalOpen.value = true
            document.body.style.overflow = "hidden"
        }
    }

    const closeModal = () => {
        modalOpen.value = false
        currentVideoUrl.value = ""
        document.body.style.overflow = ""
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && modalOpen.value) {
            closeModal()
        }
    }

    onMounted(() => {
        document.addEventListener("keydown", handleKeydown)
    })

    onUnmounted(() => {
        document.removeEventListener("keydown", handleKeydown)
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .section {
        display: flex;
        flex-direction: column;
        gap: $rem-2;
        padding: $rem-2 0;

        h2 {
            color: var(--ks-content-primary);
            margin: 0;
        }

        .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;

            @include media-breakpoint-up(md) {
                grid-template-columns: repeat(2, 1fr);
            }

            @include media-breakpoint-up(xl) {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        :deep(.link) {
            color: var(--ks-content-link);
        }

        .card {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            cursor: pointer;
            border: none !important;
            background-color: transparent;

            .img {
                width: 100%;
                aspect-ratio: 16/9;
                border: $block-border;
                border-radius: 8px;
                overflow: hidden;
                position: relative;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .play-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50px;
                    height: auto;
                    opacity: 0.9;
                    transition: opacity 0.3s ease;
                }
            }

            &:hover .img {
                img:not(.play-icon) {
                    transform: scale(1.05);
                }

                .play-icon {
                    opacity: 1;
                }
            }

            .content {
                display: flex;
                flex-direction: column;

                .meta {
                    color: var(--ks-content-tertiary);
                    font-size: $font-size-xs;
                    margin-bottom: 0.25rem;
                }

                .title {
                    color: var(--ks-content-primary);
                    margin: 0;
                    transition: color 0.3s ease;
                }
            }
        }
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;

        &.open {
            opacity: 1;
            pointer-events: auto;
        }

        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
        }

        .modal-content {
            position: relative;
            width: 90%;
            max-width: 900px;
            background: var(--ks-background-secondary);
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 1001;

            .close-modal {
                position: absolute;
                top: -40px;
                right: -10px;
                background: none;
                border: none;
                color: $white;
                font-size: 2rem;
                cursor: pointer;
                line-height: 1;

                @include media-breakpoint-up(md) {
                    top: -40px;
                    right: -40px;
                }
            }
        }
    }
</style>
