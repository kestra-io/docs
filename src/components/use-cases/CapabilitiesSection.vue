<template>
    <div ref="container" class="container-fluid bg-dark-4 pt-3">
        <div class="container">
            <div class="mb-5 language-agnostic">
                <h2 class="title">
                    <span>Kestra's Capabilities</span><br />
                    {{ title }}
                </h2>
                <div class="row d-flex">
                    <div
                        class="col-12 col-md-6 col-lg-4 mb-4"
                        v-for="(item, index) in selected"
                        v-bind:key="index"
                    >
                        <a class="page-item" :href="item.pageHref">
                            <img :src="item.imageSource" :alt="item.imageAlt" />
                            <p class="card-title">{{ item.title }}</p>
                            <p class="card-description">
                                {{ item.description }}
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"

    const props = defineProps({
        title: {
            type: String,
            required: true,
        },
        sections: {
            type: Array,
            required: true,
        },
    })

    const list = [
        {
            title: "Change data capture",
            description:
                "Streamline Complex Data Pipelines and Automate Repetitive Tasks for Enhanced Efficiency",
            imageSource: "/landing/usecases/data-engineers/data-capture.svg",
            imageAlt: "Change data capture",
            pageHref: "/use-cases/change-data-capture",
        },
        {
            title: "Modern Data Stack Integration",
            description: "Integrate leading data tools from the Modern Data Stack with Kestra",
            imageSource: "/landing/usecases/data-engineers/data-stack.svg",
            imageAlt: "Data Stack",
            pageHref: "/use-cases/modern-data-stack",
        },
        {
            title: "CI/CD for your Kestra Workflows",
            description:
                "Embrace software engineering practices for versioning, deploying, and maintaining data workflows",
            imageSource: "/landing/usecases/data-engineers/ci-cd.svg",
            imageAlt: "CI/CD",
            pageHref: "/use-cases/ci-cd",
        },
        {
            title: "Microservice Management",
            description:
                "Simplify the orchestration of microservices, ensuring efficient communication and coordination.",
            imageSource: "/landing/usecases/databases/microservice-management.svg",
            imageAlt: "Microservice Management",
            pageHref: "/use-cases/microservices-orchestration",
        },
        {
            title: "API Orchestration",
            description:
                "Manage and automate API deployments, scaling, and monitoring to ensure high availability and performance.",
            imageSource: "/landing/usecases/microservices-orchestration/api-orchestration.svg",
            imageAlt: "API Orchestration",
            pageHref: "/use-cases/provisioning-and-deployment",
        },
        {
            title: "Continuous Integration/Continuous Deployment (CI/CD)",
            description:
                "Streamline your CI/CD pipelines by integrating with tools like GitHub Actions and Jenkins.",
            imageSource: "/landing/usecases/platform-engineers/continuous-integration.svg",
            imageAlt: "Integration/Continuous",
            pageHref: "/use-cases/ci-cd",
        },
        {
            title: "Provisioning and Deployment",
            description:
                "Automate the setup and deployment of infrastructure components, reducing manual effort and errors.",
            imageSource: "/landing/usecases/monitoring/provisioning-deployment.svg",
            imageAlt: "Provisioning",
            pageHref: "/use-cases/provisioning-and-deployment",
        },
        {
            title: "Infrastructure Monitoring",
            description:
                "Automate monitoring and alerting processes, ensuring your infrastructure is always performing optimally.",
            imageSource:
                "/landing/usecases/provisioning-and-deployment/infrastructure-monitoring.svg",
            imageAlt: "Monitoring",
            pageHref: "/use-cases/monitoring",
        },
        {
            title: "Database Management",
            description:
                "Orchestrate database migrations, backups, and restorations seamlessly within your development pipeline.",
            imageSource: "/landing/usecases/microservices-orchestration/database-management.svg",
            imageAlt: "Database Management",
            pageHref: "/use-cases/databases-management",
        },
        {
            title: "Disaster Recovery",
            description:
                "Automate backup and recovery processes to ensure your infrastructure can quickly recover from failures.",
            imageSource: "/landing/usecases/monitoring/disaster-recovery.svg",
            imageAlt: "Compliance Audits",
            pageHref: "/use-cases/disaster-recovery",
        },
    ]

    const selected = computed(() => {
        return list.filter((r) => props.sections?.includes(r.title))
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        color: var(--bs-white);

        .container {
            padding-top: 4rem;
            padding-bottom: 4rem;
            border-top: 1px solid #252526;
        }

        .title {
            margin: 0;
            color: var(--bs-white);
            text-align: center;
            font-family: $font-family-sans-serif;
            font-size: calc($font-size-base * 3.125);
            font-style: normal;
            font-weight: 400;
            line-height: 4rem;
            @include media-breakpoint-down(md) {
                font-size: 1.875rem;
                line-height: unset;
            }

            @include media-breakpoint-down(lg) {
                padding: 0;
            }

            span {
                background: linear-gradient(91deg, #e151f7 43.87%, #5c47f5 55.51%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .language-agnostic {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .page-item {
            display: flex;
            flex-direction: column;
            gap: calc($spacer * 0.5);

            .card-title {
                font-size: $font-size-lg;
                font-weight: 700;
                line-height: calc($font-size-base * 1.625);
                margin: 0;
                color: $white;
            }

            .card-description {
                font-size: $font-size-base;
                font-weight: 400;
                line-height: $font-size-xl;
                margin: 0;
                color: $white-1;
            }
        }
    }
</style>