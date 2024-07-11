<template>
    <div>
        <Head>
            <Title>Code in Any language with Kestra the Language Agnostic Platform</Title>
            <Meta name="description" content="Separate your business logic from your orchestration logic with a versatile set of language-agnostic developer tools" />
        </Head>

        <FeaturesLanguageHeader />
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageFeatures />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageGitOptions />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageIntegrationsInfo />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguagePlugins />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageAgnosticOrchestration />
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
  const { origin } = useRequestURL()
  useHead({
    meta: [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@kestra_io' },
      { name: 'twitter:title', content: "Code in Any language with Kestra the Language Agnostic Platform" },
      {
        name: 'twitter:description',
        content: "Separate your business logic from your orchestration logic with a versatile set of language-agnostic developer tools"
      },
      { name: 'twitter:image', content: `${origin}/landing/features/declarative/header-bg.svg` },
      { name: 'twitter:image:alt', content: "Declarative Data Orchestration with Kestra" }
    ]
  })
</script>
