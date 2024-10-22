---
title: "Orchestrate Your Airflow Jobs with Kestra: One Workflow at a Time"
description: Integrate your existing Airflow DAGs with Kestra, avoid complex migrations and get better monitoring, and simplified workflow management. Scale your workflows without the need to rewrite everything from scratch.
date: 2024-10-22T15:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  role:
  image: mproset
image: /blogs/2024-10-22-orchestrate-dags-with-kestra.jpg
---

Migrating from one orchestration tool to another can seem like an intimidating task—especially if you have critical workflows running in production. When you rely on Airflow for essential data processing, the idea of moving everything to a new platform at once might feel risky. That’s why with **Kestra**, you don't have to jump into a big-bang migration. Instead, you can transition **one workflow at a time** and gradually adopt Kestra’s advanced orchestration capabilities while keeping what works in Airflow.

By allowing you to integrate and manage your existing **Airflow DAGs alongside Kestra’s workflows**, Kestra provides a unified platform to run, monitor, and orchestrate both old and new systems.

## The Strangler Fig Pattern for Orchestration

This gradual migration is part of a well-known strategy called the [**Strangler Fig Pattern**](https://martinfowler.com/bliki/StranglerFigApplication.html), where the new system (Kestra) slowly replaces the old one (Airflow) by taking over its workflows, piece by piece. Over time, more and more workflows run in Kestra, while Airflow’s role diminishes—until, eventually, Kestra handles everything.

This approach avoids the risks and complexity of doing a full migration in one go. Instead of uprooting everything at once, you can orchestrate Airflow DAGs within **Kestra’s control plane** and **centralized UI**, gaining better visibility and scalability, while continuing to leverage what’s already working in Airflow.

### Airflow Plugin: Migrate Without Disruption

In response to many requests from users seeking support for easier migrations from Airflow, we've developed a **plugin** that lets you trigger and orchestrate Airflow DAGs directly from within Kestra. This makes it possible to **run Airflow jobs as part of your Kestra workflows**, giving you the flexibility to incorporate your existing DAGs into Kestra's broader orchestration capabilities.

Here’s an example of how you can use Kestra to trigger an Airflow DAG:

```yaml
id: airflow
namespace: company.team

tasks:
  - id: run_dag
    type: io.kestra.plugin.airflow.dags.TriggerDagRun
    baseUrl: http://host.docker.internal:8080
    dagId: example_astronauts
    wait: true
    pollFrequency: PT1S
    options:
      basicAuthUser: "{{ secret('AIRFLOW_USERNAME') }}"
      basicAuthPassword: "{{ secret('AIRFLOW_PASSWORD') }}"
    body:
      conf:
        source: kestra
        namespace: "{{ flow.namespace }}"
        flow: "{{ flow.id }}"
        task: "{{ task.id }}"
        execution: "{{ execution.id }}"

```

In this setup:

- **Trigger Airflow DAGs** through Kestra's Airflow plugin using the Airflow REST API.
- **Monitor and poll the status** of your Airflow tasks directly within Kestra, allowing for real-time visibility.
- **Pass execution metadata** (like task and flow IDs) to maintain context and track workflow performance across both platforms.

## Kestra: A Central tool for All Your Workflows

Once integrated, Kestra becomes the **central control plane** for orchestrating workflows across your stack. Whether it's managing complex real-time data pipelines or orchestrating legacy Airflow jobs, you can monitor all executions through **Kestra’s dashboard**, which offers deeper insights and enhanced monitoring compared to Airflow’s built-in tools. With centralized logging, real-time outputs, and intuitive error tracking, Kestra simplifies your workflow management.

Kestra’s **declarative approach** makes it easier to build and manage workflows. Say goodbye to the complexity of Python-based DAGs. Instead of managing dependencies, glue code, and intricate DAG structures, Kestra lets you define workflows in a simple, readable format and manage them directly through the UI.

### Simplifying Complex Workflows: Get Rid of Glue Code

Airflow is known for its complexity in constructing DAGs—especially when basic workflows end up requiring complicated Python scripts. With **Kestra**, you can streamline your workflows with a **declarative, YAML-based syntax**, eliminating the need for glue code and additional scripting.

Here’s how Kestra helps you:

- **No need for Python glue code**: Kestra’s pre-built tasks handle common operations like HTTP requests, file transfers, and API calls without extra scripting.
- **Unified orchestration**: Use Kestra to orchestrate tasks across diverse platforms—cloud services, data processing, APIs—within the same workflow.
- **UI-based management**: Build, trigger, and monitor workflows directly from Kestra’s UI without needing to edit code.

## What’s Next on the Roadmap?

Currently, you can orchestrate Airflow DAGs using Kestra, but we’re working on expanding this integration. Soon, we’ll provide more detailed documentation and tools to help users **migrate Airflow workflows** directly into Kestra. The goal is to make it as seamless as possible to shift your orchestration to Kestra at your own pace.

### How Can We Help?

We want to hear from you! If there are specific features or tools you’d like to see to support your migration from Airflow, let us know. We’re constantly working on ways to make this transition easier for you, and your feedback is invaluable. Visit our demo page to get in touch or learn more.

## Conclusion: Migrate Without the Big Bang

Migrating to a new orchestration platform doesn’t have to mean ripping out everything at once. With Kestra, you can adopt a **gradual migration strategy**, integrating your existing Airflow workflows while gaining access to the advanced orchestration features that Kestra offers. Whether you need a unified UI, better monitoring, or scalable workflows, Kestra simplifies orchestration without the need for complex migrations.

So why not give it a try? Use Kestra to orchestrate Airflow alongside your other workflows and **scale at your own pace**.

Need to talk about migration just [reach out to us](/demo) we would be happy to discuss this with you!

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).
If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
