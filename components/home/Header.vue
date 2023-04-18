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

            <img src="/landing/home/animation.svg" alt="" />
        </div>

        <div class=" container text-center">
            <p class="companies-title">
                Loved & trusted by leading enterprises worldwide
            </p>

        </div>

        <div class="container-fluid pt-4 pb-4">
            <div class="companies">
                <template v-for="(img, index) in companies">
                    <img
                        data-aos="fade-up"
                        :data-aos-delay="index*50"
                        :src="'/landing/home/companies/' + img  + '.svg'"
                        :alt="img"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import Magnify from "vue-material-design-icons/Magnify.vue";
    import Console from "vue-material-design-icons/Console.vue"
    import GithubButton from "../layout/GithubButton.vue";

    export default {
        components: {Console, Magnify, GithubButton},
        computed: {
            companies() {
                return [
                    "aimtec",
                    "cleverconnect",
                    "decathlon",
                    "dnb",
                    "fortinet",
                    "hcl",
                    "huawei",
                    "iqtig",
                    "leroymerlin",
                    "ntico",
                    "tencent",
                    "twosix",
                    "facily",
                ]
                    .sort(() => .5 - Math.random())
            },
        }
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
                max-width: 900px;
            }

            p {
                max-width: 900px;
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

        .companies {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;

            img {
                margin-right: calc($spacer * 2);
            }
        }
    }
</style>