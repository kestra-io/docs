<template>
    <LayoutSection title="Overview" class="overview">
        <div class="row">
            <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="card h-100" data-aos="fade-right">
                    <div class="card-body text-center">
                        <img src="/terraform/overview/deploy-pattern.svg" alt="deploy-pattern svg">
                        <h6>Simplified Deployment</h6>
                        <p>You can manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="card h-100 d-flex" data-aos="fade-right">
                    <div class="card-body text-center">
                        <img src="/terraform/overview/hub.svg" alt="hub svg">
                        <h6>Centralized Management</h6>
                        <p>The Terraform Provider allows you to manage your Kestra resources in code, along with other infrastructure components, all from a single platform.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="card h-100 d-flex" data-aos="fade-right">
                    <div class="card-body text-center">
                        <img src="/terraform/overview/code-box-parentheses.svg" alt="code-box-parentheses svg">
                        <h6>Infrastructure as Code</h6>
                        <p>By using Terraform, you benefit from the Infrastructure as Code (IaC) best practices, making it easier to version control, collaborate, and maintain your Kestra configurations.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3 mb-4">
                <div class="card h-100 d-flex" data-aos="fade-right">
                    <div class="card-body text-center">
                        <img src="/terraform/overview/api.svg" alt="api svg">
                        <h6>API-First Approach</h6>
                        <p>The provider is built on top of Kestra's API, allowing you to programmatically manage all resources, from workflows, namespaces, and secrets, to user management.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="hero row justify-content-center align-items-center">
            <div class="col-12 col-md-6">
                <div class="configurations-img" data-aos="fade-left">
                    <img src="/terraform/overview/declarative-configurations-code.svg" class="w-100" alt="declarative configurations code svg">
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-7" data-aos="fade-right">
                        <h3>Declarative Configuration</h3>
                        <p>Terraform uses its HashiCorp Configuration Language (HCL), while Kestra flows are defined in YAML. This alignment in declarative interfaces ensures not only a smooth transition but also makes it easy to use both technologies together.</p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-7" data-aos="fade-left">
                        <h3>Modularity in the Infrastructure Management</h3>
                        <p>Kestra's Terraform provider is designed to easily manage all resources using Terraform. This includes, among others, flows, namespace, and user management, as well as secrets. Check the list of available resources in our <NuxtLink href="/docs/terraform" class="text-decoration-underline link-offset-2">documentation.</NuxtLink></p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="resource-management-image" data-aos="fade-right">
                    <img src="/terraform/overview/modular-resource-management-code.svg" class="w-100" alt="modular resource management code svg">
                </div>
            </div>
            <div class="col-12 col-md-6">
                <p class="mt-5 text-white">The inherent modularity in both, Terraform and Kestra, allows you to create reusable blocks of code. These can be shared across multiple teams or projects, contributing to maintainable operations.</p>
            </div>
        </div>
    </LayoutSection>
</template>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.overview {
    background: url('/terraform/overview/background.svg') no-repeat 0 -4%;
}

.card {
    background-color: $purple-33;
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
            color: $purple-32;
        }
    }

}

.hero {
    padding-bottom: 0;

    p {
        line-height: 1.5rem;
        color: $purple-32;
    }

    .configurations-img {
        position: relative;
        
        > img {
            position: relative;
            z-index: 10;
        }

        &::before {
            content: "";
            position: absolute;
            height: 291px;
            width: 292px;
            background: url('/terraform/configurations-right-bg-light.svg') no-repeat;
            right: -7.5rem;
            top: -8.25rem;
            z-index: 1;
        }

        &::after {
            content: "";
            position: absolute;
            height: 552px;
            width: 1044px;
            background: url('/terraform/configurations-left-bg-light.svg') no-repeat;
            left: -15rem;
            top: -6.25rem;
            z-index: 1;
        }
    }

    .resource-management-image {
        position: relative;
        
        > img {
            position: relative;
            z-index: 10;
        }

        &::before {
            content: "";
            position: absolute;
            height: 551px;
            width: 974px;
            background: url('/terraform/resource-management-bg-light.svg') no-repeat;
            left: -18rem;
            top: -6.25rem;
            z-index: 1;
        }
    }
}

</style>