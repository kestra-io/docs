<template>
    <div class="container-fluid container">
        <div class="hero hero-sm mx-2 sm-mx-0">
            <div class="row" data-aos="fade-right">
                <div class="col-12 col-md-8 col-lg-6 order-1 order-md-0">
                    <h1 data-aos="fade-right"><span class="dot">Kestra Enterprise</span> to Scale Your Workflows.</h1>
                    <p data-aos="fade-left" class="baseline">Designed for production workloads with high-security standards and Enterprise-grade governance.</p>
                    <div class="d-flex flex-wrap gap-2">
                        <NuxtLink href="https://kestra.io/demo" target="_blank" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                            Talk to Us
                        </NuxtLink>
                    </div>
                </div>
                <div class="order-0 order-md-1 d-flex d-md-none">
                    <img class="img-container img-fluid" src="/landing/ee/background.svg" alt="Illustration of Kestra's logo with a dark background" data-aos="zoom-in"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        color: var(--bs-white);
        background: url("/landing/ee/bg.svg") no-repeat 32% 63%;
        background-size: 127% 181% !important;
        border-bottom: 1px solid #252526;

        @include media-breakpoint-down(md) {
            background-image: none !important;
        }

        h1, .subtitle {
            margin: 0;
            padding: 0;
        }

        h1 {
            font-size: $font-size-4xl;
            font-weight: 300;
            font-family: $font-family-sans-serif;
        }

        span {
            background: linear-gradient(90deg, #E151F7 0.45%, #5C47F5 43.61%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: $font-size-4xl;
            letter-spacing: calc($spacer * -0.188);
            @include media-breakpoint-down(lg) {
                font-size: 1.625rem !important;
            }
        }

        @include media-breakpoint-down(sm) {
            h1, h1 > span {
                font-size: 1.625rem !important;
            }
        }
        .subtitle {
            font-size: 1.875rem;
            font-weight: 100;
        }

        .description {
            font-size: $font-size-xl;
            font-weight: 300;
        }

        .img-container {
            position: relative;
            transform: scale(1.3);
            margin-bottom: 50px;
            left: 20px;
            transform-origin: 40% 30%;
        }

        .hero{
            padding-bottom: 5rem;

            .baseline {
                font-weight: 300;
                @include media-breakpoint-down(lg) {
                   font-size: $font-size-base;
                }
            }

            @include media-breakpoint-down(md) {
                padding-top: 0;
            }
        }
    }
</style>