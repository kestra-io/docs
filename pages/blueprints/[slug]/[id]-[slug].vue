<template>
    <div>
        <Head>
            <Title>{{ page.title }}</Title>
            <Meta
                name="description"
                :content="description.value"
            />
        </Head>

        <BlueprintsHeader :page="page" :graph="graph" :slug="slug" :icons="icons" :flow="flowAsMd"/>
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
                purpleButtonHref="/docs/getting-started"
            />
        </div>
    </div>
</template>

<script setup>
    const route = useRoute()
    const config = useRuntimeConfig();
    const slug = ref("/blueprints/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug));
    const page = ref()
    const icons = ref()
    const relatedBlueprints = ref([])
    const graph = ref({})
    const descriptionAsMd = ref("")
    const description = ref()
    const flowAsMd = ref("")

    const categorySlug = route.fullPath?.split('/')[2];
    const {data: tags} = await useAsyncData('blueprints-tags', () => {
        return $fetch(`${config.public.apiUrl}/blueprints/tags`)
    })

    const activeTag = tags.value.find(f => f?.name?.toLowerCase() == categorySlug.replace('-', ' '));

    const {data: blueprintInformations, error} = await useAsyncData('blueprints-informations', () => {
        return $fetch(`/api/blueprint?query=${route.params.id}`)
    })

    if ((error && error.value) || (!activeTag && categorySlug !== 'all-tags')) {
      throw createError({statusCode: 404, message: 'Page not found', data: error, fatal: true})
    }

    page.value = blueprintInformations.value.page
    relatedBlueprints.value = blueprintInformations.value.relatedBlueprints
    graph.value = blueprintInformations.value.graph
    descriptionAsMd.value = blueprintInformations.value.descriptionAsMd
    flowAsMd.value = blueprintInformations.value.flowAsMd
    description.value = blueprintInformations.value.metaDescription || descriptionAsMd?.value?.data?.description;

    useHead({
        meta: [
            {name: 'twitter:card', content: 'summary_large_image'},
            {name: 'twitter:site', content: '@kestra_io'},
            {name: 'twitter:title', content: page.value.title},
            {
                name: 'twitter:description',
                content: description.value
            },
        ]
    })
</script>