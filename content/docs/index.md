---
title: Overview
---

Kestra is an open-source, event-driven orchestrator that simplifies data operations and improves collaboration between engineers and business users. By bringing Infrastructure as Code best practices to data pipelines, Kestra allows you to build reliable workflows and manage them with confidence.

Kestra allows you to [create flows](./05.developer-guide/01.flow.md) directly from the UI in just a few lines of code. Thanks to the declarative YAML interface for defining orchestration logic, everyone who benefits from analytics can participate in the data pipeline creation process. 

![video-intro](https://kestra.io/video.gif)


The UI automatically adjusts the YAML definition any time you make changes to a workflow from the UI or via an API call. Therefore, the orchestration logic is defined declaratively in code, even if some workflow components are modified in other ways.

![Adding new tasks in the UI](https://kestra.io/adding-tasks.gif)


## Principles

- **Simple**: Kestra workflows are written in YAML. It is a declarative syntax that allows you to write even [complex](./05.developer-guide/02.tasks.md#flowable-tasks) workflows regardless of the programmic language your business logic is written in.
- **Extensible**: The entire foundation of Kestra is built upon plugins. You can use an existing plugin from our [plugin library](../plugins/index.md) or build your [own](./10.plugin-developer-guide/index.md).
- **Real-time**: Kestra is built with real-time use cases in mind. You can create flows, run them, and see all their logs in real-time.
- **Scalable**: Kestra's [architecture](./08.architecture.md) allows scaling according to your workload. The [Enterprise Edition](/enterprise) can scale even more thanks to Kafka and Elasticsearch and can handle millions of executions without breaking a sweat.
- **Cloud-native**: Built with the cloud in mind, Kestra uses cloud-native technologies and allows you to [deploy your server anywhere](./09.administrator-guide/02.deployment/index.md).


## Usage

- **Data orchestrator**: Handle complex workflows and process large datasets. Extract, transform, and load datasets according to your needs (ETL or ELT).
- **Distributed crontab**: Schedule and monitor every process, regardless of whether it's a data workflow, business process or infrastructure management.
- **Event-driven workflow**: React to external events to decouple processes and remove dependencies instead of managing them.

Read the [Getting started](./01.getting-started.md) guide to create your first flow.
