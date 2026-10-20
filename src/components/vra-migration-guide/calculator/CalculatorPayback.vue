<template>
    <div class="calculator-payback" :aria-busy="!ready">
        <div class="layout">
            <div class="inputs">
                <div class="messages" aria-live="polite">
                    <template
                        v-for="(list, tone) in viewMessages(result)"
                        :key="tone"
                    >
                        <p
                            v-for="message in list"
                            :key="message"
                            class="message"
                            :class="tone"
                        >
                            {{ message }}
                        </p>
                    </template>
                </div>

                <section
                    class="step-card"
                    :aria-labelledby="`${idPrefix}-step-1`"
                >
                    <div class="card-head">
                        <h3 :id="`${idPrefix}-step-1`">
                            The renewal you're avoiding
                        </h3>
                        <span class="step" aria-label="Step 1 of 3">1/3</span>
                        <fieldset class="currency">
                            <legend class="visually-hidden">Currency</legend>
                            <label
                                v-for="code in ['USD', 'EUR', 'GBP'] as const"
                                :key="code"
                            >
                                <input
                                    class="visually-hidden"
                                    type="radio"
                                    :name="`${idPrefix}-cur`"
                                    :value="code"
                                    :checked="inputs.cur === code"
                                    @change="update('cur', code)"
                                />
                                <span
                                    >{{ currencySymbol(code) }} {{ code }}</span
                                >
                            </label>
                        </fieldset>
                    </div>
                    <div class="grid-2">
                        <NumberField
                            :id="`${idPrefix}-today`"
                            v-bind="field('today')"
                            label="Annual vRA + vRO spend today"
                            :prefix="symbol"
                            :step="1000"
                        />
                        <NumberField
                            :id="`${idPrefix}-renew`"
                            v-bind="field('renew')"
                            label="Months until renewal"
                            :max="60"
                        />
                    </div>
                    <ChoiceChips
                        :id="`${idPrefix}-mult`"
                        v-bind="field('mult')"
                        label="Expected price increase at renewal"
                        :presets="RENEWAL_MULTIPLE_PRESETS"
                        :format="(preset) => `${preset}x`"
                        custom-label="Custom renewal multiple (×)"
                    >
                        <template #info>
                            <a
                                href="https://www.theregister.com/2024/08/26/vmware_explore_preview/"
                                target="_blank"
                                rel="noopener"
                                >Gartner expects increases of 200 to 500% at
                                renewal</a
                            >. The 3x default is deliberately conservative.
                            Enter your expected multiple.
                        </template>
                    </ChoiceChips>
                    <NumberField
                        :id="`${idPrefix}-other`"
                        v-bind="field('other')"
                        label="Other annual costs"
                        :prefix="symbol"
                        :step="1000"
                    >
                        <template #info>
                            Ex: support, infra, consulting, professional
                            services
                        </template>
                    </NumberField>
                    <p class="derived">
                        <RichText
                            v-if="result.payback"
                            :parts="renewalLine(result.payback, inputs.cur)"
                        />
                        <template v-else>{{ PLACEHOLDER }}</template>
                    </p>
                </section>

                <section
                    class="step-card"
                    :aria-labelledby="`${idPrefix}-step-2`"
                >
                    <div class="card-head">
                        <h3 :id="`${idPrefix}-step-2`">
                            What the migration costs
                        </h3>
                        <span class="step" aria-label="Step 2 of 3">2/3</span>
                    </div>
                    <p class="intro">
                        Start from your vRO export count. Change any number and
                        the result updates.
                    </p>
                    <FunnelTable
                        :id-prefix="`${idPrefix}-counts`"
                        :field="field"
                        :funnel="result.funnel"
                    />
                    <div class="grid-3">
                        <NumberField
                            :id="`${idPrefix}-rate`"
                            v-bind="field('rate')"
                            label="Blended hourly rate"
                            :prefix="symbol"
                            :step="5"
                        >
                            <template #info>
                                Your internal cost, an offshore rate or a
                                partner quote, whichever you will actually pay.
                            </template>
                        </NumberField>
                        <NumberField
                            :id="`${idPrefix}-complex`"
                            v-bind="field('complex')"
                            label="Share that's complex"
                            suffix="%"
                            :max="100"
                        >
                            <template #info>
                                Of the
                                {{ carefulCounts(result.funnel).careful }}
                                workflows that need careful conversion. Complex
                                is code nobody fully understands, or behavior
                                that should be redesigned.
                            </template>
                        </NumberField>
                        <NumberField
                            :id="`${idPrefix}-tool`"
                            v-bind="field('tool')"
                            label="Handled by the AI migration tool"
                            suffix="%"
                            :min="TOOL_SHARE_RANGE.min"
                            :max="TOOL_SHARE_RANGE.max"
                            :step="TOOL_SHARE_RANGE.step"
                        >
                            <template #info>
                                It converts the structure and rewrites the
                                JavaScript for medium workflows, and we run it
                                with you. Complex ones are usually rewritten or
                                redesigned, so they stay at the manual rate. The
                                default is an assumption, so replace it with the
                                share measured in your proof of concept.
                            </template>
                        </NumberField>
                    </div>
                    <p class="derived">
                        <RichText
                            v-if="result.payback"
                            :parts="costLine(result.payback, inputs.cur)"
                        />
                        <template v-else>{{ PLACEHOLDER }}</template>
                    </p>
                    <details class="assumptions">
                        <summary>Adjust the effort assumptions</summary>
                        <div class="details-body">
                            <p class="hint">
                                Hours by hand, before the Migration Assistant.
                                The first column is working out what a workflow
                                does, building it in Kestra and checking the
                                result. The second is each near-duplicate once
                                the first exists. Wrappers migrate at no cost.
                            </p>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Complexity</th>
                                        <th scope="col" class="num">
                                            First of a kind
                                        </th>
                                        <th scope="col" class="num">
                                            Each near-duplicate
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="row in effortRows"
                                        :key="row.label"
                                    >
                                        <th scope="row">{{ row.label }}</th>
                                        <td class="num">
                                            <NumberField
                                                :id="`${idPrefix}-${row.first}`"
                                                v-bind="field(row.first)"
                                                :label="`${row.label}, first of a kind`"
                                                :step="0.5"
                                                hide-label
                                            />
                                        </td>
                                        <td class="num">
                                            <NumberField
                                                :id="`${idPrefix}-${row.variant}`"
                                                v-bind="field(row.variant)"
                                                :label="`${row.label}, each near-duplicate`"
                                                :step="0.5"
                                                hide-label
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p class="hint">
                                Starting assumptions. A proof of concept
                                replaces them with rates measured on your own
                                workflows.
                            </p>
                        </div>
                    </details>
                </section>

                <section
                    class="step-card"
                    :aria-labelledby="`${idPrefix}-step-3`"
                >
                    <div class="card-head">
                        <h3 :id="`${idPrefix}-step-3`">
                            What you'd spend on Kestra
                        </h3>
                        <span class="step" aria-label="Step 3 of 3">3/3</span>
                    </div>
                    <div class="grid-2 top">
                        <NumberField
                            :id="`${idPrefix}-kestra`"
                            v-bind="field('kestra')"
                            label="Kestra licence and hosting, a year"
                            :prefix="symbol"
                            :step="1000"
                            hint="No quote yet? Leave it blank and we'll show the most you could pay and still come out ahead."
                        />
                        <ChoiceChips
                            :id="`${idPrefix}-horizon`"
                            v-bind="field('horizon')"
                            label="Planning horizon"
                            :presets="[1, 3, 5]"
                            :format="
                                (years) =>
                                    `${years} year${years === 1 ? '' : 's'}`
                            "
                            custom-label="Planning horizon, years"
                            :custom-chip="false"
                            :custom-min="1"
                            :custom-step="1"
                            hint="Three years is the usual convention if finance hasn't set one."
                        />
                    </div>
                </section>
            </div>

            <aside class="result" aria-label="Payback result">
                <ResultPanel
                    :payback="result.payback"
                    :currency="inputs.cur"
                    :poc-href="pocHref"
                >
                    <template #actions>
                        <ResultActions :share-anchor="shareAnchor" />
                    </template>
                </ResultPanel>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import {
        RENEWAL_MULTIPLE_PRESETS,
        TOOL_SHARE_RANGE,
        currencySymbol,
    } from "~/utils/vra-calculator"
    import { useCalculator } from "./calculatorStore"
    import ChoiceChips from "./parts/ChoiceChips.vue"
    import FunnelTable from "./parts/FunnelTable.vue"
    import NumberField from "./parts/NumberField.vue"
    import ResultActions from "./parts/ResultActions.vue"
    import ResultPanel from "./parts/ResultPanel.vue"
    import RichText from "./parts/RichText.vue"
    import {
        PLACEHOLDER,
        carefulCounts,
        costLine,
        renewalLine,
        viewMessages,
    } from "./presentation"

    const {
        idPrefix = "vra-calc-payback",
        shareAnchor = "section-7-2",
        pocHref = "#section-8-2",
    } = defineProps<{
        idPrefix?: string
        shareAnchor?: string
        pocHref?: string
    }>()

    const { inputs, result, field, update, ready } = useCalculator()

    const symbol = computed(() => currencySymbol(inputs.value.cur))

    const effortRows = [
        { label: "Medium", first: "hp1", variant: "hv1" },
        { label: "Complex", first: "hp2", variant: "hv2" },
    ] as const
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .calculator-payback {
        container-type: inline-size;
        padding: 1rem 0.5rem 1rem 1rem;
        border-radius: $border-radius-lg;
        background: var(--ks-background-secondary);
        color: var(--ks-content-primary);

        :deep(a:not(.btn)) {
            color: var(--ks-content-link);
        }
    }

    .layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.5rem 1.5rem;

        @container (min-width: 52rem) {
            grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
            align-items: start;
        }
    }

    .inputs {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        container-type: inline-size;
    }

    .result {
        @container (min-width: 52rem) {
            position: sticky;
            top: calc(100px + var(--announce-height, 0px));
        }
    }

    .step-card {
        @include calc-card;

        @container (max-width: 30rem) {
            padding: 1.25rem;
        }
    }

    .card-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem 1rem;
        padding-bottom: 1rem;

        h3 {
            margin: 0;
            font-size: 1rem;
            color: inherit;
        }

        .step {
            padding: 0 0.625rem;
            border-radius: 999px;
            background: var(--ks-background-secondary);
            font-size: $font-size-sm;
            color: var(--ks-content-secondary);
            font-variant-numeric: tabular-nums;
        }
    }

    .currency {
        display: inline-flex;
        gap: 0.125rem;
        margin-left: auto;
        padding: 0.25rem;
        border-radius: $border-radius-lg;
        background: var(--ks-background-secondary);

        span {
            display: block;
            padding: 0.125rem 0.625rem;
            border-radius: $border-radius;
            font-size: $font-size-sm;
            color: var(--ks-content-secondary);
            white-space: nowrap;
            cursor: pointer;
        }

        input:checked + span {
            background: var(--ks-background-body);
            box-shadow: $calc-shadow-surface;
            color: var(--ks-content-primary);
            font-weight: 600;
        }

        input:focus-visible + span {
            outline: 2px solid var(--ks-border-active);
            outline-offset: 1px;
        }
    }

    .messages:empty {
        display: none;
    }

    .message {
        margin: 0 0 0.5rem;
        padding: 0.5rem 0.75rem;
        border: 1px solid currentColor;
        border-radius: $border-radius;
        font-size: $font-size-sm;

        &.errors {
            color: var(--ks-content-alert-danger);
            background: var(--ks-background-alert-danger);
        }

        &.warnings {
            color: var(--ks-content-alert-warning);
            background: var(--ks-background-alert-warning);
        }
    }

    .intro {
        margin: 0 0 1rem;
    }

    @each $columns in 2, 3 {
        .grid-#{$columns} {
            display: grid;
            grid-template-columns: 1fr;
            column-gap: 1rem;

            @container (min-width: 28rem) {
                grid-template-columns: repeat($columns, 1fr);
            }
        }
    }

    .top {
        align-items: start;
    }

    .derived {
        margin: 0;
        padding: 1rem;
        border-radius: $border-radius;
        background: var(--ks-background-secondary);
    }

    .hint {
        @include calc-hint;
        margin: 0.35rem 0 0.75rem;
    }

    .assumptions {
        margin-top: 1rem;

        summary {
            font-size: $font-size-sm;
            color: var(--ks-content-secondary);
        }
    }

    .details-body {
        padding-top: 0.75rem;
    }

    .table {
        margin-bottom: 0.5rem;
        font-size: $font-size-sm;

        .num {
            width: 9rem;
        }
    }
</style>
