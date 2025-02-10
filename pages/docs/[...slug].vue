<template>
    <DocContainer />
</template>

<script setup>
    import DocContainer from "~/components/layout/Container.vue";
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";
    .container {
        overflow: visible;
    }

    :deep(.card) {
        background-color: $black-2;
        border: $block-border;

        .card-title {
            color: $white;
        }
    }
</style>