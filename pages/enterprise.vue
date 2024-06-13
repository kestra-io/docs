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
                purpleButtonText="Talk to Us"
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
            { name: 'twitter:image', content: `${origin}/landing/ee/background.svg` },
            { name: 'twitter:image:alt', content: "Illustration of Kestra's logo with a dark background" }
        ]
    })

</script>
