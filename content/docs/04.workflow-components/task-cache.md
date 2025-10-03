---
title: Task Cache
icon: /docs/icons/flow.svg
version: "0.24.0"
---

Cache the status and outputs of computationally expensive operations.

## Overview

The `taskCache` property stores a task’s status and outputs in Kestra’s database. When the same execution runs again with identical inputs, Kestra skips the task and reuses the cached outputs. You can enable caching on any task, but it is most effective for heavy operations such as large data extractions or long-running scripts.

Using task caching can significantly speed up workflows and reduce resource consumption.

:::alert{type="info"}
Task caching is only supported for [Runnable Tasks](./01.tasks/01.runnable-tasks.md).
:::

## `taskCache` syntax

The syntax of the `taskCache` property is as follows:

```yaml
taskCache:
  enabled: true
  ttl: PT1H # Duration in ISO 8601 format, e.g., PT1H for 1 hour
```

The `ttl` (time-to-live) property defines how long cached outputs are kept before expiring. Use any ISO 8601 duration (e.g., `PT1H` for 1 hour, `PT24H` for 1 day, or `P7D` for 7 days).

## `taskCache` example

In the example below, the flow caches the outputs of a computationally expensive task, extracting a large dataset from a production database. This flow downloads product data once per day, caches it for 24 hours, and reuses it in joins with frequently updated transaction data.

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
