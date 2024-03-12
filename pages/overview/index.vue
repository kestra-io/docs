<template>
    <div class="main">
        <Head>
            <Title>Kestra Platform Overview</Title>
            <Meta name="description"
                  content="Orchestrate your business-critical applications. Take full advantage of the speed, and performance of Kestra's orchestration platform"/>
        </Head>
        <OverviewHeader/>
        <OverviewWorkflow/>
        <OverviewFeatures/>
        <OverviewEnterpriseEdition/>
        <LayoutFooterContact
            title="Get Started With Kestra"
            darkButtonText="Read the docs"
            purpleButtonText="Get started"
        />
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
      {name: 'twitter:image', content: `${origin}/landing/home/header-bg.png`},
      {name: 'twitter:image:alt', content: "FAQ"}
    ]
  })
</script>
