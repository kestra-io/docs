<template>
    <div class="main">
        <div class="hero container">
            <div class="text-block">
                <p class="overline" data-aos="fade-left">OPEN SOURCE DECLARATIVE<br/>DATA ORCHESTRATION</p>
                <h1 data-aos="fade-right">Automate <br />Everything <br v-if="!isMobile" />Everywhere <br />All at Once.</h1>
                <ClientOnly>
                    <a class="video" href="https://www.youtube.com/watch?v=h-P0eK2xN58" v-if="isMobile">
                        <img src="/landing/home/video.png" alt="Kestra introduction video picture"/>
                        <div class="play-button">
                            <img src="/landing/home/play-button-bg.png" alt="Play button" />
                            <PlayOutline />
                        </div>
                    </a>
                </ClientOnly>
                <div class="buttons">
                    <a href="https://demo.kestra.io/ui/login?auto" target="_blank" class="btn btn-secondary me-2" data-aos="zoom-in">
                        <Console /> Try the live demo
                    </a>
                    <NuxtLink href="/docs" class="btn btn-primary">
                        <LightningBolt /> Get started
                    </NuxtLink>
                </div>
            </div>
            <ClientOnly>
                <HeaderAnimation v-if="!isMobile" class="animation"/>
            </ClientOnly>
        </div>

        <div class="container text-center">
            <p class="companies-title" data-aos="zoom-in">
                Loved & trusted by leading enterprises worldwide
            </p>
        </div>

        <div class="container-fluid pt-4 pb-4">
            <Companies />
        </div>
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
    import GithubButton from "../layout/GithubButton.vue";
    import Companies from "../layout/Companies.vue";
    import HeaderAnimation from './HeaderAnimation.vue';

    export default {
        components: {Console, PlayOutline, LightningBolt, GithubButton, Companies, HeaderAnimation},
        data() {
            return {
                videoVisible: false,
                isMobile: false
            }
        },
        mounted() {
            if(process.client) {
                this.computeIsMobile();
                window.onresize = () => {
                    this.computeIsMobile();
                }
            }
        },
        methods: {
            computeIsMobile() {
                // LG devices breakpoint = 992px
                this.isMobile = window.innerWidth < 992;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main {
        background-size: 100% 100% !important;
        background: url("/landing/home/header-bg.png") center no-repeat;

        @include media-breakpoint-down(lg) {
            background: url("/landing/home/header-bg-mob.png") center no-repeat;
        }

        > * {
            z-index:2;
            position: relative;
        }

        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;

        .hero {
            display: flex;
            padding-top: calc(var(--spacer) * 6);
            justify-content: center;
            align-items: center;
            max-width: none;

            .text-block {
                text-align: left;
                display: flex;
                flex-direction: column;
                gap: $spacer;

                @include media-breakpoint-down(lg) {
                    text-align: center;
                    align-items: center;
                }

                .overline {
                    color: #E1C2FF;
                    line-height: 1.875rem;
                    margin-bottom: 0;

                    &::after {
                        content: "";
                        position: relative;
                        top: calc(var(--spacer) / 2);
                        width: 15%;
                        height: 3px;
                        background: var(--bs-pink);
                        display: block;
                    }
                }

                .buttons {
                    display: flex;
                    flex-direction: column;
                    gap: $spacer;
                    width: 80%;

                    a {
                        margin: 0 !important;
                    }

                    @include media-breakpoint-down(lg) {
                        gap: calc(0.5 * var(--spacer));
                        width: 100%;
                    }
                }

                h1 {
                    font-size: 2.875rem;
                }
            }

            .animation {
                position: relative;
                width: 50vw;

                &::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #7A00F4;
                    mix-blend-mode: lighten;
                    filter: blur(97px);
                }
            }

            .video {
                position: relative;
                margin-bottom: $spacer;

                .play-button {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 20%;

                    * {
                        display: block;
                    }

                    img {
                        width: 100%;
                    }

                    span {
                        color: white;
                        position: absolute;
                        // offsets the play button so it looks centered
                        top: 48%;
                        left: 55%;
                        transform: translate(-50%, -50%);
                        text-align: left;
                        height: 40%;
                        width: 40%;

                        :deep(svg) {
                            bottom: unset;
                            height: 100%;
                            width: 100%;
                        }
                    }
                }

                > img {
                    width: 80vw;
                    border-radius: 2.5690073% / 4.3147884%;
                    box-shadow: 0 0 14.263729095458984px 0 rgba(139, 22, 202, 0.30),
                    0 14.263729095458984px 32.09339141845703px 0 rgba(139, 22, 202, 0.29),
                    0 57.9463996887207px 57.9463996887207px 0 rgba(139, 22, 202, 0.26),
                    0 130.15652465820312px 77.55902862548828px 0 rgba(139, 22, 202, 0.15),
                    0 230.8941192626953px 92.71424102783203px 0 rgba(139, 22, 202, 0.04),
                    0 361.0506286621094px 100.73758697509766px 0 rgba(139, 22, 202, 0.01);
                }
            }

            @include media-breakpoint-down(lg) {
                flex-direction: column;

                .text-block {
                    width: 80vw;

                    p.overline {
                        margin: 0 auto;
                        font-size: $font-size-sm;
                        line-height: 1.25rem;

                        &::after {
                            display: none !important;
                        }
                    }

                    h1 {
                        font-size: 1.625rem;
                        line-height: 1.5;
                        font-weight: 700;

                        .dot {
                            font-size: 2.7rem;
                            line-height: 0;
                        }
                    }
                }
            }
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

        .overline {
            color: #BAE6FE;
        }
    }
</style>
