---
title: "Orchestrate Your Airflow DAGs: Keep What Works, Scale What Doesn’t"
description: Integrate your existing Airflow DAGs with Kestra, avoid complex migrations and get better monitoring, and simplified workflow management. Scale your workflows without the need to rewrite everything from scratch.
date: 2024-10-22T15:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  role:
  image: mproset
image: /blogs/2024-10-22-orchestrate-dags-with-kestra.jpg
---

Migrats workflows to a new orchestration tool can be intimidating, especially when you have DAGs running critical jobs. You might wonder if it's worth the risk to move to something new when your legacy systems are already doing the job. However, if you're facing scaling issues or want more flexibility in managing workflows across different environments, **Kestra** can complement your Airflow setup—without forcing a full migration.

Rather than rewriting all your Airflow DAGs from scratch, Kestra allows you to **integrate your existing Airflow workflows**. This way, you can keep your well-established pipelines while taking advantage of Kestra’s broader capabilities for orchestration across both old and new systems.

Let’s dive into how you can orchestrate Airflow jobs using Kestra and how this approach helps developers avoid the headaches that come with full-scale migrations.

## Orchestrating Airflow DAGs with Kestra: No Need to Reinvent the Wheel

Kestra doesn’t force you to abandon your Airflow DAGs. Instead, it offers integration that lets you trigger and monitor Airflow jobs through Kestra while benefiting from our advanced orchestration capabilities. Whether you’re managing data pipelines, API calls, or cloud services, Kestra can orchestrate everything while maintaining your existing Airflow processes.

Here’s an example of triggering an Airflow DAG within a Kestra workflow. Using Kestra’s Airflow plugin, you can trigger the DAG and monitor its completion with full control over execution:

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

In this workflow:

- The Airflow DAG is triggered via the **Airflow REST API**.
- Kestra waits for the DAG run to complete, polling for its status automatically.
- You can pass metadata like flow ID, task ID, and execution details to keep track of context.

This setup allows you to maintain your Airflow jobs while orchestrating them alongside new workflows managed through Kestra.

## Get Rid of the Complexity: Declarative Workflows, No Glue Code

One of the challenges with Airflow is the complexity of building and maintaining DAGs in Python, especially for essentially basic workflows that require detailed DAG configurations. With **Kestra**, you can get rid of this complexity by adopting a **declarative approach**.

You can also manage these workflows directly from the UI without having to write glue code or manage complicated Python scripts. This simplifies the orchestration process, making it easier for teams to define and manage their workflows without being bogged down by DAG structure or language specifics.

With Kestra, you can:

- **Avoid glue code**: You don’t need additional Python scripts to make things work. Kestra’s tasks are pre-configured to handle common operations like HTTP requests, database queries, and file handling, so you can focus on the logic of your workflow rather than setup and dependencies.
- **Use a declarative syntax**: Kestra’s YAML-based syntax makes workflows easier to read, maintain, and share across teams.
- **Access workflows via UI**: Kestra provides a user-friendly interface to manage your tasks, trigger executions, and monitor progress—reducing the need to dive deep into code for every adjustment.

While Airflow has long been a trusted tool for data workflows, it has limitations when your workflows need to scale across different environments or go beyond data pipelines. Kestra unify your tech stack, it allows you to orchestrate everything from your ETL jobs to trigger cloud services and APIs.

## Better Monitoring and Control with Kestra

**Kestra’s dashboard** offers a comprehensive control plane, giving you visibility into all your workflows—whether they’re running on Airflow or Kestra.

With **advanced monitoring features**, you can track the status of your workflows, see execution outputs, manage retries, and immediately identify failures, all through an intuitive interface. Unlike Airflow's often fragmented monitoring tools, Kestra centralizes everything, making it easier to manage and troubleshoot:

- **Track execution**: Get immediate insight into how your workflows are running.
- **Centralize logs**: No more scattered logs—Kestra provides centralized logs for easier debugging.
- **Manage task dependencies and retries**: Directly from the UI, without writing additional code.

## Conclusion: Scale Your Workflow Without Starting Over

Moving to Kestra doesn’t mean abandoning your current DAGs. With Kestra, you can **orchestrate Airflow jobs** alongside new workflows and gain more flexibility, better monitoring, and simpler workflow creation. Whether it’s automating complex cloud tasks or just orchestrating data pipelines, Kestra allows you to scale and improve your workflows without having to rewrite everything from scratch.

By integrating Kestra into your orchestration strategy, you can manage everything—old and new—from a single platform. Whatever your workflow needs, Kestra provides the tools to keep things running smoothly at scale. Keep what works and scale what doesn’t.

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).
If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
