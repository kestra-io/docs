---
title: "Kestra 1.1: Faster Queries and Purge Operations"
description: "Key performance wins in Kestra 1.1, from query efficiency to faster purge operations."
date: 2025-11-13T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: /blogs/kestra-performance-1-1.png
---

In [Kestra 1.0](https://kestra.io/blogs/performance-improvements-1-0), we optimized MySQL queries, scaled worker threads, and fine-tuned Kafka Streams. Version 1.1 continues that momentum with upgrades that matter most at enterprise scale: better MySQL query planning so dashboards stay responsive and a faster purge pipeline so routine maintenance doesn’t slow you down.

## MySQL query improvements with the help of Xiaomi

[Lw-Yang](https://github.com/lw-yang) from Xiaomi contributed significant improvements to our MySQL queries on the `executions` table.

Kestra relies on soft deletes via a boolean `deleted` column. We normally filter with `WHERE deleted = false`, but when the API allowed listing both deleted and non-deleted rows we omitted the clause. Because every relevant index begins with `deleted`, MySQL fell back to full table scans.

Adding `WHERE deleted IN (true, false)` keeps the optimizer aligned with the index definition and prevents the scan altogether.

At Xiaomi's scale (>2M records in the `executions` table), query execution time dropped from 63 seconds to 8 milliseconds!

Other table listings benefit as well. Rapid tests on PostgreSQL show smaller gains because its optimizer already used the index, but the change still helps.

Check out [PR #12181](https://github.com/kestra-io/kestra/pull/12181) for more details.

## Purge task improvements

The `PurgeExecutions` task removes executions plus their logs, metrics, and files. Previously it followed a linear process—list executions to purge, delete each execution’s artifacts one by one, then delete the executions themselves—which dragged at high volume.

Now the task uses bulk deletes for logs and metrics before removing executions, cutting purge time by roughly 2.5x on average and dramatically reducing maintenance windows.

Check out [PR #11685](https://github.com/kestra-io/kestra/pull/11685) for more details.

## Conclusion

Kestra 1.1 builds on the gains from 1.0 with targeted optimizations that matter at scale. The MySQL improvements contributed by Xiaomi eliminate costly scans, the `PurgeExecutions` task completes faster, and these changes benefit both open-source and Enterprise deployments.

Stay tuned—there’s more to come as we keep pushing performance, resiliency, and scalability forward.

:::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
:::
