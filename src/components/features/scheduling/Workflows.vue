<template>
    <LayoutSection class="mb-5">
        <div class="row justify-content-center align-items-center">
            <div class="col-12 col-md-5 workflow-image mask text-center" data-usal="fade-l">
                <NuxtImg
                    loading="lazy"
                    format="webp"
                    width="431px"
                    height="347px"
                    src="/landing/features/scheduling/workflow/workflow_1.svg"
                    alt="Centralized Control"
                    class="p-3 mw-100"
                />
            </div>

            <div class="col-12 col-md-5">
                <div class="row justify-content-center px-2 px-md-3">
                    <div class="col-12 col-md-9" data-usal="fade-r">
                        <h3 class="title my-4">Centralized Control</h3>
                        <p class="para">
                            Kestra serves as a unified platform that allows you to automate and
                            schedule tasks across a wide range of business-critical systems. From
                            CRM and ERP to Big Data and Business Intelligence, Kestra ensures that
                            all your systems work together seamlessly, requiring minimal human
                            intervention.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-5">
                <div class="row justify-content-center px-2 px-md-3">
                    <div class="col-12 col-md-9" data-usal="fade-l">
                        <h3 class="title">Event-Driven Workflows Without Spaghetti Code</h3>
                        <p class="para">
                            Whether you're looking to trigger flows based on the results of other
                            flows, file detection from various sources like SFTP or Google Cloud
                            Storage, or even the outcomes of SQL queries, Kestra offers a versatile
                            set of triggers to meet all your automation needs.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-5 workflow-image text-center" data-usal="fade-r">
                <NuxtImg
                    loading="lazy"
                    format="webp"
                    width="456px"
                    height="668px"
                    src="/landing/features/scheduling/workflow/workflow_2.svg"
                    alt="Event Driven"
                    class="mw-100"
                />
            </div>
            <div class="col-12 col-md-5 workflow-image mask-1 text-center" data-usal="fade-l">
                <NuxtImg
                    loading="lazy"
                    format="webp"
                    width="508px"
                    height="385px"
                    src="/landing/features/scheduling/workflow/workflow_3.svg"
                    alt="Everything as code"
                    class="mw-100"
                />
            </div>
            <div class="col-12 col-md-5">
                <div class="row justify-content-center px-2 px-md-3">
                    <div class="col-12 col-md-9" data-usal="fade-r">
                        <h3 class="title">Everything as Code</h3>
                        <p class="para">
                            Manage your resources programmatically, ensuring reproducibility,
                            version control, and seamless collaboration.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </LayoutSection>
</template>

<script lang="ts" setup>
    import LayoutSection from "~/components/layout/Section.vue"
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .row {
        --bs-gutter-x: 0rem !important;
        color: $white;
    }

    p {
        line-height: 1.5rem;
    }

    .title {
        font-weight: 300 !important;
        font-size: $h2-font-size !important;
    }

    .para {
        font-weight: 300 !important;
    }

    .section {
        padding: calc($spacer * 4) 0;
    }

    .plugin {
        &-title {
            font-size: $font-size-3xl !important;
            font-weight: 300;
            margin-bottom: 0;
        }

        &-title-animated {
            background: var(--Text_gradient, linear-gradient(90deg, #e151f7 2.16%, #5c47f5 65.09%));
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        &-para {
            font-weight: 400;
            font-size: $font-size-base;
        }
    }

    .btn-dark {
        --bs-btn-bg: $black-4;
        --bs-btn-hover-bg: $black-4;
        border: 1px solid $black-6;
    }

    .mask {
        position: relative;

        &::after {
            position: absolute;
            content: "";
            height: 266.49px;
            width: 170px;
            right: 0;
            bottom: 0;
            z-index: 1;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0), #6117ff 100%);
            filter: blur(100px);
        }

        &::before {
            position: absolute;
            content: "";
            height: 266.49px;
            width: 170px;
            left: 0;
            top: -150px;
            z-index: 1;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
            filter: blur(100px);
        }
    }

    .mask-1 {
        position: relative;

        & > img {
            z-index: 10;
        }

        &::after {
            position: absolute;
            content: "";
            height: 266.49px;
            width: 170px;
            left: 0px;
            top: -150px;
            z-index: 1;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
            filter: blur(100px);
        }

        &::before {
            position: absolute;
            content: "";
            width: 113.62px;
            height: 189.44px;
            right: 0px;
            bottom: 0px;
            z-index: 1;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
            filter: blur(70px);
        }
    }

    @include media-breakpoint-down(lg) {
        .title {
            font-size: $h3-font-size !important;
        }
    }
</style>