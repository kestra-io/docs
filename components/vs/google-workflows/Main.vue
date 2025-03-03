<template>
    <div class="container">
        <Section class="about">
            <div>
                <h2>The Differences Between Kestra and Google Workflows</h2>
                <p>Kestra is an open-source orchestration platform that enables automation across cloud, on-prem, and hybrid environments. With an everything-as-code approach, YAML-based workflow definitions, and an extensible plugin ecosystem, it provides flexibility for both technical and non-technical users.</p>
                <p>Google Workflows is a cloud-based orchestration service designed for sequencing Google Cloud services. It lacks enterprise-grade orchestration features, has no built-in UI for workflow design, and is limited in multi-cloud or hybrid environments.</p>
            </div>

            <div>
                <h3>Installation and Setup</h3>
                <p>Kestra supports Docker, Kubernetes, and Terraform, allowing deployment across cloud providers and on-premises. Google Workflows is fully managed by Google Cloud with no on-prem installation option.</p>
            </div>

            <div>
                <h3>Workflow Definition</h3>
                <p>Kestra workflows are defined in YAML with inline scripting support (Python, JavaScript, SQL, Bash). It includes a no-code editor for visual design and a plugin ecosystem for extended functionality.</p>
                <p>Google Workflows also uses YAML or JSON but lacks a UI-based designer and a plugin system. Custom logic must be implemented through REST calls.</p>
            </div>

            <div>
                <h3>Scalability and Performance</h3>
                <p>Kestra dynamically scales across distributed environments, supporting both event-driven and scheduled workflows.</p>
                <p>Google Workflows scales within GCP but faces complexity when integrating external services.</p>
            </div>

            <div>
                <h3>Integration Capabilities</h3>
                <p>Kestra offers extensive integrations via plugins, supporting AWS, GCP, Azure, BigQuery, Snowflake, Kafka, and more.</p>
                <p>Google Workflows integrates deeply with Google services but lacks native support for third-party tools, requiring custom REST calls.</p>
            </div>

            <div>
                <h3>Monitoring and Observability</h3>
                <p>Kestra provides built-in monitoring, real-time execution tracking, and logging.</p>
                <p>Google Workflows relies on Google Cloud Logging and Monitoring, requiring multiple services for tracking execution.</p>
            </div>

            <div>
                <h3>Open-Source vs. Proprietary</h3>
                <p>Kestra is fully open-source with an active community and enterprise add-ons. It avoids vendor lock-in and supports deep customization.</p>
                <p>Google Workflows is a proprietary GCP service, locking organizations into its infrastructure and billing model.</p>
            </div>

            <div class="table-responsive mb-5">
                <table class="table table-bordered mb-0">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Kestra</th>
                            <th>Google Workflows</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Deployment</td>
                            <td>Docker, Kubernetes, Terraform</td>
                            <td>Fully managed on GCP only</td>
                        </tr>
                        <tr>
                            <td>Workflow Definition</td>
                            <td>YAML with inline scripting</td>
                            <td>YAML or JSON with REST calls</td>
                        </tr>
                        <tr>
                            <td>UI Support</td>
                            <td>Yes (no-code editor + YAML)</td>
                            <td>No UI for workflow design</td>
                        </tr>
                        <tr>
                            <td>Scalability</td>
                            <td>Multi-cloud & hybrid environments</td>
                            <td>Limited to Google Cloud</td>
                        </tr>
                        <tr>
                            <td>Monitoring & Logging</td>
                            <td>Built-in tracking and dashboards</td>
                            <td>Requires Google Cloud Logging</td>
                        </tr>
                        <tr>
                            <td>Integration</td>
                            <td>Plugin ecosystem with multi-cloud support</td>
                            <td>Google services only, no plugin support</td>
                        </tr>
                        <tr>
                            <td>Vendor Lock-in</td>
                            <td>No, fully open-source</td>
                            <td>Yes, tied to GCP</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <h2>Key Takeaways</h2>
                <ul>
                    <li><strong>UI & Workflow Management:</strong> Kestra has a no-code UI; Google Workflows requires manual YAML/JSON definitions.</li>
                    <li><strong>Extensibility:</strong> Kestra supports plugins; Google Workflows requires custom development for external integrations.</li>
                    <li><strong>Multi-Cloud Support:</strong> Kestra runs anywhere; Google Workflows is tied to GCP.</li>
                    <li><strong>Debugging & Monitoring:</strong> Kestra has built-in tracking; Google Workflows relies on Cloud Logging.</li>
                    <li><strong>Triggering & Dependencies:</strong> Kestra natively supports triggers and dependencies; Google Workflows requires external solutions.</li>
                </ul>
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
