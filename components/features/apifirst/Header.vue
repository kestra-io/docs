<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-md-5 align-items-center d-flex order-1 order-md-0">
                    <div>
                        <h1 data-aos="fade-right">API-First Design</h1>
                        <p class="baseline" data-aos="fade-left">
                            Kestra is designed in an API-first way, enabling programmatic access to all actions from managing workflows to user administration.
                        </p>
                        <div class="cta d-flex gap-3">
                            <NuxtLink href="https://kestra.io/docs/getting-started/quickstart#start-kestra" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                                Get started
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-aos="zoom-in">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="865px"
                        height="639px"
                        class="zoom img-fluid"
                        src="/landing/features/apifirst/header.svg"
                        alt="A screenshot of the user interface of Kestra's application"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/features/language/header-bg.svg") no-repeat;
        background-size: cover;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
        .container {
            border-bottom: $block-border;
            padding-top: calc($spacer * 4.125);
            padding-bottom: calc($spacer * 4.125);

            h1 {
                color: $white;
                font-size: $font-size-4xl;
                font-weight: 300;
                padding-bottom: 0;
                margin-bottom: 16px;

                span {
                    background: linear-gradient(90deg, #E151F7 2.16%, #5C47F5 65.09%);
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

        .hero{
            padding-bottom: 0rem;
            @include media-breakpoint-down(md) {
                padding-top: 0;
            }
        }

    }
</style>

