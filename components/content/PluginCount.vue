<template>
    <span>{{ totalPlugins }}</span>
</template>

<script setup lang="ts">
const { totalPlugins } = usePluginsCount()
</script>
