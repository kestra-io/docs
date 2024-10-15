<template>
    <div>
        <Head>
          <Title>Simplify Your Data Engineering Challenges with Kestra</Title>
          <Meta name="description" content="Orchestrate your Data Pipelines, Automate Processes, and Harness the Power of Your Data Slug: kestra.io/use-cases/data-engineers" />
        </Head>

        <UseCasesEngineersHeader
            titleHtml="Kestra for<br><span>Data Engineers</span>"
            description="Orchestrate your Data Pipelines, Automate Processes, and Harness the Power of Your Data"
            imageSrc="/landing/usecases/data-engineers/header-hero.svg"
        />
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersChallenges
                title="Data Engineering Challenges"
                description="From automating data pipelines to accelerating machine learning model deployment, Kestra streamlines complex workflows across a wide range of industries and domains. Dive into the wide array of use cases Kestra efficiently addresses."
                :cardsData="cardsData"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersExploreBlueprints tag="55" />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <UseCasesEngineersDataOrchestration
                title="for Data Orchestration"
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
              cardsData: [
                {
                  number: '01',
                  title: 'Automate Your Data Pipelines',
                  description: 'Say goodbye to delays in your pipeline as Kestra initiates workflows based on specific times or events, such as data arrivals or file uploads.'
                },
                {
                  number: '02',
                  title: 'Deploy Machine Learning Models',
                  description: 'Efficiently manage and deploy machine learning models at scale using Kestra’s orchestration capabilities.'
                },
                {
                  number: '03',
                  title: 'Optimize ETL Processes',
                  description: 'Move, prepare, and clean data, consolidating it into a single data mart for easy access.'
                },
                {
                  number: '04',
                  title: 'Seamless Data Integration',
                  description: 'Easily connect and integrate with various data sources, ensuring smooth data flow across your systems.'
                },
                {
                  number: '05',
                  title: 'Real-time Data Processing',
                  description: 'Automatically detect and process changes in data sources with change data capture, keeping your data up-to-date and accurate.'
                },
                {
                  number: '06',
                  title: 'Automated Reporting',
                  description: 'Configure Kestra to distribute reports via email or Slack, keeping your team informed.'
                },
                {
                  number: '07',
                  title: 'Efficient Data Scraping',
                  description: 'Easily collect data from various sources and integrate it into your workflows.'
                },
                {
                  number: '08',
                  title: 'End-to-End Data Orchestration',
                  description: 'Manage the entire data lifecycle, from ingestion to reporting, with Kestra’s powerful orchestration capabilities.'
                },
              ],
              dataOrchestration: [
                {
                  id: 1,
                  title: 'Change data capture',
                  description: 'Streamline Complex Data Pipelines and Automate Repetitive Tasks for Enhanced Efficiency',
                  imageSource: '/landing/usecases/data-engineers/data-capture.svg',
                  imageAlt: 'Change data capture',
                  pageHref: '/use-cases/change-data-capture'
                },
                {
                  id: 2,
                  title: 'Modern Data Stack Integration',
                  description: 'Integrate leading data tools from the Modern Data Stack with Kestra',
                  imageSource: '/landing/usecases/data-engineers/data-stack.svg',
                  imageAlt: 'Data Stack',
                  pageHref: '/use-cases/modern-data-stack'
                },
                {
                  id: 3,
                  title: 'CI/CD for your Kestra Workflows',
                  description: 'Embrace software engineering practices for versioning, deploying, and maintaining data workflows',
                  imageSource: '/landing/usecases/data-engineers/ci-cd.svg',
                  imageAlt: 'CI/CD',
                  pageHref: '/use-cases/ci-cd'
                },
              ],
            }
        },
    }
</script>
