<template>
    <div v-bind="$attrs">
        <TwoColumnStickyLayout>
            <template #sidebar>
                <Sidebar :story />
            </template>
            <Main :story :content />
        </TwoColumnStickyLayout>
        <slot name="change" />
        <More :related />
    </div>
</template>

<script setup lang="ts">
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
    :deep(.container) {
        max-width: 1140px;
    }

    :deep(.left) {
        @include media-breakpoint-up(lg) {
            min-width: 260px !important;
            width: 260px !important;
            flex: 0 0 260px !important;
        }
    }
</style>
