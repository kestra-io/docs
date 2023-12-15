<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
    htmlAttrs: {
        lang: "en",
    },
    link: [
        {
            rel: "icon",
            type: "image/png",
            href: "/favicon-192x192.png",
        },
    ],
    titleTemplate: (titleChunk) => {
        return titleChunk &&
            titleChunk != "Kestra, Open Source Declarative Data Orchestration"
            ? `${titleChunk} | Kestra`
            : "Kestra, Open Source Declarative Data Orchestration";
    },
});
</script>

<style lang="scss">
.text-gradient {
    background: var(
        --Text_gradient,
        linear-gradient(90deg, #e151f7 2%, #5c47f5 65%)
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
