<template>
    <div class="main">
        <Head>
            <Title>Kestra Platform Overview</Title>
            <Meta name="description"
                  content="Orchestrate your business-critical applications. Take full advantage of the speed, and performance of Kestra's orchestration platform"/>
        </Head>
        <OverviewHeader/>
        <NuxtLazyHydrate when-visible>
            <OverviewWorkflow/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <OverviewFeatures/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <OverviewEnterpriseEdition/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Get Started With Kestra"
                darkButtonText="Talk to Us"
                darkButtonHref="/demo"
                purpleButtonText="Get started"
            />
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>

  const {origin} = useRequestURL()
  useHead({
    meta: [
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:site', content: '@kestra_io'},
      {name: 'twitter:title', content: "Kestra Platform Overview"},
      {
        name: 'twitter:description',
        content: "Orchestrate your business-critical applications. Take full advantage of the speed, and performance of Kestra's orchestration platform"
      },
      {name: 'twitter:image', content: `${origin}/og-image.png`},
      {name: 'twitter:image:alt', content: "Kestra Platform Overview"},
      { property: 'og:title', content: "Kestra Platform Overview" },
      { property: 'og:description', content: "Orchestrate your business-critical applications. Take full advantage of the speed, and performance of Kestra's orchestration platform" },
      { property: 'og:image', content: `${origin}/og-image.png` },
      { property: 'og:image:type', content: "image/svg+xml" },
      { property: 'og:image:alt', content: "Kestra Platform Overview" },
      { property: 'og:url', content: `${origin}/overview` },
    ]
  })
</script>
