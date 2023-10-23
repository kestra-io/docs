<template>
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