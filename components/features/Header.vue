<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6">
                    <h1>Fast, Scalable, and Declarative Data Management</h1>
                    <h2>Create and Deploy all kinds Data Pipelines with Ease and Speed with Kestra: Your All-in-One Solution for Orchestrating Workflows</h2>
                    <div class="cta">
                        <NuxtLink href="/docs/getting-started" class="btn btn-lg btn-primary me-2">
                            Get started <Flash />
                        </NuxtLink>
                        <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-primary">
                            Try live tool
                        </a>
                    </div>
                </div>
                <div class="col-md-6">
                    <img src="/landing/features/features-ui.png" width="600"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Flash from "vue-material-design-icons/Flash.vue";

    export default {
        components: {Flash},
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

