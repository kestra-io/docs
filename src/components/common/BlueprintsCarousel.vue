<template>
    <Carousel>
        <ListCard
            v-for="blueprint in blueprints"
            :key="blueprint.id"
            :blueprint="blueprint"
            :tags="tags"
            :href="`/blueprints/${blueprint.id}`"
        />
    </Carousel>
</template>

<script lang="ts" setup>
    import Carousel from "~/components/common/Carousel.vue"
    import ListCard from "~/components/blueprints/ListCard.vue"
    import { $fetch } from "~/utils/fetch"
    import { API_URL } from "astro:env/client"

    defineProps<{
        blueprints: Blueprint[]
    }>()

    const tags = (await $fetch(`${API_URL}/blueprints/versions/latest/tags`)) as BlueprintTag[]
</script>

<style lang="scss" scoped>
    .carousel-content {
        > a {
            flex: 1;
            min-width: 350px;
        }
    }
</style>