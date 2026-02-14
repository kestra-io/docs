<template>
    <article class="video-responsive" @click="emit('click')">
        <div class="thumbnail">
            <NuxtImg
                class="thumbnail-img"
                :src="thumbnailUrl"
                :alt="video.title"
                loading="lazy"
                densities="1x"
                sizes="sm:100vw md:50vw lg:33vw"
                @error="handleImageError"
            />
            <NuxtImg
                loading="lazy"
                class="youtube-icon"
                src="/landing/tutorial-videos/youtube-icon.svg"
                alt=""
                aria-hidden="true"
            />
        </div>

        <div class="video-content">
            <p class="category">{{ video.category }}</p>
            <h3 class="title">{{ video.title }}</h3>
            <time
                v-if="video.publicationDate"
                class="video-info"
                :datetime="video.publicationDate"
            >
                {{ formattedDate }}
            </time>
            <p class="author">{{ video.author }}</p>
        </div>
    </article>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue"
    import { useYoutube } from "~/utils/useYoutube"

    interface VideoData {
        title: string
        category: string
        thumbnail?: string
        publicationDate?: string
        author: string
        youtubeUrl?: string
        videoId?: string
    }

    const props = defineProps<{
        video: VideoData
    }>()

    const emit = defineEmits<{
        (e: "click"): void
    }>()

    const { getThumbnailUrl, extractVideoId, isValidVideoId } = useYoutube()

    const hasImageFailed = ref(false)
    const DEFAULT_THUMBNAIL = "/logo.png"

    const videoId = computed(() => {
        const urlOrId = props.video.youtubeUrl || props.video.videoId
        if (!urlOrId) return null
        return isValidVideoId(urlOrId) ? urlOrId : extractVideoId(urlOrId)
    })

    const thumbnailUrl = computed(() =>
        hasImageFailed.value || !videoId.value
            ? DEFAULT_THUMBNAIL
            : getThumbnailUrl(videoId.value) || DEFAULT_THUMBNAIL,
    )

    const formattedDate = computed(() => {
        if (!props.video.publicationDate) return ""
        try {
            return new Intl.DateTimeFormat("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).format(new Date(props.video.publicationDate))
        } catch (e) {
            return props.video.publicationDate
        }
    })

    const handleImageError = () => (hasImageFailed.value = true)
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .video-responsive {
        display: flex;
        flex-direction: column;
        gap: calc($spacer * 0.25);
        cursor: pointer;
        .thumbnail {
            position: relative;
            width: 100%;
            aspect-ratio: 16/9;
            overflow: hidden;
            border: 1px solid var(--ks-content-tertiary);
            border-radius: calc($spacer * 0.5);
            background-color: var(--ks-background-secondary);
            &-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                transition: scale 0.3s ease;
            }
            .youtube-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 70px;
                height: auto;
                pointer-events: none;
            }
            &:hover {
                .thumbnail-img {
                    scale: 1.05;
                }
            }
        }
        .video-content {
            display: flex;
            flex-direction: column;
            gap: calc($spacer * 0.125);
            .category {
                margin: 0;
                font-size: $font-size-sm;
                line-height: calc($spacer * 1.375);
                font-weight: 500;
                color: var(--ks-content-link);
                letter-spacing: 0.5px;
            }
            .title {
                margin: 0;
                font-size: $font-size-base;
                font-weight: 600;
                line-height: calc($spacer * 1.5);
                color: var(--ks-content-primary);
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .video-info {
                margin: 0;
                font-size: $font-size-sm;
                color: var(--ks-content-secondary);
                font-weight: 400;
            }
            .author {
                margin: 0;
                font-size: $font-size-sm;
                color: var(--ks-content-tertiary);
                font-weight: 400;
            }
        }
    }
</style>