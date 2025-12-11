<template>
    <div class="content">
        <Head>
            <Title>Kestra, Open Source Declarative Orchestration Platform</Title>
            <Meta name="description"
                  content="Use declarative language to build simpler, faster, scalable and flexible workflows"/>
        </Head>
        <HomeHeader/>
        <HomeLogosTable/>
        <HomeOpenSource/>
        <HomeOpenSourceQuotes/>
        <NuxtLazyHydrate when-visible>
            <HomeFeatures/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeEveryDev/>
            <HomeExperience/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomePlugins/>
            <HomeBlueprints/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeEnterprise/>
            <HomeEnterpriseQuotes />
            <HomeCTA/>
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>
    definePageMeta({
        transparentHeader: true,
    })
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "Kestra, Open Source Declarative Orchestration" },
            {
                name: 'twitter:description',
                content: "Use declarative language to build simpler, faster, scalable and flexible workflows"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "kaestra" },
            { property: 'og:title', content: "Kestra, Open Source Declarative Orchestration" },
            { property: 'og:description', content: "Use declarative language to build simpler, faster, scalable and flexible workflows" },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Kestra, Open Source Declarative Orchestration" },
            { property: 'og:url', content: `${origin}` },
        ]
    })

</script>

<style lang="scss" scoped>
    .content {
        margin-top: -67px;
    }
</style>
