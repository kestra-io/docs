<template>
    <figure class="payback-chart">
        <figcaption class="head">
            <span>{{ title }}</span>
            <span>{{ chart.caption }}</span>
        </figcaption>
        <div class="plot" role="img" :aria-label="summary">
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path class="area" :d="chart.area" />
                <line
                    class="zero"
                    x1="0"
                    x2="100"
                    :y1="chart.zeroY"
                    :y2="chart.zeroY"
                />
                <line
                    v-if="chart.renewalX !== null"
                    class="renewal"
                    :x1="chart.renewalX"
                    :x2="chart.renewalX"
                    y1="0"
                    y2="100"
                />
                <path class="line" :d="chart.line" />
            </svg>
            <span
                v-if="chart.renewalX !== null"
                class="renewal-label"
                :style="{ left: `${chart.renewalX}%` }"
                aria-hidden="true"
                >Renewal</span
            >
            <span
                v-if="chart.point"
                class="point"
                :style="{ left: `${chart.point.x}%`, top: `${chart.point.y}%` }"
                aria-hidden="true"
            />
        </div>
        <ul class="ticks" aria-hidden="true">
            <li
                v-for="tick in chart.ticks"
                :key="tick.label"
                :style="{ left: `${tick.x}%` }"
            >
                {{ tick.label }}
            </li>
        </ul>
    </figure>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import type { PaybackResult } from "~/utils/vra-calculator"
    import { headline, paybackChart, yearsTitle } from "../presentation"

    const props = defineProps<{ payback: PaybackResult }>()

    const chart = computed(() => paybackChart(props.payback))
    const title = computed(() => yearsTitle(props.payback))
    const summary = computed(
        () =>
            `${title.value}, ${chart.value.caption.toLowerCase()}. ${headline(props.payback)}`,
    )
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .payback-chart {
        margin: 0;
        padding: 0.5rem 1rem 0.75rem 0.5rem;
        border-radius: $border-radius-lg;
        background: var(--ks-background-body);
    }

    .head {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.5rem;
        @include calc-hint;
        font-size: $font-size-sm;

        span:last-child {
            white-space: nowrap;
        }
    }

    .plot {
        position: relative;
        height: 8rem;
        margin: 0 0.75rem 0 0.5rem;

        svg {
            display: block;
            width: 100%;
            height: 100%;
            overflow: visible;
        }
    }

    .area {
        fill: var(--ks-background-purple-light);
    }

    .line,
    .zero,
    .renewal {
        fill: none;
        vector-effect: non-scaling-stroke;
    }

    .line {
        stroke: var(--ks-content-link);
        stroke-width: 1.5;
        stroke-linejoin: round;
    }

    .zero {
        stroke: var(--ks-border-secondary);
        stroke-width: 1;
    }

    .renewal {
        stroke: var(--ks-content-tertiary);
        stroke-width: 1;
        stroke-dasharray: 2 3;
    }

    .renewal-label {
        position: absolute;
        top: -1.1rem;
        transform: translateX(0.25rem);
        font-size: 0.625rem;
        color: var(--ks-content-secondary);
    }

    .point {
        position: absolute;
        width: 0.6rem;
        height: 0.6rem;
        border: 2px solid var(--ks-content-link);
        border-radius: 50%;
        background: var(--ks-background-body);
        transform: translate(-50%, -50%);
    }

    .ticks {
        position: relative;
        height: 1rem;
        margin: 0.75rem 0.75rem 0 0.5rem;
        padding: 0;
        list-style: none;

        li {
            position: absolute;
            transform: translateX(-50%);
            font-size: 0.625rem;
            color: var(--ks-content-secondary);
            white-space: nowrap;

            &:first-child {
                transform: none;
            }

            &:last-child {
                transform: translateX(-100%);
            }
        }
    }
</style>
