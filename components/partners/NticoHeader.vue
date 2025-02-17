<template>
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="mb-5 pb-5 row align-items-center">
                <div class="col-lg-5 align-items-center d-flex order-1 order-lg-0">
                    <div>
                        <NuxtImg
                            height="56"
                            loading="lazy"
                            format="webp"
                            :src="logo"
                            :alt="logo"
                        />
                        <h1>Ntico & Kestra: Your Partner for Data Orchestration and ETL Solutions</h1>
                        <p class="text-white baseline fs-4">The Ntico team is ready to support you in your data orchestration and ETL projects with Kestra.</p>
                        <div class="cta">
                            <NuxtLink
                                href="/demo"
                                class="btn text-white btn-animated btn-purple-animated mt-2"
                            >
                                get a demo
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="col-lg-7 order-0 order-lg-1">
                    <img
                        class="hero-image"
                        src="/partners/ntico/hero-img.svg"
                    />
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <Section
                subtitle="Join the community"
            >
                <div class="metrics">
                    <div class="counter-box">
                        <img src="/partners/ntico/logo.svg" alt="">
                    </div>
                    <div class="counter-box">
                        <h6>Kestra Expertise</h6>
                        <p>Data Orchestration </p>
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box">
                        <h6>Headquarters</h6>
                        <p>Villeneuve d'Ascq, France</p>
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box">
                        <h6>Solution</h6>
                        <p>Ntico is a Digital Services Company that supports you in digital transformation</p>
                    </div>
                </div>
            </Section>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/usecases/cicd/bg.svg") no-repeat center;
        background-size: 100% 100%;
        padding-top: 80px;
        margin-top: -80px;
        position: relative;
        overflow: hidden;

        &::after ,
        &::before {
            content: "";
            position: absolute;
            z-index: -147;
            filter: blur(100px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
        }

        &::after {
            height: 34rem;
            width: 80%;
            bottom: -28%;
            left: 9%;
        }

        &::before {
            height: 36rem;
            width: 39rem;
            bottom: 25%;
            left: 51%;
        }

        @include media-breakpoint-down(lg) {
            &::before {
                width: 80%;
                bottom: 45%;
                left: 10%;
            }
        }

        h1, p {
            color: $white;
            font-family: $font-family-sans-serif;
            font-weight: 300;
            padding-bottom: 0;
        }

        h1 {
            font-size: $font-size-3xl;
            margin-bottom: 16px;
            font-weight: 500;

            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
            }

            :deep(span) {
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

        .hero-image {
            width: 100%;
            border-radius: calc($spacer * 0.25);
        }

        :deep(.hero.hero-sm) {
            border-bottom: 1px solid #FFFFFF1A;
        }
    }

    .container {
        position: relative;
        :deep(section) {
            padding: 2rem 0;
            border-radius: 8px;
            background: #161617;
            border: 1px solid #3D3D3F;
            position: absolute;
            width: 100%;
            top: -5.5rem;
            .subtitle {
                font-weight: 400;
                font-size: $font-size-sm;
            }
            .main {
                background-color: $black-2 !important;
            }
        }
        .metrics {
            padding-left: calc($spacer * 2);
            padding-right: calc($spacer * 2);
            margin: 0 auto;
            display: flex;
            justify-content: space-around;
            flex-flow: row wrap;

            @include media-breakpoint-down(lg) {
                flex-direction: column;
                gap: 1rem;
            }

            .line-separator {
                width: calc($spacer * 0.063);
                background-color: #242427;
                @include media-breakpoint-down(lg) {
                    width: 100%;
                    height: calc($spacer * 0.063);
                }
            }

            .counter-box {
                font-family: $font-family-sans-serif;
                font-style: normal;
                max-width: 20%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                @include media-breakpoint-down(lg) {
                    max-width: 100%;
                }
                @include media-breakpoint-down(lg) {
                    img {
                        height: 50px;
                    }
                }

                :deep(h6) {
                    color: $white !important;
                    font-size: 16px !important;
                    font-weight: 600;
                    display: block;
                }
                :deep(p) {
                    color: #ABABB2;
                    font-size: 18px !important;
                    font-weight: 300;
                    margin: 0;
                }
            }
        }
    }
</style>