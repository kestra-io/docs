<template>
    <div class="funnel-fields">
        <NumberField
            :id="`${idPrefix}-total`"
            v-bind="field('total')"
            label="vRO workflows in the raw export"
        />
        <NumberField
            :id="`${idPrefix}-dormant`"
            v-bind="field('dormant')"
            label="Not executed in 12 months (%)"
            :max="100"
            :hint="
                withHints
                    ? 'Usually 10 to 20 percent of a large environment.'
                    : undefined
            "
        />
        <NumberField
            :id="`${idPrefix}-dupes`"
            v-bind="field('dupes')"
            label="Near-duplicates of another workflow (%)"
            :max="99"
            :hint="
                withHints
                    ? 'The same workflow copied per environment, business unit or requester type. Each copy becomes an input on one flow.'
                    : undefined
            "
        />
        <NumberField
            :id="`${idPrefix}-wrappers`"
            v-bind="field('wrappers')"
            label="Wrappers with no logic of their own (%)"
            :max="100"
            :hint="
                withHints
                    ? 'Workflows that only call Ansible, a script, a pipeline, or a single integration Kestra has a plugin for. Kestra calls the same thing directly.'
                    : undefined
            "
        />
    </div>
</template>

<script setup lang="ts">
    import type { useCalculator } from "../useCalculator"
    import NumberField from "./NumberField.vue"

    defineProps<{
        idPrefix: string
        field: ReturnType<typeof useCalculator>["field"]
        withHints?: boolean
    }>()
</script>

<style scoped lang="scss">
    .funnel-fields {
        display: grid;
        grid-template-columns: 1fr;
        column-gap: 1rem;

        @container (min-width: 34rem) {
            grid-template-columns: 1fr 1fr;
        }
    }
</style>
