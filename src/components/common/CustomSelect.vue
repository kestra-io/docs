<template>
    <div class="select-wrapper">
        <label v-if="label" class="label">{{ label }}</label>
        <div class="dropdown">
            <button
                class="btn btn-sm btn-custom"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <span>{{ selectedLabel }}</span>
                <component :is="ChevronDown" class="icon" />
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

    const props = defineProps<{
        modelValue: string
        options: {
            value: string
            label: string
        }[]
        label?: string
    }>()

    const emit = defineEmits<{
        "update:modelValue": [value: string]
    }>()

    const selectedLabel = computed(() => {
        return props.options.find((o) => o.value === props.modelValue)?.label ?? ""
    })

    const selectOption = (option: { value: string; label: string }) => {
        emit("update:modelValue", option.value)
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

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
            background-color: var(--ks-background-input);
            color: var(--ks-content-primary);
            font-size: 0.875rem;
            font-weight: normal;
            transition: border-color 0.2s ease;
            padding: 0.25rem 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            span {
                flex-shrink: 0;
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