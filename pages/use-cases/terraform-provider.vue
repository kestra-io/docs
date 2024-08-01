<template>
        <Head>
          <Title>Kestra Terraform Provider: Deploy All Your Workflows in a CI/CD Process</Title>
          <Meta name="description" content="Manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations." />
        </Head>
    <div class="main bg-dark-4">
        <TerraformHeader/>
        <NuxtLazyHydrate when-visible>
            <TerraformOverview />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <TerraformUseCases />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                subtitle="Integration between Kestra and Terraform is simple. Add the Kestra provider to your Terraform configuration file to get started."
                darkButtonText="YouTube playlist"
                darkButtonHref="https://www.youtube.com/watch?v=tiHa3zucS_Q&list=PLEK3H8YwZn1olYeQ7qbGdY5XQySKCNLUr&ab_channel=Kestra"
                purpleButtonText="Documentation"
                purpleButtonHref="/docs/terraform"
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
            { name: 'twitter:title', content: "Kestra Terraform Provider: Deploy All Your Workflows in a CI/CD Process" },
            {
                name: 'twitter:description',
                content: "Manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations."
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "Kestra Terraform Provider: Deploy All Your Workflows in a CI/CD Process" },
            { property: 'og:title', content: "Kestra Terraform Provider: Deploy All Your Workflows in a CI/CD Process" },
            {
              property: 'og:description',
              content: "Manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations."
            },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Kestra Terraform Provider: Deploy All Your Workflows in a CI/CD Process" },
        ]
    })
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";

.main {
    color: $white;
}
</style>