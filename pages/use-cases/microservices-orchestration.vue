<template>
    <div>
        <Head>
          <Title>Streamline your Microservices Orchestration</Title>
          <Meta name="description" content="Kestra empower software engineers to manage microservices efficiently, enhancing reliability and performance." />
        </Head>

        <UseCasesEngineersHeader
            titleHtml="Microservices  <br> Orchestration"
            description="Automate, orchestrate, and Optimize Your Microservices."
            imageSrc="/landing/usecases/microservices-orchestration/header-hero.svg"
            imageAlt="Microservices"
            darkButtonText="Talk to Us"
            dakButtonHref="docs/getting-started"
        />
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersMain
                subtitle="your Microservices Orchestration"
                subtitleBefore="Streamline"
                baseline="Kestra empower software engineers to manage microservices efficiently, enhancing reliability and performance."
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
              challengesTitle: `<span>Key Benefits</span> of Using Kestra for<br/> Microservices Orchestration`,
              cardsData: [
                {
                  icon: Cogs,
                  cardInfo: {
                    title: 'Flexible Integration',
                    description: 'Integrate seamlessly with various tools and platforms, providing a unified orchestration solution.'
                  },
                },
                {
                  icon: AlertCircle,
                  cardInfo: {
                    title: 'Minimize Errors',
                    description: 'Ensure reliable communication and coordination between microservices, reducing the risk of errors and downtime.'
                  },
                },
                {
                  icon: TimerCogOutline,
                  cardInfo: {
                    title: 'Increase Efficiency',
                    description: 'Automate routine tasks and workflows, allowing your team to focus on strategic development'
                  },
                },
                {
                  icon: ChartAreaspline,
                  cardInfo: {
                    title: 'CI/CD Pipelines',
                    description: 'Automate continuous integration and continuous deployment pipelines, ensuring smooth and reliable releases of microservices.'
                  },
                },
                {
                  icon: CloudRefreshVariant,
                  cardInfo: {
                    title: 'Data Synchronization',
                    description: 'Ensure data consistency across microservices by orchestrating data synchronization workflows.'
                  },
                },
              ],
              dataOrchestration: [
                {
                  id: 1,
                  title: 'Database Management',
                  description: 'Orchestrate database migrations, backups, and restorations seamlessly within your development pipeline.',
                  imageSource: '/landing/usecases/microservices-orchestration/database-management.svg',
                  imageAlt: 'Database Management',
                  pageHref: '/use-cases/databases-managament'
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
                  title: 'Orchestrate Your Microservices',
                  img: '/landing/usecases/microservices-orchestration/orchestrate-microservices.svg',
                  imgAlt: 'Orchestrate Your Microservices',
                  imgWidth: '568px',
                  imgHeight: '420px',
                  description: 'Kestra enables you to orchestrate microservices effortlessly, ensuring smooth communication and coordination between services, which is crucial for maintaining a reliable and scalable architecture.   ',
                  content: `
                    <ul>
                        <li>
                            Automated Workflows:
                            <span>Create and manage workflows that coordinate various microservices, ensuring they work together seamlessly.</span>
                        </li>
                        <li>
                            Service Communication:
                            <span>Facilitate efficient communication between microservices, reducing latency and improving overall system performance.</span>
                        </li>
                        <li>
                            Event-Driven Architecture:
                            <span>Leverage Kestra's event-driven capabilities to trigger workflows based on specific events, such as data changes or API calls.</span>
                        </li>
                    </ul>
                  `
                },
                {
                  title: 'CI/CD Integration and Automation',
                  img: '/landing/usecases/microservices-orchestration/ci-di-integration.svg',
                  imgAlt: 'CI/CD Integration',
                  imgWidth: '568px',
                  imgHeight: '420px',
                  description: 'Kestra helps you streamline and automate your continuous integration and continuous deployment (CI/CD) pipelines, ensuring smooth and reliable releases of microservices.  ',
                  content: `
                    <ul>
                        <li>
                            Automated Build and Test:
                            <span>
                               Use Kestra to automate the building, testing, and deployment of microservices, reducing manual intervention and errors.
                            </span>
                        </li>
                        <li>
                            Continuous Integration:
                            <span>
                                Integrate Kestra with CI tools like Jenkins, GitHub Actions, or GitLab CI to ensure that code changes are automatically tested and merged.
                            </span>
                        </li>
                        <li>
                            Continuous Deployment:
                            <span>
                                Automate the deployment of microservices to various environments, ensuring that new versions are released quickly and reliably.
                            </span>
                        </li>
                        <li>
                            Rollback Capabilities:
                            <span>
                                Implement automated rollback workflows to revert to previous versions in case of deployment failures, ensuring minimal downtime.
                            </span>
                        </li>
                    </ul>
                `
                },
                {
                  title: 'Manage Microservices Regardless of Language',
                  img: '/landing/usecases/microservices-orchestration/manage-microservices.svg',
                  imgAlt: 'Manage Microservices',
                  imgWidth: '604px',
                  imgHeight: '477px',
                  description: 'Kestra\'s language-agnostic platform allows software engineers from any background to manage their scripts and orchestrate microservices efficiently.  ',
                  content: `
                    <ul>
                        <li>
                            Support for Multiple Languages:
                            <span>
                               Orchestrate scripts written in Python, Java, JavaScript, Go, and more, ensuring that developers can use the tools they are most comfortable with.
                            </span>
                        </li>
                        <li>
                            Separation of Business Logic and Orchestration Logic:
                            <span>
                                 Keep your business logic separate from orchestration logic, making workflows easier to manage and maintain.
                            </span>
                        </li>
                        <li>
                            Unified Management:
                            <span>
                                 Use Kestra to manage and automate workflows across different programming environments, ensuring consistency and efficiency.
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
