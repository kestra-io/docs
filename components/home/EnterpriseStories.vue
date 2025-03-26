<template>
    <div class="enterprise-stories">
        <div v-for="story of stories" class="story">
            <h2>{{ story.title }}</h2>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const config = useRuntimeConfig();

    interface Story {
        title: string;
        description: string;
        quote: string;
        quotePerson: string;
        featuredImage: string;
        heroImage: string;
        logo: string;
    }

    const {data} = await useAsyncData<{results: Story[], total: number}>('stories-hp', () => {
        return $fetch(`${config.public.apiUrl}/customer-stories-v2?page=1&size=1`)
    })

    const stories = computed(() => {
        return data.value?.results ?? []
    })
</script>

<style lang="scss" scoped>
    .enterprise-stories {
        background-color: white;
        padding: 100px;
        text-align: center;
        pre{
            text-align: left;
        }
        .story {
            margin-bottom: 50px;
            border: 1px solid red;
        }
    }
</style>