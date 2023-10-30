<template>
        <Head>
          <Title>Kestra Terraform Provider: Deploy All Your Workflows in a CI/CD Process</Title>
          <Meta name="description" content=" Manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations." />
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

<style scoped lang="scss">
@import "../../assets/styles/variable";
.main {
    background-color: $purple-34;
    color: white;
}
</style>