---
title: "Workflow as Code: Declarative Orchestration for Engineers"
description: "Workflow as code means defining orchestration logic in version-controlled files instead of GUI builders or ad-hoc scripts. This guide compares YAML, Python DAGs and visual tools, and shows how to review, test and deploy workflows like software."
metaTitle: "Workflow as Code: Define Orchestration in Versioned Files"
metaDescription: "Workflow as code defines orchestration logic in versioned files. Compare YAML, Python DAGs and GUI builders, and see how to review, test and deploy workflows."
tag: "infrastructure"
date: 2026-11-25
slug: "workflow-as-code"
faq:
  - question: "What is workflow as code with an example?"
    answer: "Workflow as Code (WAC) defines automated processes using version-controlled, human-readable files, typically YAML. For example, a CI/CD pipeline defined in a YAML file that specifies steps like 'clone repository', 'run tests', and 'deploy to staging' is a workflow as code. This approach enables developers to manage, review, and deploy automation with software development best practices."
  - question: "What are the top 5 automation tools for workflow as code?"
    answer: "Common options include Kestra (declarative YAML across data, AI and infrastructure), Apache Airflow (Python DAGs), Temporal (workflows written in general-purpose languages), Argo Workflows (Kubernetes-native YAML), and GitHub Actions or GitLab CI/CD for CI/CD pipelines. They differ mainly in the definition language and in what they are built to orchestrate."
  - question: "Can ChatGPT write its own code for workflows?"
    answer: "ChatGPT can generate workflow definitions in formats like YAML when given clear prompts, but the result still needs a human to review, test, and deploy it like any other code. Kestra's AI Copilot generates and edits flow YAML from natural language inside the editor, and the output goes through the same review as hand-written flows."
  - question: "How to orchestrate AI workflows without coding?"
    answer: "The usual options are visual builders or declarative YAML. YAML is still code, but its structure is readable enough for non-developers to review and adjust. In Kestra, the visual editor and the AI Copilot both produce the same YAML, so a flow built without writing code stays versionable."
  - question: "Is there any free workflow automation tool that supports workflow as code?"
    answer: "Yes. Kestra's open-source edition is Apache 2.0 licensed and defines workflows in YAML. Apache Airflow (Apache 2.0) and Argo Workflows (Apache 2.0) are other open-source options; GitLab CI/CD has an open-source Community Edition."
  - question: "How does workflow as code relate to Infrastructure as Code?"
    answer: "Workflow as Code (WAC) extends the principles of Infrastructure as Code (IaC) to automation workflows. Just as IaC defines infrastructure declaratively in code, WAC defines operational sequences, data pipelines, and application logic in code. Both approaches emphasize version control, immutability, collaboration, and automated deployment, treating configurations and processes as software artifacts."
---

> **TL;DR** — Workflow as code means defining orchestration logic (tasks, dependencies, triggers, retries) in version-controlled files instead of GUI-only builders or ad-hoc scripts. Workflows then go through pull requests, automated validation, and CI/CD like application code. The main styles are declarative YAML, Python DAGs, and visual editors that export code.

Many operational workflows still live in cron tabs, shell scripts on one server, or visual tools whose state cannot be diffed. Nobody can review a change before it runs, and nobody can say which version ran last night.

Workflow as code applies the habits of software delivery to orchestration logic. This guide compares the ways to define workflows in code, explains what an orchestrator adds, and shows a flow that deploys other flows from Git.

## How Workflow as Code Redefines Automation

Workflow as Code is an engineering practice where orchestration logic is defined in code and managed through version control systems like Git. This contrasts with traditional methods that rely on graphical user interfaces (GUIs) or ad-hoc scripting. WAC treats workflows as software artifacts, subject to the same review, testing, and deployment as application code.

There are three primary ways to define orchestration logic:
1.  **Declarative YAML/DSL**: A human-readable configuration file defines the *what* (the tasks and their dependencies), while the orchestration engine handles the *how*. This approach, central to Kestra, separates the workflow definition from the execution logic, making it accessible to a wider range of users, including those who are not proficient in a specific programming language.
2.  **Imperative Code (Python DAGs/SDKs)**: Workflows are written in a general-purpose programming language like Python. This is the model used by tools like [Airflow DAGs](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html) and Prefect. It offers maximum flexibility but can intertwine orchestration logic with business logic, making workflows harder to read, version, and maintain.
3.  **GUI Builders**: Visual canvases let users assemble workflows by placing and connecting blocks. While user-friendly, these often result in configurations that are difficult to version control, test automatically, or integrate into CI/CD pipelines.

Kestra's model establishes YAML as the single source of truth. Whether you use the UI's visual editor, the code editor, or the API, every change is written back to the same YAML definition. This combines the accessibility of a GUI with the engineering rigor of [Everything as Code (EaC)](/resources/infrastructure/everything-as-code), ensuring that all workflows remain versionable and auditable. This approach is fundamental to treating [pipelines as code](/resources/infrastructure/pipeline-as-code).

## Why Workflow as Code Needs Orchestration

Simple automation scripts are fine for one job; production workflows need an orchestration engine to manage their lifecycle. Simple scripts fall short when dealing with complex dependencies, error handling, retries, and state management. An orchestrator provides the necessary framework to execute, monitor, and govern these workflows reliably at scale.

For developers, adopting a workflow as code approach with a capable orchestrator offers significant benefits:

*   **Version Control and Collaboration**: Storing workflow definitions in Git enables clear version history, pull request reviews, and collaborative development.
*   **CI/CD Integration**: Workflows can be automatically validated, tested, and deployed as part of a [CI/CD pipeline](/resources/infrastructure/ci-cd-orchestration), just like any other software.
*   **Automated Testing**: You can implement [unit tests for workflows](/resources/infrastructure/workflow-unit-testing), ensuring that changes don't introduce regressions.
*   **Auditability and Compliance**: A Git history shows who changed what and when, which auditors ask for.
*   **Reusability and Modularity**: Common patterns can be abstracted into reusable components or subflows, reducing boilerplate and promoting consistency.
*   **Reliability**: An orchestrator handles error recovery, retries, and alerting, making workflows more resilient than standalone scripts.

By combining the [GitOps](/resources/infrastructure/gitops) principles described by [OpenGitOps](https://opengitops.dev/) with an orchestration engine, teams can manage their automation with the same level of discipline and confidence as their core application services. You can learn more about how to manage your workflows with version control and a [CI/CD process in the documentation](/docs/version-control-cicd).

## Orchestrate Production Workflows with Kestra: Syncing Flows from Git

A direct example of workflow as code is deploying the orchestrator's own workflows from Git. The flow below is called by a GitHub webhook on every [`push` event](https://docs.github.com/en/webhooks/webhook-events-and-payloads#push). It first runs a dry-run sync of the pushed branch, which writes a diff of what would change, then, only for pushes to `main`, syncs the flows into the production namespace.

```yaml
id: sync-flows-from-git
namespace: company.team.cicd

triggers:
  - id: github_push
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('GITHUB_WEBHOOK_KEY') }}"

tasks:
  - id: dry_run_sync
    type: io.kestra.plugin.git.SyncFlows
    url: https://github.com/your-org/kestra-flows
    branch: "{{ trigger.body.ref | replace({'refs/heads/': ''}) }}"
    gitDirectory: flows
    targetNamespace: company.team.production
    username: "{{ secret('GIT_USERNAME') }}"
    password: "{{ secret('GIT_PAT') }}"
    dryRun: true

  - id: only_on_main
    type: io.kestra.plugin.core.flow.If
    condition: "{{ trigger.body.ref == 'refs/heads/main' }}"
    then:
      - id: sync_to_production
        type: io.kestra.plugin.git.SyncFlows
        url: https://github.com/your-org/kestra-flows
        branch: main
        gitDirectory: flows
        targetNamespace: company.team.production
        username: "{{ secret('GIT_USERNAME') }}"
        password: "{{ secret('GIT_PAT') }}"
        delete: false

errors:
  - id: notify_on_failure
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "Flow sync from Git failed (execution {{ execution.id }})."}
```

The webhook URL follows the format described in the [Webhook trigger documentation](/docs/workflow-components/triggers/webhook-trigger); the key is a secret, so rotate it if the URL leaks. Set the GitHub webhook content type to `application/json` so that `trigger.body.ref` is available. `delete: false` keeps flows that exist in Kestra but not in Git, which is the safe default.

This flow embodies the workflow as code philosophy. The automation logic for deploying other workflows is itself defined as a version-controlled YAML file. It is event-driven, keeps credentials in secrets, and records every deployment as an execution. 

### What the Example Shows

The example uses several Kestra features that support workflow as code:

*   **Declarative Definition**: The entire workflow is defined in a simple, human-readable YAML file. There's no imperative code for orchestration logic.
*   **Event-Driven Execution**: The `Webhook` trigger automatically starts the flow in response to an external event (a Git push), enabling real-time automation.
*   **Credential Management**: Tokens and webhook keys come from `secret()` expressions, never from the workflow definition.
*   **Conditional Logic**: The `If` task allows for dynamic branching based on runtime data, such as deploying only when a change is merged to the `main` branch.
*   **Built-in Integrations**: The flow uses native tasks for Git (`SyncFlows`) and Slack, so no custom glue scripts are needed.
*   **Language-Agnostic**: While this flow orchestrates other YAML files, Kestra tasks can run code in [any language](/features/code-in-any-language), making it a universal orchestrator for polyglot environments, including [Kubernetes workflows](/resources/infrastructure/kubernetes-workflow-orchestration).

## Where Workflow as Code Delivers Impact

Applying the WAC methodology brings consistency, reliability, and speed to a wide range of use cases across an organization:

*   **Data Pipelines**: Define complex ETL/ELT processes in YAML, ensuring that data transformations are versioned and testable.
*   **ML/AI Pipelines**: Orchestrate model training, evaluation, and deployment workflows, enabling reproducible machine learning.
*   **Infrastructure Provisioning**: Chain together Terraform or Ansible jobs to create auditable, multi-step infrastructure automation.
*   **Application Deployment (CI/CD)**: Extend CI/CD pipelines with post-deployment tasks like database migrations, cache warming, or end-to-end testing.
*   **Business Process Automation**: Model business logic such as user onboarding or financial reporting in a way that is transparent and maintainable by technical teams.
*   **Incident Response**: Define automated remediation workflows, such as [creating a GitHub issue on failure](/blueprints/create-github-issue-on-failure), restarting a service, or rolling back a deployment. You can even orchestrate other orchestration tools like [launching a Temporal workflow](/blueprints/temporal-workflow-launch-and-wait) or managing [AWS ECS task failures](/blueprints/aws-ecs-stopped-task-exit-code-sentinel).

## Related Concepts for Code-Driven Automation

*   [**YAML vs. Python Workflows**](/blogs/yaml-vs-python-workflow): A practical breakdown of when to use declarative YAML versus imperative Python for orchestration.
*   [**Policy as Code**](/resources/infrastructure/policy-as-code): Apply automated governance and compliance rules to your workflows.
*   [**Open Source Workflow Engines**](/resources/infrastructure/open-source-workflow-engine): Explore the landscape of tools that enable workflow as code.
*   [**Temporal Alternatives**](/resources/infrastructure/temporal-alternatives): Understand how declarative orchestration compares to code-embedded workflow engines.
*   [**Workflow Orchestration Tools**](/resources/infrastructure/workflow-orchestration-tools): A broader look at the tools available for unified automation.

Workflow as code gives operational automation the same review, testing, and release discipline as application code. To try it, start with the [quickstart guide](/docs/quickstart) and keep your first flows in Git from day one.
