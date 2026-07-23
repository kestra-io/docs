<template>
    <!-- BlueprintMarkdownBody parses the description markdown in its (async)
         setup so the content is server-rendered instead of appearing after
         hydration; the async component needs this Suspense boundary as its
         direct parent. -->
    <Suspense>
        <BlueprintMarkdownBody
            :page="page"
            :description="description"
            :orchestration-links="orchestrationLinks"
        />
    </Suspense>
</template>

<script setup lang="ts">
    import BlueprintMarkdownBody from "~/components/blueprints/BlueprintMarkdownBody.vue"

    defineProps<{
        page: { title: string; includedTasks?: string[] }
        description: string
        orchestrationLinks?: { slug: string; name: string }[]
    }>()
</script>
