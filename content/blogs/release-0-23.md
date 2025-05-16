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

As workflows grow in complexity, so does the need to test them reliably. Kestra introduces native support for Unit Testing, giving users powerful new capabilities to validate their flows with confidence and precision.
Until now, users relied on manual execution or external scripting to verify behavior. With Unit Test support, you can now define expected outcomes, isolate tasks, and detect regressions early—directly inside your development environment.

Key components of the Unit Testing include:

- **Test Suites**: Create test suites targeting individual tasks or full sections of your flows. Each suite encapsulates a set of test cases, allowing you to cover multiple paths and edge cases without executing the full logic end-to-end.
- **Fixtures**: Define fixtures to simulate inputs or task outputs. This skips real execution for mocked tasks, making your tests faster, deterministic, and easier to isolate.
- **Assertions**: Each test can include assertions to check for expected outcomes—task results, flow variables, execution paths, or any output produced by the flow. This helps ensure your flow behaves correctly under different conditions.
- **API Access**: You can call the Unit Test programmatically via Kestra API, enabling automation in CI/CD pipelines, custom tooling, or integration with development workflows.


#TODO: add example of unit test with a flow and corresponding test suite
::collapse{title="Unit test example"}

::


<div class="video-container">
  <iframe src="https://www.youtube.com/embed/PLACEHOLDER" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

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

We've enhanced our OpenAI plugin with a new `Responses` task that integrates OpenAI's latest Responses API – their newest agentic API primitive. This task allows you to create AI-generated responses with built-in tools and structured outputs directly within your workflows.

The Responses API combines the simplicity of Chat Completions with powerful agentic capabilities, making it ideal for creating action-oriented applications. The task supports all of OpenAI's built-in tools, including:

- Web search for retrieving real-time information
- File search for analyzing documents
- Computer use for more complex interactions

You can also format outputs as structured JSON, making it easy to parse and use the generated content in downstream tasks. This is particularly valuable for transforming unstructured requests into structured data that can be directly utilized in your data pipelines.

::collapse{title="Example of OpenAI Responses integration"}
```yaml
id: responses_json_search
namespace: company.team
inputs:
  - id: prompt
    type: STRING
    defaults: "List recent trends in workflow orchestration. Return as JSON."
tasks:
  - id: trends
    type: io.kestra.plugin.openai.Responses
    apiKey: "{{ secret('OPENAI_API_KEY') }}"
    model: gpt-4.1
    input: "{{ inputs.prompt }}"
    text:
      format:
        type: json_object
    toolChoice: required
    tools:
      - type: web_search_preview
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.trends.outputText }}"
```
::

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

We've enhanced our Redis plugin with a new `Increment` task that allows you to atomically increment the value of a key in a Redis database and return the new value. This is particularly useful for implementing counters, rate limiters, or any scenario where you need atomic incrementation of numeric values stored in Redis.


::collapse{title="Example with [PLUGIN 2]"}
```yaml
id: redis_increment
namespace: company.team
inputs:
    - id: key_name
      type: STRING
      displayName: Key name to increment
tasks:
  - id: increment
    type: io.kestra.plugin.redis.string.Increment
    url: redis://:redis@localhost:6379/0
    key: "{{ inputs.key_name }}"
```
::


### ServiceNow improvement

We've expanded the ServiceNow plugin with two new tasks:

- **Update** task to update a record in a ServiceNow table.
- **Delete** task to delete a record from a ServiceNow table.

### InfluxDB

We're excited to introduce our new InfluxDB plugin, which provides comprehensive integration with InfluxDB time series database. This plugin enables you to write data to InfluxDB and query it using both Flux and InfluxQL languages, making it perfect for time series data processing and monitoring workflows.

The plugin includes several powerful tasks:

- **Write** task (`io.kestra.plugin.influxdb.Write`) - Write data to InfluxDB using InfluxDB line protocol format.
- **Load** task (`io.kestra.plugin.influxdb.Load`) - Load data points to InfluxDB from an ION file where each record becomes a data point.
- **FluxQuery** task (`io.kestra.plugin.influxdb.FluxQuery`) - Queries InfluxDB using the Flux language, with options to output results as ION internal storage or directly in the execution.
- **InfluxQLQuery** task (`io.kestra.plugin.influxdb.InfluxQLQuery`) - Queries InfluxDB using the InfluxQL language, with the same output options as FluxQuery
- **FluxTrigger** (`io.kestra.plugin.influxdb.FluxTrigger`) - Automatically triggers workflow executions when a Flux query returns results

This integration is particularly useful for IoT data processing, monitoring metrics, and any workflow that involves time series data analysis.

::collapse{title="InfluxDB example"}
```yaml
[EXAMPLE_YAML]
```
::

### GraphQL

We've introduced a new GraphQL plugin that enables integration with GraphQL APIs in your data workflows. The plugin features a `Request` task that allows you to execute GraphQL queries and mutations against any GraphQL endpoint, with full support for authentication headers, variables, and complex queries.

This plugin is particularly valuable for integrating with modern API-driven services that use GraphQL, allowing you to fetch exactly the data you need without over-fetching or under-fetching. Whether you're connecting to GitHub, Shopify, or any custom GraphQL API, this plugin provides a streamlined way to incorporate that data into your orchestration workflows.

::collapse{title="Example of GraphQL integration"}
```yaml
id: graphql_with_auth
namespace: company.team
tasks:
  - id: get_data
    type: io.kestra.plugin.graphql.Request
    uri: https://example.com/graphql
    headers:
      Authorization: "Bearer {{ secret('API_TOKEN') }}"
    query: |
      query {
        viewer {
          name
          email
        }
      }
```
::


## Thanks to Our Contributors

Thank you to everyone who contributed to this release through feedback, bug reports, and pull requests. If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues). With the [DevContainer support](docs/01.getting-started/03.contributing.md), it's easier than ever to start contributing to Kestra.

## Next Steps

This post covered new features and enhancements added in Kestra 0.23.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack). 