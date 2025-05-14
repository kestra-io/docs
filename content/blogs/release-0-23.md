---
title: Kestra 0.23 introduces [TITLE TBD]
description: Kestra 0.23 brings powerful new features including [DESCRIPTION TBD]
date: 2025-06-03T17:00:00
category: News & Products Updates
author:
  name: Benoit Pimpaud
  image: bpimpaud
image: /blogs/release-0-23.jpg
---


The table below highlights the key features of this release.

| Feature                                   | Description                                                                | Edition |
|-------------------------------------------|----------------------------------------------------------------------------| --- |
| Multi Panel Editor       | Enhanced visual editor with split-screen capabilities for simultaneous code and visual editing | All Edition |
| Unit Test Flows       | Built-in testing framework for validating workflow behavior | [TBD] |
| Improved Filtering capabilities         | Enhanced search experience with fixed and improved filters | All Edition |
| Outputs in Internal Storage      | Store and manage workflow outputs directly in Kestra's internal storage | Enterprise Edition |
| Improved dashboard management         | Configure your own default dashboard to customize your experience | All Edition |
| Caching dependencies    | Speed up your workflows by caching script dependencies across executions | All Edition |
| Manage Apps & Dashboard with Git | Version control your dashboards and applications with Git integration tasks | All Edition |

Check the video below for a quick overview of all enhancements.

<div class="video-container">
    <iframe src="[YOUTUBE_VIDEO_URL]" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Let's dive into these highlights and other enhancements in more detail.

## Feature Highlights

### Multi Panel Editor

The Multi Panel Editor transforms how you design and manage workflows by introducing a unified interface with split-screen capabilities. This powerful enhancement allows you to simultaneously view and edit your workflows in multiple formats - YAML code, visual no-code editor, topology view, and documentation - all within a single, integrated workspace.

With this flexible interface, you can:
- Edit YAML directly while previewing the visual representation in real-time
- Switch between code and no-code approaches based on your preference or task complexity
- Visualize task dependencies through the topology view while making edits
- Reference documentation without leaving your editing environment

You can customize your experience by opening only the panels you need, creating a workspace tailored to your workflow development style. This enhancement significantly improves productivity by reducing context switching and providing multiple perspectives on your workflows simultaneously.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/PLACEHOLDER" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

### Unit Test Flows

[FEATURE 2 DESCRIPTION]


### Outputs in Internal Storage

Kestra 0.23 introduces a powerful configuration-based capability to move task outputs from in-memory context (by default stored in the database) to Kestra's Internal Storage. This Enterprise Edition feature addresses critical scalability challenges for data-intensive workflows.


By offloading task outputs to Internal Storage, Kestra can maintain execution context for complex workflows with large intermediate data while keeping the database footprint minimal. This configuration-based approach gives administrators fine-grained control over resource utilization and performance optimization.

This feature is particularly valuable for data-focused workflows that process large volumes of data between tasks, as it removes previous limitations on output size while preserving Kestra's robust execution semantics.

#TODO: Add example of configuration

### Improved dashboard management

This new release enhances the dashboard experience with the ability to configure your own default dashboard - putting you in control of what you see when you first log in. This feature allows you to personalize your monitoring and operational view to match your specific workflow requirements.

With improved dashboard management, you can:
- Set any custom-built dashboard as your default view
- Tailor your monitoring experience to focus on the metrics that matter most to you
- Access your most important information immediately upon login
- Switch between different dashboards based on your current needs


#TODO: screenshots?

### Caching dependencies

[FEATURE 5 DESCRIPTION]


### Manage Apps & Dashboard with Git

Kestra 0.23.0 introduces powerful new Git integration tasks that allow you to version control your dashboards and applications, bringing the benefits of Git workflows to your Kestra assets.

With the new Git integration for dashboards and apps, you can now:

- **Version control your dashboards and apps** using `gitSyncDashboard`, `gitPushDashboard`, `gitSyncApps`, and `gitPushApps` tasks
- **Track changes** to configurations over time
- **Collaborate** with team members using familiar Git workflows
- **Roll back** to previous versions when needed


#TODO: add example of GitSyncApps task
::collapse{title="Dashboard GitSyncApps integration example"}

::

https://github.com/kestra-io/plugin-git/issues/122
https://github.com/kestra-io/plugin-git/issues/121


## Notable Enhancements

- Enhanced Ion data format support with new `IonToParquet` and `IonToAvro` tasks for efficient data conversion, plus `InferAvroSchemaFromIon` task for schema generation, all enabling more flexible data transformations

- Pause task enhancement - https://github.com/kestra-io/kestra/issues/8242
> add pauseDuration
> deprecate delay (copy to pauseDuration if set)
> remove timeout from Pause (if used and pauseDuration is not set, copy it to pauseDuration with behavior = FAIL)
> we can't fully remove timeout as it's used by the abstract class, but it will not be exposed to the user
> add behavior Enum field: RESUME, WARN, FAIL, CANCEL → default RESUME


- **Enhanced Plugin Usage Metrics**: Kestra now provides detailed plugin usage metrics based on the number of executions. These metrics are fully compatible with Kestra [internal metrics](..docs/09.administrator-guide/03.monitoring) (exposable through Prometheus), enabling comprehensive monitoring and analytics of your workflow patterns. This enhancement allows you to track which plugins are most frequently used, identify performance bottlenecks, and make data-driven decisions about resource allocation and optimization. 

- **Enhanced Data Backup**: Building on our previous metadata backup functionality, Kestra now supports comprehensive execution data backup and restoration. This complete backup solution ensures you can recover not just metadata but all execution-related information, providing robust disaster recovery capabilities for your mission-critical workflows.

## UI Improvements

Here are UI enhancements worth noting:
- [UI IMPROVEMENT 1]
- [UI IMPROVEMENT 2]
- [UI IMPROVEMENT 3]
- [UI IMPROVEMENT 4]
- [UI IMPROVEMENT 5]

## Plugin development


### Salesforce

We've introduced a new enterprise Salesforce plugin: the plugin includes tasks for creating, updating, deleting, and querying Salesforce objects, allowing you to seamlessly integrate Salesforce operations into your Kestra workflows.

::collapse{title="Example of Salesforce integration"}
EXAMPLE
::

### HubSpot

We've introduced a comprehensive HubSpot plugin with tasks for managing companies, contacts, and deals. The plugin provides a complete set of operations (Create, Get, Update, Delete, Search) for each entity type, allowing you to seamlessly integrate HubSpot CRM operations into your Kestra workflows with proper authentication and consistent property handling.

::collapse{title="Example of HubSpot integration"}
::


### OpenAI Response

- https://github.com/kestra-io/plugin-openai/issues/45


### Langchain (beta)

- Mention RAG capabilities?


### Go scripts

Added two new Go script tasks:

- `Script` task (io.kestra.plugin.scripts.go.Script) - Executes multi-line Go scripts
- `Commands` task (io.kestra.plugin.scripts.go.Commands) - Runs multiple Go scripts using `go run`

https://github.com/kestra-io/plugin-scripts/pull/239

::collapse{title="Example using Go scripts"}
```yaml
[EXAMPLE_YAML]
```
::

### Databricks CLI

We've added a new Databricks SQL CLI task that allows you to execute SQL commands directly against Databricks SQL warehouses. This task leverages the official Databricks SQL CLI tool to provide seamless integration with your Databricks environment, enabling you to run queries, manage data, and automate SQL operations within your Kestra workflows.


### Redis improvement

https://github.com/kestra-io/plugin-redis/issues/98

::collapse{title="Example with [PLUGIN 2]"}
```yaml
[EXAMPLE_YAML]
```
::

### InfluxDB

- https://github.com/kestra-io/plugin-influxdb/issues/2

::collapse{title="Example with [PLUGIN 2]"}
```yaml
[EXAMPLE_YAML]
```
::

### GraphQL

- https://github.com/kestra-io/kestra/issues/2478



## Thanks to Our Contributors

Thank you to everyone who contributed to this release through feedback, bug reports, and pull requests. If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues). With the [DevContainer support](docs/01.getting-started/03.contributing.md), it's easier than ever to start contributing to Kestra.

## Next Steps

This post covered new features and enhancements added in Kestra 0.23.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack). 