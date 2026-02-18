<template>
    <section class="features-bg">
        <div class="container">
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
                <PlayBoxOutline />
                Overview Video
            </a>
        </div>
        <FeaturesBlock :features="features" />
        <FeaturesValue />
        </div>
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
    import FeaturesBlock from "~/components/common/FeaturesBlock.vue"
    import FeaturesValue from "~/components/home/FeaturesValue.vue"
    import PlayBoxOutline from "vue-material-design-icons/PlayBoxOutline.vue"

    import featuresCloud from "./assets/features-cloud.svg"
    import featuresApi from "./assets/features-api.svg"
    import featuresCog from "./assets/features-cog.svg"
    import featuresLogos from "./assets/features-logos.svg"

    const videoVisible = ref(false)

    const features = [
        {
            name: "Deploy Anywhere",
            description:
                "Run Kestra anywhere—on-prem, hybrid, or any cloud, no dependencies, no installation headaches.",
            icon: featuresCloud,
            color: "#3991FF",
            width: 69,
        },
        {
            name: "Connect to Any API or Service",
            description:
                "Automating everything from data pipelines, microservices, business processes to infrastructure provisioning.",
            icon: featuresApi,
            color: "#E58238",
            width: 50,
        },
        {
            name: "Build Everything As Code & From the UI",
            description:
                "Empower every team members to collaborate from a single tool—code for developers, UI for everyone else, all in sync.",
            icon: featuresCog,
            width: 60,
            color: "#21CE9C",
        },
        {
            name: "Write Business Logic in Any Language",
            description:
                "Orchestrate custom business logic in Python, R, Java, Julia, Ruby, and any kind of language.",
            icon: featuresLogos,
            color: "#FCE07C",
            width: 123,
        },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .features-bg {
        background-color: var(--ks-background-body);
        padding: $rem-3 0.25rem;
    }

    .container {
        text-align: center;
        color: var(--ks-content-primary);
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
            margin: 0 4rem;
            margin-bottom: 0.5rem;
            span {
                display: block;
                @include media-breakpoint-up(lg) {
                    display: inline;
                }
                color: var(--ks-content-link);
                background: linear-gradient(90deg, #7c2eea 0%, #658af9 100%) no-repeat center;
                background-size: cover;
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
        p {
            text-align: center;
            margin: 0 auto;
            text-wrap: pretty;
            margin-bottom: 2rem;
            color: var(--ks-content-tertiary);
        }
        .cta-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
            .btn {
                white-space: nowrap;
            }
        }
    }
</style>