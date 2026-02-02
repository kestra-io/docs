---
title: "Performance Upgrades for Enterprise in Kestra 1.2"
description: "Kestra 1.2 reduce execution latency and database contention with parallel file loading and smarter concurrency handling"
date: 2026-01-19T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: ./main.jpg
---

In [Kestra 1.1](../performance-improvements-1-1/index.md), we continued our ongoing effort to make Kestra faster and more scalable under large workloads. This release focuses on reducing execution overhead in common scenarios, especially when working with large namespaces and highly parallel workflows.

## Parallel loading for namespace files

In Kestra 1.1, [FourFriend](https://github.com/FourFriends) contributed a significant optimization to how Kestra downloads namespace files when they are used in script tasks.

Previously, Kestra downloaded each namespace file sequentially before starting the task execution. For workflows with many files, this could introduce noticeable startup latency.

Kestra now uses a **parallel download strategy**, downloading all namespace files concurrently using **4× the number of available CPU cores**, with a minimum of **32 parallel downloads**. To avoid saturating the network, this limit is enforced at the **instance level**, and a single task can use at most **half of the global limit**. This approach balances fast task startup with predictable, stable performance across the entire instance.

Preliminary benchmarks show **8× to 32× faster startup times**, depending on the number of available cores and files.

For implementation details, see [PR #13375](https://github.com/kestra-io/kestra/pull/13375).

## ForEach concurrency performance improvements

Kestra’s JDBC backend processes execution messages concurrently to maximize throughput. While this is essential for performance, it can lead to contention when many execution messages target the **same execution**, as each message must lock the execution row to prevent race conditions.

This behavior primarily affects workflows with parallel branches, such as `Parallel` or `ForEach` tasks using a `concurrencyLimit` greater than 1.

In Kestra 1.2, we significantly reduce this contention by **grouping execution messages by execution ID** and executing those groups concurrently, rather than processing each message independently. This minimizes database locking while preserving correctness.

Preliminary tests demonstrate a **2× performance improvement** on workflows with 100 `ForEach` iterations running with unlimited concurrency.

More details are available in [PR #13215](https://github.com/kestra-io/kestra/pull/13215).

## Conclusion

These improvements may seem low-level, but they directly impact day-to-day user experience: faster task startup, better scalability under concurrency, and more predictable performance as workloads grow.

By continuing to optimize critical execution paths—from file loading to database coordination—Kestra scales more efficiently without requiring workflow changes. Whether you’re running a handful of scripts or orchestrating thousands of parallel tasks, each release brings tangible performance gains where they matter most.

And we’re not done yet—performance remains a core focus as we push Kestra further toward large-scale orchestration.

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
