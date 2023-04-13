<template>
    <div class="main">
        <div class="hero container text-center">
            <h1>Build stunning data pipelines, blazing fast, deploy in clicks<span class="dot">.</span></h1>
            <h2>Build declarative data pipelines at scale. Edit your code live from the UI and benefit from faster feedback loops without CI/CD</h2>
            <div class="text-center cta">
                <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-primary me-2">
                    <Console /> Live demo
                </a>
                <a href="https://github.com/kestra-io/kestra" target="_blank" class="btn btn-lg btn-secondary">
                    <Github /> Github {{ stargazersText }} ⭐️
                </a>
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
                <template v-for="img in companies">
                    <img
                        :src="'/landing/home/companies/' + img  + '.svg'"
                        alt=""
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import Magnify from "vue-material-design-icons/Magnify.vue";
    import Console from "vue-material-design-icons/Console.vue"
    import Github from "vue-material-design-icons/Github.vue";
    import {stargazers} from "../../utils/github.js";

    export default {
        components: {Github, Console, Magnify},
        data() {
            return {
                stargazersText: undefined
            }
        },
        created() {
             stargazers().then(value => this.stargazersText = value);
        },
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