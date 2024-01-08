<template>
    <div class="container" >
        <BlueprintsLists :tags="tags"/>
        <BlueprintsNewToKestra />
    </div>
</template>

<script setup>
    const {data: tags} = await useAsyncData('blueprints-tags', () => {
        return $fetch('https://api.kestra.io/v1/blueprints/tags')
    })
</script>