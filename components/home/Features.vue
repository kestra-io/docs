<template>
    <div class="container">
        <Section subtitle="Stand Out with Kestra's Exclusive Features" title="Enhanced Workflow Efficiency">
            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg" data-aos="fade-zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><CalculatorVariantOutline /></span>
                            <h5 class="card-title">Powerful Data Processing</h5>
                            <p class="card-text">Execute complex data processing without the need for extensive coding skills</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><Lan /></span>
                            <h5 class="card-title">Robust Scheduling and Orchestration</h5>
                            <p class="card-text">Manage data workflows with flexible scheduling options and orchestrate all types of workflows</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><GoogleCirclesExtended /></span>
                            <h5 class="card-title">Extensive Library of plugins</h5>
                            <p class="card-text">Integrate with various systems and services from 3rd party sources or build your own plugins</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><OpenInApp /></span>
                            <h5 class="card-title">Increase Productivity and Efficiency</h5>
                            <p class="card-text">Create and manage your workflows using in low code or write them in YAML</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><RefreshAuto /></span>
                            <h5 class="card-title">Reliable Automated Production</h5>
                            <p class="card-text">Eliminate bottlenecks with Kestra's reliable and automated workflows</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><CloudOutline /></span>
                            <h5 class="card-title">Deploy anywhere with no point of failure</h5>
                            <p class="card-text">From only a few executions to millions, without hassle, in the cloud or on-premise</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center">
                <a class="btn btn-lg btn-primary " href="/features">See all features</a>
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
