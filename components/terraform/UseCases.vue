<template>
    <LayoutSection title="Benefits of the Integration">
        <div class="row justify-content-center align-items-center">
            <div class="col-12 col-md-5">
                <img src="/terraform/use-cases/reliable-deployments.svg" class="w-100" alt="reliable deployments">
            </div>
            <div class="col-12 col-md-5">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-9">
                        <h3>Reliable Deployments with Infrastructure as Code</h3>
                        <p>
                            Combine Kestra's orchestration capabilities with Terraform's infrastructure-as-code model. Provision resources in minutes for consistent, reproducible, and scalable workflows. <br/>
                            <NuxtLink href="/use-cases/ci-cd" class="text-decoration-underline link-offset-2">Learn more</NuxtLink>
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-5">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-9">
                        <h3>Version Control and Rollback</h3>
                        <p>Incorporating version control systems such as Git is a recommended standard. It enables rollbacks and comprehensive auditing. Terraform additionally helps you version control not only your code but also your infrastructure configuration.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-5">
                <img src="/terraform/use-cases/version-control.svg" class="w-100" alt="version control">
            </div>
        </div>
    </LayoutSection>
</template>

<style scoped lang="scss">
@import "../../assets/styles/variable";
p {
    line-height: 1.5rem;
    color: $purple-32;
}
</style>