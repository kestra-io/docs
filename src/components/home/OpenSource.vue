<template>
    <section class="oss-bg">
        <div class="container">
            <h2 class="title-block">
                <span class="gradient">Open Source</span>
                Workflow Orchestration Platform
            </h2>

            <div class="features">
                <div v-for="feature in features" :key="feature.title" class="feature">
                    <NuxtImg v-bind="feature.image" :alt="feature.title" class="feature-image" />
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.description }}</p>
                </div>
            </div>

            <div class="lead-indicators">
                <div v-for="{ title, value } of leadIndicators" :key="title" class="lead-indicator">
                    <h3>{{ value }}</h3>
                    <p>{{ title }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { computed } from "vue"
    import declarativeOrchestration from "./assets/declarative-orchestration.png"
    import eventTriggers from "./assets/event-triggers.png"
    import lockIn from "./assets/lock-in.png"

    const props = defineProps<{
        stargazers: number
        contributors: number
        error?: unknown
    }>()

    const features = [
        {
            title: "Declarative Orchestration",
            description:
                "Onboard new team members quickly, and maintain your workflows with minimal effort thanks to Kestra's declarative syntax.",
            image: declarativeOrchestration,
        },
        {
            title: "Event Based Triggers",
            description:
                "Configure your workflows to run on a schedule, via webhooks, APIs, event-based triggers, or in real-time with millisecond latency.",
            image: eventTriggers,
        },
        {
            title: "No vendor Lock-in",
            description:
                "Define your flow in YAML from the embedded Code Editor, run them directly from the UI, scale to any infrastructure.",
            image: lockIn,
        },
    ]

    const numberOfStargazersFormatted = computed(() =>
        new Intl.NumberFormat("en", {
            notation: "compact",
            maximumFractionDigits: 1,
        })
            .format(props?.stargazers ?? 0)
            .toLowerCase(),
    )

    const leadIndicators = computed(() => [
        { title: "Contributors", value: "750+" },
        ...(props.error
            ? []
            : [
                  {
                      title: "GitHub Stars",
                      value: numberOfStargazersFormatted.value,
                  },
              ]),
        { title: "Kestra Deployments", value: "120k" },
        { title: "Workflows Executed", value: "1b+" },
    ])
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .oss-bg {
        background-color: white;
        @include media-breakpoint-up(md) {
            padding: 2rem;
        }
    }
    .container {
        padding: 2rem;
        text-align: center;
        z-index: 1;
        position: relative;
    }

    h2 {
        font-size: 3rem;
        font-weight: 600;
        margin-bottom: 2rem;
        span.gradient {
            display: block;
            // font color gradient from #8C4BFF to #FF6A00
            background: linear-gradient(90deg, #8c4bff 0%, #6fb0ff 100%) no-repeat center;
            background-size: cover;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .features {
        display: grid;
        @include media-breakpoint-up(xl) {
            grid-template-columns: repeat(3, minmax(350px, 1fr));
            padding: 2rem 0;
        }
        margin-top: 2rem;
        background-color: #f7f7f8;
        border-radius: 10px;
        border: 1px solid #e1e1e1;
    }

    .feature {
        padding: 2rem;
        border-bottom: 1px solid #e1e1e1;
        @include media-breakpoint-up(xl) {
            padding: 1rem 2rem 0;
            border: none;
            border-right: 1px solid #e1e1e1;
        }
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        .feature-image {
            width: 90px;
            height: 90px;
            object-fit: contain;
            margin-bottom: 1.2rem;
        }
        h3 {
            white-space: nowrap;
            font-size: 1.5rem;
        }
        &:last-child {
            border: none;
        }
    }

    .lead-indicators {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        row-gap: 1rem;
        margin-top: 2rem;

        @include media-breakpoint-up(lg) {
            grid-template-columns: repeat(4, 1fr);
            row-gap: 2rem;
            width: 100%;

            &:has(.lead-indicator:nth-child(3):last-child) {
                grid-template-columns: repeat(3, minmax(200px, 300px));
                justify-content: center;
            }
        }
    }

    .lead-indicator {
        padding: 0 1rem;
        @include media-breakpoint-up(sm) {
            gap: 0.5rem;
            padding: 1rem 2rem;
        }
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0;
            @include media-breakpoint-up(lg) {
                font-size: 3rem !important;
                line-height: 3rem;
            }
        }
        p {
            font-size: 0.8rem;
            @include media-breakpoint-up(lg) {
                font-size: 1rem;
            }
            line-height: 1rem;
            color: #9c9c9c;
            white-space: nowrap;
        }
        &:nth-child(odd):after {
            content: "";
            display: block;
            width: 1px;
            height: 50%;
            background-color: #e1e1e1;
            position: absolute;
            top: 15%;
            right: 0;
            @include media-breakpoint-up(lg) {
                display: none;
            }
        }
        @include media-breakpoint-up(lg) {
            border-right: 1px solid #e1e1e1;
        }
        &:last-child {
            border-right: none;
        }
    }
</style>