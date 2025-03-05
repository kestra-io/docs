<template>
    <div class="container">
        <Section class="about">
            <div>
    <h2>About <span>Kestra</span> & Dollar Universe Workload Automation</h2>
    <p>Kestra is an open-source workflow orchestrator designed for modern cloud, on-prem, and hybrid environments. It applies Infrastructure as Code principles to automation workflows, using a declarative, YAML-based approach. With an API-first architecture, Kestra seamlessly integrates across cloud-native, event-driven, and microservices architectures, making it a flexible and scalable orchestration and scheduling solution.</p>
    <p>Additionally, Kestra provides real-time execution tracking, advanced monitoring, and an extensive plugin ecosystem, enabling users to automate complex data pipelines, infrastructure provisioning, and application workflows. Its support for dynamic scaling ensures optimal resource utilization across multi-cloud and hybrid environments.</p>
    <p>Dollar Universe, part of Broadcom's workload automation suite, is a proprietary enterprise scheduler focused on managing batch jobs across traditional IT environments. It is widely used in large-scale IT operations that require deterministic scheduling across Windows, Unix, and iSeries environments. While it provides event-driven scheduling, it remains tightly coupled to Broadcom’s ecosystem and lacks deep cloud-native support.</p>
    <p>Despite offering essential workload automation capabilities, Dollar Universe’s reliance on static scheduling and Broadcom’s ecosystem makes it less flexible in modern, cloud-native environments. Integrating it with hybrid or multi-cloud architectures requires additional tools and workarounds, increasing complexity and cost.</p>
</div>

<div>
    <h2>Deployment and Setup</h2>
    <p><strong>Kestra:</strong> Built for flexibility, Kestra supports deployment via Docker, Kubernetes, and Terraform in any environment—on-premise, hybrid, or multi-cloud. It provides a streamlined setup process and easily integrates with modern DevOps workflows, ensuring teams can automate and scale workloads efficiently.</p>
    <p><strong>Dollar Universe:</strong> Primarily optimized for on-premise deployment across Windows, Unix, and iSeries environments. It offers cloud support but lacks deep integration with cloud-native tools, making it more rigid compared to modern solutions. Deployment often requires additional configurations and dependencies within Broadcom’s ecosystem.</p>
</div>

<div>
    <h2>Workflow Definition</h2>
    <p><strong>Kestra:</strong> Uses a YAML-based declarative configuration, making workflows version-controlled and easier to integrate into modern DevOps practices. This approach enables teams to collaborate efficiently, maintain workflow history, and adopt Infrastructure as Code methodologies.</p>
    <p><strong>Dollar Universe:</strong> Relies on script-based and configuration-driven workflow definitions, making complex workflows harder to maintain, modify, and scale. The lack of native version control and declarative structure increases the risk of configuration drift and maintenance overhead.</p>
</div>

<div>
    <h2>Scalability and Performance</h2>
    <p><strong>Kestra:</strong> Dynamically scales based on workload demand, supporting Kubernetes and serverless architectures. It is optimized for event-driven and parallel processing, ensuring high performance for modern automation needs. Workflows can scale horizontally across distributed environments, making it ideal for handling high-throughput data processing.</p>
    <p><strong>Dollar Universe:</strong> Optimized for static, on-prem workloads, making it difficult to scale dynamically in cloud environments. It lacks the flexibility needed for real-time, event-driven workloads and struggles with unpredictable demand spikes. Scaling often requires manual intervention and additional infrastructure provisioning.</p>
</div>

<div>
    <h2>Observability and Monitoring</h2>
    <p><strong>Kestra:</strong> Provides built-in real-time monitoring, execution history, and detailed logging, enabling developers to gain deep insights into workflow performance and quickly troubleshoot failures. Kestra also offers integration with tools like Prometheus and OpenTelemetry for extended observability.</p>
    <p><strong>Dollar Universe:</strong> Offers basic monitoring but lacks deep execution history and comprehensive real-time tracking. Advanced monitoring capabilities require additional Broadcom tools, increasing complexity and cost. Debugging workflows can be challenging due to limited visibility into execution dependencies.</p>
</div>

<div>
    <h2>Vendor Lock-in and Cost Considerations</h2>
    <p><strong>Kestra:</strong> Fully open-source, allowing organizations to avoid vendor lock-in and unexpected licensing costs. Users can self-host or opt for managed services, maintaining full control over their orchestration platform. The open-source model encourages community-driven innovation and extensibility.</p>
    <p><strong>Dollar Universe:</strong> A proprietary solution with increasing costs under Broadcom’s ownership. Many enterprises have reported significant price hikes following Broadcom’s acquisition of software products, leading to financial strain and limited flexibility. Long-term dependency on a single vendor can result in high migration costs if transitioning to a more modern solution.</p>
</div>

        </Section>

        <div class="table-responsive mb-5">
    <table class="table table-bordered mb-0">
        <thead>
            <tr>
                <th>Feature</th>
                <th>Kestra</th>
                <th>Dollar Universe</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Architecture</td>
                <td>Cloud-native, microservices-friendly</td>
                <td>Traditional enterprise scheduling</td>
            </tr>
            <tr>
                <td>Deployment Flexibility</td>
                <td>Supports Docker, Kubernetes, Terraform, and multi-cloud environments</td>
                <td>Optimized for on-prem, Windows, Unix, and iSeries; limited cloud support</td>
            </tr>
            <tr>
                <td>Workflow Definition</td>
                <td>YAML-based, declarative, version-controlled</td>
                <td>Script-based and configuration-driven</td>
            </tr>
            <tr>
                <td>API-First Approach</td>
                <td>Fully API-driven with REST and webhooks</td>
                <td>Provides SOAP & REST APIs but has limited modern cloud integrations</td>
            </tr>
            <tr>
                <td>Event-Driven Execution</td>
                <td>Native support for event-driven workflows (Kafka, SQS, Pub/Sub, etc.)</td>
                <td>Event triggers for system events (file changes, database updates, etc.), but lacks real-time event capabilities</td>
            </tr>
            <tr>
                <td>Monitoring & Observability</td>
                <td>Built-in real-time logs, execution history, UI-based monitoring</td>
                <td>Basic monitoring; lacks real-time execution history and workflow dependency insights</td>
            </tr>
            <tr>
                <td>Scalability</td>
                <td>Auto-scales dynamically in cloud and hybrid environments</td>
                <td>Optimized for static, on-prem scaling; lacks cloud elasticity</td>
            </tr>
            <tr>
                <td>Extensibility & Plugins</td>
                <td>Extensive plugin ecosystem for external integrations</td>
                <td>Primarily integrates with Broadcom solutions; limited third-party plugins</td>
            </tr>
            <tr>
                <td>Data & Business Process Automation</td>
                <td>Supports data pipelines, infrastructure automation, and microservices orchestration</td>
                <td>Primarily focuses on job scheduling and business process automation</td>
            </tr>
            <tr>
                <td>Multi-Cloud & Hybrid</td>
                <td>Works across AWS, Azure, GCP, and on-prem</td>
                <td>Lacks deep cloud-native integrations</td>
            </tr>
            <tr>
                <td>Open-Source vs Proprietary</td>
                <td>Fully open-source, community-driven with enterprise options</td>
                <td>Proprietary, licensed product from Broadcom</td>
            </tr>
            <tr>
                <td>Vendor Lock-in</td>
                <td>No vendor lock-in, flexible deployment</td>
                <td>Proprietary with increasing licensing costs and Broadcom dependency</td>
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