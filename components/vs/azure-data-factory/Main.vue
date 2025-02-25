<template>
    <div class="container">
        <Section class="about">
            <div>
                <h2>About <span>Kestra</span> & Azure Data Factory</h2>
                <p>Kestra is an open-source orchestration platform that enables teams to automate complex workflows across cloud, on-prem, and hybrid environments. It follows an everything-as-code approach, allowing users to define workflows in a straightforward YAML format. With its API-first architecture, Kestra ensures workflows are fully declarative, extensible, and free from proprietary limitations.</p>
                <p>Azure Data Factory (ADF) is a cloud-based ETL and data integration service developed by Microsoft. It provides a no-code interface for orchestrating data pipelines but is tightly integrated with the Azure ecosystem. While ADF simplifies development with a drag-and-drop UI, it lacks the flexibility of an open-source and multi-cloud orchestration platform.</p>
            </div>

            <div>
                <h2>Installation and Setup</h2>
                <p>Azure Data Factory is a fully managed cloud service with no installation required. However, it is restricted to the Azure ecosystem, requiring users to configure security settings, data sources, and integration runtimes before running workflows.</p>
                <p>Kestra offers a more flexible deployment model, supporting Docker, Kubernetes, and Terraform. This allows organizations to retain full control over execution, security, and data residency, making it adaptable to different infrastructure needs.</p>
            </div>

            <div>
                <h2>Workflow Definition</h2>
                <p>Kestra enables users to define workflows using YAML, ensuring clarity, maintainability, and version control. Inline scripting in Python, JavaScript, SQL, and Shell is supported for added flexibility.</p>
                <p>Kestra also features a no-code editor that visually constructs workflows while ensuring they are fully represented as code. This ensures workflows remain declarative, portable, and version-controlled.</p>
                <p>Azure Data Factory provides a no-code designer with a drag-and-drop UI for building pipelines. However, it does not automatically translate workflows into code, making version control and advanced automation more challenging.</p>
            </div>

            <div>
                <h2>Scalability and Performance</h2>
                <p>Kestra dynamically scales to handle large workloads efficiently, optimizing for both event-driven and scheduled workflows.</p>
                <p>Azure Data Factory scales within the Azure infrastructure but follows a pricing model based on data movement, pipeline execution, and integration runtimes, which can lead to unpredictable costs.</p>
            </div>

            <div>
                <h2>Integration Capabilities</h2>
                <p>Kestra is designed to work with any cloud provider, on-premises infrastructure, and SaaS applications. Its extensive plugin ecosystem supports integrations with BigQuery, Snowflake, Kafka, Airbyte, dbt, and more.</p>
                <p>Azure Data Factory is deeply integrated with Microsoft services like Azure Synapse, Data Lake, and Power BI but has limited out-of-the-box support for non-Microsoft technologies, which may be restrictive for multi-cloud strategies.</p>
            </div>

            <div>
                <h2>Monitoring and Observability</h2>
                <p>Kestra provides built-in workflow monitoring, logs, and real-time execution tracking, additionally Kestra offers a custom dashboard feature to display the most important metrics.</p>
                <p>Azure Data Factory relies on Azure Monitor and Log Analytics for observability, requiring additional configuration and incurring extra costs.</p>
            </div>

            <div>
                <h2>Open-Source vs. Proprietary</h2>
                <p>Kestra is fully open-source, supported by an active community, and offers enterprise options for advanced needs.</p>
                <p>Azure Data Factory is a proprietary Microsoft service, locking workflows within the Azure ecosystem and tying users to Azure infrastructure and pricing.</p>
            </div>

            <div>
                <h2>Advanced Features</h2>
                <p><strong>Azure Data Factory:</strong></p>
                <ul>
                    <li>Data Compression: Compress data during copy activities to optimize bandwidth.</li>
                    <li>Extensive Connectivity: Connects to a wide range of data sources.</li>
                    <li>Custom Event Triggers: Automate processing based on custom events.</li>
                    <li>Data Preview & Validation: Ensure correctness during data transfers.</li>
                    <li>Customizable Data Flows: Add custom actions or processing steps.</li>
                    <li>Integrated Security: Entra ID integration and role-based access control.</li>
                </ul>
                <p><strong>Kestra:</strong></p>
                <ul>
                    <li>Hybrid orchestration: Supports cloud, on-prem, and multi-cloud workflows.</li>
                    <li>Full-code, low-code, and no-code capabilities in one platform.</li>
                    <li>Prebuilt plugin ecosystem with extensive integrations.</li>
                    <li>Version-controlled workflows with built-in governance.</li>
                    <li>Lightweight YAML-based configuration, easy to modify and maintain.</li>
                </ul>
            </div>
        </Section>
                <div class="table-responsive mb-5">
                    <table class="table table-bordered mb-0">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Kestra</th>
                                <th>Azure Data Factory</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Core Focus</td>
                                <td>Orchestrating workflows, tasks, operations, and data pipelines</td>
                                <td>ETL and data pipeline orchestration within Azure</td>
                            </tr>
                            <tr>
                                <td>Language Support</td>
                                <td>Language-agnostic (YAML for orchestration)</td>
                                <td>No native scripting, limited to Azure-native transformations</td>
                            </tr>
                            <tr>
                                <td>Ease of Setup</td>
                                <td>Quick setup, scheduled workflow in minutes</td>
                                <td>Requires Azure account, complex permission setup</td>
                            </tr>
                            <tr>
                                <td>Developer Experience</td>
                                <td>Built-in code editor, live-updating DAG view, documentation, and blueprints</td>
                                <td>Drag-and-drop UI, limited flexibility for developers</td>
                            </tr>
                            <tr>
                                <td>Workflow Definitions</td>
                                <td>YAML-based, with inline scripting support (Python, JavaScript, SQL, Bash)</td>
                                <td>No-code visual editor, no built-in scripting support</td>
                            </tr>
                            <tr>
                                <td>Integration/Extensibility</td>
                                <td>Plugin ecosystem, REST API, webhooks, and event triggers</td>
                                <td>Primarily integrates with Azure services, limited external connectors</td>
                            </tr>
                            <tr>
                                <td>Cross-role Collaboration</td>
                                <td>Designed for all engineers and business users</td>
                                <td>Business-friendly but restrictive for engineers</td>
                            </tr>
                            <tr>
                                <td>Data Lineage & Debugging</td>
                                <td>Task-level metadata through metrics and outputs</td>
                                <td>Built-in monitoring via Azure services but lacks transparency</td>
                            </tr>
                            <tr>
                                <td>Business Logic Support</td>
                                <td>Supports SQL, Python, R, Rust, Bash, and more</td>
                                <td>No direct code support, relies on Azure functions for logic execution</td>
                            </tr>
                            <tr>
                                <td>No-Code / Low-code Interface</td>
                                <td>Low-code UI that fully replicates workflows as YAML, ensuring version control and flexibility</td>
                                <td>Drag-and-drop editor, but workflows are not automatically translated into code</td>
                            </tr>
                            <tr>
                                <td>Scalability</td>
                                <td>Runs on any cloud, allowing unlimited scaling across cloud and on-prem</td>
                                <td>Scales within Azure but can become expensive at higher workloads</td>
                            </tr>
                            <tr>
                                <td>Cloud Integrations</td>
                                <td>Works with AWS, GCP, Azure, and on-prem tools, supports event-driven and scheduled workflows</td>
                                <td>Limited to Microsoft technologies, with deep Azure integration but fewer external connectors</td>
                            </tr>
                            <tr>
                                <td>Vendor Lock-in</td>
                                <td>Fully open-source and can run on any cloud or on-prem</td>
                                <td>Proprietary solution restricted to the Azure ecosystem</td>
                            </tr>
                        </tbody>
                    </table>
        </div>
    </div>

    <LayoutFooterContact
        title="Getting Started"
        subtitle="Start building with Kestra — Automate Everything Everywhere All at Once."
        darkButtonText="Read the docs"
        purpleButtonText="Get started!"
    />

</template>

<script setup>
    import Typewriter from "vue-material-design-icons/Typewriter.vue";
    import BugOutline from "vue-material-design-icons/BugOutline.vue";
    import Lan from "vue-material-design-icons/Lan.vue";
    import Read from "vue-material-design-icons/Read.vue";
    import Git from "vue-material-design-icons/Git.vue";
    import AlertCircleOutline from "vue-material-design-icons/AlertCircleOutline.vue";
</script>

<script>
    import Section from '../../layout/Section.vue';

    export default {
        components: { Section }
    }
</script>

<style lang="scss" scoped>

    @import "../../../assets/styles/variable";

    table {
        margin-top: 5.625rem;
        border: 1px solid $black-9;

        thead {
            border-bottom: 1px solid $black-9;
        }

        th {
            background: $black-2;
            text-align: center;
        }

        td {
            background: $black-2;
            vertical-align: middle;

            &:first-of-type {
                text-align: center;
            }
        }
        th, td {
            padding: 1.375rem 2.938rem;
            color: $white;
            font-size: $font-size-md;
            font-weight: 300;
        }
    }

    section.about {
        border-bottom: $block-border;

        h2, h3 {
            color: $white;
            font-weight: 300;
            margin-bottom: 16px;

            span {
                background: linear-gradient(90deg, #E151F7 18.28%, #5C47F5 35.74%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        p, ul > li {
            color: $white;
            font-size: $h6-font-size;
            font-weight: 400;
        }

        :deep(.main) {
            display: flex;
            flex-direction: column;
            gap: 4rem;
            padding-top: 0;
        }
    }
</style>