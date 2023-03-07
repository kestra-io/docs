---
order: 0
---

# Overview

Kestra is an orchestration and scheduling platform that helps you build, run, schedule, and monitor complex pipelines. It also makes it easy to [create a flow](developer-guide/), requiring only a few lines of YAML. It handles all other complexities like deploying, scaling, monitoring, and error handling.

![Kestra UI](/ui.gif)


## Principles

- **Simple**: Kestra workflows are written in YAML. It is a declarative syntax that allows you to write even [complex](developer-guide/tasks/README.md#flowable-tasks) workflows.
- **Extensible**: The entire foundation of Kestra is built upon plugins. You can use an existing plugin from our [plugin library](../plugins) or build your [own](plugin-developer-guide).
- **Real-time**: Kestra is built with real-time use cases in mind. You can create flows, run them, and see all their logs in real-time.
- **Scalable**: Kestra's [architecture](architecture) allows scaling according to your workload. The [Enterprise Edition](https://kestra.io/features/enterprise.html) can scale even more thanks to Kafka and Elasticsearch and can handle millions of executions without breaking a sweat.
- **Cloud-native**: Built with the cloud in mind, Kestra uses cloud-native technologies and allows you to [deploy everywhere](administrator-guide/deployment).


## Usage

- **Data orchestrator**: Handle complex workflows and move large datasets. Extract, transform, and load datasets according to your choice (ETL or ELT).
- **Distributed crontab**: Schedule works on multiple workflows and monitor every process.
- **Event-driven workflow**: React to external events like API calls to get things done instantly.

Read now our [Getting started](getting-started) guide to create your first flow.
