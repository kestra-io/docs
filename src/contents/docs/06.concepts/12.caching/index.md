---
title: "Caching in Kestra: Speed Up Repeated Tasks"
h1: Speed Up Your Workflows with File Caching
description: Speed up repeated tasks with file caching in Kestra. Use the WorkingDirectory task to cache dependencies and skip redundant downloads across flow executions.
sidebarTitle: Caching
icon: /src/contents/docs/icons/concepts.svg
---

Kestra supports two complementary caching strategies: file caching via `WorkingDirectory` and output caching via `taskCache`.

- **File caching** stores files (dependencies, build artifacts) in internal storage and restores them at the start of the next run.
- **Output caching** stores a task's status and outputs in the database and skips re-execution entirely when inputs have not changed. See [Task Cache](../../05.workflow-components/task-cache/index.md).

## Cache files in a `WorkingDirectory` task

Add a `cache` block to a `WorkingDirectory` task to persist files across executions.

```yaml
id: caching_files
namespace: company.team

tasks:
  - id: working_dir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    cache:
      patterns:
        - some_directory/**
      ttl: PT1H
```

The `cache` property accepts a list of glob `patterns` and a `ttl` duration after which the cached files are invalidated.

### How caching works

Kestra packages the matched files and stores them in internal storage at the end of each run. On the next run, those files are restored before any task executes.

### Runner compatibility

File caching works when the script runs in a `PROCESS` runner. If you use a `DOCKER` runner, Kestra cannot cache files that exist only inside the container — attempting to do so [throws an error](https://github.com/kestra-io/kestra/issues/2233): `Unable to execute WorkingDirectory post actions`.

To cache pip packages with a Docker runner, install into a subdirectory of the working directory using `--cache-dir` and cache that directory instead:

```yaml
id: python_cached_pip
namespace: company.team

tasks:
  - id: working_dir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    cache:
      patterns:
        - cache/pip/**
      ttl: PT24H
    tasks:
      - id: python_script
        type: io.kestra.plugin.scripts.python.Script
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        beforeCommands:
          - pip install --cache-dir cache/pip pandas
        script: |
          import pandas as pd
          print(pd.__version__)
```

Because `cache/pip` lives inside the working directory (not inside the container), Kestra can read and restore it between runs.

### Node.js example

This flow installs the `colors` package and caches `node_modules` for one hour. Use a `PROCESS` runner when caching `node_modules` directly.

```yaml
id: node_cached_dependencies
namespace: company.team

tasks:
  - id: working_dir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    cache:
      patterns:
        - node_modules/**
      ttl: PT1H
    tasks:
    - id: node_script
      type: io.kestra.plugin.scripts.node.Script
      beforeCommands:
        - npm install colors
      script: |
        const colors = require("colors");
        console.log(colors.red("Hello"));
```

### Python example (Process runner)

This flow installs `pandas` into a `deps` folder and caches it for one day.

```yaml
id: python_cached_dependencies
namespace: company.team

tasks:
  - id: working_dir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: python_script
        type: io.kestra.plugin.scripts.python.Script
        taskRunner:
          type: io.kestra.plugin.core.runner.Process
        beforeCommands:
          - pip install --target=./deps pandas
        env:
          PYTHONPATH: "./deps"
        script: |
          import pandas as pd
          print(pd.__version__)
    cache:
      patterns:
        - deps/**
      ttl: PT24H
```

### How to invalidate the cache

- After the first run, files are cached.
- On subsequent runs, if the `ttl` has not elapsed, the cached files are restored. If it has elapsed, the cache is cleared and `beforeCommands` (e.g. `npm install`) runs in full.
- Changing the `ttl` takes effect on the next run.

The `ttl` is evaluated at runtime against the last task execution date.
