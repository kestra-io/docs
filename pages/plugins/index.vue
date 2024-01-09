<template>
    <div class="container bd-gutter">
        <PluginsLists :plugins="plugins" :categories="categories" />
    </div>
</template>

<script setup>
    const config = useRuntimeConfig();

    const {data: plugins} = await useFetch(`${config.public.apiUrl}/plugins`);

    const {data: categories} = await useFetch(`${config.public.apiUrl}/plugins/categories`);
</script>