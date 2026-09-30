<template>
    <div class="effort-bars">
        <p class="label">Conversion effort</p>
        <div v-for="bar in bars" :key="bar.variant" class="bar">
            <div class="bar-top">
                <span>{{ bar.label }}</span>
                <strong>{{ bar.hours }}</strong>
            </div>
            <div class="track" aria-hidden="true">
                <div
                    class="fill"
                    :class="`fill-${bar.variant}`"
                    :style="{ width: `${bar.percent}%` }"
                />
            </div>
        </div>
        <p v-if="reduction.length" class="reduction">
            <RichText :parts="reduction" />
        </p>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import type { Currency, PaybackResult } from "~/utils/vra-calculator"
    import { effortBars, reductionLine } from "../presentation"
    import RichText from "./RichText.vue"

    const props = defineProps<{ payback: PaybackResult; currency: Currency }>()

    const bars = computed(() => effortBars(props.payback))
    const reduction = computed(() =>
        reductionLine(props.payback, props.currency),
    )
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .label {
        @include guide-eyebrow(var(--ks-content-secondary), true);
        margin: 0 0 0.5rem;
    }

    .bar {
        margin: 0.5rem 0;
    }

    .bar-top {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        font-size: $font-size-sm;
        color: var(--ks-content-secondary);

        strong {
            color: var(--ks-content-primary);
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
        }
    }

    .track {
        height: 9px;
        margin-top: 0.3rem;
        border-radius: 5px;
        background: var(--ks-background-secondary);
        overflow: hidden;
    }

    .fill {
        height: 100%;
        border-radius: 5px;
        transition: width 0.2s ease;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }
    }

    .fill-naive {
        background: var(--ks-content-tertiary);
    }

    .fill-manual {
        background: var(--ks-content-secondary);
    }

    .fill-tool {
        background: var(--ks-content-link);
    }

    .reduction {
        margin: 0.5rem 0 0;
        font-size: $font-size-sm;
        color: var(--ks-content-secondary);
    }
</style>
