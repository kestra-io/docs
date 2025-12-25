---
title: "Kestra 1.2 introduces Assets, Namespace Files Revision History, Concurrent Executions, Enhanced UI and Dozens of New Plugins"
description: "Kestra 1.2 delivers asset management, namespace file versioning, concurrent execution capabilities, improved UI/UX, new secret managers, and dozens of new community-driven plugins."
date: 2026-01-06T17:00:00
category: News & Product Updates
authors:
  - name: "Benoit Pimpaud"
    image: bpimpaud
image: /blogs/release-1-2.jpg
---


We're excited to announce Kestra 1.2, delivering asset management, namespace file versioning capabilities, concurrent execution support, improved user interface designs, and dozens of plugins. Following user feedback, we've introduced enterprise-grade asset management, comprehensive revision history for namespace files, and the ability to run concurrent executions from any trigger. Enterprise Edition users gain new secret managers and templated custom blueprints for streamlined workflow creation.

The table below highlights the key features of this release.

| Feature | Description | Edition |
|---|---|---|
| Assets | Maintain a stateful inventory of external resources (table, VMs, etc.) with identity, metadata, and state for unified resource management and workflow reactivity | Enterprise Edition |
| Templated Custom Blueprints | Create new flows from templates by filling in templated values, allowing business users to generate complete workflows without boilerplate | Enterprise Edition |
| Revision History for NamespaceFiles | Track and restore previous versions of namespace files with comprehensive revision history | All Editions |
| Checks Feature | Add validation checks to prevent execution creation when specified conditions aren't met | All Editions |
| Concurrent Execution for Trigger | Enable multiple concurrent executions to be triggered simultaneously from any trigger type | All Editions |
| Execution Overview Page New Design | Redesigned execution overview page with improved layout, better spacing, and organized sections | All Editions |
| Secret Managers | New secret managers including 1Password and Doppler integration | Enterprise Edition |
|  |  |  |


Check the video below for a quick overview of all enhancements.

<div class="video-container">
  <iframe src="" title="Kestra 1.2 Overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Assets

Kestra 1.2 introduces Assets, a powerful new Enterprise Edition feature that maintains a stateful inventory of external resources (tables, VMs, databases, inventory, etc.) that workflows interact with. Assets solve common infrastructure orchestration challenges by providing:

- **Unified Resource Inventory** - Track all resources across your organization with identity, metadata, and state
- **Dynamic UI Inputs** - Populate dropdowns and selections based on existing resources with filtering by ownership, environment, or state
- **Reactive Workflows** - Trigger flows automatically when resource state changes
- **Cross-Flow State Sharing** - Share resource information consistently between workflows
- **Complete Traceability** - Track which flow created, modified, or deleted each resource

Assets are implemented as a separate plugin system, keeping Kestra's unopinionated design while providing enterprise-grade resource management capabilities. This first iteration establishes the foundation for resource management, with future releases planned to enhance functionality and add more integrations.


## Templated Custom Blueprints

Enterprise Edition users can now create reusable, configurable workflows that users can instantiate without editing YAML. Instead of copying and modifying blueprints, users fill in guided inputs and Kestra generates the complete flow automatically.

**How It Works:** Templated Blueprints use [Pebble templating](https://pebbletemplates.io/), with custom delimiters to avoid conflicts with Kestra expressions.

### Define Template Arguments

Template arguments define the inputs users must provide:

```yaml
extend:
  templateArguments:
    - id: values
      displayName: An array of values
      type: MULTISELECT
      values:
        - value1
        - value2
        - value3
```

All Kestra [input types](/docs/workflow-components/inputs) are supported. These arguments automatically generate a guided UI form.

### Use Template Arguments

Use `<< >>` delimiters to inject arguments into your flow:

```yaml
message: Hello << arg.values >>
```

### Loops & Conditions

For more advanced use cases, you can add logic using Pebble control blocks with `<% %>` syntax for:
- Conditions (`if` / `else`)
- Loops (`for`)
- Advanced templating logic

For example:

```yaml
tasks:
  <% for value in arg.values %>
  - id: log_<< value >>
    type: io.kestra.plugin.core.log.Log
    message: Hello << value >>
  <% endfor %>
```

This lets you dynamically generate tasks, conditionally include steps, and build complex workflows from simple inputs.

Solutions such as templatized Terraform configurations or using the Python SDK to make DAG factories are still valid ways to address similar templating needs. Templated Custom Blueprints offer a more direct, simpler and integrated approach within the Kestra platform, streamlining the process and enhancing the user experience.


Here's an example showing a templated blueprint that generates data ingestion workflows based on user selections:

:::collapse{title="Template Definition"}

```yaml
id: data-ingest
namespace: kestra.data

extend:
  templateArguments:
    - id: domains
      displayName: Domains
      type: MULTISELECT
      values:
        - Online Shop
        - Manufacture
        - HR
        - Finance

    - id: target
      type: SELECT
      values:
        - Postgres
        - Oracle
    
    - id: env
      type: SELECT
      values:
        - dev
        - staging
        - prod

tasks:
  - id: parallel_<< arg.env >>
    type: io.kestra.plugin.core.flow.Parallel
    tasks:
<% for domain in arg.domains %>
      - id: sequential_<< domain | slugify >>
        type: io.kestra.plugin.core.flow.Sequential
        tasks:
        - id: << domain | slugify >>-download
          type: io.kestra.plugin.jdbc.postgresql.CopyOut
          sql: SELECT * FROM public.<< domain | slugify >>
        - id: << domain | slugify >>-ingest
          <% if arg.target == 'Oracle' %>
          type: io.kestra.plugin.jdbc.oracle.Batch
          from: "{{ << domain | slugify >>-download.uri }}"
          table: public.< domain | slugify >>
          <% elseif arg.target == 'Postgres' %>
          type: io.kestra.plugin.jdbc.postgresql.CopyIn
          from: "{{ outputs.<< domain | slugify >>-download.uri }}"
          url: jdbc:postgres://sample_<< arg.target | lower>>:5432/<<arg.env>>
          table: public.< domain | slugify >>
          <% endif %>
<% endfor %>

pluginDefaults:
  - type: io.kestra.plugin.jdbc.postgresql
    values:
      url: jdbc:postgresql://sample_postgres:5432/<<arg.env>>
      username: '{{ secret("POSTGRES_USERNAME") }}'
      password: '{{ secret("POSTGRES_PASSWORD") }}'
      format: CSV

  - type: io.kestra.plugin.jdbc.oracle.Batch
    values:
      url: jdbc:oracle:thin:@<< arg.env >>:49161:XE
      username: '{{ secret("ORACLE_USERNAME") }}'
      password: '{{ secret("ORACLE_USERNAME") }}'
```

:::

:::collapse{title="Generated Flow (after template rendering)"}

After selecting `env: dev`, `domains: [HR, Manufacture]`, and `target: Oracle`, the template generates this complete workflow:

```yaml
id: data-ingest
namespace: kestra.data

tasks:
  - id: parallel_dev
    type: io.kestra.plugin.core.flow.Parallel
    tasks:

      - id: sequential_hr
        type: io.kestra.plugin.core.flow.Sequential
        tasks:
        - id: hr-download
          type: io.kestra.plugin.jdbc.postgresql.CopyOut
          sql: SELECT * FROM public.hr
        - id: hr-ingest
          type: io.kestra.plugin.jdbc.oracle.Batch
          from: "{{ hr-download.uri }}"
          table: public.< domain | slugify >>

      - id: sequential_manufacture
        type: io.kestra.plugin.core.flow.Sequential
        tasks:
        - id: manufacture-download
          type: io.kestra.plugin.jdbc.postgresql.CopyOut
          sql: SELECT * FROM public.manufacture
        - id: manufacture-ingest
          type: io.kestra.plugin.jdbc.oracle.Batch
          from: "{{ manufacture-download.uri }}"
          table: public.< domain | slugify >>

pluginDefaults:
  - type: io.kestra.plugin.jdbc.postgresql
    values:
      url: jdbc:postgresql://sample_postgres:5432/dev
      username: '{{ secret("POSTGRES_USERNAME") }}'
      password: '{{ secret("POSTGRES_PASSWORD") }}'
      format: CSV

  - type: io.kestra.plugin.jdbc.oracle.Batch
    values:
      url: jdbc:oracle:thin:@dev:49161:XE
      username: '{{ secret("ORACLE_USERNAME") }}'
      password: '{{ secret("ORACLE_USERNAME") }}'
```

:::


This approach democratizes workflow creation by letting platform teams build reusable templates once while enabling business users to generate production-ready workflows through a simple form interface. The templating system supports all standard input types including text fields, dropdowns, multi-select options, and more. This eliminates the repetitive boilerplate work of creating similar workflows while maintaining consistency and best practices across your organization.



## Revision History for Namespace Files

Namespace Files in Kestra 1.2 now support comprehensive version control with revision history. You can track changes, restore previous versions, and maintain audit trails for all namespace files. The example below shows how to reference specific versions of namespace files in your workflows:

:::collapse{title="Namespace File Versioning Example"}

```yaml
id: namespace_file_versioning
namespace: company.team

tasks:
  - id: use_specific_version
    type: io.kestra.plugin.core.log.Log
    message: "{{ read('config.txt', version=3) }}"

  - id: python_with_versioned_file
    type: io.kestra.plugin.scripts.python.Script
    inputFiles:
      config.txt: nsfile:///config.txt.v2
    script: |
      with open('config.txt', 'r') as f:
        print(f.read())
```

:::

## No Code for Unit Tests

Kestra 1.2 extends the No-Code capabilities to include unit test creation. You can now build and configure unit tests for your workflows using the visual editor, making it easier to ensure workflow reliability without writing complex test code.


## Execution Overview Page New Design

The Execution Overview page has been completely redesigned with improved visual hierarchy and better information density. Key improvements include:

- **Organized Section Divisions** - Clear boxes group related functionality (State, Actions, etc.) for better navigation
- **Optimized Spacing** - Reduced spacing between keys and values for improved readability on wider screens
- **Better Visual Flow** - Information is now easier to scan and understand at a glance



## Secret Managers

Enterprise Edition users gain new secret management integrations including 1Password and Doppler. These providers join existing secret managers to offer more flexibility in how sensitive credentials and configuration are stored and accessed across your infrastructure.


## Checks Feature

Kestra 1.2 introduces flow-level checks that can block execution creation if specified conditions aren't met. This validation layer ensures workflows only run when prerequisites are satisfied, preventing invalid or inappropriate executions from starting.

## Concurrent Execution for Any Trigger

Any trigger in Kestra 1.2 can now support concurrent executions, allowing multiple instances of the same workflow to run simultaneously. This removes previous limitations where certain trigger types could only run one execution at a time, enabling more flexible and scalable workflow patterns.

## AWS Marketplace


## Additional Improvements

- https://github.com/kestra-io/kestra-ee/issues/5556#issuecomment-3520643382
- https://github.com/kestra-io/kestra-ee/issues/5721
- Add export to CSV on the Executions page - https://github.com/kestra-io/kestra-ee/issues/5307
- Configurable termination grace periods for tasks and workflows, allowing you to control how long Kestra waits before forcefully shutting down processes—ideal for letting long-running tasks finish cleanup or critical steps.
- The left menu now offers simpler navigation and better grouping of related features.
- Modern redesigned Plugin page with improved search, better filtering, categorization, and integrated documentation for easier plugin discovery.

## Plugins

- **Apache Beam Plugin** – Introduces a `RunPipeline` task supporting multiple runners (Flink, Dataflow, Spark, Direct) and both Python and Java SDKs for unified big data processing across platforms.
- **Segment CDP Plugin** – Reverse ETL tasks for syncing customer data from warehouses back to Segment, enabling activation of enriched data across marketing and analytics platforms.
- Enhanced Ansible task logging and output generation for clearer execution insights and easier troubleshooting.
- **AWS EMR Serverless** – Serverless big data processing on Amazon EMR without managing clusters. Run Spark and Hive jobs with automatic scaling and pay-per-second billing.
- **NFS** – Network File System tasks including `CheckMount`, `List`, `Copy`, `Move`, and `Delete` operations for managing files across network-attached storage.
- **Pipedrive** – CRM integration supporting deal and person management. Create or update deals, and create or retrieve person records programmatically.
- **n8n** – Workflow automation platform integration to trigger and manage n8n workflows from Kestra.
- **Dagster** – Data orchestration platform integration to trigger Dagster jobs and pipelines.
- **OneShare** – File sharing and collaboration platform integration for enterprise document management.
- **Serialization Enhancements** – New data format conversions including JSON to JSONL, JSON to Ion, Protobuf to Ion, and improved CSV to Ion handling with better error management for malformed lines.
- **TCP/UDP** – Send messages over TCP and UDP protocols with real-time trigger capabilities for network-based workflows.
- **Grafana Loki** – Log aggregation and querying integration for centralized logging and observability.
- **Google Calendar** – `EventCreatedTrigger` to automatically trigger workflows when new calendar events are created.
- **Google Sheets** – `SheetModifiedTrigger` to monitor and react to changes in Google Sheets documents.
- **Redis CLI** - 


## Migration Note for Upgrading to 1.2

Version 1.2 changes how Namespace Files metadata are handled: the backend now indexes this metadata to optimize search and scalability, replacing the previous approach of fetching all stored files directly from storage, which was inefficient for large datasets. Additionally, Namespace Files can now be versioned and restored.


```shell
/app/kestra migrate metadata nsfiles
```

For **Docker Compose** setups, replace the command by the following

```yaml
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command:  migrate metadata nsfiles
```

After the migration completes, revert to the standard startup command to run the server, e.g., `server standalone --worker-thread=128`.

For **Kubernetes** deployments, create a one-time pod to run the same migration commands before restarting your regular Kestra server pods.

:::alert{type="info"}
Running the migration after the upgrade is safe and will restore the missing UI data immediately. Check the [migration guide](https://kestra.io/docs/migration-guide) for complete upgrade instructions.
:::

## TODO

- Allow External revision for Flows Created from CI/CD
- Auto-delete expired keys from KV Store
- Allow deleting given revision/all revision
- Add AI Copilot Button to the No-Code Editor Panel

## Next Steps

This post highlighted the new features and enhancements introduced in Kestra 1.2. Which updates are most exciting to you? Are there additional capabilities you'd like to see in future releases? We welcome your feedback.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
