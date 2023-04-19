<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
    useHead({
        titleTemplate: (titleChunk) => {
            return titleChunk ? `${titleChunk} | Kestra` : 'Kestra, Open Source Declarative Data Orchestration';
        }
    })
</script>
