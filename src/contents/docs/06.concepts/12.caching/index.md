---
title: "Caching in Kestra: Speed Up Repeated Tasks"
h1: Speed Up Your Workflows with File Caching
description: Speed up repeated tasks with file caching in Kestra. Use the WorkingDirectory task to cache dependencies and skip redundant downloads across flow executions.
sidebarTitle: Caching
icon: /src/contents/docs/icons/concepts.svg
---

Kestra supports two complementary caching strategies: file caching via `WorkingDirectory` and output caching via `taskCache`.

- **File caching** stores files (dependencies, build artifacts) in internal storage and restores them at the start of the next run.
- **Output caching** stores a task's status and outputs in the database and skips re-execution entirely when inputs have not changed.

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

File caching works when the script runs in a `PROCESS` runner. If you use a `DOCKER` runner, Kestra cannot cache files that exist only inside the container. Attempting to do so [throws an error](https://github.com/kestra-io/kestra/issues/2233): `Unable to execute WorkingDirectory post actions`.

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

This flow installs the `colors` package and caches `node_modules` for one hour. Caching `node_modules` directly requires the `PROCESS` runner.

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

### Cache invalidation

- After the first run, files are cached.
- On subsequent runs, if the `ttl` has not elapsed, the cached files are restored. If it has elapsed, the cache is cleared and `beforeCommands` (e.g. `npm install`) runs in full.
- Changing the `ttl` takes effect on the next run.

The `ttl` is evaluated at runtime against the last task execution date.

## Cache task outputs with `taskCache`

The `taskCache` property stores a task's status and outputs in Kestra's database. When the same execution runs again with identical inputs, Kestra skips the task and reuses the cached outputs. It is most effective for heavy operations such as large data extractions or long-running scripts.

:::alert{type="info"}
Task caching is only supported for [Runnable Tasks](../../05.workflow-components/01.tasks/01.runnable-tasks/index.md).
:::

### Syntax

```yaml
taskCache:
  enabled: true
  ttl: PT1H # Duration in ISO 8601 format, e.g., PT1H for 1 hour
```

The `ttl` property defines how long cached outputs are kept before expiring. Use any ISO 8601 duration (e.g., `PT1H` for 1 hour, `PT24H` for 1 day, or `P7D` for 7 days).

### Example

This flow downloads product data once per day, caches it for 24 hours, and reuses it in joins with frequently updated transaction data.

```yaml
id: caching
namespace: company.team

tasks:
  - id: transactions
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/resolve/main/csv/cache_demo/transactions.csv

  - id: products
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/resolve/main/csv/cache_demo/products.csv
    description: This task pulls the full product catalog once per day. Because the catalog changes infrequently and contains over 200k rows, running it only once daily avoids unnecessary strain on a production DB, while ensuring downstream joins always use up-to-date reference data.
    taskCache:
      enabled: true
      ttl: PT24H

  - id: duckdb
    type: io.kestra.plugin.jdbc.duckdb.Query
    store: true
    inputFiles:
      products.csv: "{{ outputs.products.uri }}"
      transactions.csv: "{{ outputs.transactions.uri }}"
    sql: |-
      SELECT
        t.transaction_id,
        t.timestamp,
        t.quantity,
        t.sale_price,
        p.product_name,
        p.category,
        p.cost_price,
        p.supplier_id,
        (t.sale_price - p.cost_price) * t.quantity AS profit
      FROM
        read_csv_auto('transactions.csv') AS t
      JOIN
        read_csv_auto('products.csv') AS p
      USING (product_id);
```

This approach minimizes load on the production database while ensuring transactions are always processed against up-to-date product data.
