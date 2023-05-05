<template>
    <div class="main">
        <div class="hero container text-center">
            <p class="overline" data-aos="fade-left">OPEN SOURCE DECLARATIVE DATA ORCHESTRATION</p>
            <h1 data-aos="fade-right">Build stunning data pipelines, blazing fast, deploy in clicks<span class="dot">.</span></h1>
            <div class="text-center cta">
                <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-primary me-2" data-aos="zoom-in">
                    <Console /> Live demo
                </a>
                <GithubButton class="btn-secondary btn-lg" data-aos="zoom-in" />
            </div>

            <ClientOnly>
                <HeaderAnimation />
            </ClientOnly>
<!--            <img class="img-fluid" src="/landing/home/animation.svg"   alt="Kestra's flow animation from source to visualization" />-->
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
</template>

<script>
    import Magnify from "vue-material-design-icons/Magnify.vue";
    import Console from "vue-material-design-icons/Console.vue"
    import GithubButton from "../layout/GithubButton.vue";
    import Companies from "../layout/Companies.vue";
    import HeaderAnimation from './HeaderAnimation.vue';

    export default {
        components: {Console, Magnify, GithubButton, Companies, HeaderAnimation},
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