<template>
    <div class="container">
        <Section>
            <div data-aos="fade-right">
                <h2>About Kestra & Airflow</h2>
                <p>Kestra is an open-source data orchestrator that brings Infrastructure as Code best practices to data pipelines. Kestra empowers users to build data pipelines using a declarative YAML interface, accelerating development time while maintaining code quality.</p>
                <p>On the other hand, Apache Airflow, born out of Airbnb in 2014 and later fostered under the Apache Software Foundation, provides a platform that enables programmatic authoring, scheduling, and monitoring of workflows. It has emerged as a widely adopted choice for managing complex data pipelines.</p>
            </div>

            <div data-aos="fade-left">
                <h2>Installation and Setup</h2>
                <p>Both tools can be installed with Docker. Kestra's setup process aims to be straightforward, enabling swift initiation into managing data workflows. Using just two commands, you can install Kestra with all its dependencies. Setting up Airflow involves integrating additional components, such as a metadata database and a message broker.</p>
            </div>

            <div data-aos="fade-right">
                <h2>Python Architecture vs. Decoupled Event-Driven System</h2>
                <p>While Airflow is built as a Python-based web framework, this architecture can present its own challenges. Its reliance on Python can lead to issues due to dependency conflicts. Integration with third-party systems often requires additional Python packages, which can result in conflicts unless everything is containerized. However, containerization can add complexity and may counteract the benefits of Python's lightweight framework.</p>
                <p>Kestra, on the other hand, uses a decoupled microservice-oriented architecture built based on time-tested proven technologies such as Postgres, Java, Kafka, and Elasticsearch. This design offers significant performance advantages, as Java can handle a large number of concurrent threads, allowing robust data processing at scale. Kestra can handle a large volume of data and millions of concurrent workloads without degradation in performance.</p>
            </div>

            <div data-aos="fade-left">
                <h2>Python Architecture vs. Decoupled Event-Driven System</h2>
                <p>While Airflow is built as a Python-based web framework, this architecture can present its own challenges. Its reliance on Python can lead to issues due to dependency conflicts. Integration with third-party systems often requires additional Python packages, which can result in conflicts unless everything is containerized. However, containerization can add complexity and may counteract the benefits of Python's lightweight framework.</p>
                <p>Kestra, on the other hand, uses a decoupled microservice-oriented architecture built based on time-tested proven technologies such as Postgres, Java, Kafka, and Elasticsearch. This design offers significant performance advantages, as Java can handle a large number of concurrent threads, allowing robust data processing at scale. Kestra can handle a large volume of data and millions of concurrent workloads without degradation in performance.</p>
            </div>

            <div data-aos="fade-right">
                <h2>Workflow Definition</h2>
                <p>While Kestra uses YAML for workflow definitions, it also supports inline scripting in a variety of languages. This makes Kestra language agnostic and accessible to stakeholders who might be familiar with SQL or other languages but not with Python or Docker. With Kestra, workflows can be divided into manageable subflows that can be triggered based on certain events.</p>
                <p>Airflow's workflow definition is Python-based. This design choice limits building data workflows only to Python developers and hinders wider adoption across business domain experts and engineers working on different technology stacks.</p>
                <p>While Airflow can handle complex workflows, it does not come with an event-driven system, making decoupled workflow patterns difficult, if not impossible, to accomplish.</p>
            </div>

            <div data-aos="fade-left">
                <h2>Workflow Deployment</h2>
                <p>Airflow's deployment strategy reflects the Python-centric nature of the platform, which involves packaging Python applications, managing dependencies, and deploying code to the server. Despite the widespread adoption of Python, handling the underlying dependencies is challenging, especially when managing your data platform at scale. Data movement usually involves communicating with various third-party services via API calls. We believe that dealing with multiple Python environments only to perform simple integration tasks (e.g., triggering batch jobs or data ingestion) adds unnecessary complexity. You can accomplish the Workflows as Code paradigm much easier when your orchestration logic is decoupled from your business logic (written in languages such as Python).</p>
                <p>With Kestra, you can directly create and edit workflows through the interface, allowing immediate deployment. Kestra can also be integrated with Continuous Integration and Continuous Deployment (CI/CD) pipelines, smoothly integrating with tools like GitHub Actions and GitLab CI to automate the testing and deployment of workflows. For organizations using Infrastructure as Code (IaC), Kestra presents an excellent fit. You can manage your workflows with IaC tools like Terraform, benefiting from version control, peer review, and the ability to automatically rollout or rollback workflows. Kestra's architecture is heavily focused on APIs, allowing users to manage workflows programmatically and integrate Kestra with other tools and systems.</p>
                <p>The Code editor embed in Kestra also comes with autocompletion, syntax validation, and task documentation, which allows you to see at a glance which tools are used in any given pipeline.</p>
            </div>

            <div data-aos="fade-right">
                <h2>Developer Experience</h2>
                <p>Kestra is known for its intuitive and visually appealing user interface, making workflow management simple and accessible. Airflow can deploy DAGs but doesn’t offer an integrated code editor to help you write workflows. Also, Airflow DAG is visible in the UI only after you deploy it. In contrast, Kestra’s topology view is updating live as you write your flow, making it much easier to understand workflow dependencies already during their development.</p>
                <p>Regarding workflow visualization, both platforms provide DAG views. Kestra also includes logos representing the tools used in a given workflow, allowing you to see at a glance which tools are used in any given pipeline.</p>
            </div>

            <div data-aos="fade-left">
                <h2>Collaboration and Accessibility</h2>
                <p>Kestra's design aims to be user-friendly, not just for developers and engineers but also for business stakeholders. The user interface allows SQL-savvy users to modify queries or parameters directly from the UI, enabling them to contribute without needing to delve into the codebase.</p>
                <p>In contrast, Airflow only supports writing workflows in Python without the possibility of building them from the UI in collaboration with business stakeholders.</p>
            </div>
        </Section>

        <Section class="modern mb-5">
            <div class="row">
                <div class="col-lg-6 col-sm-12 text-center" data-aos="fade-left">
                    <img class="zoom img-fluid" src="/landing/vs/airflow/modern-data-stack.png" width="375" alt="Kestra plugins"/>
                </div>
                <div class="col-lg-6 col-sm-12 pe-5 mt-5 mt-lg-0" data-aos="fade-right">
                    <h3>Modern Data Stack Integration</h3>
                    <p>Kestra's flexible plugin system enables seamless integration with a wide range of popular data tools. All workflow components are also exposed via REST APIs, allowing third-party systems to interact with Kestra</p>
                    <p>In contrast, modifying workflow components in Airflow always require redeploying code.</p>
                </div>
            </div>
        </Section>

        <div class="table-responsive mb-5">
            <table class="table table-bordered mb-0" data-aos="zoom-in">
                <thead>
                    <tr>
                        <th></th>
                        <th>Kestra</th>
                        <th>Airflow</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Installation</td>
                        <td>Easy with Docker in two commands.</td>
                        <td>Docker installation requires additional component setup.</td>
                    </tr>
                    <tr>
                        <td>Architecture</td>
                        <td>Decoupled microservice-oriented architecture capable of handling a large number of workloads/</td>
                        <td>Python-based monolithic architecture may have scaling and dependency management issues.</td>
                    </tr>
                    <tr>
                        <td>Workflow Definition</td>
                        <td>Language-agnostic declarative API-first interface allowing building workflows in YAML or from the UI.</td>
                        <td>Python only, modifications require redeployments leading to slow feedback loops.</td>
                    </tr>
                    <tr>
                        <td>Developer Experience</td>
                        <td>Intuitive UI, live topology view, integrated code editor with advanced features.</td>
                        <td>Deployable DAGs, but no integrated code editor. DAGs are only visible post-deployment.</td>
                    </tr>
                    <tr>
                        <td>Collaboration</td>
                        <td>Encourages cross-role collaboration. SQL users can modify queries/parameters from the UI.</td>
                        <td>Primarily developer-focused. Workflows are written in Python without UI-building options.</td>
                    </tr>
                    <tr>
                        <td>Data Integration</td>
                        <td>Flexible plugin system. All workflow components are accessible via REST APIs.</td>
                        <td>Supports many data tools but may require extra work due to dependency management.</td>
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