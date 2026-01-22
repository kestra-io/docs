<template>
    <div class="container mt-3">
        <div class="row mb-5 align-items-center">
            <div class="col-md-6 order-1 order-md-1" data-usal="fade-l">
                <h3>Manage your Scripts with the Embedded Code Editor</h3>
                <p>
                    The built-in code editor allows you to develop your orchestration and business
                    logic directly from the Kestra UI. You can create and edit scripts and manage
                    YAML configurations all within Kestra's build-in IDE, eliminating the need to
                    switch between different environments or tools.
                </p>
                <ul>
                    <li>
                        <b>Unified Interface:</b>Centralize your development tasks with an interface
                        that combines scripting and orchestration.
                    </li>
                    <li>
                        <b>Developer Efficiency: </b> Benefit from advanced features like syntax
                        highlighting, autocompletion, and synthax validation.
                    </li>
                    <li>
                        <b>Language Flexibility:</b> Fully compatible with a wide array of
                        programming languages, ensuring your existing codebase can be orchestrated
                        without modifications.
                    </li>
                </ul>
            </div>
            <div class="col-md-6 order-0 order-md-0 mask mb-3" data-usal="fade-l">
                <NuxtImg
                    loading="lazy"
                    format="webp"
                    width="520px"
                    height="282px"
                    class="img-fluid"
                    src="/landing/features/language/manage-scripts.svg"
                    alt="High availability Schema"
                />
            </div>
        </div>
        <div class="row mb-5 align-items-center">
            <div class="col-md-6 order-1 order-md-0" data-usal="fade-r">
                <h3>Docker Integration for Script Execution</h3>
                <p>
                    Run your scripts in isolated environments with Docker. Kestra's Docker support
                    allows for consistent execution across different environments, simplifying
                    dependency management and deployments. Define Docker parameters directly within
                    your workflow configurations for maximum flexibility.
                </p>
            </div>
            <div class="col-md-6 order-0 order-md-1 mask-1" data-usal="fade-l">
                <NuxtImg
                    loading="lazy"
                    format="webp"
                    width="627px"
                    height="460px"
                    class="img-fluid"
                    src="/landing/features/language/docker-integration.svg"
                    alt="Docker Integration for Script Execution"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container {
        border-bottom: $block-border;

        h3 {
            color: $white;
            font-size: $h2-font-size;
            font-weight: 300;
        }

        p,
        ul {
            color: $white-1;
            font-size: $font-size-md;
            font-weight: 300;

            b {
                color: $white;
                font-weight: 600;
            }
        }

        .mask,
        .mask-1 {
            &::after,
            &::before {
                width: calc($spacer * 9.375);
                height: calc($spacer * 9.375);
            }
        }
        .mask {
            position: relative;
            &::after {
                position: absolute;
                content: "";
                right: 86px;
                bottom: -4px;
                z-index: -2;
                background: linear-gradient(180deg, rgba(98, 24, 255, 0), #6117ff 100%);
                filter: blur(65px);
            }
            &::before {
                position: absolute;
                content: "";
                left: -13px;
                top: -65px;
                z-index: -1;
                background: linear-gradient((180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%));
                filter: blur(65px);
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
                right: 86px;
                bottom: 5px;
                z-index: -2;
                background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
                filter: blur(65px);
            }
            &::before {
                position: absolute;
                content: "";
                left: 3px;
                top: 8px;
                z-index: -1;
                background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
                filter: blur(65px);
            }
        }
    }
</style>