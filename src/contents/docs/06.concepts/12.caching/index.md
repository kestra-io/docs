---
title: "Caching in Kestra: Speed Up Repeated Tasks"
h1: Speed Up Your Workflows with File Caching
description: Speed up repeated tasks with file caching in Kestra. Use the WorkingDirectory task to cache dependencies and skip redundant downloads across flow executions.
sidebarTitle: Caching
icon: /src/contents/docs/icons/concepts.svg
---

Kestra can cache files between executions using the `WorkingDirectory` task — useful for large package dependencies that don't change often.

## Cache files in a `WorkingDirectory` task

Add a `cache` block to a `WorkingDirectory` task to cache a subset of files across executions.

:::alert{type="info"}
Kestra can only cache files installed or created as part of the script tasks if the script uses a `PROCESS` runner. If the script uses a `DOCKER` runner, the files will not be cached and the `WorkingDirectory` task will [throw an error](https://github.com/kestra-io/kestra/issues/2233): `Unable to execute WorkingDirectory post actions`.
:::

### Use cases for file caching

Cache `node_modules` or a Python `venv` folder to avoid reinstalling dependencies on each run. The `cache` property accepts a list of glob `patterns` and a `ttl` duration after which the cache is invalidated.

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

### How caching works

Kestra packages the cached files and stores them in internal storage. On the next run, those files are retrieved and used to initialize the working directory before the task executes.

### Node.js example

This flow installs the `colors` package before running a Node.js script and caches `node_modules` for one hour.

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

### Python example

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

- After the first run, the files are cached.
- On subsequent runs, if the `ttl` has not elapsed, the cached files are restored. If the `ttl` has elapsed, the cache is cleared and `beforeCommands` (e.g. `npm install`) runs in full.
- Changing the `ttl` takes effect on the next run: a longer value extends the cache lifetime; a shorter value may cause the cache to expire sooner.

The `ttl` is evaluated at runtime against the last task execution date.
