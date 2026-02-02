<template>
    <div class="overview">
        <Section title="Overview">
            <div class="container">
                <div class="row">
                    <div class="col-12 col-md-6 col-xl-3 mb-4">
                        <Card
                            img="/terraform/overview/deploy-pattern.svg"
                            img-alt="deploy-pattern svg"
                            title="Simplified Deployment"
                            description="You can manage and deploy Kestra workflows directly within your existing Terraform environment, eliminating the need for separate configurations."
                        />
                    </div>
                    <div class="col-12 col-md-6 col-xl-3 mb-4">
                        <Card
                            img="/terraform/overview/hub.svg"
                            img-alt="hub svg"
                            title="Centralized Management"
                            description="The Terraform Provider allows you to manage your Kestra resources in code, along with other infrastructure components, all from a single platform."
                        />
                    </div>
                    <div class="col-12 col-md-6 col-xl-3 mb-4">
                        <Card
                            img="/terraform/overview/code-box-parentheses.svg"
                            img-alt="code-box-parentheses svg"
                            title="Infrastructure as Code"
                            description="By using Terraform, you benefit from the Infrastructure as Code (IaC) best practices, making it easier to version control, collaborate, and maintain your Kestra configurations."
                        />
                    </div>
                    <div class="col-12 col-md-6 col-xl-3 mb-4">
                        <Card
                            img="/terraform/overview/api.svg"
                            img-alt="api svg"
                            title="API-First Approach"
                            description="The provider is built on top of Kestra's API, allowing you to programmatically manage all resources, from workflows, namespaces, and secrets, to user management."
                        />
                    </div>
                </div>
                <div class="hero row justify-content-center align-items-center">
                    <div class="col-12 col-md-6">
                        <div class="configurations-img" data-usal="fade-l">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="562px"
                                height="426px"
                                src="/terraform/overview/declarative-configurations-code.svg"
                                class="w-100"
                                alt="declarative configurations code svg"
                            />
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="row justify-content-center">
                            <div class="col-12 col-md-7 px-5 px-md-0" data-usal="fade-r">
                                <h3 class="mb-3">Declarative Configuration</h3>
                                <p>
                                    Terraform uses its HashiCorp Configuration Language (HCL), while
                                    Kestra flows are defined in YAML. This alignment in declarative
                                    interfaces ensures not only a smooth transition but also makes
                                    it easy to use both technologies together.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="row justify-content-center">
                            <div class="col-12 col-md-7 px-5 px-md-0" data-usal="fade-l">
                                <h3 class="mb-3">Modularity in the Infrastructure Management</h3>
                                <p>
                                    Kestra's Terraform provider is designed to easily manage all
                                    resources using Terraform. This includes, among others, flows,
                                    namespace, and user management, as well as secrets. Check the
                                    list of available resources in our
                                    <a
                                        href="/docs/terraform"
                                        class="text-decoration-underline link-offset-2"
                                        >documentation.</a
                                    >
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="resource-management-image" data-usal="fade-r">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="562px"
                                height="354px"
                                src="/terraform/overview/modular-resource-management-code.svg"
                                class="w-100"
                                alt="modular resource management code svg"
                            />
                        </div>
                    </div>
                    <div class="col-12 col-md-6 px-5 px-md-0" data-usal="zoomin">
                        <p class="mt-5 text-white text-center">
                            The inherent modularity in both, Terraform and Kestra, allows you to
                            create reusable blocks of code. These can be shared across multiple
                            teams or projects, contributing to maintainable operations.
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup lang="ts">
    import Card from "~/components/card/Card.vue"
    import Section from "~/components/layout/Section.vue"
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .overview {
        background: url("/terraform/overview/background.svg") no-repeat 0 -4%;

        :deep(section) {
            border-bottom: $block-border;

            h2 {
                font-size: 3.125rem;
                font-weight: 300;
            }
        }
    }

    .hero {
        padding-bottom: 0;

        p {
            line-height: 1.5rem;
            color: $white;
            font-size: $font-size-md;

            a {
                color: $purple;
            }
        }

        h3 {
            font-size: $h2-font-size;
            font-weight: 400;
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
                background: url("/terraform/configurations-right-bg-light.svg") no-repeat;
                right: -7.5rem;
                top: -8.25rem;
                z-index: 1;
            }

            &::after {
                content: "";
                position: absolute;
                height: 552px;
                width: 1044px;
                background: url("/terraform/configurations-left-bg-light.svg") no-repeat;
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
                background: url("/terraform/resource-management-bg-light.svg") no-repeat;
                left: -18rem;
                top: -6.25rem;
                z-index: 1;
            }
        }
    }
</style>