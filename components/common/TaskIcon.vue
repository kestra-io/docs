<template>
    <div ref="root" class="icon-wrapper" data-bs-toggle="tooltip" data-bs-placement="top" :title="cls">
        <div class="icon" :style="styles" />
    </div>
</template>

<script setup>
    const {$bootstrap} = useNuxtApp()

    const props = defineProps({
        cls: {
            type: String,
            default: undefined
        },
    });


    const styles = computed(() => {
        return {
            background: `url("/icons/${props.cls}.svg")`
        }
    })

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
</script>

<style lang="scss" scoped>
    .icon-wrapper {
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;

        .icon {
            width: 100%;
            height: 100%;
            display: block;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center center !important;
        }
    }
</style>