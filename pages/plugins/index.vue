<template>
    <Head>
        <Title>Hundreds of Plugins For All Your Orchestrations Needs</Title>
        <Meta name="description"
              content="Connect Kestra with tools you already know and love"/>
    </Head>
    <PluginsLists
        :plugins="pluginsList"
        :categories="categories ?? []"
        :current-url="route.fullPath + querystring"
        v-model:searchQuery="searchQuery"
        v-model:currentPage="currentPage"
        v-model:itemsPerPage="itemsPerPage"
        v-model:activeCategory="activeCategory"
    />
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
    const route = useRoute()
    const router = useRouter()

    const {data: plugins, error, status} = await useFetch<{title:string}[]>(`${config.public.apiUrl}/plugins/subgroups`);

    const currentPage = ref(1);
    const itemsPerPage = ref(20);
    const activeCategory = ref('All Categories');

    const querystring = computed(() =>  `?${new URLSearchParams(route.query).toString()}`)

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

    function getFilterPluginsQuery(pageVal: number, itemVal: number, categoryVal: string, searchVal: string) {
        return {
            page: pageVal,
            size: itemVal,
            category: categoryVal,
            q: searchVal,
        }
    };

    const augmentedCategories = computed(() => ['All Categories', ...categories.value]);

    onMounted(() => {
        if (route.query.page) currentPage.value = parseInt(route.query.page as string);
        if (route.query.size) itemsPerPage.value = parseInt(route.query.size as string);
        if (route.query.category) {
            activeCategory.value = augmentedCategories.value.find(c => c === route.query.category) ?? "";
        }
    })

    const searchQuery = computed(() => route.query.q?.trim())

    const timer = ref<NodeJS.Timeout>();
    watch([currentPage, itemsPerPage, activeCategory, searchQuery], ([pageVal, itemVal, categoryVal, searchVal]) => {
        if (timer) {
            clearTimeout(timer.value);
        }
        timer.value = setTimeout(async () => {
            router.push({
                query: getFilterPluginsQuery(pageVal, itemVal, categoryVal, searchVal)
            })

        }, 500);
    });
</script>