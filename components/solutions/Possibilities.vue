<template>
    <div class="container">
        <Section
            title="Explore the diverse uses of Kestra as a complete orchestration platform."
            subtitle="Uncover Kestra's Versatility"
            baseline="From automating data pipelines to accelerating machine learning model deployment, Kestra streamlines complex workflows across a wide range of industries and domains. Dive into the wide array of use cases Kestra efficiently addresses."
        >

            <div class="row">
                <div class="col-md-4" data-aos="zoom-in">
                    <div class="number"><span>0</span>1</div>
                    <div class="title">Automate Your Data Pipelines</div>
                    <div>
                        Say goodbye to delays in your pipeline as Kestra initiates workflows based on specific times or events, such as data arrivals or file uploads.
                    </div>
                </div>
                <div class="col-md-4" data-aos="zoom-in">
                    <div class="number"><span>0</span>2</div>
                    <div class="title">Accelerate Machine Learning Model Deployment</div>
                    <div>
                        Efficiently manage and deploy your machine learning models at scale with Kestra's microservice orchestration capabilities.
                    </div>
                </div>
                <div class="col-md-4" data-aos="zoom-in">
                    <div class="number"><span>0</span>3</div>
                    <div class="title">Optimize ETL Processes</div>
                    <div>
                        Seamlessly move data between systems, prepare and clean it, and aggregate it into a consolidated data mart.
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4" data-aos="zoom-in">
                    <div class="number"><span>0</span>4</div>
                    <div class="title">Scale Workload Management</div>
                    <div>
                        Kestra takes care of scaling and processing the workload, reducing the burden on your application server.
                    </div>
                </div>
                <div class="col-md-4" data-aos="zoom-in">
                    <div class="number"><span>0</span>5</div>
                    <div class="title">Real-time Data Processing with Change Data Capture</div>
                    <div>
                        Automatically detect changes in data sources and trigger workflows to process those changes.
                    </div>
                </div>
                <div class="col-md-4" data-aos="zoom-in">
                    <div class="number"><span>0</span>6</div>
                    <div class="title">Automated Reporting</div>
                    <div>
                        Configure Kestra to distribute reports via email or Slack, keeping your team informed.
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4" data-aos="zoom-in">
                    <div class="number"><span>0</span>7</div>
                    <div class="title">Efficient Data Scraping</div>
                    <div>
                        Easily collect data from various sources and integrate it into your workflows.
                    </div>
                </div>
                <div class="col-md-4" data-aos="zoom-in">
                    <div class="number"><span>0</span>8</div>
                    <div class="title">Infrastructure Orchestration</div>
                    <div>
                        Automate tasks such as provisioning, deployment, and monitoring, ensuring a smooth operation across your organization.
                    </div>
                </div>
                <div class="col-md-4" data-aos="zoom-in">
                    <div class="number"><span>0</span>9</div>
                    <div class="title">End-to-End Data Orchestration</div>
                    <div>
                        Kestra empowers you to orchestrate data from ingestion to reporting, allowing you to manage the entire data lifecycle.
                    </div>
                </div>
            </div>
        </Section>

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
        @include media-breakpoint-up(md) {
            margin-bottom: 1rem;
        }

        .col-md-4 {
            padding-right: $spacer;
            @include media-breakpoint-down(md) {
                margin-bottom: 2rem;
            }
        }

        .number {
            font-size: 5rem;
            color: $primary;
            font-weight: 100;
            display: inline-block;
            border-bottom: 2px solid $primary;
            line-height: 5rem;
            margin-bottom: 2rem;

            span {
                color: $secondary;
            }
        }

        .title {
            font-weight: bold;
            font-size: large;
            color: $purple-1;
            margin-bottom: 0.5rem;
        }
    }
</style>
