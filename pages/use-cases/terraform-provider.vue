<template>
        <Head>
          <Title>Kestra Terraform Provider: Deploy All Your Workflows in a CI/CD Process</Title>
          <Meta name="description" content="Manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations." />
        </Head>
    <div class="main">
        <div class="container">
            <TerraformHeader/>
            <TerraformOverview />
            <TerraformUseCases />
            <TerraformFooter />
        </div>
    </div>
</template>

<script setup>
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary-large-image' },
            { name: 'twitter:site', content: '@kaestra_io' },
            { name: 'twitter:title', content: "Kestra Terraform Provider: Deploy All Your Workflows in a CI/CD Process" },
            {
                name: 'twitter:description',
                content: "Manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations."
            },
            { name: 'twitter:image', content: "https://kestra.io/terraform/header/background.svg" },
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
    background-color: $purple-34;
    color: white;
}
</style>