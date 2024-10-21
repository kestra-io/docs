---
title: Serverless Data Pipelines with Kestra, Modal, dbt, and BigQuery
description: Learn how to create interactive workflows that dynamically adapt compute to your needs using Kestra’s open-source orchestration platform and serverless infrastructure provided by Modal and BigQuery.
date: 2024-10-21T11:30:00
category: Solutions
author:
  name: Anna Geller
  image: ageller
  role: Product Lead
image: /blogs/serverless-data-pipelines.jpg
---

Building data pipelines often comes down to getting the right compute power when you need it. With serverless options like Modal and BigQuery, you can focus on your workflows without having to think about infrastructure. In this post, we'll walk through a real-world example of a serverless data pipeline where we use **Kestra** for orchestration, **Modal** for on-demand compute, **dbt** for data transformations, and **BigQuery** for data storage and querying. Based on this example, we'll explore why [Kestra](https://github.com/kestra-io/kestra) is a great choice for orchestrating serverless data pipelines and how it can help you build interactive workflows that dynamically adapt compute to your needs.

## Get the code

You can find the entire code for this project in the [kestra-io/serverless](https://github.com/kestra-io/serverless) repository.

Here is a conceptual overview of the project:

![serverless_flow](/blogs/serverless-data-pipelines/serverless_flow.jpg)


## Serverless Workflow in Action

In this project, we'll simulate an e-commerce company that wants to forecast sales for the upcoming holiday season. The company has historical data about customers, orders, products, and supplies stored in their internal database. We'll extract that data, load it to BigQuery, and transform it using dbt. Then, we'll run a time-series forecasting model on Modal to predict the order volume for the next 180 days.

Here's a more detailed breakdown of the workflow:

1. **Data ingestion with Kestra**: the workflow starts by ingesting raw data from an HTTP REST API into BigQuery. The dataset includes customers, orders, order items, product details, stores, and supplies. Each dataset is fetched and stored as a `.parquet` file and loaded into its own BigQuery table.

2. **Transformation with dbt**: once the data is loaded into BigQuery, we use **dbt** to transform it. For example, we use dbt to join datasets, create aggregate tables, and apply business logic to make the data ready for analysis. A critical part of this process is generating a `manifest.json` file, which dbt uses to track the state of the models. Kestra stores this manifest in a [KV Store](https://kestra.io/docs/concepts/kv-store), so the next time the workflow runs, we don’t need to re-run unchanged models.

3. **Forecasting on Modal**: after the transformation, we trigger a forecasting model using **Modal**. This is where serverless compute comes into play — Modal dynamically provisions the necessary resources (with requested CPU, memory, etc.) based on user inputs. If you need more CPU for a large dataset, you simply select it in the dropdown menu in the UI when running the workflow, and Kestra will pass that information to Modal. The forecasted data is stored in BigQuery, and the final interactive HTML report is stored in a Google Cloud Storage (GCS) bucket.

4. **Logs and artifacts**: throughout, Kestra manages all code dependencies, state, and outputs. It captures logs, metrics, and artifacts like the dbt manifest and the HTML report from Modal. This way, you can monitor progress, troubleshoot issues, and even reuse artifacts in future runs.

You can see the entire workflow in action in the video below:

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/Wqz7CZudqNo?si=QgO2bizPu2a-vBoB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

## Modular Data Transformations with dbt

The dbt models used in [this project](https://github.com/kestra-io/serverless/tree/main/dbt/models) are structured into three main layers: **staging**, **marts**, and **aggregations**:
- **Staging layer** prepares raw data for consistent use
- **Marts layer** creates business-centric tables for further analysis
- **Aggregations layer** calculates metrics like average order value and revenue by city.

Each layer handles a different stage of data transformation.

This modular structure helps ensure that the data transformations are well-organized, maintainable and scalable.

---

## Why Use Kestra for Serverless Workflows

Now that we covered what the project does and how it's structured, let's highlight the benefits of using Kestra for orchestrating serverless data pipelines such as this one.

### Structure & Governance

Serverless is often associated with a tangled mess of functions and services that are hard to manage and debug. But it doesn't have to be that way. With Kestra, you can create structured, modular workflows that are easy to understand, maintain, and scale.

Using [labels](https://kestra.io/docs/workflow-components/labels), [subflows](https://kestra.io/docs/workflow-components/subflows), [flow triggers](https://kestra.io/docs/workflow-components/triggers/flow-trigger), [tenants](https://kestra.io/docs/enterprise/tenants) and [namespaces](https://kestra.io/docs/workflow-components/namespace) you can bring order, structure and governance to serverless workflows.
- Each **dashboard** in Kestra can be filtered by namespaces or labels, so you can easily monitor your serverless data pipelines.
- **Subflows** let you encapsulate common tasks and reuse them across multiple flows.
- **Event triggers** allow you to start a workflow as soon as a new file arrives in a cloud storage bucket or a new message is received in your Pub/Sub topic.
- **Namespaces** help you organize your workflows into logical groups, making it easier to manage state (KV Store), secrets, variables, plugin configuration and access control.

### Interactivity with Conditional Inputs

One of the standout features of Kestra is the ability to create **interactive workflows** with [conditional inputs](https://kestra.io/docs/workflow-components/inputs#conditional-inputs-for-interactive-workflows) that depend on each other. In our example, the workflow dynamically adapts to user inputs to determine whether to run a task, adjust compute resource requests, or customize the forecast output. Here’s why this flexibility is valuable:

- **On-the-fly Adjustments**: you don't need to redeploy code every time you want to change an input or parameter. If, for instance, you want to adjust the number of CPU cores for a forecast running on Modal, you can adjust that value at runtime or configure it in a `Schedule` trigger definition as shown below. Conditional inputs, like the `cpu` and `memory` options shown only when you choose to run the Modal task, make the workflow less error-prone as users can't accidentally enter the wrong values or run the flow with invalid parameters. The strongly typed inputs introduce governance and guardrails to ensure that only valid inputs are accepted.

```yaml
triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
    inputs:
      run_ingestion: false
      run_modal: true
      cpu: 0.25
      memory: 256
      customize_forecast: true
      nr_days_fcst: 90
      color_history: blue
      color_prediction: orange
```

- **Skip Unnecessary Tasks**: some tasks don’t always need to run. For example, if the ingestion process hasn’t changed, you can skip it by setting the `run_ingestion` input to `false`. Kestra's conditional logic ensures tasks are executed only when necessary, saving time and compute resources.

- **Dynamic Resource Allocation**: Kestra’s interactive workflows make it easy to fine-tune input parameters on the fly, depending on the size of your dataset or the complexity of your model. The dbt project already runs on serverless compute with BigQuery, but you can additionally scale the dbt model parsing process to run on serverless compute such as AWS ECS Fargate, Google Cloud Run, or Azure Batch using Kestra's [Task Runners](https://kestra.io/docs/task-runners).

### Storing State with Kestra

Another benefit of using Kestra in this architecture is its ability to store and manage state, which is especially needed for serverless data pipelines that are typically stateless by design. Kestra keeps track of the workflow state, so you can easily rerun any part of the pipeline if any task fails, e.g. using one of our most popular 🔥 [Replay feature](https://kestra.io/docs/concepts/replay) allowing you to rerun a flow from any chosen task.

For example, Kestra can store artifacts such as dbt's `manifest.json` in the [KV store](https://kestra.io/docs/concepts/kv-store). This file contains information about materialized tables, so we can avoid rerunning dbt models that haven't changed since the last run. This is a notable time-saver, especially when working with large datasets or complex transformations.

Additionally, Kestra captures logs, metrics and outputs at each stage of the workflow. This provides visibility into what happened during serverless workflow execution. If something goes wrong, Kestra can [automatically retry](https://kestra.io/docs/workflow-components/retries) transient failures, and if retries don't help, you can quickly track down the issue by reviewing the logs or inspecting the [output artifacts](https://kestra.io/docs/workflow-components/outputs) and [replaying the flow](https://youtu.be/RvNc3gLXMEs?si=tcY7KoZCa_lZ-Lhy) from a specific point. And when everything works as expected, these logs serve as a detailed record of what was processed, when, how long each step took, and what were the final outputs.

### Future-Proof Your Data Platform

The power of this architecture lies in combining serverless infrastructure with a reliable, flexible orchestration platform. Each component brings specific strengths:
- **Modal** dynamically provisions compute resources when you need them for resource-intensive tasks
- **dbt** transforms raw data into structured tables and models
- **BigQuery** serves as the centralized data warehouse for storing and querying data
- **Kestra** ties everything together, providing a user-friendly UI while [keeping everything as code](https://youtu.be/dU3p6Jf5fMw?si=exewHm04snLQRi9B) under the hood. It manages state, retries, concurrency, and timeouts, while also coordinating conditional logic and capturing logs, metrics, and outputs. With Kestra’s built-in plugins, there's no need to install extra dependencies – dbt, BigQuery, and Modal plugins are built-in and ready to use right away.

## Final Thoughts

The best part about Kestra is that everything works out of the box. Thanks to the built-in plugins, you don’t have to fight with Python dependencies to install dbt or Modal — plugins are pre-installed and ready to use. The powerful UI lets you interactively adjust workflow inputs, skip steps if needed, and easily track all output artifacts without jumping through hoops. Adding Modal and BigQuery to the mix provides serverless compute on-demand and a scalable data warehouse to future-proof your data platform.

If you want to give this setup a try, you can find the entire code for this project in the [kestra-io/serverless](https://github.com/kestra-io/serverless) repository. [Launch Kestra](https://kestra.io/docs/getting-started/quickstart#start-kestra) in Docker, add the flow from that GitHub repository, and run it. That's all you need to get started with serverless, interactive workflows.

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

