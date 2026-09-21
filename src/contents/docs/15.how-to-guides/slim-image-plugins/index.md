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

- The **default image** (`kestra-ee`), which bundles all plugins.
- The **slim image** (`kestra-ee:...-slim`), which ships without plugins for a smaller footprint and faster startup.

If you want a lean image but still need a handful of plugins, start from the slim image and layer in only the plugins your workflows use. This guide shows how to do that for both open source and Enterprise plugins using [`kestractl`](../../kestra-cli/kestractl/index.md#plugin-management).

The workflow is the same in every case:

1. Download the plugins you need into a local `plugins/` directory with `kestractl`.
2. Copy that directory into a custom image built `FROM` the slim base image.
3. Push the image to your registry and verify the plugins are present.

## Prerequisites

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

## 1. Download the plugins

Use `kestractl plugins download` to fetch the plugins compatible with your Kestra version into a local `./plugins` directory.

### Open source plugins

Open source plugins are published to Maven Central, so no authentication is required:

```bash
kestractl plugins download --compatible-for 2.0.2 \
  --plugins io.kestra.storage:storage-s3 \
  --plugins-dir ./plugins
```

### Enterprise plugins

Enterprise plugins (and external backends such as secret managers) are served from the Kestra plugin registry, which requires your license credentials:

```bash
kestractl plugins download --compatible-for 2.0.2 \
  --plugins io.kestra.plugin.ee:plugin-ee-salesforce \
  --plugins-dir ./plugins \
  --maven-repository https://registry.kestra.io/maven \
  --maven-username "$KESTRA_LICENSE_ID" \
  --maven-password "$KESTRA_LICENSE_FINGERPRINT"
```

You can repeat `--plugins` to download several plugins in one command.

## 2. Build a custom image

Create a `Dockerfile` next to your `plugins/` directory:

```dockerfile
FROM registry.kestra.io/docker/kestra-ee:v2.0.2-slim

COPY --chown=kestra:kestra plugins/ /app/plugins/
```

Build and push it to your registry:

```bash
docker build -t my-registry.example.com/kestra-ee:2.0.2-s3 .
docker push my-registry.example.com/kestra-ee:2.0.2-s3
```

## 3. Verify the plugins

Confirm the plugins made it into the image:

```bash
docker run --rm my-registry.example.com/kestra-ee:2.0.2-s3 \
  plugins list --plugins /app/plugins
```

You should see the plugins you downloaded listed in the output.

Make sure the slim base image tag (`v2.0.2-slim`) and the version you pass to `--compatible-for` always match — pull plugins compatible with the exact Kestra version you deploy.

## See also

- [Install Only Selected Plugins in Kestra OSS](../selected-plugin-installation/index.md)
