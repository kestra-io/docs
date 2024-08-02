<template>
    <div>
        <Head>
            <Title>Use cases for Modern Data Orchestration</Title>
            <Meta name="description"
                  content="Harness the value of your data, unlock new insights, and drive informed decision-making using Kestra's automation platform"/>
        </Head>

        <SolutionsHeader/>
        <SolutionsPossibilities/>
        <SolutionsUseCases/>
        <HomeEnterpriseEdition/>
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "Use cases & Usages for Modern Data Orchestration" },
            {
                name: 'twitter:description',
                content: "Harness the value of your data, unlock new insights, and drive informed decision-making using Kestra's automation platform"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "Use cases & Usages for Modern Data Orchestration" },
            { property: 'og:title', content: "Use cases & Usages for Modern Data Orchestration" },
            {
              property: 'og:description',
              content: "Harness the value of your data, unlock new insights, and drive informed decision-making using Kestra's automation platform"
            },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Use cases & Usages for Modern Data Orchestration" },
        ]
    })
</script>
