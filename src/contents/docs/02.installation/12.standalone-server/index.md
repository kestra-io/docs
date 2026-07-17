---
title: "Run from Standalone JAR in Kestra: No Docker"
h1: Running Kestra Without Docker via Standalone JAR
sidebarTitle: Standalone Server
icon: /src/contents/docs/icons/java.svg
description: Run Kestra directly from a standalone executable JAR file, suitable for environments where Docker is not available.
---

Install Kestra on a standalone server with a simple executable file.

::snippet{name="cloud/cloud-not-available"}

## Run Kestra from the Standalone JAR

To deploy Kestra without Docker, there's a standalone JAR available that allows deployment in any environment that has JVM version 21+.

Make sure that you have [Java](https://adoptium.net/en-GB/temurin/releases) installed on your machine.

The latest JAR can be downloaded [via Kestra API](https://api.kestra.io/v1/versions/download).

This is an executable JAR. For Linux & MacOS, run it with `./kestra-VERSION <command>`.

For example, to launch Kestra:
- In local mode (with an H2 local file database), you run `./kestra-VERSION server local`.
- In standalone mode (you need to provide a configuration with a connection to a database) , you run `./kestra-VERSION server standalone`.

For more information on database configuration, check out the [Runtime and Storage configuration guide](../../configuration/02.runtime-and-storage/index.md)

:::alert{type="warning"}
Running the jar version comes without any [plugins](/plugins). You need to install them manually with the `kestra plugins install directory_with_plugins/` command. Alternatively, point to a directory with the plugins in the configuration file or an environment variable `KESTRA_PLUGINS_PATH` (e.g., `KESTRA_PLUGINS_PATH=/Users/anna/dev/plugins`).
:::

## Configuration

You can configure Kestra in multiple ways:

- **Configuration file** – point to a YAML file with `--config` (or `-c`).
- **Environment variable** – set the entire YAML payload in `KESTRA_CONFIGURATION`.

Example using a dedicated file:

```shell
./kestra server local --config confs/application.yaml
```

By default, Kestra looks for `${HOME}/.kestra/config.yaml`. Use absolute paths for clarity if the config lives elsewhere.

When using `KESTRA_CONFIGURATION`, ensure a `confs/` directory exists in the working directory: Kestra persists the generated configuration file there on startup. Quote multi-line values (as shown in the [Docker deployment guide](../02.docker/index.md#using-the-kestra_configuration-environment-variable)) so the YAML structure remains intact.

Configuration options are available in the [Configuration landing page](../../configuration/index.mdx). You can also review the default settings on [GitHub](https://github.com/kestra-io/kestra/blob/develop/cli/src/main/resources/application.yaml).

## Deploy as a systemd service

On [systemd](https://systemd.io/)-based systems, Kestra can be deployed as a systemd service. Below is a basic unit file template:

```systemd
[Unit]
Description=Kestra Event-Driven Declarative Orchestrator
Documentation=https://kestra.io/docs/
After=network-online.target

[Service]
Type=simple
ExecStart=/bin/sh <PATH_TO_YOUR_KESTRA_JAR>/kestra-<VERSION> server standalone
User=<KESTRA_UNIX_USER>
Group=<KESTRA_UNIX_GROUP>
RestartSec=5
Restart=always
## Send SIGTERM to the main Kestra process and wait up to 'TimeoutStopSec' for child processes in the cgroup to finish;
## if there are any remaining running processes in the cgroup, send SIGKILL to all of them.
KillMode=mixed
TimeoutStopSec=150
## Treat received SIGTERM as 'inactive'
SuccessExitStatus=143
## The syslog tag
SyslogIdentifier=kestra

[Install]
WantedBy=multi-user.target
```

## Install plugins from a Docker image

To copy the plugins from a Docker container to your local machine, you can use the following commands:

```bash
id=$(docker create kestra/kestra:develop)
docker cp $id:/app/kestra kestra
docker cp $id:/app/plugins plugins
docker rm $id
./kestra server local
```

## Installation on Windows

For comprehensive Windows-specific installation steps including plugin installation, see the [Windows installation guide](../13.windows/index.md). See below for a basic configuration example.

### Configuration

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

For the full list of configuration options, see the [Configuration guide](../../configuration/index.mdx).
