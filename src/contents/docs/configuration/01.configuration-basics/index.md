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

Environment variables override file-based configuration.

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

## Environment variable conversion

Convert YAML keys to environment variables like this:

- replace dots (`.`) with underscores
- replace hyphens (`-`) with underscores
- convert camelCase boundaries to underscores
- uppercase everything

Examples:

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

becomes:

```bash
KESTRA_STORAGE_S3_ACCESS_KEY=myKey
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
```

## Next steps

- Need repository, datasource, storage, JVM, or server settings: [Runtime and Storage](../02.runtime-and-storage/index.md)
- Need logs, metrics, or SSL settings: [Observability and Networking](../03.observability-and-networking/index.md)
- Need the complete unabridged page: [Full Reference](../99.full-reference/index.md)
