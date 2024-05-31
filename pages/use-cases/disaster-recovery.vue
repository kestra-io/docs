<template>
    <div>
        <Head>
          <Title>Automate Disaster Recovery</Title>
          <Meta name="description" content="Automate disaster recovery processes, secure your data, and ensure business continuity." />
        </Head>

        <UseCasesEngineersHeader
            titleHtml="Disaster Recovery"
            description="Automate disaster recovery processes, secure your data, and ensure business continuity."
            imageSrc="/landing/usecases/disaster-recovery/header-hero.svg"
            imageAlt="Monitoring"
            darkButtonText="Talk to Us"
            dakButtonHref="docs/getting-started"
        />
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersMain
                subtitle="Disaster Recovery"
                subtitleBefore="Automate"
                baseline="Kestra empower platform engineers to maintain data integrity and ensure quick recovery from failures."
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
              challengesTitle: `<span>Key Benefits</span> of Using Kestra for<br/> Disaster Recovery`,
              cardsData: [
                {
                  icon: Cogs,
                  cardInfo: {
                    title: 'Minimize Data Loss',
                    description: 'Regular automated backups ensure that your data is always protected and recoverable.'
                  },
                },
                {
                  icon: AlertCircle,
                  cardInfo: {
                    title: 'Reduce Downtime',
                    description: 'Automated failover and restoration processes minimize downtime and ensure business continuity.'
                  },
                },
                {
                  icon: TimerCogOutline,
                  cardInfo: {
                    title: 'Data Security',
                    description: 'Secure backup storage and automated recovery processes'
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
                    title: 'Increase Efficiency',
                    description: 'Automate disaster recovery workflows, reducing manual intervention.'
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
                  title: 'Infrastructure Monitoring',
                  description: 'Automate monitoring and alerting processes, ensuring your infrastructure is always performing optimally.',
                  imageSource: '/landing/usecases/provisioning-and-deployment/infrastructure-monitoring.svg',
                  imageAlt: 'Monitoring',
                  pageHref: '/use-cases/monitoring'
                },
              ],
              mainContent: [
                {
                  title: 'Automated Backup',
                  img: '/landing/usecases/disaster-recovery/automated-backup.svg',
                  imgAlt: 'Automated Backup',
                  imgWidth: '568px',
                  imgHeight: '420px',
                  description: 'Kestra enables automated backup processes, ensuring that your data is regularly and securely backed up. This minimizes data loss and facilitates quick recovery in the event of a disaster.  ',
                  content: `
                    <ul>
                        <li>
                            Scheduled Backups:
                            <span>Automate regular backups of critical data and infrastructure components, ensuring that you always have up-to-date copies available.</span>
                        </li>
                        <li>
                            Secure Storage:
                            <span>Store backups securely in the cloud or on-premises, ensuring data protection and compliance with regulatory requirements.</span>
                        </li>
                    </ul>
                  `
                },
                {
                  title: 'Leverage API Integrations',
                  img: '/landing/usecases/disaster-recovery/leverage-integrations.svg',
                  imgAlt: 'Leverage API Integrations',
                  imgWidth: '568px',
                  imgHeight: '420px',
                  description: 'Kestra integrates with various APIs, enabling you to automate and manage disaster recovery processes efficiently. Utilize API capabilities to trigger backups, initiate failover procedures, and streamline recovery workflows. ',
                  content: `
                    <ul>
                        <li>
                            API-Driven Automation:
                            <span>
                               Use APIs to automate disaster recovery tasks, from triggering backups to initiating failover and restoration processes.
                            </span>
                        </li>
                        <li>
                           Custom Recovery Workflows:
                            <span>
                                Build custom disaster recovery workflows using Kestra's API capabilities, ensuring they meet your specific needs and requirements.
                            </span>
                        </li>
                    </ul>
                `
                },
                {
                  title: 'Automated Failover  and Restoration',
                  img: '/landing/usecases/disaster-recovery/automated-failover.svg',
                  imgAlt: 'Automated Failover  and Restoration',
                  imgWidth: '604px',
                  imgHeight: '477px',
                  description: 'Kestra\'s automation capabilities enable you to set up workflows that automatically trigger failover and restoration processes, reducing downtime and ensuring business continuity. ',
                  content: `
                    <ul>
                        <li>
                            Automated Failover:
                            <span>
                                Configure automated failover processes to switch to backup systems seamlessly, ensuring minimal disruption during a disaster.
                            </span>
                        </li>
                        <li>
                            Quick Restoration:
                            <span>
                                 Automate the restoration of data and services to ensure a swift recovery and return to normal operations.
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
