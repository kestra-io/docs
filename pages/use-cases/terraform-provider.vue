<template>
        <Head>
          <Title>Kestra Terraform Provider: Deploy All Your Workflows in a CI/CD Process</Title>
          <Meta name="description" content="Manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations." />
        </Head>
    <div class="main bg-dark-4">
            <TerraformHeader/>
            <TerraformOverview />
            <TerraformUseCases />
            <TerraformFooter />
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
            { name: 'twitter:image', content: `${origin}/terraform/header/background.svg` },
            {
                name: 'twitter:image:alt',
                content: "Background Image for Terform-Provider"
            }
        ]
    })
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";

.main {
    color: $white;
}
</style>