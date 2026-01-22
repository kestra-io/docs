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
        background-color: transparent;
        border: 1px solid #3d3d3f;
        color: $white;

        &:hover {
            background-color: #3d3d3f;
            color: $white;
        }
    }
</style>