<template>
    <div class="number-field" :class="{ compact }">
        <div v-if="!hideLabel" class="label-row">
            <span>
                <label class="form-label" :for="id">{{ label }}</label>
                <InfoTip v-if="$slots.info" class="info" :label="label">
                    <slot name="info" />
                </InfoTip>
            </span>
        </div>
        <div class="control" :class="{ prefixed: prefix, suffixed: suffix }">
            <span v-if="prefix" class="adornment prefix" aria-hidden="true">{{
                prefix
            }}</span>
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
            <span v-if="suffix" class="adornment suffix" aria-hidden="true">{{
                suffix
            }}</span>
        </div>
        <p v-if="hint" :id="`${id}-hint`" class="hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
    import type { InputValue } from "~/utils/vra-calculator"
    import InfoTip from "./InfoTip.vue"

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
            prefix?: string
            suffix?: string
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
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;

        &.compact {
            margin-bottom: 0;
        }
    }

    .label-row {
        display: flex;
        flex: 1 0 auto;
        flex-direction: column;
        justify-content: flex-end;
        margin-bottom: 0.5rem;
    }

    .form-label {
        @include calc-form-label;
        display: inline;
        margin: 0;
    }

    .info {
        margin-left: 0.375rem;
    }

    .control {
        position: relative;
    }

    .form-control {
        @include calc-form-field;
        font-variant-numeric: tabular-nums;

        &::placeholder {
            color: var(--ks-content-tertiary);
        }
    }

    .prefixed .form-control {
        padding-left: 2.25rem;
    }

    .suffixed .form-control {
        padding-right: 2.25rem;
    }

    .adornment {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: var(--ks-content-tertiary);
        pointer-events: none;
    }

    .prefix {
        left: 1rem;
    }

    .suffix {
        right: 1rem;
    }

    .hint {
        @include calc-hint;
        margin: 0.5rem 0 0;
    }
</style>
