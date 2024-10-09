<template>
    <div>
        <Head>
            <Title>Kestra API First Design</Title>
            <Meta name="description" content="interact with every aspect of Kestra programmatically." />
        </Head>
        <FeaturesApifirstHeader />
        <NuxtLazyHydrate when-visible>
            <FeaturesApifirstFeatures />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesApifirstGitOptions />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesApifirstIntegrationsInfo />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesApifirstPlugins />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Getting Started with Declarative Orchestration"
                darkButtonText="Get started"
                darkButtonHref="/docs/getting-started/quickstart#start-kestra"
                purpleButtonText="get a demo"
                purpleButtonHref="/demo"
            />
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>
  const { origin } = useRequestURL();
  useHead({
    meta: [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@kestra_io' },
      { name: 'twitter:title', content: "Kestra API First Design" },
      {
        name: 'twitter:description',
        content: "interact with every aspect of the Kestra programmatically."
      },
      { name: 'twitter:image', content: `${origin}/og-image.png` },
      { name: 'twitter:image:alt', content: "Kestra API First Design" },
      { property: 'og:title', content: "Kestra API First Design" },
      { property: 'og:description', content: "interact with every aspect of the Kestra programmatically." },
      { property: 'og:image', content: `${origin}/og-image.png` },
      { property: 'og:image:type', content: "image/svg+xml" },
      { property: 'og:image:alt', content: "Kestra API First Design" },
    ]
  })
</script>