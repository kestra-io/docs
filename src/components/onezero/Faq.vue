<template>
    <section class="faq-section">
        <NuxtImg
            src="/landing/onezero/ring.webp"
            alt="Ring"
            class="background-ring"
            loading="lazy"
        />
        <div class="container">
            <div class="row row-gap-4">
                <div
                    v-for="(feature, index) in topFeatures"
                    :key="feature.title"
                    class="col-lg-4 col-md-6"
                    :data-usal="`fade-u delay-${index * 50}`"
                >
                    <div class="feature-item">
                        <div class="feature-icon">
                            <component :is="feature.icon" />
                            <h5>{{ feature.title }}</h5>
                        </div>
                        <p>{{ feature.description }}</p>
                    </div>
                </div>
            </div>

            <div class="session-card" data-usal="zoomin">
                <h1>Book a Strategy Session</h1>
                <p>What could Declarative Agentic Orchestration can do for you?</p>
                <a href="/demo" class="btn btn-lg btn-primary"> Book Your Strategy Session </a>
            </div>

            <PriceFaq :items="faqItems" />
        </div>

        <svg width="0" height="0">
            <defs>
                <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0.22%" stop-color="#9F79F3" />
                    <stop offset="99.78%" stop-color="#658AF9" />
                </linearGradient>
            </defs>
        </svg>
    </section>
</template>

<script setup lang="ts">
    import Feather from "vue-material-design-icons/Feather.vue"
    import Security from "vue-material-design-icons/Security.vue"
    import CodeTags from "vue-material-design-icons/CodeTags.vue"
    import Cloud from "vue-material-design-icons/CloudOutline.vue"
    import ImageSizeSelectSmall from "vue-material-design-icons/ImageSizeSelectSmall.vue"
    import CardSearchOutline from "vue-material-design-icons/CardSearchOutline.vue"

    const topFeatures = [
        {
            icon: Feather,
            title: "Fully Open-Source",
            description: "100% open source under Apache 2.0 License.",
        },
        {
            icon: Cloud,
            title: "Deploy anywhere",
            description: "Deploy to any cloud, on-prem or air-gapped environments.",
        },
        {
            icon: CodeTags,
            title: "Developer-first",
            description:
                "YAML, SDKs (Python, js/TS, Java, Go), or no code UI - all unrestricted and CICD-ready.",
        },
        {
            icon: Security,
            title: "Enterprise-ready",
            description: "RBAC, tenant isolation, encrypted secrets, audit logs.",
        },
        {
            icon: ImageSizeSelectSmall,
            title: "Scales effortlessly",
            description:
                "Horizontal workers, hot reload, safe rollouts, built-in plugin ecosystem.",
        },
        {
            icon: CardSearchOutline,
            title: "Observability built-in",
            description: "Real-time executions, logs, metrics, dependency maps, flow-level SLAs.",
        },
    ]

    const faqItems = [
        {
            question: "Is 1.0 production-ready?",
            answer: "Yes. Kestra 1.0 is our first Long-Term Support (LTS) release, tested and hardened for production use. Many features that were previously in Beta are now generally available incl. Unit Tests, SLAs, Plugin Versioning, and new Helm charts for stable deployments.",
        },
        {
            question: "Will we be locked in?",
            answer: "No. Kestra is fully open-source under the Apache 2.0 license. You can always export and run your flows, plugins, and configurations independently. For enterprise deployments, we also offer Kestra Enterprise and Kestra Cloud.",
        },
        {
            question: "How is AI governed?",
            answer: "All AI-assisted actions in Kestra are version-controlled, logged, and fully auditable. A human-in-the-loop feature lets you review and approve AI-generated actions before they impact production systems.",
        },
        {
            question: "How fast can we see value?",
            answer: "Teams typically see results within days. With Copilot, you can generate your first flows immediately. Using the new Git Sync integration, you can quickly move from prototypes to production, while SLAs and Unit Tests help ensure reliability at scale.",
        },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .faq-section {
        background: #15171e;
        position: relative;
        color: white;
        z-index: 0;
        padding: 70px 1.25rem;
        overflow: hidden;

        .background-ring {
            position: absolute;
            top: 550px;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            object-fit: contain;
            mix-blend-mode: color-dodge;
            z-index: -1;

            @media screen and (max-width: 901px) {
                top: 600px;
                width: 1100px;
                height: 1100px;
            }

            @include media-breakpoint-down(sm) {
                top: 900px;
            }
        }

        .container {
            position: relative;
            max-width: 980px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 160px;
            padding: 0;

            @media screen and (max-width: 1024px) {
                gap: 5rem;
            }

            .row {
                @include media-breakpoint-down(sm) {
                    padding: 0 2rem;
                }
                .feature-item {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    .feature-icon {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        flex-direction: row;

                        :deep(svg) {
                            width: 24px;
                            height: 24px;
                            position: absolute;
                            bottom: -0.25rem;
                        }

                        :deep(path) {
                            fill: url(#icon-gradient);
                        }

                        h5 {
                            font-size: 1rem;
                            font-weight: 700;
                            line-height: 1.4;
                            margin: 0;
                        }
                    }

                    p {
                        font-size: 14px;
                        color: #e1e1e1;
                        margin: 0;
                        line-height: 1.5;
                    }
                }
            }

            .session-card {
                background: rgba(255, 255, 255, 0.021);
                backdrop-filter: blur(7px);
                -moz-backdrop-filter: blur(7px);
                -webkit-backdrop-filter: blur(7px);
                border-radius: 1.25rem;

                @include media-breakpoint-up(sm) {
                    padding: 4rem;
                }

                padding: 4rem 2rem;
                text-align: center;
                width: 100%;
                box-shadow:
                    0 0px 32px rgba(0, 0, 0, 0.37),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.18);

                h1 {
                    font-size: 3rem;
                    font-weight: 600;
                    color: $white;

                    @include media-breakpoint-down(md) {
                        font-size: 2.25rem;
                    }
                }

                p {
                    font-size: 14px;
                    font-weight: 400;
                    margin: 20px 0;
                    color: $white;
                }

                .btn-primary::before {
                    display: none;
                }
            }
        }

        @media (max-width: 768px) {
            [data-usal] {
                transform: none !important;
                transition: none !important;
                opacity: 1 !important;
            }
        }

        :deep(.que) {
            background: transparent !important;
        }
    }
</style>