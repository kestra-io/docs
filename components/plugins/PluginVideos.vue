<template>
    <section v-if="videoIds.length" id="see-it-in-action" class="videos">
        <h4 class="videos__title">See it in action</h4>

        <div class="row g-3">
            <div v-for="videoId in videoIds" :key="videoId" class="col-12 col-md-6 col-lg-6 col-xl-4">
                <div class="video-embed">
                    <iframe
                        :src="`https://www.youtube.com/embed/${videoId}`"
                        :title="`Video ${videoId}`"
                        loading="lazy"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<{
        videos?: string[];
    }>(), {
        videos: () => []
    });

    const extractId = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        return match?.[1] ?? null;
    };

    const videoIds = computed(() =>
        props.videos.map(extractId).filter(Boolean) as string[]
    );
</script>


<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .videos {
        .videos__title {
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--ks-content-primary);
        }

        display: block;
        padding: 2rem 0;
        border-top: 1px solid var(--kestra-io-token-color-border-secondary);

        @include media-breakpoint-up(lg) {
            margin: 0 -2rem;
            padding: 2rem;
        }

        .video-embed {
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
            background: $black-1;
            aspect-ratio: 430 / 245;
            position: relative;
            border: 1px solid var(--kestra-io-token-color-border-secondary);

            &::before {
                content: "";
                display: block;
                padding-top: 56.97674418604651%;
            }

            iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 0;
                display: block;
            }
        }
    }
</style>
