<template>
    <rapi-doc
        :spec-url="specUrl"
        :color-scheme="colorScheme"
        render-style="view"
        show-header="false"
        show-info="false"
        allow-authentication="false"
        allow-server-selection="false"
        allow-try="false"
    />
</template>

<script setup>
    import "rapidoc"
    import { computed, onMounted, onUnmounted, ref } from "vue"

    defineProps({
        specUrl: { type: String, default: "/kestra-ee.yml" },
    })

    // RapiDoc 11 takes its light/dark surface from `color-scheme`; follow the site theme.
    const isDark = ref(true)
    const colorScheme = computed(() => (isDark.value ? "dark" : "light"))
    let observer

    onMounted(() => {
        const update = () => {
            isDark.value = document.documentElement.classList.contains("dark")
        }
        update()
        observer = new MutationObserver(update)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        })
    })

    onUnmounted(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
    rapi-doc {
        background: transparent;
        width: 100%;
        --textarea-height: auto;
        --textarea-min-height: 100px;
        --code-block-max-height: 600px;
        --background: transparent;
        --foreground: var(--ks-content-primary);
        --border: var(--ks-border-primary);
        --font-sans: var(--font-family-mono-sans);
        --font-mono: var(--font-family-jetbrains-mono);
        &::part(section-endpoint) {
            white-space: nowrap;
        }
    }
</style>
