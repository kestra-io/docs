<template>
    <div class="container">
        <Head>
            <Title>Kestra Blueprints Library</Title>
            <Meta
                name="description"
                content="Get started with our library of workflows ready to use"
            />
        </Head>

        <BlueprintsLists :tags="tags"/>
        <BlueprintsNewToKestra />
    </div>
</template>

<script setup>
    const config = useRuntimeConfig();
    const {data: tags} = await useAsyncData('blueprints-tags', () => {
        return $fetch(`${config.public.apiUrl}/blueprints/tags`)
    })
</script>