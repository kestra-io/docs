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

Minimal datasource examples:

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

Rough connection planning:

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

The default local storage is fine for local testing but not for every production topology. The important distinction is whether every Kestra component can see the same files.

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

### Local storage deployment guidance

Local storage works well for standalone deployments with a persistent volume. In distributed deployments, it only works safely when all components share the same filesystem through a `ReadWriteMany` volume or an equivalent shared storage layer.

If that shared filesystem does not exist, move to object storage instead of trying to share host paths between services.

### Storage isolation

Like secret isolation, storage isolation lets you prevent specific services from resolving internal-storage files:

```yaml
kestra:
  storage:
    type: gcs
    isolation:
      enabled: true
      denied-services:
        - EXECUTOR
```

This is useful when you want orchestration components to reference files, but do not want every service process to fetch file contents directly.

### S3

Use S3 when Kestra runs in AWS or when another object store exposes a compatible API.

```yaml
kestra:
  storage:
    type: s3
    s3:
      endpoint: "<your-s3-endpoint>"
      access-key: "<your-aws-access-key-id>"
      secret-key: "<your-aws-secret-access-key>"
      region: "<your-aws-region>"
      bucket: "<your-s3-bucket-name>"
      force-path-style: false
```

If Kestra runs on EC2 or EKS with IAM roles, omit static credentials and keep only the region and bucket:

```yaml
kestra:
  storage:
    type: s3
    s3:
      region: "<your-aws-region>"
      bucket: "<your-s3-bucket-name>"
```

For cross-account access, use STS assume-role settings:

```yaml
kestra:
  storage:
    type: s3
    s3:
      region: "<your-aws-region>"
      bucket: "<your-s3-bucket-name>"
      sts-role-arn: "<role-arn>"
      sts-role-external-id: "<optional>"
      sts-role-session-name: "<optional>"
      sts-role-session-duration: "<optional>"
      sts-endpoint-override: "<optional>"
```

### MinIO

MinIO is a good self-hosted choice when you want object storage behavior without depending on a cloud provider:

```yaml
kestra:
  storage:
    type: minio
    minio:
      endpoint: my.domain.com
      port: 9000
      secure: false
      access-key: ${AWS_ACCESS_KEY_ID}
      secret-key: ${AWS_SECRET_ACCESS_KEY}
      region: "default"
      bucket: my-bucket
      part-size: 5MB
```

If MinIO uses `MINIO_DOMAIN`, enable `kestra.storage.minio.vhost: true` and keep `endpoint` set to the base domain rather than `bucket.domain`.

### SeaweedFS

SeaweedFS fits teams that want a lightweight distributed object storage layer in self-managed environments:

```yaml
kestra:
  storage:
    type: seaweedfs
    seaweedfs:
      filer-host: localhost
      filer-port: 18888
      prefix: ""
      replication: "000"
```

### Outscale Object Storage

Outscale uses the MinIO-compatible backend type. The main thing that changes is the endpoint and the requirement to keep TLS enabled:

```yaml
kestra:
  storage:
    type: minio
    minio:
      endpoint: https://oos.eu-west-2.outscale.com
      bucket: your-bucket-name
      accessKey: YOUR_ACCESS_KEY
      secretKey: YOUR_SECRET_KEY
      port: 443
      secure: true
```

### Azure Blob Storage

Choose one Azure authentication method and keep the others unset:

```yaml
kestra:
  storage:
    type: azure
    azure:
      endpoint: "https://unittestkt.blob.core.windows.net"
      container: storage
      connection-string: "<connection-string>"
      shared-key-account-name: "<name>"
      shared-key-account-access-key: "<access-key>"
      sas-token: "<sas-token>"
```

:::alert{type="info"}
Disable hierarchical namespace on the target container. That Azure feature is not supported by the storage backend.
:::

### Google Cloud Storage

Use GCS when the deployment already runs in GCP or when workload identity is easier to manage than static keys:

```yaml
kestra:
  storage:
    type: gcs
    gcs:
      bucket: "<bucket>"
      project-id: "<project-id>"
      service-account: "<JSON or use default credentials>"
```

If `service-account` is omitted, Kestra falls back to default GCP credentials, which is usually the right choice on GKE or GCE.

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

`env-vars-prefix` controls which environment variables become available in expressions under `envs.*`. For example, `ENV_MY_VARIABLE` becomes `{{ envs.my_variable }}`.

Use `globals` for values that need to be available in every flow, `recursive-rendering` only when you intentionally want pre-0.14 recursive behavior, and `cache-enabled` when you need to trade CPU for correctness while debugging template changes.

## Optional runtime features

These settings are not part of the core queue or repository setup, but they do matter in real deployments.

Some notifications and generated links depend on `kestra.url` being set to the public base URL without `/ui` or `/api`:

```yaml
kestra:
  url: https://www.my-host.com/kestra/
```

The web UI can also be customized at runtime:

```yaml
kestra:
  webserver:
    google-analytics: UA-12345678-1
    html-head: |
      <style type="text/css">
        .v-sidebar-menu .logo:after {
          content: "Local";
        }
      </style>
```

Use `html-head` sparingly for environment banners, extra CSS, or internal scripts that must load with the app shell.

To allow universal file access from host-mounted paths, both mount the directory and add it to the allowlist:

```yaml
kestra:
  local-files:
    allowed-paths:
      - /scripts
    enable-preview: false
```

Without the allowlist, file-access URIs pointing at local host paths will be rejected even if the path is mounted into the container.

## When to use this page

- Need logs, telemetry, metrics, endpoints, CORS, or SSL: [Observability and Networking](../03.observability-and-networking/index.md)
- Need plugin defaults, retries, task temp storage, templates, or system flows: [Plugins and Execution](../04.plugins-and-execution/index.md)
- Need secret backends or server hardening: [Security and Secrets](../05.security-and-secrets/index.md)
