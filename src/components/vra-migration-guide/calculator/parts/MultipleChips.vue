<template>
    <fieldset class="multiple-chips">
        <legend class="form-label">{{ label }}</legend>
        <div class="chips" role="group" :aria-describedby="`${id}-hint`">
            <button
                v-for="preset in presets"
                :key="preset"
                type="button"
                class="chip"
                :aria-pressed="!showCustom && selected === preset"
                @click="choose(preset)"
            >
                {{ preset }}&times;
            </button>
            <button
                type="button"
                class="chip"
                :aria-pressed="showCustom"
                :aria-controls="`${id}-custom`"
                @click="customMode = true"
            >
                Custom
            </button>
        </div>
        <NumberField
            v-if="showCustom"
            :id="`${id}-custom`"
            class="custom"
            :model-value="modelValue"
            label="Custom renewal multiple (×)"
            :invalid="invalid"
            :step="0.5"
            @update:model-value="emit('update:modelValue', $event)"
        />
        <p :id="`${id}-hint`" class="hint">
            <slot name="hint" />
        </p>
    </fieldset>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue"
    import {
        RENEWAL_MULTIPLE_PRESETS,
        isPresetMultiple,
        toNumber,
        type InputValue,
    } from "~/utils/vra-calculator"
    import NumberField from "./NumberField.vue"

    const props = withDefaults(
        defineProps<{
            id: string
            modelValue: InputValue
            label?: string
            invalid?: boolean
            presets?: readonly number[]
        }>(),
        {
            label: "Expected renewal multiple (×)",
            presets: () => RENEWAL_MULTIPLE_PRESETS,
        },
    )

    const emit = defineEmits<{
        "update:modelValue": [value: number | string]
    }>()

    const customMode = ref(false)
    const showCustom = computed(
        () => customMode.value || !isPresetMultiple(props.modelValue),
    )
    const selected = computed(() => toNumber(props.modelValue))

    function choose(preset: number) {
        customMode.value = false
        emit("update:modelValue", preset)
    }
</script>

<style scoped lang="scss">
    .multiple-chips {
        margin: 0 0 1rem;
        padding: 0;
        border: 0;
        min-width: 0;
    }

    .form-label {
        font-size: $font-size-sm;
        font-weight: 600;
        color: var(--ks-content-primary);
    }

    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .chip {
        min-width: 3.5rem;
        padding: 0.375rem 0.85rem;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 999px;
        background: var(--ks-background-body);
        color: var(--ks-content-primary);
        font-size: $font-size-sm;
        font-variant-numeric: tabular-nums;

        &[aria-pressed="true"] {
            border-color: var(--ks-content-link);
            color: var(--ks-content-link);
            font-weight: 600;
        }

        &:focus-visible {
            outline: 2px solid var(--ks-content-link);
            outline-offset: 2px;
        }
    }

    .custom {
        margin: 0.75rem 0 0;
        max-width: 12rem;
    }

    .hint {
        margin: 0.35rem 0 0;
        font-size: $font-size-xs;
        color: var(--ks-content-secondary);

        &:empty {
            display: none;
        }
    }
</style>
