<template>
    <div class="container mb-5">
        <Section
            title="Dive deeper into our use cases"
            subtitle="Uncover the Depth of Kestra's Capabilities"
        >
            <div class="row">
                <div class="col-md-4" data-aos="fade-right">
                    <NuxtLink href="/use-cases/change-data-capture">
                        <img src="/landing/usages/cdc.svg" alt="Change data capture" />
                        <h4 class="title">Change data capture</h4>
                        <p>
                            Streamline Complex Data Pipelines and Automate Repetitive Tasks for Enhanced Efficiency
                        </p>
                    </NuxtLink>
                </div>

                <div class="col-md-4 opacity-50" data-aos="fade-right">
                    <div class="badge text-bg-primary">Coming soon</div>
                    <img class="img-fluid" src="/landing/usages/cdc.svg" alt="Coming soon" />
                    <h4 class="title">Automate Your Data Pipelines</h4>
                    <p>
                        Boost Data Synchronization and Streamlined Processing with Kestra's CDC Capabilities
                    </p>
                </div>

                <div class="col-md-4 opacity-50" data-aos="fade-right">
                    <div class="badge text-bg-primary">Coming soon</div>
                    <img class="img-fluid" src="/landing/usages/cdc.svg" alt="Coming soon" />
                    <h4 class="title">Automate Your Data Pipelines</h4>
                    <p>
                        Streamline Complex Data Pipelines and Automate Repetitive Tasks for Enhanced Efficiency
                    </p>
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