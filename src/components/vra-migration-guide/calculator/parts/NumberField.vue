<template>
    <div class="number-field" :class="{ compact }">
        <label v-if="!hideLabel" class="form-label" :for="id">
            <slot name="label">{{ label }}</slot>
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
            :aria-describedby="hasHint ? `${id}-hint` : undefined"
            @input="onInput"
        />
        <p v-if="hasHint" :id="`${id}-hint`" class="hint">
            <slot name="hint">{{ hint }}</slot>
        </p>
    </div>
</template>

<script setup lang="ts">
    import { computed, useSlots } from "vue"
    import type { InputValue } from "~/utils/vra-calculator"

    const props = withDefaults(
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

    const slots = useSlots()
    const hasHint = computed(() => !!props.hint || !!slots.hint)

    function onInput(event: Event) {
        emit(
            "update:modelValue",
            (event.target as HTMLInputElement).value.trim(),
        )
    }
</script>

<style scoped lang="scss">
    .number-field {
        margin-bottom: 1rem;

        &.compact {
            margin-bottom: 0;
        }
    }

    .form-label {
        font-size: $font-size-sm;
        font-weight: 600;
        color: var(--ks-content-primary);
    }

    .form-control {
        --ks-form-bg: var(--ks-background-input, var(--ks-background-body));
        --ks-form-color: var(--ks-content-primary);
        --ks-form-border-color: var(--ks-border-primary);
        font-variant-numeric: tabular-nums;

        &::placeholder {
            color: var(--ks-content-tertiary);
        }
    }

    .hint {
        margin: 0.35rem 0 0;
        font-size: $font-size-xs;
        color: var(--ks-content-secondary);
    }
</style>
