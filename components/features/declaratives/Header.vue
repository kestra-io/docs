<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6 align-items-center d-flex">
                    <div>
                        <h1 data-aos="fade-right">Declarative Data Orchestration with Kestra</h1>
                        <p class="baseline" data-aos="fade-left">Simplified Data Workflow Creation and Execution with YAML</p>
                        <div class="cta">
                            <NuxtLink href="/docs/getting-started" class="btn btn-lg btn-primary mx-2 mt-2" data-aos="zoom-in">
                                Get started
                            </NuxtLink>
                            <a href="/docs"  class="btn btn-lg btn-secondary mx-2 mt-2" data-aos="zoom-in">
                                Read the docs
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6" data-aos="zoom-in">
                    <img class="zoom img-fluid" src="/landing/features/declarative/header.svg" alt="A screenshot of the user interface of Kestra's application"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
    }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container-fluid {
        background: #1F1D5E url("/landing/features/declarative/header-bg.svg") no-repeat bottom center;
        background-size: cover;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
    }
</style>

