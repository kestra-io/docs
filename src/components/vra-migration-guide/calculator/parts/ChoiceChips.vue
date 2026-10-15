<template>
    <fieldset class="choice-chips">
        <legend class="label-row">
            <span class="form-label">{{ label }}</span>
            <InfoTip v-if="$slots.info" :id="`${id}-info`" :label="label">
                <slot name="info" />
            </InfoTip>
        </legend>
        <div class="chips">
            <button
                v-for="preset in presets"
                :key="preset"
                type="button"
                class="chip"
                :aria-pressed="!showCustom && selected === preset"
                @click="choose(preset)"
            >
                {{ format(preset) }}
            </button>
            <button
                v-if="customLabel && customChip"
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
            :label="customLabel"
            :invalid="invalid"
            :min="customMin"
            :step="customStep"
            @update:model-value="emit('update:modelValue', $event)"
        />
        <p v-if="hint" class="hint">{{ hint }}</p>
    </fieldset>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from "vue"
    import { toNumber, type InputValue } from "~/utils/vra-calculator"
    import InfoTip from "./InfoTip.vue"
    import NumberField from "./NumberField.vue"

    const props = withDefaults(
        defineProps<{
            id: string
            modelValue: InputValue
            label: string
            presets: readonly number[]
            format?: (preset: number) => string
            /**
             * Label of the free-entry field, shown for a value that is not a
             * preset. Without it, such a value has no field.
             */
            customLabel?: string
            /** Whether the visitor can pick Custom, or only see a value set elsewhere. */
            customChip?: boolean
            customMin?: number
            customStep?: number
            hint?: string
            invalid?: boolean
        }>(),
        {
            format: (preset: number) => String(preset),
            customChip: true,
            customMin: 0,
            customStep: 0.5,
        },
    )

    const emit = defineEmits<{
        "update:modelValue": [value: number | string]
    }>()

    const customMode = ref(false)
    const selected = computed(() => toNumber(props.modelValue))
    const isPreset = computed(() =>
        props.presets.some((preset) => preset === selected.value),
    )
    const showCustom = computed(
        () => !!props.customLabel && (customMode.value || !isPreset.value),
    )

    // Once a non-preset value opens the field, keep it open while the visitor
    // types (e.g. through "1" on the way to "10") until they pick a chip.
    watch(
        isPreset,
        (preset) => {
            if (!preset && props.customLabel) customMode.value = true
        },
        { immediate: true },
    )

    function choose(preset: number) {
        customMode.value = false
        emit("update:modelValue", preset)
    }
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .choice-chips {
        margin: 0 0 1rem;
        padding: 0;
        border: 0;
        min-width: 0;
    }

    .label-row {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        float: none;
        width: auto;
        margin-bottom: 0.5rem;
        padding: 0;
    }

    .form-label {
        @include calc-form-label;
    }

    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .chip {
        min-width: 3rem;
        padding: 0.25rem 1rem;
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius;
        background: var(--ks-background-body);
        color: var(--ks-content-primary);
        font-size: $font-size-sm;
        font-variant-numeric: tabular-nums;
        @include guide-focus-ring;

        &:hover {
            border-color: var(--ks-border-active);
        }

        &[aria-pressed="true"] {
            border-color: var(--ks-border-active);
            box-shadow: inset 0 0 0 1px var(--ks-border-active);
            font-weight: 600;
        }
    }

    .custom {
        margin: 0.75rem 0 0;
        max-width: 12rem;
    }

    .hint {
        @include calc-hint;
        margin: 0.5rem 0 0;
    }
</style>
