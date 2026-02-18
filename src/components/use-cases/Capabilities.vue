<template>
    <div ref="container" class="container-fluid">
        <div class="container">
            <div class="mb-5 language-agnostic">
                <h2 class="title">
                    <span class="highlight">Kestra's Capabilities</span><br />
                    {{ title }}
                </h2>
                <div class="row d-flex">
                    <div
                        class="col-12 col-md-6 col-lg-4 mb-4"
                        v-for="(item, index) in filteredCapabilities"
                        v-bind:key="index"
                    >
                        <a class="page-item" :href="item.pageHref">
                            <img :src="item.imageSource" :alt="item.imageAlt" />
                            <h5 class="card-title">{{ item.title }}</h5>
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
        capabilities: {
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
        {
            title: "Orchestrate your Python Scripts",
            description:
                "Dive deeper to discover how Kestra optimizes Python script execution across diverse environments.",
            imageSource: "/landing/features/language/card-pages/python-card.svg",
            imageAlt: "Python Scripts",
            pageHref: "/features/code-in-any-language/python",
        },
        {
            title: "Orchestrate your R Scripts",
            description:
                "Discover Kestra's powerful orchestration capabilities for R scripts, simplifying complex data analytics.",
            imageSource: "/landing/features/language/card-pages/r-card.svg",
            imageAlt: "R Scripts",
            pageHref: "/features/code-in-any-language/r",
        },
        {
            title: "Orchestrate your Julia Scripts",
            description:
                "Learn about Kestra’s support for Julia, optimizing high-performance numerical analysis and computational projects.",
            imageSource: "/landing/features/language/card-pages/julia-card.svg",
            imageAlt: "Julia Scripts",
            pageHref: "/features/code-in-any-language/julia",
        },
    ]

    const filteredCapabilities = computed(() => {
        return list.filter((r) => props.capabilities?.includes(r.title))
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        color: $white;
        padding: calc($spacer * 3) 0;
        .title {
            margin: 0;
            color: var(--ks-content-primary);
            text-align: center;
            font-weight: 600;
        }
        .language-agnostic {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        .page-item {
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: calc($spacer * 0.5);
            background-color: var(--ks-background-tertiary);
            border-radius: $border-radius-lg;
            border: $block-border;
            padding: $spacer;
            transition: border-color 0.3s ease;
            .card-title {
                color: var(--ks-content-primary);
                margin-top: 0.5rem;
            }
            .card-description {
                margin: 0;
                color: var(--ks-content-tertiary);
            }
            &:hover {
                border-color: var(--ks-content-link);
            }
        }
    }
</style>