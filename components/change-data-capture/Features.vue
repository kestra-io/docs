<template>
    <div class="container">
        <Section
            title="Leveraging Kestra's Features"
            subtitle="Key Features"
            class="with-shadow"
        >
            <div class="row card-group card-centered no-shadow mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                                <span class="card-icon">
                                    <LightbulbOutline />
                                </span>
                            <h4 class="card-title">Efficient Data Capture</h4>
                            <p class="card-text">CDC allows you to track and capture data changes promptly, ensuring that your data pipelines remain current and provide you with accurate, actionable insights.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                                <span class="card-icon">
                                    <FolderTextOutline />
                                </span>
                            <h4 class="card-title">Seamless Integration with Data Sources</h4>
                            <p class="card-text">Integrates with various data sources, databases, and platforms, allowing you to track changes across your entire data ecosystem.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                                <span class="card-icon">
                                    <DeveloperBoard />
                                </span>
                            <h4 class="card-title">Scalable and Efficient Processing</h4>
                            <p class="card-text">Kestra is designed to handle high data volumes and can scale to meet your growing data needs.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                                <span class="card-icon">
                                    <LightningBolt />
                                </span>
                            <h4 class="card-title">Reduced Data Latency</h4>
                            <p class="card-text">Reduce data latency, ensuring that your data pipelines and analytics are always based on the latest information.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                                <span class="card-icon">
                                    <TimerOutline />
                                </span>
                            <h4 class="card-title">Data Versioning</h4>
                            <p class="card-text">Allow you to track and manage historical versions of your data for auditing, analysis, and compliance purposes.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="zoom-in">
                        <div class="card-body">
                                <span class="card-icon">
                                    <ImageMultiple />
                                </span>
                            <h4 class="card-title">Delayed Data Capture</h4>
                            <p class="card-text">Configure time delays for capturing data changes for handling time-sensitive data or for mitigating the impact of temporary data inconsistencies.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
    import LightbulbOutline from "vue-material-design-icons/LightbulbOutline.vue";
    import FolderTextOutline from "vue-material-design-icons/FolderTextOutline.vue";
    import DeveloperBoard from "vue-material-design-icons/DeveloperBoard.vue";
    import LightningBolt from "vue-material-design-icons/LightningBolt.vue";
    import TimerOutline from "vue-material-design-icons/LightningBolt.vue";
    import ImageMultiple from "vue-material-design-icons/ImageMultiple.vue";

    export default {
        components: {Section, LightbulbOutline, FolderTextOutline, DeveloperBoard, LightningBolt, TimerOutline, ImageMultiple}
    }
</script>
