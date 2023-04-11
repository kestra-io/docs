<template>
    <div class="container">
        <Section
            title="Discover the endless possibilities of Kestra as a versatile data orchestration platform."
            subtitle="Uncover Kestra's Versatility"
        >
            <div class="container text-center">
                <p>
                    From automating data pipelines to accelerating machine learning model deployment, Kestra streamlines complex workflows across a wide range of industries and domains. Explore our use cases to learn how Kestra can revolutionize your data management processes, drive efficiency, and unlock new business opportunities.
                </p>
            </div>
        </Section>

        <div class="row">
            <div class="col-md-4">
                <div class="number">01</div>
                <div class="title">Automate Your Data Pipelines</div>
                <div>
                    Say goodbye to delays in your pipeline as Kestra initiates workflows based on specific times or events, such as data arrivals or file uploads.
                </div>
            </div>
            <div class="col-md-4">
                <div class="number">02</div>
                <div class="title">Accelerate Machine Learning Model Deployment</div>
                <div>
                    Efficiently manage and deploy your machine learning models at scale with Kestra's microservice orchestration capabilities.
                </div>
            </div>
            <div class="col-md-4">
                <div class="number">03</div>
                <div class="title">Optimize ETL Processes</div>
                <div>
                    Seamlessly move data between systems, prepare and clean it, and aggregate it into a consolidated data mart.
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="number">04</div>
                <div class="title">Scale Workload Management</div>
                <div>
                    Kestra takes care of scaling and processing the workload, reducing the burden on your application server.
                </div>
            </div>
            <div class="col-md-4">
                <div class="number">05</div>
                <div class="title">Real-time Data Processing with Change Data Capture</div>
                <div>
                    Automatically detect changes in data sources and trigger workflows to process those changes.
                </div>
            </div>
            <div class="col-md-4">
                <div class="number">06</div>
                <div class="title">Automated Reporting</div>
                <div>
                    Configure Kestra to distribute reports via email or Slack, keeping your team informed.
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="number">07</div>
                <div class="title">Efficient Data Scraping</div>
                <div>
                    Easily collect data from various sources and integrate it into your workflows.
                </div>
            </div>
            <div class="col-md-4">
                <div class="number">08</div>
                <div class="title">Infrastructure Orchestration</div>
                <div>
                    Automate tasks such as provisioning, deployment, and monitoring, ensuring a smooth operation across your organization.
                </div>
            </div>
            <div class="col-md-4">
                <div class="number">09</div>
                <div class="title">End-to-End Data Orchestration</div>
                <div>
                    Kestra empowers you to orchestrate data from ingestion to reporting, allowing you to manage the entire data lifecycle.
                </div>
            </div>
        </div>
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

    .main {
        background: $purple-7;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
    }

    .container .row {
        padding-bottom: $spacer;

        .col-md-4 {
            padding-right: $spacer;
        }

        .number {
            font-size: 3.5rem;
            color: $primary;
            text-decoration: underline;
        }

        .title {
            font-weight: bold;
            font-size: large;
            color: #382369;
        }
    }
</style>