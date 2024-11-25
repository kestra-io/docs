<template>
    <div class="main-container">
        <Head>
            <Title>Get More Out of Your Data With the Enterprise Edition</Title>
            <Meta name="description"
                  content="Get full access of all the Open source features and unlock the full potential with Enterprise only features"/>
        </Head>
        <EnterpriseHeader/>
        <NuxtLazyHydrate when-visible>
            <EnterpriseSecurity/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <EnterpriseSuccessProgram/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <EnterpriseProjectDetails/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <EnterpriseOrchestraCore/>
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "Get More Out of Your Data With the Enterprise Edition" },
            {
                name: 'twitter:description',
                content: "Get full access of all the Open source features and unlock the full potential with Enterprise only features"
            },
            { name: 'twitter:image:alt', content: "Get More Out of Your Data With the Enterprise Edition" },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { property: 'og:title', content: "Get More Out of Your Data With the Enterprise Edition" },
            {
              property: 'og:description',
              content: "Get full access of all the Open source features and unlock the full potential with Enterprise only features"
            },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Get More Out of Your Data With the Enterprise Edition" },
        ]
    })

</script>
<style scoped lang="scss">
    .main-container {
        overflow: clip;
    }
</style>
