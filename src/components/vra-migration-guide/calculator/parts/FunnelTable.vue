<template>
    <ul class="funnel-table">
        <li class="row">
            <NumberField
                :id="`${idPrefix}-total`"
                v-bind="field('total')"
                class="cell-input"
                label="vRO workflows in the raw export"
                hide-label
            />
            <p class="text"><strong>vRO workflows</strong></p>
        </li>
        <li class="row">
            <NumberField
                :id="`${idPrefix}-active`"
                :model-value="active.modelValue"
                :invalid="active.invalid"
                class="cell-input"
                label="Executed in the last 12 months (%)"
                suffix="%"
                :max="100"
                hide-label
                @update:model-value="active['onUpdate:modelValue']"
            />
            <p class="text">
                <strong>{{ counts.scope }}</strong> will run in Kestra
            </p>
        </li>
        <li class="row">
            <NumberField
                :id="`${idPrefix}-dupes`"
                v-bind="field('dupes')"
                class="cell-input"
                label="Near-duplicates of another workflow (%)"
                suffix="%"
                :max="99"
                hide-label
            />
            <p class="text">
                <strong>{{ counts.distinct }}</strong> unique Kestra flows
                <span class="sub"
                    >Variables and parameters let one flow cover several
                    workflows.</span
                >
            </p>
        </li>
        <li class="row">
            <NumberField
                :id="`${idPrefix}-wrappers`"
                v-bind="field('wrappers')"
                class="cell-input"
                label="Wrappers with no logic of their own (%)"
                suffix="%"
                :max="100"
                hide-label
            />
            <p class="text">
                <strong>{{ counts.wrappers }}</strong> wrappers
                <span class="sub"
                    >Thin wrappers come across at no migration cost.</span
                >
            </p>
        </li>
        <li class="row total">
            <strong class="cell-input">{{ counts.careful }}</strong>
            <p class="text">need careful conversion</p>
        </li>
    </ul>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import { complementPercent, funnelCounts } from "../presentation"
    import NumberField from "./NumberField.vue"
    import type { FunnelResult } from "~/utils/vra-calculator"
    import type { useCalculator } from "../calculatorStore"

    const { field, funnel } = defineProps<{
        idPrefix: string
        field: ReturnType<typeof useCalculator>["field"]
        funnel: FunnelResult | null
    }>()

    const counts = computed(() => funnelCounts(funnel))

    const active = computed(() => {
        const dormant = field("dormant")
        return {
            modelValue: complementPercent(dormant.modelValue),
            invalid: dormant.invalid,
            "onUpdate:modelValue": (value: string) =>
                dormant["onUpdate:modelValue"](
                    value === "" ? "" : complementPercent(value),
                ),
        }
    })
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .funnel-table {
        padding: 0;
        list-style: none;
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;
        overflow: hidden;
    }

    .row {
        display: grid;
        grid-template-columns: 5.5rem 1fr;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 1rem;

        & + & {
            border-top: 1px solid var(--ks-border-primary);
        }

        &.total {
            padding-block: 0.75rem;
            border-top-color: var(--ks-border-active);
            background: var(--ks-background-purple-light);
            color: var(--ks-content-link);
            font-weight: 600;

            .cell-input {
                text-align: center;
                font-variant-numeric: tabular-nums;
            }
        }
    }

    .cell-input {
        :deep(.form-control) {
            padding-inline: 0.5rem;
            text-align: center;
        }

        :deep(.suffixed .form-control) {
            padding-right: 1.5rem;
        }

        :deep(.suffix) {
            right: 0.5rem;
        }
    }

    .text {
        margin: 0;
        font-size: $font-size-sm;

        strong {
            font-variant-numeric: tabular-nums;
        }

        .sub {
            display: block;
            @include calc-hint;
        }
    }
</style>
