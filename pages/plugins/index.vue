<template>
    <Head>
        <Title>Hundreds of Plugins For All Your Orchestrations Needs</Title>
        <Meta name="description" content="Connect Kestra with tools you already know and love" />
    </Head>
    <PluginsLists :plugins="pluginsList" :categories="categories ?? []" />
    <pre v-if='status !== "success"'>
        {{ error }}
    </pre>
</template>

<script setup lang="ts">
    import type { Plugin } from "@kestra-io/ui-libs";
    const config = useRuntimeConfig();

    const {data: plugins,error,status} = await useFetch<Plugin[]>(`${config.public.apiUrl}/plugins/subgroups`);

    if (status.value !== "success") {
        console.error("Error in plugins page - blob", error)
    }

    const pluginsList = computed(() => {
        if (status.value !== "success" || !plugins.value) return [];
        return plugins.value;
    });

    const {data: categories} = await useFetch<string[]>(`${config.public.apiUrl}/plugins/categories`);
</script>