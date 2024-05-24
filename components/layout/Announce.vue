<template>
    <div class="fixed-top">
        <div class="announce">
            <div class="alert alert-primary" :style="`background-color: ${content.background}`">
                <Carousel :autoplay="5000" :wrap-around="true" :transition="2500" :itemsToShow="3">
                    <Slide v-for="slide in content.data" :key="slide" v-bind:key="slide?.id">
                        <p class="text-truncate">
                            🚀 New! <strong>{{slide.text}}</strong> <NuxtLink :href="slide.href">{{slide.linkText}}</NuxtLink>
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
            background: $primary;
            color: var(--bs-white);
            padding: 0.5rem 0.5rem;
            margin-bottom: 0;

            a {
                text-decoration: underline;
                color: var(--bs-white);
            }

            p {
                margin-bottom: 0;
                margin-right: 15px
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