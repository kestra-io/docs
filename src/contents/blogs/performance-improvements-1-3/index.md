---
title: "Performance Upgrades for Enterprise in Kestra 1.3"
description: "Kestra 1.3 TODO"
date: 2026-01-19T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: ./main.jpg-TODO
---

In [Kestra 1.2](../performance-improvements-1-2/index.md), we continued our ongoing effort to make Kestra faster and more scalable with large namespaces and highly parallel workflows. This release focuses on TODO.

## MySQL query performance improvements on the `flows` table

The `flows` table which contains one record for each flow revision, has a `deleted` column for soft-deleting flows which is part of the indices on the table.

In MySQL, an index is only used if the leftmost columns of the index are part of the query filters.
Some queries on this table, however, were missing the `deleted` column, which resulted in full table scans and poor performance when the number of flow revisions was high.

This has now been fixed by systematically adding the `deleted` column to all queries on the `flows` table even when we want both deleted and non-deleted flows. This allows MySQL to use the indices and significantly improves query performance.

More details are available in [PR #14404](https://github.com/kestra-io/kestra/pull/14404) contributed by [bluesecret](https://github.com/bluesecret).

## Flow trigger processing improvements

When an execution is terminated, we process all triggers of type `io.kestra.plugin.core.trigger.Flow` to trigger downstream flows.

This is a costly operation if there are a lot of flow triggers to process. By analyzing real world profiling data from one of our customers, we discover that this operation was allocating a lot of memory.

We spent some time optimizing this operation and successfully reduced memory allocations by 50% for it.

More details are available in [PR #14185](https://github.com/kestra-io/kestra/pull/14185)

## Small internal improvements

As always, we made multiple small improvements in multiple areas of the codebase. These didn't specifically impact performance visibly for each improvement. But over time this makes kestra keep improving step by step.

In this release, one improvement was made by an external contributor: [MTarek165](https://github.com/MTarek165) which improves a specific area of our Executor a bit.

More details are available in [PR #14385](https://github.com/kestra-io/kestra/pull/14385)

## Conclusion

TODO

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
