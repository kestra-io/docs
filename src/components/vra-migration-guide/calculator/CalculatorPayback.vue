<template>
    <div class="calculator-payback" :aria-busy="!ready">
        <div class="layout">
            <div class="inputs">
                <CalculatorMessages v-bind="messages" />

                <section class="panel" :aria-labelledby="`${idPrefix}-step-1`">
                    <div class="panel-head">
                        <h4 :id="`${idPrefix}-step-1`">
                            vRA/vRO renewal you are trying to avoid
                        </h4>
                        <span class="step">Step 1</span>
                    </div>
                    <div class="row-currency">
                        <CurrencySelect
                            :id="`${idPrefix}-cur`"
                            :model-value="inputs.cur"
                            @update:model-value="update('cur', $event)"
                        />
                        <NumberField
                            :id="`${idPrefix}-today`"
                            v-bind="field('today')"
                            :label="`Approx. annual vRA and vRO spend today (${inputs.cur})`"
                            :step="1000"
                        />
                    </div>
                    <div class="grid-2">
                        <MultipleChips
                            :id="`${idPrefix}-mult`"
                            v-bind="field('mult')"
                        >
                            <template #hint>
                                <a
                                    href="https://www.theregister.com/2024/08/26/vmware_explore_preview/"
                                    target="_blank"
                                    rel="noopener"
                                    >Gartner expects increases of 200 to 500% at
                                    renewal</a
                                >. The 3x default is deliberately conservative.
                                Enter your expected multiple.
                            </template>
                        </MultipleChips>
                        <NumberField
                            :id="`${idPrefix}-renew`"
                            v-bind="field('renew')"
                            label="Months until the renewal"
                            :max="60"
                        />
                    </div>
                    <NumberField
                        :id="`${idPrefix}-other`"
                        v-bind="field('other')"
                        :label="`Other annual costs (${inputs.cur})`"
                        :step="1000"
                        hint="Ex: support, infra, consulting, professional services"
                    />
                    <p class="derived">
                        <RichText
                            v-if="result.payback"
                            :parts="renewalLine(result.payback, inputs.cur)"
                        />
                        <template v-else>{{ PLACEHOLDER }}</template>
                    </p>
                </section>

                <section class="panel" :aria-labelledby="`${idPrefix}-step-2`">
                    <div class="panel-head">
                        <h4 :id="`${idPrefix}-step-2`">
                            What getting out costs
                        </h4>
                        <span class="step">Step 2</span>
                    </div>
                    <details class="counts">
                        <summary>
                            Your workflow counts
                            <span class="summary-line">{{
                                funnelSummary(result.funnel)
                            }}</span>
                        </summary>
                        <div class="details-body">
                            <FunnelFields
                                :id-prefix="`${idPrefix}-counts`"
                                :field="field"
                            />
                            <p class="hint">
                                Carried over from Section 3.2.2. Change them
                                here or there.
                            </p>
                        </div>
                    </details>
                    <p class="derived spaced">
                        <RichText
                            v-if="result.funnel"
                            :parts="effortLine(result.funnel)"
                        />
                        <template v-else>{{ PLACEHOLDER }}</template>
                    </p>
                    <NumberField
                        :id="`${idPrefix}-complex`"
                        v-bind="field('complex')"
                        :label="`Of the ${careful.careful} workflows (${careful.distinct} - ${careful.wrappers}) that need careful migration, what share is complex (%)`"
                        :max="100"
                        hint="Complex is code nobody fully understands, or behavior that should be redesigned."
                    />
                    <div class="range-field">
                        <label class="form-label" :for="`${idPrefix}-tool`">
                            Share of the conversion the AI-assisted vRO
                            migration tool handles
                        </label>
                        <div class="range">
                            <input
                                :id="`${idPrefix}-tool`"
                                type="range"
                                :min="TOOL_SHARE_RANGE.min"
                                :max="TOOL_SHARE_RANGE.max"
                                :step="TOOL_SHARE_RANGE.step"
                                :value="inputs.tool ?? ''"
                                :aria-describedby="`${idPrefix}-tool-hint`"
                                @input="
                                    update(
                                        'tool',
                                        ($event.target as HTMLInputElement)
                                            .value,
                                    )
                                "
                            />
                            <output :for="`${idPrefix}-tool`">{{
                                toolShareLabel(inputs.tool)
                            }}</output>
                        </div>
                        <p :id="`${idPrefix}-tool-hint`" class="hint">
                            It converts the structure and drafts the script
                            rewrite for medium workflows. Complex ones are
                            usually rewritten or redesigned, so they stay at the
                            manual rate. Section 5.2 covers how it works.
                        </p>
                    </div>
                    <NumberField
                        :id="`${idPrefix}-rate`"
                        v-bind="field('rate')"
                        :label="`Blended hourly rate (${inputs.cur})`"
                        :step="5"
                        hint="Your internal cost, an offshore rate or a partner quote, whichever you will actually pay."
                    />
                    <details class="assumptions">
                        <summary>Adjust the effort assumptions</summary>
                        <div class="details-body">
                            <p class="hint">
                                Hours by hand, before the migration tool. The
                                first column is working out what a workflow
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
                                                compact
                                            />
                                        </td>
                                        <td class="num">
                                            <NumberField
                                                :id="`${idPrefix}-${row.variant}`"
                                                v-bind="field(row.variant)"
                                                :label="`${row.label}, each near-duplicate`"
                                                :step="0.5"
                                                hide-label
                                                compact
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

                <section class="panel" :aria-labelledby="`${idPrefix}-step-3`">
                    <div class="panel-head">
                        <h4 :id="`${idPrefix}-step-3`">
                            What you would spend on Kestra
                        </h4>
                        <span class="step">Step 3</span>
                    </div>
                    <div class="grid-2">
                        <NumberField
                            :id="`${idPrefix}-kestra`"
                            v-bind="field('kestra')"
                            :label="`Kestra licence and hosting, a year (${inputs.cur})`"
                            :step="1000"
                            placeholder="Leave blank if no quote"
                            hint="If you don't have a quote yet, leave it blank and the calculator works out the most you could pay and still come out ahead."
                        />
                        <NumberField
                            :id="`${idPrefix}-horizon`"
                            v-bind="field('horizon')"
                            label="Planning horizon, years"
                            :min="1"
                            :max="10"
                            hint="Three years is the usual convention if finance has not set one."
                        />
                    </div>
                </section>
            </div>

            <aside class="result" :aria-label="'Payback result'">
                <ResultPanel
                    :id="`${idPrefix}-result`"
                    :payback="result.payback"
                    :currency="inputs.cur"
                    :poc-href="pocHref"
                >
                    <template #actions>
                        <CsvDownloadButton
                            :get-file="() => csvFile(new Date())"
                            :disabled="!ready"
                        />
                        <ShareLinkButton
                            :get-url="() => shareUrl(shareAnchor)"
                            :disabled="!ready"
                        />
                    </template>
                </ResultPanel>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import { TOOL_SHARE_RANGE } from "~/utils/vra-calculator"
    import CalculatorMessages from "./parts/CalculatorMessages.vue"
    import CsvDownloadButton from "./parts/CsvDownloadButton.vue"
    import CurrencySelect from "./parts/CurrencySelect.vue"
    import FunnelFields from "./parts/FunnelFields.vue"
    import MultipleChips from "./parts/MultipleChips.vue"
    import NumberField from "./parts/NumberField.vue"
    import ResultPanel from "./parts/ResultPanel.vue"
    import RichText from "./parts/RichText.vue"
    import ShareLinkButton from "./parts/ShareLinkButton.vue"
    import {
        PLACEHOLDER,
        carefulCounts,
        effortLine,
        funnelSummary,
        renewalLine,
        toolShareLabel,
        viewMessages,
    } from "./presentation"
    import { useCalculator } from "./useCalculator"

    withDefaults(
        defineProps<{
            idPrefix?: string
            shareAnchor?: string
            pocHref?: string
        }>(),
        {
            idPrefix: "vra-calc-payback",
            shareAnchor: "section-7-2",
            pocHref: "#section-8-1",
        },
    )

    const { inputs, result, field, update, ready, shareUrl, csvFile } =
        useCalculator()

    const messages = computed(() => viewMessages(result.value, "payback"))
    const careful = computed(() => carefulCounts(result.value.funnel))

    const effortRows = [
        { label: "Medium", first: "hp1", variant: "hv1" },
        { label: "Complex", first: "hp2", variant: "hv2" },
    ] as const
</script>

<style scoped lang="scss">
    .calculator-payback {
        container-type: inline-size;
    }

    .layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @container (min-width: 46rem) {
            grid-template-columns: minmax(0, 1fr) minmax(0, 20rem);
            align-items: start;
        }
    }

    .inputs {
        container-type: inline-size;
    }

    .calculator-payback :deep(a) {
        color: var(--ks-content-link);
    }

    .result {
        @container (min-width: 46rem) {
            position: sticky;
            top: calc(100px + var(--announce-height, 0px));
        }
    }

    .panel {
        margin-bottom: 1rem;
        padding: 1.25rem;
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
        margin-bottom: 1rem;

        h4 {
            margin: 0;
            font-size: 1.05rem;
            font-weight: 600;
        }
    }

    .step {
        font-size: $font-size-xs;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--ks-content-secondary);
        white-space: nowrap;
    }

    .row-currency {
        display: grid;
        grid-template-columns: 7rem 1fr;
        gap: 1rem;
    }

    .grid-2 {
        display: grid;
        grid-template-columns: 1fr;
        column-gap: 1rem;

        @container (min-width: 34rem) {
            grid-template-columns: 1fr 1fr;
        }
    }

    .derived {
        margin: 0;
        padding: 0.65rem 0.8rem;
        border-radius: $border-radius;
        background: var(--ks-background-secondary);
        font-size: $font-size-sm;

        &.spaced {
            margin-bottom: 1rem;
        }
    }

    .hint {
        margin: 0.35rem 0 0.75rem;
        font-size: $font-size-xs;
        color: var(--ks-content-secondary);
    }

    details {
        margin-bottom: 1rem;

        summary {
            cursor: pointer;
            font-size: $font-size-sm;
            font-weight: 600;
        }
    }

    .summary-line {
        font-weight: 400;
        color: var(--ks-content-secondary);
    }

    .details-body {
        padding-top: 0.75rem;
    }

    .form-label {
        font-size: $font-size-sm;
        font-weight: 600;
    }

    .range-field {
        margin-bottom: 1rem;
    }

    .range {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        input {
            flex: 1;
            accent-color: var(--ks-content-link);
        }

        output {
            min-width: 3rem;
            text-align: right;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
        }
    }

    .table {
        margin-bottom: 0.5rem;
        font-size: $font-size-sm;

        .num {
            width: 9rem;
        }
    }
</style>
