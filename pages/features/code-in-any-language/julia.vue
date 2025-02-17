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
                purpleButtonText="get a demo"
                purpleButtonHref="/demo"
            />
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>
  const { origin } = useRequestURL()

  const juliaFeatures = {
    title: 'Advanced Julia Scripting with Kestra',
    childList: [
      {
        source: '/landing/features/language/sub-pages/icon-customize.svg',
        title: 'Customize at Runtime',
        description: 'Install any Julia package dynamically as your project demands, maintaining flexibility and power.',
      },
      {
        source: '/landing/features/language/sub-pages/icon-sync.svg',
        title: 'Import or Sync your Entire Project',
        description: 'Sync your entire Julia project into Kestra, ensuring that all components, from packages to custom modules, are managed effectively.',
      },
      {
        source: '/landing/features/language/sub-pages/icon-cloud.svg',
        title: 'Cloud-Agnostic Execution',
        description: 'Deploy and execute your Julia scripts on any cloud platform using Kestra’s Task Runners, optimizing for performance and cost efficiency.',
      },
    ],
  };

  const juliaPowerDesc = [
    'Julia is renowned for high-performance numerical analysis and computational science. Leverage Kestra to orchestrate your Julia scripts, enhancing their capabilities in large-scale analytics and machine learning applications. From data ingestion to complex numerical simulations, Kestra streamlines your Julia workflows, accelerating development and deployment.'
  ];

  const juliaScripts = [
    {
      title: 'Embrace GitOps best practices for your Julia scripts',
      description: 'Kestra takes Julia script orchestration to the next level by embracing Continuous Integration/Continuous Deployment (CI/CD) and GitOps principles. Manage your Julia workflows with the same rigor as your application code: version control, automated testing, and consistent, repeatable deployment environments. Kestra  lets you define workflows in YAML, ensuring that your orchestration is as maintainable and scalable as your applications.',
      source: '/landing/features/language/git-with-kestra.svg',
      imgWidth: '520px',
      imgHeight: '282px',
    },
    {
      title: 'Integration with Docker, Seamless Environment Management',
      description: 'Simplify managing environments for Julia scripts with Kestra’s Docker integration. Ensure your scripts execute in isolated and consistent settings to enhance reproducibility and scalability. Manage everything from Kestra\'s intuitive editor, making environment management straightforward and effective.',
      source: '/landing/features/language/julia/scripts/docker.svg',
      imgWidth: '568px',
      imgHeight: '420px',
    },
    {
      title: 'Embedded Julia Scripts for Simplicity',
      description: 'For simpler tasks requiring immediate results, use Kestra’s task feature to embed Julia scripts directly into your workflows. This is perfect for quick data manipulations, statistical calculations, or alert setups within broader workflows, enhancing both speed and efficiency.',
      source: '/landing/features/language/julia/scripts/embedded-julia.svg',
      imgHeight: '420px',
      mask: 'mask-1',
    }
  ];

  const juliaOrchestratorDesc = [
    'Integrate seamlessly with your existing Julia scripts without requiring any code modifications. Continue developing in Julia as usual, and let Kestra handle the orchestration. This seamless integration allows you to focus on creating powerful, efficient code without worrying about the operational overhead.',
    'Maintain your focus on writing great code, not on adapting it to fit the orchestration tool. Whether your scripts are set up for data processing, automation, or any other task, integrating them into Kestra is as simple as defining your workflow.',
  ];

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
