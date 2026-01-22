<template>
    <div class="container">
        <Section class="about">
            <h2>Orchestration <span>Simplified</span></h2>
            <p>
                From automating data pipelines to accelerating machine learning model deployment,
                Kestra streamlines complex workflows across a wide range of industries and domains.
            </p>

            <div class="row">
                <div class="col-md-4" data-usal="zoomin">
                    <Card
                        title="Data Pipelines"
                        description="Say goodbye to delays in your pipeline as Kestra initiates workflows based on specific times or events, such as data arrivals or file uploads."
                        number="01"
                    />
                </div>
                <div class="col-md-4" data-usal="zoomin">
                    <Card
                        title="Machine Learning Model Deployment"
                        description="Efficiently manage and deploy your machine learning models at scale with Kestra's microservice orchestration capabilities."
                        number="02"
                    />
                </div>
                <div class="col-md-4" data-usal="zoomin">
                    <Card
                        title="ETL Processes"
                        description="Seamlessly move data between systems, prepare and clean it, and aggregate it into a consolidated data mart."
                        number="03"
                    />
                </div>
            </div>

            <div class="row">
                <div class="col-md-4" data-usal="zoomin">
                    <Card
                        title="Event-Driven Automation at Scale"
                        description="React to events happening in your business and automate your critical microservices and operations."
                        number="04"
                    />
                </div>
                <div class="col-md-4" data-usal="zoomin">
                    <Card
                        title="Real-Time Data Processing with Change Data Capture"
                        description="Automatically detect changes in data sources and trigger workflows to process those changes."
                        number="05"
                    />
                </div>
                <div class="col-md-4" data-usal="zoomin">
                    <Card
                        title="Automated Reporting"
                        description="Configure Kestra to distribute reports via email or Slack, keeping your team informed."
                        number="06"
                    />
                </div>
            </div>

            <div class="row">
                <div class="col-md-4" data-usal="zoomin">
                    <Card
                        title="Data Ingestion and Integration"
                        description="Easily collect data from various sources and integrate them into your workflows."
                        number="07"
                    />
                </div>
                <div class="col-md-4" data-usal="zoomin">
                    <Card
                        title="Infrastructure Orchestration"
                        description="Automate tasks such as provisioning, deployment, and monitoring of infrastructure resources."
                        number="08"
                    />
                </div>
                <div class="col-md-4" data-usal="zoomin">
                    <Card
                        title="End-to-End Data Orchestration"
                        description="Kestra empowers you to manage the entire data lifecycle from ingestion to reporting and automation."
                        number="09"
                    />
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup lang="ts">
    import Section from "~/components/layout/Section.vue"
    import Card from "~/components/card/Card.vue"
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    section.about {
        padding: 2rem 0;

        h2 {
            color: $white;
            font-weight: 300;
            margin: 0 auto;
            text-align: center;
            margin-bottom: $spacer;

            span {
                background: linear-gradient(90deg, #e151f7 18.28%, #5c47f5 35.74%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        p {
            color: $white;
            text-align: center;
            font-size: $h6-font-size;
            max-width: $baseline-max-width;
            margin: 0 auto 4rem;
            font-weight: 300;
        }
    }
    .main {
        background: $purple-7;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
    }

    .container {
        background: url("/landing/possibilities/bg.svg") no-repeat 24% 30%;
        .row {
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

            .title {
                font-weight: bold;
                font-size: large;
                color: $purple-1;
                margin-bottom: 0.5rem;
            }
        }
    }
</style>