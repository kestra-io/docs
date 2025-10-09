<template>
  <WhatsNewRender :posts="posts" />
</template>

<script setup lang="ts">
const {public:{CollectionNames}} = useRuntimeConfig()

const {data: posts} = await useAsyncData(
    `Blog-Page-Short-List`,
    () => queryCollection(CollectionNames.blogs).order("date", "DESC").limit(4).all()
);
</script>