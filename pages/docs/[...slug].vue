<template>
    <DocContainer type="docs" :slug="slug" />
</template>

<script setup>
    import DocContainer from "~/components/layout/Container.vue";

    const route = useRoute()
    const slug = "/docs/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
</script>

<style lang="scss" scoped>
    .container {
        overflow: visible;
    }
</style>