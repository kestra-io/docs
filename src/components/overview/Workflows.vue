<template>
    <section class="workflows">
        <div class="container">
            <div v-for="section in workflowSections" :key="section.id" class="section-block">
                <header
                    class="section-header"
                    :data-usal="!isMobile ? `fade-up duration-400 delay-50` : undefined"
                >
                    <h2>{{ section.title }}</h2>
                    <p>{{ section.description }}</p>
                </header>

                <div class="features">
                    <div class="main-feature">
                        <div class="feature-image">
                            <NuxtImg
                                :src="section.mainFeature.image"
                                :alt="section.mainFeature.title"
                                width="1076"
                                height="608"
                                :data-usal="!isMobile ? 'fade-up duration-500 delay-70' : undefined"
                            />
                        </div>
                        <div class="feature-content">
                            <h3>{{ section.mainFeature.title }}</h3>
                            <p>{{ section.mainFeature.description }}</p>
                        </div>
                    </div>

                    <div class="sub-features">
                        <div
                            v-for="subFeature in section.subFeatures"
                            :key="subFeature.id"
                            class="sub-feature-card"
                        >
                            <div class="feature-image">
                                <NuxtImg
                                    :src="subFeature.image"
                                    :alt="subFeature.title"
                                    width="490"
                                    height="277"
                                    :data-usal="
                                        !isMobile
                                            ? `fade-up duration-500 delay-${70 + (subFeature.id === section.subFeatures[0].id ? 0 : 100)}`
                                            : undefined
                                    "
                                />
                            </div>
                            <div class="feature-content">
                                <h3>{{ subFeature.title }}</h3>
                                <p>{{ subFeature.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { useBreakpoints, breakpointsTailwind } from "@vueuse/core"

    const breakpoints = useBreakpoints(breakpointsTailwind)
    const isMobile = breakpoints.smaller("md")

    const workflowSections = [
        {
            id: "definition",
            title: "Define Workflows Your Way",
            description:
                "Whether you prefer YAML, or a visual approach, you have everything you need to rapidly outline and orchestrate every step.",
            mainFeature: {
                title: "Everything As Code and From the UI",
                description:
                    "Create workflows both from the interface or version control. Navigate between code and visual to fit your preferred workflow.",
                image: "/landing/overview/define.png",
            },
            subFeatures: [
                {
                    id: "simplified",
                    title: "Simplified Workflow Definition",
                    description:
                        "Use simple declarative YAML syntax to define complex workflows without boilerplate code or custom wrappers.",
                    image: "/landing/overview/simplified.png",
                },
                {
                    id: "interactive",
                    title: "Interactive Topology View",
                    description:
                        "Visualize workflow logic via a graphical representation of your workflow structure and dependencies between tasks.",
                    image: "/landing/overview/interactive.png",
                },
            ],
        },
        {
            id: "dynamic",
            title: "Workflows That Think for Themselves",
            description:
                "Create workflows that adapt to business logic, handle errors gracefully, and scale based on your dynamic requirements.",
            mainFeature: {
                title: "Dynamic Control Flow",
                description:
                    "Implement conditional logic, retry mechanisms, or parallel flows. Your workflows can adapt in real-time based on data and business logic.",
                image: "/landing/overview/think.png",
            },
            subFeatures: [
                {
                    id: "langs",
                    title: "Native Scripting Across Languages",
                    description:
                        "Execute scripts in Python, R, Node.js, Shell and more without needing Docker or additional dependencies.",
                    image: "/landing/overview/langs.png",
                },
                {
                    id: "reusable",
                    title: "Reusable Logic with Subflows",
                    description:
                        "Build modular workflows with subflows that can be reused across multiple workflows and teams.",
                    image: "/landing/overview/reusable.png",
                },
            ],
        },
        {
            id: "execution",
            title: "Flexible Execution, Built for Scale",
            description:
                "From force-triggered jobs to long-running, complex, resilient, event-driven orchestrations. Fit any scale from development servers.",
            mainFeature: {
                title: "Event Driven Orchestration",
                description:
                    "Schedule executions, react to real-time events, or call workflows through API and webhooks. Get results when they are needed with monitoring.",
                image: "/landing/overview/flexible.png",
            },
            subFeatures: [
                {
                    id: "longrunning",
                    title: "Long Running & Resilient Executions",
                    description:
                        "Handle long-running processes with pause/resume capabilities, retries, and failure recovery mechanisms.",
                    image: "/landing/overview/longrunning.png",
                },
                {
                    id: "ondemand",
                    title: "On-Demand & At-First Execution",
                    description:
                        "Execute workflows manually, via API calls, or trigger them based on external events and system changes.",
                    image: "/landing/overview/ondemand.png",
                },
            ],
        },
        {
            id: "observability",
            title: "Full Observability, Built In",
            description:
                "From historical data to logs and execution statuses with Kestra gives you the visibility to optimize at scale.",
            mainFeature: {
                title: "Intuitive Visibility",
                description:
                    "Complete visibility over all workflows, executions and metrics via dedicated interface including real-time monitoring.",
                image: "/landing/overview/full.png",
            },
            subFeatures: [
                {
                    id: "timeline",
                    title: "Execution Timeline & Logs",
                    description:
                        "Track every step of your workflow execution with detailed logs and timeline views for debugging and optimization.",
                    image: "/landing/overview/timeline.png",
                },
                {
                    id: "output",
                    title: "Outputs and Metrics Visualization",
                    description:
                        "Visualize workflow outputs, performance metrics, and system health with built-in charts and dashboards.",
                    image: "/landing/overview/output.png",
                },
            ],
        },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .workflows {
        background: #f7f7f8;
        padding-top: 9rem;
        padding-bottom: 4rem;
        color: $white;

        .container {
            padding: 0 0;
        }

        .section-block {
            margin-bottom: 5rem;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .section-header {
            margin-bottom: 2rem;

            h2 {
                font-weight: 600;
                font-size: 2rem;
                line-height: 3rem;
                letter-spacing: 0%;
                color: $black;
            }

            p {
                font-weight: 400;
                font-size: 18.4px;
                line-height: 28px;
                letter-spacing: 0%;
                color: $black;
                max-width: 800px;
            }
        }

        .features {
            .main-feature {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 16px;
                margin-bottom: 2rem;
                max-width: 1140px;
                height: 818.49658203125px;
                padding: 30px 32px 64px 32px;
                border-radius: 16px;
                background: linear-gradient(180deg, #21242e 0%, #1a1c24 100%);
                box-shadow: 0px 1px 20px 10px #23222326;

                .feature-image {
                    max-width: 1076px;
                    align-self: center;

                    img {
                        width: 1076px;
                        height: 608.49658203125px;
                        border-radius: 8px;
                        object-fit: cover;
                    }
                }

                .feature-content {
                    h3 {
                        font-family: "Public Sans", sans-serif;
                        font-weight: 600;
                        font-size: 24px;
                        line-height: 36px;
                        letter-spacing: 0%;
                        color: $white;
                        margin-bottom: 1rem;
                    }

                    p {
                        font-size: 1rem;
                        color: #e1e1e1;
                        line-height: 1.6;
                        margin: 0;
                    }
                }
            }

            .sub-features {
                display: flex;
                gap: 2rem;
                justify-content: center;
            }

            .sub-feature-card {
                width: 554px;
                height: 505px;
                padding: 30px 32px 64px 32px;
                gap: 16px;
                border-radius: 16px;
                background: linear-gradient(180deg, #21242e 0%, #1a1c24 100%);
                box-shadow: 0px 1px 20px 10px #23222326;
                display: flex;
                flex-direction: column;

                .feature-image {
                    margin-bottom: 1.5rem;

                    img {
                        width: 490px;
                        height: 277.10345458984375px;
                        border-radius: 8px;
                        object-fit: cover;
                    }
                }

                .feature-content {
                    h3 {
                        font-size: 1.125rem;
                        font-weight: 600;
                        color: white;
                        margin-bottom: 0.75rem;
                        line-height: 1.3;
                    }

                    p {
                        font-size: 0.875rem;
                        color: #e1e1e1;
                        line-height: 1.5;
                        margin: 0;
                    }
                }
            }
        }

        @media (max-width: 1200px) {
            .features {
                .main-feature {
                    max-width: 100%;
                    height: auto;

                    .feature-image {
                        max-width: 100%;

                        img {
                            width: 100%;
                            height: auto;
                        }
                    }
                }

                .sub-feature-card {
                    width: 100%;
                    max-width: 500px;
                    height: auto;

                    .feature-image img {
                        width: 100%;
                        height: auto;
                    }
                }
            }
        }

        @media (max-width: 992px) {
            .features {
                .main-feature {
                    flex-direction: column;

                    .feature-image {
                        order: -1;
                    }
                }

                .sub-features {
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .sub-feature-card {
                    width: 100%;
                }
            }

            .section-header {
                h2 {
                    font-size: 1.875rem;
                }
            }
        }

        @media (max-width: 768px) {
            padding: 2rem 0;

            .container {
                padding: 0 1rem;
            }

            .section-block {
                margin-bottom: 4rem;
            }

            .section-header {
                margin-bottom: 2rem;

                h2 {
                    font-size: 1.75rem;
                    line-height: 2.25rem;
                }

                p {
                    font-size: 1rem;
                    line-height: 1.5rem;
                }
            }

            .features {
                .main-feature {
                    gap: 1.5rem;
                    padding: 1.25rem;
                    margin-bottom: 1.5rem;

                    .feature-image img {
                        max-width: 100%;
                        border-radius: 6px;
                    }

                    .feature-content {
                        h3 {
                            font-size: 1.375rem;
                            line-height: 1.75rem;
                        }

                        p {
                            font-size: 0.875rem;
                            line-height: 1.375rem;
                        }
                    }
                }

                .sub-feature-card {
                    width: 100%;
                    max-width: 100%;
                    padding: 1rem;
                    gap: 1rem;

                    .feature-image {
                        margin-bottom: 1rem;

                        img {
                            width: 100%;
                            max-width: 100%;
                            border-radius: 6px;
                        }
                    }

                    .feature-content {
                        h3 {
                            font-size: 1.125rem;
                            line-height: 1.375rem;
                        }

                        p {
                            font-size: 0.8125rem;
                            line-height: 1.25rem;
                        }
                    }
                }
            }
        }

        @media (max-width: 480px) {
            padding: 1.5rem 0;

            .container {
                padding: 0 0.75rem;
            }

            .section-header {
                h2 {
                    font-size: 1.5rem;
                    line-height: 2rem;
                }

                p {
                    font-size: 0.875rem;
                }
            }

            .features {
                .main-feature {
                    padding: 1rem;

                    .feature-content {
                        h3 {
                            font-size: 1.25rem;
                        }

                        p {
                            font-size: 0.8125rem;
                        }
                    }
                }

                .sub-feature-card {
                    padding: 0.875rem;

                    .feature-content {
                        h3 {
                            font-size: 1rem;
                        }

                        p {
                            font-size: 0.75rem;
                        }
                    }
                }
            }
        }
    }
</style>