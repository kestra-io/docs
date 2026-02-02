---
title: "Kestra 1.1 introduces New Filters, No-Code Dashboards, Human Tasks, AI Agent tool and Dozens of New Plugins"
description: "Kestra 1.1 delivers a polished UI with redesigned filters and no-code dashboard editor, human-in-the-loop workflows for enterprise, improved air-gapped support, and dozens of new community-driven plugins."
date: 2025-11-04T17:00:00
category: News & Product Updates
authors:
  - name: "Benoit Pimpaud"
    image: bpimpaud
image: ./main.jpg
---


We're excited to announce Kestra 1.1, delivering a polished UI experience, dozens of community-driven plugins, and powerful enterprise features. Following user feedback, we've completely redesigned filters, introduced a no-code dashboard editor, and enhanced air-gapped support for offline deployments. Enterprise Edition users gain custom branding capabilities and human-in-the-loop workflows with granular permission controls. This release also brings new integrations for Liquibase, dlt, YouTube, Stripe, and many more—connecting Kestra to your entire tech stack.

The table below highlights the key features of this release.

| Feature | Description | Edition |
|---|---|---|
| New Filters | Redesigned UI filters with improved usability based on user feedback | All Editions |
| No-Code Dashboard Editor | Create and edit dashboards using a no-code, multi-panel editor without writing code | All Editions |
| Custom App Branding | Customize your Kestra instance with custom logos, colors, and app thumbnails in the Apps catalog | Enterprise Edition |
| Multi-Agent AI Systems | AI agents can now use other AI agents as tools, enabling sophisticated multi-agent orchestration workflows | All Editions |
| Fix with AI | Get AI-powered suggestions for fixes when any of your tasks fail | All Editions |
| Mail Trigger | Trigger workflows based on incoming emails using the new `MailReceivedTrigger` | All Editions |
| Enhanced File Detection Triggers | File detection triggers now react to both new and updated files, not just new ones | All Editions |
| Human Task | Allow paused executions to be manually approved only by specific users or groups | Enterprise Edition |
| Improved Air-Gapped Support | Offline deployments no longer display UI components that rely on external API calls, and blueprints remain accessible in air-gapped environments. | All Editions |
| Dozens of New Plugins | New integrations for Liquibase, dlt, Airtable, Flink, Stripe, YouTube, Odoo, and many more | All Editions |


Check the video below for a quick overview of all enhancements.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/FywYZmo2vqo?si=mlh2CG85gX8FN4qs" title="Kestra 1.1 Overview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## New Filters

Following user feedback, we've completely redesigned the UI filters across Kestra. The previous implementation was too technical and difficult to navigate, especially when working with complex queries.

The new filter design is cleaner, more intuitive, and significantly more powerful:
- **Choose from explicit, user-friendly filter options** instead of complex text fields
- **Reset filters with a single click** to start fresh
- **Save frequently used filter combinations** for quick access
- **Hide, show or reorder table columns** to show only the information you need


The redesigned interface makes it effortless to find exactly what you're looking for—whether you're tracking specific executions, monitoring workflow states, or analyzing historical runs.

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/rOfsRLbWk4B20tF0MUtS?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Executions Filters | Kestra" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>



## No-Code Dashboard Editor

Kestra 1.1 extends the No-Code Multi-Panel Editor to **Custom Dashboards**, bringing the same powerful visual editing experience we introduced for flows to dashboard development. You can now build and customize dashboards directly from the UI without writing YAML.

Create data sources, visualizations, and charts using form-based tabs. Switch between **Dashboard Code** and **No-Code** panels to see generated YAML in real time. Just like with the multi-panel Flow Editor, you can open, reorder, and close any combination of panels (No-Code, Dashboard Code, Documentation, and Preview) to build your ideal workspace. Design monitoring dashboards, business intelligence views, or executive reports without having to start from raw YAML.

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/osPYHR3VcFqjZ1HDVF8A?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="No-Code Dashboard | Kestra" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>


## Custom App Branding

Make Kestra truly yours with custom branding for your Apps catalog. Enterprise Edition users can now customize their instance with a custom logo, brand colors, and custom title to match their organization's identity. Each app can also have its own thumbnail by simply pointing to a namespace file in your app YAML—perfect for creating a visually cohesive catalog that reflects your brand.

Superadmins can configure all branding settings under `Administration > Tenants > Single Tenant > App Catalog`.


<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/qxWXGwyRdd3D5eqC4O8A?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Apps Catalog &amp; Thumbnail | Kestra" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

## Multi-Agent AI Systems

AI agents in Kestra can now use other AI agents as tools, enabling sophisticated multi-agent orchestration workflows. You can create workflows where a primary agent delegates subtasks to specialized expert agents—each fine-tuned for specific capabilities like translation, data analysis, code generation, quality control, or content creation.

This feature extends Kestra's existing AI tooling. Just as the Kestra Flow and Task tools let AI agents invoke flows or tasks, the new AI Agent tool enables agents to delegate work to other specialized AI agents, creating hierarchies of AI reasoning within your orchestration layer.

The following example shows a multi-agent workflow where a main agent handles a user query and delegates web search and expert ranking to a specialized agent—demonstrating how Kestra enables hierarchical AI agent collaboration:

:::collapse{title="Multi-Agent Translation Workflow"}

```yaml
id: ai-agent-with-agent-tools
namespace: company.ai

inputs:
  - id: prompt
    type: STRING
    defaults: |
      Hello sir, I have issue installing Spotify on my Samsung s6 device, can you help me?

tasks:
  - id: ai-agent
    type: io.kestra.plugin.ai.agent.AIAgent
    provider:
      type: io.kestra.plugin.ai.provider.OpenAI
    systemMessage: You are a customer success agent, your goal is to provide a clear, non-technical answer to the customer
    prompt: "{{ inputs.prompt }}"
    tools:
      - type: io.kestra.plugin.ai.tool.AIAgent
        description: Web Search and ranking
        systemMessage: You are a Spotify expert, know everything about the support https://support.spotify.com/us/
        provider:
          type: io.kestra.plugin.ai.provider.OpenAI
        contentRetrievers:
          - type: io.kestra.plugin.ai.retriever.TavilyWebSearch
            apiKey: "{{ secret('TAVILY_API_KEY') }}"
pluginDefaults:
  - type: io.kestra.plugin.ai.provider.OpenAI
    values:
      modelName: gpt-5-mini
      apiKey: "{{ secret('OPENAI_API_KEY') }}"
```

:::



## Fix with AI

When task runs fail, Kestra 1.1 can now provide AI-powered suggestions to help you quickly diagnose and resolve issues. The new "Fix with AI" feature analyzes failed task runs and offers intelligent recommendations for fixing the problem, helping you troubleshoot workflow issues faster and get your executions back on track.

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/FK3jLC4EmG70aJdVMgOU?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Fix with AI | Kestra" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>


## New `MailReceivedTrigger` and `RealTimeTrigger` for Email-Driven Workflows

Kestra 1.1 introduces the new `MailReceivedTrigger` and `RealTimeTrigger`, allowing you to trigger workflows based on incoming emails and real-time events. These triggers support both batch processing of multiple emails and one-time event handling, giving you full flexibility in how you respond to email-based events.

You can use these triggers to automate email-driven workflows such as:
- AI-powered email triage and classification
- Email summarization and analysis
- Customer support ticket creation
- Document processing from attachments
- Event-driven integrations triggered by specific email patterns

The example below demonstrates how to configure a Gmail inbox trigger using IMAP with AI-powered email summarization:

:::collapse{title="Email Trigger with AI Summarization"}

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
    type: io.kestra.plugin.email.RealTimeTrigger
    protocol: IMAP
    host: imap.gmail.com
    port: 993
    username: "user@kestra.io"
    password: "{{ secret('GOOGLE_APP_PASSWORD') }}"
    folder: INBOX
    interval: PT3S
    ssl: true

```

:::



## Enhanced File Detection Triggers

File detection triggers in Kestra 1.1 now support reacting to both new and updated files, not just newly created ones. Previously, triggers like GCS, S3, or SFTP file watchers could only detect new files. With the new `on` property, you can configure triggers to respond to file updates, new files, or both:

- **CREATE**: Trigger on newly discovered files (default behavior)
- **UPDATE**: Trigger when existing files are modified
- **CREATE_OR_UPDATE**: Trigger on both new files and updates

You can also control state retention with `stateTtl` (e.g., `PT24H` for 24 hours, `P7D` for 7 days, `P30D` for 30 days) and customize the state key with `stateKey`.

The example below demonstrates a GCS trigger that responds to file updates:

:::collapse{title="GCS File Update Trigger"}

```yaml
id: qa_gcs_trigger
namespace: kestra.qa

triggers:
  - id: gcs_watch
    type: io.kestra.plugin.gcp.gcs.Trigger
    interval: "PT5S"
    on: UPDATE
    from: "gs://test-gcs-trigger-kestra"
    action: MOVE
    moveDirectory: "gs://test-gcs-trigger-kestra/archive"
    projectId: kestra-sandbox
    serviceAccount: "{{ secret('GCP_CREDS') }}"

tasks:
  - id: log_message
    type: io.kestra.plugin.core.log.Log
    message: "GCS trigger executed for updated file: {{ trigger.uri }}"
```

:::

In this example, the trigger monitors a GCS bucket every 5 seconds and fires only when existing files are updated. Detected files are automatically moved to an archive folder.

This enhancement is available across all file-based triggers, including File System, GCP GCS, AWS S3, Azure Blob Storage, ADLS, and MinIO.



## Human-in-the-Loop Workflows

Enterprise Edition users can now add manual approval steps to workflows using the new `HumanTask`. When an execution reaches a human task, it pauses until designated users or group members approve and resume it. This is perfect for workflows requiring human validation before proceeding with critical operations.

Use cases include:
- Data quality checks before loading to production databases
- Review of generated reports or analytics before distribution
- Approval of infrastructure changes or deployments
- Validation of AI-generated content before publishing
- Sign-off on financial transactions or sensitive data operations

The example below demonstrates how to implement a human approval step. The workflow pauses at the `approval_request` task until a user from the specified list or group approves it, then continues with the remaining tasks.

:::collapse{title="Human-in-the-Loop Approval Workflow"}

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

:::


## Improved Air-Gapped Support

Kestra 1.1 brings significantly improved support for offline and air-gapped environments. The UI now adapts fully to run without internet connectivity: blueprints fetch from the Kestra API instead of external sources, YouTube embeds hide automatically when offline, fonts fall back to local versions, and internet-dependent sidebar features are hidden automatically. These improvements ensure Kestra runs smoothly in completely isolated environments without any degraded functionality.

## Additional Improvements

- **Flows as Dashboard Data Source** – You can now use flows as a data source for custom dashboards, allowing you to display and monitor flow metrics, status, and execution details directly within your dashboard views.
- **Sync Working Directory Control** – Added a new `syncWorkingDirectory` property for remote task runners, giving you control over whether the working directory is synchronized between remote and local environments. This ensures consistent behavior across different runner types when working with files and directories. Previously, working directories were only synced when output files or directories were explicitly specified.
- **Agent-to-Agent Communication** – AI Agents can now call remote agents via the A2A (Agent-to-Agent) framework, enabling more complex distributed agent architectures.
- **Audit Log CSV Export** – Enterprise Edition users can now export audit logs as CSV files, making it easier to analyze and share audit data with compliance teams or external auditors.
- **Performance Optimizations** – Significant performance improvements to Secret Manager, KV Store, and Namespace Files make searching and retrieving data much faster. The cost of fetching secrets from external secret managers has been reduced, and similar optimizations have been applied to accessing KV pairs and Namespace Files in storage, resulting in a more efficient and responsive experience.
- **File Input Validation** – Restrict uploaded file types by setting `allowedFileExtensions` on `FILE` inputs.

## New Plugins

Kestra 1.1 includes dozens of new plugins contributed by our growing community, expanding integration capabilities across databases, APIs, messaging platforms, and AI providers.

### Data & Database Plugins
- **Liquibase** – CLI tasks to compare databases and generate diffs or change logs. Use the `Diff` task to compare schemas and track database changes in Git.
- **dlt** – New `CLI` task to run dlt (data load tool) pipelines directly from Kestra.
- **DocumentDB** – Tasks to Create, Read, Update, or Delete records in AWS DocumentDB.
- **dbt-fusion** – Enhanced dbt plugin now supports the dbt-fusion engine through updated CLI tasks for improved performance.

### SaaS & API Integrations
- **Airtable** – Full CRUD operations with `List`, `Get`, `Create`, `Update`, and `Delete` tasks for managing Airtable records.
- **Stripe** – Plugin for payment processing and Stripe API integration.
- **Shopify** – E-commerce automation for Shopify stores.
- **Odoo** – `Query` task supporting all major Odoo operations: search_read, create, write, unlink, search, and search_count.
- **Notion** – Manage Notion pages and databases programmatically.

### Cloud & Infrastructure
- **Dataform (GCP)** – `InvokeWorkflow` task to trigger Dataform workflows on BigQuery.
- **AWS CloudWatch** – Push or query metrics and trigger flows when metrics match specific conditions.
- **Apache Flink** – Stream processing integration for real-time data pipelines.

### Observability & Monitoring
- **Prometheus** – `Query`, `Push`, and `QueryTrigger` tasks for metrics collection and monitoring.
- **SNMP** – Network monitoring and device management capabilities.

### Communication & Notifications
- **Resend** – Send transactional emails with support for templates, dynamic variables, attachments, and multiple recipients.
- **Microsoft365 Outlook** – Email and calendar automation for Outlook.
- **Messenger** – Facebook Messenger notifications (plugin-meta).
- **LINE** – LINE messaging platform integration.
- **X** – Send X (formerly Twitter) posts with execution information.
- **JMS** – Java Message Service integration for enterprise messaging systems.

### Content & Media
- **YouTube** – `VideoStats`, `VideoTrigger`, and `CommentTrigger` tasks for YouTube automation.
- **LinkedIn** – Social media automation for LinkedIn.
- **Meta** – Integration for Facebook and Instagram platforms.

### Developer Tools
- **Prefect** – `CreateFlowRun` task to trigger Prefect flow runs from Kestra.
- **Algolia** – Manage search indices and records programmatically.
- **Apify** – `RunActor` and `GetDataset` tasks for web scraping automation.

### File & Data Processing
- **Markdown Serialization** – Convert between Markdown and other formats (plugin-serdes).
- **Google Drive** – `FileCreatedTrigger` to trigger flows when new files are created.
- **Gmail** – `Get`, `List`, `Send` tasks and `MailReceivedTrigger` for Gmail integration.
- **Microsoft Outlook** - `Get`, `List`, `Send` tasks and `MailReceivedTrigger` for Outlook integration.
- **Microsoft SharePoint** – `Create`, `Delete`, `Download`, `Export`, `List` tasks for SharePoint files.

### AI Model Providers
- **Oracle Cloud Infrastructure GenAI** – Added OCI GenAI support to the AI plugin.
- **Cloudflare Workers AI** – Integration with Cloudflare's AI platform.
- **LocalAI** – Support for locally-hosted AI models.
- **DashScope (Qwen)** – Integration with Alibaba Cloud DashScope, including Qwen models.
- **ZhipuAI (GLM)** – Integration with Zhipu AI provider and GLM models.
- **SqlDatabaseRetriever** – Retrieve context from SQL databases to ground agent responses.
- **PostgreSQL Chat Memory** – Persist agent conversation memory in PostgreSQL for long-running chats.

## Migration Note for Upgrading to 1.1

Version 1.1 changes how Key-Value and Secrets metadata are handled: the backend now indexes this metadata to optimize search and scalability, replacing the previous approach of fetching all stored pairs directly from storage, which was inefficient for large datasets. If you do not run the migration after upgrading to 1.1.0, the **Key-Value Store** and **Secrets** pages in the UI will appear empty (flows and tasks will continue to work as usual; migration is required only for the UI). To restore the missing data in the UI, run the following commands once after upgrading to version 1.1.0 (or later):


```shell
/app/kestra migrate metadata kv
/app/kestra migrate metadata secrets
```

For **Docker Compose** setups, replace the command by the following

```yaml
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command:  migrate metadata kv
```

and then do the same with

```yaml
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command:  migrate metadata secret
```

After the migration completes, revert to the standard startup command to run the server, e.g., `server standalone --worker-thread=128`.

For **Kubernetes** deployments, create a one-time pod to run the same migration commands before restarting your regular Kestra server pods.

:::alert{type="info"}
Running the migration after the upgrade is safe and will restore the missing UI data immediately. Check the [migration guide](../../docs/11.migration-guide/v1.1.0/index.mdx) for complete upgrade instructions.
:::

## Next Steps

This post highlighted the new features and enhancements introduced in Kestra 1.1. Which updates are most exciting to you? Are there additional capabilities you'd like to see in future releases? We welcome your feedback.

If you have any questions, reach out via [Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](/slack).
