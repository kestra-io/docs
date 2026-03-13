---
title: Kestra Runtime and Storage Configuration
description: Configure Kestra's repository, queue, datasource, internal storage, server runtime, JVM behavior, environment settings, and variables.
sidebarTitle: Runtime and Storage
icon: /src/contents/docs/icons/admin.svg
---

Use this page when configuring the core runtime services that make Kestra run.

## Core setup decisions

Every Kestra deployment must define:

- repository type
- queue type
- internal storage type

The common production path is PostgreSQL for queue and repository, plus an object store or durable internal storage backend.

## Database and datasources

Use `kestra.queue.type` and `kestra.repository.type` to select your backend:

```yaml
kestra:
  queue:
    type: postgres
  repository:
    type: postgres
```

Then define the datasource:

```yaml
datasources:
  postgres:
    url: jdbc:postgresql://localhost:5432/kestra
    driver-class-name: org.postgresql.Driver
    username: kestra
    password: k3str4
```

HikariCP properties such as `maximum-pool-size`, `minimum-idle`, and timeouts can also be configured under `datasources.*`.

## Internal storage

`kestra.storage.type` controls where Kestra stores internal files.

Common options include:

- `local` for local testing
- `s3`
- `gcs`
- `azure`
- `minio`
- other object-storage-compatible backends

The default local storage is fine for local testing but not for resilient production deployments.

## Server and runtime settings

Common runtime areas include:

- `kestra.server.*` for basic auth and liveness
- `kestra.url` for the instance URL
- `kestra.environment.*` for environment display metadata
- `JAVA_OPTS` for JVM tuning such as timezone and heap settings
- `kestra.variables.*` for global variables and recursive rendering behavior

## Storage and file-related runtime settings

This section also covers:

- temporary task storage under `kestra.tasks.tmp-dir`
- storing execution data in internal storage
- allowed file paths for universal file access

## When to use this page

- Need logs, telemetry, metrics, endpoints, CORS, or SSL: [Observability and Networking](../03.observability-and-networking/index.md)
- Need plugin defaults, retries, or system flows: [Plugins and Execution](../04.plugins-and-execution/index.md)
- Need all property-level details: [Full Reference](../99.full-reference/index.md#database)
