<template>
    <div class="container-fluid bg-body-tertiary">
        <div class="container">
            <Section
                class="dark"
                title="Uncover a Wide Range of Use Cases to Leverage Kestra's Potential"
                subtitle="Maximize Data Workflow Capabilities"
            >
                <ul class="nav nav-pills" data-aos="fade-right">
                    <li class="nav-item mt-2">
                        <a class="nav-link" :class="{'active': active === 1}" @click="active = 1">Data Platform Orchestration</a>
                    </li>
                    <li class="nav-item mt-2">
                        <a class="nav-link" :class="{'active': active === 2}" @click="active = 2">Efficient Workflow Automation</a>
                    </li>
                    <li class="nav-item mt-2">
                        <a class="nav-link" :class="{'active': active === 3}" @click="active = 3">Decentralized Workflow Automation</a>
                    </li>
                </ul>

                <div class="row mt-5" v-if="active === 1" data-aos="fade-left">
                    <div class="col-lg-6 col-sm-12">
                        <ol>
                            <li>
                                <strong>For Data Engineers:</strong><br />
                                Easily automate complex data pipelines, reduce errors, and improve overall data quality, allowing you to focus on more strategic tasks.
                            </li>

                            <li>
                                <strong>For Data Analysts:</strong><br />
                                Quickly access and integrate data from a variety of sources, enabling faster and more accurate analysis, and unlocking new insights and business opportunities.
                            </li>

                            <li>
                                <strong>For Data Scientists:</strong><br />
                                Efficiently manage and deploy your machine learning models at scale, accelerate your research and experimentation, and deliver more accurate and reliable predictions.
                            </li>
                        </ol>
                    </div>
                    <div class="col-lg-6 col-sm-12 use-case-img">
                        <img class="zoom img-fluid" src="/landing/home/dashboard.png" width="600" alt="Kestra dashboard"/>
                    </div>
                </div>

                <div class="row mt-5" v-if="active === 2" data-aos="fade-left">
                    <div class="col-lg-6 col-sm-12">
                        <ol>
                            <li>
                                <strong>Simplify Your Workflows with Automation:</strong><br />
                                Easily create scheduling and trigger-based workflows to automate repetitive tasks and free up your team.
                            </li>

                            <li>
                                <strong>Trigger Workflows Based on Events:</strong><br />
                                Kestra's trigger-based approach allows you to initiate workflows based on specific events, like data arriving in a database or a file being uploaded. This enables real-time processing and reduces delays in your pipeline.
                            </li>

                            <li>
                                <strong>Microservice Orchestration Made Easy:</strong><br />
                                With microservice orchestration capabilities, complex workflows are broken down into smaller pieces for easier scaling and maintenance. Kestra supports a wide range of microservice technologies for seamless integration with existing architectures.
                            </li>
                        </ol>
                    </div>
                    <div class="col-lg-6 col-sm-12 use-case-img">
                        <img class="zoom img-fluid" src="/landing/home/dashboard.png" width="600" alt="Kestra dashboard"/>
                    </div>
                </div>

                <div class="row mt-5" v-if="active === 3" data-aos="fade-left">
                    <div class="col-lg-6 col-sm-12">
                        <ol>
                            <li>
                                <strong>Decentralize your data:</strong><br />
                                Kestra's YAML-based workflows and intuitive UI make it easy to decentralize data and build domain-specific data products, while minimizing dependencies between teams and reducing bottlenecks.
                            </li>

                            <li>
                                <strong>Data Ownership and Governance:</strong><br />
                                Create and maintain your own data products, while ensuring data quality, governance, and security. Improves collaboration and accountability, and reduces the risk of silos and conflicts.
                            </li>

                            <li>
                                <strong>Simplify Complex Data Workflows:</strong><br />
                                Our architecture allows for the breakdown of complex workflows, making them easier to create, maintain, and reuse.  Improve performance and reliability, allowing your team to focus on delivering valuable insights from your data.
                            </li>
                        </ol>
                    </div>
                    <div class="col-lg-6 col-sm-12 use-case-img">
                        <img class="zoom img-fluid" src="/landing/home/dashboard.png" width="600" alt="Kestra dashboard"/>
                    </div>
                </div>

                <div class="text-center mt-5">
                    <NuxtLink class="btn btn-lg btn-primary " href="/use-cases" data-aos="zoom-in">See more</NuxtLink>
                </div>
            </Section>
        </div>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        data() {
            return {
                active: 1,
            };
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        color: var(--bs-white);

        ol {
            counter-reset: custom-counter;
            list-style: none;
            margin-left: 5rem;

            li {
                counter-increment: custom-counter;
                margin-bottom: calc($spacer * 3);

                &:last-child {
                    margin-bottom: 0;
                }

                &::before {
                    content: "0" counter(custom-counter) ;
                    color: $purple-2;
                    font-size: $font-size-xl;
                    font-family: var(--bs-font-monospace);
                    position: absolute;
                    margin-left: -5rem;
                    margin-top: -0.25rem;
                    font-weight: bolder;
                }
            }
        }

        .nav {
            width: 100%;
            justify-content: center;
            font-size: $font-size-sm;

            .nav-link {
                margin-right: calc($spacer * 1);
                border: 1px solid transparent;
                cursor: pointer;
            }

            .nav-link:not(.active) {

                border: 1px solid $purple-3;
                color: var(--bs-white);
            }
        }

        .row {
            background: rgba(#1B1923, 20%);
            padding: calc($spacer * 4);
            border-radius: var(--bs-border-radius-lg);
            position: relative;

            &:before {
                content: "";
                background: url("/landing/dot.svg") no-repeat bottom right;
                width: 329px;
                height: 236px;
                position: absolute;
                right: -2rem;
                bottom: -3rem;

                @include media-breakpoint-down(md) {
                    display: none;
                }
            }

            @include media-breakpoint-down(sm) {
                padding: $spacer;
            }
        }

        .use-case-img {
            display: flex;
            align-items: center;
        }
    }
</style>