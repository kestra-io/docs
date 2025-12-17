---
title: Install Only Selected Plugins in Kestra Open Source
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Kestra Concepts
---

Install a selection of Kestra plugins in the open-source version. 

Pick and choose Kestra plugins to create lightweight builds and achieve a faster startup. This guide explains how to:

- Install specific plugins when using the `-no-plugins` Docker image
- Understand plugin versioning across Open Source and [Enterprise](../07.enterprise/01.overview/01.enterprise-edition.md)
- Automate plugin installation using Docker Compose
- Link to plugin documentation and versioning support

See also: [Versioned Plugins in Kestra Enterprise](../07.enterprise/05.instance/versioned-plugins.md).

## Plugin basics in Kestra Open Source

Kestra plugins are distributed as individual JAR files and loaded at runtime. Plugins are not embedded by default in `-no-plugins` Docker images. You can:

- Download specific [plugin JARs](https://repo.maven.apache.org/maven2/io/kestra/plugin/) manually or via `kestra plugins install`.
- Mount them into `/app/plugins/` in your [Docker Compose](../02.installation/03.docker-compose.md) setup.

## Install plugins via `kestra plugins install`

You can install any plugin using:

```bash
kestra plugins install io.kestra.plugin:plugin-dbt:LATEST
```

This will download the [plugin JAR from Maven Central](https://repo.maven.apache.org/maven2/io/kestra/plugin/) into `/app/plugins`. Just replace `plugin-dbt` with whichever plugin you'd like to download (e.g., `plugin-script-python`, `plugin-aws`, `plugin-notifications`, etc.)

You can run this inside a container (interactively or as part of Dockerfile) to build custom plugin bundles.

## Automate plugin selection with Docker Compose

If you're using the `kestra/kestra:*-no-plugins` image and want to add only selected plugins:

### Option 1: Use `kestra plugins install` inside the container

```yaml
services:
  kestra:
    image: kestra/kestra:latest-no-plugins
    entrypoint: /bin/sh -c "
      kestra plugins install io.kestra.plugin:plugin-dbt:LATEST && \
      kestra plugins install io.kestra.plugin:plugin-scripts:LATEST && \
      kestra server standalone"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./storage:/app/storage
```

### Option 2: Preload plugin JARs locally

You can copy only the JARs you need from a full Kestra image:

```bash
docker run --rm -d --name kestra-temp kestra/kestra:latest
docker cp kestra-temp:/app/plugins/. ./local-plugins
docker rm -f kestra-temp
```

Then remove unwanted plugins:

```bash
rm ./local-plugins/*unwanted-plugin*.jar
```

And mount your plugin folder:

```yaml
volumes:
  - ./local-plugins:/app/plugins
```

You may also use a scripted alias to automate this process. Below is an example for referral:

```bash
alias dl="rm -rf ./jar-plugins/* && docker run -d kestra/kestra:develop server local \
| xargs -I {} sh -c 'docker cp {}:/app/plugins ./jar-plugins && docker rm -f {}'"
```

## Plugin versioning in Enterprise

In Kestra Open Source, plugins must be installed at the latest compatible version. In Kestra Enterprise, you can:

- Pin specific plugin versions
- Upload custom plugin binaries per tenant
- Enable version-aware workflows

Learn more about versioned plugins in Enterprise:
[Versioned Plugins](../07.enterprise/05.instance/versioned-plugins.md)

## Best practices

| Use Case                   | Recommendation                                       |
| -------------------------- | ---------------------------------------------------- |
| Minimal runtime image      | Use `kestra/kestra:*-no-plugins` with mounted JARs   |
| Dynamic plugin setup       | Use `kestra plugins install` in entrypoint           |
| Controlled plugin versions | Use Enterprise with versioned plugins                |
| Custom plugin development  | Build and copy plugins into `/app/plugins/` manually |
