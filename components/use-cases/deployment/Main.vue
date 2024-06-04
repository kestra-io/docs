<template>
    <div class="container-fluid">
        <LayoutDetailMainContent
            subtitle="Provisioning and Deployment"
            subtitleBefore="Simplify"
            baseline="Kestra's automation capabilities and extensive integrations empower platform engineers to manage infrastructure provisioning and deployment more efficiently."
            :items="mainContent"
        />
    </div>
</template>

<script>
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section},
        data() {
            return {
                mainContent: [
                    {
                        title: 'Infrastructure as Code',
                        img: '/landing/usecases/provisioning-and-deployment/infrastructure-code.svg',
                        imgAlt: 'Infrastructure as Code',
                        imgWidth: '568px',
                        imgHeight: '420px',
                        description: 'Kestra integrates with Terraform and Ansible, enabling platform engineers to define and manage infrastructure as code. This approach ensures that infrastructure setups are consistent, repeatable, and error-free. ',
                        content: `
                            <ul>
                                <li>
                                    Automated Infrastructure Setup:
                                    <span>
                                        Use Terraform scripts and Ansible playbooks to automate the provisioning of servers, databases, and network resources.
                                    </span>
                                </li>
                                <li>
                                    Event-Driven Provisioning:
                                    <span>
                                       Trigger provisioning workflows based on specific events such as code commits or system alerts, ensuring timely and automated responses.
                                    </span>
                                </li>
                            </ul>
                        `
                    },
                    {
                        title: 'Containerized Deployments with Docker and Kubernetes',
                        img: '/landing/usecases/provisioning-and-deployment/docker-kubernetes.svg',
                        imgAlt: 'Docker and Kubernetes',
                        imgWidth: '568px',
                        imgHeight: '420px',
                        description: 'Kestra seamlessly integrates with Docker and Kubernetes, simplifying the deployment of containerized applications. This ensures that deployments are efficient, scalable, and reliable.',
                        content: `
                            <ul>
                                <li>
                                    Orchestrate Containers:
                                    <span>
                                       Use Docker for packaging applications and Kubernetes for orchestrating containerized workloads, ensuring smooth and scalable deployments.
                                    </span>
                                </li>
                                <li>
                                    Real-time Monitoring:
                                    <span>
                                        Implement real-time monitoring to track the status of your deployments and quickly address any issues.
                                    </span>
                                </li>
                            </ul>
                        `
                    },
                    {
                        title: 'Configuration Management and Compliance',
                        img: '/landing/usecases/provisioning-and-deployment/management-compliance.svg',
                        imgAlt: 'Configuration Management and Compliance',
                        imgWidth: '604px',
                        imgHeight: '477px',
                        description: 'Maintain consistent configurations across all environments. Automate compliance checks and security audits as part of your deployment workflows.',
                        content: `
                            <ul>
                                <li>
                                    Version Control:
                                    <span>
                                       Manage and version your infrastructure configurations using Git, ensuring a clear history of changes and the ability to roll back if necessary.
                                    </span>
                                </li>
                                <li>
                                   Compliance Automation:
                                    <span>
                                         Ensure your infrastructure meets industry standards with automated compliance checks and security audits.
                                    </span>
                                </li>
                            </ul>
                        `
                    },
                ],
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";
    .container-fluid {
        background-color: $black-4;
    }
    :deep(section) {
        div.subtitle {
            @include media-breakpoint-up(lg) {
                max-width: 65%;
            }
        }
    }

    :deep(.main) {
        div.row  {
            border-bottom: 1px solid #FFFFFF1A;
        }

        div.row:last-child {
            border: none;
        }
    }
</style>
