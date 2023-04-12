<template>
    <DocContainer type="docs" :slug="slug" />
</template>

<script setup>
    import DocContainer from "~/components/docs/Container.vue";

    const route = useRoute()
    const slug = "/docs/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
</script>

