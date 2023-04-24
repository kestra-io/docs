<template>
    <div class="container">
        <Section subtitle="Accelerate Development and Deployment" title="Build Faster, Ship Better">
            <div class="row card-group card-centered mb-2">
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><CloudArrowUpOutline /></span>
                            <h4 class="card-title">CI/CD Deployment</h4>
                            <p class="card-text">Integrate Kestra into CI/CD pipelines to automate the deployment of workflows (Terraform, GitLab Actions, GitLab, Jenkins…).</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><ViewDashboardVariantOutline /></span>
                            <h4 class="card-title">Production made easy, no more production plan</h4>
                            <p class="card-text">Kestra supports flow dependencies to define the execution order based on their interdependence.</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><CalendarStartOutline /></span>
                            <h4 class="card-title">Event-Based</h4>
                            <p class="card-text">Flow execution based on events from the core or plugins, such as the result of other flows in real-time, detection of files from SFTP or Google Cloud Storage, or results of an SQL query.</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><ClockStart /></span>
                            <h4 class="card-title">Infinity of triggers</h4>
                            <p class="card-text">Endless possibilities to start a flow through API, using a webhook, waiting for a trigger, or simply starting directly from the Web UI.</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><MonitorDashboard /></span>
                            <h4 class="card-title">Monitoring</h4>
                            <p class="card-text">Dashboards and metrics directly in the User Interface.</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><RefreshAuto /></span>
                            <h4 class="card-title">Error Handling</h4>
                            <p class="card-text">Handle errors automatically and retry failed tasks.</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><BellOutline /></span>
                            <h4 class="card-title">Notifications</h4>
                            <p class="card-text">Alerting configuration directly in the UI to alert when workflow tasks are completed, have errors or delays, or for any other important event.</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><CalculatorVariantOutline /></span>
                            <h4 class="card-title">Large Data Processing</h4>
                            <p class="card-text">Massive data volume handling with high performance using partitioning and batch processing techniques.</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><ViewStreamOutline /></span>
                            <h4 class="card-title">Micro-Batch for Real-Time</h4>
                            <p class="card-text">All the benefits of a real-time system without maintenance and complexity costs by collecting data at regular intervals and processing them in micro-batch.</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><CloudOutline /></span>
                            <h4 class="card-title">No single point of failure</h4>
                            <p class="card-text">Horizontal and vertical scaling without worrying about resource allocation.</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                            <span class="card-icon"><OneUp /></span>
                            <h4 class="card-title">Performance Gains</h4>
                            <p class="card-text">Better performance with JVM (Java Virtual Machine) technology.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import CloudArrowUpOutline from "vue-material-design-icons/CloudArrowUpOutline.vue"
    import ViewDashboardVariantOutline from "vue-material-design-icons/ViewDashboardVariantOutline.vue"
    import CalendarStartOutline from "vue-material-design-icons/CalendarStartOutline.vue"
    import ClockStart from "vue-material-design-icons/ClockStart.vue"
    import MonitorDashboard from "vue-material-design-icons/MonitorDashboard.vue"
    import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue"
    import BellOutline from "vue-material-design-icons/BellOutline.vue"
    import CalculatorVariantOutline from "vue-material-design-icons/CalculatorVariantOutline.vue"
    import ViewStreamOutline from "vue-material-design-icons/ViewStreamOutline.vue"
    import CloudOutline from "vue-material-design-icons/CloudOutline.vue"
    import OneUp from "vue-material-design-icons/OneUp.vue"
</script>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>
