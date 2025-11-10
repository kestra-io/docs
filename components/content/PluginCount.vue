<template>
    <span>{{ totalPlugins }}</span>
</template>

<script setup lang="ts">
import { usePluginsCount } from '~/composables/usePluginsCount';

const { totalPlugins } = usePluginsCount()
</script>
