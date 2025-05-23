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
| No-Code Flow Editor | Create Kestra flows from the new form-based UI without writing code | All Edition |
| Unit Test Flows       | Built-in testing framework for validating workflow behavior | Enterprise Edition |
| New Filters         | New UI Filters with faster autocompletion and editable as plain text | All Edition |
| Outputs in Internal Storage      | Store and manage workflow outputs in isolated tenant storage for complete data separation | Enterprise Edition |
| Improved dashboard management         | Configure your own default dashboard with new customizable KPI charts and adjustable chart widths | All Edition |
| Python Dependency Caching    | Speed up your workflows with automatic caching of script dependencies across executions - just define your dependencies and Kestra handles the rest | All Edition |
| Manage Apps & Dashboard with Git | Version control your dashboards and apps with Git tasks | All Edition |

Check the video below for a quick overview of all enhancements.

<div class="video-container">
    <iframe src="[YOUTUBE_VIDEO_URL]" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Let's dive into these highlights and other enhancements in more detail.

## Feature Highlights

### Multi Panel Editor
The Multi Panel Editor transforms how you design and manage workflows by introducing a unified interface with split-screen capabilities. This powerful enhancement allows you to simultaneously view and edit your workflows in multiple formats - YAML code, form-based no-code editor, topology view, and documentation - all within a single, integrated workspace.

With this flexible interface, you can:
- Edit the flow using both Code and form-based editors simultaneously while seeing your changes reflected in real-time in the topology view
- Switch between code and form-based views based on your preference or task complexity
- Track task dependencies through the topology view while making edits
- Reference documentation or blueprints without leaving the Editor

You can customize your experience by opening only the panels you need, creating a workspace tailored to your workflow development style. This enhancement significantly improves productivity by reducing context switching and providing multiple perspectives on your workflows simultaneously.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/PLACEHOLDER" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>


### No-Code Flow Editor

The No-Code Flow Editor has received a major redesign, making it easier and more intuitive to create and manage your workflows without writing any YAML code. This new version introduces a modern, streamlined interface that improves usability and accelerates flow creation for all users.

Key improvements include:
- **New design**: A refreshed, user-friendly layout that simplifies navigation and editing, making it easier to build complex workflows visually.
- **Fixed issues around arrays and uncovered elements**: The editor now properly handles array fields and previously unsupported or hard-to-edit elements, ensuring you can configure all aspects of your flows directly from the UI.
- **Enhanced functionality and reliability**: The No-Code Editor has been comprehensively improved with robust validation, intelligent default configurations, and expanded support across all Kestra features. These enhancements deliver increased stability, improved error handling, and a more refined user experience for users at all skill levels.

TODO: screenshot


### Unit Test Flows

As workflows grow in complexity, so does the need to test them reliably. Kestra introduces native support for Unit Tests in YAML, allowing you to validate your flows and detect regressions early.
Until now, users could write unit tests in Java, but with the new YAML-based Unit Test support, you can now define expected outcomes, isolate tasks, and detect regressions early—directly inside Kestra using the same YAML format as your flows.

Key components of the Unit Testing include:

- **Test Suites**: Create test suites targeting individual flows. Each test suite consists of one or more test cases, allowing you to unit test the same tasks multiple times, e.g., using different flow inputs or different fixtures.
- **Fixtures**: Add fixtures for specific inputs or tasks by mocking specific task states, input values, and namespace files for internal storage files. This allows you to avoid running tasks that might be computationally expensive or not required to run as part of a given test case.
- **Assertions**: Each test case can contain multiple assertions that check if the given task outputs match the expected outputs. There are many assertion operations such as `equalTo`, `notEqualTo`, `greaterThan`, `startsWith`, and more. This helps ensure your flow behaves correctly under different conditions.
- **API Access**: You can call the Unit Test programmatically via Kestra API, enabling automation in CI/CD pipelines, custom tooling, or integration with development workflows.


::collapse{title="Unit Test example"}

This example demonstrates a simple ETL (Extract, Transform, Load) flow. It sends a Slack notification at the start, downloads order data, extracts and transforms product names to uppercase, and then sends the results back to Slack.

```yaml
id: etl_toBigQuery
namespace: company.team

tasks:
  - id: send_slack_message_started
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "https://hooks.slack.com/services/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"  # _int_test channel https://kestra-io.slack.com/archives/C08LHK1D5EE
    payload: |
      {
        "text": "{{ flow.namespace }}.{{ flow.id }}: Daily products flow has started"
      }

  - id: extract
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/json/orders.json

  - id: transform_to_products_name
    type: io.kestra.plugin.core.debug.Return
    format: "{{ fromJson(read(outputs.extract.uri)) | jq('.Account.Order[].Product[].\"Product Name\"') }}"

  - id: transform_to_uppercase
    type: io.kestra.plugin.core.debug.Return
    format: "{{ fromJson(outputs.transform_to_products_name.value) | upper }}"

  - id: send_slack_message_with_data
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "https://hooks.slack.com/services/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"  # _int_test channel https://kestra-io.slack.com/archives/C08LHK1D5EE
    payload: |
      {
        "text": "{{ flow.namespace }}.{{ flow.id }}: Here are all the daily products: {{ outputs.transform_to_uppercase.value }}"
      }
```

The following test suite demonstrates how we can mock Slack messages and assert the results of the transformations. This allows you to validate the flow's behavior without sending real notifications or fetching live data.

```yaml
id: etl_toBigQuery_extract_testsuite
namespace: company.team
flowId: etl_toBigQuery
testCases:
  - id: extract_should_return_data
    type: io.kestra.core.tests.flow.UnitTest
    fixtures:
      tasks:
        - id: send_slack_message_started
          description: "dont send begin slack message"
        - id: send_slack_message_with_data
          description: "dont send end output slack message"
    assertions:
      - value: "{{outputs.transform_to_uppercase.value}}"
        isNotNull: true        
  - id: extract_should_transform_productNames_to_uppercase_mocked
    type: io.kestra.core.tests.flow.UnitTest
    fixtures:
      tasks:
        - id: send_slack_message_started
          description: "dont send begin slack message"
        - id: send_slack_message_with_data
          description: "dont send end output slack message"
        - id: extract
          description: "dont fetch data from API"
        - id: transform_to_products_name
          outputs:
            value: |
              [
                "my-product-1"
              ]
    assertions:
      - value: "{{outputs.transform_to_uppercase.value}}"
        contains: "MY-PRODUCT-1"
```
::


<div class="video-container">
  <iframe src="https://www.youtube.com/embed/PLACEHOLDER" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

### Outputs in Internal Storage

By default, all inputs and outputs processed across all Kestra's workflow executions are stored in the same metadata database. However, some of our Enterprise customers require a higher degree of separation across business units (split by tenants). To address this need for separation, Kestra 0.23 introduces a powerful configuration allowing you to store all execution inputs and outputs in internal storage configured for each tenant. This way, each tenant can store that metadata in separate cloud storage buckets, enabling full data separation across tenants when needed.



#TODO: Add example of configuration

### Improved dashboard management

This new release enhances the dashboard experience with the ability to configure your own default dashboard - putting you in control of what you see when you first log in. This feature allows you to personalize your monitoring and operational view to match your specific workflow requirements.

With improved dashboard management, you can:
- Set any custom-built dashboard as your default view
- Tailor your monitoring experience to focus on the metrics that matter most to you
- Access your most important information immediately upon login
- Switch between different dashboards based on your current needs


#TODO: screenshots?

### Python dependency caching

[FEATURE 5 DESCRIPTION]


### Git Sync for Apps & Dashboards

Kestra 0.23.0 introduces a powerful Git Sync, allowing you to version control your Dashboards and Apps code and thus manage all your resources as code.

With the new Git integration for dashboards and apps, you can now:

- **Version control your dashboards and apps** using `git.SyncDashboard`, `git.PushDashboard`, `git.SyncApps`, and `git.PushApps` tasks
- **Track configuration changes** over time, managing all your resources as code.
- **Collaborate** with team members using familiar Git workflows
- **Roll back** to previous versions when needed.


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

::collapse{title="Example to import contacts from Postgres to Salesforce"}
```yaml
id: salesforce-postgres-sync
namespace: company.team
tasks:
  - id: each
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{ trigger.rows }}"
    tasks:
      - id: create_contacts_in_salesforce
        type: io.kestra.plugin.ee.salesforce.Create
        connection:
          username: "{{ secret('SALESFORCE_USERNAME') }}"
          password: "{{ secret('SALESFORCE_PASSWORD') }}"
          authEndpoint: "{{ secret('SALESFORCE_AUTH_ENDPOINT') }}"
        objectName: "Contact"
        records: 
          - FirstName: "{{ json(taskrun.value).FirstName }}"
            LastName: "{{ json(taskrun.value).LastName }}"
            Email: "{{ json(taskrun.value).Email }}"

triggers:
  - id: postgres_trigger
    type: io.kestra.plugin.jdbc.postgresql.Trigger
    sql: |
      SELECT 
        first_name as "FirstName", 
        last_name as "LastName", 
        email as "Email"
      FROM customers
      WHERE updated_at > CURRENT_DATE - INTERVAL '1 day'
      AND (processed_at IS NULL OR processed_at < updated_at)
    interval: PT5M
    fetchType: FETCH

pluginDefaults:
  - type: io.kestra.plugin.jdbc.postgresql
    values:
      url: "{{ secret('POSTGRES_URL') }}"
      username: "{{ secret('POSTGRES_USERNAME') }}"
      password: "{{ secret('POSTGRES_PASSWORD') }}"
```
::

### HubSpot

We've introduced a comprehensive HubSpot plugin with tasks for managing companies, contacts, and deals. The plugin provides a complete set of operations (Create, Get, Update, Delete, Search) for each entity type, allowing you to seamlessly integrate HubSpot CRM operations into your Kestra workflows with proper authentication and consistent property handling.

::collapse{title="Example of HubSpot integration to query companies"}
```yaml
id: hubspot-query-company
namespace: company.team
tasks:
  - id: search_companies
    type: io.kestra.plugin.hubspot.companies.Search
    apiKey: "{{ secret('HUBSPOT_API_KEY') }}"
    properties:
      - name
      - domain
      - industry
    limit: 10
    sorts:
      - propertyName: "createdate"
        direction: "DESCENDING"
```
::

### Ollama

We're excited to introduce the new Ollama plugin, which allows you to run Ollama CLI commands directly from your Kestra workflows. This integration can help you pull open-source LLMs into your local environment, interact with them via prompts in your AI pipelines, and shut them down when no longer needed.

With the Ollama CLI task, you can:
- Pull and manage models using the Ollama CLI
- Run local LLMs and capture their responses
- Chain Ollama commands with other tasks in your workflow
- Output results to files for downstream processing

::collapse{title="Example using Ollama CLI"}
```yaml
id: ollama_flow
namespace: company.team
tasks:
  - id: ollama_cli
    type: io.kestra.plugin.ollama.cli.OllamaCLI
    commands:
      - ollama pull llama2
      - ollama run llama2 "Tell me a joke about AI" > completion.txt
    outputFiles:
      - completion.txt
```
::

### OpenAI Response

We've added a new `Responses` task integrating OpenAI's latest Responses API, allowing you to use tools such as e.g. web search, function calling and structured outputs directly within your AI workflows.

The task supports all of OpenAI's built-in tools, including:

- Web search for retrieving real-time information
- File search for analyzing documents
- Persistence for stateful chat interactions

You can also format outputs as structured JSON, making it easy to parse and use the generated content in downstream tasks. This is particularly valuable for transforming unstructured requests into structured data that can be directly utilized in your data pipelines.

::collapse{title="Example of OpenAI Responses integration"}
```yaml
id: web_search
namespace: company.team

inputs:
  - id: prompt
    type: STRING
    defaults: List recent trends in workflow orchestration

tasks:
  - id: trends
    type: io.kestra.plugin.openai.Responses
    apiKey: "{{ secret('OPENAI_API_KEY') }}"
    model: gpt-4.1-mini
    input: "{{ inputs.prompt }}"
    toolChoice: REQUIRED
    tools:
      - type: web_search_preview

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.trends.outputText }}"
::

### Langchain (beta)

- Mention RAG capabilities?


### GitHub Workflow

We're introducing a new GitHub Workflow plugin that allows you to trigger GitHub Actions workflows directly from your Kestra flows.

With the GitHub Workflow plugin, you can:
- Dispatch a GitHub Actions workflow using the `io.kestra.plugin.github.workflows.Dispatch` task
- Pass custom inputs and parameters to your workflow
- Integrate GitHub automation seamlessly with other tasks in your Kestra pipelines

::collapse{title="Example using GitHub Workflow Dispatch"}
```yaml
id: github_workflow_dispatch_flow
namespace: company.team
tasks:
  - id: dispatch_workflow
    type: io.kestra.plugin.github.workflows.RunWorkflow
    oauthToken: your_github_token
    repository: your_owner/your_repository
    workflowId: your_workflow_id
    ref: your_branch_or_tag_name
    inputs:
      foo:bar
```
::

### Jenkins

We're introducing a new Jenkins plugin that enables seamless integration with Jenkins CI/CD pipelines directly from your Kestra workflows. This integration is ideal for teams looking to unify their CI/CD automation and workflow orchestration, enabling end-to-end automation from code to deployment.

With the Jenkins plugin, you can:
- Trigger a Jenkins job build using the `io.kestra.plugin.jenkins.JobBuild` task
- Retrieve detailed information about a Jenkins job with the `io.kestra.plugin.jenkins.JobInfo` task

::collapse{title="Example using Jenkins JobBuild"}
```yaml
id: jenkins_job_trigger
namespace: company.team
tasks:
  - id: build
    type: io.kestra.plugin.jenkins.JobBuild
    jobName: deploy-app
    serverUri: http://localhost:8080
    username: admin
    api_token: my_api_token
    parameters:
      branch: main
      environment:
        - staging
```
::

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


::collapse{title="Example using GraphQL to query Github API"}
```yaml
id: graphql-query-github
namespace: blueprints
tasks:
  - id: get_github_issues
    type: io.kestra.plugin.graphql.Request
    uri: https://api.github.com/graphql
    headers:
      Authorization: "Bearer {{ secret('GITHUB_TOKEN') }}"
    query: |
      query {
        repository(owner: "kestra-io", name: "kestra") {
          issues(last: 20, states: CLOSED) {
            edges {
              node {
                title
                url
                labels(first: 5) {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
```
::

### Databricks CLI

We've added a new Databricks SQL CLI task that allows you to execute SQL commands directly against Databricks SQL warehouses. This task leverages the official Databricks SQL CLI tool to provide seamless integration with your Databricks environment, enabling you to run queries, manage data, and automate SQL operations within your Kestra workflows.


### Improvements: Redis & ServiceNow

We've enhanced our Redis plugin with a new `Increment` task that allows you to atomically increment the value of a key in a Redis database and return the new value. This is particularly useful for implementing counters, rate limiters, or any scenario where you need atomic incrementation of numeric values stored in Redis.

We've expanded the ServiceNow plugin with two new tasks:

- **Update** task to update a record in a ServiceNow table.
- **Delete** task to delete a record from a ServiceNow table.

## Thanks to Our Contributors

Thank you to everyone who contributed to this release through feedback, bug reports, and pull requests. If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues). With the [DevContainer support](docs/01.getting-started/03.contributing.md), it's easier than ever to start contributing to Kestra.

## Next Steps

This post covered new features and enhancements added in Kestra 0.23.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack). 