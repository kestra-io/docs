<template>
    <div class="main">
        <div class="hero container">
            <div class="text-block">
                <h1>
                    <text-scroller :texts="scrollingTexts" />
                    <br>
                    Smarter Not Harder
                </h1>
                <p>Unified Orchestration Platform to Simplify Business-Critical Workflows
                    <br>and Govern them as Code and from the UI.</p>
                <div class="buttons">
                    <NuxtLink
                        href="/docs/getting-started/quickstart#start-kestra"
                        class="btn btn-animated btn-purple-animated me-2 mb-2"
                    >
                        <NuxtImg
                            width="25px"
                            height="25px"
                            loading="lazy"
                            format="webp"
                            src="/landing/home/lightning-bolt.svg"
                            alt="lightning"
                        />
                        Get started
                    </NuxtLink>

                    <a
                        href="https://www.youtube.com/embed/feC6-KQLYyA?si=PbjxwD94VAWSzSxN?autoplay=1"
                        class="btn btn-animated btn-dark-animated  mb-2"
                        data-bs-toggle="modal"
                        data-bs-target="#home-intro"
                    >
                        <NuxtImg
                            width="25px"
                            height="25px"
                            loading="lazy"
                            format="webp"
                            src="/landing/home/play.svg"
                            alt="play"
                        />
                        Watch video
                    </a>

                </div>
            </div>
            <div class="img-block">
                <NuxtImg
                    class="img-fluid headerimg"
                    src="/landing/home/header.png"
                    format="webp"
                    quality="100"
                    width="1034"
                    height="785"
                    densities="x1 x2"
                    sizes="320px xs:640px lg:1034px"
                    alt="Unified Orchestration Platform in an All-Inclusive Dashboard"
                />
            </div>
            <div class="companies-background">
                <LayoutCompanies class="d-xl-none" />
                <HomeCompanies class="mb-4 pb-4 companies container d-none d-xl-block" />
            </div>
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
                            src="https://www.youtube.com/embed/feC6-KQLYyA?si=PbjxwD94VAWSzSxN?autoplay=1"
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

import TextScroller from "~/components/layout/TextScroller.vue";

export default {
    components: {
        Console,
        PlayOutline,
        TextScroller,
    },
    data() {
        return {
            videoVisible: false,
            scrollingTexts: [
                { text: "Orchestrate", color: "#E500EA" },
                { text: "Automate", color: "#4281FF" },
                { text: "Schedule", color: "#9D40FB" },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.main {
    &::before {
        position: absolute;
        content: "";
        z-index: 0;
        filter: blur(95px);
        width: 99vw;
        height: 14%;
        background: linear-gradient(197.51deg, #390380 13.37%, #14151B 45.45%);
        right: 0;
        top: 0;
    }
    .text-block {
        margin: 4rem 0 1rem;
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        gap: $spacer;
    }

    .hero {
        padding-bottom: 2rem;
        padding-top: 5rem;
        position: relative;
    }

    h1 {
        color: var(--bs-white);
        text-align: center;
        max-width: 100%;
        font-size: 36px;
        font-weight: 600;
        margin: 0;
        padding: 0;

        @include media-breakpoint-up(md) {
            font-size: 40px;

        }

        @include media-breakpoint-up(lg) {
            font-size: 53px;

        }

        :deep(span) {
            background: linear-gradient(91.82deg, #9639F9 28.72%, #9788EC 99.23%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    p {
        max-width: fit-content;
        text-align: center;
        font-weight: 500;
        font-size: $h6-font-size;
        color: $white;
    }

    .buttons {
        text-align: center;
    }

    .companies {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 4rem !important;
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
        padding-bottom: 4rem;
        position: relative;
        z-index: 10;
        margin-top: -170px;

        @include media-breakpoint-down(xxl) {
            margin-top: -80px;
        }

        @include media-breakpoint-down(xl) {
            width: 100vw;
            position: relative;
            left: 50%;
            right: 50%;
            margin-left: -50vw;
            margin-right: -50vw;
        }
        @media only screen and (max-width: 320px)  { /* notice the max-width instead of min-width */
            width: unset;
            position: unset;
            left: unset;
            right: unset;
            margin-left: -15px;
            margin-right: -15px;
        }
        @include media-breakpoint-down(md) {
            margin-top: -40px;
        }
        :deep(.companies-container .companies img) {
            @include media-breakpoint-down(md) {
                max-height: 30px;
                width: auto;
            }
            @include media-breakpoint-down(sm) {
                max-height: 15px;
                width: auto;
            }

        }
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

    .img-block
    {
        display: flex;
        width: 100%;
        justify-content: center;
        position: relative;

        &:after {
            content: "";
            background-image: url(/landing/header-menu/bg-dots.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 0;
            width: 148%;
            @include media-breakpoint-down(md) {
                width: 138%;
            }
            height: 85%;
        }

        img {
            width: 80%;
            position: relative;
            z-index: 5;
            @include media-breakpoint-down(md) {
                width: 100%;
            }
        }
    }

    :deep(.companies-container) {
        max-width: unset;
        .companies-list-container {
            &:before,
            &:after {
                content: none;
            }
        }
    }
}
</style>
