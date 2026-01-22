<template>
    <div class="slider">
        <div>
            <Carousel v-bind="settings" :breakpoints="breakpoints">
                <Slide v-for="(slide, slideIndex) in testimonialData" :key="slideIndex">
                    <div class="carousel--item">
                        <div class="content">
                            <img class="slide-svg" v-bind="sliderIcon" alt="Carousel img" />
                            <span>{{ slide.message }}</span>
                            <div class="person">
                                <div class="company-logo">
                                    <img v-bind="slide.logo" :alt="`${slide.name} company logo`" />
                                </div>
                                <div class="person-info">
                                    <p>{{ slide.name }}</p>
                                    <span>{{ slide.designation }}</span>
                                </div>
                            </div>

                            <div class="dots" v-if="testimonialData.length > 1">
                                <div class="slide-counter">
                                    <div class="slider-actions">
                                        <Navigation>
                                            <template #prev>
                                                <div
                                                    class="mobile-btn-prev carousel-control carousel-control-prev"
                                                >
                                                    <img v-bind="leftArrow" alt="prev" />
                                                </div>
                                            </template>
                                            <template #next>
                                                <div
                                                    class="mobile-btn-next carousel-control carousel-control-next"
                                                >
                                                    <img v-bind="rightArrow" alt="next" />
                                                </div>
                                            </template>
                                        </Navigation>
                                    </div>
                                    <div
                                        class="dot"
                                        v-for="(slide, index) in testimonialData"
                                        :class="slideIndex === index && 'active'"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Slide>
                <template #addons>
                    <Navigation v-if="testimonialData.length > 1">
                        <template #next>
                            <div class="carousel-btn carousel-control carousel-control-next">
                                <img v-bind="rightArrow" alt="next" />
                            </div>
                        </template>
                        <template #prev>
                            <div class="carousel-btn carousel-control carousel-control-prev">
                                <img v-bind="leftArrow" alt="prev" />
                            </div>
                        </template>
                    </Navigation>
                </template>
            </Carousel>
        </div>
        <div class="ready-scale">
            <p>Ready to Scale Your Workflows</p>
            <span>
                Kestra Enterprise delivers the security, control, and flexibility you need to scale
                operations with confidence. Empower your team, streamline governance, and harness
                reliable infrastructure to drive growth without compromise.
            </span>
            <a href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                <span>Talk to us</span>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue"
    import { Carousel, Slide, Navigation } from "vue3-carousel"
    import "vue3-carousel/dist/carousel.css"
    import leftArrow from "../enterprise/assets/slider-left-arrow.svg"
    import rightArrow from "../enterprise/assets/slider-right-arrow.svg"
    import sliderIcon from "../enterprise/assets/slider-icon.svg"

    interface Testimonial {
        message: string
        name: string
        designation: string
        logo: any
    }

    const props = defineProps<{
        testimonialData: Testimonial[]
    }>()

    const settings = ref({
        itemsToShow: 1,
        snapAlign: "center" as const,
    })

    const breakpoints = ref({
        768: {
            itemsToShow: 1,
            snapAlign: "start" as const,
        },
        1024: {
            itemsToShow: 1,
            snapAlign: "start" as const,
        },
    } as const)
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .slider {
        display: flex;
        flex-direction: column;
        padding-top: 180px;
        width: 100%;
        background-image: url(/landing/pricing/visual-bg.png);
        background-size: 100% auto;
        background-repeat: no-repeat;
        gap: 42px;

        @include media-breakpoint-down(sm) {
            background-size: auto;
            background-position: center;
        }

        @media only screen and (max-width: 760px) {
            padding-top: 64px;
        }

        .dots {
            display: flex;
            width: 100%;
            justify-content: center;
            margin-top: 40px;

            @media only screen and (max-width: 760px) {
                margin-top: 16px;
            }

            .slider-actions {
                display: none;

                .mobile-btn-next {
                    position: absolute;
                    right: -56px;
                }

                .mobile-btn-prev {
                    position: absolute;
                    left: -56px;
                }

                @media only screen and (max-width: 760px) {
                    display: block;
                }
            }

            .slide-counter {
                position: relative;
                display: flex;
                align-items: center;

                .dot {
                    width: 6px;
                    height: 6px;
                    margin-right: 24px;
                    border-radius: 20px;
                    background: #ffffff33;

                    &:last-child {
                        margin-right: 0;
                    }
                }

                .active {
                    background: #ffffff;
                }
            }
        }

        .carousel-btn {
            @media only screen and (max-width: 760px) {
                display: none !important;
            }
        }

        :deep(.content) {
            -webkit-backdrop-filter: blur(74px) !important;
            backdrop-filter: blur(74px) !important;
            background: linear-gradient(347.23deg, #1c1c2699 9.24%, #2b293299 106.62%) !important;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            gap: 40px;
            margin: 0 auto;
            overflow: hidden;
            padding: 72px 102px;
            max-width: 944px;

            @media only screen and (max-width: 992px) {
                gap: 16px;
                padding: $rem-2;
            }

            @media only screen and (max-width: 760px) {
                margin: 0 $rem-2;
            }

            .slide-svg {
                width: 57px;
                height: 57px;

                @media only screen and (max-width: 760px) {
                    width: 42px;
                    height: 32px;
                }
            }

            .person {
                display: flex;
                gap: 17px;
                max-width: 264px;

                .fila-svg {
                    padding: 6px 0;

                    img {
                        width: 75px;
                        height: 23.5px;
                    }
                }

                .person-info {
                    display: flex;
                    flex-direction: column;

                    p {
                        font-family: $font-family-sans-serif;
                        font-size: 14px;
                        font-weight: 700;
                        line-height: 18px;
                        letter-spacing: -0.05em;
                        text-align: left;
                        margin: 0;
                        color: $white;
                    }

                    span {
                        font-family: $font-family-sans-serif;
                        white-space: nowrap;
                        font-size: 12px;
                        font-weight: 400;
                        line-height: 18px;
                        letter-spacing: -0.05em;
                        text-align: left;
                        margin: 0;
                        color: #e1e1e1;
                    }
                }
            }

            > span {
                font-family: $font-family-sans-serif;
                font-size: 39px;
                font-weight: 400;
                line-height: 52.26px;
                letter-spacing: -0.005em;
                text-align: left;
                color: $white;

                @media only screen and (max-width: 992px) {
                    font-size: 30px;
                }

                @media only screen and (max-width: 760px) {
                    font-size: 19px;
                    line-height: 25px;
                }
            }
        }

        .ready-scale {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 100%;
            max-width: 944px;
            margin: auto;
            overflow: hidden;
            border-radius: 20px;
            padding: $rem-4;
            background: linear-gradient(
                180deg,
                rgba(49, 53, 70, 0.8) 3%,
                rgba(33, 36, 46, 0.8) 58%,
                rgba(26, 28, 36, 0.8) 100%
            );
            backdrop-filter: blur(44px);
            margin-bottom: 150px;

            @media only screen and (max-width: 760px) {
                margin: 0 $rem-2;
                margin-bottom: 150px;
                padding: $rem-2;
                max-width: -webkit-fill-available;
            }

            > p {
                max-width: 400px;
                color: $white;
                font-family: $font-family-sans-serif;
                font-size: $rem-3;
                font-weight: 600;
                line-height: 56.4px;
                text-align: center;

                @media only screen and (max-width: 991px) {
                    font-size: $rem-2;
                    line-height: 35px;
                }

                @media only screen and (max-width: 760px) {
                    font-size: 24px;
                    line-height: 28px;
                }
            }

            > span {
                max-width: 568px;
                color: $white;
                font-family: $font-family-sans-serif;
                font-size: 14px;
                font-weight: 400;
                line-height: 22px;
                text-align: center;
            }
        }
    }
</style>