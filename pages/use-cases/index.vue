<template>
    <div>
        <Head>
            <Title>Use cases & Usages for Modern Data Orchestration</Title>
            <Meta name="description"
                  content="Harness your data, unlock valuable insights, and drive informed decision-making by leveraging Kestra's uses cases"/>
        </Head>

        <SolutionsHeader/>
        <SolutionsPossibilities/>
        <SolutionsUseCases/>
        <HomeEnterpriseEdition/>
        <LayoutFooterContact
            title="New to Kestra?"
            subtitle="Use blueprints to kickstart your first workflows."
            purpleButtonText="Get started with Kestra"
            purpleButtonHref="https://kestra.io/slack"
        />
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
                content: "Harness your data, unlock valuable insights, and drive informed decision-making by leveraging Kestra's uses cases"
            },
            { name: 'twitter:image', content: `${origin}/landing/company/ui.png` },
            { name: 'twitter:image:alt', content: "Picture of the user interface of Kestra on light mode" }
        ]
    })
</script>
