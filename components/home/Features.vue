<template>
    <div class="container">
        <Section subtitle="Simplicity scales, complexity fails" title="Simple, Scalable and Fast Orchestration">
            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><CalculatorVariantOutline /></span>
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
                            <span class="card-icon"><GoogleCirclesExtended /></span>
                            <h4 class="card-title">Run anywhere, code in any language</h4>
                            <p class="card-text">Integrate with any cloud, programming language, source system, database or data tool, and build your own plugins and blueprints to eliminate boilerplate code and automate repetitive tasks.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><OpenInApp /></span>
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
                            <span class="card-icon"><CloudOutline /></span>
                            <h4 class="card-title">Deploy anywhere with no single point of failure</h4>
                            <p class="card-text">Scale your data platform from a few executions to millions without hassle. You can deploy Kestra on-prem and cloud using Docker, our official Helm chart, Terraform provider, or a manual installation using a single binary file.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center">
                <NuxtLink class="btn btn-primary " href="/features" data-aos="zoom-in">See all features</NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import OpenInApp from "vue-material-design-icons/OpenInApp.vue"
    import Lan from "vue-material-design-icons/Lan.vue"
    import CloudOutline from "vue-material-design-icons/CloudOutline.vue"
    import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue"
    import GoogleCirclesExtended from "vue-material-design-icons/GoogleCirclesExtended.vue"
    import CalculatorVariantOutline from "vue-material-design-icons/CalculatorVariantOutline.vue"
</script>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>
