<template>
    <div class="container">
        <Section subtitle="Seamless Workflow Design and Management" title="Create your Flows, Avoid the Headache">
            <div class="row card-group card-centered mb-2">
                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><LightbulbOutline /></span>
                            <h5 class="card-title">Simplicity</h5>
                            <p class="card-text">Easily create, configure, and modify flows with Kestra's YAML format and user interface</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><HelpBoxOutline /></span>
                            <h5 class="card-title">Helpful</h5>
                            <p class="card-text">Error spotting directly in the editor before any runtime error</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><Translate /></span>
                            <h5 class="card-title">Allow other programming languages</h5>
                            <p class="card-text">Run any scripting language like Python, Bash, and Node.js using Kestra</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><CodeBracesBox /></span>
                            <h5 class="card-title">Use workflows as code</h5>
                            <p class="card-text">Deploy workflows like software code for easier collaboration and tracking of changes.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><CalculatorVariantOutline /></span>
                            <h5 class="card-title">File processing capabilities</h5>
                            <p class="card-text">Files processing including CSV and JSON</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><FileMultiple /></span>
                            <h5 class="card-title">Versioning</h5>
                            <p class="card-text">Version workflows, tasks and data, rollback and execute a previous version track changes over time</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><ContentCopy /></span>
                            <h5 class="card-title">Reusability</h5>
                            <p class="card-text">Define generic tasks and workflows that can be used in different contexts</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><CheckAll /></span>
                            <h5 class="card-title">Data validation</h5>
                            <p class="card-text">Ensures incoming and outgoing data in the pipeline steps comply with schema and quality constraints</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><OpenInApp /></span>
                            <h5 class="card-title">UI testing</h5>
                            <p class="card-text">Execution testing directly in the interface for fast Q&A before deployment</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><ShieldBugOutline /></span>
                            <h5 class="card-title">Debugging</h5>
                            <p class="card-text">Advanced debugging tools directly in the flow editing interface for faster identification and troubleshooting</p>
                        </div>
                    </div>
                </div>


                <div class="col-md-3 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <span class="card-icon"><CloudArrowUpOutline /></span>
                            <h5 class="card-title">No more deployment complexity</h5>
                            <p class="card-text">No need to create a dev environment to package and deploy an application, just work on the browser and use CI/CD</p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import LightbulbOutline from "vue-material-design-icons/LightbulbOutline.vue"
    import HelpBoxOutline from "vue-material-design-icons/HelpBoxOutline.vue"
    import Translate from "vue-material-design-icons/Translate.vue"
    import CodeBracesBox from "vue-material-design-icons/CodeBracesBox.vue"
    import CalculatorVariantOutline from "vue-material-design-icons/CalculatorVariantOutline.vue"
    import FileMultiple from "vue-material-design-icons/FileMultiple.vue"
    import ContentCopy from "vue-material-design-icons/ContentCopy.vue"
    import CheckAll from "vue-material-design-icons/CheckAll.vue"
    import OpenInApp from "vue-material-design-icons/OpenInApp.vue"
    import ShieldBugOutline from "vue-material-design-icons/ShieldBugOutline.vue"
    import CloudArrowUpOutline from "vue-material-design-icons/CloudArrowUpOutline.vue"
</script>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>
