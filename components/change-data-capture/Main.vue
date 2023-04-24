<template>
    <div class="container">
        <Section
            title="Efficient Data Analysis through Change Data Capture"
            subtitle="Streamlined Data Analysis for Financial Institutions"
            baseline="Financial institutions require up-to-date information from multiple sources like transactional databases, customer profiles, and market data feeds for informed decision-making. Synchronizing their data warehouse and analytics systems with these sources is crucial."
        >
            <div class="row mb-5">
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/usecases/cdc-feature-1.svg" alt="Diagram illustrating Kestra's Change Data Capture process, with PostgreSQL for databases, Apache Kafka for streaming data, and Apache Spark for analytics processing" />
                </div>
                <div class="col-md-6 p-5" data-aos="fade-left">
                    <h5>CDC Implementation for Seamless Data Synchronization</h5>
                    <p>
                        Utilizing Kestra's Change Data Capture capabilities, financial institutions can detect and capture data source changes promptly.
                    </p>
                    <p>
                        <strong>For example:</strong> the institution uses PostgreSQL for transactional databases, Apache Kafka for streaming data, and Apache Spark for analytics processing. Kestra's CDC capabilities help detect changes in the PostgreSQL database and publish the changes to Kafka topics. Apache Spark then consumes the Kafka messages, processes the data, and updates the data warehouse and analytics platforms.
                    </p>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 p-5 order-1 order-md-0" data-aos="fade-left">
                    <h5>Workflow Configuration and Management with Kestra</h5>
                    <p>
                        Kestra enables institutions to configure and manage CDC workflows with tasks such as data transformation, filtering, and aggregation, resulting in a consistent and up-to-date data view for accurate insights and decision-making.
                    </p>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/usecases/cdc-feature-2.svg" alt="Picture of tasks possible with Kestra Change Data capture like data transformation, filtering, and aggregation" />
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/usecases/cdc-feature-3.svg" alt="Illustration showing Kestra's event-driven triggers that initiate workflows automatically upon data changes, such as inserting a new customer record into the PostgreSQL database" />
                </div>
                <div class="col-md-6 p-5" data-aos="fade-left">
                    <h5>Event-Driven Triggers for Automatic Workflow Initiation</h5>
                    <p>
                        Kestra's event-driven triggers initiate workflows automatically as data changes occur, eliminating manual intervention and reducing data inconsistency risks.
                    </p>
                    <p>
                        <strong>For example:</strong> when a new customer record is inserted into the PostgreSQL database, Kestra detects the insert operation and automatically triggers a corresponding workflow. This workflow processes the new data and updates the data warehouse and analytics systems accordingly.
                    </p>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 p-5" data-aos="fade-left">
                    <h5>Integration with Existing Infrastructure</h5>
                    <p>
                        With Kestra's extensive integration capabilities, the financial institution can seamlessly connect its existing infrastructure and third-party tools, allowing for effortless data synchronization across various systems.
                    </p>
                </div>
                <div class="col-md-6" data-aos="fade-right">
                    <img class="img-fluid" src="/landing/usecases/cdc-feature-4.svg" alt="Image depicting Kestra's extensive integration capabilities, with logos of AWS, Fivetran, and Airbyte " />
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

</style>