<template>
    <Head>
        <Title>Hundreds of Plugins For All Your Orchestrations Needs</Title>
        <Meta name="description"
              content="Connect Kestra with tools you already know and love"/>
    </Head>
    <PluginsLists :plugins="pluginsList" :categories="categories" />
    <LayoutFooterContact
        title="Didn’t find the plugin you were looking for?"
        darkButtonText="Ask on slack"
        darkButtonHref="https://kestra.io/slack"
        purpleButtonText="Create one"
        purpleButtonHref="/docs/plugin-developer-guide"
    />
    <pre v-if="error">
        {{ error }}
    </pre>
</template>

<script setup lang="ts">
    const config = useRuntimeConfig();

    const {data: plugins, error} = await useFetch<{title:string}[]>(`${config.public.apiUrl}/plugins/subgroups?includeDeprecated=false`, {
        onResponse({response}) {
            if (response.status !== 200) {
                console.error("Error in plugins page - response", response);
                return Promise.reject(new Error('Failed to load plugins'));
            }else {
                console.log("Plugins page - response", response);
                return response;
            }
        },
    });

    if(error){
        console.error("Error in plugins page - blob", error)
    }

    const pluginsList = computed(() => {
        return error || !plugins.value ? [] : plugins.value
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