<template>
    <span ref="root" class="info-tip">
        <button
            type="button"
            class="info-button"
            :aria-expanded="open"
            :aria-controls="id"
            :aria-label="`More about ${label}`"
            @click="toggle"
        >
            <InformationOutline :size="16" />
        </button>
        <span
            v-show="open"
            :id="id"
            ref="panel"
            class="info-panel"
            role="note"
            :style="{ left: `calc(-0.5rem + ${shift}px)` }"
        >
            <slot />
        </span>
    </span>
</template>

<script setup lang="ts">
    import { onClickOutside, onKeyStroke } from "@vueuse/core"
    import { nextTick, ref, useTemplateRef } from "vue"
    import InformationOutline from "vue-material-design-icons/InformationOutline.vue"

    defineProps<{ id: string; label: string }>()

    const GUTTER = 16

    const open = ref(false)
    const shift = ref(0)
    const root = useTemplateRef<HTMLElement>("root")
    const panel = useTemplateRef<HTMLElement>("panel")

    async function toggle() {
        if (open.value) {
            open.value = false
            return
        }
        const viewport = document.documentElement.clientWidth
        const left = root.value?.getBoundingClientRect().left ?? 0
        shift.value = 0
        open.value = true
        await nextTick()
        const width = panel.value?.offsetWidth ?? 0
        const start = left + (panel.value?.offsetLeft ?? 0)
        const overflow = start + width - (viewport - GUTTER)
        if (overflow > 0) shift.value = -overflow
        if (start + shift.value < GUTTER) shift.value = GUTTER - start
    }
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .info-tip {
        position: relative;
        display: inline-flex;
        vertical-align: middle;
    }

    .info-button {
        display: inline-flex;
        padding: 0;
        border: 0;
        background: none;
        color: var(--ks-content-tertiary);
        line-height: 1;
        @include guide-focus-ring;

        &:hover,
        &[aria-expanded="true"] {
            color: var(--ks-content-link);
        }
    }

    .info-panel {
        position: absolute;
        z-index: 5;
        top: calc(100% + 0.4rem);
        width: max-content;
        max-width: min(18rem, calc(100vw - 2rem));
        padding: 0.6rem 0.75rem;
        border: 1px solid var(--ks-border-primary);
        border-radius: $border-radius;
        background: var(--ks-background-body);
        box-shadow: $calc-shadow-elevated;
        @include calc-hint;
        font-weight: 400;
        line-height: 1.45;
    }
</style>
