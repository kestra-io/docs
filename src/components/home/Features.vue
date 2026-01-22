<template>
    <section class="container">
        <h2><span>Simplicity Scales,</span> Complexity Fails</h2>
        <p>
            Mix the flexibility of code-based orchestration<br />
            with a no-code interface that anyone can learn in minutes
        </p>
        <div class="cta-buttons">
            <a class="btn btn-primary btn-lg" href="/features">See All Features</a>
            <a
                href="https://www.youtube.com/embed/xnGYiWFM2uk?autoplay=1"
                class="btn btn-secondary btn-lg"
                data-bs-toggle="modal"
                data-bs-target="#full-video"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.5 7.5V16.5L16.5 12L9.5 7.5Z" fill="black" />
                    <path
                        d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18.01H4V5.99H20V18.01Z"
                        fill="black"
                    />
                </svg>
                Overview Video
            </a>
        </div>
        <HomeFeaturesBlock />
        <HomeFeaturesValue />
    </section>
    <div
        v-on="{
            'show.bs.modal': () => (videoVisible = true),
            'hidden.bs.modal': () => (videoVisible = false),
        }"
        class="modal modal-full fade"
        id="full-video"
        tabindex="-1"
        aria-labelledby="home-intro"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="video-container">
                        <iframe
                            v-if="videoVisible"
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/xnGYiWFM2uk?autoplay=1"
                            title="YouTube video player"
                            frameborder="0"
                            allow="
                                accelerometer;
                                autoplay;
                                clipboard-write;
                                encrypted-media;
                                gyroscope;
                                picture-in-picture;
                                web-share;
                            "
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import HomeFeaturesBlock from "~/components/home/FeaturesBlock.vue"
    import HomeFeaturesValue from "~/components/home/FeaturesValue.vue"
    const videoVisible = ref(false)
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .container {
        text-align: center;
        color: white;
        padding-top: 2rem;
        @include media-breakpoint-up(lg) {
            padding-top: 4rem;
        }

        h2 {
            font-size: 3rem;
            line-height: 2.5rem;
            @include media-breakpoint-up(lg) {
                line-height: 3rem;
            }
            font-weight: 600;
            margin: 0 4rem;
            margin-bottom: 0.5rem;
            span {
                display: block;
                @include media-breakpoint-up(lg) {
                    display: inline;
                }
                color: $primary;
                background: linear-gradient(90deg, #7c2eea 0%, #658af9 100%) no-repeat center;
                background-size: cover;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
        p {
            text-align: center;
            margin: 0 auto;
            text-wrap: pretty;
            margin-bottom: 2rem;
            color: #9797a6;
            @include media-breakpoint-up(lg) {
                font-size: 1.2rem;
            }
        }
        .cta-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
            .btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                white-space: nowrap;
                > svg {
                    display: none;
                    @include media-breakpoint-up(lg) {
                        display: block;
                    }
                }
            }
        }
    }
</style>