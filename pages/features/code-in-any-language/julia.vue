<template>
    <div>
        <Head>
            <Title>Orchestrate your Julia Scripts with Kestra</Title>
            <Meta name="description" content="Build declaratively your workflows and seamlessly run all your Julia Scripts with Kestra" />
        </Head>

        <FeaturesLanguageSubPagesHeader
            title="Julia Scripts"
            description="Build declaratively your workflows and seamlessly run all your Python Scripts"
            source="/landing/features/language/julia/header.svg"
        />
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageSubPagesFeatures
                :features="juliaFeatures"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageSubPagesPower
                title="with Julia"
                :description="juliaPowerDesc"
                source="/landing/features/language/julia/power.svg"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageSubPagesScripts
                title="Julia"
                :scripts="juliaScripts"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageSubPagesOrchestrator
                :description="juliaOrchestratorDesc"
                source="/landing/features/language/julia/scripts/julia-puzzle.svg"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguagePlugins />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Getting Started with  Declarative Orchestration"
                darkButtonText="Get started"
                darkButtonHref="/docs/getting-started/quickstart#start-kestra"
                purpleButtonText="Talk to us"
                purpleButtonHref="/demo"
            />
        </NuxtLazyHydrate>
    </div>
</template>

<script lang="ts" setup>
  const { origin } = useRequestURL()

  import { juliaFeatures, juliaPowerDesc, juliaScripts, juliaOrchestratorDesc } from '~/data/languages/julia'

  useHead({
    meta: [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@kestra_io' },
      { name: 'twitter:title', content: "Code in Any language with Kestra the Language Agnostic Platform" },
      {
        name: 'twitter:description',
        content: "Separate your business logic from your orchestration logic with a versatile set of language-agnostic developer tools"
      },
      { name: 'twitter:image', content: `${origin}/og-image.png` },
      { name: 'twitter:image:alt', content: "Code in Any language with Kestra the Language Agnostic Platform" },
      { property: 'og:title', content: "Code in Any language with Kestra the Language Agnostic Platform" },
      {
        property: 'og:description',
        content: "Separate your business logic from your orchestration logic with a versatile set of language-agnostic developer tools"
      },
      { property: 'og:image', content: `${origin}/og-image.png` },
      { property: 'og:image:type', content: "image/svg+xml" },
      { property: 'og:image:alt', content: "Code in Any language with Kestra the Language Agnostic Platform" },
    ]
  })
</script>
