<template>
    <div v-bind="$attrs">
        <Header
            :slug
            :title="story.title"
            :meta-description="story.description"
            :hero-image="story.heroImage"
            :logo="story.logo"
            :logo-dark="story.logoDark"
            :kpi1="story.kpi1"
            :kpi2="story.kpi2"
            :kpi3="story.kpi3"
        />
        <TwoColumnStickyLayout>
            <template #sidebar>
                <Sidebar :story />
            </template>
            <Main :story :content />
        </TwoColumnStickyLayout>
        <Change />
        <More :related />
    </div>
</template>

<script setup lang="ts">
    import Header from "~/components/stories/Header.vue"
    import More from "~/components/stories/More.vue"
    import Change from "~/components/stories/Change.vue"
    import Sidebar from "~/components/stories/Sidebar.vue"
    import Main from "~/components/stories/Main.vue"
    import TwoColumnStickyLayout from "~/components/layouts/TwoColumnStickyLayout.vue"

    defineProps<{
        slug: string
        story: Story
        content: string
        related: any
    }>()
</script>

<style scoped lang="scss">


    .-row {
        align-items: stretch;
    }
</style>