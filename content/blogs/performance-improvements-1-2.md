---
title: "Performance Upgrades for Enterprise in Kestra 1.2"
description: "TODO"
date: 2026-01-20T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: TODO
---

In [Kestra 1.1](https://kestra.io/blogs/performance-improvements-1-1), TODO...

## Paralll loading for namespace files

In this release, [FourFriend](https://github.com/FourFriends) contributed a significant optimization to how Kestra downloads namespace files when using them inside script tasks.

Previously, Kestra would download each namespace file sequentially before running the task.

Now, Kestra uses a parallel download strategy to download all namespace files in parallel using 4 times the number of available cores with a minimum of 32.
To avoid overloading the network, this limit is for the whole instance, and a single task can only use half that limit. This balances single task performance with overall global instance performance.

Preliminary tests showed a 8x to 32x performance improvement depending on the number of available cores.

Check out [PR #13375](https://github.com/kestra-io/kestra/pull/13375) for more details.

## ForEach with concurrency performance improvements

Our JDBC backend handles execution messages concurrently to optimize throughput.
This optimization is important, but when there are multiple execution messages for the same executions, this can create contention on the database as each execution message will lock the execution row on the database to avoid race conditions.
This only impacts executions with parallel branches like when using the `Parallel` or `ForEach` task with a `concurrencyLimit` greater than 1.

In Kestra 1.2, we mitigate this contention by grouping execution messages by execution id and executing the groups concurrently instead of the individual messages.

Preliminary tests showed a 2x performance improvement in an execution with 100 `ForEach` iterations with unlimited concurrency.

Check out [PR #13215](https://github.com/kestra-io/kestra/pull/13215) for more details.

## Conclusion

TODO

:::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
:::
