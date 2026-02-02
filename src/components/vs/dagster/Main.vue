<template>
    <div class="container">
        <Section class="about">
            <div>
                <h2><span>Kestra</span> vs. Dagster</h2>
                <p>
                    Kestra is an open-source orchestrator designed to bring Infrastructure as Code
                    (IaC) best practices to all workflows — from those orchestrating
                    mission-critical operations, business processes, and data pipelines to simple
                    Zapier-style automation. Built with an API-first philosophy, Kestra enables
                    users to define and manage data pipelines through a simple YAML configuration
                    file. This approach frees you from being tied to a specific client
                    implementation, allowing for greater flexibility and easier integration with
                    various tools and services.
                </p>
                <p>
                    Dagster is an entirely different product — it's focused on orchestrating data
                    assets, not on orchestrating tasks, processes, business operations,
                    microservices, and applications as Kestra does. While Kestra can orchestrate
                    data workflows in a generic way, Dagster is more specialized in that area.
                </p>
            </div>

            <div>
                <h3>Similarities</h3>
                <ul>
                    <li>Both provide a declarative interface.</li>
                    <li>CI/CD integration is supported by both tools.</li>
                    <li>Both tools aim to streamline the orchestration of workflows.</li>
                </ul>
            </div>

            <div>
                <h3>Differences</h3>
                <ul>
                    <li>
                        Kestra is language-agnostic, while Dagster is designed primarily for Python.
                    </li>
                    <li>
                        Kestra offers API-first design principles while Dagster is client-code
                        first.
                    </li>
                    <li>
                        Kestra leverages a simple YAML configuration for setting up tasks and
                        pipelines, whereas Dagster relies on Python-based DSL and Software-Defined
                        Assets.
                    </li>
                    <li>
                        Kestra offers a quick setup, getting you to a scheduled workflow in minutes.
                        Dagster has a steeper learning curve as you need to know the framework and
                        their way of doing things which has both its own pros and cons.
                    </li>
                </ul>
            </div>

            <div>
                <h2>Declarative Paradigms</h2>
                <p>
                    Dagster embraces a Python-first environment, with its Software-Defined Assets
                    (SDAs). This approach naturally attracts those who are comfortable in a Pythonic
                    ecosystem. SDAs serve not just as units of computation but as documented assets
                    within the framework. By isolating the business logic from I/O operations, they
                    grant engineers fine-grained control over data lineage, aiding debugging and
                    understanding of asset states. This Python-centric philosophy extends into
                    Dagster’s environmental abstraction, allowing users to swap out external
                    services and runtimes without altering any user code. Dagster is designed for
                    data engineers and analytics engineers who desire a platform that accommodates a
                    complex Python-based asset lifecycle.
                </p>
                <p>
                    On the other side, Kestra aims for an agnostic approach to programming languages
                    and focuses on the YAML-based orchestration. Data pipeline orchestration can be
                    language-neutral and still maintain robustness and scalability. YAML serves as
                    the primary interface through which workflows are defined. This inclusivity
                    manifests in its ability to incorporate business logic written in languages as
                    diverse as SQL, R, Rust, and even Bash. Consequently, Kestra finds its audience
                    among senior software engineers, especially those who work in diverse tech
                    stacks.
                </p>
                <p>
                    Both Kestra and Dagster offer unique answers to the question of what declarative
                    orchestration can be. While Dagster may appeal to those who favor a Pythonic
                    richness in their workflows, Kestra attracts those who seek language
                    flexibility, scalability, and a more inclusive approach to defining
                    orchestration logic. The choice between the two will, therefore, depend heavily
                    on the specific technical needs, the programming languages your team is
                    comfortable with, and your long-term vision for data pipeline or workflow
                    management.
                </p>
            </div>

            <div>
                <h2>Approach to Workflow Definitions</h2>
                <p>
                    Kestra offers a YAML-based workflow definition interface that simplifies the
                    creation and management of workflows. This contrasts with Dagster’s Python DSL,
                    which, while offering several advantages, adds a layer of complexity and leads
                    to difficulties in maintaining custom Python wrappers over time.
                </p>
            </div>

            <div>
                <h2>Workflow Deployment</h2>
                <p>
                    Kestra allows for workflow deployments directly from its integrated UI code
                    editor. Moreover, it supports Terraform and integrates with various CI/CD
                    systems like GitHub Actions.
                </p>
                <p>
                    In contrast, the deployment patterns in Dagster might be more challenging,
                    especially in the open-source version .
                </p>
            </div>

            <div>
                <h2>Developer Experience</h2>
                <p>
                    Kestra offers a more comprehensive developer experience with built-in
                    documentation and a code editor, as well as a live-updating topology view.
                    Dagster focuses on data engineers who know Python. In contrast, Kestra supports
                    software engineers working on any technology stack.
                </p>
            </div>

            <div>
                <h2>Cross-role Collaboration and Accessibility</h2>
                <p>
                    Kestra’s user-friendly interface aims to invite not just engineers but also
                    business stakeholders into the data pipeline process. Dagster comes with a
                    steeper learning curve; it introduces many concepts that can be overwhelming
                    when onboarding new colleagues and stakeholders to the platform.
                </p>
            </div>
        </Section>

        <div class="table-responsive mb-5">
            <table class="table table-bordered mb-0">
                <thead>
                    <tr>
                        <th>Feature/Aspect</th>
                        <th>Kestra</th>
                        <th>Dagster</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Core Focus</td>
                        <td>Orchestrating workflows, tasks, operations, and data pipelines</td>
                        <td>Orchestrating data assets</td>
                    </tr>
                    <tr>
                        <td>Language Support</td>
                        <td>Language-agnostic (YAML for orchestration)</td>
                        <td>Python-first</td>
                    </tr>
                    <tr>
                        <td>Declarative Interface</td>
                        <td>Yes — API-first with YAML syntax exposed for simplicity</td>
                        <td>Yes — client-side implementation with Python DSL</td>
                    </tr>
                    <tr>
                        <td>Ease of Setup</td>
                        <td>Quick setup, scheduled workflow in minutes</td>
                        <td>Steeper learning curve, requires an understanding of the framework</td>
                    </tr>
                    <tr>
                        <td>Developer Experience</td>
                        <td>
                            Built-in code editor, live-updating DAG view, documentation and
                            blueprints
                        </td>
                        <td>Tailored for senior data engineers experienced in Python</td>
                    </tr>
                    <tr>
                        <td>Workflow Definitions</td>
                        <td>YAML-based</td>
                        <td>Python DSL</td>
                    </tr>
                    <tr>
                        <td>Integration/Extensibility</td>
                        <td>Plugin ecosystem, REST API, webhooks and event triggers</td>
                        <td>
                            Integrations via Python libraries (may lead to dependency conflicts) and
                            GraphQL API
                        </td>
                    </tr>
                    <tr>
                        <td>Cross-role Collaboration</td>
                        <td>Designed for all engineers and business users</td>
                        <td>Designed for data engineers maintaining a data warehouse</td>
                    </tr>
                    <tr>
                        <td>Data Lineage & Debugging</td>
                        <td>Task level metadata through metrics and outputs</td>
                        <td>Fine-grained control via Software-Defined Assets</td>
                    </tr>
                    <tr>
                        <td>Business Logic Support</td>
                        <td>SQL, Python, R, Rust, Bash, and more.</td>
                        <td>Primarily Python</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <LayoutFooterContact
        title="Getting started"
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

        h2,
        h3 {
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

        p,
        ul > li {
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