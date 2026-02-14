<template>
    <TwoColumnStickyLayout>
        <template #sidebar>
            <Sidebar :story="story" :content="content" />
        </template>
        <Renderer :story="story" :content="content" />
    </TwoColumnStickyLayout>
</template>

<script setup lang="ts">
    import Sidebar from "./Sidebar.vue"
    import Renderer from "./Renderer.vue"
    import TwoColumnStickyLayout from "~/components/common/TwoColumnStickyLayout.vue"

    const props = defineProps<{
        story: Story
        content: any
    }>()
</script>