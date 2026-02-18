<template>
    <div class="socials">
        <div class="section">
            <h6 class="title">Contribute</h6>
            <ul class="list">
                <li v-if="post.editUrl">
                    <a :href="post.editUrl" target="_blank">
                        <Github class="icon" />
                        Edit this page
                    </a>
                </li>
                <li>
                    <a href="https://kestra.io/slack" target="_blank">
                        <Slack class="icon" />
                        Join us on slack
                    </a>
                </li>
                <li>
                    <a href="https://github.com/kestra-io/kestra" target="_blank">
                        <Github class="icon" />
                        GitHub
                    </a>
                </li>
            </ul>
        </div>

        <div class="section">
            <h6 class="title">Share this news</h6>
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
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import Github from "vue-material-design-icons/Github.vue"
    import Slack from "vue-material-design-icons/Slack.vue"
    import LinkedIn from "vue-material-design-icons/Linkedin.vue"
    import TwitterXIcon from "~/components/icons/TwitterXIcon.vue"
    import BlueSkyIcon from "~/components/icons/BlueSkyIcon.vue"

    interface Post {
        title: string
        url: string
        editUrl?: string
    }

    const props = defineProps<{
        post: Post
    }>()

    const shareX = computed(() => {
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.post.title)}&url=${encodeURIComponent(props.post.url)}`
    })

    const shareLinkedin = computed(() => {
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(props.post.url)}&title=${encodeURIComponent(props.post.title)}&summary=${encodeURIComponent(props.post.title)}`
    })

    const shareBluesky = computed(() => {
        return `https://bsky.app/intent/compose?text=${encodeURIComponent(props.post.title + " " + props.post.url)}`
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .socials {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .section {
        .title {
            color: var(--ks-content-primary);
            margin-bottom: 1rem;
        }
    }

    .list {
        list-style: none;
        padding-left: 0;
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        li {
            a {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--ks-content-secondary);
                text-decoration: none;
                font-size: $font-size-sm;
                transition: color 0.2s ease;

                &:hover {
                    color: var(--ks-content-link);
                }

                .icon {
                    font-size: 1.25rem;
                    color: var(--ks-content-tertiary);
                    margin-top: -5px;
                }
            }
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
