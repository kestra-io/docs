<template>
    <div class="container">
        <Section class="about">
            <div>
                <h2>About <span>Kestra</span> & Dollar Universe Workload Automation</h2>
                <p>Kestra is an open-source workflow orchestrator designed for modern cloud, on-prem, and hybrid environments. It applies Infrastructure as Code principles to automation workflows, using a declarative, YAML-based approach. With an API-first architecture, Kestra seamlessly integrates across cloud-native, event-driven, and microservices architectures, making it a flexible and scalable orchestration and scheduling solution.</p>
                <p>Dollar Universe, part of Broadcom's workload automation suite, is a proprietary enterprise scheduler focused on managing batch jobs across traditional IT environments. While it provides event-driven scheduling, it remains tightly coupled to Broadcom’s ecosystem and lacks deep cloud-native support.</p>
            </div>

            <div>
                <h2>Deployment and Setup</h2>
                <p>Dollar Universe is primarily optimized for on-premise deployment across Windows, Unix, and iSeries environments. It offers cloud support but lacks deep integration with cloud-native tools, making it more rigid compared to modern solutions.</p>
                <p>Kestra is built for flexibility, supporting deployment via Docker, Kubernetes, and Terraform in any environment—on-premise, hybrid, or multi-cloud.</p>
            </div>

            <div>
                <h2>Workflow Definition</h2>
                <p>Kestra uses a YAML-based declarative configuration, making workflows version-controlled and easier to integrate into modern DevOps practices.</p>
                <p>Dollar Universe relies on script-based and configuration-driven workflow definitions, making complex workflows harder to maintain, modify, and scale.</p>
            </div>

            <div>
                <h2>Scalability and Performance</h2>
                <p>Kestra dynamically scales based on workload demand, supporting Kubernetes and serverless architectures. It is optimized for event-driven and parallel processing, ensuring high performance for modern automation needs.</p>
                <p>Dollar Universe is optimized for static, on-prem workloads, making it difficult to scale dynamically in cloud environments. It lacks the flexibility needed for real-time, event-driven workloads.</p>
            </div>

            <div>
                <h2>Observability and Monitoring</h2>
                <p>Kestra provides built-in real-time monitoring, execution history, and detailed logging, enabling developers to gain deep insights into workflow performance and quickly troubleshoot failures.</p>
                <p>Dollar Universe offers basic monitoring but lacks deep execution history and comprehensive real-time tracking. Advanced monitoring capabilities require additional Broadcom tools, increasing complexity and cost.</p>
            </div>

            <div>
                <h2>Vendor Lock-in and Cost Considerations</h2>
                <p>Kestra is fully open-source, allowing organizations to avoid vendor lock-in and unexpected licensing costs. Users can self-host or opt for managed services, maintaining full control over their orchestration platform.</p>
                <p>Dollar Universe is a proprietary solution with increasing costs under Broadcom’s ownership. Many enterprises have reported significant price hikes following Broadcom’s acquisition of software products, leading to financial strain and limited flexibility.</p>
            </div>
        </Section>

        <div class="table-responsive mb-5">
            <table class="table table-bordered mb-0">
                <thead>
                    <tr>
                        <th>Feature/Aspect</th>
                        <th>Kestra</th>
                        <th>Dollar Universe</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Deployment</td>
                        <td>Docker, Kubernetes, Terraform, multi-cloud.</td>
                        <td>Optimized for on-prem, limited cloud support.</td>
                    </tr>
                    <tr>
                        <td>Workflow Definition</td>
                        <td>Declarative YAML-based, version-controlled.</td>
                        <td>Script-based, configuration-driven.</td>
                    </tr>
                    <tr>
                        <td>Scalability</td>
                        <td>Dynamically scales with demand.</td>
                        <td>Static scaling, lacks cloud elasticity.</td>
                    </tr>
                    <tr>
                        <td>Monitoring</td>
                        <td>Built-in real-time logs and execution tracking.</td>
                        <td>Basic monitoring, lacks deep insights.</td>
                    </tr>
                    <tr>
                        <td>Vendor Lock-in</td>
                        <td>Open-source, no lock-in.</td>
                        <td>Proprietary, tied to Broadcom ecosystem.</td>
                    </tr>
                    <tr>
                        <td>Cost</td>
                        <td>Predictable, self-hosted options available.</td>
                        <td>Increasing licensing costs, vendor-imposed restrictions.</td>
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