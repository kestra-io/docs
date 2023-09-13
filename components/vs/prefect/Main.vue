<template>
    <div class="container">
        <Section>
            <div>
                <h2>About Kestra & Prefect</h2>
                <p>Kestra is an open-source orchestrator designed to bring Infrastructure as Code (IaC) best practices to all workflows — from those orchestrating mission-critical operations, business processes, and data pipelines to simple Zapier-style automations. Built with an API-first philosophy, Kestra enables users to define and manage data pipelines through a simple YAML configuration file. This approach frees you from being tied to a specific client implementation, allowing for greater flexibility and easier integration with various tools and services.</p>
                <p>While Prefect provides a flexible API, the orchestration logic is currently tied to Python only. Any change to your workflow configuration requires redeploying container images, leading to complex deployment patterns and slow feedback loops. Additionally, Prefect requires you to manage complicated infrastructure with workers and queues before you can schedule any workflow. Kestra is more lightweight — you can get to a scheduled workflow in less than 5 minutes without having to manage any complex infrastructure components. Kestra offers worker groups only when you need more control for advanced use cases.</p>
            </div>

             <div clas="mt-5">
                <h2>Similarities</h2>
                <ul>
                <li>Both tools allow incremental adoption of the product — you can start simple and build more complex workflows over time.</li>
                <li>Both are focused on building flexible API-first abstractions.</li>
                <li>Both allow event-driven workflows and subflows to allow modular and decoupled workflow design.</li>
                </ul>
             </div>

             <div clas="mt-5">
                <h2>Differences</h2>
                <ul>
                <li>Prefect can orchestrate Python, while Kestra is language-agnostic.</li>
                <li>While Kestra’s event-driven capabilities are available in the open-source version, Prefect only offers event-driven features as part of the paid product, Prefect Cloud.</li>
                <li>Kestra’s event processing is unlimited — even in the open-source version. In contrast, Prefect allows you to add no more than 10 event-driven automation on their SaaS offering. To orchestrate more events, you need to be on the Enterprise tier.</li>
                <li>Kestra’s event triggers are easier to configure than Prefect events. In Prefect, you have to click through multiple UI steps to configure event-driven automation. In contrast, Kestra allows you to manage that with code in a single YAML file.</li>
                <li>Kestra’s syntax and deployment patterns are simpler. All tasks, triggers, orchestration, and deployment logic can be defined in a single YAML file. In Prefect, you define your workflow in Python and then you also need a YAML file for deployment definition.</li>
                </ul>
             </div>

            <div class="mt-5">
                <h2>Installation and Setup</h2>
                <p>Kestra offers a Docker-based installation that simplifies the onboarding process, requiring just a few commands to get up and running.  In the Open source version of Prefect, the architecture is divided into a control plane (Server) and an execution plane (Agent), each requiring separate installations. This separation adds complexity to the setup, as users have to ensure coordination between server components and agents.</p>
            </div>

            <div class="mt-5">
                <h2>Modular, Scalable Architecture</h2>
                <p>Kestra's architecture, built on microservices and technologies like Postgres and Kafka, is engineered for high scalability and can handle large volumes of work simultaneously.</p> 
                <p>Prefect, on the other hand, relies on Python, which limits its scalability due to issues with dependency management and concurrent processing.</p>
            </div>

            <div class="mt-5">
                <h2>Approach to Workflow Definitions</h2>
                <p>Kestra offers a language-agnostic, API-first, and YAML-based workflow definition interface. This design choice opens the door for engineers from diverse programming backgrounds, and it fosters easier integration with various tools and systems. By being language-agnostic, Kestra removes the learning curve often associated with adopting new technology, as engineers can use languages they are already comfortable with. The API-first architecture makes it simple to interface Kestra with existing systems.</p>
                <p>At the time of writing, Prefect can only orchestrate Python, narrowing its utility mainly to Python engineers.  It imposes a barrier to entry for engineers who are not well-versed in managing Python dependencies and working with that language, thereby limiting cross-team collaboration.</p>
            </div>

            <div class="mt-5">
                <h2>Workflow Deployment</h2>
                <p>Kestra's deployment process is compatible with tools like Terraform, GitHub Actions, or GitLab CI, leveraging the principles of Infrastructure as Code (IaC). This integration with existing CI/CD pipelines allows for rapid deployments and iterations.</p>
                <p>Prefect's deployments require packaging Python code into container images, leading to slow feedback loops and heavy deployment processes. Imagine having to manage thousands of container images as you scale the number of workflows to thousands. It adds significant storage and maintenance costs.</p>
            </div>

            <div class="mt-5">
                <h2>Developer Experience</h2>
                <p>Prefect’s UI is focused only on observing past events and deployment artifacts, while Kestra helps you proactively build better workflows by embedding blueprints, documentation, code editor, revision history, and a live-updating topology view.</p>
            </div>

            <div class="mt-5">
                <h2>Cross-role Collaboration and Accessibility</h2>
                <p>Kestra's user-friendly interface is designed for cross-role collaboration, inviting not just engineers but also business stakeholders. Prefect is a developer tool — it doesn’t offer features for non-technical team members. Prefect can orchestrate Python, while Kestra can orchestrate your entire business.</p>
            </div>
        </Section>

        <Section class="modern mb-5">
            <div class="row">
                <div class="col-lg-6 col-sm-12 text-center" data-aos="fade-left">
                    <img class="zoom img-fluid" src="/landing/vs/prefect/modern-data-stack.png" width="375" alt="Kestra plugins"/>
                </div>
                <div class="col-lg-6 col-sm-12 pe-5 mt-5 mt-lg-0" data-aos="fade-right">
                    <h3>Modern Data Stack Integration</h3>
                    <p>Kestra stands out thanks to its flexible and extensible plugin ecosystem. The REST API allows third-party systems to easily interact with Kestra, further broadening its applicability and making it easier to fit into diverse technology stacks.</p>
                    <p>Prefect integrations require managing Python dependencies. This becomes difficult at scale due to package dependency conflicts and the need to manage complex container builds.</p>
                </div>
            </div>
        </Section>

        <div class="table-responsive mb-5">
            <table class="table table-bordered mb-0">
                <thead>
                    <tr>
                        <th>Feature/Capability</th>
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
                        <td>X (Cloud-version only)</td>
                    </tr>
                    <tr>
                        <td>Unlimited Event Processing</td>
                        <td>✓</td>
                        <td>X (Enterprise-tier only)</td>
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

    <BottomCallToAction />
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
    import BottomCallToAction from '../../layout/BottomCallToAction.vue';

    export default {
        components: {Section, BottomCallToAction}
    }
</script>

<style lang="scss" scoped>

    @import "../../../assets/styles/variable";

    table {
        border: 1px solid var(--bs-gray-300);

        thead {
            border-bottom: 2px solid var(--bs-gray-300);
        }

        th {
            background: var(--bs-gray-200);
        }

        td {
            background: var(--bs-gray-100);
        }
        th, td {
            padding: 1.5rem;
        }
    }


    section.modern {
        background: linear-gradient(134deg, #9535D0 2.10%, #6A22BB 4.58%, #461A97 11.00%, #36188D 21.11%, #321974 34.99%, #25185C 47.08%, #24155B 64.06%, #25155B 76.00%, #450F95 91.93%, #4F39B3 96.26%, #893FE5 99.33%);
        color: var(--bs-white);
        border-radius: var(--bs-border-radius-xl);
        padding: calc($spacer * 3) 0;

        :deep(.main) {
            padding-top: 0;
        }

        @include media-breakpoint-up(lg) {
            .row {
                padding: 0 6rem;
            }
        }

        @include media-breakpoint-down(lg) {
            .row {
                padding: 0 3rem;
            }
        }

    }
</style>
