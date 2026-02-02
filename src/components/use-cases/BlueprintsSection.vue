<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="title mb-5">
                <p>Explore Blueprints</p>
            </div>
            <div class="mt-3">
                <Suspense>
                    <HomeBlueprintsCarousel />
                </Suspense>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import HomeBlueprintsCarousel from "~/components//home/BlueprintsCarousel.vue"
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .container {
        border-top: $block-border;
        padding: 3rem 0;
        position: relative;

        &::after {
            content: "";
            position: absolute;
            height: 20rem;
            width: 20rem;
            bottom: 30%;
            left: 40%;
            z-index: 1;
            filter: blur(100px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
            pointer-events: none;
        }

        .title {
            position: relative;
            z-index: 2;
            p {
                text-align: center;
                font-size: calc($font-size-base * 2.25);
                font-weight: 500;
                color: $white;
                margin: 0;
            }
        }
        :deep(.card) {
            text-align: left;
            min-width: calc($spacer * 17.7);
            margin-right: $spacer;
            min-height: calc($spacer * 19.1);
        }
        .carousel-control-prev,
        .carousel-control-next {
            width: fit-content;
            background-color: $primary-1;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            opacity: 1;
            :deep(.material-design-icon > .material-design-icon__svg) {
                bottom: 0;
                color: $white;
            }
        }
        .carousel--item {
            width: 100%;
            height: 100%;
        }
        :deep(.carousel) {
            .carousel__viewport {
                position: relative;
                z-index: 2;
                &:before {
                    content: "";
                    position: absolute;
                    right: -142px;
                    width: 16rem;
                    top: -63px;
                    background-color: $black-4;
                    height: 140%;
                    z-index: 1;
                    filter: blur(47px);
                }
            }
            .carousel__prev {
                left: calc($spacer * 3.6);
            }
            .carousel__next {
                right: calc($spacer * 3.6);
            }
            .carousel__next,
            .carousel__prev {
                z-index: 2 !important;
                opacity: 1;
            }
            .carousel__next--disabled,
            .carousel__prev--disabled {
                display: none;
            }
        }
    }
</style>