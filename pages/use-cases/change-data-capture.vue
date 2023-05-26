<template>
    <div>
        <Head>
          <Title>Harness Change Data Capture for Efficient Data Processing and Analysis</Title>
          <Meta name="description" content="Boost Data Synchronization and Streamlined Processing with Kestra's CDC Capabilities" />
        </Head>

        <SolutionsDetailHeader
            title="Harness Change Data Capture for Efficient Data Processing and Analysis"
            subtitle="Boost Data Synchronization and Streamlined Processing with Kestra's CDC Capabilities"
            detail-title="What is Change Data Capture ?"
            detail-content="Change Data Capture (CDC) tracks and captures data source alterations for efficient processing and analysis. Kestra's CDC features allow businesses to synchronize and manage data effectively, maintaining updated data warehouses and analytics platforms with minimized resource use."
            image="/landing/usecases/cdc/intro.svg"
        />
        <SolutionsDetailMain
            title="Efficient Data Analysis through Change Data Capture"
            subtitle="Streamlined Data Analysis for Financial Institutions"
            baseline="Financial institutions require up-to-date information from multiple sources like transactional databases, customer profiles, and market data feeds for informed decision-making. Synchronizing their data warehouse and analytics systems with these sources is crucial."
            :items="mainContent"
        />
        <SolutionsDetailEmpower
            title="Kestra - Empowering Data-Driven Success"
            subtitle="Kestra's Change Data Capture capabilities enhance data management by enabling efficient data synchronization and processing. With Kestra's event-driven triggers, visual pipeline editor, and extensive integrations, businesses can maintain up-to-date data across their systems, leading to timely insights and better decision-making. Experience the benefits of Kestra's CDC solution and transform your data management processes today."
        />
        <SolutionsDetailFeatures
            title="Leveraging Kestra's Features"
            subtitle="Key Features"
            :items="features"
        />
        <SolutionsDetailNext />
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
                        title: 'CDC Implementation for Seamless Data Synchronization',
                        img: '/landing/usecases/cdc/feature-1.svg',
                        imgAlt: 'Diagram illustrating Kestra\'s Change Data Capture process, with PostgreSQL for databases, Apache Kafka for streaming data, and Apache Spark for analytics processing',
                        content: 'Utilizing Kestra\'s Change Data Capture capabilities, financial institutions can detect and capture data source changes promptly.<br /><br />' +
                            '<strong>For example:</strong> the institution uses PostgreSQL for transactional databases, Apache Kafka for streaming data, and Apache Spark for analytics processing. Kestra\'s CDC capabilities help detect changes in the PostgreSQL database and publish the changes to Kafka topics. Apache Spark then consumes the Kafka messages, processes the data, and updates the data warehouse and analytics platforms.'
                    },
                    {
                        title: 'Workflow Configuration and Management with Kestra',
                        img: '/landing/usecases/cdc/feature-2.svg',
                        imgAlt: 'Picture of tasks possible with Kestra Change Data capture like data transformation, filtering, and aggregation',
                        content: 'Kestra enables institutions to configure and manage CDC workflows with tasks such as data transformation, filtering, and aggregation, resulting in a consistent and up-to-date data view for accurate insights and decision-making.',
                    },
                    {
                        title: 'Event-Driven Triggers for Automatic Workflow Initiation',
                        img: '/landing/usecases/cdc/feature-3.svg',
                        imgAlt: 'Illustration showing Kestra\'s event-driven triggers that initiate workflows automatically upon data changes, such as inserting a new customer record into the PostgreSQL database',
                        content: 'Kestra\'s event-driven triggers initiate workflows automatically as data changes occur, eliminating manual intervention and reducing data inconsistency risks.<br /><br />' +
                            '<strong>For example:</strong> when a new customer record is inserted into the PostgreSQL database, Kestra detects the insert operation and automatically triggers a corresponding workflow. This workflow processes the new data and updates the data warehouse and analytics systems accordingly.'
                    },
                    {
                        title: 'Integration with Existing Infrastructure',
                        img: '/landing/usecases/cdc/feature-4.svg',
                        imgAlt: 'Image depicting Kestra\'s extensive integration capabilities, with logos of AWS, Fivetran, and Airbyte',
                        content: 'With Kestra\'s extensive integration capabilities, the financial institution can seamlessly connect its existing infrastructure and third-party tools, allowing for effortless data synchronization across various systems.',
                    },
                ],
                features: [
                    {
                        title: 'Efficient Data Capture',
                        text: 'CDC allows you to track and capture data changes promptly, ensuring that your data pipelines remain current and provide you with accurate, actionable insights.',
                        icon: shallowRef(LightbulbOutline)
                    },
                    {
                        title: 'Seamless Integration with Data Sources',
                        text: 'Integrates with various data sources, databases, and platforms, allowing you to track changes across your entire data ecosystem.',
                        icon: shallowRef(FolderTextOutline)
                    },
                    {
                        title: 'Scalable and Efficient Processing',
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