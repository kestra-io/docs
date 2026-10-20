<template>
    <fieldset class="choice-chips">
        <legend class="label-row">
            <span class="form-label">{{ label }}</span>
            <InfoTip v-if="$slots.info" :label="label">
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
                :aria-controls="showCustom ? `${id}-custom` : undefined"
                @click="customMode = true"
            >
                Custom
            </button>
        </div>
        <NumberField
            v-if="showCustom"
            :id="`${id}-custom`"
            v-model="model"
            class="custom"
            :label="customLabel"
            :invalid="invalid"
            :min="customMin"
            :step="customStep"
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
            label: string
            presets: readonly number[]
            format?: (preset: number) => string
            /** Free-entry field label; without it a non-preset has no field. */
            customLabel?: string
            /** Offer Custom, or only show a value set elsewhere. */
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

    const model = defineModel<InputValue>({ required: true })

    /**
     * Keeps a field opened by a non-preset value open while the visitor types
     * ("1" on the way to "10"), until they pick a chip.
     */
    const customMode = ref(false)
    const selected = computed(() => toNumber(model.value))
    const isPreset = computed(() =>
        props.presets.some((preset) => preset === selected.value),
    )
    const showCustom = computed(
        () => !!props.customLabel && (customMode.value || !isPreset.value),
    )

    watch(
        isPreset,
        (preset) => {
            if (!preset && props.customLabel) customMode.value = true
        },
        { immediate: true },
    )

    function choose(preset: number) {
        customMode.value = false
        model.value = preset
    }
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .choice-chips {
        margin-bottom: 1rem;
    }

    .label-row {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        float: none;
        width: auto;

        .form-label {
            @include calc-form-label;
        }
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
