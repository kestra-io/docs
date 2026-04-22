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
        <div class="column-sticky">
            <TwoColumnStickyLayout>
                <template #sidebar>
                    <Sidebar :story />
                </template>
                <Main :story :content />
            </TwoColumnStickyLayout>
        </div>
        <slot name="change" />
        <More :related />
    </div>
</template>

<script setup lang="ts">
    import Header from "~/components/stories/Header.vue"
    import More from "~/components/stories/More.vue"
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

    .column-sticky {
        :deep(.container) {
            max-width: 1140px;
            gap: 4rem;
        }

        :deep(.left) {
            min-width: 0 !important;
            @include media-breakpoint-up(lg) {
                max-width: 209px;
            }
        }
    }
</style>