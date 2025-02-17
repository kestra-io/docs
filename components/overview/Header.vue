<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-12 d-flex justify-content-center header-content">
                    <div class="text-white">
                        <h1 class="heading">Orchestrate Your <span>Platform</span> with Kestra</h1>
                        <p class="text-white baseline fs-4">Orchestrate your business-critical applications and deliver business and
                            analytics-ready data at scale</p>
                        <div class="text-center">
                            <NuxtLink
                                href="/demo"
                                class="btn text-white btn-animated btn-dark-animated me-2 mb-2"
                                data-aos="zoom-in"
                            >
                                Get a demo
                            </NuxtLink>
                            <NuxtLink
                                href="/docs/getting-started/quickstart#start-kestra"
                                class="btn text-white btn-animated btn-purple-animated mb-2"
                                data-aos="zoom-in"
                            >
                                Get started
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Lan"
                        title="Everything As Code"
                        description="Manage your resources programmatically, ensuring reproducibility, version control, and seamless collaboration."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="ToyBrickPlus"
                        title="Everything from the UI"
                        description=" Create and oversee workflows through Kestra user interface. build, test, deploy, run, and iterate on your workflows from a single interface."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        img="/landing/overview/everything-ui.svg"
                        imgAlt="Run Anywhere"
                        title="Run Anywhere, Code in Any Language"
                        description="Use YAML for workflow definitions, and choose any programming language for your scripts."
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
  import Lan from "vue-material-design-icons/Lan.vue"
  import ToyBrickPlus from "vue-material-design-icons/ToyBrickPlus.vue";
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $black-4;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
        background-image: url(/landing/overview/mask.svg);
        z-index: 1;
        position: relative;
        overflow: hidden;
        .line {
            background: rgba(255, 255, 255, 0.1) !important;
            height: 1px !important;
        }

        &::before {
            content: "";
            position: absolute;
            background: url("/landing/overview/hero-bg.svg") no-repeat 100% 100%;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            right: 0;
            top: 60%;
            z-index: -1;

            @include media-breakpoint-down(lg) {
                top: 45%;
            }
        }

        .header-content {
            padding-bottom: calc($spacer * 2.13);
        }
    }

    .heading {
        font-size: $font-size-4xl;
        font-weight: 400;
        line-height: 3.7rem;
        text-align: center;
        font-weight: 300;

        span {
            background: linear-gradient(90deg, #E151F7 -3.38%, #5C47F5 34.75%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .baseline {
        font-weight: 300;
        line-height: calc($spacer * 1.6);
        font-size: $font-size-lg !important;
        text-align: center;
    }

    .headerimg {
        transform: scale(1.3);
        z-index: 50;
    }

    .hero {
        padding-top: 5rem;
        padding-bottom: 5rem;

        .cta {
            display: flex;
            justify-content: center;
            gap: $spacer;
            padding-bottom: calc($spacer * 0.6);
        }
    }

    :deep(.slug) {
        margin-left: 0;
        color: $purple;
    }

    :deep(.link) {
        color: $purple;
    }

    :deep(.card) {
        padding: 3rem 2rem calc($spacer * 1.5);
        .card-body {
            gap: calc($spacer * 0.5) !important;

            .title-block {
                flex-direction: column;

                h4 {
                    margin: 0 !important;
                }

                .card-icon {
                    img {
                        width: auto !important;
                        height: auto !important;
                    }
                }
            }
        }
    }
</style>
