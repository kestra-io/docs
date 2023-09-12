<template>
  <div class="container">
    <BlueprintsLists v-if="slug === '/blueprints/'" />

    <div v-else></div>

    <div class="bottom">
      <BlueprintsFooter />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = "/blueprints/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
</script>