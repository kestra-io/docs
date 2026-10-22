<template>
    <div class="number-field" :class="{ compact: hideLabel }">
        <div v-if="!hideLabel" class="label-row">
            <label class="form-label" :for="id"
                >{{ labelParts.head
                }}<span class="label-tail"
                    ><a v-if="labelLink" :href="labelLink.href">{{
                        labelParts.tail
                    }}</a
                    ><template v-else>{{ labelParts.tail }}</template
                    ><InfoTip v-if="$slots.info" class="info" :label="label">
                        <slot name="info" /> </InfoTip></span
            ></label>
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
                :value="model ?? ''"
                :min="min"
                :max="max"
                :step="step"
                :aria-label="label"
                :aria-invalid="invalid || undefined"
                :aria-describedby="hint ? `${id}-hint` : undefined"
                @input="
                    model = ($event.target as HTMLInputElement).value.trim()
                "
            />
            <span v-if="suffix" class="adornment suffix" aria-hidden="true">{{
                suffix
            }}</span>
        </div>
        <p v-if="hint" :id="`${id}-hint`" class="hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import InfoTip from "./InfoTip.vue"
    import type { InputValue } from "~/utils/vra-calculator"

    const props = withDefaults(
        defineProps<{
            id: string
            label?: string
            hint?: string
            invalid?: boolean
            min?: number
            max?: number
            step?: number
            prefix?: string
            suffix?: string
            hideLabel?: boolean
            /** Links the end of the label, which must match `text`. */
            labelLink?: { text: string; href: string }
        }>(),
        { min: 0, step: 1 },
    )

    const model = defineModel<InputValue>({ required: true })

    // The info icon stays on the line of the label's last word (or its
    // linked end), so it never wraps onto a line of its own.
    const labelParts = computed(() => {
        const label = props.label ?? ""
        const linked = props.labelLink?.text
        const cut =
            linked && label.endsWith(linked)
                ? label.length - linked.length
                : label.lastIndexOf(" ") + 1
        return { head: label.slice(0, cut), tail: label.slice(cut) }
    })
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
        justify-content: flex-start;
        margin-bottom: 0.5rem;

        .form-label {
            @include calc-form-label;
            display: inline;
            margin: 0;
        }

        .label-tail {
            white-space: nowrap;

            a {
                color: var(--ks-content-link);
            }

            :deep(.ks-tooltip) {
                white-space: normal;
            }
        }

        .info {
            margin-left: 0.375rem;
        }
    }

    .control {
        position: relative;
    }

    .form-control {
        @include calc-form-field;
        font-variant-numeric: tabular-nums;
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
