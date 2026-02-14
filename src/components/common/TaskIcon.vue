<template>
    <div ref="root" class="icon-wrapper" data-bs-toggle="tooltip" data-bs-placement="top" :title="generateTagName()">
        <div class="icon" :style="styles" />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue"

    const props = defineProps({
        cls: { type: String, default: "" }
    })

    const styles = computed(() => ({
        background: `url("/icons/${props.cls}.svg")`
    }))

    const generateTagName = () => props.cls.split(".").pop()
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