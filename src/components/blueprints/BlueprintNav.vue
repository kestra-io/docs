<template>
    <NavActions
        :items="items"
        :page-size="pageSize"
        :show="items.length > pageSize"
        @page-changed="onPageChanged"
    />
</template>

<script setup lang="ts">
    import NavActions from "~/components/common/NavActions.vue"

    const props = defineProps<{
        items: any[]
        pageSize: number
        id: string
    }>()

    const onPageChanged = (startIndex: number) => {
        if (typeof window === "undefined") return

        window.dispatchEvent(
            new CustomEvent("page-changed", {
                detail: { startIndex, id: props.id },
            }),
        )
    }
</script>
