<template>
    <LayoutSection title="Overview">
        <div class="row">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <img src="/terraform/overview/deploy-pattern.svg" alt="deploy-pattern svg">
                        <h6>Simplified Deployment</h6>
                        <p>You can manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 d-flex">
                    <div class="card-body text-center">
                        <img src="/terraform/overview/hub.svg" alt="hub svg">
                        <h6>Centralized Management</h6>
                        <p>Leveraging the Kestra Terraform Provider allows you to manage your Kestra resources along with other infrastructural components, all from a single platform.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 d-flex">
                    <div class="card-body text-center">
                        <img src="/terraform/overview/code-box-parentheses.svg" alt="code-box-parentheses svg">
                        <h6>Infrastructure as Code</h6>
                        <p>By using Terraform, you benefit from all the Infrastructure as Code (IaC) best practices, making it easier to version control, collaborate, and maintain your Kestra configurations.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 d-flex">
                    <div class="card-body text-center">
                        <img src="/terraform/overview/api.svg" alt="api svg">
                        <h6>API-First Approach</h6>
                        <p>The provider is built on Kestra's API-first architecture, ensuring seamless integration and greater flexibility in managing your data workflows.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="hero row justify-content-center align-items-center">
            <div class="col-12 col-md-6">
                <img src="/terraform/overview/Code.svg" class="w-100" alt="code svg">
            </div>
            <div class="col-12 col-md-6">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-7">
                        <h3>Declarative Configurations</h3>
                        <p>Terraform uses its HashiCorp Configuration Language (HCL), while Kestra flows are defined in YAML. This alignment in philosophy ensures not only a smooth transition but also a lower learning curve.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-7">
                        <h3>Comprehensive & Modular Resource Management</h3>
                        <p>Our Terraform provider for Kestra is designed to easily manage your Kestra resources using Terraform. This includes, among others, flows, namespace, and user management, as well as secrets. Check the list of available resources in our documentation.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <img src="/terraform/overview/Code (1).svg" class="w-100" alt="code svg">
            </div>
            <div class="col-12 col-md-6">
                <p class="mt-5">Additionally, the inherent modularity in both Terraform and Kestra's configurations allows you to create reusable blocks of code. These can be shared across multiple teams or projects, contributing to more efficient, maintainable operations.</p>
            </div>
        </div>
    </LayoutSection>
</template>

<style scoped lang="scss">
@import "../../assets/styles/variable";
:deep(.main) {
    background: url('/terraform/overview/background.svg') no-repeat 0 -15%;
}

.card {
    background-color: #110221;
    color: white;
    box-shadow: none !important;
    
    .card-body {
        padding: 2rem 1rem;

        h6 {
            line-height: 1.875rem;
        }

        p {
            font-size: $font-size-sm;
            line-height: 1.375rem;
        }
    }

}

.hero {
    padding-bottom: 0;

    p {
        line-height: 24px;
    }
}

</style>