<template>
    <div
        ref="root"
        class="icon-wrapper"
        data-bs-toggle="tooltip"
        data-bs-trigger="click"
        data-bs-placement="top"
        title="Copied!"
    >
        <button class="btn" @click="copySourceCode">Copy source code</button>
    </div>
</template>
<script setup>
    const {$bootstrap} = useNuxtApp()

    const props = defineProps({
        code: {
            type: String,
            default: undefined
        },
    });

    const root = ref(null)

    onMounted(() => {
        if (process.client) {
            new $bootstrap.Tooltip(root.value);
        }
    });

    onBeforeUnmount(() => {
        if (process.client) {
            const tooltip = $bootstrap.Tooltip.getInstance(root.value);
            if (tooltip) {
                tooltip.dispose();
            }
        }
    });

    const copySourceCode = () => {
        if(process.client && navigator) {
            navigator.clipboard.writeText(props.code);

            window.setTimeout(() => {
                const tooltip = $bootstrap.Tooltip.getInstance(root.value);
                if (tooltip) {
                    tooltip.hide();
                }
            }, 1000);
        }
    };
</script>
<style scoped lang="scss">
    @import "../../assets/styles/variable";

    button {
        background-color: transparent;
        border: 1px solid #3D3D3F;
        color: $white;

        &:hover {
            background-color: #3D3D3F;
            color: $white;
        }
    }
</style>
