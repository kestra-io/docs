<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6 align-items-center d-flex">
                    <div>
                        <h1 data-aos="fade-right" class="title-1 title">Scheduling </h1>
                        <h1 data-aos="fade-right" class="title-2 title">and Automation</h1>
                        <p class="baseline" data-aos="fade-left" >Automate all your workflows with Kestra</p>
                        <div class="cta">
                            <NuxtLink href="/demo" class="btn btn-animated btn-dark-animated  mt-2" data-aos="zoom-in">
                                Book a demo
                            </NuxtLink>
                            <a href="/docs"  class="btn btn-animated btn-purple-animated mx-2  mt-2" data-aos="zoom-in">
                                Get started!
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6" data-aos="zoom-in">
                    <img class="zoom img-fluid" src="/landing/features/scheduling/header/header.svg" alt="A screenshot of the Scheduling page"/>
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
        background-color: $black-4;
        background-size: cover;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
    }
    .baseline{
        font-weight: 300;
        font-size: $font-size-xl;
    }
    .title{
        font-weight: 300;
        font-size: $h1-font-size;
        margin:0;
        &-1{
            background: linear-gradient(90deg, #E151F7 0.45%, #5C47F5 43.61%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding: 0 !important;
        }
    }
</style>
