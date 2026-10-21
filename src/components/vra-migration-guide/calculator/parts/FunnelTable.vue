<template>
    <ul class="funnel-table">
        <li class="row">
            <NumberField
                :id="`${idPrefix}-total`"
                v-bind="field('total')"
                class="cell-input"
                label="Total workflows in vRO"
                hide-label
            />
            <div class="text">
                <span class="label-row">
                    <label :for="`${idPrefix}-total`"
                        >Total workflows in vRO</label
                    >
                    <InfoTip label="Total workflows in vRO">
                        Count them with the
                        <a href="/resources/migration/vra/assistant"
                            >Migration Assistant</a
                        >, or by hand using section 3.2.1 of the
                        <a href="/resources/migration/vra#section-3-2-1"
                            >migration guide</a
                        >.
                    </InfoTip>
                </span>
                <p><strong>vRO workflows</strong></p>
            </div>
        </li>
        <li class="row">
            <NumberField
                :id="`${idPrefix}-active`"
                :model-value="active.modelValue"
                :invalid="active.invalid"
                class="cell-input"
                label="Still in use (%)"
                suffix="%"
                :max="100"
                hide-label
                @update:model-value="active['onUpdate:modelValue']"
            />
            <div class="text">
                <span class="label-row">
                    <label :for="`${idPrefix}-active`">Still in use (%)</label>
                    <InfoTip label="Still in use (%)">
                        Workflows that ran at least once in the last 12 months.
                        The rest are retired rather than migrated.
                    </InfoTip>
                </span>
                <p><strong>{{ counts.scope }}</strong> will run in Kestra</p>
            </div>
        </li>
        <li class="row">
            <NumberField
                :id="`${idPrefix}-dupes`"
                v-bind="field('dupes')"
                class="cell-input"
                label="Near-duplicates (%)"
                suffix="%"
                :max="99"
                hide-label
            />
            <div class="text">
                <span class="label-row">
                    <label :for="`${idPrefix}-dupes`"
                        >Near-duplicates (%)</label
                    >
                    <InfoTip label="Near-duplicates (%)">
                        Workflows that are copies of another workflow. In
                        Kestra they become 1 workflow with input parameters.
                    </InfoTip>
                </span>
                <p>
                    <strong>{{ counts.distinct }}</strong> unique Kestra flows
                    <span class="sub"
                        >Variables and parameters let one flow cover several
                        workflows.</span
                    >
                </p>
            </div>
        </li>
        <li class="row">
            <NumberField
                :id="`${idPrefix}-wrappers`"
                v-bind="field('wrappers')"
                class="cell-input"
                label="Wrappers (%)"
                suffix="%"
                :max="100"
                hide-label
            />
            <div class="text">
                <span class="label-row">
                    <label :for="`${idPrefix}-wrappers`">Wrappers (%)</label>
                    <InfoTip label="Wrappers (%)">
                        Workflows that only call Ansible, a script, a pipeline
                        or an integration a Kestra plugin already covers. They
                        move without conversion work.
                    </InfoTip>
                </span>
                <p>
                    <strong>{{ counts.wrappers }}</strong> wrappers
                    <span class="sub"
                        >Thin wrappers come across at no migration cost.</span
                    >
                </p>
            </div>
        </li>
        <li class="row total">
            <strong class="cell-input">{{ counts.careful }}</strong>
            <p class="text">
                need careful conversion
                <InfoTip label="need careful conversion">
                    What's left: workflows with logic of their own that need to
                    be converted. This is what will be estimated below.
                </InfoTip>
            </p>
        </li>
    </ul>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import { complementPercent, funnelCounts } from "../presentation"
    import InfoTip from "./InfoTip.vue"
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

        p {
            margin: 0;
        }

        .label-row {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            margin-bottom: 0.125rem;

            label {
                @include calc-form-label;
                font-size: inherit;
                margin: 0;
            }
        }

        strong {
            font-variant-numeric: tabular-nums;
        }

        .sub {
            display: block;
            @include calc-hint;
        }
    }
</style>
