<template>
    <div class="main">
        <div class="hero container">
            <div class="text-block">
                <h1 data-aos="zoom-in">
                    <text-scroller :texts="scrollingTexts" /><br />Platform
                    <br />for All Engineers.
                </h1>

                <div class="buttons">
                    <a
                        href="#"
                        class="btn btn-animated btn-dark-animated me-2 mb-2"
                        data-aos="zoom-in"
                        data-bs-toggle="modal"
                        data-bs-target="#home-intro"
                    >
                        Watch video
                    </a>

                    <NuxtLink
                        href="/docs/getting-started"
                        class="btn btn-animated btn-purple-animated mb-2"
                        data-aos="zoom-in"
                    >
                        Get started
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div class="companies-background overflow-x-hidden">
            <Companies class="mt-4 mb-4 pb-4 companies container" />


        
        </div>
    </div>
    <div
        v-on="{
            'show.bs.modal': () => (videoVisible = true),
            'hidden.bs.modal': () => (videoVisible = false),
        }"
        class="modal modal-full fade"
        id="home-intro"
        tabindex="-1"
        aria-labelledby="home-intro"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="video-responsive">
                        <iframe
                            v-if="videoVisible"
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/h-P0eK2xN58?autoplay=1"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Console from "vue-material-design-icons/Console.vue";
import PlayOutline from "vue-material-design-icons/PlayOutline.vue";

import Companies from "~/components/layout/Companies.vue";
import TextScroller from "~/components/layout/TextScroller.vue";

export default {
    components: {
        Console,
        PlayOutline,
        Companies,
        TextScroller,
    },
    data() {
        return {
            videoVisible: false,
            scrollingTexts: [
                { text: "Orchestration", color: "#E500EA" },
                { text: "Automation", color: "#4281FF" },
                { text: "Scheduling", color: "#9D40FB" },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.main {
    .text-block {
        margin: 5rem 0;
    }

    .hero {
        background: $black-4 url("/landing/home/header-bg.webp") no-repeat center
        center;
        background-size: 130%;
        padding-bottom: 2rem;
        padding-top: 7rem;

    }

    h1 {
        color: var(--bs-white);
        text-align: center;
        max-width: 100%;
        font-size: 36px;
        font-weight: 600;

        @include media-breakpoint-up(md) {
            font-size: 56px;
        }

        @include media-breakpoint-up(lg) {
            font-size: 76px;
        }

        :deep(span) {
            color: #e500ea;
        }
    }

    .buttons {
        text-align: center;
    }

    .companies {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .companies-title {
        position: relative;

        &:after {
            content: "";
            position: absolute;
            left: 50%;
            bottom: calc(-1 * var(--spacer));
            transform: translateX(-50%);
            display: inline-block;
            height: 2px;
            width: 51px;
            background: var(--bs-pink);
        }
    }

    @include media-breakpoint-down(lg) {
        .hero {
            padding-top: 6rem;
            padding-bottom: 2rem;

            .text-block {
                margin-bottom: 0;
            }
        }
    }

    .companies-background {
        background: url("/landing/home/container-bg.svg") no-repeat center;
        background-size: 100% 100%;
        padding-bottom: 4rem;
    }

    .activity-list {
        border-radius: 8px;
        border: 0.829px solid $black-6;
        padding: 34px 122.5px;
        background: url("/landing/home/bg.svg") no-repeat center;
        background-size: 100% 100%;
        text-align: center;
        font-family: $font-family-sans-serif;
        text-transform: uppercase;

        p {
            margin: 0;
        }

        .count {
            color: $white;
            font-size: 48.087px;
            font-weight: 100;
            line-height: 46px;
        }

        .description {
            color: rgba(255, 255, 255, 0.70);
            font-size: 11.607px;
            font-weight: 500;
        }

        @include media-breakpoint-down(xl) {
            padding: 30px 64px;
        }

        @include media-breakpoint-down(lg) {
            padding: 30px 44px;
            .count {
                font-size: 30px;
                line-height: 30px;
            }

            .description {
                font-size: 9px;
            }
        }

        @include media-breakpoint-down(md) {
            max-width: 330px;
            flex-wrap: wrap;
            justify-content: center !important;
            gap: 25px;
        }
    }
}
</style>
