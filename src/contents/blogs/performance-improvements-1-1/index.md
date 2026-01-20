---
title: "Performance Upgrades for Enterprise in Kestra 1.1"
description: "Key performance wins in Kestra 1.1, from query efficiency to faster purge operations."
date: 2025-11-13T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: ./main.png
---

In [Kestra 1.0](../performance-improvements-1-0), our team delivered major performance boosts, from optimizing MySQL queries to scaling up worker thread counts and fine-tuning Kafka Streams. Those changes yielded up to 99% faster queries and better throughput in production workloads. Version 1.1 continues that momentum with targeted enhancements aimed at enterprise-scale deployments. We focused on two key areas that matter as your Kestra usage grows: smarter MySQL query planning (so dashboards and APIs stay responsive under heavy data) and a faster purge pipeline (so routine maintenance and cleanup won’t slow you down/index.md).

## MySQL query improvements with the help of Xiaomi

In this release, [Lw-Yang](https://github.com/lw-yang) from **Xiaomi** contributed a significant optimization to how Kestra queries MySQL on the `executions` table.

Kestra uses **soft deletes** a boolean `deleted` column marks an execution as removed without physically deleting it. Almost all queries include `WHERE deleted = false` to fetch only active (non-deleted) executions. In fact, our indexes on the executions table are **composite indexes** that **all begin with the `deleted` flag**, to efficiently separate active vs. deleted records. However, we discovered a corner-case: when the API allowed listing *both* deleted and non-deleted executions (for admin or debugging purposes), the query omitted the `deleted` filter entirely. This seemingly harmless omission had drastic effects on **MySQL’s query planner**.

**Why did performance nosedive?** Because the query provided no condition on the first column of those composite indexes (`deleted`), MySQL could not effectively use any index and **fell back to a full table scan**. In MySQL (and many databases), the **“left-prefix” index rule** says that if a query doesn’t constrain the leftmost column of a composite index, the index cannot be used efficiently. In our case, skipping the `deleted` condition meant MySQL had to scan every row in the `executions` table, which is extremely slow when the table holds millions of records.

**The fix** was simple: even when we want *all* records (both deleted and not), **explicitly include the `deleted` filter anyway**. By adding a clause `WHERE deleted IN (true, false)`, we ensure the query still references the `deleted` column, effectively a no-op filter that covers both values, but it keeps the optimizer **aligned with the index’s leading column**. This little hint prevents MySQL from dropping into a full scan and instead allows it to use the index as intended. In practice, it turned an unbounded search into an index-range scan, eliminating the performance issue.

The impact of this change is enormous. At Xiaomi’s scale (with over **2 million** execution records), a representative query that previously took **63 seconds** now completes in about **8 milliseconds**: literally **thousands of times faster**! This improvement makes Kestra’s **executions dashboard** and related API endpoints *feel instantaneous*, whereas before they could time out or stall under heavy data loads. It’s a testament to how a one-line change guided MySQL’s planner to do the right thing.

:::alert{type="info"}
Huge thanks to **lw-yang** and the Xiaomi team for identifying and contributing this fix. It’s a perfect example of open-source collaboration helping Kestra run better at scale! For more technical details on this change, check out [PR #12181](https://github.com/kestra-io/kestra/pull/12181).
:::

## Purge task improvements

The `PurgeExecutions` task removes executions plus their logs, metrics, and files. Previously it followed a linear process—list executions to purge, delete each execution’s artifacts one by one, then delete the executions themselves—which dragged at high volume.

Now the task uses bulk deletes for logs and metrics before removing executions, cutting purge time by roughly 2.5x on average and dramatically reducing maintenance windows.

Check out [PR #11685](https://github.com/kestra-io/kestra/pull/11685) for more details.

The **PurgeExecutions** task is Kestra’s built-in way to clean up old execution records and their associated data (logs, metrics, and any stored files). In large-scale deployments, purging old data is essential for controlling database size and storage costs. However, in earlier versions, the purge task could become a performance bottleneck itself. We’ve overhauled the purge pipeline in 1.1 to make it **roughly 2.5× faster** on average, dramatically shortening maintenance windows for cleanup.

**Previous (slower) purge process:** The purge task used to operate in a *linear, iterative* fashion. It would first query the database for executions eligible for deletion (e.g. older than a retention cutoff), then **for each execution** in that list it would do the following sequentially:

1. Delete the execution’s log entries from the `logs` table (one execution at a time).
2. Delete the execution’s metrics from the `metrics` table.
3. Delete any output files or stored artifacts for that execution from internal storage.
4. Finally, delete the execution record itself from the `executions` table.

This one-by-one approach meant if you had, say, 10,000 executions to purge, the task would execute tens of thousands of individual delete operations (and transactions) in the database, plus file deletions a **huge overhead**. The database and Kestra engine spent a lot of time in round-trip calls and committing small transactions. In practice, large purges could run for a very long time and consume significant CPU/IO, during which your system might experience slowdowns. The approach simply didn’t scale well.

**New (faster) purge process:** In Kestra 1.1, we redesigned PurgeExecutions to use *bulk deletions* and parallelism for I/O:

- The task now operates on **batches of executions** at once (configurable via a new `bulkSize` parameter, default is 100). It retrieves, for example, 100 old execution IDs in one go.
- It then issues a **single SQL `DELETE` per related table** to remove all logs and all metrics for those 100 executions in bulk. For instance, one command like `DELETE FROM logs WHERE execution_id IN (....100 IDs....);` removes all those logs at once similarly for metrics). These set-based deletes are *far* more efficient than 100 separate deletes.
- In the same batch, it deletes the 100 execution records themselves with one statement (after logs/metrics are gone). Database engines can handle set operations very efficiently, and we’ve drastically cut down the number of round trips and commits.

The result is a much leaner pipeline: instead of `O(n)` database operations for *n* executions, we perform roughly `O(n / batch_size)` operations. For example, purging 10,000 executions might go from 10k+ SQL statements down to around 100, plus 100 asynchronous file deletion tasks: a **huge reduction in overhead**. Our internal benchmarks and usage show about a **2.5× throughput increase** in purge jobs after these changes. In practical terms, a purge job that formerly took an hour might finish in under 25 minutes now, and one that ran in minutes now completes in seconds. This shrinks the window during which purge activities load the system, thereby **minimizing impact on your production workload**. Maintenance can be done more frequently and quickly, keeping Kestra’s metadata lean without lengthy slowdowns.

For a deeper dive into the implementation (and the SQL snippets used), Check out [PR #11685](https://github.com/kestra-io/kestra/pull/11685) for more details. That pull request details the batch deletion logic and configuration options introduced. Overall, this improvement was driven by feedback from enterprise users with large volumes of data, and we’re happy to deliver a solution that makes purging efficient at any scale.


## Conclusion

Kestra 1.1’s performance improvements reinforce our commitment to **scalability and reliability** for even the largest deployments. By tackling specific pain points: query planning on massive tables and high-volume purge operations, we ensure that Kestra remains **fast and responsive** as usage grows. These optimizations mean Kestra can orchestrate millions of workflows without breaking a sweat, and housekeeping tasks can keep up with minimal overhead.

We’d like to thank the community (shout-out to Xiaomi 🎉) for their contributions and feedback that helped drive these enhancements. As always, performance tuning is an ongoing effort. We have more in store for future releases, and we encourage you to **keep the feedback coming**. If you haven’t upgraded yet, we highly recommend moving to **Kestra 1.1** to take advantage of these gains. Your workflows, and your databases, will thank you!

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
