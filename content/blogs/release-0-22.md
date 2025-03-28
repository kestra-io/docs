---
title: Kestra 0.22 introduces support for LDAP, Plugin Versioning, Read-Only Secrets Backends and Cross-Namespace File Sharing
description: Kestra 0.22 brings powerful new features including Plugin Versioning, External Secrets, and enhanced namespace sharing capabilities. This release focuses on enterprise-grade management features while improving developer experience with new plugins and Pebble functions.
date: 2025-04-01T17:00:00
category: News & Products Updates
author:
  name: Benoit Pimpaud
  image: bpimpaud
image: /blogs/release-0-22.jpg
---


The table below highlights the key features of this release.

| Feature                                   | Description                                                                | Edition |
|-------------------------------------------|----------------------------------------------------------------------------| --- |
|  Plugin Versioning       | Manage multiple versions of plugins simultaneously across your environment | Enterprise Edition |
| Read-Only Secrets Backends         | Read secrets from an external secret manager backend without the ability to add or modify credentials from Kestra | Enterprise Edition |
| New flow property       | Define tasks to run after the execution is finished (e.g. alerts) using the `afterExecution` property | All Edition |
| Cross-Namespace File Sharing      | Use code and KV pairs from other namespaces in your tasks thanks to improved inheritance and Namespace Files sharing | All Edition |
| LDAP Sync         | Securely fetch users and credentials from an existing LDAP directory to simplify authentication and user management in enterprise environments | Enterprise Edition |
| Log Shipper plugins    | New log exporters for Splunk, AWS S3, Google Cloud and Azure Blob Storage, and a new log shipper plugin for Audit Logs | Enterprise Edition |
| Global View for Secrets and KV Store | Unified interface for managing secrets and key-value pairs across namespaces | All Edition |

Check the video below for a quick overview of the new features.

<div class="video-container">
    <iframe src="LINK_TBD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Let's dive into these highlights and other enhancements in more detail.

## Feature Highlights

### Plugin Versioning

Managing plugin versions is essential for maintaining stability while enabling innovation in your automation workflows. This release introduces Plugin Versioning capabilities, giving you unprecedented control over your plugin ecosystem.
With the new Plugin Versioning feature, you can now manage multiple versions of plugins simultaneously across your entire environment. This powerful capability allows teams to progressively adopt new features while maintaining critical production workflows.

You can access Plugin Versioning through the new dedicated page under Administration > Instance > Versioned Plugin. Here you'll find an intuitive interface that displays all available versions and prompts to upload and manage plugins.

Plugins are now stored in internal storage and automatically synchronized across all workers, ensuring consistency throughout your environment. For organizations with custom plugins, we've added support for customer-specific artifact registries, allowing you to manage proprietary automation components with the same robust tools used for standard plugins.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/h-vmMGlTGM8?si=_BoEZRxeVvxpXXnG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>


TBD BELOW - LINK TO DOC https://github.com/kestra-io/docs/pull/2307/files#diff-3592cdca9708a236e1c992fd8495d6ad8af8204e4bafb7299a0503e37bebbe35
For detailed instructions on how to use and configure plugin versioning, check out our [comprehensive documentation on Plugin Versioning]().

> Note: Plugin versioning is currently in beta and may undergo changes in upcoming releases.

### Read-Only External Secrets Manager 

Managing secrets securely across your automation environment is critical for maintaining compliance and security standards. Kestra 0.22 introduces External Secret Manager capabilities, enabling seamless integration with your established security infrastructure.

The new read-only mode for external secrets managers allows you to reference secrets that remain managed in your external system.

The UI clearly distinguishes externally managed secrets with a lock icon, providing visual confirmation of their read-only status. These secrets cannot be edited, created, or deleted through Kestra, ensuring your security policies remain enforced at the source.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/uxFyE1nsMlU?si=X3nUxXwfAu4jCElc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

TBD BELOW - LINK TO DOC https://github.com/kestra-io/docs/pull/2307/files#diff-dcab1a99dbebda5decad563848369189d76c2f11ad4994d032472fd6091c239d
For detailed instructions on how to configure and use this feature, check out our [comprehensive documentation on External Secrets Manager]().

![read only secret manager](/blogs/release-0-22/read-only-secret-manager.png)

![read only secret manager 2](/blogs/release-0-22/read-only-secret-manager-2.png)

### `afterExecution` property

This release introduces a new flow property: `afterExecution`. This allows you to run any set of tasks **after** the execution of the flow. It differs from the `finally` property that runs tasks at the end of the flow while the execution is still in `RUNNING` state.

You might use `afterExecution` to send notifications or update documentation after a flow completes, regardless of whether it succeeded or failed. Unlike `finally` which runs while the flow is still active, `afterExecution` ensures these tasks only begin after the entire execution finishes, providing cleaner separation between your core workflow and post-completion tasks.

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


<div class="video-container">
    <iframe src="https://www.youtube.com/embed/9GoJhOPUZH8?si=oT89y6uhpDtGrcbl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

TBD BELOW - LINK TO DOC
For detailed instructions on how to configure and use this feature, check out our [comprehensive documentation on afterExecution]().


### Sharing of Namespace Files and KV Store across namespaces

Namespace files now support a smart fetch mechanism – you can pull files from multiple namespaces in a cascading order, with later namespaces seamlessly overriding files from earlier ones.


::collapse{title="Example of NamespaceFiles inheritance"}
```yaml
id: namespace_files_inheritance
namespace: company

tasks:
  - id: ns
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
      namespaces:
        - "company"
        - "dev.team"
    commands:
      - python test.py  # this file will be pulled from `dev.team` namespace
```
::

TBD BELOW - LINK TO DOC - https://github.com/kestra-io/docs/pull/2307/files#diff-5c89e82dad60b4bf3bf26adfebf8c633d9b21c895de85f541427d2166443f5ff
For detailed instructions on how to configure and use this feature, check out our [comprehensive documentation on Namespace Files](https://kestra.io/docs/concepts/namespace-files).


For key-value stores, we've introduced inheritance that matches how other Kestra configurations work. KV pairs now automatically flow from parent to child namespaces, giving you more consistency out of the box.
You can still explicitly provide a namespace value to pull the corresponding key-value pair.

In the example below, the first task will be able to retrieve the key-value pair defined upstream in the `company` namespace (but not present in `company.team` namespace). The second task is able to get the key-value pair defined from another namespace explicitly provided in the `kv()` function.

For more details on how to use and configure the KV Store, check out our [comprehensive documentation](https://kestra.io/docs/concepts/kv-store).

::collapse{title="Example of key-value inheritance"}
```yaml
id: key_value_inheritance
namespace: company.team

tasks:
  - id: get_kv_from_parent
    type: io.kestra.plugin.core.log.Log
    message: "{{ kv('root_value') }}"

  - id: get_kv_from_another_namespace
    type: io.kestra.plugin.core.log.Log
    message: "{{ kv('test_value', namespace='test') }}"
```
::

### LDAP Integration

Enterprise environments require robust authentication and user management capabilities. Kestra 0.22 introduces comprehensive LDAP integration, enabling seamless synchronization of users and groups from your existing LDAP infrastructure.

Key features include:
- Automatic user synchronization with LDAP directories
- Group-based access control mapping
- Support for multiple LDAP servers
- Configurable attribute mapping for user profiles

Once LDAP is set up, users logging into Kestra for the first time will have their credentials verified against the LDAP directory. Users belonging to groups defined in the directory will see those groups created in Kestra, or if the groups already exist, users will be automatically added to them.

TBD BELOW - LINK TO DOC https://github.com/kestra-io/docs/pull/2307/files#diff-d8bd8bcd1663d7070204865e13c05aa4a24e6eca8890e48a6c36569c387b50bc
For detailed information on setting up and configuring LDAP integration, check out our [comprehensive documentation on LDAP Authentication]().

![ldap](/blogs/release-0-22/ldap.png)

### Enhanced Log Shippers

This release significantly expands Kestra's LogShipper capabilities introduced in the previous release with new integrations and features:

- **New Log Shipper Integrations**:
  - Splunk
  - OpenSearch
  - AWS S3
  - Google Cloud Storage
  - Azure Blob Storage

For detailed information on setting up and configuring log shippers, check out our [comprehensive documentation on Log Shippers](https://kestra.io/docs/enterprise/governance/logshipper).


- **AuditLogs Log Shipper**: you can now capture and export comprehensive activity records for all user and service account actions within your Kestra instance. This enables:
  - Complete audit trail of system activities
  - Enhanced security monitoring
  - Compliance reporting capabilities

TBD BELOW - LINK TO DOC https://github.com/kestra-io/docs/pull/2307/files#diff-7abadd3de416eb87f13ffb69c817f842129a19d836a122b78904bb121afbde8b
For detailed information on setting up and configuring audit log shippers, check out our [comprehensive documentation on Audit Log Shippers]().

### Global View for Secrets and KV Store

This release introduces new global views for managing secrets and key-value pairs across your entire Kestra instance:

- **Key-Value Store Overview:** We've added a dedicated tab to the main navigation that shows all key-value pairs throughout your instance. This hub lets you track and adjust KV pairs across namespaces without switching contexts. You can check values, set expiration times, and sort your data efficiently in one location.

- **Secrets Overview:** Enterprise Edition users gain access to a new tabs on the left menu for managing secrets.


## Other Features and Improvements

- [Improvements](https://github.com/kestra-io/kestra-ee/issues/2843) of the queue system. Enhance performance and reliability for high-volume workflow orchestration.

- [DevContainer support](docs/01.getting-started/03.contributing.md) simplifies development setup for contributors with ready-to-use environments.

- [New Python package](https://github.com/kestra-io/libs/pull/16) enables native reading of ION files for improved Python integration. TBD LINK TO DOC https://github.com/kestra-io/docs/pull/2307/files#diff-a07a10ebe006ff8445184afa3467e3e0504bae68cceb4b6ec74e8e1a58838b50

- Improved Ansible integration with the ability to [capture outputs from individual steps](https://github.com/kestra-io/plugin-ansible/pull/35), enabling seamless connection between Ansible playbooks and Kestra workflows.

- Comprehensive bug fixes for dynamic properties ensure more reliable and predictable behavior across workflows.

- Website performance dramatically improved following Nuxt 2 to 3 migration, including a redesigned plugin page for better discoverability.

- Expanded context variables now include [taskrun and execution states accessible via Pebble](https://github.com/kestra-io/kestra/issues/7155), enabling more powerful dynamic workflows. The `{{ tasks.<your_task_name>.state }}` context return a task state while the `{{ execution.state }}` allows to get the flow execution state.


## User Interface & Experience Improvements

As with each release, there are more UI and UX enhancements:

- Improved Editor contrast in the light mode.
- New export functionality for topology views, allowing you to save workflow diagrams as PNG or JPG files for documentation or sharing with stakeholders.
- Added one-click copy functionality for Pebble expressions (e.g., `{{ kv('my_value') }}`) in KV Store and Secret tables, making it easier to reference these values in your workflows
- Improvements to flow filters in the UI (Filter flows by text, filter by multiple labels)
- As part of our continuous improvements to the No Code experience, we're releasing a Beta version of a multi-tab system in the editor. To enable this feature, navigate to Settings > Multi-tab Editor.


## Plugin enhancements


### New GraalVM (beta)

We're pleased to introduce GraalVM integration to Kestra. GraalVM is a high-performance runtime that supports multiple programming languages, offering significant performance advantages through its advanced just-in-time compilation technology.
This integration enables in-memory execution of Python, JavaScript, and Ruby within Kestra workflows, eliminating the requirement for separate language installations on your systems.

::collapse{title="Example parsing data with Python"}
```yaml
id: parse_json_data
namespace: company.team

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: http://xkcd.com/info.0.json

  - id: graal
    type: io.kestra.plugin.graalvm.python.Eval
    outputs:
      - data
    script: |
      data = {{ read(outputs.download.uri )}}
      data["next_month"] = int(data["month"]) + 1
```
::

### DuckDB & SQLlite Improvements

This release resolves several issues and enhances persistence capabilities for operations involving DuckDB and SQLite databases.

The new `outputDbFile` boolean property enables both plugin tasks to fully support data persistence across your workflow tasks.

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

Developers can now streamline their Snowflake workflows using the new Snowflake CLI, enabling quick creation, management, and deployment of applications across Snowpark, Streamlit, native app frameworks and all the other possibilities offered by Snowflake. All of this with the automation power of Kestra!

::collapse{title="Snowflake CLI task example"}
```yaml
id: run_snowpark_function
namespace: company.team

tasks:
  - id: snowflake_cli
    type: io.kestra.plugin.jdbc.snowflake.SnowflakeCLI
    commands:
      - snow --info
      - snow snowpark execute function "process_data()"

pluginDefaults:
  - type: io.kestra.plugin.jdbc.snowflake
    values:
      account: "{{secret('SNOWFLAKE_ACCOUNT')}}"
      username: "{{secret('SNOWFLAKE_USERNAME')}}"
      password: "{{secret('SNOWFLAKE_PASSWORD')}}"
```
::

### New MariaDB tasks

We've also introduced a new plugin for MariaDB, including Query, Queries and Trigger, similar to other JDBC plugin-based tasks. These tasks allow you to interact with MariaDB databases directly from your Kestra workflows. Check out the [MariaDB plugin documentation](https://kestra.io/plugins/plugin-jdbc-mariadb) for more details on how to use these tasks in your workflows.

### New ServiceNow tasks

We've expanded our ServiceNow integration with a new Get task. This addition allows you to retrieve data from ServiceNow instances directly within your Kestra workflows. Check out the [ServiceNow plugin documentation](https://kestra.io/plugins/plugin-servicenow) for more details on how to use these tasks in your workflows.

### New Pebble functions

Kestra 0.22.0 introduces several new Pebble functions that enhance your workflow capabilities:

- **fileSize**: `{{ fileSize(outputs.download.uri) }}` — Returns the size of the file present at the given uri location.
- **fileExists**: `{{ fileExists(outputs.download.uri) }}` — Returns true if file is present at the given uri location.
- **fileEmpty**: `{{ isFileEmpty(outputs.download.uri) }}` — Returns true if file present at the given uri location is empty.
- **Environment Name**: `{{ kestra.environment.name }}` — Returns the name given to your environment. This value should be configured in the Kestra configuration.
- **Environment URL**: `{{ kestra.url }}` — Returns the environment's configured URL. This value should be configured in the Kestra configuration.


## Thanks to Our Contributors

Thank you to everyone who contributed to this release through feedback, bug reports, and pull requests. If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues).

## Next Steps

This post covered new features and enhancements added in Kestra 0.22.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).

