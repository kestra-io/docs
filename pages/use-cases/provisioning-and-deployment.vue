<template>
    <div>
        <Head>
          <Title>Simplify Provisioning and Deployment with Kestra</Title>
          <Meta name="description" content="Automate the setup and deployment of infrastructure components, reducing manual effort and errors." />
        </Head>

        <UseCasesDeploymentHeader />
        <NuxtLazyHydrate when-visible>
            <UseCasesDeploymentMain/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesDeploymentEnterpriseEdition/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesDeploymentChallenges
                :titleHtml="challengesTitle"
                description="Kestra tackles the challenges software engineers face by automating development workflows, enhancing microservice orchestration, and ensuring seamless integrations."
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
    import FileCodeOutline from "vue-material-design-icons/FileCodeOutline.vue";
    import ArrowDecisionAutoOutline from "vue-material-design-icons/ArrowDecisionAutoOutline.vue";
    import ToyBrickOutline from "vue-material-design-icons/ToyBrickOutline.vue";
    import Connection from "vue-material-design-icons/Connection.vue";
    import OpenInApp from "vue-material-design-icons/OpenInApp.vue";
    import CloudCheckOutline from "vue-material-design-icons/CloudCheckOutline.vue";
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
                  title: 'Disaster Recovery',
                  description: 'Automate backup and recovery processes to ensure your infrastructure can quickly recover from failures.',
                  imageSource: '/landing/usecases/software-engineers/kestras-capabilities .svg',
                  imageAlt: 'Disaster Recovery',
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
                  title: 'Compliance Audits',
                  description: 'Integrate automated testing workflows to run unit tests, integration tests, and end-to-end tests, ensuring code quality and reliability.',
                  imageSource: '/landing/usecases/software-engineers/kestras-capabilities .svg',
                  imageAlt: 'Compliance Audits',
                  pageHref: '#'
                },
                {
                  id: 4,
                  title: 'Continuous Integration/Continuous Deployment (CI/CD)',
                  description: 'Streamline your CI/CD pipelines by integrating with tools like GitHub Actions and Jenkins.',
                  imageSource: '/landing/usecases/platform-engineers/continuous-integration.svg',
                  imageAlt: 'Continuous Deployment',
                  pageHref: '/use-cases/ci-cd'
                },
                {
                  id: 5,
                  title: 'Infrastructure Monitoring',
                  description: 'Automate monitoring and alerting processes, ensuring your infrastructure is always performing optimally.',
                  imageSource: '/landing/usecases/software-engineers/kestras-capabilities .svg',
                  imageAlt: 'Infrastructure Monitoring',
                  pageHref: '#'
                },
              ],
            }
        },
    }
</script>
