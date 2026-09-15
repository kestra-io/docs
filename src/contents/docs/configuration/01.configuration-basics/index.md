---
title: "Configuration Basics in Kestra: YAML & Env Overrides"
h1: Where Kestra Config Lives and How Overrides Work
description: Learn where Kestra configuration is defined, how YAML and environment variables interact, and what minimal settings are needed to start a Kestra instance.
sidebarTitle: Configuration Basics
icon: /src/contents/docs/icons/admin.svg
---

Use this page first if you are not sure where Kestra configuration is actually edited in your environment.

## Configuration sources

Kestra reads configuration from YAML. In practice, teams usually provide it in one of these ways:

- a YAML file mounted or bundled with the Kestra process
- the `KESTRA_CONFIGURATION` environment variable
- inline YAML inside Docker Compose
- Helm values or Kubernetes manifests

Environment variables override file-based configuration, so many teams keep a shared YAML base config in version control and inject deployment-specific values at runtime.

## Minimal boot configuration

Most deployments need to decide at least these three things:

1. repository type
2. queue type
3. internal storage type

Example:

```yaml
datasources:
  postgres:
    url: jdbc:postgresql://postgres:5432/kestra
    driver-class-name: org.postgresql.Driver
    username: kestra
    password: k3str4
kestra:
  repository:
    type: postgres
  queue:
    type: postgres
  storage:
    type: local
  url: "http://localhost:8080/"
```

These three choices drive the rest of the deployment:

- `kestra.repository.type` controls the persistence backend for core metadata.
- `kestra.queue.type` must be compatible with the repository type.
- `kestra.storage.type` controls where Kestra stores internal files and task artifacts.

## Environment variable conversion

Convert YAML keys to environment variables like this:

- replace dots (`.`) with underscores
- replace hyphens (`-`) with underscores
- convert camelCase boundaries to underscores
- uppercase everything
- prefix Kestra-specific keys with `KESTRA_`

Examples:

| Configuration value | Resulting properties |
| --- | --- |
| `MYAPP_MYSTUFF` | `myapp.mystuff`, `myapp-mystuff` |
| `MY_APP_MY_STUFF` | `my.app.my.stuff`, `my.app.my-stuff`, `my-app.my.stuff`, `my-app.my-stuff`, and similar variants |

File-based configuration:

```yaml
datasources:
  postgres:
    username: kestra
```

becomes:

```bash
DATASOURCES_POSTGRES_USERNAME=kestra
```

And:

```yaml
kestra:
  storage:
    s3:
      accessKey: myKey
```

or:

```yaml
kestra:
  storage:
    s3:
      access-key: myKey
```

becomes:

```bash
KESTRA_STORAGE_S3_ACCESS_KEY=myKey
```

Common patterns:

```bash
MICRONAUT_SERVER_PORT=8080
DATASOURCES_POSTGRES_USERNAME=kestra
KESTRA_STORAGE_TYPE=s3
KESTRA_URL=https://kestra.example.com
```

:::alert{type="warning"}
For storage backend properties such as `kestra.storage.s3.access-key` and `kestra.storage.gcs.project-id`, prefer either the YAML form or the double-underscore env-var form. A single underscore between the last two segments can be read as a path separator by Micronaut and produce a nested object that the storage plugin's Jackson mapper rejects with `UnrecognizedPropertyException`. The two forms below are equivalent and both avoid that issue:

```bash
# double underscore preserves the literal kebab/snake separator
KESTRA_STORAGE_S3_ACCESS__KEY=<aws-access-key-id>
KESTRA_STORAGE_S3_SECRET__KEY=<aws-secret-access-key>
```

```yaml
# or keep credentials in YAML and reference an env var
kestra:
  storage:
    s3:
      access-key: "${S3_ACCESS_KEY}"
      secret-key: "${S3_SECRET_KEY}"
```

The same applies to `kestra.storage.gcs.project-id`, `kestra.storage.gcs.service-account`, and other multi-word storage properties.
:::

## SDK default authentication

SDK-based plugins resolve authentication in this order:

1. Namespace-level default service account
2. Tenant-level default service account
3. Global SDK defaults (`kestra.tasks.sdk.authentication`)

**In OSS,** when `kestra.server.basic-auth` is configured, Kestra automatically derives the global SDK credentials from it — no additional configuration is needed. SDK-based tasks using `DEFAULT` or `AUTO` authentication work without further setup.

If you need to use different credentials from those in `kestra.server.basic-auth`, or to authenticate with an API token, override the global default explicitly:

```yaml
kestra:
  tasks:
    sdk:
      authentication:
        username: my-user        # overrides basic-auth username
        password: my-password    # overrides basic-auth password
        # api-token: ${KESTRA_API_TOKEN}  # use an API token instead
```

:::alert{type="warning"}
If only one of `username` or `password` is set — either explicitly or resolved from `basic-auth` — Kestra throws an error when a task first attempts to use the SDK. Both must be provided together or neither.
:::

If no credential is available at any level, SDK-based tasks using `DEFAULT` or `AUTO` authentication fail. This applies to OSS instances without basic auth configured, and to EE/Cloud instances without a namespace or tenant-level service account.

## What belongs on the other configuration pages

- Use [Runtime and Storage](../02.runtime-and-storage/index.md) for datasources, queue, repository, internal storage, JVM, environment metadata, and global variables.
- Use [Observability and Networking](../03.observability-and-networking/index.md) for logs, metrics, Micronaut, endpoints, access logs, SSL, and CORS.
- Use [Plugins and Execution](../04.plugins-and-execution/index.md) for plugin installation, plugin defaults, retries, local flow sync, templates, and execution behavior.
- Use [Security and Secrets](../05.security-and-secrets/index.md) for encryption, secret backends, auth hardening, and liveness settings.
- Use [Enterprise and Advanced](../06.enterprise-and-advanced/index.md) for EE license, Kafka, Elasticsearch, indexer, AI Copilot, and air-gapped deployments.

## Next steps

- Need repository, datasource, storage, JVM, or server settings: [Runtime and Storage](../02.runtime-and-storage/index.md)
- Need logs, metrics, or SSL settings: [Observability and Networking](../03.observability-and-networking/index.md)
- Need secret backends or advanced EE infrastructure: [Security and Secrets](../05.security-and-secrets/index.md) and [Enterprise and Advanced](../06.enterprise-and-advanced/index.md)
