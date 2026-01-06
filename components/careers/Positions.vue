<template>
    <PositionsRenderer :positions="pageData" />
</template>

<script setup>
import PositionsRenderer from './PositionsRenderer.vue';

    const {data: pageData} = await useAsyncData(
        `Career-Positions`,
        () => $fetch(`/api/careers`),
    );
</script>
