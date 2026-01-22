<template>
    <article class="video-responsive">
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
            <time v-if="video.publicationDate" class="video-info" :datetime="video.publicationDate">
                {{ getYMD(video.publicationDate) }}
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

    interface Props {
        video: VideoData
        getYMD: (date: string) => string
    }

    const props = defineProps<Props>()

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
            border: 1px solid $black-6;
            border-radius: calc($spacer * 0.5);
            position: relative;
            overflow: hidden;
            aspect-ratio: 16/9;
            width: 100%;
            background-color: $black-2;

            .thumbnail-img {
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

            &:hover .thumbnail-img {
                scale: 1.05;
            }
        }

        .video-content {
            display: flex;
            flex-direction: column;
            gap: calc($spacer * 0.125);
        }

        .category {
            margin: 0;
            font-size: $font-size-sm;
            line-height: calc($spacer * 1.375);
            font-weight: 500;
            color: $purple-36;
            letter-spacing: 0.5px;
        }

        .title {
            font-size: $font-size-base;
            font-weight: 600;
            line-height: calc($spacer * 1.5);
            color: $white;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .video-info {
            margin: 0;
            font-size: $font-size-sm;
            color: $white-3;
            font-weight: 400;
        }

        .author {
            margin: 0;
            font-size: $font-size-sm;
            color: $black-8;
            font-weight: 400;
        }
    }
</style>