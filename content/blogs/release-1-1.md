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


Kestra 1.1 delivers a polished UI, dozens of new plugins, and powerful enterprise features. We've redesigned filters, added a no-code dashboard editor, and improved airgap support. Enterprise users get custom branding and human-in-the-loop workflows with granular permissions. This release brings new integrations for Liquibase, dlt, YouTube, Stripe, and more—connecting Kestra to your entire tech stack.

The table below highlights the key features of this release.

| Feature | Description | Edition |
|---|---|---|
| New Filters | Redesigned UI filters with faster autocompletion and improved usability based on user feedback | All Editions |
| No-Code Dashboard Editor | Create and edit dashboards using a no-code, multi-panel editor without writing code | All Editions |
| Custom App Branding | Customize your Kestra instance with custom logos, colors, and app thumbnails in the Apps catalog | Enterprise Edition |
| Multi-Agent AI Systems | AI agents can now use other AI agents as tools, enabling sophisticated multi-agent orchestration workflows | All Editions |
| Fix with AI | Get AI-powered suggestions for fixes when any of your tasks fail | All Editions |
| Mail Trigger | Trigger workflows based on incoming emails using the new `MailReceivedTrigger` | All Editions |
| Enhanced File Detection Triggers | File detection triggers now react to both new and updated files, not just new ones | All Editions |
| Human Task | Enable manual approval steps in workflows with unpause tasks and granular user permission controls | Enterprise Edition |
| Improved Airgap Support | Better blueprint management and removal of UI components relying on external APIs for offline deployments | All Editions |
| Dozens of New Plugins | New integrations for Liquibase, dlt, Airtable, Flink, Stripe, YouTube, Odoo, and many more | All Editions |


Check the video below for a quick overview of all enhancements.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Kestra 1.1 Overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>


## New Filters

Following user feedback, we've completely redesigned the filters UI across Kestra. The previous implementation was too technical and difficult to navigate, especially when working with complex execution queries. The new filter design is cleaner, more intuitive, and significantly more powerful. You can now easily reset filters with a single click, save your frequently used filter combinations for quick access, reorder table columns to match your workflow, and choose from explicit, user-friendly filter options instead of complex text fields. The redesigned interface provides a more complete filtering experience with better visual design, making it effortless to find exactly what you're looking for - whether you're tracking specific executions, monitoring workflow states, or analyzing historical runs.

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/rOfsRLbWk4B20tF0MUtS?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Executions Filters | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>



## No Code for Dashboard

Kestra 1.1 extends the No-Code Multi-Panel Editor to **Custom Dashboards**. Build and customize dashboards directly from the UI without writing YAML.

Create data sources, visualizations, and charts visually using form-based tabs. Switch between **Dashboard Code** and **No-Code** panels to see generated YAML in real time. Open, reorder, and close panels (No-Code, Dashboard Code, Documentation, and Preview) to build your ideal workspace. Design monitoring dashboards, business intelligence views, or executive reports without touching raw YAML.

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/osPYHR3VcFqjZ1HDVF8A?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="No-Code Dashboard | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>


## Custom App Branding

Make Kestra truly yours with custom branding for your Apps catalog. Enterprise Edition users can now upload a custom logo, set brand colors, and define a custom title to match their organization's identity. Each app can also have its own thumbnail by simply pointing to a namespace file in your app YAML—perfect for creating a visually cohesive catalog that reflects your brand. Superadmins can configure all branding settings under `Administration > Tenants > Single Tenant > App Catalog`.


<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/qxWXGwyRdd3D5eqC4O8A?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Apps Catalog &amp; Thumbnail | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

## Multi-Agent AI Systems

AI agents can now use other AI agents as tools, enabling sophisticated multi-agent orchestration. Create workflows where a primary agent delegates subtasks to specialized expert agents—each fine-tuned for translation, data analysis, code generation, quality control, or content creation.

This extends existing Kestra tools. Just as the Kestra Flow and Task tools let AI agents invoke flows or tasks, the new AI Agent tool enables agents to delegate to other specialized AI agents, creating hierarchies of AI reasoning within your orchestration layer.

The example below shows a translation workflow where the main agent summarizes input and delegates translation to a specialized agent using a lighter, cost-effective model:

::collapse{title="Multi-Agent Translation Workflow"}

```yaml
id: ai-agent-with-agent-tools
namespace: company.ai

inputs:
  - id: prompt
    type: STRING
    defaults: |
      Please translate the following marketing announcement into French: "Our new product line will launch next week. Contact your sales representative for more details."

tasks:
  - id: ai-agent
    type: io.kestra.plugin.ai.agent.AIAgent
    provider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      modelName: gemini-2.5-flash
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
    systemMessage: Summarize the user message, then translate it into French using the provided tool.
    prompt: "{{ inputs.prompt }}"
    tools:
      - type: io.kestra.plugin.ai.tool.AIAgent
        description: Translation expert
        systemMessage: You are an expert in translating text between multiple languages
        provider:
          type: io.kestra.plugin.ai.provider.GoogleGemini
          modelName: gemini-2.5-flash-lite
          apiKey: "{{ secret('GEMINI_API_KEY') }}"
```

::

Here the main agent (`ai-agent`) receives a prompt, summarizes it, and then invokes a specialized translation agent defined as a tool. The translation agent uses a lighter model (`gemini-2.5-flash-lite`), demonstrating how you can optimize costs and performance by matching agent capabilities to task requirements.



## AI helpers for failure

Add AI helper for failed taskruns - https://github.com/kestra-io/kestra/issues/11162

<div style="position: relative; padding-bottom: calc(48.95833333333333% + 41px); height: 0; width: 100%;"><iframe src="https://demo.arcade.software/ARCADE_ID_1?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Feature Demo 1 | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;"></iframe></div>


## New `MailReceivedTrigger` and `RealTimeTrigger` for Email-Driven Workflows

Kestra 1.1 introduces the new `MailReceivedTrigger` and `RealTimeTrigger`, enabling you to trigger workflows based on incoming emails and real-time events. These triggers support both batch processing of multiple emails and one-time event handling, giving you full flexibility in how you respond to email-based events.

Automate email-driven workflows: AI-powered triage and classification, email summarization, customer support ticketing, document processing from attachments, and event-driven integrations. The example below configures a Gmail inbox trigger using IMAP:

::collapse{title="Email Trigger with AI Summarization"}

```yaml
id: summarize_email
namespace: kestra.qa
tasks:

  - id: ai_summary
    type: io.kestra.plugin.ai.agent.AIAgent
    systemMessage: "Summarize the content of the email. The summary should include the subject , date, and a concise summary of the body. Output should be a single, clear text."
    prompt: |
      {{ trigger.subject }}
      {{ trigger.date }}
      {{ trigger.body }} 
    provider:
        modelName: gpt-5-mini
        type: io.kestra.plugin.ai.provider.OpenAI
        apiKey: "{{ secret('OPENAI_API_KEY') }}"

triggers:
  - id: gmail_inbox_trigger
    type: io.kestra.plugin.notifications.mail.RealTimeTrigger
    protocol: IMAP
    host: imap.gmail.com
    port: 993
    username: "user@kestra.io"
    password: "{{ secret('GOOGLE_APP_PASSWORD') }}"
    folder: INBOX
    interval: PT3S
    ssl: true
```

:: 



## Enhanced File Detection Triggers

File detection triggers in Kestra 1.1 now support reacting to both new and updated files, not just newly created ones. Previously, triggers like the GCS, S3, or SFTP file watchers could only detect new files. With the new `on` property, you can now configure triggers to respond to file updates, new files, or both:

- **CREATE**: Trigger on newly discovered files (default)
- **UPDATE**: Trigger when existing files change
- **CREATE_OR_UPDATE**: Trigger on new files or updates

Control state retention with `stateTtl` (`PT24H` for 24 hours, `P7D` for 7 days, `P30D` for 30 days) and customize the state key with `stateKey`.

The example below uses a GCS trigger responding to file updates:

::collapse{title="GCS File Update Trigger"}

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

::

This trigger monitors a GCS bucket every 5 seconds, firing only when existing files are updated. Detected files are moved to an archive folder.

This enhancement works across all file-based triggers: File System, GCP GCS, AWS S3, Azure Blob Storage and ADLS, and Minio.



## Human Task

Enterprise users can now add manual approval steps to workflows using the new [HumanTask](https://github.com/kestra-io/kestra-ee/issues/1435). Execution pauses until designated users or group members approve and unpause. Perfect for data quality checks, report reviews, deployment approvals, AI content validation, and financial sign-offs.

This is particularly useful for workflows requiring human validation before proceeding with critical operations, such as:
- Data quality checks before loading to production databases
- Review of generated reports or analytics before distribution
- Approval of infrastructure changes or deployments
- Validation of AI-generated content before publishing
- Sign-off on financial transactions or sensitive data operations

The example below shows how to implement a human approval step. The workflow pauses at the `approval_request` task until a user from the specified list or group approves it, then continues with the remaining tasks.

::collapse{title="Human-in-the-Loop Approval Workflow"}

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

::


## Improved Airgap Support

[Airgap support](https://github.com/kestra-io/kestra-ee/issues/3430) is now significantly improved for offline environments. The UI adapts fully: blueprints fetch from the Kestra API, YouTube embeds hide without internet, fonts fall back to local versions, and internet-dependent sidebar features hide automatically, so Kestra runs smoothly in completely isolated environments.

## Improvements

- Added flows as a data source for custom dashboards, enabling you to display and monitor flow metrics, status, and execution details directly within your [custom dashboard views](https://github.com/kestra-io/kestra-ee/issues/2609).
- Introduced "Fix with AI" feature that provides AI-powered suggestions and fixes when task runs fail, helping you quickly [diagnose and resolve workflow issues](https://github.com/kestra-io/kestra/issues/11162).
- Added a new `syncWorkingDirectory` [property for remote task runners to control whether the working directory is synchronized between remote and local environments](https://github.com/kestra-io/kestra-ee/issues/4761). This ensures consistent behavior across different runner types when working with files and directories in your tasks. Previously, working directories were only synced when output files or directories were specified.
- [Added flows as a data source for dashboards](https://github.com/kestra-io/kestra-ee/issues/3752), allowing you to display and monitor flow information in table format directly within your dashboard views.
- [AI Agent can now call remote agent via A2A framework](https://github.com/kestra-io/kestra-ee/issues/5256)
- Added the ability to [export audit logs as CSV files](https://github.com/kestra-io/kestra-ee/issues/4572), making it easier to analyze and share audit data.
- Performance improvements to Secret Manager, KV, and Namespace Files now make searching and retrieving secrets, KV pairs, and Namespace Files much faster. The cost of fetching secrets from external secret managers has been reduced, and similar optimizations have been applied to accessing KV and Namespace Files in storage, resulting in a more efficient and responsive experience across all three systems.

## Plugins

This release brings dozens of new plugins from our growing community:

- [Liquibase plugin](https://github.com/kestra-io/kestra/issues/9799) with CLI tasks to compare databases and generate diffs or change logs. Use `Diff` to compare schemas and track database changes in Git.
- [dlt plugin](https://github.com/kestra-io/kestra/issues/11114) with `CLI` task to run dlt pipelines directly from Kestra.
- [Airtable plugin](https://github.com/kestra-io/kestra/issues/11212) with five tasks: `List`, `Get`, `Create`, `Update`, and `Delete` for managing Airtable records.
- [Dataform plugin](https://github.com/kestra-io/plugin-gcp/pull/532/files) (GCP) with `InvokeWorkflow` to trigger Dataform workflows on BigQuery.
- dbt plugin supports [dbt‑fusion engine](https://github.com/kestra-io/plugin-dbt/issues/205) through updated CLI tasks for improved performance.
- [Resend plugin](https://github.com/kestra-io/plugin-resend/pull/4/files) with `Send` task for transactional emails. Supports templates, dynamic variables, attachments, and multiple recipients.
- [Odoo plugin](https://github.com/kestra-io/kestra/issues/11300) with `Query` task supporting all major Odoo operations: search_read, create, write, unlink, search, and search_count.
- [YouTube plugin](https://github.com/kestra-io/plugin-youtube/pull/4/files) with `VideoStats`, `VideoTrigger`, and `CommentTrigger` tasks.
- [Apify plugin](https://github.com/kestra-io/plugin-apify/pull/4) with `RunActor` and `GetDataset` tasks.
- [Algolia plugin](https://github.com/kestra-io/plugin-algolia/pull/3) to manage records and indices programmatically.
- [Prometheus plugin](https://github.com/kestra-io/plugin-prometheus/pull/3) with `Query`, `Push`, and `QueryTrigger` tasks for metrics.
- [Prefect Cloud plugin](https://github.com/kestra-io/plugin-prefect/pull/3) with `CreateFlowRun` to trigger Prefect flow runs.
- [AWS CloudWatch plugin](https://github.com/kestra-io/kestra-ee/issues/5290) to push or query metrics and trigger flows when metrics match conditions.
- [DocumentDB plugin](https://github.com/kestra-io/plugin-documentdb/pull/1) to Create, Read, Update, or Delete records.
- [SNMP plugin](https://github.com/kestra-io/kestra-ee/issues/5288) for network monitoring.
- [Stripe plugin](https://github.com/kestra-io/kestra/issues/11301) for payment processing.
- [Apache Flink plugin](https://github.com/kestra-io/kestra/issues/11298) for stream processing.
- [LinkedIn plugin](https://github.com/kestra-io/kestra/issues/10287) for social media automation.
- JMS plugin for Java Message Service integration.
- [Microsoft365 Outlook plugin](https://github.com/kestra-io/kestra/issues/11571) for email and calendar automation.
- [Meta plugin](https://github.com/kestra-io/kestra/issues/11299) for Facebook and Instagram.
- [Shopify plugin](https://github.com/kestra-io/kestra/issues/11595) for e-commerce automation.
- [Messenger task](https://github.com/kestra-io/plugin-notifications/issues/257) (plugin-notifications) for Facebook Messenger.
- [LINE task](https://github.com/kestra-io/plugin-notifications/issues/258) for LINE messaging.
- [XExecution task](https://github.com/kestra-io/plugin-notifications/pull/278) to send X (formerly Twitter) posts with execution information.
- [Markdown serialization task](https://github.com/kestra-io/plugin-serdes/issues/187) to convert between Markdown and other formats.
- [`FileCreatedTrigger` for Google Drive](https://github.com/kestra-io/plugin-googleworkspace/issues/277) to trigger flows on new files.
- [Google Mail tasks](https://github.com/kestra-io/plugin-googleworkspace/issues/276): `Get`, `List`, `Send`, and `MailReceivedTrigger`.
- AI Agent: Added support for [Oracle Cloud Infrastructure GenAI](https://github.com/kestra-io/plugin-ai/issues/176), [Cloudflare Workers AI](https://github.com/kestra-io/plugin-ai/issues/175), and [LocalAI](https://github.com/kestra-io/plugin-ai/issues/173) language models.

## Migration Note for Upgrading to 1.1

Version 1.1.0 introduces **metadata indexing** for Key-Value Pairs and Secrets to improve performance and scalability. Previously, the UI fetched all stored entries, which became inefficient with large datasets.

When upgrading to **1.1.0** or later, you must run a metadata migration command to ensure existing data is correctly indexed. Simply run the following command before starting the server:

```shell
kestra migrate metadata
```

This will properly index existing Key-Value Pairs and Secrets so that the UI displays them correctly.
Check the proper [migration guide](https://kestra.io/docs/migration-guide) for more details.

::alert{type="warning"}
If you upgrade without running the migration, the **Key-Value Store** and **Secrets** pages in the UI will appear empty. This is only a UI issue - your flows and tasks will continue to run normally. To fix the display, simply run the migration command. It's safe to execute this migration retroactively after the upgrade.
::

## Next Steps

This post highlighted the new features and enhancements introduced in Kestra 1.1. Which updates are most interesting to you? Are there additional capabilities you'd like to see in future releases? We welcome your feedback.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
