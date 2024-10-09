<template>
    <div>
        <Head>
            <Title>Get More Out of Your Data With the Enterprise Edition</Title>
            <Meta name="description"
                  content="Get full access of all the Open source features and unlock the full potential with Enterprise only features"/>
        </Head>

        <EnterpriseHeader/>
        <NuxtLazyHydrate when-visible>
            <EnterpriseCustomers/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <EnterpriseBusinessByUs/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <EnterpriseSecurity/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <EnterpriseBusinessDetails/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <EnterpriseCompanyStories/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                darkButtonText="Get Started"
                darkButtonHref="https://kestra.io/docs/getting-started/quickstart"
                purpleButtonText="Talk to sales"
                purpleButtonHref="/demo"
            />
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
