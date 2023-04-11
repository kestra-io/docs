<template>
    <div class="container">
        <Section
            title="Prompt shipping"
            subtitle="FEATURES"
            baseline="Save on time, stress, and development costs."
        >

            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <CloudUploadOutline />
                                </span>
                            <h5 class="card-title">
                                Deploy and Run Anywhere
                            </h5>
                            <p class="card-text">From on-premise installlations to cloud-based services, containers to clusters, Kestra can be deployed anywhere.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <GoogleCirclesExtended />
                                </span>
                            <h5 class="card-title">Seamless Integrations</h5>
                            <p class="card-text">Connect to various data sources and cloud services like AWS, GCP, and Microsoft Azure</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <AutoUpload />
                                </span>
                            <h5 class="card-title">Scale to Millions Executions</h5>
                            <p class="card-text">Kestra has been built with leading cloud-native technologies and a strong architecture, enabling scaling to millions of executions without hassle.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
    import CloudUploadOutline from "vue-material-design-icons/CloudUploadOutline.vue";
    import GoogleCirclesExtended from "vue-material-design-icons/GoogleCirclesExtended.vue";
    import AutoUpload from "vue-material-design-icons/AutoUpload.vue";
    export default {
        components: {Section, CloudUploadOutline, AutoUpload, GoogleCirclesExtended}
    }
</script>
