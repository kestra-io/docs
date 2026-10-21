<template>
    <div class="result-panel">
        <!-- Only the headline is announced; the rest changes with it. -->
        <p class="headline" :class="{ pending: !payback }" aria-live="polite">
            {{ headline(payback) }}
        </p>
        <template v-if="payback">
            <p>
                <template v-if="avoided.length">
                    <RichText :parts="avoided" />{{ " " }}
                </template>
                <RichText :parts="netLine(payback, currency)" />
            </p>
            <PaybackChart :payback="payback" />
            <div v-if="breakEven.length" class="break-even">
                <p><RichText :parts="breakEven" /></p>
                <p class="reference-note">
                    <a v-if="storyHref" :href="storyHref"
                        >A Fortune 500 manufacturer that replaced vRA</a
                    >
                    <template v-else
                        >A Fortune 500 manufacturer that replaced vRA</template
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
    import {
        avoidedLine,
        breakEvenLine,
        headline,
        netLine,
    } from "../presentation"
    import PaybackChart from "./PaybackChart.vue"
    import RichText from "./RichText.vue"
    import type { Currency, PaybackResult } from "~/utils/vra-calculator"

    const {
        payback,
        currency,
        storyHref = "/stories/fortune-500-company",
    } = defineProps<{
        payback: PaybackResult | null
        currency: Currency
        pocHref: string
        /** Null renders the reference as plain text, for pages that keep exits off. */
        storyHref?: string | null
    }>()

    const avoided = computed(() =>
        payback ? avoidedLine(payback, currency) : [],
    )
    const breakEven = computed(() =>
        payback ? breakEvenLine(payback, currency) : [],
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
        text-wrap: balance;

        &.pending {
            font-size: 1rem;
            font-weight: 500;
            color: var(--ks-content-secondary);
        }
    }

    .break-even {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;

        .reference-note {
            color: var(--ks-content-secondary);
        }
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
