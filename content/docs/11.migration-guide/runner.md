---
title: Migrating from runner to taskRunner
icon: /docs/icons/migration-guide.svg
release: 0.18.0
---

The `runner` property in script tasks will be deprecated in Kestra 0.18.0. Use [the `taskRunner` property](../05.concepts/09.task-runners/index.md) instead.

## Task Runners Before Kestra 0.16.0

The `runner` property allowed script tasks to run in local processes or Docker containers. Here’s an example of a script task configured with the `runner` property:

```yaml
- id: script_task
  type: io.kestra.plugin.scripts.python.Commands
  runner: DOCKER # ✅ This is the deprecated runner property
  docker:
    image: python:3.11
```


::collapse{title="Full example of a task with a DOCKER runner"}
```yaml
id: python_in_container
namespace: dev

tasks:
  - id: working_directory
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/scripts
        branch: main

      - id: fetch_users
        type: io.kestra.plugin.scripts.python.Commands
        runner: DOCKER # ✅ This is the runner property
        docker:
          image: ghcr.io/kestra-io/pydata:latest
        warningOnStdErr: false
        commands:
          - python etl/get_users_from_api.py
```
::

And here is the equivalent task using the `taskRunner` property:
```yaml
- id: script_task
  type: io.kestra.plugin.scripts.python.Commands
  containerImage: python:3.11
  taskRunner:
    type: io.kestra.core.models.script.types.DockerTaskRunner # ✅ the runner is now a plugin
```

::alert{type="info"}
Note how the `containerImage` replaces the nested `docker.image` property.

Since the task runners can deploy containers to multiple environments (incl. Kubernetes, AWS Fargate, GCP CloudRun and more) rather than only Docker, the `containerImage` is now a top-level property of the script task rather than nested under `docker`.
::


## Transition to `taskRunner` in Kestra 0.16.0 and Beyond

Kestra 0.16.0 introduced the `taskRunner` property, offering [broader execution options](../05.concepts/09.task-runners/05.types/index.md), such as Kubernetes, AWS Batch, Azure Batch, and Google Batch. This approach decouples the execution environment configuration from the script tasks, making it easier to manage and extend. Below is an updated example of the same script task, but this time using the `taskRunner` property.

::collapse{title="Updated script task using a task runner"}
```yaml
id: python_in_container
namespace: dev.task_runners

tasks:
  - id: working_directory
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/scripts
        branch: main

      - id: fetch_users
        type: io.kestra.plugin.scripts.python.Commands
        containerImage: ghcr.io/kestra-io/pydata:latest
        warningOnStdErr: false
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.DockerTaskRunner
        commands:
          - python etl/get_users_from_api.py
```
::

### Why the Change?

The `runner` property was limited to a few predefined options, and extending it required modifications to the core script plugin. By transitioning to the `taskRunner`, each environment type is a plugin, which simplifies maintenance and customization. You can create your own Task Runner plugins and if you'd like, you can contribute them to kestra.

We envision task runners as a pluggable system allowing you to **orchestrate any code anywhere** without having to worry about the underlying infrastructure.

### Advantages of Using `taskRunner`

- **Flexibility**: Configure various environments easily using plugins.
- **Decoupling**: Separate the script task configuration from execution environment details.
- **Scalability**: Easily add new environments as plugins without having to change anything in your business logic.


### Steps for Migration

1. **Review Existing Tasks**: Identify all script tasks using the `runner` or `docker` properties.
2. **Choose Suitable `taskRunner`**: Select the appropriate `taskRunner` type based on your execution environment. The `DockerTaskRunner` is the default.
3. **Update Your Configuration**: Replace the `runner` property with `taskRunner` and adjust the configuration to match the new structure, including replacing the `docker.image` with `containerImage`.
4. **Test Changes**: Validate the updated configurations in a development or staging environment before deploying to production.

## Support for Legacy `runner` Property

While the `runner` property is deprecated, it will continue to be supported for a couple of releases, allowing a gradual transition to `taskRunner`. However, we recommend to switch as soon as possible to take advantage of the new capabilities.
