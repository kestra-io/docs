---
title: "Linear Integrations: Automate Project Workflows with Orchestration"
description: "How Linear integrations work (native apps, API, webhooks) and how to build multi-step automations around Linear, such as updating issues on deploy or creating issues from alerts."
metaTitle: "Linear Integrations: Workflow Automation & Orchestration"
metaDescription: "How Linear integrations work through native apps, the GraphQL API and webhooks, and how to automate Linear issues from CI/CD, alerts and support tools."
tag: "infrastructure"
date: 2026-11-25
slug: "linear-integrations"
faq:
  - question: "What are Linear integrations?"
    answer: "Linear integrations connect the Linear issue tracking platform with other tools in your development and operational stack. These connections allow for automated data exchange, event triggering, and workflow synchronization, enhancing productivity by reducing manual updates and ensuring consistent project status across systems."
  - question: "How do Linear integrations typically work?"
    answer: "Three ways: native integrations listed in Linear (GitHub, GitLab, Slack, Sentry, Zendesk and others), Linear's GraphQL API, which lets other tools create and update issues, and Linear webhooks, which notify an external URL when issues, comments or projects change in Linear."
  - question: "What are common use cases for automating Linear workflows?"
    answer: "Common use cases include automatically updating Linear issues when code is deployed, syncing customer support tickets to Linear tasks, creating issues from monitoring alerts, or assigning tasks to AI agents. These automations keep issue status in line with what actually happened in other tools."
  - question: "Can I integrate Linear with custom internal tools?"
    answer: "Yes, you can integrate Linear with custom internal tools using its API and webhooks. An orchestration platform like Kestra can act as a central hub, so you define the logic in YAML and connect Linear with internal applications, databases, or APIs."
  - question: "How does Kestra enhance Linear integrations?"
    answer: "Kestra runs multi-step workflows around Linear: it creates issues with its Linear plugin, calls the GraphQL API for updates and comments, and chains these steps with CI/CD, cloud, data, or AI tasks. Each run has retries, error handling, scheduling, and an execution history."
  - question: "What is the Linear API used for?"
    answer: "The Linear API allows developers and tools to programmatically interact with Linear workspaces. You can use it to create new issues, update existing ones, fetch issue details, manage projects, and automate various aspects of project tracking. It's the foundation for building custom integrations and advanced automations."
---

> **TL;DR** — Linear integrations connect Linear with the rest of your stack through three channels: native integrations (GitHub, Slack, Sentry, Zendesk), the GraphQL API, and webhooks. Native integrations cover common cases; for multi-step logic, such as updating an issue on deploy or opening one from an alert, an orchestrator calls the API and handles retries.

Linear is where many engineering teams track work, but issues only stay accurate if the rest of the stack updates them. Manual updates between issue trackers, CI/CD pipelines, and communication platforms introduce friction, delay, and errors. The goal isn't just to track tasks, but to ensure every system involved in a project stays synchronized without human intervention.

This guide explores Linear integrations, from their core mechanics to advanced orchestration patterns. We'll show you how to move beyond simple point-to-point connections and build automated workflows that keep your teams aligned, your deployments tracked, and your project statuses always up-to-date, with workflows defined in YAML.

## How Linear Integrations Work

Linear integrations are the bridges that connect your project management hub to the rest of your software development lifecycle. Instead of manually copying information, these integrations automate the flow of data, ensuring that your Linear workspace reflects the true state of your projects. They primarily function through three mechanisms:

1.  **Native Integrations:** Linear offers a set of pre-built connectors for popular tools like GitHub, GitLab, Slack, Sentry, and Zendesk. These are typically easy to set up and handle common scenarios, such as linking pull requests to issues or creating tasks from customer support tickets.
2.  **GraphQL API:** For custom needs, Linear provides a [GraphQL API](https://linear.app/developers/graphql). This allows developers to programmatically create, read, update, and delete data within Linear. You can build custom scripts or applications that interact with issues, projects, cycles, and users, giving you full control over your workspace.
3.  **Webhooks:** Webhooks are the reactive part of the integration story. You can configure [Linear webhooks](https://linear.app/developers/webhooks) to send a notification (an HTTP POST request) to an external URL whenever a specific event occurs, such as an issue being created, a comment being added, or a project status changing. This enables other systems to listen and react to activity within Linear, which is fundamental for building event-driven automations. For more details on securing these endpoints, see our guide to [webhook security best practices](/resources/infrastructure/webhook-security-best-practices).

## Why Orchestration Elevates Linear Integrations Beyond Point-to-Point Connections

While native integrations and simple webhooks are useful, they often fall short when workflows become more complex. A direct Sentry-to-Linear connection is great, but what if you need to enrich the Sentry alert with data from your observability platform before creating the issue, and then notify a specific Slack channel based on the issue's priority? This is where orchestration becomes essential.

Point-to-point integrations create a brittle web of connections that are hard to manage, monitor, and debug. An orchestration platform gives you a central control plane, providing a single place to define, execute, and observe these complex workflows.

The benefits of using an orchestration layer include:

*   **Reliability:** Add retry logic, error handling, and alerting to ensure your automations don't fail silently.
*   **Auditability:** Define your entire workflow as a declarative YAML file. This makes it version-controllable, reviewable, and provides a clear audit trail of what ran and why.
*   **Scalability:** Manage hundreds of automated workflows without the operational overhead of maintaining individual scripts and services.
*   **Multi-Step Logic:** Chain together tasks across multiple systems. For example, a single trigger can kick off a sequence that pulls data from a database, transforms it, updates a Linear issue, and sends a summary email.

By centralizing this logic, you can move from simple notifications to building a truly automated infrastructure. You can explore a variety of [workflow orchestration tools](/resources/infrastructure/workflow-orchestration-tools) to find the one that best fits your needs, but the core principle remains the same: manage your automations as production-grade code.

## Orchestrate Linear Integrations with Kestra: Automating Deployment Status Updates

Let's build a practical workflow. Imagine your CI/CD system sends a webhook after every deployment. If the deployment is successful, we want to find the related Linear issue, move it to "Done", and add a comment with the deployment details. If it fails, we want to automatically create a new bug report in the "Bugs" team queue.

Kestra can manage this process with a single, event-driven flow. The [Linear plugin](/plugins/plugin-linear) provides a task for creating issues; it has no task for updating issues or adding comments, so the flow calls Linear's GraphQL API with the HTTP Request task for those steps.

```yaml
id: linear-deployment-automation
namespace: company.team

triggers:
  - id: on_deployment_webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('DEPLOY_WEBHOOK_KEY') }}"

tasks:
  - id: handle_deployment_status
    type: io.kestra.plugin.core.flow.Switch
    value: "{{ trigger.body.status }}"
    cases:
      SUCCESS:
        - id: update_issue_on_success
          type: io.kestra.plugin.core.http.Request
          uri: https://api.linear.app/graphql
          method: POST
          headers:
            Authorization: "{{ secret('LINEAR_API_KEY') }}"
          body: |
            {{ {
              "query": "mutation IssueUpdate($id: String!, $stateId: String!) { issueUpdate(id: $id, input: { stateId: $stateId }) { success } }",
              "variables": {"id": trigger.body.issueId, "stateId": secret('LINEAR_DONE_STATE_ID')}
            } | toJson }}

        - id: add_success_comment
          type: io.kestra.plugin.core.http.Request
          uri: https://api.linear.app/graphql
          method: POST
          headers:
            Authorization: "{{ secret('LINEAR_API_KEY') }}"
          body: |
            {{ {
              "query": "mutation CommentCreate($issueId: String!, $body: String!) { commentCreate(input: { issueId: $issueId, body: $body }) { success } }",
              "variables": {"issueId": trigger.body.issueId, "body": "Deployment succeeded for version " ~ trigger.body.version}
            } | toJson }}
    defaults:
      - id: create_issue_on_failure
        type: io.kestra.plugin.linear.issues.Create
        token: "{{ secret('LINEAR_API_KEY') }}"
        team: Bugs
        title: "Deployment failed for version {{ trigger.body.version }}"
        description: "Error reported by CI/CD: {{ trigger.body.error ?? 'no error message provided' }}"
        labels:
          - Bug
          - Deployment
        priority: 1

errors:
  - id: notify_on_workflow_error
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "Linear deployment sync failed. Execution {{ execution.id }}."}
```

Linear personal API keys go in the `Authorization` header as is, without a `Bearer` prefix; OAuth tokens use `Bearer`. Building the request body with `toJson` keeps the JSON valid even when a version string or error message contains quotes.

**What this flow does:**

*   **Listens for Deployments:** The `Webhook` trigger provides a unique URL for your CI/CD system to call upon deployment completion.
*   **Routes Based on Status:** A `Switch` task checks the `status` field from the webhook's JSON payload. If it's `SUCCESS`, it runs the update tasks; otherwise, it proceeds to the `defaults` block to create a failure ticket.
*   **Updates and Comments via API:** The `http.Request` tasks send GraphQL mutations to the Linear API to change the issue's state and post a comment. The API key and the target state id come from Kestra secrets.
*   **Creates Issues with the Plugin:** On failure, `linear.issues.Create` opens a bug in the Bugs team with labels and urgent priority, and returns the new issue's identifier and URL.
*   **Handles Errors:** If the workflow itself fails (for example, the Linear API is down), the `errors` block sends a Slack notification.

The whole process is one auditable YAML file; see [infrastructure automation](/infra-automation) for more patterns.

## Where Smart Linear Integrations Pay Off

By combining Linear with an orchestration engine, you can automate a wide range of project and operational workflows. Here are some common use cases:

*   **CI/CD Pipeline Synchronization:** Automatically update Linear issues when code is deployed, tests fail, or a build is completed.
*   **Customer Support Ticket Syncing:** Create, update, or comment on Linear issues based on activity in Zendesk, Intercom, or other support platforms. The [Linear Customer Escalation Sentinel blueprint](/blueprints/linear-customer-support-escalation-sentinel) provides a ready-to-use example.
*   **Incident Management:** Automatically [create a Linear issue from a monitoring alert](/blueprints/create-linear-issue-on-failure) from PagerDuty, Grafana, or your internal systems.
*   **AI Agent Task Management:** Enable autonomous AI agents to create and update Linear issues as they perform tasks, providing a human-readable log of their work. This is a key part of building a complete [AI automation](/ai-automation) system.
*   **Data-Driven Task Creation:** Trigger Linear issues based on data quality tests from tools like dbt, ensuring that data anomalies are tracked and resolved as formal tasks.

You can also build workflows to manage your Linear workspace itself, such as the [Linear Urgent Unassigned Issue Triage blueprint](/blueprints/linear-urgent-unassigned-issue-triage-sentinel) which helps ensure critical tasks are never missed.

## Related Concepts

Linear integrations usually touch other systems too:

*   **dbt Integrations:** For teams working with data, connecting your [dbt integrations](/resources/data/dbt-integrations) to Linear allows you to create issues automatically from failed data quality tests.
*   **Workflow Monitoring:** As you automate more processes, having effective [workflow monitoring tools](/resources/infrastructure/workflow-monitoring-tools) becomes critical to observe performance and debug failures.
*   **GitOps:** Store your orchestration flows in Git to apply [GitOps](/resources/infrastructure/gitops) principles to your automations, enabling version control, peer review, and automated deployments.
*   **API Orchestration:** Many integrations, like the one shown above, rely on orchestrating calls to multiple APIs. Mastering [API orchestration](/resources/infrastructure/api-orchestration) is key to connecting modern SaaS tools.
