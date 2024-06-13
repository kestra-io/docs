<template>
    <div>
        <Head>
            <Title>Kestra API First Design</Title>
            <Meta name="description" content="interact with every aspect of the Kestra programmatically." />
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
                title="Getting Started with  Declarative Orchestration"
                darkButtonText="Get started"
                darkButtonHref="docs/getting-started"
                purpleButtonText="Talk to us"
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
      { name: 'twitter:image', content: `${origin}/landing/features/declarative/header-bg.svg` },
      { name: 'twitter:image:alt', content: "Declarative Data Orchestration with Kestra" }
    ]
  })
</script>