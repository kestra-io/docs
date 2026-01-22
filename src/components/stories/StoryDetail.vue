<template>
    <div v-bind="$attrs">
        <Header
            :slug="slug"
            :title="story.title"
            :meta-description="story.description"
            :hero-image="story.heroImage"
            :logo="story.logoDark"
            :kpi1="story.kpi1"
            :kpi2="story.kpi2"
            :kpi3="story.kpi3"
        />
        <Content :story :content />
        <Change />
        <More :related />
    </div>
</template>

<script setup lang="ts">
    import Header from "./Header.vue"
    import Content from "./Content.vue"
    import More from "./More.vue"
    import Change from "./Change.vue"

    defineProps<{
        slug: string
        story: Story
        content: string
        related: any
    }>()
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .-row {
        align-items: stretch;
    }
</style>