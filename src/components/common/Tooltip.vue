<template>
    <span
        ref="trigger"
        v-bind="$attrs"
        :aria-describedby="visible && !interactive ? tooltipId : undefined"
        v-on="handlers"
    >
        <slot name="default" :visible="visible" :panel-id="tooltipId" />
    </span>
    <span
        v-show="visible"
        :id="tooltipId"
        ref="content"
        class="ks-tooltip"
        :class="[{ 'is-interactive': interactive }, contentClass]"
        :role="interactive ? 'note' : 'tooltip'"
    >
        <slot name="content">
            {{ title }}
        </slot>
    </span>
</template>

<script lang="ts" setup>
    import {
        computed,
        nextTick,
        onBeforeUnmount,
        ref,
        useId,
        useTemplateRef,
    } from "vue"
    import { onClickOutside, onKeyStroke } from "@vueuse/core"
    import { createPopper, type Instance, type Placement } from "@popperjs/core"

    const props = withDefaults(
        defineProps<{
            title?: string
            placement?: Placement
            /**
             * `hover` shows on hover and focus (the schema badges): a
             * `role="tooltip"` the trigger is described by. `click` is a
             * disclosure: it toggles on click, closes on outside click or
             * Escape, takes pointer events so it can hold a link, and is a
             * `role="note"` the caller's button controls through the
             * `panelId` slot prop.
             */
            trigger?: "hover" | "click"
            /** Extra class on the tooltip panel, for a caller's own sizing. */
            contentClass?: string
        }>(),
        {
            title: undefined,
            placement: "top",
            trigger: "hover",
            contentClass: undefined,
        },
    )

    const trigger = useTemplateRef<HTMLElement>("trigger")
    const content = useTemplateRef<HTMLElement>("content")
    const visible = ref(false)
    const tooltipId = useId()

    // Built on first show: schema pages render hundreds of these, and an
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
        if (!visible.value) return
        visible.value = false
        popper?.setOptions(options(false))
    }

    const toggle = () => (visible.value ? hide() : show())

    // Not `props.trigger` in the template: the `trigger` template ref above
    // shadows the prop there.
    const interactive = computed(() => props.trigger === "click")

    const handlers = computed(() =>
        props.trigger === "click"
            ? { click: toggle }
            : { mouseenter: show, mouseleave: hide, focusin: show, focusout: hide },
    )

    // Only click mode listens on the document; the schema pages mount
    // hundreds of hover tooltips, and each would otherwise add two listeners.
    if (props.trigger === "click") {
        onClickOutside(content, hide, { ignore: [trigger] })
        onKeyStroke("Escape", hide)
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

        &.is-interactive {
            pointer-events: auto;
        }
    }
</style>
