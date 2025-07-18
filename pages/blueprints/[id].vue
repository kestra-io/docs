<template>
    <div>
        <Head>
            <Title>{{ page.title }}</Title>
            <Meta
                name="description"
                :content="description.value"
            />
        </Head>

        <BlueprintsHeader :page="page" :graph="graph" :slug="$route.params.id" :icons="icons" :flow="flowAsMd"/>
        <div class="container">
            <BlueprintsDetail :page="page" :description="descriptionAsMd" :flow="flowAsMd" :tags="tags" />
            <BlueprintsRelated
                v-if="relatedBlueprints.length > 0"
                :related-blueprints="relatedBlueprints"
                :icons="icons"
                :tags="tags"
            />
            <LayoutFooterContact
                title="New to Kestra?"
                subtitle="Use blueprints to kickstart your first workflows."
                purpleButtonText="Get started with Kestra"
                purpleButtonHref="/docs/getting-started/quickstart#start-kestra"
            />
        </div>
    </div>
</template>

<script setup>
    const route = useRoute()
    const config = useRuntimeConfig();
    const page = ref()
    const icons = ref()
    const relatedBlueprints = ref([])
    const graph = ref({})
    const descriptionAsMd = ref("")
    const description = ref()
    const flowAsMd = ref("")

    const {data: tags} = await useFetch(`${config.public.apiUrl}/blueprints/versions/latest/tags`);

    const {data: blueprintInformations, error} = await useFetch(`/api/blueprint?query=${route.params.id}`);

    if (error && error.value) {
      throw createError({statusCode: 404, message: 'Page not found', data: error, fatal: true})
    }

    page.value = blueprintInformations.value.page
    relatedBlueprints.value = blueprintInformations.value.relatedBlueprints
    graph.value = blueprintInformations.value.graph
    descriptionAsMd.value = blueprintInformations.value.descriptionAsMd
    flowAsMd.value = blueprintInformations.value.flowAsMd
    description.value = blueprintInformations.value.metaDescription || descriptionAsMd?.value?.data?.description;
    const { origin } = useRequestURL()

    useHead({
        meta: [
            {name: 'twitter:card', content: 'summary_large_image'},
            {name: 'twitter:site', content: '@kestra_io'},
            {name: 'twitter:title', content: page.value.title},
            {
                name: 'twitter:description',
                content: description.value
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: page.value.title },
            { property: 'og:title', content: page.value.title },
            { property: 'og:description', content: description.value },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: page.value.title },
        ]
    })
</script>