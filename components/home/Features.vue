<template>
    <div class="container features">
        <Section subtitle="Simplicity scales, complexity" subtitle-after="Fails">
            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <Card
                        :icon="CalculatorVariant"
                        title="Embedded Visual Studio Code editor IDE"
                        description="Decide, based on your use case, how declarative or imperative you want your workflows to be. Write your business logic in any language from the integrated Visual Studio Code editor IDE, and orchestrate it declaratively in minutes."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Lan"
                        title="Scalable event-driven multitenant architecture"
                        description="Kestra's architecture is built on top of proven and time-tested technologies, including Postgres, Kafka and Elasticsearch, to enable scheduled and event-driven workflow patterns at any scale with tenant-level isolation."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="Hubspot"
                        title="Run anywhere, code in any language"
                        description="Integrate with any cloud, programming language, source system, database or data tool, and build your own plugins and blueprints to eliminate boilerplate code and automate repetitive tasks."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="LightningBolt"
                        title="Fast development cycles, simple deployment patterns"
                    >
                        <template v-slot:descriptionHtml>
                            Create flows in a simple <NuxtLink href="/features/declarative-data-orchestration">declarative YAML config</NuxtLink> directly from the UI with autocompletion, syntax validation and built-in documentation. Or use our official VS Code extension to integrate your workflows with Git and CI/CD systems.
                        </template>
                    </Card>
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="RefreshAuto"
                        title="API-first design with a rich plugin ecosystem"
                        description="Because every action in Kestra is API-driven, there are no limits to what you can automate, from changing flow and task configuration using internal tools to triggering, adding, or modifying workflows in any way you can imagine."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="ImageFilterDrama"
                        title="Deploy anywhere with no single point of failure"
                        description="Scale your data platform from a few executions to millions without hassle. You can deploy Kestra on-prem and cloud using Docker, our official Helm chart, Terraform provider, or a manual installation using a single binary file."
                    />
                </div>
            </div>

            <div class="text-center">
                <NuxtLink class="btn btn-animated btn-purple-animated " href="/features" data-aos="zoom-in">See all features</NuxtLink>
            </div>
        </Section>
    </div>
    <svg width="0" height="0">
        <defs>
            <linearGradient id="featureiconsgradient" x1="4.99595" y1="6.83411" x2="31.2214" y2="33.0161" gradientUnits="userSpaceOnUse">
                <stop offset="0.015625" stop-color="#F2D5FF"/>
                <stop offset="1" stop-color="#CB5AFF"/>
            </linearGradient>
        </defs>
    </svg>
</template>

<script setup>
    import LightningBolt from "vue-material-design-icons/LightningBolt.vue"
    import Lan from "vue-material-design-icons/Lan.vue"
    import ImageFilterDrama from "vue-material-design-icons/ImageFilterDrama.vue"
    import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue"
    import Hubspot from "vue-material-design-icons/Hubspot.vue"
    import CalculatorVariant from "vue-material-design-icons/CalculatorVariant.vue"
</script>

<script>
    import Section from '../layout/Section.vue';
    import Card from '../card/Card.vue';

    export default {
        components: {Section, Card}
    }
</script>

<style lang="scss">
    @import "../../assets/styles/variable";
    .features {
        background: url("/landing/features/bg.svg") no-repeat center;
        background-size: 100% 100%;
        section {
            border-bottom: $container-border;
            padding-top: 0;

            .subtitle {
                max-width: 576px;
            }
        }
    }
</style>
