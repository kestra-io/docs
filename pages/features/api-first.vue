<template>
    <div>
        <Head>
            <Title>Kestra API First Design</Title>
            <Meta name="description" content="interact with every aspect of the Kestra programmatically." />
        </Head>
        <FeaturesApifirstHeader />
        <FeaturesApifirstFeatures />
        <FeaturesApifirstGitOptions />
        <FeaturesApifirstIntegrationsInfo />
        <FeaturesApifirstPlugins />
        <LayoutFooterContact
            title="Getting Started with  Declarative Orchestration"
            darkButtonText="Read the docs"
            darkButtonHref="docs/getting-started"
            purpleButtonText="Get started"
            purpleButtonHref="https://github.com/kestra-io/kestra"
        />
    </div>
</template>

<script setup>
  const { origin } = useRequestURL();
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