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
    @use "/src/components/vra-migration-guide/shared" as *;
    .currency-select {
        margin-bottom: 1rem;
    }

    .form-label {
        @include calc-form-label;
    }

    .form-select {
        @include calc-form-field;
    }
</style>
