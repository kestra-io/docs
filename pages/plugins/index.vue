<template>
    <Head>
        <Title>Hundreds of Plugins For All Your Orchestrations Needs</Title>
        <Meta name="description"
              content="Connect Kestra with tools you arlready know and love"/>
    </Head>
    <PluginsLists :plugins="plugins" :categories="categories" />
    <PluginsFooter />
</template>

<script setup>
    const config = useRuntimeConfig();

    const {data: plugins} = await useFetch(`${config.public.apiUrl}/plugins`);

    const {data: categories} = await useFetch(`${config.public.apiUrl}/plugins/categories`);
</script>