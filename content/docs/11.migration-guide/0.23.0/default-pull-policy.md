---
title: The default `pullPolicy` for Docker-based tasks changed
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS", "EE"]
---

## Overview

Due to the new [Docker Hub pull usage and limits](https://docs.docker.com/docker-hub/usage/pulls/), all the Docker-based Kestra tasks will have their default `pullPolicy` updated from `ALWAYS` to `IF_NOT_PRESENT` to avoid any pull limit issue. Read more into the issue in the [GitHub issue](https://github.com/kestra-io/plugin-scripts/issues/230).

