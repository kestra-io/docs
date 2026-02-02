<template>
    <section class="experience">
        <div class="container">
            <div
                v-for="(section, sectionIndex) in sections"
                :key="`section-${sectionIndex}`"
                :data-section-index="sectionIndex"
                class="section"
            >
                <div class="section-title" v-if="section.title">
                    <h2>
                        <template v-for="(part, idx) in splitHighlight(section.title)" :key="idx">
                            <span v-if="part.highlight" class="highlight">{{ part.text }}</span>
                            <template v-else>{{ part.text }}</template>
                        </template>
                    </h2>
                </div>

                <div
                    v-for="(subsection, subsectionIndex) in section.subsections"
                    :key="`subsection-${sectionIndex}-${subsectionIndex}`"
                    :data-subsection-index="subsectionIndex"
                >
                    <div class="section-subtitle" v-if="subsection.title">
                        <h3>{{ subsection.title }}</h3>
                    </div>

                    <div class="features-grid">
                        <div
                            v-for="(card, cardIndex) in subsection.cards"
                            :key="`card-${sectionIndex}-${subsectionIndex}-${cardIndex}`"
                            class="card"
                        >
                            <h3>
                                <component :is="card.icon" class="icon" />
                                <span class="text-truncate">{{ card.title }}</span>
                            </h3>
                            <p>{{ card.description }}</p>
                            <a :href="card.link" class="cta">
                                <span>{{ card.cta }}</span>
                                <ArrowRight />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue"
    import Monitor from "vue-material-design-icons/Monitor.vue"
    import CodeBrackets from "vue-material-design-icons/CodeBrackets.vue"
    import TuneVariant from "vue-material-design-icons/TuneVariant.vue"
    import BookOpenPageVariantOutline from "vue-material-design-icons/BookOpenPageVariantOutline.vue"
    import CheckCircleOutline from "vue-material-design-icons/CheckCircleOutline.vue"
    import Bug from "vue-material-design-icons/Bug.vue"
    import Console from "vue-material-design-icons/Console.vue"
    import Connection from "vue-material-design-icons/Connection.vue"
    import ShieldCheck from "vue-material-design-icons/ShieldCheck.vue"
    import SourceCommit from "vue-material-design-icons/SourceCommit.vue"
    import SyncCircle from "vue-material-design-icons/SyncCircle.vue"
    import CloudUploadOutline from "vue-material-design-icons/CloudUploadOutline.vue"
    import CalendarTodayOutline from "vue-material-design-icons/CalendarTodayOutline.vue"
    import LightningBolt from "vue-material-design-icons/LightningBolt.vue"
    import Api from "vue-material-design-icons/Api.vue"
    import SineWave from "vue-material-design-icons/SineWave.vue"
    import DatabaseCogOutline from "vue-material-design-icons/DatabaseCogOutline.vue"
    import UnfoldLessVertical from "vue-material-design-icons/UnfoldLessVertical.vue"
    import CoffeeOutline from "vue-material-design-icons/CoffeeOutline.vue"
    import BackupRestore from "vue-material-design-icons/BackupRestore.vue"
    import ViewDashboardEdit from "vue-material-design-icons/ViewDashboardEdit.vue"
    import ReceiptTextClockOutline from "vue-material-design-icons/ReceiptTextClockOutline.vue"
    import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue"
    import BellRing from "vue-material-design-icons/BellRing.vue"
    import Replay from "vue-material-design-icons/Replay.vue"

    interface Card {
        title: string
        description: string
        cta: string
        link: string
        icon?: any
    }

    interface Subsection {
        title?: string
        cards: Card[]
    }

    interface TextPart {
        text: string
        highlight: boolean
    }

    interface Section {
        title: string
        subsections: Subsection[]
    }

    function splitHighlight(text: string): TextPart[] {
        const regex = /\*\*([^*]+)\*\*/g
        const parts: TextPart[] = []
        let lastIndex = 0
        let match

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex)
                parts.push({
                    text: text.substring(lastIndex, match.index),
                    highlight: false,
                })

            parts.push({ text: match[1], highlight: true })

            lastIndex = match.index + match[0].length
        }

        if (lastIndex < text.length)
            parts.push({ text: text.substring(lastIndex), highlight: false })

        return parts
    }

    const sections: Section[] = [
        {
            title: "**Developer-First** Workflow Experience",
            subsections: [
                {
                    title: "Create and Run Workflows Without Deployment Headaches",
                    cards: [
                        {
                            title: "Everything From the UI",
                            description:
                                "Create and run workflows from the all-in-one built-in YAML editor, syntax validation, autocompletion, and file I/O.",
                            cta: "Discover the editor",
                            link: "https://kestra.io/docs/ui/flows",
                            icon: Monitor,
                        },
                        {
                            title: "Everything as Code",
                            description:
                                "Manage versioned flows through Git or the YAML-based format that's easy to read, edit, and maintain.",
                            cta: "Learn more",
                            link: "https://kestra.io/docs/version-control-cicd",
                            icon: CodeBrackets,
                        },
                        {
                            title: "Declarative Configuration",
                            description:
                                "Define your workflows in a portable, YAML-based format that's easy to read, edit, and maintain.",
                            cta: "Declarative Configuration",
                            link: "https://kestra.io/docs/workflow-components/flow#flow-sample",
                            icon: TuneVariant,
                        },
                    ],
                },
                {
                    title: "Iterate and Debug Faster",
                    cards: [
                        {
                            title: "Built-in Documentation",
                            description:
                                "Always up-to-date plugin documentation directly in the editor.",
                            cta: "Editor documentation",
                            link: "https://kestra.io/docs/ui",
                            icon: BookOpenPageVariantOutline,
                        },
                        {
                            title: "Autocompletion & Syntax Validation",
                            description:
                                "Get real-time feedback while typing and auto-completing validations.",
                            cta: "Editor features",
                            link: "https://kestra.io/docs/ui/flows",
                            icon: CheckCircleOutline,
                        },
                        {
                            title: "Live Debugging Tools",
                            description:
                                "Use the live variables client to debug your tasks and preview inputs and outputs quickly.",
                            cta: "Live monitoring",
                            link: "https://kestra.io/docs/administrator-guide/monitoring#monitoring",
                            icon: Bug,
                        },
                    ],
                },
                {
                    title: "Modular and Language-Agnostic",
                    cards: [
                        {
                            title: "Scripting Support",
                            description:
                                "Write tasks in Python, Bash, NodeJS, SQL, R, all from your browser.",
                            cta: "Supported languages",
                            link: "https://kestra.io/docs/scripts",
                            icon: Console,
                        },
                        {
                            title: "Modular by Design",
                            description:
                                "Log outputs and observe configurations to manage better flows.",
                            cta: "Writing modular workflows",
                            link: "https://kestra.io/docs/workflow-components/subflows",
                            icon: Connection,
                        },
                        {
                            title: "Strong Typing and Validation",
                            description:
                                "Define and enforce validation for schema-driven workflows.",
                            cta: "Schema validation",
                            link: "https://kestra.io/docs/tutorial/inputs",
                            icon: ShieldCheck,
                        },
                    ],
                },
                {
                    title: "Versioning & Deployment",
                    cards: [
                        {
                            title: "Built-in Versioning",
                            description:
                                "Every change is tracked. Preview diffs or roll back when things go wrong.",
                            cta: "Version control all your workflows",
                            link: "https://kestra.io/docs/best-practices/git",
                            icon: SourceCommit,
                        },
                        {
                            title: "CI/CD Friendly",
                            description:
                                "Run any task from your CI/CD pipeline to automate deployments and builds.",
                            cta: "CI/CD integration",
                            link: "https://kestra.io/docs/version-control-cicd/cicd",
                            icon: SyncCircle,
                        },
                        {
                            title: "No Deploy Headaches",
                            description:
                                "Deploy directly from the UI or use CLI to automate everything.",
                            cta: "Deploy workflows",
                            link: "#",
                            icon: CloudUploadOutline,
                        },
                    ],
                },
            ],
        },
        {
            title: "**Powerful** Execution Engine",
            subsections: [
                {
                    title: "Event-Driven and Time-Based Triggers",
                    cards: [
                        {
                            title: "Trigger System",
                            description:
                                "Start workflows based on file arrivals, webhooks, or scheduled times.",
                            cta: "Types of triggers",
                            link: "https://kestra.io/docs/tutorial/triggers",
                            icon: CalendarTodayOutline,
                        },
                        {
                            title: "Real-time Events",
                            description:
                                "React to new data instantly - no polling, database changes, message queues.",
                            cta: "Real-time processing",
                            link: "https://kestra.io/docs/workflow-components/triggers/realtime-trigger",
                            icon: LightningBolt,
                        },
                        {
                            title: "API First",
                            description: "Start flows programmatically via API, CLI, or Kestra UI.",
                            cta: "Kestra API reference",
                            link: "https://kestra.io/docs/api-reference",
                            icon: Api,
                        },
                    ],
                },
                {
                    title: "Scalable and Resilient",
                    cards: [
                        {
                            title: "Process Data at Scale",
                            description:
                                "Use distributed mapping to handle large datasets efficiently.",
                            cta: "Distributed executions",
                            link: "https://kestra.io/docs/workflow-components/execution",
                            icon: SineWave,
                        },
                        {
                            title: "Micro-Batch CDC",
                            description:
                                "Capture and process change data in small, manageable batches.",
                            cta: "Change data capture",
                            link: "https://kestra.io/use-cases/change-data-capture",
                            icon: DatabaseCogOutline,
                        },
                        {
                            title: "Horizontal and Vertical Scaling",
                            description:
                                "Kestra's engine scales automatically with your workloads.",
                            cta: "Scaling architecture",
                            link: "https://kestra.io/docs/enterprise/scalability",
                            icon: UnfoldLessVertical,
                        },
                    ],
                },
                {
                    cards: [
                        {
                            title: "Built on the JVM",
                            description: "Benefit from high performance and memory efficiency.",
                            cta: "Kestra Architecture",
                            link: "https://kestra.io/docs/architecture",
                            icon: CoffeeOutline,
                        },
                        {
                            title: "No Single Point of Failure",
                            description: "Designed for fault tolerant, reliable execution.",
                            cta: "System reliability",
                            link: "https://kestra.io/docs/architecture/deployment-architecture#high-availability-deployment",
                            icon: BackupRestore,
                        },
                    ],
                },
            ],
        },
        {
            title: "Built-In **Monitoring** and **Observability**",
            subsections: [
                {
                    title: "Insights at a Glance",
                    cards: [
                        {
                            title: "Dashboards and Metrics",
                            description: "Monitor performance and usage directly in the UI.",
                            cta: "Metrics and observability",
                            link: "https://kestra.io/docs/ui/dashboard",
                            icon: ViewDashboardEdit,
                        },
                        {
                            title: "Execution Details",
                            description: "Access full logs and task-level status in real time.",
                            cta: "Inspecting logs",
                            link: "https://kestra.io/docs/ui/logs",
                            icon: ReceiptTextClockOutline,
                        },
                    ],
                },
                {
                    title: "Error Handling and Notifications",
                    cards: [
                        {
                            title: "Automatic Retries",
                            description:
                                "Recover from transient failures with built-in retry logic.",
                            cta: "Retry logic",
                            link: "https://kestra.io/docs/workflow-components/retries",
                            icon: RefreshAuto,
                        },
                        {
                            title: "Smart Alerts",
                            description:
                                "Get notified on completion, delay, or failure via Slack, email, or custom webhooks.",
                            cta: "Alerting triggers",
                            link: "https://kestra.io/docs/administrator-guide/monitoring",
                            icon: BellRing,
                        },
                        {
                            title: "Replay Executions",
                            description:
                                "Fix logic and rerun failed workflows without costly re-computation of tasks that have already been completed.",
                            cta: "Rerun workflows",
                            link: "https://kestra.io/docs/concepts/replay",
                            icon: Replay,
                        },
                    ],
                },
            ],
        },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .experience {
        max-height: 4283px;
        padding-top: 4rem;
        padding-bottom: 6rem;
        max-height: 100%;
        background: $white;
        position: relative;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            height: 2582px;
            background-image: radial-gradient(circle, #e0dfe3 1px, transparent 1px);
            background-size: 20px 20px;
            opacity: 0.4;
            z-index: 1;
            pointer-events: none;
        }

        .container {
            padding: 0;
            position: relative;
            z-index: 2;
        }

        @media (max-width: 767px) {
            padding: 2rem 1rem;
        }
    }

    h2 {
        font-size: 3rem;
        @media screen and (max-width: 767px) {
            font-size: 2rem !important;
        }
        font-weight: 600;
        line-height: 100%;
        margin-top: 3rem;
        margin-bottom: -1rem;
    }

    .highlight {
        background: linear-gradient(90deg, #9f79f3 0%, #658af9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
    }

    .features-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0;

        @media (min-width: 1200px) {
            grid-template-columns: repeat(3, 1fr);
        }

        @media (min-width: 768px) and (max-width: 1199px) {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .card {
        width: 100%;
        height: 260px;
        min-height: 260px;
        padding: 32px;
        background: $white;
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        border: 1px solid #e3e3e3;
        border-radius: 0;

        @media (min-width: 1200px) {
            &:not(:first-child):not(:nth-child(3n + 1)) {
                border-left: none;
            }

            &:nth-child(n + 4) {
                border-top: none;
            }
        }

        @media (min-width: 768px) and (max-width: 1199px) {
            width: 100%;

            &:nth-child(odd) {
                border-right: none;
            }

            &:nth-child(n + 3) {
                border-right: 1px solid #e3e3e3;
            }
        }

        @media (max-width: 767px) {
            &:not(:first-child) {
                border-top: none;
            }
        }

        h3 {
            font-size: 18.4px;
            line-height: 28px;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: $gray-900;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .material-design-icon {
            font-size: 24px;
            margin-top: -0.4rem;
        }

        p {
            font-size: 1rem;
            color: $gray-700;
            margin-bottom: auto;
            line-height: 1.5;
        }

        .cta {
            position: relative;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #0087ca;
            text-decoration: none;
            width: fit-content;

            &::after {
                content: "";
                position: absolute;
                width: 100%;
                transform: scaleX(0);
                border-radius: 5px;
                height: 0.05em;
                bottom: 0;
                left: 0;
                background: currentcolor;
                transform-origin: bottom right;
                transition: transform 0.25s ease-out;
            }

            &:hover::after {
                transform: scaleX(1);
                transform-origin: bottom left;
            }
        }
    }

    .section-subtitle {
        text-align: left;

        h3 {
            font-size: 2rem;
            font-weight: 600;
            @include media-breakpoint-up(lg) {
                line-height: 3rem;
            }
            margin: 2rem 0;
        }
    }

    div:not(:first-child) .section-subtitle h3 {
        margin-top: 3rem;
    }

    [data-section-index="0"] {
        .icon,
        .cta {
            color: #8405ff !important;
        }
    }

    [data-section-index="1"] [data-subsection-index="0"] {
        .icon,
        .cta {
            color: #029e73 !important;
        }
    }

    [data-section-index="1"] [data-subsection-index="1"],
    [data-section-index="1"] [data-subsection-index="2"] {
        .icon,
        .cta {
            color: #1761fd !important;
        }
    }

    [data-section-index="2"] {
        .icon,
        .cta {
            color: #05a084 !important;
        }
    }
</style>