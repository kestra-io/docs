<template>
    <div class="currency-select">
        <label class="form-label" :for="id">Currency</label>
        <select
            :id="id"
            class="form-select"
            :value="modelValue"
            @change="onChange"
        >
            <option v-for="code in CURRENCIES" :key="code" :value="code">
                {{ code }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
    import {
        CURRENCIES,
        isCurrency,
        type Currency,
    } from "~/utils/vra-calculator"

    defineProps<{ id: string; modelValue: Currency }>()
    const emit = defineEmits<{ "update:modelValue": [value: Currency] }>()

    function onChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value
        if (isCurrency(value)) emit("update:modelValue", value)
    }
</script>

<style scoped lang="scss">
    .currency-select {
        margin-bottom: 1rem;
    }

    .form-label {
        font-size: $font-size-sm;
        font-weight: 600;
        color: var(--ks-content-primary);
    }

    .form-select {
        --ks-form-bg: var(--ks-background-input, var(--ks-background-body));
        --ks-form-color: var(--ks-content-primary);
        --ks-form-border-color: var(--ks-border-primary);
    }
</style>
