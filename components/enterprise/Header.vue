<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="justify-content-between row">
                <div class="col-md-6 align-items-center d-flex order-1 order-md-0">
                    <div>
                        <h1 data-aos="fade-right"><span class="dot">Kestra Enterprise</span> to Scale Your Workflows.</h1>
                        <p data-aos="fade-left" class="baseline">Made for organizations & professionals seeking to secure
                            production workloads with high-security standards and enterprise support.</p>
                        <div class="d-flex flex-wrap gap-2">
                            <NuxtLink href="/demo" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                                Talk to Us
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-aos="zoom-in">
                    <NuxtImg
                        width="569px"
                        height="418px"
                        loading="lazy"
                        format="webp"
                        class="img-fluid"
                        src="/landing/ee/header.svg"
                        alt="A screenshot of the user interface of Kestra's application"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/ee/header-bg.svg") no-repeat 100% 100%;
        color: var(--bs-white);
        padding-top: 5rem;
        background-position: 79% 54%;

        @include media-breakpoint-down(xxl) {
            background-position: 30% 54%;
        }

        @include media-breakpoint-down(lg) {
            background-position: 50% 80%;
        }

        @include media-breakpoint-down(md) {
            background-position: 68% 389%;
            background-size: 307% 107%;
        }

        @include media-breakpoint-down(sm) {
            background-size: auto;
            background-position: 60% 200%;
        }

        .container {
            border-bottom: $block-border;

            h1 {
                font-size: $font-size-4xl;
                font-weight: 300;
                font-family: $font-family-sans-serif;
                max-width: 75%;
            }

            span {
                background: linear-gradient(90deg, #E151F7 0.45%, #5C47F5 43.61%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: $font-size-4xl;
                font-family: $font-family-sans-serif;

                @include media-breakpoint-down(lg) {
                    font-size: 1.625rem !important;
                }
            }

            @include media-breakpoint-down(sm) {
                h1, h1 > span {
                    font-size: 1.625rem !important;
                    max-width: 100%;
                }
            }

        }

        .hero {
            padding-bottom: 5rem;
            padding-top: 0rem;
            @include media-breakpoint-down(md) {
                padding-top: 0;
            }

            .baseline {
                font-weight: 300;
            }
        }

    }
</style>