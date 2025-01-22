<template>
    <div class="content">
        <Head>
            <Title>Kestra, Open Source Declarative Orchestration Platform</Title>
            <Meta name="description"
                  content="Use declarative language to build simpler, faster, scalable and flexible pipelines"/>
        </Head>
        <HomeHeader/>
        <HomeFeatures/>
        <NuxtLazyHydrate when-visible>
            <HomeUI/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeHow/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomePlugins/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeCompanyStories />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeTestimonials/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeOpenSource/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutBlogs title="Blog"/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutNewsletter/>
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
            { name: 'twitter:title', content: "Kestra, Open Source Declarative Data Orchestration" },
            {
                name: 'twitter:description',
                content: "Use declarative language to build simpler, faster, scalable and flexible data pipelines"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "kaestra" },
            { property: 'og:title', content: "Kestra, Open Source Declarative Data Orchestration" },
            { property: 'og:description', content: "Use declarative language to build simpler, faster, scalable and flexible data pipelines" },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Kestra, Open Source Declarative Data Orchestration" },
            { property: 'og:url', content: `${origin}` },
        ]
    })

</script>

<style lang="scss" scoped>
    .content {
        margin-top: -67px;
    }
</style>
