<template>
    <div class="container-fluid bg-dark-4">
        <div class="hero hero-sm container">
            <div class="row">
                <div class="col-lg-6 align-items-center d-flex order-1 order-lg-0">
                    <div>
                        <h1 data-aos="fade-right"><span v-if="titleBefore">{{ titleBefore }}</span> {{ title }} <span v-if="titleAfter">{{ titleAfter }}</span></h1>
                        <p data-aos="fade-left" class="baseline">{{ subtitle }}</p>
                        <NuxtLink href="/docs/getting-started/quickstart#start-kestra" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                            Get started
                        </NuxtLink>
                    </div>
                </div>
                <div class="col-lg-6 order-0 order-lg-1">
                    <NuxtImg
                        :width="imageWidth"
                        loading="lazy"
                        format="webp"
                        class="mt-md-0"
                        data-aos="zoom-in"
                        :src="image"
                        :alt="title"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: true,
            },
            titleBefore: {
                type: String,
                required: true,
            },
            titleAfter: {
                type: String,
                required: true,
            },
            subtitle: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            imageWidth: {
              type: String,
              required: true,
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/usecases/cicd/bg.svg") no-repeat center;
        background-size: 100% 100%;
        padding-top: 80px;
        margin-top: -80px;
        padding-bottom: $spacer;

        h1, p {
            color: $white;
            font-family: $font-family-sans-serif;
            font-weight: 300;
            padding-bottom: 0;
        }

        h1 {
            font-size: $font-size-4xl;
            margin-bottom: 16px;

            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
            }

            span {
                background: linear-gradient(90deg, #E151F7 65.38%, #5C47F5 82.43%);
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

        @include media-breakpoint-down(lg) {
            .hero-sm {
                padding: 0 !important;
            }
        }
    }
</style>
