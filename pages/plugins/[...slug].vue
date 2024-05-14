<template>
    <PluginContainer :prevNext="false" type="plugins" />
</template>

<script setup>
    import PluginContainer from "~/components/layout/Container.vue";
</script>

<style lang="scss" scoped>
    .container {
        overflow: visible;
    }

    :deep(.bd-markdown > h2 > a > span ) {
        display: inline !important;
    }
</style>nav-link dropdown-toggle