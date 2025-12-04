---
title: "Kestra 1.2 introduces ..."
description: "Kestra 1.2 delivers ..."
date: 2026-01-06T17:00:00
category: News & Product Updates
authors:
  - name: "Benoit Pimpaud"
    image: bpimpaud
image: /blogs/release-1-2.jpg
---


We're excited to announce Kestra 1.2, delivering ...

The table below highlights the key features of this release.

| Feature | Description | Edition |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |


Check the video below for a quick overview of all enhancements.

<div class="video-container">
  <iframe src="" title="Kestra 1.2 Overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## New Feature 1

...




## New Feature 2

...



## New Feature 3

...


## New Feature 4

...




## New Feature 5

...


## New Feature 6

...



## New Feature 7

...




## New Feature 8

...


## New Feature 9

...

## New Feature 10

...

## Additional Improvements

- ...
- ...
- ...
- ...
- ...

## New Plugins

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

## Next Steps

This post highlighted the new features and enhancements introduced in Kestra 1.2. Which updates are most exciting to you? Are there additional capabilities you'd like to see in future releases? We welcome your feedback.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
