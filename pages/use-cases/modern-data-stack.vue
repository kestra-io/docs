<template>
    <div>
        <Head>
          <Title>Integrate Kestra in the Modern Data Stack</Title>
          <Meta name="description" content="Orchestrate Your Data and Analytics Stack by Integrating Kestra with Leading Data Tools" />
        </Head>

        <SolutionsDetailHeader
            title="Integrate Kestra in the"
            titleAfter="Modern Data Stack"
            subtitle="Orchestrate Your Data and Analytics Stack by Integrating Kestra with Leading Data Tools"
            image="/landing/usecases/mds/intro-bg.svg"
            imageWidth="556px"
        />
        <NuxtLazyHydrate when-visible>
            <SolutionsDetailContent
                title="What is the Modern Data Stack?"
                subtitle="The modern data stack combines powerful automation and integration capabilities. Organizations can establish scalable, reliable, and streamlined data workflows by leveraging robust automation capabilities and seamless integrations with tools like dbt, Snowflake, Airbyte, and others. This ecosystem empowers data-driven decision-making and facilitates the generation of actionable insights."
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutDetailMainContent
                subtitle="Leverage"
                subtitleAfter="Modern Data Stack"
                baseline="Discover how Kestra's automation capabilities and extensive integrations with popular data tools from the modern data stack empower organizations to manage data pipelines with confidence."
                :items="mainContent"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <SolutionsDetailEmpower
                title="Orchestrate the Modern Data Stack with Kestra"
                subtitle="Kestra's flexibility enables seamless integration with a variety of modern data stack tools like Apache Kafka, Apache Spark for scalable processing, Fivetran for data replication, as well as leading data tools such as dbt, Snowflake, and Airbyte. By leveraging these integrations, organizations can automate data pipeline management, customize their data pipelines to meet specific requirements, and enhance their analytics capabilities."
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <SolutionsDetailFeatures
                subtitle="Key"
                subtitleAfter="Features"
                :items="features"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Ready to take your data platform to the next level?"
                darkButtonText="get a demo"
                darkButtonHref="/demo"
                purpleButtonText="Get Started"
                purpleButtonHref="/docs/getting-started/quickstart"
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
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section},
        data() {
            return {
                mainContent: [
                    {
                        title: 'Data Ingestion and Extraction with Airbyte',
                        img: '/landing/usecases/mds/feature-1.svg',
                        imgWidth: '734px',
                        imgHeight: '596px',
                        imgAlt: 'Diagram illustrating Kestra\'s integration with Airbyte for extract and load.',
                        content: 'Kestra and Airbyte can be combined for powerful data workflows. Thanks to Kestra\'s automation capabilities merged with Airbyte\'s data connectors, users can create automated ETL processes, streamline data ingestion, and reduce manual intervention. This tight integration ensures efficient, fully automated data workflows.'
                    },
                    {
                        title: 'Data Transformation with dbt',
                        img: '/landing/usecases/mds/feature-2.svg',
                        imgWidth: '569px',
                        imgHeight: '420px',
                        imgAlt: 'Picture of dbt task in Kestra to transform the data',
                        content: 'Once the data is extracted, it can be transformed using dbt (Data Build Tool), an open-source data transformation tool. Kestra can initiate dbt transformations by triggering dbt commands, and automating the process of cleaning, modeling, and validating the data.',
                    },
                    {
                        title: 'Data Loading and Storage with Snowflake',
                        img: '/landing/usecases/mds/feature-3.svg',
                        imgWidth: '569px',
                        imgHeight: '420px',
                        imgAlt: 'Illustration of Snowflake loading data thanks to Kestra',
                        content: 'Kestra can integrate with Snowflake, a cloud-based data storage and analytics platform, to load the transformed data into the company\'s data storage system. Automated tasks can be created to manage the data loading process, reducing the risk of errors and improving efficiency.'
                    },
                    {
                        title: 'Data Quality with Soda',
                        img: '/landing/usecases/mds/feature-4.svg',
                        imgWidth: '569px',
                        imgHeight: '420px',
                        imgAlt: 'Picture of SODA to test data quality',
                        content: 'In addition to dbt or Snowflake integrations, incorporating a data quality tool, such as Soda, into your modern data stack is essential for maintaining high-quality data. Soda helps monitor, test, and validate data at different stages of the pipeline, ensuring it meets the required quality standards.',
                    },
                ],
                features: [
                    {
                        title: 'Declarative Language',
                        text: 'Easily define and manage data workflows using YAML, which simplifies the integration process with modern data stack tools.',
                        icon: shallowRef(FileCodeOutline)
                    },
                    {
                        title: 'Workflow Orchestration',
                        text: 'Execute tasks sequentially, in parallel, or conditionally, providing better control and flexibility while working with various data stack components.',
                        icon: shallowRef(ArrowDecisionAutoOutline)
                    },
                    {
                        title: 'Extensibility',
                        text: 'Use built-in plugins or create custom plugins to seamlessly integrate with popular data stack tools and services.',
                        icon: shallowRef(ToyBrickOutline)
                    },
                    {
                        title: 'Connectivity',
                        text: 'Connect to popular data sources and cloud services such as AWS, GCP, Azure, Snowflake, and more.',
                        icon: shallowRef(Connection)
                    },
                    {
                        title: 'Rich & real-time UI',
                        text: 'Create, execute, and manage data workflows using an intuitive user interface, making it easier to work with modern data stack tools.',
                        icon: shallowRef(OpenInApp)
                    },
                    {
                        title: 'Cloud-Native',
                        text: 'Kestra\'s cloud-native architecture ensures seamless scaling and compatibility with modern data stack tools.',
                        icon: shallowRef(CloudCheckOutline)
                    },
                ]
            }
        },
    }
</script>
