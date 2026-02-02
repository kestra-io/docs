<template>
    <div class="feature pt-5">
        <div class="container">
            <div class="text-center">
                <NuxtImg
                    loading="lazy"
                    format="webp"
                    width="568px"
                    height="144px"
                    class="img-fluid"
                    src="/landing/features/scheduling/feature/workflow.svg"
                    alt="A screenshot of the Scheduling Page"
                />
            </div>
            <div class="heading mx-auto pb-4">
                <h2 class="title text-center">
                    Build, Schedule, and Automate
                    <span class="title-animate">All Your Workflows</span>
                </h2>
                <p class="para mb-5">
                    Kestra simplifies your scheduling and automation tasks through its declarative
                    language, making workflow management straightforward. Build to meet the high
                    standards of software engineers, it's designed to be user-friendly for both
                    engineers and business stakeholders.
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .feature {
        background-color: $black-1;
        color: $white;
    }

    .container {
        border-bottom: $block-border;
    }

    .heading {
        max-width: 700px;

        .title {
            line-height: 3.625rem;
            text-align: center;
            font-weight: 300 !important;
            margin-bottom: 0;
            font-size: $font-size-3xl;
            @include media-breakpoint-down(md) {
                line-height: 2.625rem;
            }

            &-animate {
                background: linear-gradient(90deg, #e151f7 24.82%, #5c47f5 76.81%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }

    .para {
        text-align: center;
        font-size: $font-size-base !important;
        max-width: $baseline-max-width;
        margin: $spacer auto 0;
        line-height: 1.5rem;
        font-weight: 400;
        font-size: $h6-font-size;
    }

    .line {
        height: 1px;
        background: $black-6;
    }
</style>