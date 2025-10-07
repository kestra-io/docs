<template>
    <HomeBlueprintsRender :blueprints />
</template>

<script lang="ts" setup>
import { useBlueprintsList } from '~/composables/useBlueprintsList.js'
const { data: blueprintsData } = await useAsyncData(
  `blueprints`,
  () => useBlueprintsList({ page: 1, size: 20 })
)
const blueprints = computed(() => blueprintsData.value?.results ?? [])
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .container {
        text-align: center;
        padding: 1rem;
    }
    h2 {
        color: white;
        font-size: 3rem;
        font-weight: 600;
        span{
            color: $primary;
            background: linear-gradient(90deg, #7C2EEA 0%, #658AF9 100%) no-repeat center;
            font-weight: 600;
            background-size: cover;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    p {
        color: #777;
    }
    .button-container{
        text-align: center;
        margin: 4rem 0 3rem;
    }
</style>