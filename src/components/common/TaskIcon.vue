<template>
    <div class="icon-wrapper" :data-tooltip="generateTagName()">
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
    @import "~/assets/styles/variable";

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

        &[data-tooltip]:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%);
            background: var(--ks-background-body);
            border: 1px solid var(--ks-border-secondary);
            border-radius: 8px;
            color: var(--ks-content-primary);
            font-size: $font-size-xs;
            padding: 0.25rem 0.5rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
        }
    }
</style>