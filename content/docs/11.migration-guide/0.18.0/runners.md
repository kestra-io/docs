---
title: Deprecation of runner property in favor of taskRunner
icon: /docs/icons/migration-guide.svg
release: 0.18.0
---

How to migrate from `runner` to `taskRunner`.

## Why the change?

Task Runners is a pluggable system that allows you to offload the execution of your tasks to different environments.

With the general availability of `taskRunner` in Kestra 0.18.0, the [runner](../../16.scripts/03.runners.md) property is deprecated. Task Runners provide more flexibility and control over how your tasks are executed, allowing you to run your code in various remote environments by:
1. Leveraging task runner plugins [managed by Kestra](/demo)
2. Building your own task runner plugins customized to your needs.

## Migration

To migrate from the `runner` property to `taskRunner`, update your flow code as follows:

1. Replace the `runner` property with `taskRunner`.
2. If you were using the `DOCKER` runner with a custom Docker image, replace the `docker.image` property with the `containerImage` property.
3. Update any other properties in the `taskRunner` configuration as needed, e.g. to configure Docker image pull policies, CPU and memory limits, or to provide credentials to private Docker registries.

::alert{type="info"}
Note that all other script task's properties, such as the `beforeCommands`, `commands`, `inputFiles`, `outputFiles`, `interpreter`, `env`, `warningOnStdErr`, `workerGroup`, and more, remain the same. **You only need to replace the `runner` property with `taskRunner` and adjust the Docker image configuration if needed.**
::

Let's look at some examples to make this clearer.

### From `PROCESS` runner to `taskRunner`

If you were using the `PROCESS` runner to execute your tasks in local processes, add the `taskRunner` property with the `type` set to `io.kestra.plugin.core.runner.Process`.

Before (the old way):
```yaml
id: example_with_runner
namespace: company.team

tasks:
  - id: script
    type: io.kestra.plugin.scripts.python.Script
    runner: PROCESS
    script: |
      from kestra import Kestra

      data = dict(message="Hello from Kestra!", release="0.17.0")
      print(data.get("message"))
      Kestra.outputs(data)
```

After (the current way):
```yaml
id: example_with_taskRunner
namespace: company.team

tasks:
  - id: script
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    script: |
      from kestra import Kestra

      data = dict(message="Hello from Kestra!", release="0.18.0")
      print(data.get("message"))
      Kestra.outputs(data)
```

### From `DOCKER` runner to `taskRunner`

If you were using the `DOCKER` runner to run your scripts in a Docker container, add the `taskRunner` property with the `type` set to `io.kestra.plugin.scripts.runner.docker.Docker`.

Before (the old way):
```yaml
id: example_with_runner
namespace: company.team

tasks:
  - id: script
    type: io.kestra.plugin.scripts.python.Script
    runner: DOCKER
    docker:
      image: ghcr.io/kestra-io/kestrapy:latest
      pullPolicy: IF_NOT_PRESENT
      cpu:
        cpus: 1
      memory:
        memory: "512MB"
    script: |
      from kestra import Kestra

      data = dict(message="Hello from Kestra!", release="0.17.0")
      print(data.get("message"))
      Kestra.outputs(data)
```

After (the current way):
```yaml
id: example_with_taskRunner
namespace: company.team

tasks:
  - id: script
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
      pullPolicy: IF_NOT_PRESENT
      cpu:
        cpus: 1
      memory:
        memory: "512MB"
    containerImage: ghcr.io/kestra-io/kestrapy:latest
    script: |
      from kestra import Kestra

      data = dict(message="Hello from Kestra!", release="0.18.0")
      print(data.get("message"))
      Kestra.outputs(data)
```

Note how the `containerImage` is now a top-level property of each script task. This makes the configuration more flexible, as the image changes more often than the standard runner configuration.

