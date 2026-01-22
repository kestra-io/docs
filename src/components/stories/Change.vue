<template>
    <section>
        <div class="container">
            <div class="inner-div">
                <div class="new-div">
                    <div class="content-div">
                        <div class="first">
                            <img src="/stories/ks-tilted.svg" class="story-image" alt="story-ks" />
                        </div>
                        <div class="second">
                            <p class="story-text">
                                What would change if your public-sector cloud automation ran through
                                a self-hosted orchestration control plane—built for governance,
                                visibility, and scale?
                            </p>
                        </div>
                        <div class="third">
                            <a href="/demo" class="btn btn-gradient"> Book a demo </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    // NOOP
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section {
        width: 100%;
        padding: 1rem 0.25rem 4rem;
    }

    .inner-div {
        width: 100%;
        min-height: 158px;
        border-radius: 0.8125rem;
        border: 1px solid #d4d4d4;
        padding: 0.375rem;
        display: flex;
        align-items: stretch;

        @include media-breakpoint-down(lg) {
            min-height: auto;
            display: block;
        }
    }

    .new-div {
        flex: 1 1 auto;
        height: auto;
        width: 100%;
        padding: 0 2rem;
        border-radius: 0.75rem;
        background-image: url("/stories/gradient.png");
        background-size: cover;
        background-repeat: no-repeat;
        display: flex;
        justify-content: center;
        align-items: center;

        @include media-breakpoint-down(lg) {
            padding: 1rem 1rem;
        }

        .content-div {
            width: 100%;
            height: 4.935rem;
            display: flex;
            gap: 2rem;
            align-items: center;
            justify-content: center;

            @include media-breakpoint-down(lg) {
                width: 100%;
                height: auto;
                flex-direction: column;
                gap: 1rem;
            }

            .first {
                width: 4.4375rem;
                height: 4.875rem;
                flex-shrink: 0;

                .story-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .second {
                width: 594.9793701171875px;
                height: 4.6875rem;

                @include media-breakpoint-down(lg) {
                    width: 100%;
                    height: auto;
                }

                .story-text {
                    font-weight: 600;
                    font-size: 1.125rem;
                    line-height: 1.5625rem;
                    color: #ffffff;

                    @include media-breakpoint-down(lg) {
                        font-size: 1rem;
                        line-height: 1.375rem;
                    }
                }
            }

            .third {
                width: 202px;
                height: 3.125rem;
                flex-shrink: 0;

                @include media-breakpoint-down(lg) {
                    width: 100%;
                }

                .btn-gradient {
                    width: 100%;
                    position: relative;
                    color: $white;
                    background:
                        linear-gradient(180deg, #694eff 0%, #5233ff 104.54%) padding-box,
                        linear-gradient(262.72deg, #ffffff 15.19%, #e8c8c8 37.92%, #838383 76.01%)
                            border-box;
                    border-radius: $border-radius-lg;
                    border: 1px solid transparent;
                    box-shadow:
                        0 0 0.625rem #dce0f980,
                        0 0 0.875rem #be62ff inset,
                        0.125rem 0.125rem 0.6875rem #0000001a;
                }
            }
        }
    }
</style>