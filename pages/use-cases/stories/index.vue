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
                darkButtonText="Read the docs"
                purpleButtonText="Get started!"
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
        const {data} = await useAsyncData('stories', () => {
            return $fetch(`${config.public.apiUrl}/customer-stories?page=${currentPage}&size=${itemsPerPage}`)
        })
        stories.value = data.value.results.sort(() => Math.random() - 0.5);
        totalStories.value = data.value.total
    }

    await fetchStories({currentPage: 1, itemsPerPage: 25})
</script>
