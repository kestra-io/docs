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
        <LayoutFooterContact
            title="New to Kestra?"
            subtitle="Use blueprints to kickstart your first workflows."
            purpleButtonText="Get started with Kestra"
            purpleButtonHref="/docs/getting-started/quickstart#start-kestra"
        />
    </div>
</template>

<script setup>
    const config = useRuntimeConfig();
    const {data: tags} = await useAsyncData('blueprints-tags', () => {
        return $fetch(`${config.public.apiUrl}/blueprints/versions/latest/tags`)
    })
</script>