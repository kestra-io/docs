<template>
    <div class="container">
        <Section
            title="Dive deeper into our use cases"
            subtitle="Uncover the Depth of Kestra's Capabilities"
        >
            <div class="row">
                <div class="col-md-4">
                    <NuxtLink href="/solutions/change-data-capture">
                        <img src="/landing/usages/image_11.png" />
                        <div class="title">Change data capture</div>
                        <div>
                            Streamline Complex Data Pipelines and Automate Repetitive Tasks for Enhanced Efficiency
                        </div>
                    </NuxtLink>
                </div>

                <div class="col-md-4">
                    <img src="/landing/usages/image_12.png" />
                    <div class="title">Automate Your Data Pipelines</div>
                    <div>
                        Boost Data Synchronization and Streamlined Processing with Kestra's CDC Capabilities
                    </div>
                </div>

                <div class="col-md-4">
                    <img src="/landing/usages/image_13.png" />
                    <div class="title">Automate Your Data Pipelines</div>
                    <div>
                        Streamline Complex Data Pipelines and Automate Repetitive Tasks for Enhanced Efficiency
                    </div>
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

    .container .row {
        padding-bottom: $spacer;

        .col-md-4 {
            padding-right: $spacer;
        }

        .title {
            font-weight: bold;
            font-size: large;
        }
    }
</style>