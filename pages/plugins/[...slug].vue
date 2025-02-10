<template>
    <PluginContainer />
</template>

<script setup>
  import PluginContainer from "~/components/layout/PluginContainer.vue";
</script>

<style lang="scss" scoped>
    .container {
        overflow: visible;
    }

    :deep(.bd-markdown > h2 > a > span ) {
        display: inline !important;
    }
</style>