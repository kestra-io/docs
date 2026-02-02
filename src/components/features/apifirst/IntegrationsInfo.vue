<template>
    <Section subtitle="Productivity and Integration" class="p-3">
        <div class="container">
            <div class="row mb-5 align-items-center">
                <div class="col-md-6 order-1 order-md-1" data-usal="fade-l">
                    <h3>
                        CI/CD and Code<br />
                        Management
                    </h3>
                    <p>
                        Being API-first means Kestra integrates seemlessly with CI/CD pipelines,
                        offering a streamlined path from code development in your local IDE to
                        deployment through tools like GitHub Actions. This integration ensures that
                        your workflows remain in sync with your codebase.
                    </p>
                </div>
                <div class="col-md-6 order-0 order-md-0 mask mb-3" data-usal="fade-l">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="568px"
                        height="420px"
                        class="img-fluid"
                        src="/landing/features/apifirst/manage-code.svg"
                        alt="High availability Schema"
                    />
                </div>
            </div>
            <div class="row mb-5 align-items-center">
                <div class="col-md-6 order-1 order-md-0" data-usal="fade-r">
                    <h3>Development Flexibility</h3>
                    <p>
                        Choose your development environment with confidence, knowing that whether
                        you prefer to code directly in the Kestra UI or in your favorite IDE, our
                        platform supports your workflow. Our API-first approach guarantees that your
                        integration with Git and other version control systems is straightforward,
                        maintaining a single source of truth for your projects.
                    </p>
                </div>
                <div class="col-md-6 order-0 order-md-1 mask-1" data-usal="fade-l">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="492px"
                        height="314px"
                        class="img-fluid"
                        src="/landing/features/apifirst/development-flexibility.svg"
                        alt="Docker Integration for Script Execution"
                    />
                </div>
            </div>
        </div>
    </Section>
</template>

<script lang="ts" setup>
    import Section from "~/components/layout/Section.vue"
</script>

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

        .mask {
            position: relative;

            &::after {
                position: absolute;
                content: "";
                right: 128px;
                bottom: 112px;
                z-index: -2;
                background: linear-gradient(180deg, rgba(98, 24, 255, 0), #6117ff 100%);
                filter: blur(65px);
            }

            &::before {
                position: absolute;
                content: "";
                left: 43px;
                top: -33px;
                z-index: -1;
                background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
                filter: blur(100px);
            }

            &::after,
            &::before {
                width: calc($spacer * 22.375);
                height: calc($spacer * 13.375);
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
                right: 199px;
                bottom: 52px;
                z-index: -2;
                background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
                filter: blur(100px);
                width: 14.375rem;
                height: 10.375rem;
            }
        }
    }
</style>