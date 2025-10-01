
<template>
    <BigChildCardsRender :title="props.title" :navigation="protectedNavigation"/>
</template>

<script setup lang="ts">
    import {computed} from "vue";
    import {hash} from "ohash";
    import BigChildCardsRender from "./BigChildCardsRender.vue";
    const {public:{CollectionNames}} = useRuntimeConfig()

    const props = defineProps<{
        directory: string
        title: string
    }>()

    const {data: navigation} = await useAsyncData(
        `BigChildCard-${hash(props.directory)}`,
        () => queryCollection(CollectionNames.docs).where("path", "LIKE", `${props.directory}/%`).all()
    );

    // avoid null values in navigation
    const protectedNavigation = computed(() => {
        return navigation.value?.filter(Boolean)
    })
</script>