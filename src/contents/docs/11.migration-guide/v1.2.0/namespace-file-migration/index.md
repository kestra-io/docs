---
title: Namespace Files Metadata Migration – Kestra 1.2.0
sidebarTitle: Namespace Files Migration
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.2.0
description: Migration guide for Namespace Files metadata in Kestra 1.2.0, optimizing search and scalability.
---
The backend now indexes Namespace Files metadata to optimize search and scalability

## Overview

Version 1.2 changes how Namespace Files metadata are handled. The backend now **indexes Namespace Files metadata** to optimize search and scalability, replacing the previous approach of fetching all stored files directly from storage (which could be slow and inefficient for large datasets). Additionally, Namespace Files can now be **versioned and restored**.

If you are upgrading to 1.2.0 from an earlier version, you must run the Namespace Files metadata migration. This migration is required for **both runtime execution and UI visualization** — without it, Namespace Files may not be accessible:

- In flows/tasks that use Namespace Files (e.g., `namespaceFiles` or `read()`).
- In the Kestra UI (files missing, not browsable, or not selectable where expected).

## Required command

:::alert{type="warning"}
Before running the migration command, stop the main Kestra application to avoid inconsistent reads/writes during the metadata update.
:::

Run the following command once:

```shell
/app/kestra migrate metadata nsfiles
```

:::alert{type="info"}
Running the migration after the upgrade is safe and will restore the missing UI data immediately.
:::

After it completes, restart Kestra and verify:

- A task using `namespaceFiles` can `read()` the expected files.
- Namespace Files are visible and accessible in the UI.

## Docker Compose

For **Docker Compose** setups, run the migration command by overriding the container command:

```yaml
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command: migrate metadata nsfiles
```

After the migration completes, revert to the standard startup command to run the server, e.g., `server standalone --worker-thread=128`.

## Kubernetes

For **Kubernetes** deployments, create a one-time Pod (or Job) to run the same migration command **before restarting** your regular Kestra server Pods.
