<template>
    <div class="calculator-funnel" :aria-busy="!ready">
        <CalculatorMessages v-bind="messages" />
        <section class="panel">
            <FunnelFields :id-prefix="idPrefix" :field="field" with-hints />
            <p class="hint">
                Percentages apply in sequence: not executed comes off the
                export, near-duplicates are a share of what migrates, and
                wrappers are a share of the distinct flows left.
            </p>
            <p class="derived">
                <RichText
                    v-if="result.funnel"
                    :parts="funnelLine(result.funnel)"
                />
                <template v-else>{{ PLACEHOLDER }}</template>
            </p>
        </section>

        <div class="readout" aria-live="polite">
            <p class="label">What the three passes do to your count</p>
            <ul class="tiles">
                <li v-for="tile in readout" :key="tile.label">
                    <strong>{{ tile.value }}</strong>
                    <span>{{ tile.label }}</span>
                </li>
            </ul>
        </div>
        <p class="hint after">
            A rough sizing pass, not a substitute for the real inventory.
            <a :href="calcHref">The calculator in Section 7.2</a> turns these
            counts into a cost and a payback.
        </p>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import CalculatorMessages from "./parts/CalculatorMessages.vue"
    import FunnelFields from "./parts/FunnelFields.vue"
    import RichText from "./parts/RichText.vue"
    import {
        PLACEHOLDER,
        funnelLine,
        funnelReadout,
        viewMessages,
    } from "./presentation"
    import { useCalculator } from "./useCalculator"

    withDefaults(
        defineProps<{
            idPrefix?: string
            calcHref?: string
        }>(),
        { idPrefix: "vra-calc-funnel", calcHref: "#section-7-2" },
    )

    const { result, field, ready } = useCalculator()

    const messages = computed(() => viewMessages(result.value, "funnel"))
    const readout = computed(() => funnelReadout(result.value.funnel))
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .calculator-funnel :deep(a) {
        color: var(--ks-content-link);
    }

    .panel {
        @include calc-panel;
        container-type: inline-size;
    }

    .hint {
        @include calc-hint;
        margin: 0 0 0.75rem;

        &.after {
            margin: 0.75rem 0 0;
        }
    }

    .derived {
        @include calc-derived;
    }

    .readout {
        margin-top: 1rem;
        padding: 1rem 1.1rem;
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;
        background: var(--ks-background-secondary);
    }

    .label {
        @include guide-eyebrow(var(--ks-content-secondary), true);
        margin: 0 0 0.5rem;
    }

    .tiles {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
        margin: 0;
        padding: 0;
        list-style: none;

        @include media-breakpoint-up(md) {
            grid-template-columns: repeat(4, 1fr);
        }

        li {
            padding: 0.55rem 0.6rem;
            border: 1px solid var(--ks-border-secondary);
            border-radius: $border-radius;
            background: var(--ks-background-body);
        }

        strong {
            display: block;
            font-size: 1.25rem;
            line-height: 1.2;
            font-variant-numeric: tabular-nums;
        }

        span {
            display: block;
            font-size: $font-size-xs;
            line-height: 1.3;
            color: var(--ks-content-secondary);
        }
    }
</style>
