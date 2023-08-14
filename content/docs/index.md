---
title: 📓 Welcome to Kestra
---

Kestra is an open-source data orchestrator that makes both **scheduled** and **event-driven workflows** easy. By bringing Infrastructure as Code best practices to data pipelines, you can build reliable data pipelines and manage them with confidence.

In just a few lines of code, you can [create a flow](./05.developer-guide/01.flow.md) directly from the UI. Thanks to the declarative YAML interface for defining orchestration logic, business stakeholders can participate in the workflow creation process, instead of making that an engineering-only endeavor. 

Because the UI automatically adjusts the YAML definition any time you make changes to a workflow from the UI or via an API call, the orchestration logic is stored declaratively in code, even if some workflow components are modified in other ways (UI, CI/CD, Terraform, API call).

![Adding new tasks in the UI](https://kestra.io/adding-tasks.gif)


---

## Design Principles

**Simple is better than complex**: you can build your first scheduled workflow in less than 5 minutes from the UI without even having to think about managing local environments, infrastructure, deployments or CI/CD. Simplicity scales, complexity fails. We believe that, in the long run, a simple orchestration API is less likely to fail than convoluted client-side orchestration tied to a single programming language.

**Real-time & event-driven**: Kestra is built with real-time use cases in mind. You can create flows, run them, and see all their logs in real-time. Kestra can be used along with Kafka to process a large number of events at any scale.

**Scalable architecture as a foundation**: Kestra's [architecture](./08.architecture.md) is built with proven and time-tested technologies including Postgres, Kafka and Elasticsearch. The [Enterprise Edition](/enterprise) can can handle millions of executions per second without breaking a sweat thanks to a backend built on top of Kafka and Elasticsearch.

**API-first design**: every action in Kestra is API-driven. In contrast to Python-based workflows that heavily rely on client-side imlementation in a single language, Kestra's workflow definition is a config that gets sent as a payload to an API call. 
- You define in a YAML config **which tasks** do you want to orchestrate, and **how**, and that config is sent to Kestra's backend via an API call. 
- This **microservice-oriented design** makes your orchestration language-agnostic, and opens up the door to all sorts of automations. With every action behind the API, there are no limits to what you can automate, from changing task configuration using your internal tools, to triggering, adding or modifying workflows in any way you can imagine. All that without having to redeploy any code or rebuild Docker images.  

**Portability**: Kestra's workflows are programming-language agnostic. Your tasks can be written in Python, R, Node.js, Julia, Rust, Bash or Powershell. You can also extend the platform via custom plugins, triggers and tasks.

**Declarative AND imperative**: we believe that declarativeness is a spectrum and you decide about the degree of how declarative or imperative you want your tasks to be. You can write as simple or as [complex](./05.developer-guide/02.tasks.md#flowable-tasks) workflows as you want them to be. 

**Separation of orchestration and business logic**: mixing the two can result in a complicated data platform that ties you to a specific platform. Kestra can orchestrate business logic written in any language or platform without you having to make ANY modifications to your code. No Python decorators are required, and no need to worry about breaking your orchestration system due to misaligned Python package dependencies. 

**Extensible**: Kestra is built on top of a plugins ecosystem. You can use an existing plugin from our [plugin library](../plugins/index.md) or build your [own](./10.plugin-developer-guide/index.md). You don't even need to know much of Java to build your own plugin — as long as your custom script can be packages into a Docker container, you can use it similarly to [script plugins](https://github.com/kestra-io/plugin-scripts).

**Cloud-native**: Built with the cloud in mind, Kestra uses cloud-native technologies and allows you to [deploy your server anywhere](./09.administrator-guide/02.deployment/index.md).


---

## Kestra Use Cases

**Data orchestrator**: orchestrate ETL and ELT workflows and process data at any scale.

**Process orchestrator**: coordinate and automate your business processes using a collaborative UI from where engineers can work in tandem with business stakeholder. You can use Kestra to build an internal platform where domain experts can adjust task properties and SQL queries without having to file a ticket to developers.

**Distributed scheduler**: schedule and monitor every process, regardless of whether it's a data workflow, business process or infrastructure management.

**Event-driven workflows**: React to external events sent from Kafka, SQS, Google PubSub and more and use Kestra to decouple processes. The best way to manage dependencies is to remove them — Kestra's trigger system helps you decouple systems in a trasparent way.

![video-intro](https://kestra.io/video.gif)


It's time to [get started](./01.getting-started.md)! 🚀 Move on to the next section to launch Kestra and create your first flow.
