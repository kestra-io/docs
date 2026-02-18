<template>
    <div class="container-fluid">
        <div class="header-bg" v-if="backgrounds">
            <img
                v-if="backgrounds.left"
                :src="backgrounds.left"
                alt=""
                class="header-bg-left"
            />
            <div class="header-bg-right" v-if="backgrounds.right">
                <img
                    :src="backgrounds.right"
                    alt=""
                    class="d-none d-md-block"
                />
                <img
                    :src="backgrounds.rightMobile"
                    alt=""
                    class="d-md-none"
                />
            </div>
        </div>
        <div class="container">
            <div class="justify-content-center row">
                <div
                    class="row justify-content-center align-items-center flex-column w-100 header-content"
                >
                    <h4 class="text-center header-desc" v-if="badge" data-usal="fade-down">{{ badge }}</h4>
                    <h1 data-usal="fade-right" v-if="title" v-html="title"></h1>
                    <div class="d-flex flex-wrap gap-2 button-group" v-if="button">
                        <a
                            :href="button.href"
                            class="btn btn-animated btn-purple-animated"
                            data-usal="zoomin"
                        >
                            {{ button.text }}
                        </a>
                    </div>
                    <Logos data-usal="fade-up" />
                </div>
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Logos from '~/components/layout/Logos.vue';
    
    const props = defineProps<{
        badge?: string
        title: string
        button?: {
            text: string
            href: string
        }
        backgrounds?: {
            left?: string
            right?: string
            rightMobile?: string
        }
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        color: var(--ks-content-primary);
        padding-top: 5rem;
        padding-right: 0;
        padding-left: 0;
        position: relative;

        .header-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;

            .header-bg-left {
                position: absolute;
                top: 550px;
                left: 0;
                height: 100vh;
                z-index: 0;
                opacity: 0.6;
            }

            .header-bg-right {
                position: absolute;
                top: -6rem;
                right: 0;
                z-index: 0;
                opacity: 0.6;
            }
        }

        .container {
            position: relative;
            z-index: 10;
            .header-content {
                @include media-breakpoint-down(md) {
                    align-items: start !important;
                }
            }
            h1 {
                width: fit-content !important;
            }
            .header-desc {
                color: var(--ks-content-color-highlight);
                margin-bottom: $rem-1;
                text-align: center;
                @include media-breakpoint-down(md) {
                    text-align: start !important;
                }
            }
            .button-group {
                width: fit-content;
            }
            @include media-breakpoint-down(sm) {
                h1,
                h1 > span {
                    font-size: 1.625rem !important;
                    max-width: 100%;
                }
            }
        }
    }
</style>
