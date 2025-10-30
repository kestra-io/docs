---
title: "Kestra 1.1 introduces New Filters, No-Code Dashboards, Human Tasks, AI Agent tool and Dozens of New Plugins"
description: "Kestra 1.1 delivers a polished UI with redesigned filters and no-code dashboard editor, human-in-the-loop workflows for enterprise, improved airgap support, and dozens of new community-driven plugins."
date: 2025-11-04T17:00:00
category: News & Product Updates
authors:
  - name: "Benoit Pimpaud"
    image: bpimpaud
image: /blogs/release-1-1.jpg
---


Kestra 1.1 delivers on three fronts: a polished UI, dozens of new plugins, and powerful enterprise features. We've redesigned filters based on your feedback, added a no-code dashboard editor, and improved airgap support for offline deployments. Enterprise users get custom branding and human-in-the-loop workflows with granular permissions. With massive community contributions, this release brings new integrations for everything from Liquibase and dlt to YouTube and Stripe, making it easier to connect Kestra to your entire tech stack.

The table below highlights the key features of this release.

| Feature | Description | Edition |
|---|---|---|
| New Filters | Redesigned UI filters with faster autocompletion and improved usability based on user feedback | All Editions |
| No-Code Dashboard Editor | Create and edit dashboards using a no-code, multi-panel editor without writing code | All Editions |
| Custom App Branding | Customize your Kestra instance with custom logos, colors, and app thumbnails in the Apps catalog | Enterprise Edition |
| Human Task | Enable manual approval steps in workflows with unpause tasks and granular user permission controls | Enterprise Edition |
| Improved Airgap Support | Better blueprint management and removal of UI components relying on external APIs for offline deployments | All Editions |
| Fix with AI | Get AI-powered suggestions for fixes when any of your tasks fail | All Editions |
| Mail Trigger | Trigger workflows based on incoming emails using the new `MailReceivedTrigger` | All Editions |
| Enhanced File Detection Triggers | File detection triggers now react to both new and updated files, not just new ones | All Editions |
| Dozens of New Plugins | New integrations for Liquibase, dlt, Airtable, Flink, Stripe, YouTube, Odoo, and many more | All Editions |


Check the video below for a quick overview of all enhancements.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Kestra 1.1 Overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>


## New Filters

https://github.com/kestra-io/kestra/issues/10349

## Custom App Branding

Make Kestra truly yours with custom branding for your Apps catalog. Enterprise Edition users can now upload a custom logo, set brand colors, and define a custom title to match their organization's identity. Each app can also have its own thumbnail by simply pointing to a namespace file in your app YAML—perfect for creating a visually cohesive catalog that reflects your brand. Superadmins can configure all branding settings under `Administration > Tenants > Single Tenant > App Catalog`.

https://github.com/kestra-io/kestra-ee/issues/4983

TODO: Add arcade or screnshot

## No Code for Dashboard

Building on the No-Code Multi-Panel Editor we introduced for Apps and Unit Tests in Kestra 1.0, version 1.1 extends the same powerful no-code experience to **Custom Dashboards**. This feature allows you to build and customize dashboards directly from the UI, even if you're not proficient in writing the declarative YAML that defines them.

Traditionally, Custom Dashboards in Kestra are defined as code, specifying data sources, visualizations, and chart configurations in YAML. With the new no-code editor, you can create these elements visually from form-based tabs, while still having the option to open the corresponding code panel to see the generated YAML in real time. You can switch between **Dashboard Code** and **No-Code** panels, see live dashboard preview, and reference documentation or examples without leaving the editor.

Just like with the multi-panel Flow and App Editors, you can open, reorder, and close any combination of panels (incl. No-Code, Dashboard Code, Documentation, and Preview) to build a personalized dorkspace. The No-Code form editor simplifies the creation of complex dashboard layouts, making it easier to design monitoring dashboards, business intelligence views, or executive reports without needing to start from raw YAML.

https://github.com/kestra-io/kestra-ee/issues/3752

TODO: Add arcade or screnshot


## AI helpers for failure

Add AI helper for failed taskruns - https://github.com/kestra-io/kestra/issues/11162

<div style="position: relative; padding-bottom: calc(48.95833333333333% + 41px); height: 0; width: 100%;"><iframe src="https://demo.arcade.software/ARCADE_ID_1?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Feature Demo 1 | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;"></iframe></div>


## - New `MailReceivedTrigger` and `RealTimeTrigger` (plugin-notifications) to trigger flows based on incoming emails and real-time events


```yaml
id: send_email
namespace: kestra.qa
tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger }}"

triggers:
  - id: gmail_inbox_trigger
    type: io.kestra.plugin.notifications.mail.MailReceivedTrigger
    protocol: IMAP
    host: imap.gmail.com
    port: 993
    username: "bpimpaud@kestra.io"
    password: "{{ secret('GOOGLE_APP_PASSWORD') }}"
    folder: INBOX
    interval: PT3S
    ssl: true
``` 



## Enhanced File Detection Triggers

File detection triggers in Kestra 1.1 now support reacting to both new and updated files, not just newly created ones. Previously, triggers like the GCS, S3, or SFTP file watchers could only detect new files. With the new `on` property, you can now configure triggers to respond to file updates, new files, or both.

This enhancement enables more sophisticated file monitoring scenarios, such as:
- Processing files only when they are modified or updated
- Detecting and reacting to file changes in shared directories
- Implementing file versioning workflows that track both creation and modification
- Building incremental data pipelines that respond to updates in source files

The `on` property accepts three values:
- **CREATE**: Only trigger on newly discovered files (default behavior)
- **UPDATE**: Only trigger when an already-seen file changes
- **CREATE_OR_UPDATE**: Trigger on either new files or updates to existing files

You can also control how long the trigger remembers file states using the `stateTtl` property (e.g., `PT24H` for 24 hours, `P7D` for 7 days, or `P30D` for 30 days), and customize the state storage key with `stateKey` if needed.

Here's an example using the GCS trigger that responds to file updates:

```yaml
id: qa_gcs_trigger
namespace: kestra.qa

triggers:
  - id: gcs_watch
    type: io.kestra.plugin.gcp.gcs.Trigger
    interval: "PT5S"
    on: UPDATE
    from: gs://test-gcs-trigger-kestra
    action: MOVE
    to: gs://test-gcs-trigger-kestra/archive
    projectId: kestra-sandbox
    serviceAccount: "{{ secret('GCP_CREDS') }}"

tasks:
  - id: log_message
    type: io.kestra.plugin.core.log.Log
    message: "GCS trigger executed for updated file: {{ trigger.uri }}"
```

In this example, the trigger monitors a GCS bucket every 5 seconds and only fires when existing files are updated. Once detected, the updated file is moved to an archive folder.

This enhancement is available across all file-based triggers in Kestra 1.1, including:
- **File System triggers** for local and network file systems
- **GCP GCS triggers** for Google Cloud Storage buckets
- **AWS S3 triggers** for Amazon S3 buckets
- **Azure Blob Storage and ADLS triggers** for Azure cloud storage
- **Minio triggers** for S3-compatible object storage

Whether you're working with cloud storage or local file systems, you can now build more responsive and intelligent file monitoring workflows that react to the exact file events that matter to your use case.



## Human Task

Enterprise users can now add manual approval steps to their workflows using the new [HumanTask](https://github.com/kestra-io/kestra-ee/issues/1435). This feature enables human-in-the-loop workflows where execution pauses until a designated user or group member approves or reviews intermediate results. You can assign approval responsibilities to specific users or groups, providing fine-grained control over who can unpause and continue the workflow execution.

This is particularly useful for workflows requiring human validation before proceeding with critical operations, such as:
- Data quality checks before loading to production databases
- Review of generated reports or analytics before distribution
- Approval of infrastructure changes or deployments
- Validation of AI-generated content before publishing
- Sign-off on financial transactions or sensitive data operations

The example below shows how to implement a human approval step. The workflow pauses at the `approval_request` task until a user from the specified list or group approves it, then continues with the remaining tasks.

```yaml
id: human_in_the_loop
namespace: company.team

tasks:
  - id: before_approval
    type: io.kestra.plugin.core.debug.Return
    format: Output data that needs to be validated by a human

  - id: approval_request
    type: io.kestra.plugin.ee.flow.HumanTask
    assignment:
      users:
        - user1@kestra.io
        - user2@kestra.io
      groups:
        - Admins

  - id: post_approval_log
    type: io.kestra.plugin.core.log.Log
    message: Manual approval received! Continuing the execution...
```


## Improved Airgap Support

We've [significantly improved airgap support](https://github.com/kestra-io/kestra-ee/issues/3430) for organizations running Kestra in offline or restricted network environments. The UI now fully adapts to work offline: blueprints are fetched directly from the Kestra API, YouTube embeds are hidden when no internet connection is available, and fonts fall back to locally bundled versions if external resources cannot be reached. Sidebar features that require internet connectivity are automatically hidden in airgapped setups. These changes ensure Kestra runs smoothly and reliably even in completely isolated environments.

## Improvements

- Added flows as a data source for custom dashboards, enabling you to display and monitor flow metrics, status, and execution details directly within your [custom dashboard views](https://github.com/kestra-io/kestra-ee/issues/2609).
- Introduced "Fix with AI" feature that provides AI-powered suggestions and fixes when task runs fail, helping you quickly [diagnose and resolve workflow issues](https://github.com/kestra-io/kestra/issues/11162).
- Added a new `syncWorkingDirectory` [property for remote task runners to control whether the working directory is synchronized between remote and local environments](https://github.com/kestra-io/kestra-ee/issues/4761). This ensures consistent behavior across different runner types when working with files and directories in your tasks. Previously, working directories were only synced when output files or directories were specified.
- [Added flows as a data source for dashboards](https://github.com/kestra-io/kestra-ee/issues/3752), allowing you to display and monitor flow information in table format directly within your dashboard views.
- [AI Agent can now call remote agent via A2A framework](https://github.com/kestra-io/kestra-ee/issues/5256)
- Added the ability to [export audit logs as CSV files](https://github.com/kestra-io/kestra-ee/issues/4572), making it easier to analyze and share audit data.
- Performance improvements to Secret Manager, KV, and Namespace Files now make searching and retrieving secrets, KV pairs, and Namespace Files much faster. The cost of fetching secrets from external secret managers has been reduced, and similar optimizations have been applied to accessing KV and Namespace Files in storage, resulting in a more efficient and responsive experience across all three systems.

## Plugins

This release comes with a wealth of new plugins, thanks largely to the incredible contributions from our growing community. Here's what's new:

- New [Liquibase plugin](https://github.com/kestra-io/kestra/issues/9799) with CLI tasks to compare databases and generate diffs or change logs for version control. Use tasks like `Diff` to compare two database schemas and output the differences, ideal for tracking database changes in Git.
- Dedicated [dlt plugin](https://github.com/kestra-io/kestra/issues/11114) with a `CLI` task to run dlt pipelines directly from Kestra. Configure sources, destinations, and incremental loading strategies to streamline your data ingestion workflows.
- [Airtable plugin](https://github.com/kestra-io/kestra/issues/11212) with five new tasks: `List` to retrieve records with filters and pagination, `Get` to fetch a single record by ID, `Create` to add new records, `Update` to modify existing records, and `Delete` to remove records from your Airtable bases.
- [Dataform plugin](https://github.com/kestra-io/plugin-gcp/pull/532/files) (GCP) with `InvokeWorkflow` task to trigger Dataform workflows on BigQuery.
- dbt plugin now supports the [dbt‑fusion engine](https://github.com/kestra-io/plugin-dbt/issues/205) through updated CLI tasks, allowing you to execute dbt projects using the dbt‑fusion runtime for improved performance.
- [Resend plugin](https://github.com/kestra-io/plugin-resend/pull/4/files) with a `Send` task to send transactional emails using Resend's API. Support for templates, dynamic variables, attachments, and multiple recipients makes email automation seamless.
- [Odoo plugin](https://github.com/kestra-io/kestra/issues/11300) with a `Query` task that supports all major Odoo operations including search_read, create, write, unlink, search, and search_count
- [YouTube plugin](https://github.com/kestra-io/plugin-youtube/pull/4/files) with tasks like `VideoStats` to retrieve a video stastistic, and `VideoTrigger` or `CommentTrigger` allowing to trigger a flow whenever a new video or a new comment events arrives.
- [Apify plugin](https://github.com/kestra-io/plugin-apify/pull/4) with `RunActor` to execute an Apify Actor, `GetDataset` to fetch the dataset associated with a specific Apify Actor run.
- [Algolia plugin](https://github.com/kestra-io/plugin-algolia/pull/3) with tasks to manage records, and manage indices programmatically.
- [Prometheus plugin](https://github.com/kestra-io/plugin-prometheus/pull/3) with a `Query` task to run PromQL queries and retrieve time-series metrics, a `Push` task to send custom metrics to Prometheus via the Pushgateway and a `QueryTrigger` to wait for a Prometheus PromQL query to return results.
- [Prefect Cloud plugin](https://github.com/kestra-io/plugin-prefect/pull/3) with a `CreateFlowRun` task to trigger Prefect flow runs from deployments.
- New [AWS CloudWatch plugin](https://github.com/kestra-io/kestra-ee/issues/5290) allowing to push or query metrics from AWS CloudWatch as well as trigger a new flow when CloudWatch metrics match a query condition.
- New [DocumentDB plugin](https://github.com/kestra-io/plugin-documentdb/pull/1) allowing to Create, Read, Update or Delete records from DocumentDB
- New [SNMP plugin](https://github.com/kestra-io/kestra-ee/issues/5288) TODO details
- New [Stripe plugin](https://github.com/kestra-io/kestra/issues/11301)
- New [Apache Flink plugin](https://github.com/kestra-io/kestra/issues/11298)
- New [LinkedIn plugin](https://github.com/kestra-io/kestra/issues/10287) for social media automation and data extraction
- New JMS plugin for Java Message Service integration, enabling message-based communication with enterprise systems
- New [Microsoft365 Outlook](https://github.com/kestra-io/kestra/issues/11571) plugin for email automation and calendar management
- New [Meta plugin](https://github.com/kestra-io/kestra/issues/11299) for Facebook and Instagram integration
- New [Shopify plugin](https://github.com/kestra-io/kestra/issues/11595) for e-commerce automation and store management
- New [Messenger](https://github.com/kestra-io/plugin-notifications/issues/257) task (plugin-notifications) to send messages via Facebook Messenger
- New [LINE task](https://github.com/kestra-io/plugin-notifications/issues/258) to send notifications through LINE messaging platform
- New [Markdown serialization/deserialization task](https://github.com/kestra-io/plugin-serdes/issues/187) to convert between Markdown and other formats
- New `FileCreatedTrigger` [for Google Drive](https://github.com/kestra-io/plugin-googleworkspace/issues/277) to trigger flows when new files are created in Google Drive
- New [Google Mail tasks](https://github.com/kestra-io/plugin-googleworkspace/issues/276): `Get`, `List`, `Send`, and `MailReceivedTrigger` for comprehensive email automation with Gmail
- AI Agent: we added support for [Oracle Cloud Infrastructure GenAI language model](https://github.com/kestra-io/plugin-ai/issues/176), [Cloudflare Workers AI model provider](https://github.com/kestra-io/plugin-ai/issues/175), [support for LocalAI language model](https://github.com/kestra-io/plugin-ai/issues/173)


## Next Steps

This post highlighted the new features and enhancements introduced in Kestra 1.1. Which updates are most interesting to you? Are there additional capabilities you'd like to see in future releases? We welcome your feedback.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
