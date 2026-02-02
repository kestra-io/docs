<template>
    <PositionsRenderer :positions="pageData" />
</template>

<script setup>
    import PositionsRenderer from "~/components/careers/PositionsRenderer.vue"

    const { data: pageData } = await useAsyncData(`Career-Positions`, () => $fetch(`/api/careers`))
</script>