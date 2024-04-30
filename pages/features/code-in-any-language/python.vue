<template>
    <div>
        <Head>
            <Title>Orchestrate your Python Scripts with Kestra</Title>
            <Meta name="description" content="Build declaratively your workflows and seamlessly run all your Python Scripts with Kestra" />
        </Head>

        <FeaturesLanguagePythonHeader />
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguagePythonFeatures />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguagePythonPower  />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate when-visible>
            <FeaturesLanguagePythonScripts />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguagePythonOrchestrator />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguagePlugins />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Getting Started with  Declarative Orchestration"
                darkButtonText="Get started"
                darkButtonHref="docs/getting-started"
                purpleButtonText="Talk to us"
                purpleButtonHref="https://kestra.io/demo"
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
