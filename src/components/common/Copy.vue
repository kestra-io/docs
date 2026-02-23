<template>
    <div ref="root" class="icon-wrapper">
        <button class="btn btn-secondary" @click="copySourceCode">Copy source code</button>
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