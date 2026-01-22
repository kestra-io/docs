<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6 align-items-center d-flex order-1 order-md-0">
                    <div>
                        <h1 data-usal="fade-r">
                            <span>Declarative</span> Orchestration with Kestra
                        </h1>
                        <p class="baseline" data-usal="fade-l">
                            Bring Infrastructure as Code Best Practices to All Workflows
                        </p>
                        <div class="cta d-flex gap-3">
                            <a
                                href="/docs/quickstart#start-kestra"
                                class="btn btn-animated btn-dark-animated"
                                data-usal="zoomin"
                            >
                                Get Started
                            </a>
                            <a
                                href="/demo"
                                class="btn btn-animated btn-purple-animated"
                                data-usal="zoomin"
                            >
                                Talk to us
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-usal="zoomin">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="806px"
                        height="601px"
                        class="zoom img-fluid"
                        src="/landing/features/declarative/header.svg"
                        alt="A screenshot of the user interface of Kestra's application"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        background: url("/landing/features/declarative/header-bg.svg") no-repeat;
        background-size: cover;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
        .container {
            border-bottom: $block-border;

            h1 {
                color: $white;
                @include media-breakpoint-up(xl) {
                    font-size: $font-size-4xl;
                }
                font-weight: 400;
                padding-bottom: 0;
                margin-bottom: 16px;

                span {
                    background: linear-gradient(90deg, #e151f7 2.16%, #5c47f5 65.09%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            p {
                color: $white;
                font-size: $font-size-xl;
                font-weight: 300;
                margin-bottom: 2rem;
                padding-bottom: 0;
            }

            .btn-dark {
                border: 1px solid $black-6;
            }
        }

        .hero {
            padding-bottom: 0rem;
            @include media-breakpoint-down(md) {
                padding-top: 0;
            }
        }
    }
</style>