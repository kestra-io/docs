<template>
    <span
        ref="trigger"
        v-bind="$attrs"
        :aria-describedby="visible ? tooltipId : undefined"
        @mouseenter="show"
        @mouseleave="hide"
        @focusin="show"
        @focusout="hide"
    >
        <slot name="default" />
    </span>
    <span
        v-show="visible"
        :id="tooltipId"
        ref="content"
        class="ks-tooltip"
        role="tooltip"
    >
        <slot name="content">
            {{ title }}
        </slot>
    </span>
</template>

<script lang="ts" setup>
    import { nextTick, onBeforeUnmount, ref, useId, useTemplateRef } from "vue"
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
    const tooltipId = useId()

    // Built on first hover: schema pages render hundreds of these, and an
    // unopened tooltip should cost nothing.
    let popper: Instance | undefined

    // `eventListeners` is on by default and attaches scroll/resize handlers to
    // every scroll parent, so a popper kept alive between hovers keeps paying
    // for them. Both modifiers are restated on each call because `setOptions`
    // replaces the array rather than merging into it.
    const options = (listeners: boolean) => ({
        placement: props.placement,
        modifiers: [
            { name: "offset", options: { offset: [0, 6] } },
            { name: "eventListeners", enabled: listeners },
        ],
    })

    const show = async () => {
        visible.value = true
        await nextTick()
        if (!trigger.value || !content.value) return
        popper ??= createPopper(trigger.value, content.value, options(true))
        popper.setOptions(options(true))
        popper.update()
    }

    const hide = () => {
        visible.value = false
        popper?.setOptions(options(false))
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
