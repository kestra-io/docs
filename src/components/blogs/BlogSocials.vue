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

        <Share
            :title="post.title"
            :url="post.url"
            title-text="Share this news"
        />
    </div>
</template>

<script setup lang="ts">
    import Github from "vue-material-design-icons/Github.vue"
    import Slack from "vue-material-design-icons/Slack.vue"
    import Share from "~/components/common/Share.vue"

    interface Post {
        title: string
        url: string
        editUrl?: string
    }

    defineProps<{
        post: Post
    }>()
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
</style>
