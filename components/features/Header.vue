<template>
    <div class="main">
        <div class="hero container text-center">
            <h1>Build stunning data pipelines, blazing fast, deploy in clicks<span class="dot">.</span></h1>
            <h2>Build declarative data pipelines at scale. Edit your code live from the UI and benefit from faster feedback loops without CI/CD</h2>
            <div class="text-center cta">
                <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-primary me-2">
                    <Console /> Live demo
                </a>
                <a href="/docs/getting-started" class="btn btn-lg btn-secondary">
                    <Flash /> Getting started
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import Flash from "vue-material-design-icons/Flash.vue";
    import Console from "vue-material-design-icons/Console.vue"
    import Github from "vue-material-design-icons/Github.vue";

    export default {
        components: {Github, Console, Flash},
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
        background: $purple-7;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
    }
</style>