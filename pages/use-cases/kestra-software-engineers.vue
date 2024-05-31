<template>
    <div>
        <Head>
          <Title>Orchestrate Your Software Development with Kestra</Title>
          <Meta
              name="description"
              content="Boost Productivity, Simplify Processes, and Accelerate Microservice Deployment Slug: kestra.io/use-cases/software-engineers"
          />
        </Head>

        <UseCasesEngineersHeader
            titleHtml="Kestra for<br><span>Software Engineers</span>"
            description="Boost Productivity, Simplify Processes, and Accelerate Microservice Deployment"
            imageSrc="/landing/usecases/software-engineers/header-hero.svg"
        />
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersChallenges
                :titleHtml="challengesTitle"
                description="Kestra tackles the challenges software engineers face by automating development workflows, enhancing microservice orchestration, and ensuring seamless integrations."
                :cardsData="cardsData"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersExploreBlueprints />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersDataOrchestration
                title="for Software Engineering"
                :dataOrchestration="dataOrchestration"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesEnterpriseEdition/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="New to Kestra?"
                subtitle="Use blueprints to kickstart your first workflows."
                purpleButtonText="Get started with Kestra"
                purpleButtonHref="https://github.com/kestra-io/kestra"
            />
        </NuxtLazyHydrate>
    </div>
</template>

<script>
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section},
        data() {
            return {
               challengesTitle: `Orchestrate <span>Your Software</span><br/>Development with Kestra`,
               cardsData: [
                 {
                   number: '01',
                   title: 'Automated Testing and QA',
                   description: 'Integrate automated testing workflows to run unit tests, integration tests, and end-to-end tests, ensuring code quality and reliability. Automate QA processes to identify issues earlier in the development cycle.'
                 },
                 {
                   number: '02',
                   title: 'Database Management',
                   description: 'Orchestrate database migrations, backups, and restorations seamlessly within your development pipeline, ensuring data integrity and availability.'
                 },
                 {
                   number: '03',
                   title: 'API Orchestration',
                   description: 'Manage and automate API deployments, scaling, and monitoring to ensure high availability and performance, simplifying the process of rolling out new features and updates.'
                 },
                 {
                   number: '04',
                   title: 'Dependency Management',
                   description: 'Automate the management of dependencies, ensuring all necessary components are correctly installed and up-to-date, preventing version conflicts and ensuring consistency across environments.'
                 },
                 {
                   number: '05',
                   title: 'Service Mesh Integration',
                   description: 'Integrate with service meshes to manage the communication between microservices, enhancing reliability, security, and observability of your applications.'
                 },
                 {
                   number: '06',
                   title: 'Performance Optimization',
                   description: 'Automate performance testing and optimization workflows to ensure your applications run efficiently and can handle expected loads.'
                 },
                 {
                   number: '07',
                   title: 'Incident Response and Resolution',
                   description: 'Automate incident detection and response workflows, ensuring quick resolution and minimal downtime. Implement automated alerts and self-healing processes to address issues proactively.'
                 },
                 {
                   number: '08',
                   title: 'Business Process Automation',
                   description: 'Streamline and automate various business processes such as employee onboarding, approval workflows, and data synchronization, reducing manual workload and improving efficiency.'
                 },
                 {
                   number: '09',
                   title: 'Continuous Feedback Loop',
                   description: 'Set up automated feedback loops to collect and integrate user feedback into the development process, enabling continuous improvement and user-centric development.'
                 },
              ],
              dataOrchestration: [
                {
                  id: 1,
                  title: 'Microservice Management',
                  description: 'Simplify the orchestration of microservices, ensuring efficient communication and coordination.',
                  imageSource: '/landing/usecases/software-engineers/kestras-capabilities .svg',
                  imageAlt: 'Microservice Management',
                  pageHref: '#'
                },
                {
                  id: 2,
                  title: 'Configuration Management',
                  description: 'Use Kestra to maintain consistent configuration across all your environments, reducing configuration drift.',
                  imageSource: '/landing/usecases/software-engineers/kestras-capabilities .svg',
                  imageAlt: 'Configuration Management',
                  pageHref: '#'
                },
                {
                  id: 3,
                  title: 'Automated Testing',
                  description: 'Integrate automated testing workflows to run unit tests, integration tests, and end-to-end tests, ensuring code quality and reliability.',
                  imageSource: '/landing/usecases/software-engineers/kestras-capabilities .svg',
                  imageAlt: 'Automated Testing',
                  pageHref: '#'
                },
                {
                  id: 4,
                  title: 'Database Management',
                  description: 'Orchestrate database migrations, backups, and restorations seamlessly within your development pipeline.',
                  imageSource: '/landing/usecases/software-engineers/kestras-capabilities .svg',
                  imageAlt: 'Database Management',
                  pageHref: '#'
                },
                {
                  id: 5,
                  title: 'API Orchestration',
                  description: 'Manage and automate API deployments, scaling, and monitoring to ensure high availability and performance.',
                  imageSource: '/landing/usecases/software-engineers/kestras-capabilities .svg',
                  imageAlt: 'API Orchestration',
                  pageHref: '#'
                },
                {
                  id: 6,
                  title: 'Business Process Automation',
                  description: 'Streamline and automate various business processes such as employee onboarding, approval workflows, and data synchronization.',
                  imageSource: '/landing/usecases/software-engineers/kestras-capabilities .svg',
                  imageAlt: 'Business Process Automation',
                  pageHref: '#'
                },
              ],
            }
        },
    }
</script>
