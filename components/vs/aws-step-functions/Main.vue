<template>
    <div class="container">
        <Section class="about">
            <div>
                <h2>About <span>Kestra</span> & AWS Step Functions</h2>
                <p>Kestra is an open-source workflow orchestrator that applies Infrastructure as Code principles to automation workflows. Users define workflows using a YAML-based configuration while keeping everything as code—fully declarative, extensible, and API-driven. This allows for greater flexibility and seamless integration across cloud, on-prem, and hybrid environments without relying on proprietary languages.</p>
                <p>AWS Step Functions, on the other hand, is a proprietary AWS service designed for orchestrating workflows within the AWS ecosystem. It uses Amazon States Language (ASL), a JSON-based DSL, to define workflows and provides a low-code visual editor. While it integrates deeply with AWS services, it remains tightly coupled with the AWS infrastructure and pricing model.</p>
            </div>

            <div>
                <h2>Installation and Setup</h2>
                <p>AWS Step Functions is a managed service, meaning there is no installation required, but it is only available within AWS. Users must configure IAM permissions, integrate with other AWS services, and deploy workflows using ASL.</p>
                <p>Kestra, being self-hosted can be deployed with Docker, Kubernetes, or Terraform in any environment. Installation is straightforward, allowing full control over execution and data residency.</p>
            </div>

            <div>
                <h2>Workflow Definition</h2>
                <p>Kestra uses a simple YAML format that is easy to read and modify. It supports inline scripting in multiple languages such as Python, JavaScript, SQL, and Shell, without external dependencies.</p>
                <p>AWS Step Functions uses ASL, a JSON-based format that is less readable and harder to manage at scale. More complex workflows require additional AWS services like Lambda for logic execution.</p>
                <p>Kestra provides a language-agnostic approach, while AWS Step Functions locks users into ASL and AWS Lambda for advanced logic.</p>
            </div>

            <div>
                <h2>Orchestration Flexibility</h2>
                <p>Kestra is designed to be technology-agnostic and can orchestrate cloud, on-prem, and hybrid workflows.</p>
                <p>AWS Step Functions is tightly integrated with AWS services but limited in multi-cloud and hybrid setups.</p>
                <p>Kestra’s event-driven architecture allows workflows to trigger based on external APIs, message queues, or scheduled events. AWS Step Functions requires AWS-native services for triggering workflows, making external integrations more complex.</p>
            </div>

            <div>
                <h2>Execution, Scalability, and Performance</h2>
                <p>Kestra runs on any cloud provider, allowing users to scale workflows dynamically. It is designed for high-throughput data processing and long-running workflows.</p>
                <p>AWS Step Functions is serverless but limited to AWS infrastructure. Workflow execution is billed per state transition, which can become costly for large-scale automation.</p>
                <p>Kestra offers full control over execution and costs, while AWS Step Functions scales automatically but locks users into AWS pricing models.</p>
            </div>

            <div>
                <h2>Monitoring and Observability</h2>
                <p>Kestra comes with built-in workflow monitoring, logs, and real-time execution tracking.</p>
                <p>AWS Step Functions relies on AWS CloudWatch for logging and monitoring, which requires additional configuration and costs.</p>
                <p>Kestra provides out-of-the-box observability, while AWS Step Functions requires additional AWS services for logging and monitoring.</p>
            </div>

            <div>
                <h2>Open-Source vs. Proprietary</h2>
                <p>Kestra is fully open-source, with an active community and enterprise options for advanced needs.</p>
                <p>AWS Step Functions is a proprietary AWS service, locking workflows within the AWS ecosystem.</p>
                <p>Kestra allows for vendor independence, while AWS Step Functions ties users to AWS infrastructure and pricing.</p>
            </div>

            <div>
                <h2>Cost Considerations</h2>
                <p>Kestra is self-hosted, offering predictable costs.</p>
                <p>AWS Step Functions uses a pay-per-state transition pricing model, making it difficult to estimate costs upfront.</p>
                <p>Kestra provides cost-effective orchestration, while AWS Step Functions can become expensive depending on workflow complexity.</p>
            </div>
        </Section>

        <div class="table-responsive mb-5">
            <table class="table table-bordered mb-0">
                <thead>
                    <tr>
                        <th>Feature/Aspect</th>
                        <th>Kestra</th>
                        <th>AWS Step Functions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Installation</td>
                        <td>Self-hosted with Docker, Kubernetes, or Terraform.</td>
                        <td>Managed service, AWS-only.</td>
                    </tr>
                    <tr>
                        <td>Workflow Definition</td>
                        <td>YAML-based, supports inline scripting.</td>
                        <td>JSON-based ASL, requires AWS Lambda for logic.</td>
                    </tr>
                    <tr>
                        <td>Orchestration Flexibility</td>
                        <td>Multi-cloud, hybrid, and on-prem orchestration.</td>
                        <td>Limited to AWS services.</td>
                    </tr>
                    <tr>
                        <td>Scalability</td>
                        <td>Runs on any cloud, scales dynamically.</td>
                        <td>Serverless but limited to AWS infrastructure.</td>
                    </tr>
                    <tr>
                        <td>Monitoring</td>
                        <td>Built-in monitoring, logs, and observability.</td>
                        <td>Relies on AWS CloudWatch (additional cost).</td>
                    </tr>
                    <tr>
                        <td>Vendor Lock-in</td>
                        <td>Open-source, flexible deployment.</td>
                        <td>Proprietary AWS-only service.</td>
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