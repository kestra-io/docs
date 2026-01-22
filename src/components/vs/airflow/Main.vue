<template>
    <div class="container">
        <Section class="about">
            <div>
                <h2>About <span>Kestra</span> & Airflow</h2>
                <p>
                    Kestra is an open-source data orchestrator that brings Infrastructure as Code
                    best practices to data pipelines. Kestra empowers users to build data pipelines
                    in an API first way rather than tying it to a single Python client's
                    implementation. Every action in Kestra is API-driven and declared using a simple
                    YAML configuration file. Being API-first opens up your orchestration platform to
                    more integrations and use cases without having to touch any client code.
                </p>
                <p>
                    On the other hand, Apache Airflow, born out of Airbnb in 2014, provides a Python
                    client for authoring, scheduling, and monitoring workflows. Your workflows are
                    tied to a specific Python client implementation, requiring redeploying code and
                    rebuilding infrastructure for every change.
                </p>
            </div>

            <div>
                <h2>Installation and Setup</h2>
                <p>
                    Both tools can be installed with Docker. Kestra's setup process aims to be
                    straightforward, enabling swift initiation into managing data workflows. Using
                    just two commands, you can install Kestra with all its dependencies. Setting up
                    Airflow involves integrating additional components, such as a metadata database
                    and a message broker.
                </p>
            </div>

            <div>
                <h2>Python Architecture vs. Decoupled Event-Driven System</h2>
                <p>
                    While Airflow is built as a Python-based web framework, this architecture can
                    present some challenges. Its reliance on Python can lead to issues due to
                    dependency conflicts. Integration with third-party systems often requires
                    additional Python packages, resulting in conflicts unless everything is
                    containerized. However, containerizing every small component adds complexity and
                    counteracts the benefits of a lightweight Python-based framework.
                </p>
                <p>
                    Kestra, on the other hand, uses a decoupled microservice-oriented architecture
                    built based on time-tested, proven technologies such as Postgres, Java, Kafka,
                    and Elasticsearch. This design offers significant performance advantages, as
                    Java can handle a large number of concurrent threads, allowing robust data
                    processing at scale. Kestra can handle a large volume of data and millions of
                    concurrent workloads without degradation in performance.
                </p>
            </div>

            <div>
                <h2>Workflow Definition</h2>
                <p>
                    While Kestra uses YAML for workflow definitions, it also supports inline
                    scripting in a variety of languages. The API-first design makes Kestra
                    language-agnostic and accessible to stakeholders who might be familiar with SQL
                    or other languages but not with Python or Docker. With Kestra, workflows can be
                    divided into manageable subflows that can be triggered based on certain events.
                </p>
                <p>
                    Airflow's workflow definition is Python-based. This design choice limits
                    building data workflows only to Python developers and hinders wider adoption
                    across business domain experts and engineers working on different technology
                    stacks.
                </p>
                <p>
                    While Airflow can handle complex workflows, it does not come with an
                    event-driven system, making decoupled workflow patterns difficult, if not
                    impossible, to accomplish.
                </p>
            </div>

            <div>
                <h2>Workflow Deployment</h2>
                <p>
                    Airflow's deployment strategy reflects the Python-centric nature of the
                    platform, which involves packaging Python applications, managing dependencies,
                    and deploying code to the server. Despite the widespread adoption of Python,
                    handling the underlying dependencies is challenging, especially at scale. Data
                    movement usually involves communicating with various third-party services via
                    API calls. We believe that dealing with multiple Python environments only to
                    perform simple integration tasks (e.g., triggering batch jobs or data ingestion)
                    adds unnecessary complexity. You can accomplish the Workflows as Code paradigm
                    much easier when your orchestration logic is decoupled from your business logic
                    (written in languages such as Python).
                </p>
                <p>
                    With Kestra, you can directly create and modify workflows from the UI, API,
                    Terraform, and CI/CD tools, allowing immediate deployment. Kestra seamlessly
                    integrates with tools like GitHub Actions and GitLab CI to automate the testing
                    and deployment of workflows. You can manage your workflows with Infrastructure
                    as Code (IaC) tools like Terraform, benefiting from version control, peer
                    review, and the ability to automatically rollout or rollback workflows. Kestra's
                    architecture is heavily focused on APIs, allowing users to manage workflows
                    programmatically and integrate Kestra with other tools and systems.
                </p>
                <p>
                    The Code editor embedded in Kestra also comes with autocompletion, syntax
                    validation, and task documentation, which allows you to see at a glance which
                    tools are used in any given pipeline.
                </p>
            </div>

            <div>
                <h2>Developer Experience</h2>
                <p>
                    Kestra is known for its intuitive and visually appealing user interface, making
                    workflow management simple and accessible. Airflow can deploy DAGs but doesn’t
                    offer an integrated code editor to help you write workflows. Also, Airflow DAG
                    is visible in the UI only after you deploy it. In contrast, Kestra’s topology
                    view is updating live as you write your flow, making it much easier to
                    understand workflow dependencies already during their development.
                </p>
                <p>
                    Regarding workflow visualization, both platforms provide DAG views. Kestra also
                    includes logos representing the tools used in a given workflow, allowing you to
                    see at a glance which tools are used in any given pipeline.
                </p>
            </div>

            <div>
                <h2>Collaboration and Accessibility</h2>
                <p>
                    Kestra's design aims to be user-friendly, not just for developers and engineers
                    but also for business stakeholders. The user interface allows SQL-savvy users to
                    modify queries or parameters directly from the UI, enabling them to contribute
                    without needing to delve into the codebase.
                </p>
                <p>
                    In contrast, Airflow only supports writing workflows in Python without the
                    possibility of building them from the UI in collaboration with business
                    stakeholders.
                </p>
            </div>

            <div>
                <h2>Modern Data Stack Integration</h2>
                <p>
                    Kestra's flexible plugin ecosystem enables seamless integration with a wide
                    range of popular data tools. All workflow components are also exposed via REST
                    APIs, allowing third-party systems to interact with Kestra.
                </p>
                <p>
                    In contrast, modifying workflow components in Airflow always requires
                    redeploying code.
                </p>
            </div>
        </Section>
        <div class="table-responsive mb-5">
            <table class="table table-bordered mb-0">
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
                        <td>
                            API-first, decoupled microservice-oriented architecture capable of
                            handling a large number of scheduled and event-driven workloads at any
                            scale.
                        </td>
                        <td>
                            Orchestration configuration bound to a Python-client and monolithic
                            architecture with scaling and dependency management issues.
                        </td>
                    </tr>
                    <tr>
                        <td>Workflow Definition</td>
                        <td>
                            Language-agnostic declarative API-first interface allowing building
                            workflows in YAML or from the UI.
                        </td>
                        <td>
                            Python only, modifications require redeployments leading to slow
                            feedback loops.
                        </td>
                    </tr>
                    <tr>
                        <td>Developer Experience</td>
                        <td>
                            Intuitive UI, live topology view, integrated documentation next to the
                            code editor with autocompletion, blueprints and advanced features.
                        </td>
                        <td>
                            Deployable DAGs, but no integrated code editor. DAGs are only visible
                            post-deployment.
                        </td>
                    </tr>
                    <tr>
                        <td>Collaboration</td>
                        <td>
                            Encourages cross-role collaboration. SQL users can modify
                            queries/parameters from the UI.
                        </td>
                        <td>
                            Primarily developer-focused. Workflows are written in Python without
                            UI-building options.
                        </td>
                    </tr>
                    <tr>
                        <td>Data Integration</td>
                        <td>
                            Flexible plugin ecosystem. All workflow components are accessible via
                            REST APIs.
                        </td>
                        <td>
                            Supports many data tools but requires redeploying code and additional
                            infrastructure work due to dependency management.
                        </td>
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
    import Section from "~/components/layout/Section.vue"
    import LayoutFooterContact from "~/components/layout/FooterContact.vue"
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

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
        th,
        td {
            padding: 1.375rem 2.938rem;
            color: $white;
            font-size: $font-size-md;
            font-weight: 300;
        }
    }

    section.about {
        border-bottom: $block-border;

        h2 {
            color: $white;
            font-weight: 300;
            margin-bottom: 16px;

            span {
                background: linear-gradient(90deg, #e151f7 18.28%, #5c47f5 35.74%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        p {
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