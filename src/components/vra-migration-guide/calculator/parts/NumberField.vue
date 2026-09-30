<template>
    <div class="number-field" :class="{ compact }">
        <label v-if="!hideLabel" class="form-label" :for="id">
            {{ label }}
        </label>
        <input
            :id="id"
            class="form-control"
            :class="{ 'is-invalid': invalid }"
            type="number"
            inputmode="decimal"
            :value="modelValue ?? ''"
            :min="min"
            :max="max"
            :step="step"
            :placeholder="placeholder"
            :aria-label="hideLabel ? label : undefined"
            :aria-invalid="invalid || undefined"
            :aria-describedby="hint ? `${id}-hint` : undefined"
            @input="onInput"
        />
        <p v-if="hint" :id="`${id}-hint`" class="hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
    import type { InputValue } from "~/utils/vra-calculator"

    withDefaults(
        defineProps<{
            id: string
            modelValue: InputValue
            label?: string
            hint?: string
            invalid?: boolean
            min?: number
            max?: number
            step?: number
            placeholder?: string
            hideLabel?: boolean
            compact?: boolean
        }>(),
        { min: 0, step: 1 },
    )

    const emit = defineEmits<{ "update:modelValue": [value: string] }>()

    function onInput(event: Event) {
        emit(
            "update:modelValue",
            (event.target as HTMLInputElement).value.trim(),
        )
    }
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .number-field {
        margin-bottom: 1rem;

        &.compact {
            margin-bottom: 0;
        }
    }

    .form-label {
        @include calc-form-label;
    }

    .form-control {
        @include calc-form-field;
        font-variant-numeric: tabular-nums;

        &::placeholder {
            color: var(--ks-content-tertiary);
        }
    }

    .hint {
        @include calc-hint;
        margin: 0.35rem 0 0;
    }
</style>
