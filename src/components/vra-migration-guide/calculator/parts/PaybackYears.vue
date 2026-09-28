<template>
    <div class="payback-years">
        <p :id="`${id}-title`" class="label">{{ title }}</p>
        <ul class="years" :aria-labelledby="`${id}-title`">
            <li v-for="year in years" :key="year.label" class="year">
                <span>{{ year.label }}</span>
                <div class="track" aria-hidden="true">
                    <div class="mid" />
                    <div
                        class="fill"
                        :class="year.positive ? 'pos' : 'neg'"
                        :style="{
                            left: `${year.left}%`,
                            width: `${year.width}%`,
                        }"
                    />
                </div>
                <span class="value" :class="year.positive ? 'pos' : 'neg'">
                    {{ year.value }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import type { Currency, PaybackResult } from "~/utils/vra-calculator"
    import { yearBars, yearsTitle } from "../presentation"

    const props = defineProps<{
        id: string
        payback: PaybackResult
        currency: Currency
    }>()

    const title = computed(() => yearsTitle(props.payback))
    const years = computed(() => yearBars(props.payback, props.currency))
</script>

<style scoped lang="scss">
    .payback-years {
        margin-top: 1.25rem;
    }

    .label {
        margin: 0 0 0.5rem;
        font-size: $font-size-xs;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--ks-content-secondary);
    }

    .years {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .year {
        display: grid;
        grid-template-columns: 3.3rem 1fr 6rem;
        align-items: center;
        gap: 0.5rem;
        margin: 0.35rem 0;
        font-size: $font-size-sm;
    }

    .track {
        position: relative;
        height: 18px;
        border-radius: 4px;
        background: var(--ks-background-secondary);
        overflow: hidden;
    }

    .mid {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px;
        background: var(--ks-border-secondary);
    }

    .fill {
        position: absolute;
        top: 0;
        bottom: 0;
        border-radius: 3px;
        transition: all 0.2s ease;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }

        &.pos {
            background: var(--ks-content-alert-success);
        }

        &.neg {
            background: var(--ks-content-alert-danger);
        }
    }

    .value {
        text-align: right;
        font-variant-numeric: tabular-nums;

        &.pos {
            color: var(--ks-content-alert-success);
        }

        &.neg {
            color: var(--ks-content-alert-danger);
        }
    }
</style>
