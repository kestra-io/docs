<template>
    <div>
        <Head>
          <Title>Optimize your Databases Management</Title>
          <Meta name="description" content="Kestra empower software engineers to automate database migrations, ensure reliable backups, and facilitate quick restorations." />
        </Head>

        <UseCasesEngineersHeader
            titleHtml="Databases  <br> Management"
            description="Automate  your database management tasks within the development pipeline using Kestra."
            imageSrc="/landing/usecases/databases/header-hero.svg"
            imageAlt="Databases "
            darkButtonText="Talk to Us"
            dakButtonHref="docs/getting-started"
        />
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersMain
                subtitle="your Databases Management"
                subtitleBefore="Optimize"
                baseline="Kestra empower software engineers to automate database migrations, ensure reliable backups, and facilitate quick restorations."
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
                title="for Databases Management"
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
    import ArchiveSync from "vue-material-design-icons/ArchiveSync.vue";
    import TimerCogOutline from "vue-material-design-icons/TimerCogOutline.vue";
    import ChartAreaspline from "vue-material-design-icons/ChartAreaspline.vue";
    import CloudRefreshVariant from "vue-material-design-icons/CloudRefreshVariant.vue";
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section},
        data() {
            return {
              challengesTitle: `<span>Key Benefits</span> of Using Kestra for<br/> Databases Management`,
              cardsData: [
                {
                  icon: Cogs,
                  cardInfo: {
                    title: 'Operational Reliability',
                    description: 'Ensure reliable database operations with automated backups and restoration workflows.'
                  },
                },
                {
                  icon: ArchiveSync,
                  cardInfo: {
                    title: 'Data Archiving',
                    description: 'Automate the archiving of historical data to ensure secure storage and easy retrieval when needed.'
                  },
                },
                {
                  icon: TimerCogOutline,
                  cardInfo: {
                    title: 'Increase Efficiency',
                    description: 'Automate repetitive tasks, allowing your team to concentrate on strategic initiatives.'
                  },
                },
                {
                  icon: ChartAreaspline,
                  cardInfo: {
                    title: 'Scalability',
                    description: 'Easily scale database management processes as your infrastructure grows without compromising performance.'
                  },
                },
                {
                  icon: CloudRefreshVariant,
                  cardInfo: {
                    title: 'Data Consitency',
                    description: 'Maintain integrity across all database environments through automated migrations and backups.'
                  },
                },
              ],
              dataOrchestration: [
                {
                  id: 1,
                  title: "Microservice Management",
                  description: "Simplify the orchestration of microservices, ensuring efficient communication and coordination.",
                  imageSource: "/landing/usecases/databases/microservice-management.svg",
                  imageAlt: "Microservice Management",
                  pageHref: "/use-cases/microservices-orchestration"
                },
                {
                  id: 2,
                  title: 'API Orchestration',
                  description: 'Manage and automate API deployments, scaling, and monitoring to ensure high availability and performance.',
                  imageSource: '/landing/usecases/microservices-orchestration/api-orchestration.svg',
                  imageAlt: 'Provisioning',
                  pageHref: '/use-cases/provisioning-and-deployment'
                },
              ],
              mainContent: [
                {
                  title: 'Automated Database Migrations',
                  img: '/landing/usecases/databases/database-migrations.svg',
                  imgAlt: 'Automated Database Migrations',
                  imgWidth: '568px',
                  imgHeight: '420px',
                  description: 'Kestra enables you to automate database migrations, ensuring that schema changes are applied consistently across all environments. ',
                  content: `
                    <ul>
                        <li>
                            Version Control:
                            <span>Track and manage database schema changes using version control, ensuring consistency and traceability.</span>
                        </li>
                        <li>
                            Automated Rollbacks:
                            <span>Easily revert to previous database states in case of errors, ensuring minimal disruption.</span>
                        </li>
                        <li>
                            Environment Sync:
                            <span> Synchronize database schemas across development, testing, and production environments to maintain consistency.</span>
                        </li>
                    </ul>
                  `
                },
                {
                  title: 'Ensure Data Protection',
                  img: '/landing/usecases/databases/ensure-protection.svg',
                  imgAlt: 'Ensure Data Protection',
                  imgWidth: '568px',
                  imgHeight: '420px',
                  description: 'Automate regular database backups with Kestra to safeguard your data against loss and ensure its availability when needed. ',
                  content: `
                    <ul>
                        <li>
                            Scheduled Backups:
                            <span>
                               Define and automate backup schedules to ensure regular and consistent backups.
                            </span>
                        </li>
                        <li>
                            Secure Storage:
                            <span>
                                Store backups securely, either on-premises or in the cloud, to protect against data loss and ensure compliance with data protection regulations.
                            </span>
                        </li>
                        <li>
                            Incremental Backups:
                            <span>
                                Optimize storage and backup time by performing incremental backups, capturing only the changes since the last backup.
                            </span>
                        </li>
                    </ul>
                `
                },
                {
                  title: 'Quick Recovery',
                  img: '/landing/usecases/databases/quick-recovery.svg',
                  imgAlt: 'Quick Recovery',
                  imgWidth: '604px',
                  imgHeight: '477px',
                  description: 'Implement automated restoration processes with Kestra to recover data swiftly in the event of a failure, minimizing downtime and data loss. ',
                  content: `
                    <ul>
                        <li>
                            Automated Restorations:
                            <span>
                               Create workflows to automate the restoration of databases from backups, ensuring quick and reliable recovery.
                            </span>
                        </li>
                        <li>
                            Disaster Recovery:
                            <span>
                                 Plan and automate disaster recovery processes to ensure business continuity and minimal disruption during unforeseen events.
                            </span>
                        </li>
                        <li>
                            Testing Restorations:
                            <span>
                                 Regularly test your restoration workflows to ensure they are functioning correctly and can be relied upon in case of an emergency.
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
