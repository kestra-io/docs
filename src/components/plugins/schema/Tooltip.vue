<template>
    <span ref="$tooltip" v-bind="$attrs">
        <slot name="default" />
    </span>
    <span class="d-none" ref="$tooltipContent">
        <slot name="content">
            {{ title }}
        </slot>
    </span>
</template>

<script lang="ts" setup>
    import {onBeforeUnmount, onMounted, ref, nextTick} from "vue";
    import type * as Bootstrap from "bootstrap"

    // conditional import is required for website not to crash due to
    // bootstrap launching some init upon import that is incompatible with SSR
    let bootstrap: Promise<typeof Bootstrap>;
    if (typeof document !== "undefined") {
        bootstrap = import("bootstrap");
    }

    const props = withDefaults(defineProps<{
        title?: string;
        placement?: "top" | "right" | "bottom" | "left"
    }>(), {
        title: undefined,
        placement: "top"
    })

    const tooltip = ref()
    const $tooltip = ref()
    const $tooltipContent = ref()

    onMounted(async () => {
        nextTick(async () => {
            const Bootstrap = await bootstrap
            if (typeof document !== "undefined" && $tooltip.value && $tooltipContent.value) {
                tooltip.value = new Bootstrap.Tooltip($tooltip.value, {
                    trigger: "hover",
                    html: true,
                    placement: props.placement,
                    title: $tooltipContent.value.innerHTML,
                    customClass: "tooltip-custom"
                })
            }
        })
    })

    onBeforeUnmount(async () => {
        tooltip.value?.dispose();
    })
</script>

<style lang="scss">
    .tooltip-custom {
        .tooltip-inner {
            max-width: none;
        }
    }
</style>
