---
title: "How Kestra runs on Kestra"
description: "An inside look at Kestra’s internal analytics architecture, showing how declarative orchestration enables scalable, multi-language data pipelines."
date: 2026-01-06T13:00:00
category: Solutions
author:
  name: Rok Grabnar
  image: TBC
  role: Analytics Engineer
image: TBC
---

## **How Kestra runs on Kestra**

As Kestra’s only analytics engineer, I run a production-grade ELT stack end-to-end. I rely on PyAirbyte and custom dltHub sources to ingest data from platforms like PostHog, HubSpot, and Pylon into BigQuery, transform it with dbt, and visualize it in Lightdash. This streamlined pipeline enables me to support sales, marketing, product, and leadership teams from a single, cohesive system.

This works because the orchestration layer stays out of the way. Instead of reshaping scripts to match a framework’s preferences or chasing down scheduler edge cases, I spend my time doing the work analytics engineers actually want to do: understanding the business, answering internal questions, and building things my colleagues actually use.

## **Our data stack**

Here's what Kestra's data infrastructure actually looks like:

![Kestra's internal analytics architecture](blogs/2026-01-06-how-kestra-runs-on-kestra/kestra-internal-analytics-architecture.png)

**Sources:**

- PostHog (product analytics)
- HubSpot (CRM)
- Pylon (ticketing)
- Common Room (community data)
- Internal application data

**Warehouse:**

- BigQuery

**Transformation:**

- dbt Core

**Visualization:**

- Lightdash

**Orchestration:**

- Kestra (obviously)

## **The architecture decisions that matter**

In Kestra, workflows are defined declaratively in `YAML` and execution happens in Docker containers. (New to `YAML`? We have an [introductory blog post here.](https://kestra.io/blogs/2023-11-27-yaml-crashcourse)) Orchestration logic is kept separate from application code by design. That separation makes it easier to orchestrate data pipelines that span multiple languages and tools.

This is important for enterprise environments, because data pipelines routinely coordinate SQL transformations, Python-based ingestion, and language-specific services that teams rely on for different parts of the stack.

In our case, this shows up directly in how the analytics stack is wired together. dbt models, containerized ingestion jobs, and downstream checks are coordinated by the same orchestration layer, without forcing those components into a single programming model. The result is simpler pipelines and reusable building blocks.

### **Any language, one workflow**

In Kestra, a single flow can:

- Check out a GitHub repository
- Build a Docker image
- Run dbt models
- Execute a Python script
- Call a Go binary
- Hit an API endpoint

All of this happens without rewriting existing code or translating it into a single framework. Each component runs in the form it was designed to run, using the language and tooling that make sense for that task.

This lets us evolve the stack incrementally. We can introduce a new service, keep a legacy script, or change how a particular step is implemented without turning orchestration into a refactoring project that adds unnecessary work. SQL stays SQL. Python stays Python. Language-specific services remain first-class citizens.

Kestra simply ties these pieces together without introducing additional layers that teams then have to maintain.

### **Subflows for reusability**

When enterprises scale, the number of pipelines grow and the same operational steps repeat everywhere: building containers, wiring credentials, running dbt, handling failures consistently. Duplicating those steps makes changes harder and increases the risk of inconsistencies, so Kestra supports reuse at the workflow level through **subflows**.

A subflow is a complete workflow that can be invoked by other workflows. This lets us standardize how pipelines run without copying configuration everywhere, so adding or modifying pipelines stays cheap as the stack grows.

In our analytics stack, that shared logic is captured in a utility subflow called pydata. It’s job is to handle containerized execution and dbt runs. When I need to run dbt after ingesting data from HubSpot, I call the subflow. When I need to run dbt after ingesting from PostHog, I call the same subflow.

```yaml
# Simplified example
- task: subflow
  flowId: pydata
  inputs:
    dockerfile: ./Dockerfile
    requirements: requirements.txt
```

Individual workflows don’t need to know how containers are built or how dbt is invoked; they just delegate that responsibility to pydata.

The benefit is simplicity. When something changes in how we run dbt or build images, we update it once. Every pipeline stays consistent, readable, and focused on source-specific logic. As the number of pipelines grows, the operational surface area stays small.

This is the kind of reuse analytics engineering actually needs: a way to centralize coordination without spreading infrastructure concerns across every pipeline.

### **Smart alerting by namespace**

In Kestra, every workflow belongs to a **namespace**, and that namespace is visible to the orchestrator at runtime.

We use namespaces to reflect ownership and purpose in the analytics stack. Data pipelines live in one namespace, product and internal workflows live in others.

Because namespaces are part of the orchestration model, we can build alerting once, at the system level. A single monitoring flow watches execution states across all workflows.

When one of our workflows fails or enters a warning state, the monitoring flow inspects the namespace and routes failures to its respective Slack channel. Data pipeline failures go to #data-alerts, and product-related failures go to #product-alerts.

The routing logic is a small set of conditional tasks defined in ~20 lines of YAML:

```yaml
- id: route_alert
  type: io.kestra.plugin.core.flow.Switch
  value: "{{ trigger.executionId.split('.')[0] }}"
  cases:
    company.data:
      - id: notify_data_team
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        channel: "#data-alerts"
    company.product:
      - id: notify_product_team
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        channel: "#product-alerts"
```

As workflows are added or ownership changes, the alerting model remains stable because it’s driven by namespace, not by individual pipelines.

### **Orchestration that deploys like infrastructure**

All our flows are deployed via Terraform for one simple reason: Kestra’s model maps cleanly onto **infrastructure-as-code** practices.

Flows, namespaces, schedules, and secrets in Kestra are all declarative and environment-scoped. That makes them a natural fit for being managed alongside the rest of our infrastructure, rather than existing as state hidden in a UI or embedded in application code.

In our setup, workflow definitions live in Git and are promoted from development to production through Terraform. Terraform owns the deployment lifecycle, while Kestra remains the execution and coordination layer. The result is a clear separation between *what* runs and *where* it runs.

For example, our secrets flow from GCP Secret Manager into Terraform and then into Kestra. There’s no secondary configuration layer or ambiguity about what’s deployed where. Orchestration is treated like infrastructure, using the same patterns we rely on everywhere else.

For a small analytics team (n=1), because it removes operational risk. One person can make changes confidently without accidentally breaking production.

## **What this enables at Kestra**

All of this runs on one stack, coordinated by one orchestration layer, without requiring a team of specialists to keep it running.

With this setup, I deliver insights that directly impact how we grow and serve customers:

- **Sales can close faster** because they have real-time pipeline visibility and deal data from HubSpot. Instead of waiting for end-of-week reports, they see which prospects are engaging, where deals are stuck, and which outreach strategies are actually converting.
- **Marketing can measure what matters** because we've connected campaign data to product usage and revenue outcomes. They know which channels bring in users who actually convert, which content drives engagement, and how to allocate budget based on what's working—not what they hope is working.
- **Product can build the right things** because PostHog data is joined with customer data to show not just what people are doing, but who's doing it and why it matters. We can identify which features drive retention, where users get stuck, and what high-value customers need most.
- **Support can get ahead of problems** because ticket trends from Pylon are correlated with product usage patterns. When we see a spike in a particular issue, we know which customers are affected and can reach out proactively instead of waiting for complaints to roll in.
- **Leadership can make informed bets** because Common Room data shows us who's engaged in our community, where conversations are happening, and which topics are gaining traction. This feeds directly into product roadmap decisions and go-to-market strategy.

## **Orchestration has to match the reality of modern data teams**

As many of my fellow analytics engineers know, modern data teams aren't Python-only. We’re all running a mix of SQL, dbt, shell scripts, Python, and other language-specific tools, often within the same data pipeline and maintained by different people over time.

The job of an orchestrator is to adapt to that complexity. It should coordinate work across a diverse stack, run code reliably, and make failures visible, without forcing everything into a single language or abstraction.

That’s the model Kestra is built around. It’s what enables me to run our entire analytics operation solo. It’s the setup that allows teams to move fast when the business needs answers.

If you’re curious to dig deeper, **[book a demo](https://kestra.io/demo)** to see how Kestra can support your analytics stack.