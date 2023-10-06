<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
    useHead({
        htmlAttrs: {
            lang: 'en'
        },
        link: [
            {
                rel: 'icon',
                type: 'image/png',
                href: '/favicon-192x192.png'
            }
        ],
        titleTemplate: (titleChunk) => {
            return titleChunk  && titleChunk != 'Kestra, Open Source Declarative Data Orchestration' ? `${titleChunk} | Kestra` : 'Kestra, Open Source Declarative Data Orchestration';
        }
    })
</script>
