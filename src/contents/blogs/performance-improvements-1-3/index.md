---
title: "Performance Upgrades for Enterprise in Kestra 1.3"
description: "Kestra 1.3 improves MySQL query efficiency, reduces memory usage in flow trigger processing, and delivers smaller execution-path optimizations."
date: 2026-01-19T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: ./main.jpg
---

In [Kestra 1.2](../performance-improvements-1-2/index.md), we continued our work to make Kestra faster and more scalable for large namespaces and highly parallel workflows. With Kestra 1.3, we focused on a different set of hot paths: improving MySQL query efficiency on the `flows` table, reducing memory usage during flow trigger processing, and refining internal execution paths.

## MySQL query performance improvements on the `flows` table

The `flows` table stores one record for each flow revision. It includes a `deleted` column used for soft deletes, and that column is part of the table indexes.

In MySQL, an index can only be used efficiently when the query filters include its leftmost columns. Some queries on this table were missing the `deleted` column, which led to full table scans and poor performance when the number of flow revisions grew.

We fixed this by systematically including the `deleted` column in all queries on the `flows` table, even when retrieving both deleted and non-deleted flows. This keeps MySQL aligned with the index definition and significantly improves query performance.

For more details, see [PR #14404](https://github.com/kestra-io/kestra/pull/14404), contributed by [bluesecret](https://github.com/bluesecret).

## Flow trigger processing improvements

When an execution is terminated, we process all triggers of type `io.kestra.plugin.core.trigger.Flow` to trigger downstream flows.

This can become costly when many flow triggers must be evaluated. By analyzing real-world profiling data from one of our customers, we discovered that this operation was allocating too much memory.

We optimized this code path and reduced memory allocations for this operation by 50%.

More details are available in [PR #14185](https://github.com/kestra-io/kestra/pull/14185).

## Small internal improvements

As always, we also made several smaller improvements across the codebase. Each change on its own may not be highly visible, but together they steadily improve Kestra’s overall efficiency.

In this release, one of those improvements came from [MTarek165](https://github.com/MTarek165), who contributed an optimization to a specific part of the Executor.

For more details, see [PR #14385](https://github.com/kestra-io/kestra/pull/14385).

## Conclusion

Kestra 1.3 continues our work on the low-level optimizations that matter at scale. By improving query planning on the `flows` table, reducing memory pressure in trigger processing, and refining internal execution paths, this release helps Kestra stay responsive as workloads and metadata volumes grow.

These changes may look incremental, but that is how long-term performance work compounds: one bottleneck, one code path, and one release at a time.

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
