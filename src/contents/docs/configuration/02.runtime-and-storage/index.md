---
title: Runtime & Storage Configuration in Kestra
h1: Configure Repository, Queue, Datasource & Internal Storage
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

## Allocated CPU cores

Kestra sizes several internal thread pools based on the number of CPU cores available to the process. By default, it uses the number of CPU cores reported by the runtime environment.

If you want Kestra to size those pools using a different value, set `kestra.allocated-cpu-cores`:

```yaml
kestra:
  allocated-cpu-cores: 2
```

This is useful when you want to limit how aggressively Kestra allocates worker, scheduler, and queue-related threads without changing container limits or host-level CPU settings.

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
| `connection-timeout` | Max wait for a connection (ms) | `30000` |
| `idle-timeout` | Max idle time (ms) | `600000` |
| `max-lifetime` | Max connection lifetime (ms) | `1800000` |

:::collapse{title="Full HikariCP property reference"}
| Property | Type | Description | Default |
| --- | --- | --- | --- |
| `url` | String | JDBC connection string | — |
| `username` | String | Database username | — |
| `password` | String | Database password | — |
| `catalog` | String | Default catalog | driver default |
| `schema` | String | Default schema | driver default |
| `transaction-isolation` | String | Default transaction isolation level | driver default |
| `pool-name` | String | Pool name | `HikariPool-<generated>` |
| `maximum-pool-size` | Int | Maximum number of open connections | `10` |
| `minimum-idle` | Long | Minimum number of idle connections | `10` |
| `connection-timeout` | Long | Max time to wait for a connection (ms) | `30000` |
| `idle-timeout` | Long | Max time a connection can be idle (ms) | `600000` |
| `max-lifetime` | Long | Max connection lifetime (ms) | `1800000` |
| `validation-timeout` | Long | Max time to validate a connection (ms) | `5000` |
| `initialization-fail-timeout` | Long | Timeout for pool initialization failure (ms) | `1` |
| `leak-detection-threshold` | Long | Threshold before a connection leak is reported (ms) | `0` |
| `connection-init-sql` | String | SQL executed on each new connection | `null` |
| `connection-test-query` | String | Query used to validate connections | `null` |
:::

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

`kestra.storage.type` controls where Kestra stores internal files such as task outputs, namespace files, and execution artifacts. Choose the backend based on durability and whether all Kestra components can reach the same storage.

Common options include:

- `local` for local testing
- `s3`
- `s3files`
- `gcs`
- `azure`
- `minio`
- other object-storage-compatible backends

The default local storage is fine for local testing but not for every production topology. The important distinction is whether every Kestra component can see the same files.

### Local storage deployment guidance

Local storage works well for standalone deployments with a persistent volume. In distributed deployments, it only works safely when all components share the same filesystem through a `ReadWriteMany` volume or an equivalent shared storage layer.

If that shared filesystem does not exist, move to object storage instead of trying to share host paths between services.

### Storage isolation

Storage isolation restricts which Kestra services are permitted to access internal storage files directly:

```yaml
kestra:
  storage:
    type: gcs
    isolation:
      enabled: true
      denied-services:
        - EXECUTOR
```

| Property | Description |
|---|---|
| `isolation.enabled` | Enable service isolation (default `false`). |
| `isolation.denied-services` | List of Kestra service names that must not access storage (e.g. `EXECUTOR`, `INDEXER`, `SCHEDULER`). |

---

### Local

```yaml
kestra:
  storage:
    type: local
    local:
      base-path: /app/storage
```

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `base-path` | string | **Yes** | — | Filesystem path where Kestra stores internal files. |

Local storage works for standalone deployments with a persistent volume. In distributed deployments, it only works safely when all components share the same filesystem through a `ReadWriteMany` volume or equivalent shared storage. If that is not the case, use object storage instead.

---

### AWS S3

#### Minimum configuration

```yaml
kestra:
  storage:
    type: s3
    s3:
      bucket: my-kestra-bucket
      region: us-east-1
```

With explicit credentials:

```yaml
kestra:
  storage:
    type: s3
    s3:
      bucket: my-kestra-bucket
      region: us-east-1
      access-key: YOUR_ACCESS_KEY
      secret-key: YOUR_SECRET_KEY
```

#### Configuration reference

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `bucket` | string | **Yes** | — | S3 bucket for internal storage. |
| `access-key` | string | No | — | AWS access key ID. Falls back to `DefaultCredentialsProvider` if not set. |
| `secret-key` | string | No | — | AWS secret access key. |
| `region` | string | No | — | AWS region (e.g. `us-east-1`). |
| `endpoint` | string | No | — | Custom endpoint URL for S3-compatible services or VPC PrivateLink. |
| `force-path-style` | boolean | No | `false` | Force path-style addressing instead of virtual-hosted style. |
| `path` | string | No | — | Object key prefix within the bucket (e.g. `kestra/`). |
| `sts-role-arn` | string | No | — | IAM role ARN to assume via STS before accessing the bucket. |
| `sts-role-external-id` | string | No | — | External ID for STS AssumeRole. |
| `sts-role-session-name` | string | No | — | Session name for the assumed role. |
| `sts-role-session-duration` | duration | No | `PT15M` | Duration of the assumed-role session. |
| `sts-endpoint-override` | string | No | — | Override the STS endpoint URL. |
| `s3-files-compatible` | boolean | No | `false` | Enable S3 bucket versioning when the bucket is first initialized. Set to `true` when the same bucket is shared with the `S3FilesStorage` backend (`type: s3-files`), which mounts S3 Files as a local NFS filesystem and requires versioning to be enabled. |

#### Credential resolution order

1. `access-key` / `secret-key` in config.
2. `sts-role-arn` — role assumption chained on top of any resolved identity.
3. `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` environment variables.
4. AWS CLI profile (`~/.aws/credentials`).
5. EKS Pod Identity or IRSA (IAM Roles for Service Accounts).
6. EC2/ECS instance metadata profile.

:::alert{type="warning"}
If you inject S3 credentials through Helm `extraEnvVars`, use double underscores on multi-word property names. `KESTRA_STORAGE_S3_ACCESS_KEY` is parsed as `kestra.storage.s3.access.key` (nested) and rejected at startup. Use `KESTRA_STORAGE_S3_ACCESS__KEY` instead. See [Environment variable conversion](../01.configuration-basics/index.md#environment-variable-conversion).
:::

#### Permissions

Grant the IAM identity Kestra uses (user, role, or instance profile) the following permissions on the bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET/*"
    }
  ]
}
```

If `s3-files-compatible: true` is set, also include `s3:PutBucketVersioning` in the bucket-level statement. If `sts-role-arn` is set, the calling identity additionally needs `sts:AssumeRole` on that role ARN.

---

### Google Cloud Storage

#### Minimum configuration

```yaml
kestra:
  storage:
    type: gcs
    gcs:
      bucket: my-kestra-bucket
      project-id: my-gcp-project
```

With an explicit service account key:

```yaml
kestra:
  storage:
    type: gcs
    gcs:
      bucket: my-kestra-bucket
      project-id: my-gcp-project
      service-account: |
        { "type": "service_account", ... }
```

#### Configuration reference

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `bucket` | string | **Yes** | — | GCS bucket for internal storage. |
| `project-id` | string | No | — | GCP project ID. |
| `service-account` | string | No | — | Service account JSON key. Falls back to `GOOGLE_APPLICATION_CREDENTIALS` or ambient credentials (GKE Workload Identity, GCE metadata) if omitted. |
| `path` | string | No | — | Object prefix within the bucket (e.g. `kestra/`). |

#### Credential resolution order

1. `service-account` JSON key in config.
2. `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to a key file.
3. Google default application credentials (Workload Identity on GKE, GCE metadata server, gcloud CLI).

:::alert{type="warning"}
`KESTRA_STORAGE_GCS_PROJECT_ID` is parsed as `kestra.storage.gcs.project.id` (nested) and rejected at startup. Use `KESTRA_STORAGE_GCS_PROJECT__ID` with double underscores, or keep the value in YAML. See [Environment variable conversion](../01.configuration-basics/index.md#environment-variable-conversion).
:::

#### Permissions

Assign the `roles/storage.objectAdmin` predefined role on the bucket (not the project) to the service account or workload identity principal. Fine-grained equivalent:

| Permission | Purpose |
|---|---|
| `storage.objects.create` | Upload files to internal storage |
| `storage.objects.delete` | Remove files from internal storage |
| `storage.objects.get` | Download files from internal storage |
| `storage.objects.list` | List objects in the bucket |
| `storage.buckets.get` | Read bucket metadata |

---

### S3 Files

Use `s3files` when Kestra runs on a host where an [S3 Files](https://aws.amazon.com/blogs/aws/launching-s3-files-making-s3-buckets-accessible-as-file-systems/) NFS filesystem is already mounted locally. This backend reads and writes directly through the local filesystem — no S3 SDK or AWS credentials are required.

Mount the NFS filesystem on every host that runs a Kestra component before configuring this backend. All components must share the same mount path.

```yaml
kestra:
  storage:
    type: s3files
    s3files:
      mount-path: "/mnt/s3files"
```

`mount-path` must point to a directory that exists and is readable and writable by the Kestra process. Kestra will not create the directory on startup.

Object metadata is stored in `.meta` sidecar files alongside each object on the filesystem. Custom S3 object metadata is not exposed through this backend.

If you prefer to keep the S3 SDK path (for example, because not every host has the NFS mount), use the standard `s3` backend with `s3-files-compatible: true` instead.

---

### Azure Blob Storage

:::alert{type="info"}
Disable hierarchical namespace on the target container. That Azure feature is not supported by the storage backend.
:::

#### Minimum configuration

```yaml
kestra:
  storage:
    type: azure
    azure:
      endpoint: https://myaccount.blob.core.windows.net
      container: kestra-storage
```

#### Configuration reference

**Connection**

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `endpoint` | string | **Yes** | — | Azure Blob service endpoint (e.g. `https://<account>.blob.core.windows.net`). |
| `container` | string | **Yes** | — | Container name used for internal storage. |

**Connection string auth**

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `connection-string` | string | No | — | Full Azure Storage connection string. Highest-priority auth — if set, all other auth properties are ignored. |

**Shared key auth**

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `shared-key-account-name` | string | No | — | Storage account name. Used together with `shared-key-account-access-key`. |
| `shared-key-account-access-key` | string | No | — | Storage account access key. |

**SAS token auth**

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `sas-token` | string | No | — | Shared Access Signature token. |

**Managed identity auth**

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `managed-identity-client-id` | string | No | — | Client ID of a user-assigned managed identity. Omit for system-assigned. |
| `managed-identity-resource-id` | string | No | — | Resource ID of a user-assigned managed identity. Alternative to `managed-identity-client-id`. |

**Workload identity auth**

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `workload-identity-client-id` | string | No | — | Client ID for Azure Workload Identity (AKS federated credentials). |

**All auth modes**

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `additionally-allowed-tenants` | string[] | No | — | Additional tenant IDs the credential may acquire tokens for. Use `"*"` to allow any tenant. |

#### Credential resolution order

1. `connection-string` — if set, all other auth properties are skipped.
2. `shared-key-account-name` + `shared-key-account-access-key`.
3. `sas-token`.
4. `DefaultAzureCredential` chain — environment variables (`AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`), then managed identity (honoring `managed-identity-client-id` / `managed-identity-resource-id`), then workload identity (honoring `workload-identity-client-id`), then Azure CLI.

#### Permissions

Assign the **Storage Blob Data Contributor** built-in role to the identity (service principal, managed identity, or workload identity principal) on the container or storage account. This role covers all data-plane read, write, and delete operations on blobs.

Connection string and shared key auth carry full data-plane access inherently and do not require a role assignment.

---

### MinIO / S3-compatible

Use `type: minio` for MinIO and any S3-compatible object storage — including Ceph, SeaweedFS S3 API, Garage, and Outscale OOS.

#### Minimum configuration

```yaml
kestra:
  storage:
    type: minio
    minio:
      endpoint: my.minio.domain.com
      port: 9000
      secure: false
      access-key: ${AWS_ACCESS_KEY_ID}
      secret-key: ${AWS_SECRET_ACCESS_KEY}
      region: "default"
      bucket: my-bucket
      part-size: 5MB
      # httpConnectTimeout: PT10S  # optional; omit to use OkHttp default (10 s)
      # httpReadTimeout: PT10S     # optional; omit to use OkHttp default (10 s)
      # httpWriteTimeout: PT10S    # optional; omit to use OkHttp default (10 s)
```

#### Configuration reference

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `endpoint` | string | No | — | MinIO or S3-compatible server hostname or URL. |
| `port` | integer | No | `0` | Server port. Default `0` uses the standard port for the chosen scheme. |
| `secure` | boolean | No | `false` | Use TLS for the connection. |
| `access-key` | string | No | — | Access key ID. |
| `secret-key` | string | No | — | Secret access key. |
| `region` | string | No | — | Region to include in request signing. |
| `bucket` | string | No | — | Bucket name. |
| `part-size` | size | No | `5MB` | Multipart upload part size. Minimum 5 MiB. |
| `vhost` | boolean | No | `false` | Enable virtual-hosted style bucket URLs. Set to `true` when MinIO uses `MINIO_DOMAIN`. |
| `ca-pem` | string | No | — | CA certificate PEM for custom TLS trust. |
| `client-pem` | string | No | — | Client certificate PEM for mutual TLS. |
| `http-connect-timeout` | duration | No | — | HTTP connection timeout. |
| `http-read-timeout` | duration | No | — | HTTP read timeout. |
| `http-write-timeout` | duration | No | — | HTTP write timeout. |
| `http-connection-keep-alive` | duration | No | — | HTTP keep-alive duration. |
| `proxy-configuration` | object | No | — | HTTP proxy settings (host, port, type, username, password). |
| `ssl-options` | object | No | — | Advanced SSL/TLS options (protocols, cipher suites, trust manager). |

If MinIO uses `MINIO_DOMAIN`, set `vhost: true` and point `endpoint` at the base domain rather than `bucket.domain`.

#### Permissions

Create a MinIO policy that grants the access key read/write access to the bucket, then attach it via `mc admin policy attach`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET/*"
    }
  ]
}
```

For Ceph RGW, SeaweedFS, or other S3-compatible backends, apply the equivalent bucket ACL or user policy through that system's admin interface.

---

If large bucket operations such as `deleteByPrefix()` produce `SocketException: Socket closed` errors on heavily loaded or large buckets, increase `httpReadTimeout` or set it to `PT0S` to disable the timeout entirely.

### SeaweedFS

```yaml
kestra:
  storage:
    type: seaweedfs
    seaweedfs:
      filer-host: localhost
      filer-port: 18888
```

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `filer-host` | string | No | — | Hostname or IP of the SeaweedFS filer server. |
| `filer-port` | integer | No | `18888` | gRPC port of the SeaweedFS filer server. |
| `prefix` | string | No | `""` | Root prefix path for all storage operations. |
| `replication` | string | No | `"000"` | Replication factor (`000` = no replication, `001` = 1 copy). |

SeaweedFS has no built-in authentication. Control access at the network level by restricting which hosts can reach the filer gRPC port.

---

### Cloudflare R2

```yaml
kestra:
  storage:
    type: cloudflare
    cloudflare:
      account-id: YOUR_CLOUDFLARE_ACCOUNT_ID
      bucket: kestra-storage
      access-key-id: YOUR_R2_ACCESS_KEY_ID
      secret-access-key: YOUR_R2_SECRET_ACCESS_KEY
```

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `account-id` | string | **Yes** | — | Cloudflare account ID, used to build the R2 endpoint. |
| `bucket` | string | **Yes** | — | R2 bucket name. |
| `access-key-id` | string | No | — | R2 API token access key ID. |
| `secret-access-key` | string | No | — | R2 API token secret access key. |
| `path` | string | No | — | Object key prefix within the bucket. |
| `endpoint-override` | string | No | — | Override the R2 endpoint URL (used for testing with S3-compatible services). |

#### Permissions

Create an R2 API token with **Object Read & Write** permissions. Scope the token to the specific bucket rather than all buckets. R2 does not use IAM-style policies — permissions are set directly on the API token in the Cloudflare dashboard under **R2 → Manage R2 API Tokens**.

---

### Huawei OBS

Kestra supports Huawei Cloud Object Storage Service (OBS) as an internal storage backend.

#### Minimum configuration

```yaml
kestra:
  storage:
    type: obs
    obs:
      access-key: YOUR_OBS_ACCESS_KEY
      secret-key: YOUR_OBS_SECRET_KEY
      bucket: kestra-storage
      region: cn-north-4
```

#### Configuration reference

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `access-key` | string | **Yes** | — | OBS access key (AK). |
| `secret-key` | string | **Yes** | — | OBS secret key (SK). |
| `bucket` | string | **Yes** | — | OBS bucket for internal storage. |
| `region` | string | No | — | Huawei Cloud region (e.g. `cn-north-4`). Resolves to `https://obs.<region>.myhuaweicloud.com`. Ignored when `endpoint` is set. |
| `endpoint` | string | No | — | Explicit OBS or S3-compatible endpoint URL. Takes precedence over `region`. |
| `security-token` | string | No | — | Security token for temporary AK/SK credentials. |
| `path` | string | No | — | Object key prefix within the bucket. |
| `path-style-access` | boolean | No | `false` | Use path-style bucket addressing. Required for MinIO and most S3-compatible endpoints. |

#### Permissions

Attach a bucket policy or Huawei IAM policy granting the AK/SK identity the following actions on the bucket and its objects:

| Action | Scope |
|---|---|
| `obs:bucket:ListAllMyBuckets`, `obs:bucket:ListBucket`, `obs:bucket:GetBucketLocation` | Bucket |
| `obs:object:GetObject`, `obs:object:PutObject`, `obs:object:DeleteObject` | Objects (`/*`) |

Alternatively, assign the predefined **OBSFullAccess** Huawei IAM policy scoped to the bucket if a custom bucket policy is not required.

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

Use `globals` for values that need to be available in every flow, `recursive-rendering` only when you intentionally want pre-0.14 recursive behavior, and `cache-enabled` when you need to trade CPU for correctness while debugging template changes. Set `cache-size` to limit the number of cached templates (default `1000`):

```yaml
kestra:
  variables:
    cache-size: 1000
```

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

### Local file access

To allow universal file access from host-mounted paths, both mount the directory and add it to the allowlist:

```yaml
kestra:
  local-files:
    allowed-paths:
      - /scripts
    enable-preview: false
```

Without the allowlist, file-access URIs pointing at local host paths will be rejected even if the path is mounted into the container.

The `io.kestra.plugin.fs.local.Upload` and `io.kestra.plugin.fs.local.Uploads` tasks enforce their own `allowed-paths` check, independent of `kestra.local-files.allowed-paths`. Configure permitted directories under `plugins.configurations`:

```yaml
kestra:
  plugins:
    configurations:
      - type: io.kestra.plugin.fs.local.Uploads
        values:
          allowed-paths:
            - /data/uploads
      - type: io.kestra.plugin.fs.local.Upload
        values:
          allowed-paths:
            - /data/uploads
```

## When to use this page

- Need logs, telemetry, metrics, endpoints, CORS, or SSL: [Observability and Networking](../03.observability-and-networking/index.md)
- Need plugin defaults, retries, task temp storage, templates, or system flows: [Plugins and Execution](../04.plugins-and-execution/index.md)
- Need secret backends or server hardening: [Security and Secrets](../05.security-and-secrets/index.md)
