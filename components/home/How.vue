<template>
    <div class="container">
        <Section
            subtitle="Language-Agnostic Workflows"
            subtitle-after="At Any Scale"
        >
            <div class="item workflow-1 row pb-5">
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <h3>Define your workflows</h3>
                    <p>
                        By using Kestra as your orchestrator, you can easily automate complex workflows, integrate with your existing data stack, and improve the speed and efficiency of your data processing.
                    </p>
                </div>
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/how/how-1.svg" alt="How to define a flow example" />
                </div>
            </div>

            <div class="item workflow-2 row mb-5">
                <div class="col-md-6 order-1 order-md-0" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/how/how-2.svg" alt="Integration with all data stacks" />
                </div>
                <div class="col-md-6 p-5 order-0 order-md-1" data-aos="fade-left">
                    <h3>Integrate with your stack</h3>
                    <p>Kestra integrates with a wide variety of data sources and tools, so you can easily connect your workflows to your existing data stack. This includes support for popular databases, file formats, APIs, and more.</p>
                </div>
            </div>

            <div class="item workflow-3 row mb-5">
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <h3>Schedule your workflows</h3>
                    <p>Configure your workflows to run on a schedule, in response to event-based triggers, via webhooks, or through APIs.</p>
                </div>
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/how/how-3.svg" alt="How to schedule example" />
                </div>
            </div>

            <div class="item workflow-4 row pb-5">
                <div class="col-md-6 order-1 order-md-0" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/how/how-4.svg" alt="How to execute a flow example" />
                </div>
                <div class="col-md-6 p-5 order-0 order-md-1" data-aos="fade-left">
                    <h3>Execute your workflows</h3>
                    <p>
                        When a workflow is triggered, Kestra orchestrates the execution of each step, ensuring that data is processed correctly and dependencies are satisfied.
                    </p>
                </div>
            </div>

            <div class="item workflow-5 row mb-5">
                <div class="col-md-6 p-5" data-aos="fade-right">
                    <h3>Monitor and optimize your workflows</h3>
                    <p>Track the performance of your workflows, identify bottlenecks, and optimize them for speed and efficiency.</p>
                </div>
                <div class="col-md-6 row mb-5" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/how/how-5.svg" alt="Visualization of Kestra monitoring" />
                </div>
            </div>

            <div class="text-center how-footer">
                <p class="last-words" data-aos="fade-left">
                    By using Kestra as your orchestrator, you can easily automate complex workflows, integrate with your existing data stack, and improve the speed and efficiency of your data processing.
                </p>
                <NuxtLink href="/docs/getting-started" class="btn btn-animated btn-purple-animated me-2" data-aos="zoom-in">
                    Get started
                </NuxtLink>
                <a href="https://demo.kestra.io/ui/login?auto" target="_blank" class="btn btn-animated btn-dark-animated me-2" data-aos="zoom-in">
                    Live demo
                </a>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        :deep(section) {
            border-bottom: $container-border;

            .subtitle {
                margin: 0 !important;
                max-width: 52%;

                p {
                    text-align: left !important;
                }
            }
        }

        .item {
            h3 {
                color: $white;
                font-family: $font-family-sans-serif;
                font-size: 49px;
                font-style: normal;
                font-weight: 300;
                line-height: 54px;
            }

            p {
                color: #DEE0E4;
                font-family: $font-family-sans-serif;
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: 26px;
            }

        }

        .workflow {
            &-1, &-2, &-3, &-4, &-5 {
                h3 {
                    position: relative;
                }
                @include media-breakpoint-down(md) {
                    margin-top: 0 !important;
                    padding-top: 0 !important;

                    h3:before {
                        display: none !important;
                    }
                }
            }

            &-1 {
                padding-top: 115px;
                background: url("/landing/how/bg-1.svg") no-repeat right;
                background-size: 50%;

                h3:before {
                    background: url("../../public/landing/how/connection-line-1.svg");
                    width: 217px;
                    height: 220px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    content: "";
                    position: absolute;
                    top: -220px;
                    left: 50%;
                    transform: translateX(-50%);

                    @include media-breakpoint-down(lg) {
                        left: 80%;
                    }
                }
            }

            &-2 {
                margin-top: 100px;

                @include media-breakpoint-down(xxl) {
                    margin-top: 175px;
                }

                @include media-breakpoint-down(xl) {
                    margin-top: 245px;
                }

                @include media-breakpoint-down(lg) {
                    margin-top: 130px;
                }

                h3:before {
                    background: url("../../public/landing/how/connection-line-2.svg");
                    width: 691px;
                    height: 447px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    content: "";
                    position: absolute;
                    top: -446px;
                    left: -22%;
                    transform: translateX(-50%);

                    @include media-breakpoint-down(xxl) {
                        left: -18%;
                    }

                    @include media-breakpoint-down(xl) {
                        left: -9%;
                    }

                    @include media-breakpoint-down(lg) {
                        top: -285px;
                        left: -10%;
                        width: 445px;
                    }
                }
            }

            &-3 {
                margin-top: 122px;

                @include media-breakpoint-down(xxl) {
                    margin-top: 146px;
                }
                h3:before {
                    background: url("../../public/landing/how/connection-line-3.svg");
                    width: 683px;
                    height: 433px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    content: "";
                    position: absolute;
                    top: -426px;
                    left: 30%;

                    @include media-breakpoint-down(xl) {
                        width: 510px;
                        top: -319px;
                    }

                    @include media-breakpoint-down(lg) {
                        width: 415px;
                        top: -260px;
                    }
                }
            }

            &-4 {
                padding-top: 96px;
                background: url("/landing/how/bg-4.svg") no-repeat left;
                background-size: 45%;

                @include media-breakpoint-down(lg) {
                    padding-top: 270px;
                }
                h3:before {
                    background: url("../../public/landing/how/connection-line-4.svg");
                    width: 639px;
                    height: 595px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    content: "";
                    position: absolute;
                    top: -629px;
                    left: -26%;
                    transform: translateX(-50%);

                    @include media-breakpoint-down(xxl) {
                        width: 510px;
                        top: -467px;
                        left: -30%;
                    }

                    @include media-breakpoint-down(xl) {
                        width: 410px;
                        top: -375px;
                        left: -36%;
                    }

                    @include media-breakpoint-down(lg) {
                        left: -23%;
                    }
                }
            }

            &-5 {
                padding-top: 186px;
                background: url("/landing/how/bg-5.svg") no-repeat right;
                background-size: 64%;

                @include media-breakpoint-down(xxl) {
                    padding-top: 145px;
                }

                @include media-breakpoint-down(xl) {
                    padding-top: 109px;
                }

                h3:before {
                    background: url("../../public/landing/how/connection-line-5.svg");
                    width: 669px;
                    height: 332px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    content: "";
                    position: absolute;
                    top: -321px;
                    left: 26%;

                    @include media-breakpoint-down(xxl) {
                        width: 530px;
                        top: -254px;
                        left: 30%;
                    }

                    @include media-breakpoint-down(xl) {
                        width: 460px;
                        top: -221px;
                        left: 22%;
                    }
                }
            }
        }

        &-footer {
            border-radius: 8px;
            border: 1px solid $black-6;
            background: $black-2;
            padding: 32px;
            position: relative;
            margin-top: 188px;

            @include media-breakpoint-down(md) {
                margin-top: 0 !important;
            }

            &:before {
                background: url("../../public/landing/how/connection-line-6.svg");
                width: 568px;
                height: 479px;
                background-size: contain;
                background-repeat: no-repeat;
                content: "";
                position: absolute;
                top: -487px;
                left: 15.5%;

                @include media-breakpoint-down(xxl) {
                    width: 495px;
                    top: -425px;
                }

                @include media-breakpoint-down(xl) {
                    width: 323px;
                    top: -277px;
                }

                @include media-breakpoint-down(lg) {
                    width: 290px;
                    top: -252px;
                }

                @include media-breakpoint-down(md) {
                    display: none;
                }
            }

            p {
                color: $white !important;
                text-align: center;
                font-family: $font-family-sans-serif;
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 24px;
            }
        }

        .last-words {
            color: #343434;
            font-size: large;
            text-align: center;

            @include media-breakpoint-up(xl) {
                padding-left: 12rem;
                padding-right: 12rem;
            }
        }
    }

</style>
