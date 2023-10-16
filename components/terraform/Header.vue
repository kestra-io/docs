<template>
    <div class="hero header row justify-content-center" data-aos="fade-right">
        <div class="col-12 col-md-12 col-lg-10">
            <div class="row">
                <div class="col-12 col-md-6">
                    <h1>Kestra Terraform Provider: Deploy All Your Workflows <br/> in a CI/CD Process</h1>
                    <p>Manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations.</p>
                    <div class="d-flex flex-wrap gap-2">
                        <NuxtLink href="https://github.com/kestra-io/kestra">
                            <button class="btn btn-primary btn-lg">Get Started</button>
                        </NuxtLink>
                        <NuxtLink href="/docs/terraform">
                            <button class="btn-animated btn-purple-animated btn btn-secondary btn-lg">Read the docs</button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.header {
    background: url('terraform/header/background.svg') no-repeat center;

    p {
        font-size: $font-size-xl;
    }

}
</style>