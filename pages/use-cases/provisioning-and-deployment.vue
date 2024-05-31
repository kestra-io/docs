<template>
    <div>
        <Head>
          <Title>Simplify Provisioning and Deployment with Kestra</Title>
          <Meta name="description" content="Automate the setup and deployment of infrastructure components, reducing manual effort and errors." />
        </Head>

        <UseCasesEngineersHeader
            titleHtml="Provisioning <br> and Deployment"
            description="Automate, Scale, Provision and Optimize Your Infrastructure with Kestra"
            imageSrc="/landing/usecases/provisioning-and-deployment/header-hero.svg"
            imageAlt="Provisioning and Deployment"
            darkButtonText="Talk to Us"
            dakButtonHref="docs/getting-started"
        />
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersMain
                subtitle="Provisioning and Deployment"
                subtitleBefore="Simplify"
                baseline="Kestra's automation capabilities and extensive integrations empower platform engineers to manage infrastructure provisioning and deployment more efficiently."
                :mainContent="mainContent"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersEnterpriseEdition/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesDeploymentChallenges
                :titleHtml="challengesTitle"
                :cardsData="cardsData"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersDataOrchestration
                title="for Platform Orchestration"
                :dataOrchestration="dataOrchestration"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Ready to take your Infrastructure to the next level ?"
                purpleButtonText="Get Started"
                purpleButtonHref="https://github.com/kestra-io/kestra"
                darkButtonText="Talk to Us"
                darkButtonHref="/demo"
            />
        </NuxtLazyHydrate>
    </div>
</template>

<script>
    import Cogs from "vue-material-design-icons/Cogs.vue";
    import AlertCircle from "vue-material-design-icons/AlertCircle.vue";
    import TimerCogOutline from "vue-material-design-icons/TimerCogOutline.vue";
    import ChartAreaspline from "vue-material-design-icons/ChartAreaspline.vue";
    import CloudRefreshVariant from "vue-material-design-icons/CloudRefreshVariant.vue";
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section},
        data() {
            return {
              challengesTitle: `<span>Key Benefits</span> of Using Kestra for<br/> Provisioning and Deployment`,
              cardsData: [
                {
                  icon: Cogs,
                  cardInfo: {
                    title: 'Reduce Manual Effort',
                    description: 'Automate repetitive tasks, allowing your team to focus on strategic initiatives.'
                  },
                },
                {
                  icon: AlertCircle,
                  cardInfo: {
                    title: 'Minimize Errors',
                    description: 'Automation ensures consistency and accuracy, reducing the likelihood of human errors.'
                  },
                },
                {
                  icon: TimerCogOutline,
                  cardInfo: {
                    title: 'Increase Efficiency',
                    description: 'Ensure infrastructure components are provisioned in a standardized manner.'
                  },
                },
                {
                  icon: ChartAreaspline,
                  cardInfo: {
                    title: 'Scalability',
                    description: 'Easily scale your infrastructure to meet growing demands without compromising performance or reliability.'
                  },
                },
                {
                  icon: CloudRefreshVariant,
                  cardInfo: {
                    title: 'Consistency',
                    description: 'Ensure uniform deployment across all environments, from development to production.'
                  },
                },
              ],
              dataOrchestration: [
                {
                  id: 1,
                  title: 'Continuous Integration/Continuous Deployment (CI/CD)',
                  description: 'Streamline your CI/CD pipelines by integrating with tools like GitHub Actions and Jenkins.',
                  imageSource: '/landing/usecases/platform-engineers/continuous-integration.svg',
                  imageAlt: 'Integration/Continuous',
                  pageHref: '/use-cases/ci-cd'
                },
                {
                  id: 2,
                  title: 'Infrastructure Monitoring',
                  description: 'Automate monitoring and alerting processes, ensuring your infrastructure is always performing optimally.',
                  imageSource: '/landing/usecases/provisioning-and-deployment/infrastructure-monitoring.svg',
                  imageAlt: 'Monitoring',
                  pageHref: '/use-cases/monitoring'
                },
                {
                  id: 3,
                  title: 'Disaster Recovery',
                  description: 'Automate backup and recovery processes to ensure your infrastructure can quickly recover from failures.',
                  imageSource: '/landing/usecases/monitoring/disaster-recovery.svg',
                  imageAlt: 'Compliance Audits',
                  pageHref: '/use-cases/disaster-recovery'
                },
              ],
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
