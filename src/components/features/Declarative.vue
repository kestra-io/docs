<template>
    <section class="main">
        <div class="container">
            <div class="text-block">
                <h2>Kestra Core Features</h2>
                <h2 class="highlight">Declarative & Scalable by Design</h2>
            </div>
            <div class="feature-cards">
                <div v-for="card in featureCardsFirst" :key="card.title" class="card">
                    <h3>{{ card.title }}</h3>
                    <p>{{ card.description }}</p>
                </div>
            </div>
            <div class="coil d-none d-xl-block">
                <div class="inside">
                    <NuxtImg src="/landing/features/kestra.png" />
                    <span class="label">Kestra Core</span>
                </div>
                <NuxtImg
                    src="/landing/features/skyblue.png"
                    class="coil-border-1"
                    height="38.26px"
                ></NuxtImg>
                <div class="list list-1">
                    <h5>Everything From The UI</h5>
                    <ul class="list-unstyled">
                        <li><ArrowRightThick />Live Update dependency Graph</li>
                        <li><ArrowRightThick />Integrated No-Code & Code Editor</li>
                        <li><ArrowRightThick />Run Backfills in Few Clicks</li>
                        <li><ArrowRightThick />Built-in Documentation & Blueprints</li>
                        <li><ArrowRightThick />Custom Observability Dashboards</li>
                    </ul>
                </div>
                <NuxtImg
                    src="/landing/features/pinkish.png"
                    class="coil-border-2"
                    width="156px"
                    height="39px"
                ></NuxtImg>
                <div class="list list-3">
                    <h5>Everything As Code</h5>
                    <ul class="list-unstyled mt-1">
                        <div class="d-flex flex-column align-items-center justify-center">
                            <div class="d-flex flex-row align-items-center justify-center gap-3">
                                <li><ArrowRightThick />Autocompletion & Syntax Validation</li>
                                <li><ArrowRightThick />Git Sync</li>
                                <li><ArrowRightThick />CI/CD Integrations</li>
                            </div>
                            <div
                                class="d-flex flex-row align-items-center justify-center ps-5 gap-4"
                            >
                                <li><ArrowRightThick />Multi-Language Script Tasks</li>
                                <li><ArrowRightThick />Automatic Revision History & Rollback</li>
                            </div>
                        </div>
                    </ul>
                </div>
                <NuxtImg
                    src="/landing/features/yellowish.png"
                    class="coil-border-3"
                    width="123px"
                    height="39px"
                ></NuxtImg>
                <div class="list list-2">
                    <h5>Run Anywhere, Anytime</h5>
                    <ul class="list-unstyled">
                        <li><ArrowRightThick />UI or API execution</li>
                        <li><ArrowRightThick />Event & Real-time Triggers</li>
                        <li><ArrowRightThick />Dependency-based flow execution</li>
                        <li><ArrowRightThick />No Infrastructure Setup</li>
                    </ul>
                </div>
            </div>

            <div class="feature-cards">
                <div v-for="card in featureCardsSecond" :key="card.title" class="card">
                    <h3>{{ card.title }}</h3>
                    <p>{{ card.description }}</p>
                </div>
            </div>
        </div>
    </section>
    <svg width="0" height="0">
        <defs>
            <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="57.35%" stop-color="#51CFF7" />
                <stop offset="95.94%" stop-color="#4782F5" />
            </linearGradient>
        </defs>
    </svg>
</template>

<script setup lang="ts">
    import ArrowRightThick from "vue-material-design-icons/ArrowRightThick.vue"

    interface FeatureCard {
        title: string
        description: string
    }

    const featureCardsFirst: FeatureCard[] = [
        {
            title: "Orchestration & Business Logic Separation",
            description:
                "Kestra lets you define workflow logic (conditions, loops, error handling) independently from business logic. This separation keeps orchestration lightweight, modular, and easy to scale. Business logic stays decoupled from the orchestrator.",
        },
        {
            title: "Built-In Execution Controls",
            description:
                "Every task in Kestra has a built-in orchestration powerhouse: conditional branching logic, retry policies, error handling, concurrency and timeout, worker group assignment, automatic log management and more. No custom code needed to benefit from those capabilities.",
        },
    ]

    const featureCardsSecond: FeatureCard[] = [
        {
            title: "Static & Dynamic Properties",
            description:
                "Kestra tasks support both static values and dynamic expressions. Use fixed values for simplicity, or inject runtime values using templating syntax to adapt based on data, inputs, or conditions. This lets you build reusable, context-aware workflows without sacrificing clarity or maintainability.",
        },
        {
            title: "Code in Any Language",
            description:
                "Kestra can run code in any language without forcing you to rewrite your code to match a rigid framework DSL. Kestra executes your scripts directly, in a local subprocess or in a Docker container, handles inputs and outputs, and captures logs. You can import and edit your code from the integrated Namespace Files editor.",
        },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .main {
        background: #15171e;

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            padding: 60px 1rem;

            @include media-breakpoint-up(md) {
                padding: 90px 0;
            }

            .highlight {
                background: linear-gradient(90.21deg, #8c4bff 36.32%, #658af9 63.11%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                color: transparent;
            }

            .text-block {
                text-align: center;
                display: flex;
                flex-direction: column;
                width: 100%;
                padding-bottom: 2rem;
                align-items: center;

                h2 {
                    color: white;
                    text-align: center;
                    max-width: 100%;
                    font-weight: 600;
                    font-size: 2rem;
                    padding: 0;

                    @include media-breakpoint-up(lg) {
                        font-size: 3rem;
                        margin: 0;
                        max-width: 800px;
                        line-height: 1.2em;
                    }
                }
            }

            .feature-cards {
                display: grid;
                grid-template-columns: 1fr;
                gap: 32px;
                justify-content: center;

                @include media-breakpoint-up(lg) {
                    grid-template-columns: repeat(2, 1fr);
                }

                @include media-breakpoint-down(lg) {
                    place-items: center;
                }

                .card {
                    width: 100%;
                    max-width: 554px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 30px 32px;
                    border-radius: 8px;
                    border: 1px solid transparent;
                    background: linear-gradient(180deg, #21242e 0%, #1a1c24 100%);
                    background-clip: padding-box;
                    position: relative;
                    box-shadow: 0px 12px 24px 8px rgba(0, 0, 0, 0.09);

                    &::before {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        border-radius: 8px;
                        padding: 1px;
                        background: linear-gradient(180deg, #2b313e 0%, #131725 100%);
                        mask:
                            linear-gradient($white 0 0) content-box,
                            linear-gradient($white 0 0);
                        mask-composite: exclude;
                        pointer-events: none;
                    }

                    &::after {
                        content: "";
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 3px;
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                    }

                    h3 {
                        font-weight: 600;
                        font-size: 20px;
                        line-height: 30px;
                        color: $white;
                        margin: 0;
                    }

                    p {
                        font-family: var(--font-family-body);
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 22px;
                        color: #e1e1e1;
                        margin: 0;
                    }
                }
            }

            .coil {
                width: 100%;
                min-height: 450px;
                border: 1px solid transparent;
                background:
                    url("/landing/features/coil.png") center/contain no-repeat,
                    #070d1f;
                background-clip: padding-box;
                position: relative;
                grid-column: 1 / -1;
                margin-bottom: 2rem;

                &::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -2rem;
                    height: 2rem;
                    background: #070d1f;
                    z-index: 1;
                }

                &::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: -2rem;
                    border-radius: 0.5rem;
                    padding: 1px;
                    background: linear-gradient(180deg, #7830ec 0%, #a5cff1 51.92%, #15d1f6 100%);
                    mask:
                        linear-gradient($white 0 0) content-box,
                        linear-gradient($white 0 0);
                    mask-composite: exclude;
                    z-index: 10;
                }

                .inside {
                    position: absolute;
                    top: calc(30% - 5px);
                    left: calc(49% + 5px);
                    transform: translate(-50%, -50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    img {
                        width: 70px;
                        height: 70px;
                    }

                    .label {
                        font-weight: 600;
                        font-size: 16px;
                        line-height: 19px;
                        color: $white;
                        text-align: center;
                    }
                }

                .coil-border-2 {
                    position: absolute;
                    top: 110px;
                    left: 270px;
                }

                .coil-border-1 {
                    position: absolute;
                    bottom: 85px;
                    left: 560px;
                }

                .coil-border-3 {
                    position: absolute;
                    top: 160.32px;
                    left: 700px;
                }

                .list-1 {
                    position: absolute;
                    top: 135px;
                    left: 85px;
                }

                .list-2 {
                    position: absolute;
                    top: 145px;
                    right: 95px;
                }

                .list-3 {
                    position: absolute;
                    bottom: -10px;
                    left: 320px;
                    text-align: center;

                    ul {
                        display: grid;
                        grid-template-columns: repeat(3, auto);
                    }
                }
            }

            .list {
                color: $white;
                font-size: 12px;
                line-height: 20px;
                font-weight: 400;

                h5 {
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 24px;
                    background: linear-gradient(90deg, $white 0%, #bababa 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                    margin-bottom: 2px;
                }

                .arrow-right-thick-icon {
                    margin-right: 4px;

                    :deep(path) {
                        fill: url(#arrow-gradient);
                    }
                }
            }
        }
    }
</style>