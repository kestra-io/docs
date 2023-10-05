<template>
    <div class="main">
        <div class="hero container">
            <div class="text-block">
                <h1 data-aos="fade-right"><text-scroller :texts="scrollingTexts" /><br />Everything Everywhere <br />All at Once.</h1>

                <div class="buttons">
                    <a href="#" class="btn btn-animated btn-dark-animated me-2 mb-2" data-aos="zoom-in" data-bs-toggle="modal" data-bs-target="#home-intro">
                        <PlayCircleOutline /> Product Video
                    </a>

                    <NuxtLink href="/docs" class="btn btn-animated btn-purple-animated mb-2" data-aos="zoom-in">
                        <LightningBolt /> Get started
                    </NuxtLink>
                </div>
            </div>
        </div>

        <Companies class="mt-4 pb-4 companies" />
    </div>
    <div v-on="{ 'show.bs.modal': () => videoVisible = true, 'hidden.bs.modal': () => videoVisible = false }" class="modal modal-full fade" id="home-intro" tabindex="-1" aria-labelledby="home-intro" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="video-responsive">
                        <iframe v-if="videoVisible" width="560" height="315" src="https://www.youtube.com/embed/h-P0eK2xN58?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Console from "vue-material-design-icons/Console.vue"
    import PlayOutline from "vue-material-design-icons/PlayOutline.vue"
    import LightningBolt from "vue-material-design-icons/LightningBolt.vue"
    import Companies from "../layout/Companies.vue";
    import HeaderAnimation from './HeaderAnimation.vue';
    import PlayCircleOutline from 'vue-material-design-icons/PlayCircleOutline.vue'
    import TextScroller from "~/components/layout/TextScroller.vue";

    export default {
        components: {Console, PlayOutline, LightningBolt, PlayCircleOutline, Companies, HeaderAnimation, TextScroller},
        data() {
            return {
                videoVisible: false,
                scrollingTexts: [
                    {text: "Orchestrate", color: "#C005EF"},
                    {text: "Automate", color: "#5D48F5"},
                    {text: "Schedule", color: "#7604E3"}
                ]
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main {
        background: #111113 url("/landing/home/header-bg.png") no-repeat center center;

        .text-block {
            margin: 5rem 0;
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
                color: #E500EA;
            }
        }

        .buttons {
            text-align: center;
        }

        .companies {
            border-top: 1px solid rgba(255, 255, 255, 0.10);
        }

        .companies-title {
            position: relative;

            &:after {
                content: '';
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
    }
</style>
