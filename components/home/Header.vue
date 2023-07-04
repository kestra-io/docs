<template>
    <div class="main">
        <div class="hero container text-center">
            <p class="overline" data-aos="fade-left">OPEN SOURCE DECLARATIVE DATA ORCHESTRATION</p>
            <h1 data-aos="fade-right">Build reliable workflows, blazingly fast, deploy in just a few clicks<span class="dot">.</span></h1>
            <div class="text-center cta">
                <a href="https://demo.kestra.io/ui/login?auto" target="_blank" class="btn btn-lg btn-secondary me-2" data-aos="zoom-in">
                    <Console /> Live Demo
                </a>
                <a href="#" class="btn btn-lg btn-primary" data-aos="zoom-in" data-bs-toggle="modal" data-bs-target="#home-intro">
                    <PlayCircleOutline /> Product Video
                </a>
            </div>

            <img class="img-fluid" src="/landing/home/animation.svg"  alt="Kestra's flow animation from source to visualization" />
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
    import Magnify from "vue-material-design-icons/Magnify.vue";
    import Console from "vue-material-design-icons/Console.vue"
    import PlayCircleOutline from "vue-material-design-icons/PlayCircleOutline.vue"
    import GithubButton from "../layout/GithubButton.vue";
    import Companies from "../layout/Companies.vue";
    import HeaderAnimation from './HeaderAnimation.vue';
    import ContentCopy from "vue-material-design-icons/ContentCopy.vue";
    import Check from "vue-material-design-icons/Check.vue";

    export default {
        components: {Console, Magnify, PlayCircleOutline, GithubButton, Companies, HeaderAnimation},
        data() {
            return {
                videoVisible: false
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main {
        background: linear-gradient(160.34deg, rgba(130, 0, 255, 0.3) 5.3%, rgba(130, 0, 255, 0) 75.43%), #040114;

        > * {
            z-index:2;
            position: relative;
        }

        &:after {
            background: url("/landing/home/header-bg.svg") center bottom no-repeat;
            content:'';
            position: absolute;
            width: 100%;
            height: 702px;
            margin-top: -702px;
            z-index: 1;
        }

        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;

        .hero {
            h1 {
                max-width: 1024px;
            }

            p {
                max-width: 1024px;
            }

            .cta {
                padding-bottom: 0;
            }
        }

        .animation {
            max-width: 1300px;
            margin: 0 auto;
        }
        .companies-title {
            position: relative;

            &:after {
                content: '';
                position: absolute;
                left: 50%;
                top: 2.5rem;
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
