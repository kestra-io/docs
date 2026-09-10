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
                    <Slide v-for="(slide, index) in content" :key="index">
                        <a
                            class="slide-content d-flex justify-content-center align-items-center text-decoration-none"
                            :href="slide.href"
                            @click="slideTo(index)"
                        >
                            <span class="d-inline-block text-truncate">
                                <template v-if="slide.tag">
                                    <span class="bracket">[</span>
                                    <strong>{{ slide.tag }}</strong>
                                    <span class="bracket">]</span>
                                    <span class="gap" aria-hidden="true"></span>
                                </template>
                                <span v-if="slide.linkText" class="link-text">{{
                                    slide.linkText
                                }}</span>
                                {{ slide.text }}
                                <em v-if="slide.tail">{{ slide.tail }}</em>
                            </span>
                            <ArrowRight class="d-inline-block text-nowrap" />
                        </a>
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
        }),
        computed: {
            breakpoints() {
                const count = this.content?.length ?? 1
                return {
                    768: {
                        itemsToShow: 1,
                        snapAlign: "start",
                    },
                    1024: {
                        itemsToShow: Math.min(count, 2),
                        snapAlign: "center",
                    },
                    1500: {
                        itemsToShow: Math.min(count, 3),
                        snapAlign: "center",
                    },
                }
            },
        },
        methods: {
            slideTo(val) {
                this.currentSlide = val
            },
        },
    }
</script>

<style lang="scss" scoped>
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
            background: #631bff;
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
            .slide-content {
                text-decoration: none !important;
                margin-bottom: 0;
                font-size: 0.875rem;
                font-weight: 400 !important;
                line-height: 18px;
                width: 100%;
                padding-inline: $spacer;
                color: $white;

                .text-truncate {
                    color: $white;
                    min-width: 0;
                    flex-shrink: 1;
                    font-weight: 400;
                    line-height: 20px;

                    strong {
                        font-weight: 600;
                    }

                    .gap {
                        display: inline-block;
                        width: 0.5rem;
                    }

                    .link-text {
                        text-decoration: none;
                    }

                    em {
                        font-style: italic;
                    }
                }

                :deep(.material-design-icon) {
                    bottom: 0;
                    transition: transform 0.2s ease-in-out;
                    margin-left: $spacer;
                }

                &:hover {
                    :deep(.material-design-icon) {
                        transform: scaleX(1.15);
                        transform-origin: left;
                    }
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
