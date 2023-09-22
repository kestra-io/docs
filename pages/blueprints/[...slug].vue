<template>
<div>
  <div class="container" v-if="slug === '/blueprints/'">
    <BlueprintsLists :icons="icons" />
  </div>

  <div v-else>
    <BlueprintsHeader :page="page" :slug="slug" :icons="icons" />
    <div class="container">
      <BlueprintsAbout :page="page" />
      <LayoutSection title="More Related Blueprints">
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-4" v-for="blueprint in relatedBlueprints" :key="blueprint.id">
            <BlueprintsBlueprintCard :blueprint="blueprint" :icons="icons" data-aos="zoom-in" />
          </div>
        </div>
      </LayoutSection>
    </div>
  </div>

  <div class="bottom">
    <BlueprintsFooter />
  </div>
</div>
</template>

<script setup>
const route = useRoute()
const slug = ref("/blueprints/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug));
const page = ref()
const icons = ref()
const relatedBlueprints = ref([])

const { data: iconsData } = await useAsyncData('icons', () => {
    return $fetch('https://api.kestra.io/v1/plugins/icons')
})

if(iconsData.value) {
    icons.value = iconsData.value
}

if(slug.value != '/blueprints/') {
  const { data: pageData } = await useAsyncData('blueprintDetail', () => {
    return $fetch(`https://api.kestra.io/v1/blueprints/${route.params.slug.join()}`)
  })

  if(pageData.value) {
    page.value = pageData.value

    const { data } = await useAsyncData('relatedBlueprints', () => {
      return $fetch(`https://api.kestra.io/v1/blueprints?tags=${page.value.tags}&size=3`)
    })

    relatedBlueprints.value = data.value.results
  }

  // const { data: graphData } = await useAsyncData('topologyGraph', () => {
  //   return $fetch(`https://api.kestra.io/v1/blueprints/${route.params.slug.join()}/graph`)
  // })

  // console.log(graphData.value);
}
</script>