<template>
    <section class="layout-wrapper">
        <div class="container">
            <div class="left">
                <div class="content" :class="{ 'no-style': props.noSidebarStyle }">
                    <slot name="sidebar" />
                </div>
                <div v-if="props.socials" class="socials">
                    <div class="social-links">
                        <a v-for="link in SOCIALS" :key="link.href" :href="link.href" target="_blank">
                            <component :is="link.icon" />
                        </a>
                    </div>
                </div>
            </div>
            <div class="right">
                <slot />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import Twitter from "~/components/icons/TwitterXIcon.vue"
    import Linkedin from "vue-material-design-icons/Linkedin.vue"
    import BlueSky from "~/components/icons/BlueSkyIcon.vue"

    interface Props {
        socials?: boolean
        noSidebarStyle?: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        socials: true,
        noSidebarStyle: false,
    })

    const SOCIALS = [
        {
            href: "https://twitter.com/kestra_io",
            icon: Twitter,
        },
        {
            href: "https://www.linkedin.com/company/kestra",
            icon: Linkedin,
        },
        {
            href: "https://web-cdn.bsky.app/profile/kestra.io",
            icon: BlueSky,
        },
    ]
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .layout-wrapper {
        padding: $rem-4 0;
        @include media-breakpoint-down(xl) {
            padding: $rem-2 $rem-1;
        }
        .container {
            display: flex;
            gap: 4rem;
            padding: 0;
            max-width: 1180px;
            @include media-breakpoint-between(lg, xl) {
                gap: 2rem;
                padding: 0;
                :deep(.btn-gradient) {
                    padding: 8px 12px;
                    font-size: 15px;
                }
            }
            @include media-breakpoint-down(lg) {
                flex-direction: column;
                gap: 0;
                align-items: center;
            }
        }
    }

    .left {
        @include media-breakpoint-up(lg) {
            min-width: 315px;
            width: 315px;
            flex: 0 0 315px;
        }
        width: 100%;
        height: fit-content;
        position: static;
        margin-bottom: 3rem;
        @media (min-width: 992px) {
            position: sticky;
            top: 100px;
        }

        .content {
            border-radius: 0.5rem;
            border: $block-border;
            padding: 2rem;
            background: var(--ks-background-body);
            width: 100%;

            &.no-style {
                border: none;
                padding: 0;
                background: transparent;
                border-radius: 0;
            }
        }

        .socials {
            margin-top: 0.75rem;
            align-self: flex-start;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            .social-links {
                display: flex;
                gap: 0.625rem;
                a {
                    color: var(--ks-content-tertiary);
                    font-size: 1rem;
                    &:hover {
                        color: var(--ks-content-link);
                    }
                }
            }
        }
    }

    .right {
        height: fit-content;
        width: 100%;
    }
</style>
