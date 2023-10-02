<template>
    <div>
        <div class="container" v-if="slug === '/blueprints/'">
            <BlueprintsLists :icons="icons" :tags="tags"/>
            <BlueprintsNewToKestra/>
        </div>

        <div v-else>
            <BlueprintsHeader :page="page" :graph="graph" :slug="slug" :icons="icons" :flow="flowAsMd"/>
            <div class="container">
                <BlueprintsAbout :page="page" :description="descriptionAsMd"/>
                <BlueprintsNewToKestra/>
                <BlueprintsRelatedBlueprints
                    v-if="relatedBlueprints.length > 0"
                    :related-blueprints="relatedBlueprints"
                    :icons="icons"
                    :tags="tags"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
    const route = useRoute()
    const slug = ref("/blueprints/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug));
    const page = ref()
    const icons = ref()
    const tags = ref([])
    const relatedBlueprints = ref([])
    const graph = ref({})
    const descriptionAsMd = ref("")
    const flowAsMd = ref("")

    const {data: iconsData} = await useAsyncData('plugins-icons', () => {
        return $fetch('https://api.kestra.io/v1/plugins/icons')
    })

    const {data: tagsData} = await useAsyncData('blueprints-tags', () => {
        return $fetch('https://api.kestra.io/v1/blueprints/tags')
    })

    if (iconsData.value) {
        icons.value = iconsData.value
    }

    if (tagsData.value) {
        tags.value = tagsData.value
    }

    if (slug.value !== '/blueprints/') {
        const {data: blueprintInformations} = await useAsyncData('blueprints-informations', () => {
            return $fetch(`/api/blueprint?query=${route.params.slug.join()}`)
        })
        page.value = blueprintInformations.value.page
        relatedBlueprints.value = blueprintInformations.value.relatedBlueprints
        graph.value = blueprintInformations.value.graph
        descriptionAsMd.value = blueprintInformations.value.descriptionAsMd
        flowAsMd.value = blueprintInformations.value.flowAsMd
    }
</script>