<template>
    <section class="wrapper">
        <div class="ai-copilot container">
            <div class="first-line">
                <div data-usal="fade-r" class="content">
                    <div class="what-is-new">What is new in <strong>1.0</strong></div>
                    <h2>AI Copilot</h2>
                    <p>
                        Describe what you want to orchestrate in natural language, and Copilot
                        generates declarative YAML code you can refine, version, and deploy.
                    </p>
                </div>
                <div class="copilot-overview-illustration" data-usal="fade-l">
                    <img
                        class="illu-code"
                        src="/landing/onezero/copilot.svg"
                        alt="AI Copilot"
                        width="900"
                        height="auto"
                    />
                    <div class="d-none d-xl-block illu-code-background"></div>
                </div>
            </div>

            <div v-for="block in aiBlocksone" :key="block.title" class="ai-block">
                <h3>{{ block.title }}</h3>
                <p>{{ block.description }}</p>
                <NuxtImg
                    class="illu"
                    :src="block.imgSrc"
                    :alt="block.alt"
                    :width="block.width"
                    :height="block.height"
                    data-usal="zoomin"
                    format="webp"
                    loading="lazy"
                />
            </div>

            <div class="second-line">
                <h3>AI-Powered Docs Search</h3>
                <p>Get answers to your questions instantly.</p>
                <NuxtImg
                    class="illu"
                    src="/landing/onezero/AIDocsSearch.png"
                    alt="AI Prompt reading Ask Kestra AI"
                    width="2280"
                    height="722"
                    data-usal="fade-u"
                    format="webp"
                    loading="lazy"
                />
            </div>

            <div v-for="block in aiBlockstwo" :key="block.title" class="ai-block">
                <h3>{{ block.title }}</h3>
                <p>{{ block.description }}</p>
                <NuxtImg
                    class="illu"
                    :src="block.imgSrc"
                    :alt="block.alt"
                    :width="block.width"
                    :height="block.height"
                    data-usal="zoomin"
                    format="webp"
                    loading="lazy"
                />
            </div>
        </div>

        <div class="velocity container">
            <h2><span>Velocity</span> Features</h2>
            <div class="feature-list">
                <div v-for="feature in velocityFeatures" :key="feature.title" class="feature-item">
                    <div class="feature-icon">
                        <component :is="feature.icon" />
                        <h3>{{ feature.title }}</h3>
                    </div>
                    <p>{{ feature.description }}</p>
                </div>
            </div>
            <a href="/blogs/release-1-0" target="_blank" class="btn btn-lg btn-primary">
                Explore the 1.0 Highlights
            </a>
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
    import GamepadSquare from "vue-material-design-icons/GamepadSquare.vue"
    import TimerCheck from "vue-material-design-icons/TimerCheck.vue"
    import SpiderWeb from "vue-material-design-icons/SpiderWeb.vue"
    import { usePluginsCount } from "~/composables/usePluginsCount"
    import { computed } from "vue"

    const { totalPlugins } = usePluginsCount()

    const aiBlocksone = [
        {
            title: "AI Agents",
            description:
                "AI-native agents powered by OpenAI GPT, Google Gemini, Anthropic Claude, Mistral, Bedrock, Vertex AI, DeepSeek, and Ollama, combining memory with tools like Web Search, Code Execution, MCP clients, and File System ops to adapt, loop, and orchestrate until goals are met, all fully observable and governed.",
            imgSrc: "/landing/onezero/AIAgent.png",
            alt: "AI Agents Overview",
            width: 1012,
            height: 590,
        },
        {
            title: "Official MCP Server",
            description:
                "Connect Kestra to AI IDEs & agents frameworks via the Model Context Protocol; manage flows and executions from your AI workspace.",
            imgSrc: "/landing/onezero/MCPServer.png",
            alt: "MCP Server Illustration",
            width: 1012,
            height: 590,
        },
    ]
    const aiBlockstwo = computed(() => [
        {
            title: "Enterprise-grade LTS",
            description:
                "Predictable upgrades, backward compatibility, RBAC, encrypted secrets, tenant isolation proven at scale.",
            imgSrc: "/landing/onezero/EnterpriseLTS.png",
            alt: "Enterprise LTS Illustration",
            width: 1076,
            height: 656,
        },
        {
            title: `${totalPlugins.value} Plugins & Safe Upgrades`,
            description:
                "Our extensive ecosystem spans data, AI, and infrastructure. Plugin Versioning allows you to pin and run multiple versions simultaneously for safer, more controlled rollouts.",
            imgSrc: "/landing/onezero/PluginsUpgrade.png",
            alt: "Plugins Upgrade Illustration",
            width: 1012,
            height: 656,
        },
    ])

    const velocityFeatures = [
        {
            title: "Playground (GA)",
            icon: GamepadSquare,
            description:
                "Reduce friction in complex builds by testing steps independently while keeping production runs clean and consistent.",
        },
        {
            title: "Flow-level SLAs",
            icon: TimerCheck,
            description:
                "Enforce reliability standards with built-in SLAs that automatically handle long-running or failed executions to keep workflows compliant and predictable.",
        },
        {
            title: "New Dependency View",
            icon: SpiderWeb,
            description:
                "Full visibility into complex workflows with a scalable, intuitive dependency view that makes it easy to trace, explore, and navigate data flows at any scale.",
        },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .wrapper {
        background-color: #1a1c25;
        color: white;
        padding: 4rem 2rem;

        @include media-breakpoint-up(md) {
            padding: 102px 2rem 50px;
        }

        p {
            color: #d5d3de;
            line-height: 24px;

            @include media-breakpoint-up(md) {
                font-size: 18px;
            }
        }
    }

    .ai-copilot {
        margin-bottom: 80px;
        display: grid;

        @include media-breakpoint-up(lg) {
            grid-template-columns: repeat(2, 1fr);
            grid-template-areas:
                "first-line first-line"
                ". ."
                "second-line second-line"
                ". .";
        }

        > div {
            border: 1px solid #2f3242;
            border-right: 0;
            border-left: 0;
            padding-top: 2rem;

            @include media-breakpoint-up(lg) {
                padding-top: 4rem;

                &:nth-child(3n) {
                    border-left: 1px solid #2f3242;
                    padding-left: 2rem;
                }
            }
        }
    }

    .first-line {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        border: none !important;

        @include media-breakpoint-up(lg) {
            grid-area: first-line;
            flex-direction: row;
            text-align: left;
        }

        .content {
            @include media-breakpoint-up(lg) {
                margin-top: -9rem;
            }
        }

        &.ai-copilot {
            border: none;
        }

        .what-is-new {
            font-weight: 600;
            font-size: 18.4px;
            margin-top: -0.875rem;

            strong {
                color: #8c4bff;
                font-weight: 600;
            }
        }

        h2 {
            font-size: 48px;
            font-weight: 600;
            line-height: 56px;

            @include media-breakpoint-up(lg) {
                margin: 20px 0;
            }
        }

        p {
            @include media-breakpoint-up(lg) {
                width: 410px;
                margin-bottom: 0;
            }
        }

        .copilot-overview-illustration {
            display: flex;
            justify-content: center;
            margin-top: 2rem;
            width: 100%;
            position: relative;

            @include media-breakpoint-up(xl) {
                margin-top: -6rem;
            }

            .illu-code-background {
                --border-angle: 0turn;
                --gradient-border: conic-gradient(
                    from calc(var(--border-angle) + 50.37deg) at 50% 50%,
                    #3991ff 0deg,
                    #8c4bff 124.62deg,
                    #a396ff 205.96deg,
                    #3991ff 299.42deg,
                    #e0e0ff 342.69deg,
                    #3991ff 360deg
                );
                position: absolute;
                bottom: calc(35% + 1px);
                left: 14%;
                border: 1px solid transparent;
                border-radius: 1rem;
                background: var(--gradient-border) border-box;
                -webkit-mask:
                    linear-gradient($white 0 0) padding-box,
                    linear-gradient($white 0 0);
                mask:
                    linear-gradient($white 0 0) padding-box,
                    linear-gradient($white 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                z-index: 2;
                width: 350px;
                height: 32px;
                animation: bg-spin 3s linear infinite;
            }

            .illu-code {
                width: 150%;
                height: auto;

                @include media-breakpoint-up(xl) {
                    margin-left: 3rem;
                }

                @media screen and (max-width: 991px) {
                    margin-top: -2rem;
                }

                @media screen and (min-width: 992px) and (max-width: 1199px) {
                    margin-top: -7rem;
                }
            }
        }
    }

    .second-line {
        overflow: hidden;
        background: url("/landing/onezero/ellipse.svg") no-repeat center bottom / 100% auto;

        @include media-breakpoint-down(lg) {
            background-size: 100% 100%;

            @include media-breakpoint-down(md) {
                background-size: 100% 90%;

                @include media-breakpoint-down(sm) {
                    background-size: 100% 75%;
                }
            }
        }

        @include media-breakpoint-up(lg) {
            grid-area: second-line;
            background-position: 0% 160%;
            background-size: 100%;

            &.ai-copilot {
                padding-top: 90px;
            }
        }

        h3,
        p {
            width: 820px;

            @include media-breakpoint-up(lg) {
                margin: 0 auto 20px;
            }
        }

        h3 {
            font-size: 24px;
            font-weight: 600;
            line-height: 36px;
        }

        p {
            margin-bottom: 40px;
        }

        .illu {
            width: 137%;
            position: relative;
            left: -16%;
            height: auto;

            @include media-breakpoint-up(lg) {
                position: static;
                width: 100%;
            }
        }
    }

    .ai-block {
        h3 {
            font-size: 24px;
            font-weight: 600;
            line-height: 32px;
        }

        p {
            margin: 20px 0;

            @include media-breakpoint-up(lg) {
                width: 430px;
            }
        }

        .illu {
            width: 100%;
            height: auto;

            @include media-breakpoint-down(md) {
                padding: 1.75rem 0;
            }
        }
    }

    .velocity {
        text-align: center;
        position: relative;
        z-index: 1;

        @include media-breakpoint-up(lg) {
            padding-bottom: 50px;
        }

        h2 {
            font-size: 24px;
            line-height: 32px;
            font-weight: 600;
            margin-bottom: 40px;

            span {
                background: linear-gradient(90deg, #8c4bff 0%, #658af9 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .feature-list {
            text-align: left;
            display: grid;
            gap: 24px;
            margin-bottom: 40px;

            @include media-breakpoint-up(lg) {
                grid-template-columns: repeat(3, 1fr);
            }

            .feature-item {
                display: flex;
                flex-direction: column;
                gap: 8px;

                .feature-icon {
                    display: inline-flex;
                    gap: 16px;

                    :deep(svg) {
                        width: 24px;
                        height: 24px;
                        position: absolute;
                        bottom: -0.25rem;
                    }

                    :deep(path) {
                        fill: url(#icon-gradient);
                    }

                    h3 {
                        font-size: 1rem;
                        font-weight: 700;
                        line-height: 24px;
                        margin: 0;
                    }
                }

                p {
                    font-size: 14px;
                    line-height: 22px;
                }
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

    @property --border-angle {
        syntax: "<angle>";
        inherits: true;
        initial-value: 0turn;
    }

    @keyframes bg-spin {
        to {
            --border-angle: 1turn;
        }
    }
</style>