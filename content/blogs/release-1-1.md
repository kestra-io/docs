---
title: "Kestra 1.1 — Release Title"
description: "One‑sentence summary of the 1.1 release."
date: 2025-11-04T17:00:00
category: News & Product Updates
authors:
  - name: "Author Name"
    image: author
    role: "Role"
image: /blogs/release-1-1.jpg
---


One paragraph intro to the release. Highlight top themes briefly.

The table below highlights the key features of this release.

| Feature | Description | Edition |
|---|---|---|
| Feature 1 | Short description | Edition |
| Feature 2 | Short description | Edition |
| Feature 3 | Short description | Edition |
| Feature 4 | Short description | Edition |


Check the video below for a quick overview of all enhancements.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Kestra 1.1 Overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>


## New Filters

https://github.com/kestra-io/kestra/issues/10349

## Custom App Branding

https://github.com/kestra-io/kestra-ee/issues/4983

## No Code for Dashboard

https://github.com/kestra-io/kestra-ee/issues/3752


## AI helpers for failure

Add AI helper for failed taskruns - https://github.com/kestra-io/kestra/issues/11162

<div style="position: relative; padding-bottom: calc(48.95833333333333% + 41px); height: 0; width: 100%;"><iframe src="https://demo.arcade.software/ARCADE_ID_1?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Feature Demo 1 | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;"></iframe></div>


## Human Task

https://github.com/kestra-io/kestra-ee/issues/1435

## Improved Airgap

https://github.com/kestra-io/kestra-ee/issues/3430

## Improvements

- Added flows as a data source for custom dashboards, enabling you to display and monitor flow metrics, status, and execution details directly within your [custom dashboard views](https://github.com/kestra-io/kestra-ee/issues/2609).
- Introduced "Fix with AI" feature that provides AI-powered suggestions and fixes when task runs fail, helping you quickly [diagnose and resolve workflow issues](https://github.com/kestra-io/kestra/issues/11162).
- Added a new `syncWorkingDirectory` [property for remote task runners to control whether the working directory is synchronized between remote and local environments](https://github.com/kestra-io/kestra-ee/issues/4761). This ensures consistent behavior across different runner types when working with files and directories in your tasks. Previously, working directories were only synced when output files or directories were specified.
- [Added flows as a data source for dashboards](https://github.com/kestra-io/kestra-ee/issues/3752), allowing you to display and monitor flow information in table format directly within your dashboard views.
- [AI Agent can now call remote agent via A2A framework](https://github.com/kestra-io/kestra-ee/issues/5256)
- Added the ability to [export audit logs as CSV files](https://github.com/kestra-io/kestra-ee/issues/4572), making it easier to analyze and share audit data.
- Secret Manager performance has been optimized, reducing the costs associated with fetching secrets from external secret managers. It also improves the search functionality, making it faster to locate and retrieve secrets.

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
- New LinkedIn plugin for social media automation and data extraction
- New Messenger task (plugin-notifications) to send messages via Facebook Messenger
- New LINE task (plugin-notifications) to send notifications through LINE messaging platform
- New Markdown serialization/deserialization task (plugin-serdes) to convert between Markdown and other formats
- New `FileCreatedTrigger` for Google Drive (plugin-googleworkspace) to trigger flows when new files are created in Google Drive
- AI Agent: we added support for [Oracle Cloud Infrastructure GenAI language model](https://github.com/kestra-io/plugin-ai/issues/176), [Cloudflare Workers AI model provider](https://github.com/kestra-io/plugin-ai/issues/175), [support for LocalAI language model](https://github.com/kestra-io/plugin-ai/issues/173)

New triggers:
- Allow file detection triggers to react to both new and updated files - https://github.com/kestra-io/kestra/issues/11761

::::collapse{title="Full list of improvements"}
- Detailed item A
- Detailed item B
- Detailed item C
::::


## Next Steps

This post highlighted the new features and enhancements introduced in Kestra 1.1. Which updates are most interesting to you? Are there additional capabilities you'd like to see in future releases? We welcome your feedback.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
