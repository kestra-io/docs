<template>
    <div class="main">
        <Head>
            <Title>Kestra's Customers Stories</Title>
            <Meta name="description"
                  content="Learn how we helped companies manage their critical operations." />
        </Head>
        <StoriesList :stories="stories" :total-stories="totalStories" @fetch-page-data="fetchStories" />
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Getting started with Kestra"
                subtitle="Start building with Kestra — Automate Everything Everywhere All at Once."
                darkButtonText="Get started"
                darkButtonHref="/docs/getting-started/quickstart#start-kestra"
                purpleButtonText="Read the docs"
                purpleButtonHref="/docs"
            />
        </NuxtLazyHydrate>
    </div>
</template>
<script setup>
    const route = useRoute()
    const config = useRuntimeConfig();
    const stories = ref([])
    const totalStories = ref(0)

    const fetchStories = async ({currentPage, itemsPerPage}) => {
        const {data} = await useAsyncData('use-cases/stories', () => {
            return $fetch(`${config.public.apiUrl}/customer-stories-v2?page=${currentPage}&size=${itemsPerPage}`)
        })
        stories.value = data.value.results;
        totalStories.value = data.value.total
    }

    await fetchStories({currentPage: 1, itemsPerPage: 25})
</script>
