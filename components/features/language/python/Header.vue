<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row justify-content-between">
                <div class="col-md-6 align-items-center d-flex order-1 order-md-0">
                    <div class="text-white">
                        <h1 data-aos="fade-right" class="heading">
                            Orchestrate <br> your
                            <span>Python Scripts</span>
                        </h1>
                        <p class="baseline" data-aos="fade-left">
                            Build declaratively your workflows and seamlessly run all your Python Scripts
                        </p>

                        <div class="cta">
                            <NuxtLink
                                href="/docs/getting-started"
                                class="btn btn-animated btn-purple-animated mt-2"
                                data-aos="zoom-in"
                            >
                                Get started
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div
                    class="col-md-5 order-0 order-md-1 mt-3 img-container"
                    data-aos="zoom-in"
                >
                    <NuxtImg
                        width="925px"
                        height="745px"
                        loading="lazy"
                        format="webp"
                        class="img-fluid headerimg"
                        src="/landing/features/language/python/header.svg"
                        alt="A screenshot of the user interface of Kestra's application"
                    />
                </div>
            </div>
            <hr class="line" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../../../assets/styles/variable";

    .container-fluid {
        background: $black-4;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
        background-image: url(/landing/features/mask.svg);

        .line {
            background: rgba(255, 255, 255, 0.1) !important;
            height: 1px !important;
            margin-top: calc($spacer * 4);
        }
    }

    .heading {
        font-size: $font-size-4xl;
        font-weight: 400;
        line-height: 3.7rem;
        @include media-breakpoint-down(lg) {
            line-height: calc($font-size-base * 1.625);;
        }

        span {
            background: linear-gradient(90.03deg, #E151F7 2.16%, #5C47F5 65.09%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: $white;
        }
    }

    .baseline {
        font-weight: 300;
        line-height: 2rem;
        font-size: $font-size-xl;
    }

    .btn {
        border: 1px solid #3d3d3f !important;
        background-color: $black-4 !important;
    }

    .headerimg {
        transform: scale(1.3);
        z-index: 50;
    }

    .hero {
        padding-top: calc($spacer * 4);
    }
</style>
