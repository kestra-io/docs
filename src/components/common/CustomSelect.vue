<template>
    <div class="select-wrapper">
        <label v-if="label" class="label">{{ label }}</label>
        <div class="dropdown">
            <button
                class="btn btn-sm btn-custom"
                :class="[`btn-custom-${$props.size}`]"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <span class="placeholder-value">{{ selectedLabel }}</span>
                <ChevronDown class="icon" />
            </button>
            <ul class="dropdown-menu">
                <li v-for="option in options" :key="option.value">
                    <a
                        class="dropdown-item"
                        :class="{ active: option.value === modelValue }"
                        href="#"
                        @click.prevent="selectOption(option)"
                    >
                        {{ option.label }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"

    const props = withDefaults(
        defineProps<{
            modelValue: string
            options: {
                value: string
                label: string
            }[]
            label?: string
            placeholder?: string
            size?: "sm" | "lg"
        }>(),
        {
            size: "sm",
        },
    )

    const emit = defineEmits<{
        "update:modelValue": [value: string]
    }>()

    const selectedLabel = computed(() => {
        return (
            props.options.find((o) => o.value === props.modelValue)?.label ??
            props.placeholder ??
            ""
        )
    })

    const selectOption = (option: { value: string; label: string }) => {
        emit("update:modelValue", option.value)
    }
</script>

<style lang="scss" scoped>
    .select-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        .label {
            color: var(--ks-content-tertiary);
            font-size: 0.875rem;
        }
        .btn-custom {
            border: $block-border;
            border-color: var(
                --ks-custom-select-border,
                var(--ks-border-primary)
            );
            background-color: var(--ks-background-input);
            color: var(--ks-content-primary);
            font-weight: normal;
            transition: border-color 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            &-sm {
                padding: 0.25rem 0.75rem;
                font-size: 0.875rem;
            }
            &-lg {
                padding: 12px 1rem;
                border-radius: 4px;
                min-width: 200px;
            }
            .placeholder-value {
                flex-shrink: 0;
                text-align: left;
                flex: 1;
                font-size: 12px;
            }
            :deep(svg) {
                font-size: 20px;
                transition: transform 0.2s ease;
            }
            &:hover {
                border-color: var(--ks-border-active);
                background-color: var(--ks-background-input);
                color: var(--ks-content-primary);
            }
            &:focus {
                border-color: var(--ks-border-active);
                box-shadow: 0 0 0 0.25rem rgba(var(--ks-border-active), 0.25);
                background-color: var(--ks-background-input);
                color: var(--ks-content-primary);
            }
            &::after {
                display: none;
            }
        }
        .show :deep(svg) {
            transform: rotate(180deg);
        }
        .dropdown-menu {
            background-color: var(--ks-background-input);
            border-radius: 0.25rem;
            padding: 0;
            .dropdown-item {
                color: var(--ks-content-primary);
                font-size: 12px;
                padding: 0.25rem 0.75rem;
                transition: background-color 0.2s ease;
                &:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: var(--ks-content-primary);
                }
                &.active {
                    background-color: var(--ks-background-button-primary);
                    color: $white;
                }
            }
        }
    }
</style>
