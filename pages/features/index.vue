<template>
    <div class="features">

        <Head>
            <Title>Powerful Features for Reliable Data Workflows</Title>
            <Meta name="description"
                content="Create and Deploy all kinds Data Pipelines with Ease and Speed with Kestra | Your All-in-One Solution for Orchestrating Workflows" />
        </Head>
        <FeaturesHeader />
        <LazyFeaturesDeclarative />
        <LazyFeaturesOutBox />
        <LazyFeaturesPlugins />
        <LazyFeaturesExperience />
        <LazyFeaturesFeatureEnterprise />
        <LazyFeaturesCTA />
    </div>
</template>

<script setup lang="ts">
const { origin } = useRequestURL()

const title = "Powerful Features for Reliable Data Workflows"
const description = "Create and Deploy all kinds Data Pipelines with Ease and Speed with Kestra | Your All-in-One Solution for Orchestrating Workflows"

useHead({
    meta: [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@kestra_io' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: `${origin}/og-image.png` },
        { name: 'twitter:image:alt', content: "features" },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: `${origin}/og-image.png` },
        { property: 'og:image:type', content: "image/svg+xml" },
        { property: 'og:image:alt', content: title },
    ]
})
</script>
<style lang="scss" scoped>  
.container {
    overflow-y: hidden;
}
</style>