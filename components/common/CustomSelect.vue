<template>
    <div class="select-wrapper" ref="wrapper">
        <label v-if="label" class="label">{{ label }}</label>
        <div class="select" @click="toggleDropdown" :class="{ open: isOpen }">
            <span>{{ selectedLabel }}</span>
            <component :is="isOpen ? ChevronUp : ChevronDown" class="arrow" />
        </div>
        <transition name="dropdown">
            <ul v-if="isOpen" class="dropdown" @click.stop>
                <li
                    v-for="option in options"
                    :key="option.value"
                    class="item"
                    @click="selectOption(option)"
                    :class="{ selected: option.value === modelValue }"
                >
                    {{ option.label }}
                </li>
            </ul>
        </transition>
    </div>
</template>

<script setup lang="ts">
    import { onClickOutside } from "@vueuse/core";
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue";

    const props = defineProps<{
        modelValue: string;
        options: { value: string; label: string }[];
        label?: string;
    }>();

    const emit = defineEmits<{
        "update:modelValue": [value: string]
    }>();

    const isOpen = ref(false);
    const wrapper = ref<HTMLElement | null>(null);

    const selectedLabel = computed(() => {
        return props.options.find((o) => o.value === props.modelValue)?.label ?? "";
    });

    const toggleDropdown = (): void => {
        isOpen.value = !isOpen.value;
    };

    const selectOption = (option: { value: string; label: string }): void => {
        emit("update:modelValue", option.value);
        isOpen.value = false;
    };

    onClickOutside(wrapper, () => {
        isOpen.value = false;
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    
    .select-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    
        .label {
            color: $white-3;
            font-size: 0.875rem;
            margin-right: 0.5rem;
        }
    
        .select {
            border-radius: 0.25rem;
            border: 1px solid var(--ks-border-primary);
            background-color: var(--ks-background-input);
            padding: 0.25rem 0.75rem;
            color: $white;
            font-size: 0.875rem;
            line-height: 1.375rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 100px;
            width: max-content;
            transition: border-color 0.2s ease;
        
            &:hover,
            &.open {
                border-color: $primary;
            }
        
            .arrow {
                margin-left: 0.5rem;
                color: $white;
                font-size: 1.25rem;
            }
        
            :deep(svg) {
                position: absolute;
                bottom: 0;
            }
        }
    
        .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--ks-background-input);
            border: 1px solid var(--ks-border-primary);
            border-radius: 0.25rem;
            margin-top: 0.125rem;
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
            padding: 0;
            margin: 0.125rem 0 0 0;
            list-style: none;
        
            .item {
                padding: 0.25rem 0.75rem;
                color: $white;
                cursor: pointer;
                transition: background-color 0.2s ease;
                font-size: 0.875rem;
            
                &:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
            
                &.selected {
                    background-color: $primary-1;
                }
            }
        }
    }
    
    .dropdown-enter-active,
    .dropdown-leave-active {
        transition: all 0.3s ease;
    }
    
    .dropdown-enter-from,
    .dropdown-leave-to {
        opacity: 0;
        transform: translateY(-0.625rem);
    }
</style>