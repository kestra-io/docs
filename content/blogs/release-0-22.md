---
title: Kestra 0.22 introduces XXX
description: TBD
date: 2025-04-01T17:00:00
category: News & Products Updates
author:
  name: Benoit Pimpaud
  image: bpimpaud
image: /blogs/release-0-22.jpg
---

Kestra 0.22 introduces TBD and several other improvements.

The table below highlights the key features of this release.

| Feature                                   | Description                                                                | Edition |
|-------------------------------------------|----------------------------------------------------------------------------| --- |
|  Plugin Versioning       | TBD                 | Enterprise Edition |
| Read-Only External Secrets Manager         | TBD                 | Enterprise Edition |
| `afterExecution` property       | TBD                 | All Edition |
| Sharing of Namespace Files and KV Store across namespaces       | TBD                 | All Edition |

Check the video below for a quick overview of the new features.

<div class="video-container">
    <iframe src="LINK_TBD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Let's dive into these highlights and other enhancements in more detail.

## Feature Highlights

### Plugin Versioning


ADD BETA FEATURE 0.22
REMOVE BETA IN 1.0

Managing plugin versions is essential for maintaining stability while enabling innovation in your automation workflows. This release introduces Plugin Versioning capabilities, giving you unprecedented control over your plugin ecosystem.
With the new Plugin Versioning feature, you can now manage multiple versions of plugins simultaneously across your entire environment. This powerful capability allows teams to progressively adopt new features while maintaining critical production workflows.

You can access Plugin Versioning through the new dedicated page under Administration > Instance > Versioned Plugin. Here you'll find an intuitive interface that displays all available versions and prompts to upload and manage plugins.

Plugins are now stored in internal storage and automatically synchronized across all workers, ensuring consistency throughout your environment. For organizations with custom plugins, we've added support for customer-specific artifact registries, allowing you to manage proprietary automation components with the same robust tools used for standard plugins.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/h-vmMGlTGM8?si=_BoEZRxeVvxpXXnG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

![](SCREENSHOT 1)

![](SCREENSHOT 2)

> Note: The plugin versioning is a beta feature and it could change slightly in next release

### Read-Only External Secrets Manager 

Managing secrets securely across your automation environment is critical for maintaining compliance and security standards. Kestra 0.22 introduces External Secret Manager capabilities, enabling seamless integration with your established security infrastructure.

The new read-only mode for external secrets managers allows you to reference secrets that remain managed in your external system. The integration currently supports HashiCorp Vault with path prefix capabilities, enabling you to precisely control which secrets are accessible to your workflows.

TO CHECK: WHAT ABOUT GCP, AWS, Azure?

The UI clearly distinguishes externally managed secrets with a lock icon, providing visual confirmation of their read-only status. These secrets cannot be edited, created, or deleted through Kestra, ensuring your security policies remain enforced at the source.

MORE DETAILS TBD

![](SCREENSHOT 2)



### `afterExecution` property

This release introduce a new flow property: `afterExecution`. This allows to run any set of tasks **after** the execution of the flow. It differs from the `finally` property that run tasks at the end of the flow while the execution is still in `RUNNING` state.

You might use `afterExecution` to send notifications or update documentation after a flow completes, regardless of whether it succeeded or failed. Unlike `finally` which runs while the flow is still active, afterExecution ensures these tasks only begin after the entire execution finishes, providing cleaner separation between your core workflow and post-completion tasks.

::collapse{title="Example of `afterExecution` vs `finally`"}
```yaml
id: state_demo
namespace: company.team

tasks:
  - id: run
    type: io.kestra.plugin.core.log.Log
    message: Execution {{ execution.state }} # Execution RUNNING
  
  - id: fail
    type: io.kestra.plugin.core.execution.Fail

finally:
  - id: log 
    type: io.kestra.plugin.core.log.Log
    message: Execution {{ execution.state }} # Execution RUNNING

afterExecution:
  - id: log_after
    type: io.kestra.plugin.core.log.Log
    message: Execution {{ execution.state }} # Execution FAILED
```
::



### Sharing of Namespace Files and KV Store across namespaces

- https://github.com/kestra-io/kestra/issues/5467

Explain difference with inherited


NamespaceFiles

```yaml
id: hyena_375528
namespace: dev.ben

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World! 🚀

  - id: ns
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
      namespaces:
        - "company"
        - "dev.ben"
    commands:
      - python test.py
```

## User Interface & Experience Improvements

As with each release, there are more UI and UX enhancements:

- Improved Editor contrast in the light mode
- Export topology view to PNG and JPG
- Improvements to flow filters in the UI (Filter flows by text, filter by multiple labels)

## Other Features and Improvements

- New LDAP integration. It provides streamlined authentication and user management for enterprise environments. NEED DOC LINK
- New Log Shippers. Including Splunk, AWS S3, Google Cloud Storage, Azure Blob. This release also introduce AuditLogs Log Shipper allowing to export records for all activities performed in your Kestra instance by users and service accounts.
- Improvements of the queue system. Enhance performance and reliability for high-volume workflow orchestration.
- [DevContainer support](https://github.com/kestra-io/kestra/pull/7507) simplifies developer onboarding with ready-to-use development environments. NEED DOC LINK ?
- [New Python package](https://github.com/kestra-io/libs/pull/16) enables native reading of ION files for improved Python integration. NEED DOC LINK (doc already done by AJ?)
- Improvements Ansible outputs integration allows seamless connection between Ansible playbooks and Kestra workflows. NEED DOC/EXAMPLE LINK
- Website performance dramatically improved following Nuxt 2 to 3 migration, including a redesigned plugin page for better discoverability.
- Comprehensive bug fixes for dynamic properties ensure more reliable and predictable behavior across workflows.
- Expanded context variables now include [taskrun and execution states accessible via Pebble](https://github.com/kestra-io/kestra/issues/7155), enabling more powerful dynamic workflows. NEED DOC


## Plugin enhancements


### New GraalVM (beta)

- In-memory python, javacript, ruby
- Allows to parse object easily


### DuckDB & SQLlite Improvements

This release fix some issues and bring improved capabilities to persist operation coming from DuckDB and SQLlite databases.

Thanks to the new `outputDbFile` boolean property, both plugin tasks fully support persisting operation across your tasks.

::collapse{title="Example with DuckDB"}
```yaml
id: grouse_281947
namespace: company.team

tasks:
  - id: write
    type: io.kestra.plugin.core.storage.Write
    content: |
      field1,field2
      1,A
      2,A
      3,B

  - id: duckdb
    type: io.kestra.plugin.jdbc.duckdb.Query
    inputFiles:
      data.csv: "{{ outputs.write.uri }}"
    sql: CREATE TABLE my_data AS (SELECT * FROM read_csv_auto('data.csv'));
    outputDbFile: true

  - id: downstream
    type: io.kestra.plugin.jdbc.duckdb.Query
    databaseUri: "{{ outputs.duckdb.databaseUri }}"
    sql: SELECT field2, SUM(field1) FROM my_data GROUP BY field2;
    fetchType: STORE
```
::

Also it's now possible to avoir using `workingDir()` Pebble method in DuckDB to read local files.

::collapse{title="Reading file without using workingDir in DuckDB"}
```yaml
id: grouse_281947
namespace: company.team

tasks:

  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv


  - id: query
    type: io.kestra.plugin.jdbc.duckdb.Query
    fetchType: STORE
    inputFiles:
      data.csv: "{{ outputs.download.uri }}"
    sql: SELECT * FROM read_csv_auto('data.csv');
```
::


### New Snowflake CLI plugin

TBD

::collapse{title="Snowflake CLI task example"}
```yaml

```
::

### New Supabase plugin

TBD

::collapse{title="Supabase task example"}
```yaml

```
::

### New MariaDB tasks

- https://github.com/kestra-io/plugin-jdbc/commit/ab18b1bf14a656b8f469c5494b9f0d610d47c73e

### New ServiceNow tasks

TBD

::collapse{title="Supabase task example"}
```yaml

```
::

### New Hubspot tasks

TBD

::collapse{title="Supabase task example"}
```yaml

```
::

### New Pebble functions

TBD

- https://github.com/kestra-io/kestra/issues/6888

## Thanks to Our Contributors

Thank you to everyone who contributed to this release through feedback, bug reports, and pull requests. If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues).

## Next Steps

This post covered new features and enhancements added in Kestra 0.22.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
