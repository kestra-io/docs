<template>
    <Head>
        <Title>Hundreds of Plugins For All Your Orchestrations Needs</Title>
        <Meta name="description"
              content="Connect Kestra with tools you already know and love"/>
    </Head>
    <PluginsLists :plugins="pluginsList" :categories="categories ?? []" />
    <LayoutFooterContact
        title="Didn’t find the plugin you were looking for?"
        darkButtonText="Ask on slack"
        darkButtonHref="https://kestra.io/slack"
        purpleButtonText="Create one"
        purpleButtonHref="/docs/plugin-developer-guide"
    />
    <pre v-if="status !== 'success'">
        {{ error }}
    </pre>
</template>

<script setup lang="ts">
    const config = useRuntimeConfig();

    const {data: plugins, error, status} = await useFetch<{title:string}[]>(`${config.public.apiUrl}/plugins/subgroups?includeDeprecated=false`);

    if(status.value !== 'success'){
        console.error("Error in plugins page - blob", error)
    }

    const pluginsList = computed(() => {
        return status.value !== 'success' || !plugins.value ? [] : plugins.value
            .sort((a, b) => {
                const nameA = a.title.toLowerCase(),
                    nameB = b.title.toLowerCase();

                if (nameA === "core") {
                    return -1;
                }
                if (nameB === "core") {
                    return 1;
                }

                return nameA === nameB ? 0 : nameA < nameB ? -1 : 1;
            });
    })

    const {data: categories} = await useFetch(`${config.public.apiUrl}/plugins/categories`);
</script>