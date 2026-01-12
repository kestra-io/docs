<template>
    <section class="main-header">
        <div class="hero container">
            <div class="top-section" data-aos="slide-down" data-aos-duration="700" data-aos-delay="0" data-aos-easing="ease-out">
                <div class="left-section" data-aos="slide-down" data-aos-duration="700" data-aos-delay="50" data-aos-easing="ease-out">
                    <h2>Modernize Infrastructure Automation <br class="d-none d-lg-block"> With One Unified Control Plane</h2>
                    <p>
                        Standardize provisioning and Day 2 operations with less risk and operational overhead.
                        <br class="d-none d-lg-block">
                        Get full visibility and control across all infrastructure workflows.
                    </p>
                </div>

                <div class="right-section" data-aos="slide-down" data-aos-duration="700" data-aos-delay="100" data-aos-easing="ease-out">
                    <p>Still relying on scripts and legacy tools <br class="d-none d-xl-block" /> to run mission-critical infrastructure?</p>
                    <NuxtLink
                        to="/demo"
                        class="btn btn-primary btn-gradient"
                    >
                        Book a demo
                    </NuxtLink>
                </div>
            </div>

            <div class="embed-wrapper" :style="{ transform: `scale(${scale})` }">
                <div class="gradient-border">
                    <iframe
                        class="arcade-embed"
                        src="https://demo.arcade.software/cuDf2qq3l9LX1WgP52Fp?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true"
                        title="Hero Infra"
                        frameborder="0"
                        allowfullscreen
                        allow="clipboard-write"
                    ></iframe>
                </div>
            </div>

            <div class="d-flex align-self-start align-self-sm-center align-items-sm-center flex-column top">
                <h5>Trusted by Leading Global Companies</h5>
                <div class="companies-logos">
                    <template v-for="(company, index) in companiesCarousel" :key="index">
                        <ClientOnly :fallback="company.name">
                            <img :src="`/landing/infrastructure/companies/${company.name}.svg`" :width="company.width"
                                :height="company.height" loading="lazy" format="webp"
                        </ClientOnly>
                    </template>
                </div>
            </div>
        </div>

        <div class="background" />
    </section>
</template>

<script setup lang="ts">
    import { useWindowScroll, useWindowSize } from '@vueuse/core'

    const companies = ref([
        { name: "brainlab", width: "130", height: "35" },
        { name: "bloomberg", width: "169", height: "25" },
        { name: "fila", width: "75", height: "21" },
        { name: "apple", width: "75", height: "35" },
        { name: "toyota", width: "134", height: "20" },
        { name: "sabre", width: "120", height: "21" },
        { name: "apoteket", width: "140", height: "18" },
    ]);

    const { y } = useWindowScroll()
    const { width } = useWindowSize()
    
    const scale = computed(() => {
        if (width.value < 768) return 1
        const ratio = Math.min(y.value / 500, 1)
        return 1 + ratio * 0.1
    })

    const companiesCarousel = computed(() => [...companies.value, ...companies.value, ...companies.value])
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable";

    .main-header {
        position: relative;

        .background {
            position: fixed;
            inset: 0;
            background: url('/landing/infrastructure/hero-bg.webp') top center / cover no-repeat;
            z-index: -1;
            pointer-events: none;

            @include media-breakpoint-up(lg) {
                background-image: url('/landing/infrastructure/bg-ks.png'), url('/landing/infrastructure/hero-bg.webp');
                background-position: 0% 0%, top center;
                background-size: 50% auto, cover;
            }
        }

        .hero {
            padding: 2rem 1.5rem;
            @include media-breakpoint-up(xl) {
                padding: 3.5rem 0;
            }
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: $white;
            overflow: hidden;

            .top-section {
                width: 100%;
                max-width: 1012px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                padding-bottom: 16px;
                @include media-breakpoint-down(lg) {
                    padding: 1.1rem;
                }
                gap: 1rem;

                @include media-breakpoint-down(md) {
                    flex-direction: column;
                    height: fit-content;
                    padding: 0 8px;
                }

                .left-section {
                    max-width: 703px;
                    height: fit-content;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;

                    @include media-breakpoint-down(md) {
                        width: 100%;
                    }

                    h2 {
                        font-weight: 700;
                        margin: 0;

                        @include media-breakpoint-up(xl) {
                            font-size: 32px;
                        }
                    }

                    p {
                        font-weight: 500;
                        font-size: 14px;
                        line-height: 23px;
                        margin: 0;
                    }
                }

                .right-section {
                    max-width: 259px;
                    padding: 20px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    .btn {
                        width: 202px;
                    }

                    @include media-breakpoint-down(md) {
                        border-top: 1px solid rgba($white, 0.3);
                        padding-top: 1rem;
                        max-width: 100%;
                    }

                    p {
                        font-weight: 600;
                        font-size: 12px;
                        line-height: 17px;
                        margin: 0;
                    }
                }
            }

            .embed-wrapper {
                width: 100%;
                max-width: 1038px;
                display: flex;
                justify-content: center;
                align-items: center;
                will-change: transform;
                overflow: hidden;
                margin-bottom: 1rem;
                @include media-breakpoint-down(md) {
                    margin-bottom: 0;
                }            
            }

            .gradient-border {
                position: relative;
                width: 100%;
                overflow: hidden;
                border-radius: 8px;
                
                background: linear-gradient(
                    135deg,
                    rgba($white, 0.1) 0%,
                    rgba($white, 0) 50%,
                    rgba($white, 0.1) 100%
                );
                border-radius: 12.57px;
                padding: 0.10rem;
                backdrop-filter: blur(10px);
                
                &::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(
                        132.13deg,
                        rgba($white, 0.8) 4.37%,
                        rgba($gray-500, 0.4) 41.25%
                    );
                    border-radius: 12px;
                    padding: 1.05px;
                    pointer-events: none;
                    -webkit-mask: linear-gradient($white 0 0) content-box, linear-gradient($white 0 0);
                    mask: linear-gradient($white 0 0) content-box, linear-gradient($white 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    z-index: -1;
                }
            }

            .arcade-embed {
                display: block;
                width: 100%;
                aspect-ratio: 16 / 9;
                color-scheme: light;
                border-radius: 8.57px;
                border: none;

                @include media-breakpoint-down(sm) {
                    aspect-ratio: 13 / 9;
                    padding: 0 3px;
                }

                @media (min-width: 450px) and (max-width: 767px) {
                    aspect-ratio: 14 / 9;
                }
            }

            .top {
                margin-top: 1rem;
                h5 {
                    font-weight: 600;
                    font-size: 17px;

                    @include media-breakpoint-down(sm) {
                        font-size: 12px !important;
                        margin-top: 19px;
                        margin-bottom: 0;
                    }
                }

                .companies-logos {
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    margin-top: 0.875rem;
                    animation: infiscroll 15s linear infinite;

                    @include media-breakpoint-up(lg) {
                        animation: none;
                        white-space: normal;
                        flex-wrap: wrap;
                        justify-content: space-evenly;
                        overflow: visible;
                        margin-top: 1rem;
                    }

                    img {
                        flex-shrink: 0;

                        @include media-breakpoint-up(lg) {
                            &:nth-child(n+8) {
                                display: none;
                            }
                        }
                    }
                }
            }
        }
    }

    @keyframes infiscroll {
        0% {
            transform: translate(0, 0);
        }

        100% {
            transform: translate(-33.33%, 0);
        }
    }
</style>

