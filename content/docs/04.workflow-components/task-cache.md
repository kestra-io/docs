---
title: Task Cache
icon: /docs/icons/flow.svg
version: "0.24.0"
---

Cache the status and outputs of computationally expensive operations.

## Overview

The `taskCache` core property caches a task's status and outputs in your Kestra instance's database. With the status and outputs cached, rerunning the same execution with the same inputs will skip the task and return the cached outputs instead. This can be added to any task but is particularly useful for computationally expensive operations such as extensive data extractions or long-running script tasks.

Using task caching can significantly speed up workflows and reduce resource consumption.

::alert{type="info"}
Task caches are only usable for [Runnable Tasks](01.tasks/01.runnable-tasks.md).
::

## `taskcache` syntax

The syntax of the `taskCache` property is as follows:

```yaml
taskCache:
  enabled: true
  ttl: PT1H # Duration in ISO 8601 format, e.g., PT1H for 1 hour
```

The `ttl` (time-to-live) property defines how long cached outputs are retained before being purged. Use any ISO 8601 duration, such as `PT1H` (1 hour), `PT24H` (24 hours), or `P7D`(7 days).

## `taskCache` example

In the example below, the flow caches the outputs of a computationally expensive task, extracting a large dataset from a production database. The flow downloads the infrequently-changing data only once daily, caches it for 24 hours, and then uses it in subsequent tasks to join with frequently changing transaction data.

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
