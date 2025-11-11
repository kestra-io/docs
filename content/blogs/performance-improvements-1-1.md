---
title: "Kestra 1.1: Faster Queries and Purge Operations"
description: "Key performance wins in Kestra 1.1, from query efficiency to faster purge operations."
date: 2025-11-13T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: /blogs/kestra-performance-1-1.jpg
---

In [Kestra 1.0](https://kestra.io/blogs/performance-improvements-1-0), we optimized MySQL queries, scaled worker threads, and fine-tuned Kafka Streams. Version 1.1 continues that momentum, focusing on query efficiency in large deployments and faster purge operations that keep storage tidy without impacting throughput.

## MySQL query improvements with the help of Xiaomi

[Lw-Yang](https://github.com/lw-yang) from Xiaomi contributed significant improvements to our MySQL queries on the `executions` table.

In Kestra, we use soft delete for most tables via a boolean `deleted` column. When listing tables, we filter out deleted records with `WHERE deleted = false`, but when the API allowed listing deleted records, we didn’t add any clause. In MySQL, this resulted in full table scans because all of our indexes start with `deleted` and the optimizer requires the leftmost index column to participate in the query.

By adding `WHERE deleted in (true, false)` we now keep the optimizer happy and avoid the full scan.

At Xiaomi's scale (>2M records in the `executions` table), query execution time dropped from 63 seconds to 8 milliseconds!

Other table listings benefit as well. Rapid tests on PostgreSQL show smaller gains because its optimizer already used the index, but the change still helps.

Check out [PR #12181](https://github.com/kestra-io/kestra/pull/12181) for more details.

## Purge task improvements

The `PurgeExecutions` task removes executions and their associated logs, metrics, and files. Previously, it listed executions to purge, then deleted related artifacts one by one before removing each execution. At large volume, this approach was slow.

The task now uses bulk deletes for logs and metrics, cutting purge time by roughly 2.5x on average and dramatically reducing maintenance windows.

Check out [PR #11685](https://github.com/kestra-io/kestra/pull/11685) for more details.

## Conclusion

Kestra 1.1 builds on the gains from 1.0 with targeted optimizations that matter at scale. The MySQL improvements contributed by Xiaomi eliminate costly scans, the `PurgeExecutions` task completes faster, and these changes benefit both open-source and Enterprise deployments.

Stay tuned—there’s more to come as we keep pushing performance, resiliency, and scalability forward.

:::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
:::
