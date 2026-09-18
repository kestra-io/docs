<template>
    <span
        ref="trigger"
        v-bind="$attrs"
        @mouseenter="show"
        @mouseleave="hide"
        @focusin="show"
        @focusout="hide"
    >
        <slot name="default" />
    </span>
    <span v-show="visible" ref="content" class="ks-tooltip" role="tooltip">
        <slot name="content">
            {{ title }}
        </slot>
    </span>
</template>

<script lang="ts" setup>
    import { nextTick, onBeforeUnmount, ref, useTemplateRef } from "vue"
    import { createPopper, type Instance } from "@popperjs/core"

    const props = withDefaults(
        defineProps<{
            title?: string
            placement?: "top" | "right" | "bottom" | "left"
        }>(),
        {
            title: undefined,
            placement: "top",
        },
    )

    const trigger = useTemplateRef<HTMLElement>("trigger")
    const content = useTemplateRef<HTMLElement>("content")
    const visible = ref(false)

    // Built on first hover: schema pages render hundreds of these, and an
    // unopened tooltip should cost nothing.
    let popper: Instance | undefined

    const show = async () => {
        visible.value = true
        await nextTick()
        if (!trigger.value || !content.value) return
        popper ??= createPopper(trigger.value, content.value, {
            placement: props.placement,
            modifiers: [{ name: "offset", options: { offset: [0, 6] } }],
        })
        popper.update()
    }

    const hide = () => {
        visible.value = false
    }

    onBeforeUnmount(() => popper?.destroy())
</script>

<style lang="scss">
    .ks-tooltip {
        z-index: 1080;
        max-width: none;
        padding: 0.25rem 0.5rem;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 8px;
        background: var(--ks-background-body);
        color: var(--ks-content-primary);
        font-size: $font-size-xs;
        text-align: left;
        word-wrap: break-word;
        pointer-events: none;
    }
</style>
