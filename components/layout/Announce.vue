<template>
    <div class="fixed-top">
        <div class="announce">
            <div class="alert alert-primary">
                <Carousel :autoplay="5000" :wrap-around="true" :transition="2500" :itemsToShow="3">
                    <Slide v-for="slide in content" :key="slide" v-bind:key="slide?.id">
                        <p class="text-truncate">
                            <strong>{{slide.text}}</strong> <NuxtLink :href="slide.href">{{slide.linkText}}</NuxtLink>
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
            alertHide: {
                type: Function,
                required: true,
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
        transition: all 0.2s ease;
        &.hidden {
            opacity: 0;
            display: none;
            top: -100px;
        }

        .alert {
            border-radius: 0;
            border: 0;
            text-align: center;
            background: $black-3;
            color: var(--bs-white);
            padding: calc($spacer * 0.938) 0.5rem;
            margin-bottom: 0;
            position: relative;
            z-index: 1;
            overflow: hidden;

            &::after {
                content: "";
                position: absolute;
                height: 16rem;
                width: 15rem;
                bottom: 32%;
                right: 60%;
                z-index: -1;
                background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
                filter: blur(80px);
            }

            a {
                text-decoration: underline;
                color: $purple-36;
                font-weight: 400;
                margin-left: $spacer;
            }

            p {
                margin-bottom: 0;
                font-size: 12px;
                font-weight: 400;
                line-height: 18px;
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