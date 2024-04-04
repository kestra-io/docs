<template>
    <div class="content">
        <Head>
            <Title>Kestra, Open Source Declarative Data Orchestration</Title>
            <Meta name="description"
                  content="Use declarative language to build simpler, faster, scalable and flexible data pipelines"/>
        </Head>
        <HomeHeader/>
        <NuxtLazyHydrate when-visible>
            <HomeFeatures/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeUI/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeHow/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeCompanyStories />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeTestimonials/>
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
            { name: 'twitter:image', content: `${origin}/landing/home/header-bg.png` },
            { name: 'twitter:image:alt', content: "kaestra" }
        ]
    })

</script>

<style lang="scss" scoped>
    .content {
        margin-top: -67px;
    }
</style>