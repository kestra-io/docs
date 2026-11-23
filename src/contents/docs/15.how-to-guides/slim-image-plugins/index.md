---
title: Install Selected Plugins on a Slim Kestra Image
h1: Install Only the Plugins You Need on a Slim Kestra Image
sidebarTitle: Install Selected Plugins
icon: /src/contents/docs/icons/docker.svg
stage: Getting Started
topics:
  - DevOps
description: Download only the Kestra plugins you need with kestractl, then bake them into a custom slim Docker image or mount them with Docker Compose. Covers open source and Enterprise plugins.
---

Install only the plugins your flows use on top of the slim Kestra image.

Kestra ships two flavors of its Docker image:

- The **default image** (`kestra/kestra` for OSS, `kestra-ee` for Enterprise), which bundles all plugins.
- The **slim image** (with the `-slim` suffix, formerly `-no-plugins`), which ships without plugins for a smaller footprint and faster startup.

Plugins are JAR files that Kestra loads from `/app/plugins` at startup. To add a selected set to the slim image, use [`kestractl`](../../kestra-cli/kestractl/index.md#installation), the recommended tool for downloading plugins:

1. Download the plugins you need into a local `plugins/` directory with `kestractl`.
2. Copy that directory into a custom image, or mount it into the container with Docker Compose.
3. Verify the plugins are present.

The same `kestractl` commands prepare plugins for a [standalone server](../../02.installation/12.standalone-server/index.md) or a remote worker without Docker.

:::alert{type="info"}
For local development in open source Kestra, plugin auto-install may be enough: Kestra fetches a missing plugin from Maven Central when you save a flow that uses it. Auto-install is on by default with local storage (for example, `server local`), and `KESTRA_PLUGINS_AUTO_INSTALL_ENABLED=true` turns it on elsewhere. Enterprise uses [Versioned Plugins](../../07.enterprise/05.instance/versioned-plugins/index.md) instead.
:::

## Prerequisites

- Docker installed and authenticated to your registry.
- For the Enterprise base image, log in to the Kestra registry with your license credentials:

  ```bash
  docker login registry.kestra.io \
    --username "$KESTRA_LICENSE_ID" \
    --password "$KESTRA_LICENSE_FINGERPRINT"
  ```

- `kestractl` installed. See [kestractl installation](../../kestra-cli/kestractl/index.md#installation), or run:

  ```bash
  curl -fsSL https://raw.githubusercontent.com/kestra-io/kestractl/main/install-scripts/install.sh | bash
  ```

## Download the plugins

By default, `kestractl` writes plugins to a local `./plugins` directory. The `--compatible-for` flag resolves the plugin version that matches your Kestra release, so you don't need to look up version numbers. In the commands on this page, replace `<version>` with your Kestra version (for example, `2.0.2`).

### Open source plugins

Open source plugins are published to Maven Central, so you don't need to authenticate. To download one plugin:

```bash
kestractl plugins get io.kestra.plugin:plugin-dbt --compatible-for <version>
```

To download several plugins in one command, repeat `--plugins`:

```bash
kestractl plugins download --compatible-for <version> \
  --plugins io.kestra.plugin:plugin-dbt \
  --plugins io.kestra.plugin:plugin-script-python \
  --plugins io.kestra.storage:storage-s3 \
  --plugins-dir ./plugins
```

To find plugin coordinates, run `kestractl plugins list <version>`, which prints every plugin compatible with that Kestra version.

### Enterprise plugins

Enterprise plugins and external backends, such as secret managers, are served from the Kestra plugin registry. Pass your license credentials to download them:

```bash
kestractl plugins download --compatible-for <version> \
  --plugins io.kestra.plugin.ee:plugin-ee-salesforce \
  --plugins-dir ./plugins \
  --maven-repository https://registry.kestra.io/maven \
  --maven-username "$KESTRA_LICENSE_ID" \
  --maven-password "$KESTRA_LICENSE_FINGERPRINT"
```

## Add the plugins to Kestra

Choose one approach. A custom image is the better fit for production and distributed deployments because every component runs the same artifact. Mounting a directory is quicker for a single Docker Compose host.

### Option 1: Build a custom image

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

In a distributed deployment, every Kestra component (Executor, Webserver, and Workers) must run the exact same Docker image. Build one custom image and use it across all components.
:::

### Option 2: Mount the plugins with Docker Compose

Mount your local `plugins/` directory into `/app/plugins` in your [Docker Compose](../../02.installation/03.docker-compose/index.md) file:

```yaml
services:
  kestra:
    image: kestra/kestra:v<version>-slim
    volumes:
      - ./plugins:/app/plugins
```

Restart the container after adding or removing JARs. Kestra loads plugins only at startup.

## Verify the plugins

Confirm the plugins are present before you push or deploy the image:

```bash
docker run --rm kestra:custom-<version> \
  plugins list --plugins /app/plugins
```

For a Docker Compose mount, run the same check against the service instead:

```bash
docker compose run --rm --entrypoint /app/kestra kestra \
  plugins list --plugins /app/plugins
```

Both commands run the Kestra server CLI inside the container. For each plugin JAR found in `/app/plugins`, a line like the following appears in the output:

```plaintext
Found plugin on path: file:/app/plugins/io_kestra_storage__storage-s3__1_4_6.jar [Storages: io.kestra.storage.s3.S3FilesStorage, io.kestra.storage.s3.S3Storage]
```

On a running instance, `kestractl plugins installed` lists the plugins the server has loaded.

After you verify a custom image, tag it and push it to your registry:

```bash
docker tag kestra:custom-<version> my-registry.example.com/kestra:custom-<version>
docker push my-registry.example.com/kestra:custom-<version>
```

## Alternative: install from inside the image

If you can't run `kestractl` in your build environment, install plugins during the image build with the Kestra server CLI bundled in the image. Use [`kestra plugins install`](../../kestra-cli/kestra-server/index.md#kestra-plugins-install):

```dockerfile
FROM kestra/kestra:v<version>-slim

RUN /app/kestra plugins install \
  io.kestra.plugin:plugin-dbt:LATEST \
  io.kestra.plugin:plugin-script-python:LATEST
```

This approach downloads from Maven Central at build time, so the build needs outbound network access. `LATEST` resolves to the newest version compatible with the image's Kestra version.

## Pin plugin versions in Enterprise

Open source Kestra loads one version of each plugin. [Versioned Plugins](../../07.enterprise/05.instance/versioned-plugins/index.md) in Kestra Enterprise let you install several versions side by side, pin a version per flow, and install or upgrade plugins from the UI without rebuilding the image.

## See also

- [kestractl plugin commands](../../kestra-cli/kestractl/index.md#plugin-management)
- [Docker image tags and slim image options](../../02.installation/02.docker/index.md#docker-image-tags)
