<template>
    <div>
        <strong class="title-contribute my-2 text-white">Contribute</strong>
        <nav class="social mt-1">
            <ul>
                <li v-if="editLink !== false && editLink">
                    <a :href="editLink" target="_blank">
                        <Github />
                        Edit this page
                    </a>
                </li>
                <li v-for="link in socialLinks" :key="link.href">
                    <a :href="link.href" target="_blank">
                        <component :is="link.icon" class="icon" />
                        {{ link.text }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue"
    import Slack from "vue-material-design-icons/Slack.vue"
    import Youtube from "vue-material-design-icons/Youtube.vue"
    import Github from "vue-material-design-icons/Github.vue"
    import Linkedin from "vue-material-design-icons/Linkedin.vue"
    import Twitter from "~/components/icons/TwitterXIcon.vue"
    import BlueSky from "~/components/icons/BlueSkyIcon.vue"

    const props = defineProps({
        editLink: {
            type: Boolean,
            default: "",
        },
        editUrl: {
            type: String,
            default: "",
        },
        stem: {
            type: String,
            default: undefined,
        },
        extension: {
            type: String,
            default: undefined,
        },
    })

    const socialLinks = [
        {
            href: "https://kestra.io/slack",
            icon: Slack,
            text: "Join us on Slack",
        },
        {
            href: "https://www.youtube.com/@kestra-io",
            icon: Youtube,
            text: "YouTube",
        },
        {
            href: "https://github.com/kestra-io/kestra",
            icon: Github,
            text: "GitHub",
        },
        {
            href: "https://twitter.com/kestra_io",
            icon: Twitter,
            text: "Twitter",
        },
        {
            href: "https://web-cdn.bsky.app/profile/kestra.io",
            icon: BlueSky,
            text: "BlueSky",
        },
        {
            href: "https://www.linkedin.com/company/kestra",
            icon: Linkedin,
            text: "LinkedIn",
        },
    ]

    const editLink = computed(() => {
        if (props.editUrl) {
            return props.editUrl
        }
        if (!props.stem || !props.extension) {
            return false
        }
        return `https://github.com/kestra-io/docs/edit/main/content/${props.stem}.${props.extension}`
    })
</script>

<style lang="scss" scoped>
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;
    @import "~/assets/styles/variable";

    strong {
        margin-left: calc($spacer * 2);
    }

    nav {
        @include font-size($font-size-xs);
        line-height: 1.188rem;
        ul {
            padding-left: 0;
            margin-bottom: 0;
            list-style: none;
            li {
                .icon, .github-icon {
                    color: var(--ks-content-tertiary);
                }
                a {
                    padding-left: 2.5rem;
                    color: var(--ks-content-secondary) !important;
                    &:hover,
                    &.active {
                        color: var(--ks-content-link);
                        font-weight: 500;
                        border-left: 1px solid var(--ks-content-link);
                    }
                    &::after {
                        display: none !important;
                    }
                }
            }
        }
    }

    .title-contribute {
        color: var(--ks-content-primary) !important;
        font-size: 14px;
        line-height: 1.875rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }

    .social ul li a {
        line-height: 1.5rem;
        font-size: $font-size-sm;
    }

    a {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.125rem 0.75rem;
        color: inherit;
        text-decoration: none;
        color: var(--ks-content-secondary) !important;
        :deep(svg) {
            font-size: 20px;
        }
    }
</style>
