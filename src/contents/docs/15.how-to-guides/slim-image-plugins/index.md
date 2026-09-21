---
title: Add Plugins to a Slim Kestra Docker Image
h1: Build a Custom Kestra Image with Only the Plugins You Need
icon: /src/contents/docs/icons/docker.svg
stage: Getting Started
topics:
  - DevOps
description: Learn how to start from the slim Kestra Docker image and add only the plugins you need — open source or Enterprise — using kestractl and a custom Dockerfile.
---

Start from the slim Kestra image and add only the plugins you need.

Kestra ships two flavors of its Docker image:

- The **default image** (`kestra/kestra` for OSS, `kestra-ee` for Enterprise), which bundles all plugins.
- The **slim image** (with the `-slim` suffix), which ships without plugins for a smaller footprint and faster startup.

If you want a lean image but still need a handful of plugins, start from the slim image and layer in only what your workflows use. This guide covers both open source and Enterprise plugins using [`kestractl`](../../kestra-cli/kestractl/index.md#plugin-management).

The steps are the same in every case:

1. Download the plugins you need into a local `plugins/` directory with `kestractl`.
2. Copy that directory into a custom image built `FROM` the slim base image.
3. Verify the plugins are present by running the image locally.
4. Push the verified image to your registry.

## Prerequisites

- Replace `<version>` with your Kestra version number (e.g., `2.0.2`) in all commands below.
- Docker installed and authenticated to your registry.
- For the Enterprise base image, log in to the Kestra registry with your license credentials:

  ```bash
  docker login registry.kestra.io \
    --username "$KESTRA_LICENSE_ID" \
    --password "$KESTRA_LICENSE_FINGERPRINT"
  ```

- `kestractl` installed:

  ```bash
  curl -fsSL https://raw.githubusercontent.com/kestra-io/kestractl/main/install-scripts/install.sh | bash
  ```

## Download the plugins

Use `kestractl plugins download` to fetch plugins into a local `./plugins` directory. The `--compatible-for` flag resolves the correct plugin version for your Kestra release automatically.

### Open source plugins

Open source plugins are published to Maven Central, so no authentication is required:

```bash
kestractl plugins download --compatible-for <version> \
  --plugins io.kestra.storage:storage-s3 \
  --plugins-dir ./plugins
```

### Enterprise plugins

Enterprise plugins (and external backends such as secret managers) are served from the Kestra plugin registry, which requires your license credentials:

```bash
kestractl plugins download --compatible-for <version> \
  --plugins io.kestra.plugin.ee:plugin-ee-salesforce \
  --plugins-dir ./plugins \
  --maven-repository https://registry.kestra.io/maven \
  --maven-username "$KESTRA_LICENSE_ID" \
  --maven-password "$KESTRA_LICENSE_FINGERPRINT"
```

You can repeat `--plugins` to download several plugins in one command.

## Build the image

Create a `Dockerfile` next to your `plugins/` directory. Use the base image for your edition:

```dockerfile
# Enterprise Edition
FROM registry.kestra.io/docker/kestra-ee:v<version>-slim

# Open Source
# FROM kestra/kestra:v<version>-slim

COPY --chown=kestra:kestra plugins/ /app/plugins/
```

Build the image locally:

```bash
docker build -t kestra:custom-<version> .
```

:::alert{type="warning"}
The version in the base image tag and the version you pass to `--compatible-for` must match. Mismatched versions cause plugin loading failures at runtime.
:::

## Verify the plugins

Confirm the plugins are present before pushing:

```bash
docker run --rm kestra:custom-<version> \
  plugins list --plugins /app/plugins
```

This invokes the Kestra embedded CLI inside the container. For each plugin JAR found in `/app/plugins`, a line like the following appears in the output:

```
Found plugin on path: file:/app/plugins/io_kestra_storage__storage-s3__1_4_6.jar [Storages: io.kestra.storage.s3.S3FilesStorage, io.kestra.storage.s3.S3Storage]
```

Once verified, tag and push to your registry:

```bash
docker tag kestra:custom-<version> my-registry.example.com/kestra:custom-<version>
docker push my-registry.example.com/kestra:custom-<version>
```

## See also

- [Install Only Selected Plugins in Kestra OSS](../selected-plugin-installation/index.md)
- [Docker image tags and slim image options](../../02.installation/02.docker/index.md#docker-image-tags)
