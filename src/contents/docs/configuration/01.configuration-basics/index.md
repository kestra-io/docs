---
title: Kestra Configuration Basics – Where to Edit Config and How Overrides Work
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

## SDK default authentication

SDK-based plugins can use default authentication if configured. Kestra resolves credentials in this order:

1. namespace-level default service account
2. tenant-level default service account
3. global SDK defaults

Example:

```yaml
tasks:
  sdk:
    authentication:
      username: ${kestra.server.basic-auth.username}
      password: ${kestra.server.basic-auth.password}
      # token: ${KESTRA_API_TOKEN}
```

If no namespace, tenant, or global default is configured, SDK-based tasks that use `DEFAULT` or `AUTO` authentication fail because no API credentials are available.

## What belongs on the other configuration pages

- Use [Runtime and Storage](../02.runtime-and-storage/index.md) for datasources, queue, repository, internal storage, JVM, environment metadata, and global variables.
- Use [Observability and Networking](../03.observability-and-networking/index.md) for logs, metrics, Micronaut, endpoints, access logs, SSL, and CORS.
- Use [Plugins and Execution](../04.plugins-and-execution/index.md) for plugin installation, plugin defaults, retries, local flow sync, templates, and execution behavior.
- Use [Security and Secrets](../05.security-and-secrets/index.md) for encryption, secret backends, auth hardening, and liveness settings.
- Use [Enterprise and Advanced](../06.enterprise-and-advanced/index.md) for EE license, Kafka, Elasticsearch, indexer, AI Copilot, and air-gapped deployments.

## Next steps

- Need repository, datasource, storage, JVM, or server settings: [Runtime and Storage](../02.runtime-and-storage/index.md)
- Need logs, metrics, or SSL settings: [Observability and Networking](../03.observability-and-networking/index.md)
- Need the complete unabridged page: [Full Reference](../99.full-reference/index.md)
