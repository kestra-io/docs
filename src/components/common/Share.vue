<template>
    <div class="section">
        <h6 class="title">{{ props.titleText }}</h6>
        <div class="share">
            <a :href="shareX" target="_blank" aria-label="Share on X">
                <TwitterXIcon class="icon" />
            </a>
            <a :href="shareLinkedin" target="_blank" aria-label="Share on LinkedIn">
                <LinkedIn class="icon" />
            </a>
            <a :href="shareBluesky" target="_blank" aria-label="Share on BlueSky">
                <BlueSkyIcon class="icon" />
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import LinkedIn from "vue-material-design-icons/Linkedin.vue"
    import TwitterXIcon from "~/components/icons/TwitterXIcon.vue"
    import BlueSkyIcon from "~/components/icons/BlueSkyIcon.vue"

    const props = defineProps<{
        title: string
        url: string
        titleText: string
    }>()

    const shareX = computed(() => {
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title)}&url=${encodeURIComponent(props.url)}`
    })

    const shareLinkedin = computed(() => {
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(props.url)}&title=${encodeURIComponent(props.title)}&summary=${encodeURIComponent(props.title)}`
    })

    const shareBluesky = computed(() => {
        return `https://bsky.app/intent/compose?text=${encodeURIComponent(props.title + " " + props.url)}`
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .section {
        .title {
            color: var(--ks-content-primary);
            margin-bottom: 1rem;
        }
    }

    .share {
        display: flex;
        gap: 1rem;
        align-items: center;

        a {
            color: var(--ks-content-tertiary);
            transition: color 0.2s ease;
            display: flex;
            align-items: center;

            &:hover {
                color: var(--ks-content-link);
            }

            .icon {
                font-size: 1.25rem;
            }
        }
    }
</style>
