<template>
    <div>
        <Head>
          <Title>Orchestrate your Infrastructure with Kestra</Title>
          <Meta
              name="description"
              content="Automate, Scale, Provision and Optimize Your Infrastructure with Kestra Slug: kestra.io/use-cases/platform-engineers"
          />
        </Head>

        <UseCasesEngineersHeader
            titleHtml="Kestra for<br><span>Platform Engineers</span>"
            description="Automate, Scale, Provision and Optimize Your Infrastructure with Kestra"
            imageSrc="/landing/usecases/platform-engineers/header-hero.svg"
        />
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersChallenges
                :titleHtml="challengesTitle"
                description="Kestra tackles the challenges platform engineers face by automating infrastructure orchestration, enhancing scalability, and ensuring seamless integrations."
                :cardsData="cardsData"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersExploreBlueprints tag="DevOps" />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersDataOrchestration
                title="for Platform Orchestration"
                :dataOrchestration="dataOrchestration"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesEnterpriseEdition/>
        </NuxtLazyHydrate>
    </div>
</template>

<script>
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section},
        data() {
            return {
               challengesTitle: `Orchestrate your <span>Infrastructure</span><br/>with Kestra`,
               cardsData: [
                 {
                   number: '01',
                   title: 'Comprehensive Integration',
                   description: 'Kestra integrates with leading infrastructure tools like Docker, Kubernetes, Ansible, and Terraform, providing a unified orchestration platform.'
                 },
                 {
                   number: '02',
                   title: 'Scalability',
                   description: 'Scale your infrastructure to meet growing demands without compromising performance or reliability.'
                 },
                 {
                   number: '03',
                   title: 'Automate Infrastructure Tasks',
                   description: 'Use Kestra to automate provisioning, deployment, and monitoring, ensuring smooth and efficient operations.'
                 },
                 {
                   number: '04',
                   title: 'Manage Docker and Kubernetes',
                   description: 'Orchestrate containerized applications and services with ease, leveraging Docker and Kubernetes plugins.'
                 },
                 {
                   number: '05',
                   title: 'Infrastructure as Code (IaC) with Ansible and Terraform',
                   description: 'Integrate IaC tools to manage and version your infrastructure configurations seamlessly.'
                 },
                 {
                   number: '06',
                   title: 'Scalable Workload Management',
                   description: 'Kestra handles workload distribution and scaling, reducing the burden on your servers and improving performance.'
                 },
                 {
                   number: '07',
                   title: 'Event-Driven Workflows',
                   description: 'Initiate workflows based on specific events such as system alerts, data changes, or scheduled times.'
                 },
                 {
                   number: '08',
                   title: 'Enhanced Security and Compliance',
                   description: 'Maintain high standards of security and compliance with automated workflows that adhere to best practices.'
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
                {
                  id: 4,
                  title: 'Infrastructure Monitoring',
                  description: 'Automate monitoring and alerting processes, ensuring your infrastructure is always performing optimally.',
                  imageSource: '/landing/usecases/provisioning-and-deployment/infrastructure-monitoring.svg',
                  imageAlt: 'Monitoring',
                  pageHref: '/use-cases/monitoring'
                },
              ],
            }
        },
    }
</script>
