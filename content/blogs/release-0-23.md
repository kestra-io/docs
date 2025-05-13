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
| No Code, Multi Pane Editor       | [DESCRIPTION TBD] | All Edition |
| Unit Test Flows       | Built-in testing framework for validating workflow behavior | [TBD] |
| Improved Filtering capabilities         | [DESCRIPTION TBD] | All Edition |
| Outputs in Internal Storage      | Store and manage workflow outputs directly in Kestra's internal storage | Enterprise Edition |
| Improved dashboard management         | [DESCRIPTION TBD] | [TBD] |
| Caching dependencies    | [DESCRIPTION TBD] | All Edition |
| Manage Apps & Dashboard with Git | [DESCRIPTIONO TBD] | All Edition |

Check the video below for a quick overview of all enhancements.

<div class="video-container">
    <iframe src="[YOUTUBE_VIDEO_URL]" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Let's dive into these highlights and other enhancements in more detail.

## Feature Highlights

### No Code, Multi Pane Editor

[FEATURE 1 DESCRIPTION]


### Unit Test Flows

[FEATURE 2 DESCRIPTION]


### Outputs in Internal Storage

[FEATURE 3 DESCRIPTION]


### Improved dashboard management

[FEATURE 4 DESCRIPTION]


### Caching dependencies

[FEATURE 5 DESCRIPTION]


### Manage Apps & Dashboard with Git

Kestra 0.23.0 introduces powerful new Git integration tasks that allow you to version control your dashboards and applications, bringing the benefits of Git workflows to your Kestra assets.

With the new Git integration for dashboards and apps, you can now:

- **Version control your dashboards and apps** using `gitSyncDashboard`, `gitPushDashboard`, `gitSyncApps`, and `gitPushApps` tasks
- **Track changes** to configurations over time
- **Collaborate** with team members using familiar Git workflows
- **Roll back** to previous versions when needed

::collapse{title="Dashboard Git integration example"}

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

- [ENHANCEMENT 4]
- [ENHANCEMENT 5]

## UI Improvements

Here are UI enhancements worth noting:
- [UI IMPROVEMENT 1]
- [UI IMPROVEMENT 2]
- [UI IMPROVEMENT 3]
- [UI IMPROVEMENT 4]
- [UI IMPROVEMENT 5]

## Plugin development

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


- Databricks SQL CLI - https://docs.databricks.com/aws/en/dev-tools/databricks-sql-cli

::collapse{title="Example using Databricks CLI"}
```yaml
[EXAMPLE_YAML]
```
::

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

## Thanks to Our Contributors

Thank you to everyone who contributed to this release through feedback, bug reports, and pull requests. If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues). With the [DevContainer support](docs/01.getting-started/03.contributing.md), it's easier than ever to start contributing to Kestra.

## Next Steps

This post covered new features and enhancements added in Kestra 0.23.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack). 