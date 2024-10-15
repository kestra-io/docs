<template>
    <div class="fixed-top">
        <div class="announce">
            <div class="alert alert-primary" :class="{ 'scrolled': scrolled }">
                <Carousel
                    :autoplay="4500"
                    :wrap-around="content.length > 1"
                    :transition="2000"
                    v-model="currentSlide"
                    :breakpoints="breakpoints"
                    :settings="settings"
                >
                    <Slide v-for="(slide, index) in content" :key="slide" v-bind:key="slide?.id">
                        <p class="d-flex" @click="slideTo(index)">
                            <span class="d-inline-block text-truncate" >{{slide.text}}</span> <NuxtLink class="d-inline-block text-nowrap" :href="slide.href">{{slide.linkText}}</NuxtLink>
                        </p>
                    </Slide>
                </Carousel>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            content: {
                type: Object,
                required: true,
            },
            scrolled: {
                type: String,
                required: false
            }
        },
        data: () => ({
            currentSlide: 0,
            settings: {
              itemsToShow: 1,
              snapAlign: 'center',
            },
            breakpoints: {
              768: {
                itemsToShow: 1,
                snapAlign: 'start',
              },
              1024: {
                itemsToShow: 2,
                snapAlign: 'center',
              },
              1500: {
                itemsToShow: 3,
                snapAlign: 'center',
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
    @import "../../assets/styles/variable";

    .fixed-top {
        z-index: 1031;
    }

    .announce {
        width: 100%;
        opacity: 1;

        &.hidden {
            opacity: 0;
            display: none;
            top: -100px;
        }

        .alert {
            border-radius: 0;
            border: 0;
            text-align: center;
            backdrop-filter: blur(0.625rem);
            background-color: transparent;
            color: var(--bs-white);
            padding-left: calc($spacer * 0.938) 0.5rem;
            padding-right: calc($spacer * 0.938) 0.5rem;
            border-bottom: 1px solid #E5E4F721;
            margin-bottom: 0;
            position: relative;
            z-index: 1;
            overflow: hidden;
            transition: max-height .5s linear, color .5s linear;
            height: 3rem;

            &.scrolled {
                background-color: rgba(17, 17, 19, 0.65);
                transition: background-color 250ms ease-in-out;
            }

            @include media-breakpoint-down(sm) {
                padding-right: calc($spacer / 2);
                padding-left: calc($spacer / 2);
            }

            &::after {
                content: "";
                position: absolute;
                height: 16rem;
                width: 15rem;
                bottom: 32%;
                left: -25%;
                z-index: -1;
                background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
                filter: blur(80px);
                animation-name: example;
                animation-direction: normal, alternate;
                animation-duration: 6.5s;
                animation-iteration-count: infinite;
            }

            @keyframes example  {
                60% {
                    transform: translateX(233vw);
                }
                to {
                    transform: translateX(233vw);
                }
            }

            a {
                text-decoration: underline;
                color: $purple-36;
                font-weight: 400 !important;
                margin-left: $spacer;
            }

            p {
                margin-bottom: 0;
                font-size: 0.875rem;
                font-weight: 400 !important;
                line-height: 18px;
                max-width: 100%;
            }

            button {
                position: absolute;
                right: 3px;
                top: 3px;
                background: none;
                border: 0;
                font-size: 24px;
                color: var(--bs-white);
            }
        }
    }

    :deep(.carousel > .carousel__viewport > .carousel__track) {
        .carousel__slide {
            opacity: 0.5;
        }

        .carousel__slide--active {
            opacity: 1;
        }
    }
</style>