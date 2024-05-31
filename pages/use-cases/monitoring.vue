<template>
    <div>
        <Head>
          <Title>Simplify Infrastructure Monitoring</Title>
          <Meta name="description" content="Automate infrastructure monitoring, implement alerting, and ensure optimal performance and reliability." />
        </Head>

        <UseCasesEngineersHeader
            titleHtml="Infrastructure <br> Monitoring"
            description="Automate infrastructure monitoring, implement  alerting, and ensure optimal performance and reliability."
            imageSrc="/landing/usecases/monitoring/header-hero.svg"
            imageAlt="Monitoring"
            darkButtonText="Talk to Us"
            dakButtonHref="docs/getting-started"
        />
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersMain
                subtitle="Infrastructure Monitoring"
                subtitleBefore="Simplify"
                baseline="Kestra's  monitoring capabilities and integrations empower platform engineers to maintain and optimize infrastructure performance efficiently."
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
    import MathLog from "vue-material-design-icons/MathLog.vue";
    import AlertCircle from "vue-material-design-icons/AlertCircle.vue";
    import Speedometer from "vue-material-design-icons/Speedometer.vue";
    import ToyBrickPlus from "vue-material-design-icons/ToyBrickPlus.vue";
    import Cogs from "vue-material-design-icons/Cogs.vue";
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section},
        data() {
            return {
              challengesTitle: `<span>Key Benefits</span> of Using Kestra for<br/> Alerting`,
              cardsData: [
                {
                  icon: MathLog,
                  cardInfo: {
                    title: 'Log Management',
                    description: 'Collect, analyze, and visualize log data to  troubleshoot issues effectively.'
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
                  icon: Speedometer,
                  cardInfo: {
                    title: 'Rapid Response',
                    description: 'Alerts and automated incident response workflows ensure quick resolution of issues.'
                  },
                },
                {
                  icon: ToyBrickPlus,
                  cardInfo: {
                    title: 'Extensibility',
                    description: 'Use built-in plugins or create custom plugins to seamlessly integrate with popular monitoring tools and services.'
                  },
                },
                {
                  icon: Cogs,
                  cardInfo: {
                    title: 'Reduce Manual Effort',
                    description: 'Automate monitoring and alerting processes, allowing your team to focus on strategic initiatives.'
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
                  title: 'Provisioning and Deployment',
                  description: 'Automate the setup and deployment of infrastructure components, reducing manual effort and errors.',
                  imageSource: '/landing/usecases/monitoring/provisioning-deployment.svg',
                  imageAlt: 'Provisioning',
                  pageHref: '/use-cases/provisioning-and-deployment'
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
                  title: 'Quick Alerting',
                  img: '/landing/usecases/monitoring/quick-alerting.svg',
                  imgAlt: 'Quick Alerting',
                  imgWidth: '568px',
                  imgHeight: '420px',
                  description: 'Kestra enables  alerting to help you maintain optimal performance and quickly address any issues that arise. ',
                  content: `
                    <ul>
                        <li>
                            Alerts:
                            <span>Set up  alerts to notify your team of critical issues, ensuring rapid response and minimizing downtime.</span>
                        </li>
                    </ul>
                  `
                },
                {
                  title: 'Orchestrate your Monitoring Data',
                  img: '/landing/usecases/monitoring/monitoring-data.svg',
                  imgAlt: 'Docker and Kubernetes',
                  imgWidth: '568px',
                  imgHeight: '420px',
                  description: 'Orchestrate your monitoring data efficiently to maintain optimal performance and quickly address any issues that arise. ',
                  content: `
                    <ul>
                        <li>
                            Centralized Collection:
                            <span>
                               Orchestrate the collection of monitoring metrics from various sources, ensuring all relevant data is gathered in one place.
                            </span>
                        </li>
                        <li>
                            Data Transformation:
                            <span>
                                Use Kestra to automate the transformation of raw monitoring data into  standardized formats, and enriche it.
                            </span>
                        </li>
                        <li>
                            Unified Platform:
                            <span>
                                Distribute transformed metrics to a centralized platform, such as a dashboard or monitoring system, enabling comprehensive visibility.
                            </span>
                        </li>
                    </ul>
                  `
                },
                {
                  title: 'Automate Incident Response ',
                  img: '/landing/usecases/monitoring/incident-response.svg',
                  imgAlt: 'Configuration Management and Compliance',
                  imgWidth: '604px',
                  imgHeight: '477px',
                  description: 'Kestra\'s automation capabilities enable you to set up workflows that automatically respond to and remediate infrastructure issues, reducing the time to resolution and minimizing manual intervention. ',
                  content: `
                    <ul>
                        <li>
                            Incident Response:
                            <span>
                               Automate incident detection and response workflows to quickly address and resolve issues, ensuring minimal impact on your infrastructure.
                            </span>
                        </li>
                        <li>
                           Self-healing Systems:
                            <span>
                                 Implement self-healing workflows that automatically correct issues, such as restarting services or reallocating resources, to maintain system stability.
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
