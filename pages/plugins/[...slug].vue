<template>
    <DocContainer type="plugins" :slug="slug" />
</template>

<script setup>
    import DocContainer from "~/components/docs/Container.vue";

    const route = useRoute()
    const slug = "/plugins/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
</script>


