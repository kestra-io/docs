<template>
    <div class="fixed-top">
        <div class="announce">
            <div class="alert alert-primary" :class="{ scrolled: scrolled }">
                <Carousel
                    :autoplay="4500"
                    :wrap-around="content?.length > 1"
                    :transition="2000"
                    v-model="currentSlide"
                    :breakpoints="breakpoints"
                    :settings="settings"
                >
                    <Slide
                        v-for="(slide, index) in content"
                        :key="slide"
                        v-bind:key="slide?.id"
                    >
                        <p class="d-flex justify-content-center align-items-center" @click="slideTo(index)">
                            <span class="d-inline-block text-truncate">
                                {{ slide.text }}
                            </span>
                            <a
                                class="d-inline-block text-nowrap"
                                :href="slide.href"
                            >
                                <ArrowRight />
                            </a>
                        </p>
                    </Slide>
                </Carousel>
            </div>
        </div>
    </div>
</template>

<script>
    import { Carousel, Slide } from "vue3-carousel"
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue"

    export default {
        components: {
            Carousel,
            Slide,
            ArrowRight,
        },
        props: {
            content: {
                type: Object,
                required: true,
            },
            scrolled: {
                type: Boolean,
                required: false,
            },
        },
        data: () => ({
            currentSlide: 0,
            settings: {
                itemsToShow: 1,
                snapAlign: "center",
            },
            breakpoints: {
                768: {
                    itemsToShow: 1,
                    snapAlign: "start",
                },
                1024: {
                    itemsToShow: 2,
                    snapAlign: "center",
                },
                1500: {
                    itemsToShow: 3,
                    snapAlign: "center",
                },
            },
        }),
        methods: {
            slideTo(val) {
                this.currentSlide = val
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .fixed-top {
        z-index: 1031;
    }

    .announce {
        &.hidden {
            opacity: 0;
            display: none;
            top: -100px;
        }
        .alert {
            border-radius: 0;
            border: 0;
            text-align: center;
            background: #631BFF;
            color: $white;
            margin-bottom: 0;
            position: relative;
            z-index: 1;
            overflow: hidden;
            height: 2.5rem;
            padding-top: 10px;
            padding-bottom: 10px;

            @include media-breakpoint-down(sm) {
                padding-inline: calc($spacer / 2);
            }
            a {
                text-decoration: none;
                color: $white;
                font-weight: 700;
                margin-left: calc($spacer / 2);
                display: flex;
                align-items: center;

                :deep(.material-design-icon) {
                    bottom: 0;
                    transition: transform 0.2s ease-in-out;
                }

                &:hover {
                    :deep(svg) {
                        transform: scaleX(1.15);
                        transform-origin: left;
                        color: var(--ks-content-link);
                    }
                }
            }

            &:hover {
                a :deep(.material-design-icon) {
                    transform: scaleX(1.15);
                    transform-origin: left;
                }
            }
            p {
                margin-bottom: 0;
                font-size: 0.875rem;
                font-weight: 400 !important;
                line-height: 18px;
                width: 100%;
                padding-inline: $spacer;
                
                .text-truncate {
                    color: $white;
                    min-width: 0;
                    flex-shrink: 1;
                    font-weight: 600;
                }
            }
        }
    }

    :deep(.carousel > .carousel__viewport > .carousel__track) {
        .carousel__slide {
            opacity: 0.5;
            &--active {
                opacity: 1;
            }
        }
    }
</style>