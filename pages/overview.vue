<template>
    <div class="main">
        <Head>
            <Title>Kestra Platform Overview</Title>
            <Meta name="description"
                  content="Orchestrate your business-critical applications. Take full advantage of the speed, and performance of Kestra's orchestration platform"/>
        </Head>
        <OverviewHero/>
        <OverviewAgnostic/>
        <OverviewWorkflows />
        <OverviewMessage/>
        <OverviewEnterpriseHeaderBox/>
        <OverviewCTA />
    </div>
</template>

<script setup lang="ts">
import { useRequestURL, useHead } from '#imports'

const { origin } = useRequestURL()
useHead({
  meta: [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@kestra_io' },
    { name: 'twitter:title', content: "Kestra Platform Overview" },
    {
      name: 'twitter:description',
      content: "Orchestrate your business-critical applications. Take full advantage of the speed, and performance of Kestra's orchestration platform"
    },
    { name: 'twitter:image', content: `${origin}/og-image.png` },
    { name: 'twitter:image:alt', content: "Kestra Platform Overview" },
    { property: 'og:title', content: "Kestra Platform Overview" },
    { property: 'og:description', content: "Orchestrate your business-critical applications. Take full advantage of the speed, and performance of Kestra's orchestration platform" },
    { property: 'og:image', content: `${origin}/og-image.png` },
    { property: 'og:image:type', content: "image/svg+xml" },
    { property: 'og:image:alt', content: "Kestra Platform Overview" },
    { property: 'og:url', content: `${origin}/overview` },
  ]
})
</script>
