<template>
    <div class="icon-wrapper" :data-tooltip="generateTagName()">
        <img
            :src="src"
            :alt="generateTagName() + ' icon'"
            width="32"
            height="32"
            loading="lazy"
            decoding="async"
            :style="hidden ? 'visibility: hidden' : undefined"
            @error="hidden = true"
        />
    </div>
</template>

<script lang="ts" setup>
    import { computed, onMounted, onUnmounted, ref, watch } from "vue"

    const props = defineProps({
        cls: { type: String, default: "" }
    })

    const isDark = ref(false)
    const hidden = ref(false)
    let observer: MutationObserver | undefined

    onMounted(() => {
        const update = () => {
            isDark.value = document.documentElement.classList.contains("dark")
        }
        update()
        observer = new MutationObserver(update)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    })

    onUnmounted(() => observer?.disconnect())

    const src = computed(
        () => `/icons/${props.cls}${isDark.value ? "-white" : "-black"}.svg`
    )

    watch(src, () => {
        hidden.value = false
    })

    const generateTagName = () => props.cls.split(".").pop()
</script>

<style lang="scss" scoped>


    .icon-wrapper {
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;
        aspect-ratio: 1 / 1;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            aspect-ratio: 1 / 1;
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
