---
title: Install Kestra on Windows – Standalone JAR Setup
sidebarTitle: Windows
icon: /src/contents/docs/icons/java.svg
description: Run Kestra on Windows using the standalone executable JAR. Covers plugin installation, configuration, and running a local or standalone server.
---

Run Kestra on Windows using the standalone executable JAR — no Docker required.

One use case for this setup is running a Windows remote worker as part of a [worker group](../../07.enterprise/04.scalability/worker-group/index.md), allowing Windows-native scripts such as PowerShell or batch commands to be executed within a broader Kestra deployment.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/Pyr0AKLFfBc?si=sdgYcOftlDoq5_Cs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Prerequisites

1. Install [Java JRE 21](https://adoptium.net/temurin/releases/?os=windows&version=21) — download the `x64` MSI installer and run it.
2. Download the latest Kestra binary from the [Releases](https://github.com/kestra-io/kestra/releases) page — find it under **Assets** for the desired version (e.g., `kestra-1.3.6`).
3. Rename the downloaded file to `kestra.bat`.
4. Open **CMD** in the directory containing `kestra.bat`.

## Plugin installation

The standalone JAR ships without plugins. You must install them before starting the server, otherwise tasks that rely on plugins will fail.

### Install specific plugins

Install only the plugins you need by listing them explicitly:

```bat
.\kestra.bat plugins install io.kestra.plugin:plugin-script-powershell:LATEST io.kestra.plugin:plugin-script-python:LATEST
```

Find plugin identifiers in the [full plugins list](https://github.com/kestra-io/kestra/blob/develop/.plugins).

### Install all plugins

To install every available plugin at once, use the `--all` flag:

```bat
.\kestra.bat plugins install --all
```

:::alert{type="info"}
Installing all plugins downloads approximately 3 GB of files sequentially and can take a significant amount of time. Prefer installing specific plugins when possible.
:::

### Use a plugins directory

Point Kestra to a directory of pre-downloaded plugin JARs using the `KESTRA_PLUGINS_PATH` environment variable:

```bat
set KESTRA_PLUGINS_PATH=C:\kestra\plugins
```

## Start the server

Use `server local` for a quick local setup backed by an H2 embedded database. To connect to an external database (PostgreSQL or MySQL), use `server standalone` and provide a full configuration file.

```bat
.\kestra.bat server local --config path\to\your\config.yaml
```

The `.\` prefix is required when running a file from the current directory in CMD. Once started, Kestra is accessible at [localhost:8080](http://localhost:8080). Log in with your email and password.

:::alert{type="warning"}
`server local` is suitable for local testing only — do not use it in production.
:::

## Configuration

Kestra is configured via a YAML file passed with `--config` (or `-c`). If no flag is provided, Kestra looks for `%USERPROFILE%\.kestra\config.yaml` by default.

A minimal configuration for local testing:

```yaml
kestra:
  repository:
    type: memory
  storage:
    type: local
    local:
      base-path: "C:\\kestra\\storage"
  queue:
    type: memory
```

For a production setup or Enterprise installation, your configuration requires at minimum:

```yaml
kestra:
  encryption:
    secret-key: "<base64-encoded-32-char-key>"  # generate with: openssl rand -base64 32
  secret:
    type: jdbc
    jdbc:
      secret: "<your-jdbc-secret-key>"
  repository:
    type: postgres
  queue:
    type: postgres
  storage:
    type: s3
    s3:
      endpoint: "<your-s3-endpoint>"
      access-key: "<your-aws-access-key-id>"
      secret-key: "<your-aws-secret-access-key>"
      region: "<your-aws-region>"
      bucket: "<your-s3-bucket-name>"
  ee:
    license:
      id: "<your-license-id>"
      fingerprint: "<your-license-fingerprint>"
      key: |
        <your-license-key>

datasources:
  postgres:
    url: jdbc:postgresql://<host>:<port>/<db>
    driver-class-name: org.postgresql.Driver
    username: "<username>"
    password: "<password>"
```

The JDBC secret backend stores secrets in the same PostgreSQL database as Kestra. For cloud-based alternatives such as AWS Secrets Manager, Azure Key Vault, or Google Secret Manager, see the [external secrets manager documentation](../../07.enterprise/02.governance/secrets-manager/index.md). For all secret and encryption configuration options, see the [Security and secrets guide](../../configuration/05.security-and-secrets/index.md).

For the full list of configuration options, see the [Configuration guide](../../configuration/index.mdx).

## Local development: Docker Compose with WSL 2

For local evaluation or development on Windows, you can run Kestra via Docker Compose inside WSL 2. This pairs Kestra with a PostgreSQL container and avoids the limitations of the H2 embedded database, but WSL 2 is not recommended for production Windows Server workloads — use the standalone JAR with an external PostgreSQL database for those deployments.

**Prerequisites:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) with the **WSL 2 backend** enabled. In Docker Desktop, go to **Settings → Resources → WSL Integration** and confirm you are using WSL 2 rather than the Windows backend. Docker runs significantly better for Kestra under WSL 2.
- A WSL 2 distribution installed and running (e.g. Ubuntu via the Microsoft Store).

Once those are in place, follow the [Docker Compose installation guide](../03.docker-compose/index.md). It includes a curl command to download the example compose file and a pre-configured PostgreSQL container.
