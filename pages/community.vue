<template>
    <div>
        <Head>
            <Title>Join a Thrilling Community of Data Enthusiasts</Title>
            <Meta name="description"
                  content="Connect with a vibrant community of data enthusiasts to learn, collaborate, and contribute to the evolution of data orchestration."/>
        </Head>

        <CommunityHeader/>
        <NuxtLazyHydrate when-visible>
            <CommunitySlack/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <Community/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <CommunityGuidelines />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <CommunityContributors/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Getting started"
                subtitle="Start building with Kestra — Automate Everything Everywhere All at Once."
                darkButtonText="Read the docs"
                purpleButtonText="Get started!"
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
            { name: 'twitter:title', content: "Join a Thrilling Community of Data Enthusiasts" },
            {
                name: 'twitter:description',
                content: "Connect with a vibrant community of data enthusiasts to learn, collaborate, and contribute to the evolution of data orchestration."
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "Join a Thrilling Community of Data Enthusiasts"},
            { property: 'og:title', content: "Join a Thrilling Community of Data Enthusiasts" },
            {
              property: 'og:description',
              content: "Connect with a vibrant community of data enthusiasts to learn, collaborate, and contribute to the evolution of data orchestration."
            },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Join a Thrilling Community of Data Enthusiasts" },
        ]
    })

</script>
