<template>
    <div class="container features">
        <Section subtitle="Simplicity scales, complexity" subtitle-after="Fails">
            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><CalculatorVariant /></span>
                            <h4 class="card-title">Embedded Visual Studio Code editor IDE</h4>
                            <p class="card-text">Decide, based on your use case, how declarative or imperative you want your workflows to be. Write your business logic in any language from the integrated Visual Studio Code editor IDE, and orchestrate it declaratively in minutes.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><Lan /></span>
                            <h4 class="card-title">Scalable event-driven multitenant architecture</h4>
                            <p class="card-text">Kestra's architecture is built on top of proven and time-tested technologies, including Postgres, Kafka and Elasticsearch, to enable scheduled and event-driven workflow patterns at any scale with tenant-level isolation.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><Hubspot /></span>
                            <h4 class="card-title">Run anywhere, code in any language</h4>
                            <p class="card-text">Integrate with any cloud, programming language, source system, database or data tool, and build your own plugins and blueprints to eliminate boilerplate code and automate repetitive tasks.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><LightningBolt /></span>
                            <h4 class="card-title">Fast development cycles, simple deployment patterns</h4>
                            <p class="card-text">Create flows in a simple <NuxtLink href="/features/declarative-data-orchestration">declarative YAML config</NuxtLink> directly from the UI with autocompletion, syntax validation and built-in documentation. Or use our official VS Code extension to integrate your workflows with Git and CI/CD systems.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><RefreshAuto /></span>
                            <h4 class="card-title">API-first design with a rich plugin ecosystem</h4>
                            <p class="card-text">Because every action in Kestra is API-driven, there are no limits to what you can automate, from changing flow and task configuration using internal tools to triggering, adding, or modifying workflows in any way you can imagine.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><ImageFilterDrama /></span>
                            <h4 class="card-title">Deploy anywhere with no single point of failure</h4>
                            <p class="card-text">Scale your data platform from a few executions to millions without hassle. You can deploy Kestra on-prem and cloud using Docker, our official Helm chart, Terraform provider, or a manual installation using a single binary file.</p>
                        </div>
                    </div>
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

    export default {
        components: {Section}
    }
</script>

<style lang="scss">
    @import "../../assets/styles/variable";
    .features {
        section {
            border-bottom: 1px solid rgba(255, 255, 255, 0.10);
            padding-top: 0;
        }
        .card {
            border-radius: 8px;
            border: 1px solid $black-3;
            background: $black-2;
            color: $white;
            padding: 64px 32px;

            .card-icon {
                float: none;
                border-radius: 8px;
                border: 1px solid #B010FB;
                background: $black-4;

                .material-design-icon {
                    filter: drop-shadow(2px 4px 4px rgba(186, 53, 249, 0.25));

                    svg path {
                        fill: url(#featureiconsgradient);
                    }
                }
            }
        }
    }
</style>
