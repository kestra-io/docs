<template>
    <div
        :key="content"
        class="mdc-renderer"
        v-html="htmlContent"
        @click="handleCopyClick"
    />
</template>

<script lang="ts" setup>
    import { ref, watch } from "vue"
    import { getMarked } from "~/markdown/marked-shiki"
    import { handleCopyClick, injectCopyButtons } from "~/utils/code-copy"

    const props = defineProps<{
        content: string
        copyable?: boolean
    }>()

    const htmlContent = ref<string>("")

    async function parseContent() {
        if (!props.content) {
            htmlContent.value = ""
            return
        }
        const html = await getMarked().parse(props.content)
        htmlContent.value = props.copyable ? injectCopyButtons(html) : html
    }

    watch(
        () => props.content,
        async () => {
            await parseContent()
        },
    )

    // Unlike MDCParserAndRenderer.vue — which parses in onMounted and shows a
    // skeleton until the client catches up — parse before the first render, on
    // the server as well as during hydration. The markdown is then part of the
    // server HTML and the hydrated vdom matches it, so the content neither
    // pops in late nor collapses to a skeleton (the main CLS source on plugin
    // pages). Top-level await makes this an async component: it must be
    // rendered under a <Suspense> boundary.
    await parseContent()
</script>

<style scoped lang="scss">
    @use "/src/assets/styles/mdc-renderer" as mdc;

    .mdc-renderer {
        @include mdc.mdc-renderer;
    }
</style>

<!-- Shiki dual-theme: token colors apply inline (light); switch to the dark
     theme via the per-token `--shiki-dark` CSS variable when `.dark` is set on
     <html>. Not scoped so it reaches the v-html output; namespaced under
     .mdc-renderer to avoid leaks. -->
<style lang="scss">
    html.dark .mdc-renderer pre code span {
        color: var(--shiki-dark) !important;
    }
</style>
