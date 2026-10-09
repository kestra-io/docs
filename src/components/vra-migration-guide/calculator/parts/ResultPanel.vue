<template>
    <div class="result-panel" aria-live="polite">
        <div class="result-head">
            <p v-if="payback && avoided.length" class="avoided">
                <RichText :parts="avoided" />
            </p>
            <p class="headline" :class="{ pending: !payback }">{{ title }}</p>
            <template v-if="payback">
                <p class="net"><RichText :parts="net" /></p>
                <div v-if="breakEven.length" class="break-even">
                    <p><RichText :parts="breakEven" /></p>
                    <p class="reference-note">
                        For reference, a
                        <a
                            href="https://kestra.io/customers/fortune-500-company"
                            target="_blank"
                            rel="noopener"
                            >Fortune 500 manufacturer</a
                        >
                        that replaced vRA reports licensing costs 90% below Aria
                        Automation.
                    </p>
                </div>
            </template>
        </div>
        <div class="result-body">
            <template v-if="payback">
                <EffortBars :payback="payback" :currency="currency" />
                <PaybackYears
                    :id="`${id}-years`"
                    :payback="payback"
                    :currency="currency"
                />
            </template>
            <p class="poc-note">
                <strong>The effort rates are our starting assumptions.</strong>
                A proof of concept on two or three of your own workflows
                replaces them with measured ones and gets you a Kestra quote.
                <a class="poc-link" :href="pocHref"
                    >Run a proof of concept with us</a
                >
            </p>
            <div v-if="$slots.actions" class="actions">
                <slot name="actions" />
            </div>
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
    import EffortBars from "./EffortBars.vue"
    import PaybackYears from "./PaybackYears.vue"
    import RichText from "./RichText.vue"

    const props = withDefaults(
        defineProps<{
            id: string
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
    .result-panel {
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;
        background: var(--ks-background-body);
        overflow: hidden;
    }

    .result-head {
        padding: 1.1rem 1.15rem;
        border-bottom: 1px solid var(--ks-border-secondary);
        background: var(--ks-background-secondary);
    }

    .avoided {
        margin: 0 0 0.5rem;
        font-size: $font-size-sm;
        color: var(--ks-content-secondary);
    }

    .headline {
        margin: 0;
        font-size: clamp(1.3rem, 3.2vw, 1.7rem);
        font-weight: 600;
        line-height: 1.2;
        color: var(--ks-content-primary);

        &.pending {
            font-size: 1rem;
            font-weight: 500;
            color: var(--ks-content-secondary);
        }
    }

    .net {
        margin: 0.45rem 0 0;
        font-size: $font-size-sm;
        color: var(--ks-content-secondary);
    }

    .break-even {
        margin: 0.85rem 0 0;
        padding: 0.65rem 0.8rem;
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius;
        font-size: $font-size-sm;

        p {
            margin: 0;
        }

        .reference-note {
            margin-top: 0.4rem;
            font-style: italic;
            color: var(--ks-content-secondary);
        }
    }

    .result-body {
        padding: 1rem 1.15rem 1.15rem;
    }

    .poc-note {
        margin: 1rem 0 0;
        padding-top: 0.85rem;
        border-top: 1px solid var(--ks-border-secondary);
        font-size: $font-size-sm;
        color: var(--ks-content-secondary);

        strong {
            color: var(--ks-content-primary);
        }
    }

    .poc-link {
        display: block;
        margin-top: 0.55rem;
        font-weight: 600;
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        margin-top: 1rem;
    }
</style>
