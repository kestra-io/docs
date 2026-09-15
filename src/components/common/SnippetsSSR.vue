<template>
    <Snippets
        :code="code"
        :lang="lang"
        :expand-threshold="expandThreshold"
        :html="htmlContent"
    />
</template>

<script lang="ts">
    import { warmHighlighter } from "~/markdown/marked-shiki"

    // Module scope, not setup: starts the Shiki fetch when this island's
    // chunk is evaluated, so its round trips overlap hydration.
    warmHighlighter()
</script>

<script setup lang="ts">
    import { ref } from "vue"
    import Snippets from "~/components/common/Snippets.vue"
    import { getMarked } from "~/markdown/marked-shiki"

    const props = withDefaults(
        defineProps<{
            code: string
            lang?: string
            expandThreshold?: number
        }>(),
        {
            lang: "bash",
            expandThreshold: 12,
        },
    )

    const htmlContent = ref("")

    // Parse before the first render — on the server and again before the
    // hydration render — so the snippet is part of the server HTML instead of
    // appearing only after client-side hydration. The top-level await makes
    // this an async component: it must be rendered under a <Suspense>
    // boundary (BlueprintSnippet.vue provides one).
    if (props.code) {
        htmlContent.value = await getMarked().parse(
            `\`\`\`${props.lang}\n${props.code}\n\`\`\``,
        )
    }
</script>
