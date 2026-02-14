<template>
    <div ref="root" class="icon-wrapper">
        <button class="btn" @click="copySourceCode">Copy source code</button>
    </div>
</template>
<script setup lang="ts">
    const props = defineProps<{
        code: string
    }>()

    const copySourceCode = () => {
        if (navigator) {
            navigator.clipboard.writeText(props.code)
        }
    }
</script>
<style scoped lang="scss">
    @import "~/assets/styles/variable";

    button {
        background-color: var(--ks-background-button-secondary);
        border: $block-border;
        color: var(--ks-content-primary);
        &:hover {
            color: var(--ks-content-primary-inverse);
            border-color: var(--ks-border-secondary);
            background-color: var(--ks-background-button-secondary-hover);
        }
    }
</style>