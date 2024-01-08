<template>
    <div class="main">
        <Head>
            <Title>Kestra's Customers Stories</Title>
            <Meta name="description"
                  content="Learn how we helped companies manage their critical operations." />
        </Head>
        <StoriesList :stories="stories" :total-stories="totalStories" @fetch-page-data="fetchStories" />

        <StoriesFooter />
    </div>
</template>
<script setup>
    const route = useRoute()
    const stories = ref([])
    const totalStories = ref(0)

    const fetchStories = async ({currentPage, itemsPerPage}) => {
        const {data} = await useAsyncData('stories', () => {
            return $fetch(`https://api.kestra.io/v1/customer-stories?page=${currentPage}&size=${itemsPerPage}`)
        })
        stories.value = data.value.results
        totalStories.value = data.value.total
    }

    await fetchStories({currentPage: 1, itemsPerPage: 25})
</script>
