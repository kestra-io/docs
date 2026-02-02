<template>
    <div class="container base-container mt-5">
        <h3 data-usal="fade-l" class="title fw-light pb-3" v-html="content.title"></h3>
        <CardGroup :content="content" />
    </div>
</template>

<script setup lang="ts">
    import CardGroup from "~/components/write-for-us/CardGroup.vue"

    const props = defineProps({
        content: {
            type: Object,
            required: true,
            default: () => ({
                title: "",
                items: [],
            }),
        },
    })
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .base-container {
        max-width: $width-800;
    }
</style>