---
title: The default pullPolicy for Docker-based tasks changed
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS", "EE"]
---

## Overview

Due to the new [Docker Hub pull usage and limits](https://docs.docker.com/docker-hub/usage/pulls/), all the Docker-based Kestra tasks have their default `pullPolicy` updated from `ALWAYS` to `IF_NOT_PRESENT` to avoid any pull limit issue. Read more about the change in the [GitHub issue](https://github.com/kestra-io/plugin-scripts/issues/230).

Previously, the following flow would have the `pullPolicy` default to `ALWAYS`:

```yaml
id: docker_script_runner
namespace: company.team

tasks:
  - id: shell
    type: io.kestra.plugin.scripts.shell.Commands
    containerImage: centos
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
      cpu:
        cpus: 1
    commands:
      - echo "Hello World!"
```

Now, the plugin defaults to `IF_NOT_PRESENT`. This also applies to all other Docker-based tasks from the `plugin-docker` group, such as `io.kestra.plugin.docker.Run`.

![Default Docker Runner Pull Policy](/docs/migration-guide/0-23/pullPolicy-default.png)
