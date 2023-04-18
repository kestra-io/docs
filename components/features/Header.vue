<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6">
                    <h1>Fast, Scalable, and Declarative Data Management</h1>
                    <p class="baseline">Create and Deploy all kinds of Data Pipelines with Ease and Speed with Kestra: Your All-in-One Solution for Orchestrating Workflows</p>
                    <div class="cta">
                        <NuxtLink href="/docs/getting-started" class="btn btn-lg btn-primary me-2">
                            <Flash /> Get started
                        </NuxtLink>
                        <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-primary">
                            <Console /> Live demo
                        </a>
                    </div>
                </div>
                <div class="col-md-6">
                    <img src="/landing/features/features-ui.png" width="600" alt="A screenshot of the user interface of Kestra's application"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Flash from "vue-material-design-icons/Flash.vue";
    import Console from "vue-material-design-icons/Console.vue"

    export default {
        components: {Flash, Console},
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-19;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
    }
</style>

