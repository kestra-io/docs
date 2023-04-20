<template>
    <div class="main">
        <div class="hero container text-center">
            <p class="overline">OPEN SOURCE DECLARATIVE DATA ORCHESTRATION</p>
            <h1>Build stunning data pipelines, blazing fast, deploy in clicks<span class="dot">.</span></h1>
            <div class="text-center cta">
                <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-primary me-2">
                    <Console /> Live demo
                </a>
                <GithubButton class="btn-secondary btn-lg" />
            </div>

            <img class="img-fluid" src="/landing/home/animation.svg" alt="Kestra's flow animation from source to visualization" />
        </div>

        <div class=" container text-center">
            <p class="companies-title">
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

    export default {
        components: {Console, Magnify, GithubButton, Companies},
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main {
        background: #040114 url("/landing/home/Intro.svg") center no-repeat;
        background-size: cover;
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