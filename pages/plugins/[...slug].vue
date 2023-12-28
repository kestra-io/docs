<template>
    <PluginContainer :slug="slug" />
</template>

<script setup>
    import PluginContainer from "~/components/plugins/Container.vue";

    const route = useRoute()
    const slug = "/plugins/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
</script>

<style lang="scss" scoped>
    .container {
        overflow: visible;
    }
</style>