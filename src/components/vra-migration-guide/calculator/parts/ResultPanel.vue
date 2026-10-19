<template>
    <div class="result-panel">
        <!-- Only the headline is announced; the rest changes with it. -->
        <p
            class="headline"
            :class="{ pending: !payback }"
            aria-live="polite"
        >{{ title }}</p>
        <template v-if="payback">
            <p class="summary">
                <template v-if="avoided.length">
                    <RichText :parts="avoided" />{{ " " }}
                </template>
                <RichText :parts="net" />
            </p>
            <PaybackChart :payback="payback" />
            <div v-if="breakEven.length" class="break-even">
                <p><RichText :parts="breakEven" /></p>
                <p class="reference-note">
                    <a href="/stories/fortune-500-company"
                        >A Fortune 500 manufacturer that replaced vRA</a
                    >
                    reports licensing 90% below Aria Automation.
                </p>
            </div>
        </template>
        <a class="btn btn-primary btn-lg poc-cta" :href="pocHref"
            >Validate with a proof of concept</a
        >
        <p class="poc-note">
            We'll help you migrate 2-3 of your workflows to get better
            estimates.
        </p>
        <div v-if="$slots.actions" class="actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import type { Currency, PaybackResult } from "~/utils/vra-calculator"
    import {
        avoidedLine,
        breakEvenLine,
        headline,
        netLine,
    } from "../presentation"
    import PaybackChart from "./PaybackChart.vue"
    import RichText from "./RichText.vue"

    const props = withDefaults(
        defineProps<{
            payback: PaybackResult | null
            currency: Currency
            pocHref?: string
        }>(),
        { pocHref: "#section-8-1" },
    )

    const title = computed(() => headline(props.payback))
    const avoided = computed(() =>
        props.payback ? avoidedLine(props.payback, props.currency) : [],
    )
    const net = computed(() =>
        props.payback ? netLine(props.payback, props.currency) : [],
    )
    const breakEven = computed(() =>
        props.payback ? breakEvenLine(props.payback, props.currency) : [],
    )
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .result-panel {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem 0.5rem;
    }

    p {
        margin: 0;
    }

    .headline {
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.3;
        color: var(--ks-content-primary);
        text-wrap: balance;

        &.pending {
            font-size: 1rem;
            font-weight: 500;
            color: var(--ks-content-secondary);
        }
    }

    .summary,
    .break-even {
        font-size: 1rem;
        line-height: 1.5;
        color: var(--ks-content-primary);
    }

    .break-even {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }

    .reference-note {
        color: var(--ks-content-secondary);
    }

    .poc-cta {
        margin-top: 1rem;
        font-weight: 600;
    }

    .poc-note {
        @include calc-hint;
        font-size: $font-size-sm;
        text-align: center;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem 1rem;
    }
</style>
