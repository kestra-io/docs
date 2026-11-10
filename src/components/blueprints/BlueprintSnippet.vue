<template>
    <!-- SnippetsSSR parses the flow YAML in its (async) setup so the snippet
         is server-rendered instead of appearing after hydration; the async
         component needs this Suspense boundary as its direct parent. -->
    <Suspense>
        <SnippetsSSR :code="flow" lang="yaml" :expand-threshold="25" />
    </Suspense>
</template>

<script setup lang="ts">
    import SnippetsSSR from "~/components/common/SnippetsSSR.vue"

    defineProps<{
        flow: string
    }>()
</script>
