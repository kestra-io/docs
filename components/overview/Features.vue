<template>
    <div class="container">
        <Section
            subtitle="Programmable, Extensible,"
            subtitle-after="Customizable"
            baseline="Kestra is designed to cater to your specific needs, enabling you to create highly customized and efficient workflows."
        >
            <div class="row feature-item">
                <div class="col-md-4 order-1 order-md-1 d-flex flex-column justify-content-center mt-4"
                     data-aos="fade-left">
                    <h3>Advanced Conditional Logic</h3>
                    <ul>
                        <li>
                            Implement dynamic workflows with conditional steps like if-then-else and switch, empowering
                            you to make decisions based on real-time data. 
                        </li>
                    </ul>
                    <ul>
                        <li>Explore our orchestration building blocks:</li>
                        <ul>
                            <li>
                                <NuxtLink href="/plugins/core/tasks/flows/io.kestra.plugin.core.flow.If">
                                    If Conditions
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink href="plugins/core/tasks/flows/io.kestra.plugin.core.flow.Switch">
                                    Switch Cases
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink href="plugins/core/tasks/flows/io.kestra.plugin.core.flow.Sequential">
                                    Sequential Steps
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink href="plugins/core/tasks/flows/io.kestra.plugin.core.flow.Parallel">
                                    Parallel Execution
                                </NuxtLink>
                            </li>
                        </ul>
                    </ul>
                </div>
                <div class="col-md-7 order-0 order-md-0 left-glow" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/features/advanced-conditional.svg"
                        alt="Advanced Conditional"
                    />
                </div>
            </div>
            <div class="row feature-item">
                <div class="col-md-4 order-1 order-md-0 d-flex flex-column justify-content-center mt-4"
                     data-aos="fade-right">
                    <h3>Wide Range of Scripting Support</h3>
                    <p>
                        Integrate various programming languages within your workflows.
                    </p>
                </div>
                <div class="col-md-7 order-0 order-md-1 right-glow d-flex justify-content-end" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/features/scripting-support.svg"
                        alt="Scripting Support"
                    />
                </div>
            </div>
            <div class="row feature-item">
                <div class="col-md-4 order-1 order-md-1 d-flex flex-column justify-content-center mt-4"
                     data-aos="fade-left">
                    <h3>Reusable Subflows</h3>
                    <ul>
                        <li>
                            Build a library of common flows or flow components with our support for sub-flows, making
                            your workflow development more efficient and modular. 
                            Sub Flow Plugin
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <NuxtLink href="/plugins/core/tasks/flows/io.kestra.plugin.core.flow.SubFlow">
                                Sub Flow Plugin
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="col-md-7 order-0 order-md-0 left-glow" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/features/reusable-subflows.svg"
                        alt="Reusable Subflows"
                    />
                </div>
            </div>
            <div class="row feature-item">
                <div class="col-md-4 order-1 order-md-0 d-flex flex-column justify-content-center mt-4"
                     data-aos="fade-right">
                    <h3>Debugging and Monitoring Made Easy</h3>
                    <p>
                        Debug executing instances with ease. Access logs, metrics, and outputs in a unified interface,
                        streamlining your troubleshooting process.
                    </p>
                </div>
                <div class="col-md-7 order-0 order-md-1 right-glow d-flex justify-content-end" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/features/monitoring.svg"
                        alt="Debugging and Monitoring"
                    />
                </div>
            </div>
            <div class="row feature-item">
                <div class="col-md-4 order-1 order-md-1 d-flex flex-column justify-content-center mt-4"
                     data-aos="fade-left">
                    <h3>Long-Running Executions </h3>
                    <p>
                        Handle long-running executions, with customizable timeouts and retries at both instance and
                        process step levels.
                    </p>
                </div>
                <div class="col-md-7 order-0 order-md-0 left-glow" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/features/long-running.svg"
                        alt="Long-Running"
                    />
                </div>
            </div>
            <div class="row feature-item">
                <div class="col-md-4 order-1 order-md-0 d-flex flex-column justify-content-center mt-4"
                     data-aos="fade-right">
                    <h3>Event Driven Orchestration</h3>
                    <ul>
                        <li>
                            Leverage event-driven architecture with webhook support and event listeners (SNS, SQS, MQ,
                            database change listeners, FTP/SFTP). 
                        </li>
                        <li>
                            Automate tasks based on schedules, enhancing the responsiveness of your workflows. 
                        </li>
                        <li>
                            Dependencies Management:
                        </li>
                    </ul>
                </div>
                <div class="col-md-7 order-0 order-md-1 right-glow d-flex justify-content-end" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/features/orchestration.svg"
                        alt="Orchestration"
                    />
                </div>
            </div>
        </Section>
        <Section
            subtitle="Get a holistic overview of your platform"
            baseline="Manage and analyze your workflow executions."
        >
            <div class="row feature-item">
                <div class="col-md-4 order-1 order-md-1 d-flex flex-column justify-content-center mt-4"
                     data-aos="fade-left">
                    <h3>Comprehensive Instance Overview</h3>
                    <ul>
                        <li>
                            Running Instances: Easily access a list of currently running instances, giving you a
                            snapshot of active workflows. 
                        </li>
                    </ul>
                    <ul>
                        <li>
                            Historical Insight: View the history of executed instances, offering a timeline of past
                            activities and outcomes. 
                        </li>
                    </ul>
                    <ul>
                        <li>
                            Detailed Instance Analysis: Delve into the detailed status of individual running instances
                            for granular management and insights.
                        </li>
                    </ul>
                </div>
                <div class="col-md-7 order-0 order-md-0 left-glow" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/features/comprehensive.svg"
                        alt="Comprehensive"
                    />
                </div>
            </div>
            <div class="row feature-item">
                <div class="col-md-4 order-1 order-md-0 d-flex flex-column justify-content-center mt-4"
                     data-aos="fade-right">
                    <h3>Execution Tracking and Logs</h3>
                    <ul>
                        <li>
                            Timeline with Gantt View: Track the execution timeline of each workflow in a clear, visual
                            Gantt chart format. This view helps in understanding the sequence and duration of each task
                            within a workflow. 
                        </li>
                    </ul>
                    <ul>
                        <li>
                            Task-Specific Logs: Access logs for each task within a workflow. These logs provide critical
                            insights and the ability to dive deeper into specific task outputs and metrics.
                        </li>
                    </ul>
                </div>
                <div class="col-md-7 order-0 order-md-1 right-glow d-flex justify-content-end" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/features/execution.svg"
                        alt="Execution"
                    />
                </div>
            </div>
            <div class="row feature-item">
                <div class="col-md-4 order-1 order-md-1 d-flex flex-column justify-content-center mt-4"
                     data-aos="fade-left">
                    <h3>Output and Metrics Visualization</h3>
                    <ul>
                        <li>
                            Task Outputs: Review the outputs of all tasks in a flow, giving you a comprehensive view of
                            your workflow’s performance and results. 
                        </li>
                    </ul>
                    <ul>
                        <li>
                            In-Depth Metrics: Some tasks and plugins within Kestra provide detailed metrics. These
                            metrics offer valuable data points to measure the efficiency and effectiveness of your
                            workflows. 
                        </li>
                    </ul>
                </div>
                <div class="col-md-7 order-0 order-md-0 left-glow" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/features/metrics-visualization.svg"
                        alt="Metrics Visualization"
                    />
                </div>
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
<style scoped lang="scss">
    @import "../../assets/styles/variable";

    :deep(section) {
        border-bottom: $block-border;

        .subtitle {
            max-width: 65%;
            @include media-breakpoint-down(lg) {
                max-width: 100%;
            }
        }

        p.baseline {
            font-size: $h6-font-size !important;
        }
    }

    .container {
        .feature-item {
            margin-bottom: 12rem;
            @include media-breakpoint-down(lg) {
                margin-bottom: 5rem;
            }
        }

        h3 {
            color: $white;
            font-size: $h2-font-size;
            font-weight: 300;
        }

        p, ul {
            list-style-type: disc;
            color: $white-1;
            font-size: $font-size-md;
            font-weight: 300;

            b {
                color: $white;
                font-weight: 600;
            }

            li {
                a {
                    text-decoration: underline;
                    color: $white-1;
                }
            }
        }

        .left-glow,
        .right-glow {
            position: relative;
            z-index: 10;

            &::before,
            &::after {
                content: "";
                position: absolute;
                width: calc($spacer * 5.5);
                height: calc($spacer * 5.5);
                background: linear-gradient(140deg, rgba(70, 24, 255, 0) -41.95%, #7e1cfa 77.28%);
                filter: blur(55px);
                z-index: -5;
            }
        }

        .right-glow {
            &::before {
                left: 11rem;
                top: 0rem;
            }

            &::after {
                right: -1rem;
                bottom: 2rem;
            }

            @include media-breakpoint-down(lg) {
                &::before {
                    left: -1rem;
                }
            }
        }

        .left-glow {
            &::before {
                left: -1rem;
                top: -2rem;
            }

            &::after {
                right: 12rem;
                bottom: 1rem;
            }

            @include media-breakpoint-down(lg) {
                &::after {
                    right: -1rem;
                }
            }
        }

        .img-fluid {
            @include media-breakpoint-down(lg) {
                max-width: 100%;
            }
        }
    }
</style>
