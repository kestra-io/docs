<template>
    <div class="container">
        <Section title="Benefits of the Integration">
            <div class="row justify-content-center align-items-center">
                <div class="col-12 col-md-5" data-usal="fade-l">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="749px"
                        src="/terraform/use-cases/reliable-deployments.svg"
                        class="w-100"
                        alt="reliable deployments"
                    />
                </div>
                <div class="col-12 col-md-5">
                    <div class="row justify-content-center">
                        <div class="col-12 col-md-9 px-5 px-md-0" data-usal="fade-r">
                            <h4 class="mb-3">Reliable Deployments with Infrastructure as Code</h4>
                            <p>
                                Combine Kestra's orchestration capabilities with Terraform's
                                infrastructure-as-code model. Provision resources in minutes for
                                consistent, reproducible, and scalable workflows. <br />
                                <a
                                    href="/use-cases/ci-cd"
                                    class="text-decoration-underline link-offset-2"
                                    >Learn more</a
                                >
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-5">
                    <div class="row justify-content-center">
                        <div class="col-12 col-md-9 px-5 px-md-0" data-usal="fade-l">
                            <h4 class="mb-3">Version Control and Rollback</h4>
                            <p>
                                Incorporating version control systems such as Git is a recommended
                                standard. It enables rollbacks and comprehensive auditing. Terraform
                                additionally helps you version control not only your code but also
                                your infrastructure configuration.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-5" data-usal="fade-r">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="750px"
                        src="/terraform/use-cases/version-control.svg"
                        class="w-100"
                        alt="version control"
                    />
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup lang="ts">
    import Section from "~/components/layout/Section.vue"
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container {
        :deep(section h2),
        h3 {
            font-size: 3.125rem;
            font-weight: 400;
        }

        p {
            color: $white;
            font-size: 16px;
            font-weight: 300;

            a {
                color: $purple;
            }
        }
    }
</style>