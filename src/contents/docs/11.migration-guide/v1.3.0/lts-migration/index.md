---
title: LTS Migration – Kestra 1.0 to 1.3
sidebarTitle: LTS Migration (1.0 → 1.3)
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.3.0
editions: ["OSS", "EE"]
description: Consolidated migration guide for users upgrading directly from Kestra 1.0 LTS to 1.3 LTS.
---

## Overview

Kestra **1.3.0** is a Long-Term Support (LTS) release. If you are upgrading directly from the previous LTS release (**1.0**), you must run the metadata migrations that were introduced in the intermediate **1.1** and **1.2** releases.

This guide consolidates all required steps into a single walkthrough so you can upgrade in one pass.

## Required metadata migrations

Three migration commands must be run — **all three are required** for a complete upgrade from 1.0 to 1.3:

| Command | Introduced in | Scope |
|---|---|---|
| `kestra migrate metadata kv` | 1.1.0 | Key-Value Store metadata indexing |
| `kestra migrate metadata secrets` | 1.1.0 | Secrets metadata indexing (Enterprise Edition only) |
| `kestra migrate metadata nsfiles` | 1.2.0 | Namespace Files metadata indexing |

:::alert{type="info"}
The `secrets` migration applies only to **Enterprise Edition** users. Open-source users can skip it — running it on OSS will produce an exception that can be safely ignored.
:::

## Order of operations

1. **Stop Kestra** — shut down all running Kestra server components to avoid inconsistent reads/writes during migration.
2. **Run all three migration commands** (see examples below).
3. **Restart Kestra** with the standard server command.

## Docker Compose

Run each migration command by temporarily overriding the container command. Execute them one at a time — each command exits automatically when complete.

```yaml
# Step 1 – KV metadata
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command: migrate metadata kv
```

```yaml
# Step 2 – Secrets metadata (Enterprise Edition only)
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command: migrate metadata secrets
```

```yaml
# Step 3 – Namespace Files metadata
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command: migrate metadata nsfiles
```

After all three migrations complete, revert to the standard startup command:

```yaml
kestra:
  image: registry.kestra.io/docker/kestra:latest
  command: server standalone --worker-thread=128
```

## Kubernetes

For Kubernetes deployments, create a one-time **Job** (or Pod) that runs all three commands before restarting your regular Kestra server Pods:

```shell
/app/kestra migrate metadata kv \
  && /app/kestra migrate metadata secrets \
  && /app/kestra migrate metadata nsfiles
```

Once the Job completes successfully, roll out your updated Kestra server Pods as usual.

## What happens if you skip these migrations

| Skipped migration | Impact |
|---|---|
| `kv` | The **Key-Value Store** page in the UI appears empty. Flows continue to work — this is a UI-only issue. |
| `secrets` | The **Secrets** page in the UI appears empty (EE only). Flows continue to work — this is a UI-only issue. |
| `nsfiles` | **Namespace Files are inaccessible** both in flows/tasks (e.g., `namespaceFiles`, `read()`) and in the UI. |

:::alert{type="warning"}
Unlike the KV and Secrets migrations (which only affect UI display), the Namespace Files migration affects **runtime execution**. Skipping it can break flows that depend on Namespace Files.
:::

All three migrations are safe to run **retroactively** — if you have already upgraded and notice missing data, running the commands will restore it immediately.

## Further reading

- [Key-Value Store and Secrets Metadata Migration (1.1.0)](/docs/migration-guide/v1.1.0/kv-secrets-metadata-migration)
- [Namespace Files Metadata Migration (1.2.0)](/docs/migration-guide/v1.2.0/namespace-file-migration)
