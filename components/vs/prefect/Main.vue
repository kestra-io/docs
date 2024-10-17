<template>
    <div class="container">
        <Section class="about">
            <div>
                <h2>Kestra vs. Prefect</h2>
                <p>Kestra is an open-source orchestrator designed to bring Infrastructure as Code (IaC) best practices to all workflows — from those orchestrating mission-critical operations, business processes, and data pipelines to simple Zapier-style automations. Built with an API-first philosophy, Kestra enables users to define and manage data pipelines through a simple YAML configuration file. This approach frees you from being tied to a specific client implementation, allowing for greater flexibility and easier integration with various tools and services.</p>
                <p>While Prefect provides a flexible API, the orchestration logic is currently tied to Python only. Any change to your workflow configuration requires redeploying container images, leading to complex deployment patterns and slow feedback loops. Additionally, Prefect requires you to manage complicated infrastructure with workers and queues before you can schedule any workflow. Kestra is more lightweight — you can get to a scheduled workflow in less than 5 minutes without having to manage any complex infrastructure components. Kestra offers dedicated infrastructure provided with task runners and worker groups only when you need more control for advanced use cases.</p>
            </div>

             <div>
                <h3>Similarities</h3>
                <ul>
                <li>Both tools allow incremental adoption of the product — you can start simple and build more complex workflows over time.</li>
                <li>Both offer flexible API-first abstractions.</li>
                <li>Both allow modular and decoupled workflow design using subflows and event-driven triggers.</li>
                </ul>
             </div>

             <div>
                <h3>Differences</h3>
                <ul>
                <li>Prefect can orchestrate Python, while Kestra is language-agnostic.</li>
                <li>While Kestra’s event-driven capabilities are available in the open-source version, Prefect only offers event-driven features as part of Prefect Cloud.</li>
                <li>Kestra's event processing is unlimited — even in the open-source version. In contrast, Prefect allows no more than ten event-driven automations on the self-served tier. To orchestrate more events, you need to be on the Enterprise tier.</li>
                <li>Kestra's event triggers are more accessible than Prefect's events. In Prefect, you must click through multiple UI steps to configure event-driven automation. In contrast, Kestra allows you to manage that with code in a single YAML file.</li>
                <li>Kestra's syntax and deployment patterns are simpler. A single YAML file defines all tasks, triggers, orchestration, and deployment logic. In Prefect, you express your workflow in Python and need a YAML file for deployment and schedule definition and then other steps from a Cloud UI to define event triggers, effectively accomplishing the same what Kestra offers out-of-the-box but with a slower and more complicated setup, making the deployment process challenging to implement and maintain over time.</li>
                </ul>
             </div>

            <div>
                <h2>Installation and Setup</h2>
                <p>Kestra offers a Docker-based installation with a simple onboarding process. You can get up and running in a single command. The architecture in Prefect is more complex, requiring separate server, worker, and queue components, a dedicated workflow deployment process, and more infrastructure maintenance.</p>
            </div>

            <div class="mt-5">
                <h2>Modular, Scalable Architecture</h2>
                <p>Kestra's architecture is built for high availability and can handle a large volume of work simultaneously.</p>
                <p>Prefect, on the other hand, relies on Python, which limits its scalability due to issues with dependency management and concurrent processing.</p>
            </div>

            <div>
                <h2>Approach to Workflow Definitions</h2>
                <p>Kestra offers a language-agnostic, API-first, and YAML-based workflow definition interface. This design choice opens the door for engineers from diverse programming backgrounds and makes building integrations more manageable. By being language-agnostic, Kestra removes the learning curve often associated with adopting new technology, as engineers can use languages they are already comfortable with. The API-first architecture makes it simple to interface Kestra with existing systems.</p>
                <p>At the time of writing, Prefect can only orchestrate Python, narrowing its utility mainly to Python engineers. It imposes a barrier to entry for engineers who are not well-versed in managing Python dependencies and working with that language, thereby limiting cross-team collaboration.</p>
            </div>

            <div>
                <h2>Workflow Deployment</h2>
                <p>You can add new workflows in Kestra directly from the code editor built into the UI. To manage production workflows with Git, Kestra offers a Terraform provider and integrations with CI/CD systems, including GitHub Actions, BitBucket, GitLab CI, and Azure DevOps.</p>
                <p>Prefect deployments require packaging Python code into container images, leading to slow feedback loops and heavy deployment processes. As you scale the number of workflows to thousands, you'll also have to manage thousands of container images. It adds significant storage and maintenance costs.</p>
            </div>

            <div>
                <h2>Developer Experience</h2>
                <p>Prefect’s UI is focused only on observing past events and deployment artifacts, while Kestra helps you proactively build better workflows by embedding blueprints, documentation, code editor, revision history, and a live-updating topology view.</p>
            </div>

            <div>
                <h2>Cross-role Collaboration and Accessibility</h2>
                <p>Kestra's user-friendly interface is designed for cross-role collaboration, inviting not just engineers but also business stakeholders. Prefect is a developer tool — it doesn't offer features for non-technical team members. Prefect can orchestrate Python — Kestra can orchestrate your entire business.</p>
            </div>
        </Section>

        <div class="table-responsive mb-5">
            <table class="table table-bordered mb-0">
                <thead>
                    <tr>
                        <th>Capability</th>
                        <th>Kestra</th>
                        <th>Prefect</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Incremental Adoption</td>
                        <td>✓</td>
                        <td>✓</td>
                    </tr>
                    <tr>
                        <td>API-first </td>
                        <td>✓</td>
                        <td>✓</td>
                    </tr>
                    <tr>
                        <td>Simple Deployment Patterns</td>
                        <td>✓</td>
                        <td>X</td>
                    </tr>
                    <tr>
                        <td>Language-agnostic</td>
                        <td>✓</td>
                        <td>X (Python-only)</td>
                    </tr>
                    <tr>
                        <td>Event-Driven Workflows</td>
                        <td>✓</td>
                        <td>✓</td>
                    </tr>
                    <tr>
                        <td>Event Configuration in Code</td>
                        <td>✓</td>
                        <td>X (requires many UI steps)</td>
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
