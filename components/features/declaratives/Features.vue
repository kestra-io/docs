<template>
    <div class="container-fluid hide-overflow">
        <div class="container pt-5 pb-5">
            <div class="row ">
                <div class="col-md-6 d-flex flex-column justify-content-center">
                    <h2 data-aos="fade-left">Simple Yet Powerful</h2>
                    <p data-aos="fade-right">
                        Kestra's declarative data orchestrator simplifies data orchestration by using YAML (Yet Another Markup Language) to define workflows.
                        This approach simplifies the creation, execution, and maintenance of data pipelines, making them accessible to both technical and non-technical team members.
                    </p>
                </div>
                <div class="col-md-6">
                    <div class="code rounded-3">
                        <span class="text-success">id:</span> "each_parallel"<br />
                        <span class="text-success">type:</span> io.kestra.core.tasks.flows.EachParallel<br />
                        <span class="text-success">value:</span><br />
                        <span class="text-success">  -</span> value 1<br />
                        <span class="text-success">  -</span> value 2<br />
                        <span class="text-success">  -</span> value 3<br />
                        <span class="text-success">tasks:</span><br />
                        <span class="text-success">  id:</span> each-value<br />
                        <span class="text-success">  type:</span> io.kestra.core.tasks.debugs.Return<br />
                        <span class="text-success">  format:</span> <span v-pre>"{{ taskrun.value }}"</span>
                    </div>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col-12">
                    <div class="row card-group card-centered no-shadow mb-2">
                        <div class="col-md-4 mb-4">
                            <div class="card" data-aos="zoom-in">
                                <div class="card-body">
                                    <span class="card-icon"><CalculatorVariantOutline /></span>
                                    <h4 class="card-title">Improved Workflow Flexibility</h4>
                                    <p class="card-text">Easily adapt workflows by updating YAML; Kestra adjusts execution automatically.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 mb-4">
                            <div class="card" data-aos="zoom-in">
                                <div class="card-body">
                                    <span class="card-icon"><Lan /></span>
                                    <h4 class="card-title">Reduced Complexity</h4>
                                    <p class="card-text">Simplifies data pipelines by eliminating intricate code, enhancing maintainability.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 mb-4">
                            <div class="card" data-aos="zoom-in">
                                <div class="card-body">
                                    <span class="card-icon"><GoogleCirclesExtended /></span>
                                    <h4 class="card-title">Enhanced Collaboration</h4>
                                    <p class="card-text">Easy-to-read workflows for both technical and non-technical team members.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="text-center">
                        <a href="https://demo.kestra.io?auto" target="_blank" class="btn btn-lg btn-primary" data-aos="zoom-in">Live demo</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
    import Lan from "vue-material-design-icons/Lan.vue"
    import GoogleCirclesExtended from "vue-material-design-icons/GoogleCirclesExtended.vue"
    import CalculatorVariantOutline from "vue-material-design-icons/CalculatorVariantOutline.vue";
</script>

<script>
    import Section from '../../layout/Section.vue';


    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    .container-fluid {
        background-color: var(--bs-gray-200);
        position: relative;

        &:before {
            content: "";
            width: 100%;
            height: 100%;
            opacity: 0.3;
            position: absolute;
            top: 0;
            background: url("/landing/shadow3.svg") no-repeat bottom center;
        }
    }

    .code {
        position: relative;
        background: var(--bs-white);
        padding: 3rem 2rem 2rem 2rem;
        border: 1px solid var(--bs-gray-500);
        font-family: var(--bs-font-monospace);
        color: var(--bs-indigo);
        white-space: pre;

        .text-success {
            color: #2C3F3A !important;
        }

        &:before {
            content: "";
            position: absolute;
            background: url("/landing/3dot.svg") no-repeat top left;
            width: 55px;
            height: 13px;
            top: 1rem;
            left: 1rem;
        }
    }
</style>