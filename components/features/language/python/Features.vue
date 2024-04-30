<template>
    <section class="container">
        <div class="row d-flex justify-content-center mb-5">
            <div class="col-7">
                <h2 class="text-center text-white">Advanced Python Scripting with Kestra</h2>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100" data-aos="fade-right">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/language/python/icon-customize.svg"
                                alt="BackFill pattern svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">Customize at Runtime</h6>
                        </div>
                        <p class="card-para">
                            Add any Python package to your environment as your workflows demand, maintaining flexibility without pre-configurations.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex" data-aos="fade-right">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/language/python/icon-sync.svg"
                                alt="Tune-Based svg"
                                 class="mb-2 "
                            />
                            <h6 class="card-heading">Import or Sync your Entire Project</h6>
                        </div>
                        <p class="card-para">
                            Sync your  Python project into Kestra. Enjoy comprehensive support for all your dependencies and modules.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex" data-aos="fade-right">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/language/python/icon-cloud.svg"
                                alt="Event-Driven svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">Cloud-Agnostic Execution</h6>
                        </div>
                        <p class="card-para">
                            Deploy and execute your Python scripts on any cloud with Kestra’s Task Runners. Optimize for performance, cost, compliance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
  import Section from '../../../layout/Section.vue';
</script>
<style scoped lang="scss">
    @import "../../../../assets/styles/variable";

    .container {
        padding: calc($spacer * 4) 0;
        background-image: url('/landing/features/scheduling/masking.svg');
        position: relative;
        z-index: 99;

        h2 {
            font-weight: 600;
            font-size: 50px;
            font-family: $font-family-sans-serif;
        }

        .heading{
            max-width: 500px;
        }

        .title {
            font-weight: 300;
            font-size: $font-size-3xl;

            &-animated {
                background: linear-gradient(90deg, #E151F7 57.52%, #5C47F5 92.48%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;

            }
        }

    }

    h3 {
        text-align: center;
        margin-bottom: 0;
    }

    .card {
        background-color: $black-2;
        color: $white;
        z-index: 99;
        box-shadow: none !important;

        &-body {
            padding: 2rem;
        }

        &-heading {
            font-size: $font-size-xl;
            font-weight: 300;
            line-height: 2rem;
        }

        &-para {
            font-size: $font-size-sm;
            font-weight: 400;
            line-height: 1.375;
            color: $white-1;
        }
    }
</style>