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

Queues and repositories must stay compatible:

- in-memory queue with in-memory repository for local testing only
- JDBC queue with H2, MySQL, or PostgreSQL repository
- Kafka queue with Elasticsearch repository in Enterprise Edition

## Database and datasources

Start here if you are choosing the persistence layer for a new Kestra instance or moving from a local setup to a durable environment. In most teams, this is the first configuration page they revisit after initial installation.

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

The examples below are intentionally minimal. Use them to confirm the backend choice and basic connection shape first, then add pooling and operational settings afterward.

Minimal datasource examples from the full reference:

:::collapse{title="PostgreSQL"}
```yaml
kestra:
  queue:
    type: postgres
  repository:
    type: postgres

datasources:
  postgres:
    url: jdbc:postgresql://localhost:5432/kestra
    driver-class-name: org.postgresql.Driver
    username: kestra
    password: k3str4
```
:::

:::collapse{title="MySQL"}
```yaml
kestra:
  queue:
    type: mysql
  repository:
    type: mysql

datasources:
  mysql:
    url: jdbc:mysql://localhost:3306/kestra
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: kestra
    password: k3str4
    dialect: MYSQL
```
:::

:::collapse{title="H2"}
```yaml
kestra:
  queue:
    type: h2
  repository:
    type: h2

datasources:
  h2:
    url: jdbc:h2:mem:public;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
    username: sa
    password: ""
    driver-class-name: org.h2.Driver
```
:::

Use H2 for local development. For production, prefer PostgreSQL, or MySQL if PostgreSQL is not an option.

:::alert{type="info"}
For PostgreSQL performance issues, consider `random_page_cost=1.1` and `kestra.queue.postgres.disable-seq-scan=true` if queue polling is choosing poor query plans.
:::

## Connection pooling and JDBC queue tuning

Most users can keep the defaults here until they see either connection pressure or queue latency. This section matters most for larger deployments, split-component topologies, or databases that are already under load.

Kestra uses HikariCP for datasource pooling. Common options include:

| Property | Purpose | Default |
| --- | --- | --- |
| `maximum-pool-size` | Maximum number of open connections | `10` |
| `minimum-idle` | Minimum number of idle connections | `10` |
| `connection-timeout` | Max wait for a connection | `30000` ms |
| `idle-timeout` | Max idle time | `600000` ms |
| `max-lifetime` | Max connection lifetime | `1800000` ms |

Example:

```yaml
datasources:
  postgres:
    url: jdbc:postgresql://localhost:5432/kestra
    driver-class-name: org.postgresql.Driver
    username: kestra
    password: k3str4
    maximum-pool-size: 20
    minimum-idle: 10
```

Rough connection planning from the full reference:

- standalone server: about 10 connections
- split components: about 40 connections
- split components with 3 replicas: about 120 connections

JDBC queues long-poll the `queues` table. Lower intervals reduce latency but increase database load:

```yaml
kestra:
  jdbc:
    queues:
      poll-size: 100
      min-poll-interval: 25ms
      max-poll-interval: 1000ms
      poll-switch-interval: 5s
```

The JDBC cleaner removes old queue rows:

```yaml
kestra:
  jdbc:
    cleaner:
      initial-delay: 1h
      fixed-delay: 1h
      retention: 7d
```

To reject oversized JDBC messages before they create memory pressure:

```yaml
kestra:
  jdbc:
    queues:
      message-protection:
        enabled: true
        limit: 1048576
```

If you are not troubleshooting queue throughput or database pressure, you can usually leave the JDBC queue settings alone and return to them only when scaling.

## Internal storage

Choose the storage backend based on durability and how workers exchange files. Local storage is easy to start with, but object storage is the safer default once you care about resilience or multiple instances.

`kestra.storage.type` controls where Kestra stores internal files.

Common options include:

- `local` for local testing
- `s3`
- `gcs`
- `azure`
- `minio`
- other object-storage-compatible backends

The default local storage is fine for local testing but not for resilient production deployments.

Representative examples:

```yaml
kestra:
  storage:
    type: local
    local:
      base-path: /app/storage
```

```yaml
kestra:
  storage:
    type: gcs
```

The full reference also includes backend-specific sections for `s3`, `minio`, `seaweedfs`, `oos`, `azure`, and `gcs`.

## Server, environment, and JVM settings

These settings shape how the instance presents itself and how the Java process behaves at runtime. They are less about feature enablement and more about making the deployment fit its environment.

Common runtime areas include:

- `kestra.server.*` for basic auth and liveness
- `kestra.url` for the instance URL
- `kestra.environment.*` for environment display metadata
- `JAVA_OPTS` for JVM tuning such as timezone and heap settings
- `kestra.variables.*` for global variables and recursive rendering behavior

Environment metadata shown in the UI:

```yaml
kestra:
  environment:
    name: Production
    color: "#FCB37C"
```

JVM settings are usually passed through `JAVA_OPTS`:

```bash
export JAVA_OPTS="-Duser.timezone=Europe/Paris -Xmx1g"
```

Common uses include:

- setting `user.timezone` to control scheduling and log display
- setting a fixed heap with `-Xmx`
- configuring Java proxy settings for outbound access

Global variables and rendering behavior also live here:

```yaml
kestra:
  variables:
    env-vars-prefix: ENV_
    globals:
      region: eu-west-1
    recursive-rendering: true
    cache-enabled: true
```

## Storage and file-related runtime settings

This final group is where file-handling behavior becomes operationally important, especially for script-heavy flows, large artifacts, or deployments with strict filesystem boundaries.

This section also covers:

- temporary task storage under `kestra.tasks.tmp-dir`
- storing execution data in internal storage
- allowed file paths for universal file access

Example temporary workspace configuration:

```yaml
kestra:
  tasks:
    tmp-dir:
      path: /tmp/kestra-wd/tmp
```

If you want large execution payloads stored in internal storage instead of the primary repository, use the settings documented in the full reference section for store execution data.

## When to use this page

- Need logs, telemetry, metrics, endpoints, CORS, or SSL: [Observability and Networking](../03.observability-and-networking/index.md)
- Need plugin defaults, retries, or system flows: [Plugins and Execution](../04.plugins-and-execution/index.md)
- Need all property-level details: [Full Reference](../99.full-reference/index.md#database)
