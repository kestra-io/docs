<template>
    <div class="container mb-5">
        <Section
            title="Dive deeper into our use cases"
            subtitle="Uncover the Depth of Kestra's Capabilities"
        >
            <div class="row">
                <div class="col-md-4" data-aos="fade-right">
                    <NuxtLink href="/use-cases/change-data-capture">
                        <img class="img-fluid" src="/landing/usecases/cdc/intro.svg" alt="CI/CD with Github Action, Gitlab or Terraform" />
                        <h4 class="title">Change data capture</h4>
                        <p>
                            Streamline Complex Data Pipelines and Automate Repetitive Tasks for Enhanced Efficiency
                        </p>
                    </NuxtLink>
                </div>

                <div class="col-md-4" data-aos="fade-right">
                    <NuxtLink href="/use-cases/modern-data-stack">
                        <img class="img-fluid" src="/landing/usecases/mds/intro.svg" alt="CI/CD with Github Action, Gitlab or Terraform" />
                        <h4 class="title">Modern Data Stack Integration</h4>
                        <p>
                            Integrate leading data tools from the Modern Data Stack with Kestra
                        </p>
                    </NuxtLink>
                </div>

                <div class="col-md-4" data-aos="fade-right">
                    <NuxtLink href="/use-cases/ci-cd">
                        <img class="img-fluid" src="/landing/usecases/cicd/intro.svg" alt="CI/CD with Github Action, Gitlab or Terraform" />
                        <h4 class="title">CI/CD for your Kestra Workflows</h4>
                        <p>
                            Embrace software engineering practices for versioning, deploying, and maintaining data workflows
                        </p>
                    </NuxtLink>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container .row > div {
        position: relative;
        h4 {
            font-weight: bold;
            color: var(--bs-black);
        }

        img {
            width: 100%;
            margin-bottom: 1rem;
            background: $light-cyan;
            border-radius: $border-radius;
            padding: calc($spacer / 2);
        }

        .badge {
            position: absolute;
            top: 0.625rem;
            right: 1.5rem;
        }

        p {
            color: var(--bs-gray-900);
        }
    }
</style>
