<template>
    <div class="container">
        <div class="tabs">
            <button
                v-for="category in categories"
                :key="category"
                class="tab"
                :class="{ active: modelValue === category }"
                @click="$emit('update:modelValue', category)"
            >
                {{ category }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        modelValue: string
        categories: string[]
    }>()

    defineEmits<{
        (e: 'update:modelValue', value: string): void
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 1.5rem;
    }

    .tabs {
        display: flex;
        padding: 0.25rem;
        gap: 0.25rem;
        flex-wrap: wrap;
    }

    .tab {
        border: none;
        background: transparent;
        padding: 0.5rem 1.25rem;
        border-radius: 8px;
        font-size: $font-size-sm;
        font-weight: 500;
        color: var(--ks-content-secondary);
        white-space: nowrap;
        transition: all 0.2s ease;

        &:hover {
            color: var(--ks-content-primary);
        }

        &.active {
            background: var(--ks-background-body);
            color: var(--ks-content-primary);
            border: $block-border;
            box-shadow: 0 4px 10px #5E6ED429;
        }
    }
</style>
