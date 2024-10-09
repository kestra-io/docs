<template>
    <div>
        <Head>
          <Title>Enhanced Data Insights with Change Data Capture</Title>
          <Meta name="description" content="Boost Data Synchronization and Streamlined Processing with Kestra's CDC Capabilities" />
        </Head>

        <SolutionsDetailHeader
            title="Efficient"
            titleAfter="Change Data Capture"
            subtitle="Build CDC pipeline with Kestra for data synchronization, and ressources optimization to ensure your data analytics platforms reflect the most current information."
            image="/landing/usecases/cdc/intro-bg.svg"
            imageWidth="707px"
        />
        <NuxtLazyHydrate when-visible>
            <SolutionsDetailContent
                title="What is Change Data Capture ?"
                subtitle="Change Data Capture (CDC) tracks and captures data source alterations for efficient processing and analysis. Kestra's CDC features allow businesses to synchronize and manage data effectively, maintaining updated data warehouses and analytics platforms with minimized resource use."
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutDetailMainContent
                subtitle="Data Analysis for Financial Institutions"
                subtitleBefore="Streamlined"
                baseline="Kestra makes CDC implementation straightforward, enabling your team to monitor data changes across your systems with ease. Configure workflows to automatically transform and aggregate data, keeping your datasets accurate and analytics reliable without manual intervention."
                :items="mainContent"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <SolutionsDetailEmpower
                title="Kestra - Empowering Data-Driven Success"
                subtitle="Kestra's Change Data Capture capabilities enhance data management by enabling efficient data synchronization and processing. With Kestra's event-driven triggers, visual pipeline editor, and extensive integrations, businesses can maintain up-to-date data across their systems, leading to timely insights and better decision-making. Experience the benefits of Kestra's CDC solution and transform your data management processes today."
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
    import LightbulbOutline from "vue-material-design-icons/LightbulbOutline.vue";
    import FolderTextOutline from "vue-material-design-icons/FolderTextOutline.vue";
    import DeveloperBoard from "vue-material-design-icons/DeveloperBoard.vue";
    import LightningBolt from "vue-material-design-icons/LightningBolt.vue";
    import TimerOutline from "vue-material-design-icons/LightningBolt.vue";
    import ImageMultiple from "vue-material-design-icons/ImageMultiple.vue";
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section},
        data() {
            return {
                mainContent: [
                    {
                        title: 'Real Time Data Replication',
                        img: '/landing/usecases/cdc/feature-1.svg',
                        imgAlt: 'Diagram illustrating Kestra\'s Change Data Capture process, with PostgreSQL for databases, Apache Kafka for streaming data, and Apache Spark for analytics processing',
                        imgWidth: '633px',
                        imgHeight: '488px',
                        content:'<strong>Data Detection and Distribution:</strong> Listen for changes in your chosen databases, such as PostgreSQL, detect new entries and updates as they occur. Once identified, these changes are packaged and distributed to messaging systems like Apache Kafka, guaranteeing that downstream processes, including analytics processing performed by tools like Apache Spark, have access to the latest data without delay.<br />'
                    },
                    {
                        title: 'Workflow Configuration and Management with Kestra',
                        img: '/landing/usecases/cdc/feature-2.svg',
                        imgAlt: 'Picture of tasks possible with Kestra Change Data capture like data transformation, filtering, and aggregation',
                        imgWidth: '569px',
                        imgHeight: '420px',
                        content: 'Kestra enables institutions to configure and manage CDC workflows with tasks such as data transformation, filtering, and aggregation, resulting in a consistent and up-to-date data view for accurate insights and decision-making.',
                    },
                    {
                        title: 'Event-Driven Triggers for Automatic Workflow Initiation',
                        img: '/landing/usecases/cdc/feature-3.svg',
                        imgAlt: 'Illustration showing Kestra\'s event-driven triggers that initiate workflows automatically upon data changes, such as inserting a new customer record into the PostgreSQL database',
                        imgWidth: '569px',
                        imgHeight: '420px',
                        content: 'Kestra\'s event-driven triggers initiate workflows automatically as data changes occur, eliminating manual intervention and reducing data inconsistency risks.<br /><br />' +
                        '<strong>Automated Workflows </strong>: Kestra CDC workflows are fully automated, with the capability to initiate and manage workflows that respond to file detection or scheduled events, API calls, or webhooks. This automation extends to data processing, enabling immediate ingestion, transformation, and delivery to data warehouses and analytical platforms, maintaining the integrity and relevance of your data landscape.'
                    },
                    {
                        title: 'Integration with Existing Infrastructure',
                        img: '/landing/usecases/cdc/feature-4.svg',
                        imgAlt: 'Image depicting Kestra\'s extensive integration capabilities, with logos of AWS, Fivetran, and Airbyte',
                        imgWidth: '632px',
                        imgHeight: '466px',
                        content: 'Kestra\'s advanced integration capabilities enable connectivity across your entire stack and third-party applications, ensuring streamlined data synchronization throughout your entire ecosystem."',
                    },
                ],
                features: [
                    {
                        title: 'Efficient Data Capture',
                        text: 'CDC allows you to track and capture data changes promptly, ensuring that your data pipelines remain current and provide you with accurate, actionable insights.',
                        icon: shallowRef(LightbulbOutline)
                    },
                    {
                        title: 'Integration with Data Sources',
                        text: 'Integrates with various data sources, databases, and platforms, allowing you to track changes across your entire data ecosystem.',
                        icon: shallowRef(FolderTextOutline)
                    },
                    {
                        title: 'Scalable Processing',
                        text: 'Kestra is designed to handle high data volumes and can scale to meet your growing data needs.',
                        icon: shallowRef(DeveloperBoard)
                    },
                    {
                        title: 'Reduced Data Latency',
                        text: 'Reduce data latency, ensuring that your data pipelines and analytics are always based on the latest information.',
                        icon: shallowRef(LightningBolt)
                    },
                    {
                        title: 'Data Versioning',
                        text: 'Allow you to track and manage historical versions of your data for auditing, analysis, and compliance purposes.',
                        icon: shallowRef(TimerOutline)
                    },
                    {
                        title: 'Delayed Data Capture',
                        text: 'Configure time delays for capturing data changes for handling time-sensitive data or for mitigating the impact of temporary data inconsistencies.',
                        icon: shallowRef(ImageMultiple)
                    },
                ]
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    :deep(section) {
        .subtitle {
            max-width: 68% !important;
            margin: auto !important;

            @include media-breakpoint-down(xxl) {
                max-width: 100% !important;
                margin: 0 !important;
            }
        }

        .baseline {
            font-size: $h6-font-size !important;
            font-weight: 300 !important;
        }
    }

</style>
