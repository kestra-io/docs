<template>
    <div class="container-fluid container">
        <div class="hero hero-sm mx-2 sm-mx-0">
            <div class="row" data-usal="fade-r">
                <div class="col-12 col-md-8 col-lg-6 order-1 order-md-0">
                    <h1>Deploy All Your Workflows With our Terraform Provider</h1>
                    <p class="description mt-3">
                        Manage and deploy Kestra workflows directly<br />within your existing
                        Terraform environment
                    </p>
                    <div class="d-flex flex-wrap gap-2">
                        <a href="/docs/terraform">
                            <button class="btn btn-animated btn-dark-animated">
                                Read the docs
                            </button>
                        </a>
                        <a href="/docs/terraform">
                            <button class="btn btn-animated btn-purple-animated">
                                Get Started
                            </button>
                        </a>
                    </div>
                </div>
                <div class="order-0 order-md-1 d-flex d-md-none">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="678px"
                        height="667px"
                        class="img-container img-fluid"
                        src="/terraform/header/background.svg"
                        alt="terraform logo with a dark background"
                        data-usal="zoomin"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container-fluid {
        background: url("/terraform/header/bg.svg") no-repeat center !important;
        background-size: 100% 100% !important;
        border-bottom: $block-border;

        @include media-breakpoint-down(md) {
            background-image: none !important;
        }

        h1,
        .subtitle {
            margin: 0;
            padding: 0;
        }

        h1 {
            font-size: $h1-font-size;
            font-weight: 400;
        }

        @include media-breakpoint-down(sm) {
            h1 {
                font-size: 1.625rem !important;
            }
        }

        .subtitle {
            font-size: 1.875rem;
            font-weight: 100;
        }

        .description {
            font-size: $font-size-xl;
            font-weight: 300;
        }

        .img-container {
            position: relative;
            transform: scale(1.3);
            margin-bottom: 50px;
            left: 20px;
            transform-origin: 40% 30%;
        }

        .hero {
            @include media-breakpoint-down(md) {
                padding-top: 0;
            }
        }
    }
</style>