<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="container-title mb-5">
                <h2 class="title">Orchestrating Python Scripts with <span>Kestra</span></h2>
            </div>
            <div class="row mb-5 align-items-center justify-content-between">
                <div class="col-md-5 order-1 order-md-0"
                     data-aos="fade-right">
                    <h3>Embrace GitOps best practices for your Python scripts</h3>
                    <p>
                        Kestra takes Python script orchestration to the next level by embracing Continuous
                        Integration/Continuous Deployment (CI/CD) and GitOps principles. Manage your Python workflows
                        with the same rigor as your application code: version control, automated testing, and
                        consistent, repeatable deployment environments. Kestra lets you define workflows in YAML,
                        ensuring that your orchestration is as maintainable and scalable as your applications.
                    </p>
                </div>
                <div class="col-md-6 order-0 order-md-1 mask" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="520px"
                        height="282px"
                        class="img-fluid"
                        src="/landing/features/language/git-with-kestra.svg"
                        alt="Embrace GitOps best practices"
                    />
                </div>
            </div>
            <div class="row mb-5 align-items-center justify-content-between">
                <div class="col-md-5 order-1 order-md-1"
                     data-aos="fade-left">
                    <h3>Integration with Docker, Seamless Environment Management</h3>
                    <p>
                        Managing environments for Python scripts doesn't have to be complicated. With Kestra’s Docker
                        integration, each part of your Python workflow can be containerized, ensuring that they run in
                        isolated and consistent settings. From Kestra's intuitive editor, you can control Docker
                        containers, manage dependencies, and scale your scripts across multiple environments without
                        ever leaving the platform. This integration simplifies environment inconsistencies and enhances
                        reproducibility.
                    </p>
                </div>
                <div class="col-md-6 order-0 order-md-0 mask mb-3" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="627px"
                        height="460px"
                        class="img-fluid"
                        src="/landing/features/language/python/scripts/docker.svg"
                        alt="Docker Integration for Script Execution"
                    />
                </div>
            </div>
            <div class="row mb-5 align-items-center justify-content-between">
                <div class="col-md-5 order-1 order-md-0"
                     data-aos="fade-right">
                    <h3>Embedded Python Scripts for Simplicity</h3>
                    <p>
                        For simpler tasks that require quick, straightforward solutions, Kestra’s Python task feature
                        allows you to embed Python scripts directly into your workflows. This is ideal for small-scale
                        data formatting, quick calculations, or script-based alerts within larger workflows. By
                        embedding scripts directly, Kestra reduces complexity and enhances execution speed, providing a
                        streamlined approach to handle simpler, yet frequent tasks.
                    </p>
                </div>
                <div class="col-md-6 order-0 mask-1 order-md-1 python-scripts" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        height="420px"
                        class="img-fluid"
                        src="/landing/features/language/python/scripts/embedded-python.svg"
                        alt="Embedded Python Scripts"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "../../../../assets/styles/variable";

    .container-fluid {
        position: relative;
        z-index: 1;

        .container {
            border-bottom: $block-border;

            .container-title {
                padding-top: calc($spacer * 4);
                width: 100%;
                display: flex;
                justify-content: center;

                .title {
                    text-align: center;
                    font-size: 50px;
                    font-weight: 600;
                    text-align: center;
                    color: $white;

                    @include media-breakpoint-up(lg) {
                        max-width: 60%;
                        line-height: 50px;
                    }

                    span {
                        background: linear-gradient(90.03deg, #E151F7 2.16%, #5C47F5 65.09%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        color: $white;
                    }
                }
            }

            h3 {
                color: $white;
                font-size: $h2-font-size;
                font-weight: 300;
            }

            p, ul {
                color: $white-1;
                font-size: $font-size-md;
                font-weight: 300;

                b {
                    color: $white;
                    font-weight: 600;
                }
            }

            .mask, .mask-1 {
                position: relative;

                & > img {
                    z-index: 10;
                    width: 100%;
                }

                &::after {
                    width: calc($spacer * 15);
                    height: calc($spacer * 15);
                    position: absolute;
                    content: "";
                    filter: blur(65px);
                    background: linear-gradient(180deg, rgba(98, 24, 255, 0.00) 0%, #6117FF 100%);
                    z-index: -2;
                }
            }

            .mask {

                &::after {
                    right: 214px;
                    bottom: 86px;

                    @include media-breakpoint-down(lg) {
                        right: 38px;
                        bottom: 51px;
                    }

                    @include media-breakpoint-down(md) {
                        right: 26px;
                    }

                }
            }

            .mask-1 {

                &::before {
                    width: 9rem;
                    height: 8rem;
                    position: absolute;
                    content: "";
                    filter: blur(79px);
                    background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
                    z-index: -2;
                    right: 530px;
                    bottom: 312px;
                }

                &::after {
                    right: 139px;
                    bottom: 230px;
                }
            }

            .python-scripts {
                background-image: url(/landing/features/mask.svg);
            }
        }
    }

</style>