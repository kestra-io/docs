<template>
    <div class="container-fluid bg-dark-4">
        <div class="hero hero-sm container">
            <div class="row">
                <div class="col-lg-6 align-items-center d-flex order-1 order-lg-0">
                    <div>
                        <h1 data-usal="fade-r" v-if="titleHtml" v-html="titleHtml" />
                        <p data-usal="fade-l" class="baseline">
                            {{ description }}
                        </p>
                        <div class="cta d-flex gap-3 flex-wrap">
                            <a
                                href="/demo"
                                class="btn btn-animated btn-dark-animated"
                                data-usal="zoomin"
                            >
                                Talk to Us
                            </a>
                            <a
                                href="/docs/getting-started/quickstart"
                                class="btn btn-animated btn-purple-animated"
                                data-usal="zoomin"
                            >
                                Get started
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 order-0 order-lg-1">
                    <img :src="imageSrc" :alt="imageAlt" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            titleHtml: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            imageSrc: {
                type: String,
                required: true,
            },
            imageAlt: {
                type: String,
                required: true,
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        background: url("/landing/usecases/cicd/bg.svg") no-repeat center;
        background-size: 100% 100%;
        padding-top: 80px;
        margin-top: -80px;
        position: relative;
        overflow: hidden;

        &::after {
            content: "";
            position: absolute;
            height: 20rem;
            width: 40%;
            bottom: 2%;
            left: 30%;
            z-index: 0;
            filter: blur(100px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
        }

        h1,
        p {
            color: $white;
            font-family: $font-family-sans-serif;
            font-weight: 300;
            padding-bottom: 0;
        }

        h1 {
            font-size: $font-size-4xl;
            margin-bottom: 16px;
            font-weight: 500;

            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
            }

            :deep(span) {
                background: linear-gradient(90deg, #e151f7 65.38%, #5c47f5 82.43%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        p {
            font-size: $font-size-xl;

            @include media-breakpoint-down(sm) {
                font-size: $h6-font-size;
            }
        }

        img {
            width: 100%;
        }

        :deep(.hero.hero-sm) {
            border-bottom: 1px solid #ffffff1a;
            position: relative;
            z-index: 2;
        }
    }

    .red.container-fluid {
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
    }
</style>