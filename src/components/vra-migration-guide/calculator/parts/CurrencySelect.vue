<template>
    <fieldset class="currency-select">
        <legend class="visually-hidden">Currency</legend>
        <label v-for="code in ORDER" :key="code" class="segment">
            <input
                class="visually-hidden"
                type="radio"
                :name="id"
                :value="code"
                :checked="modelValue === code"
                @change="emit('update:modelValue', code)"
            />
            <span>{{ currencySymbol(code) }} {{ code }}</span>
        </label>
    </fieldset>
</template>

<script setup lang="ts">
    import { currencySymbol, type Currency } from "~/utils/vra-calculator"

    defineProps<{ id: string; modelValue: Currency }>()
    const emit = defineEmits<{ "update:modelValue": [value: Currency] }>()

    const ORDER: readonly Currency[] = ["USD", "EUR", "GBP"]
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .currency-select {
        display: inline-flex;
        gap: 0.125rem;
        margin: 0;
        padding: 0.25rem;
        border: 0;
        border-radius: $border-radius-lg;
        background: var(--ks-background-secondary);
    }

    .segment {
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
</style>
