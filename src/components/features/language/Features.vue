<template>
    <section class="container">
        <div class="row d-flex justify-content-center">
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100" data-usal="fade-r">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/scheduling/automation/Icon_auto.svg"
                                alt="BackFill pattern svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">Code in any language</h6>
                        </div>
                        <p class="card-para">
                            Orchestrate custom business logic in Python, R, Java, Julia, Ruby, and
                            any kind of language, thanks to Docker.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex" data-usal="fade-r">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/scheduling/automation/Icon_auto1.svg"
                                alt="Tune-Based svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">
                                Script Management with Embedded Code Editor
                            </h6>
                        </div>
                        <p class="card-para">
                            Our built-in code editor simplifies script editing and management
                            directly within Kestra.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex" data-usal="fade-r">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/scheduling/automation/Icon_auto2.svg"
                                alt="Event-Driven svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">Separation of Concerns</h6>
                        </div>
                        <p class="card-para">
                            Kestra's design ensures a clear distinction between orchestration and
                            business logic, keeping your code portable and platform-independent.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex" data-usal="fade-r">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/scheduling/automation/Icon_auto3.svg"
                                alt="API-Based svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">Built-in Version Control with Git</h6>
                        </div>
                        <p class="card-para">
                            Synchronize your code changes between Git and Kestra in both directions
                            — sync code from Git or push your code built in Kestra’s IDE to Git.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex" data-usal="fade-r">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/scheduling/automation/Icon_auto4.svg"
                                alt="Subflow svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">Docker enabled by default</h6>
                        </div>
                        <p class="card-para">
                            No need to worry about building Docker images and managing the container
                            lifecycle — we’ll do that automatically for you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
    import Section from "~/components/layout/Section.vue"
</script>
<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container {
        padding: calc($spacer * 4) 0;
        background-image: url("/landing/features/scheduling/masking.svg");
        position: relative;
        z-index: 99;

        &::after {
            content: "";
            position: absolute;
            height: calc($spacer * 20);
            width: calc($spacer * 23);
            right: 19%;
            bottom: calc($spacer * 10);
            z-index: 10;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0), #6117ff 100%);
            filter: blur(100px);
        }

        .heading {
            max-width: 500px;
        }

        .title {
            font-weight: 300;
            font-size: $font-size-3xl;

            &-animated {
                background: linear-gradient(90deg, #e151f7 57.52%, #5c47f5 92.48%);
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