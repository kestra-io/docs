<template>
    <div class="container">
        <Section class="about">
            <h1>The Differences Between Kestra and Google Workflows</h1>

<div>
    <h2>About Kestra & Google Workflows</h2>
    <p>Kestra is an open-source orchestration platform that enables the automation of complex workflows across cloud, on-prem, and hybrid environments. It follows an everything-as-code approach, with YAML-based workflow definitions, an API-first architecture, and an extensible plugin ecosystem. Combining a no-code/low-code UI with direct YAML editing, Kestra provides flexibility for both technical and non-technical users.</p>
    <p>Google Workflows, a cloud-based orchestration service provided by Google Cloud, focuses on sequencing steps for Google Cloud services. While it offers a simple YAML or JSON definition for workflows, it lacks critical enterprise-grade orchestration features. With no built-in UI for workflow design, debugging, or real-time observability, and no native plugin ecosystem, Google Workflows is best suited for Google Cloud-centric tasks but struggles in multi-cloud or hybrid environments.</p>
</div>

<div>
    <h2>Installation and Setup</h2>
    <p>Kestra provides a highly flexible deployment model, supporting Docker, Kubernetes, and Terraform. It can run on any cloud provider, on-premises, or in hybrid environments, ensuring full control over execution, security, and data residency.</p>
    <p>Google Workflows, on the other hand, is fully managed by Google Cloud, with no option for on-prem installation. Setting it up requires enabling the Workflows API within a Google Cloud project. However, using it outside of Google Cloud demands extensive development effort, including building web services to create bridges between external systems.</p>
</div>

<div>
    <h2>Workflow Definition</h2>
    <p>Kestra workflows are defined in YAML, offering clarity and maintainability. With inline scripting in Python, JavaScript, SQL, and Bash, users can integrate custom logic directly. Its no-code editor allows workflows to be designed visually while automatically generating the corresponding YAML code for version control. Additionally, Kestra’s plugin ecosystem extends workflow capabilities beyond default functions.</p>
    <p>Google Workflows also uses YAML or JSON but lacks a UI-based workflow designer. Its built-in DSL (domain-specific language) offers limited flexibility, requiring users to implement custom logic through REST calls or external services. Unlike Kestra, it does not have a plugin system, making extending its functionality more cumbersome. Pebble templating support is also limited, restricting customization options.</p>
</div>

<div>
    <h2>Scalability and Performance</h2>
    <p>Kestra dynamically scales across distributed environments, optimized for both event-driven and scheduled workflows. Its open architecture ensures seamless operation across multiple clouds or on-prem environments without vendor-imposed restrictions.</p>
    <p>Google Workflows leverages Google Cloud’s infrastructure for scaling but remains tied to the GCP ecosystem. While it can handle large-scale tasks within Google Cloud, orchestrating workflows outside of GCP introduces additional complexity, including costs and development overhead.</p>
</div>

<div>
    <h2>Integration Capabilities</h2>
    <p>Kestra provides extensive integrations through its plugin ecosystem, supporting AWS, GCP, Azure, BigQuery, Snowflake, Kafka, dbt, Airbyte, and more. With an API-first approach, it facilitates seamless orchestration across different cloud providers, on-prem infrastructure, and SaaS applications.</p>
    <p>Google Workflows is deeply integrated into Google Cloud services such as Cloud Functions, Cloud Run, and Google APIs. However, it does not support native plugins for third-party services. To connect with external platforms, users must implement custom REST calls, adding complexity and maintenance overhead.</p>
</div>

<div>
    <h2>Monitoring and Observability</h2>
    <p>Kestra offers built-in monitoring, real-time execution tracking, and logging. Users can visualize workflow performance through custom dashboards and access detailed task-level logs for easier debugging.</p>
    <p>Google Workflows relies on Google Cloud Logging and Monitoring for observability, requiring users to configure multiple services to track workflow execution. Without a dedicated UI for debugging, troubleshooting issues is more complex compared to Kestra’s out-of-the-box solutions.</p>
</div>

<div>
    <h2>Open-Source vs. Proprietary</h2>
    <p>Kestra is a fully open-source platform with an active community and optional enterprise add-ons. Its open architecture allows organizations to deploy in any environment without vendor lock-in. The transparency of its codebase enables deeper customization and community-driven enhancements.</p>
    <p>Google Workflows is a proprietary service tied to Google Cloud. Organizations using it are locked into GCP’s infrastructure, APIs, and billing model, with limited extensibility beyond Google’s ecosystem.</p>
</div>

            <div class="table-responsive mb-5">
                <table class="table table-bordered mb-0">
                    <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Kestra</th>
                                <th>Google Cloud Composer</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Core Focus</td>
                                <td>Orchestrating workflows, tasks, operations, and data pipelines across any cloud or on-prem</td>
                                <td>Workflow orchestration within GCP, primarily for managing Airflow DAGs in Google Cloud</td>
                            </tr>
                            <tr>
                                <td>Language Support</td>
                                <td>Language-agnostic (YAML for orchestration, inline scripting in Python, JavaScript, SQL, Bash, etc.)</td>
                                <td>Limited to Python-based Airflow DAGs, requiring deep Python expertise</td>
                            </tr>
                            <tr>
                                <td>Ease of Setup</td>
                                <td>Quick setup with Docker, Kubernetes, and Terraform; deployable anywhere</td>
                                <td>Fully managed but requires a Google Cloud project; complex networking and permission setup needed</td>
                            </tr>
                            <tr>
                                <td>Developer Experience</td>
                                <td>Built-in code editor, real-time DAG visualization, documentation, blueprints, and UI-based workflow design</td>
                                <td>No native UI for workflow creation; must define workflows manually in Airflow’s Python DSL</td>
                            </tr>
                            <tr>
                                <td>Workflow Definitions</td>
                                <td>YAML-based, declarative, and modular; includes inline scripting for flexibility</td>
                                <td>Python-based DAGs with no visual editor or UI-based workflow creation</td>
                            </tr>
                            <tr>
                                <td>Integration & Extensibility</td>
                                <td>Plugin ecosystem supporting AWS, GCP, Azure, on-prem, and third-party tools; REST API, webhooks, and event triggers</td>
                                <td>No built-in plugin system; must develop custom Airflow operators for third-party integrations</td>
                            </tr>
                            <tr>
                                <td>Cross-role Collaboration</td>
                                <td>Designed for engineers, data teams, and business users with low-code/no-code UI</td>
                                <td>Engineer-focused; requires Python skills, limiting accessibility to non-developers</td>
                            </tr>
                            <tr>
                                <td>Data Lineage & Debugging</td>
                                <td>Task-level metadata, built-in logs, real-time execution tracking, and custom dashboards</td>
                                <td>No native debugging tools; logs scattered across Cloud Logging, making troubleshooting complex</td>
                            </tr>
                            <tr>
                                <td>Business Logic Support</td>
                                <td>Supports Python, JavaScript, SQL, Bash, R, Rust, and more; flexible inline scripting</td>
                                <td>Airflow-based Python DAGs; no built-in support for business logic beyond Python tasks</td>
                            </tr>
                            <tr>
                                <td>No-Code / Low-Code Interface</td>
                                <td>No-code UI that translates to YAML for version control and flexibility</td>
                                <td>No built-in UI for defining workflows; must manually write Airflow DAGs in Python</td>
                            </tr>
                            <tr>
                                <td>Scalability</td>
                                <td>Runs on Kubernetes with dynamic scaling across cloud and on-prem environments</td>
                                <td>Scales within GCP, but can become expensive and rigid for multi-cloud or hybrid workloads</td>
                            </tr>
                            <tr>
                                <td>Cloud Integrations</td>
                                <td>Multi-cloud support (AWS, GCP, Azure, on-prem); integrates with event-driven and scheduled workflows</td>
                                <td>Deeply integrated with GCP services but requires complex workarounds for multi-cloud or external system integrations</td>
                            </tr>
                            <tr>
                                <td>Vendor Lock-in</td>
                                <td>Fully open-source, cloud-agnostic, and self-hostable</td>
                                <td>Proprietary solution locked into GCP; integrating outside Google services requires additional development</td>
                            </tr>
                            <tr>
                                <td>Triggering System</td>
                                <td>Built-in event triggers, webhooks, and scheduling</td>
                                <td>No native triggering system; users must develop web services to enable triggers</td>
                            </tr>
                            <tr>
                                <td>Managing Dependencies Between Workflows</td>
                                <td>Supports dependency management natively; allows workflows to trigger other workflows</td>
                                <td>No native dependency management between DAGs; users must build custom logic to coordinate workflows</td>
                            </tr>
                            <tr>
                                <td>Custom Development & Extensibility</td>
                                <td>Fully customizable with open-source plugins, integrations, and custom tasks</td>
                                <td>No support for custom development beyond standard Airflow DAGs</td>
                            </tr>
                            <tr>
                                <td>Query Execution Complexity</td>
                                <td>Simple queries are easily handled via inline SQL scripting or built-in integrations</td>
                                <td>Even basic queries require defining operators, writing custom Python scripts, and managing task dependencies manually</td>
                            </tr>
                            <tr>
                                <td>Templating (Pebble)</td>
                                <td>Customizable templating system for workflow parameters and task execution</td>
                                <td>Limited templating flexibility, requiring workarounds to adapt logic</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            <div>
                <h2>Key Takeaways</h2>
                <ul>
                    <li><strong>UI & Workflow Management:</strong> Kestra offers a no-code UI and YAML-based workflow definitions, while Google Cloud Composer requires Airflow DAGs written in Python without any visual interface.</li>
                    <li><strong>Extensibility & Custom Development:</strong> Kestra allows for custom development via plugins, scripting, and modular workflows, whereas Composer is rigid, requiring extensive development to extend functionality.</li>
                    <li><strong>Multi-Cloud & Vendor Lock-In:</strong> Kestra runs anywhere (AWS, GCP, Azure, on-prem), while Composer is deeply tied to Google Cloud, making hybrid or multi-cloud orchestration difficult.</li>
                    <li><strong>Debugging & Monitoring:</strong> Kestra provides real-time logs and execution tracking, whereas Composer users must navigate multiple GCP services to gather logs and troubleshoot workflows.</li>
                    <li><strong>Triggering & Dependencies:</strong> Kestra natively supports triggers and dependency management, while Composer lacks built-in triggering, requiring additional services to bridge workflows.</li>
                </ul>
                <p>If you are fully committed to Google Cloud and need basic workflow sequencing for GCP services with minimal external dependencies, <strong>Google Workflows</strong> may be sufficient, but with significant limitations in flexibility, monitoring, and customization.</p>
            </div>
        </Section>
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
        components: {Section}
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
