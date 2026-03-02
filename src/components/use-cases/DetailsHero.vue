<template>
    <section class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 align-items-center d-flex order-1 order-lg-0">
                    <div>
                        <h1 data-usal="fade-r" v-if="title" v-html="title" />
                        <p data-usal="fade-l" class="baseline">
                            {{ description }}
                        </p>
                        <div class="cta d-flex gap-3 flex-wrap">
                            <a
                                v-if="actions.dark.text"
                                :href="actions.dark.href"
                                :target="actions.dark.target"
                                class="btn btn-animated btn-dark-animated"
                                data-usal="zoomin"
                            >
                                {{ actions.dark.text }}
                            </a>
                            <a
                                v-if="actions.purple.text"
                                :href="actions.purple.href"
                                :target="actions.purple.target"
                                class="btn btn-animated btn-purple-animated"
                                data-usal="zoomin"
                            >
                                {{ actions.purple.text }}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 order-0 order-lg-1" :class="image.class">
                    <img
                        :src="image.src"
                        :alt="image.alt"
                        :width="image.width"
                        :height="image.height"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            image: {
                type: Object,
                required: true,
                default: () => ({
                    src: "",
                    alt: "",
                    width: undefined,
                    height: undefined,
                    class: "",
                }),
            },
            actions: {
                type: Object,
                default: () => ({
                    dark: {
                        text: "Talk to Us",
                        href: "/demo",
                        target: "_self",
                    },
                    purple: {
                        text: "Get started",
                        href: "/docs/getting-started/quickstart",
                        target: "_self",
                    },
                }),
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        background: url("/landing/usecases/cicd/bg.svg") no-repeat center;
        background-size: 100% 100%;
        padding: calc($spacer * 3) $spacer;
        position: relative;
        overflow: hidden;
        border-bottom: $block-border;
        &::after {
            content: "";
            position: absolute;
            height: 20rem;
            width: 40%;
            bottom: 2%;
            left: 30%;
            z-index: -1;
            filter: blur(140px);
            background: linear-gradient(180deg, #6218ff00, #6117ff);
        }
        h1 {
            color: var(--ks-content-primary);
            margin-bottom: 16px;
            font-size: calc($font-size-2xl * 1.65);
            @include media-breakpoint-down(lg) {
                font-size: $font-size-2xl;
            }
        }
        p {
            color: var(--ks-content-secondary);
            @include media-breakpoint-up(lg) {
                font-size: $font-size-lg;
            }
        }
        img {
            max-width: 100%;
            height: auto;
        }
        &.red {
            &::after {
                background: linear-gradient(180deg, #fd727800 11.24%, #e3262f 72.98%) !important;
            }
            h1 {
                :deep(span) {
                    background: linear-gradient(90.03deg, #e3262f 57.94%, #ab0009 87.71%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
            .btn-purple-animated {
                &::before {
                    background: conic-gradient(
                        #fb1010,
                        #ff97af 10%,
                        #db2727,
                        transparent 50%,
                        #ec1010
                    ) !important;
                }
                &::after {
                    background: #ab0009;
                }
                &:hover {
                    box-shadow:
                        1px 2px 4px 0px rgba(146, 32, 32, 0.29),
                        3px 6px 7px 0px rgba(146, 18, 16, 0.26),
                        7px 14px 10px 0px rgba(216, 39, 25, 0.15),
                        13px 25px 11px 0px rgba(216, 31, 55, 0.04),
                        20px 40px 12px 0px rgba(101, 24, 216, 0.01);
                    &::after {
                        background: #ab0009;
                    }
                }
            }
            .btn-dark-animated {
                &::before {
                    background: conic-gradient(
                        #fb1010,
                        #ff97af 10%,
                        #db2727,
                        transparent 50%,
                        #ec1010
                    ) !important;
                }
                &:hover {
                    box-shadow:
                        1px 2px 2px 0px rgba(146, 32, 32, 0.29),
                        3px 6px 7px 0px rgba(146, 18, 16, 0.26),
                        7px 14px 10px 0px rgba(216, 39, 25, 0.15),
                        13px 25px 11px 0px rgba(149, 20, 20, 0.13),
                        20px 40px 12px 0px rgba(101, 24, 216, 0.01);
                    &::after {
                        background: #771212;
                    }
                }
            }
            :deep(.image-retail) {
                margin-top: -176px;
            }
            :deep(.image-community) {
                margin-top: -80px;
            }
            @include media-breakpoint-down(lg) {
                :deep(.image-retail),
                :deep(.image-community) {
                    margin-top: 0;
                }
            }
        }
    }
</style>