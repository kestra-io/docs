<template>
    <div>
        <Head>
            <Title>Powerful Features for Reliable Data Workflows</Title>
            <Meta name="description"
                  content="Create and Deploy all kinds Data Pipelines with Ease and Speed with Kestra |  Your All-in-One Solution for Orchestrating Workflows"/>
        </Head>

        <FeaturesHeader/>
        <NuxtLazyHydrate when-visible>
            <FeaturesMain/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesShips/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutIntegrations/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesCreate/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesBuild/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesData/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesEnterpriseEdition/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesFooter/>
        </NuxtLazyHydrate>

    </div>
</template>

<script setup>
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "Powerful Features for Reliable Data Workflows" },
            {
                name: 'twitter:description',
                content: "Create and Deploy all kinds Data Pipelines with Ease and Speed with Kestra |  Your All-in-One Solution for Orchestrating Workflows"
            },
            { name: 'twitter:image', content: `${origin}/landing/features/header.png` },
            { name: 'twitter:image:alt', content: "features" }
        ]
    })
</script>
