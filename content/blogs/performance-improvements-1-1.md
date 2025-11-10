---
title: "Kestra 1.1: TODO"
description: "How we continue to improve Kestra’s performance and scalability in the 1.1 release series."
date: 2025-11-13T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: TODO
---

TODO summarize 1.0 and add a link to the blog post.

TODO summarize this blog post.

## MySQL query improvements with the help of Xiaomi

[Lw-Yang](https://github.com/lw-yang) from Xiaomi contributed significant improvements to our MySQL queries on the `executions` table.

In Kestra, we use soft delete for most of the tables by having a boolean `deleted`column.
When we list a table, we filter out the deleted records by adding a `WHERE deleted = false` clause, but when we allow listing deleted records, we previously didn't add any clause.
In MySQL, this resulted in a full table scan, as all our indexes start with the `deleted` column and MySQL optimizer mandates that the leftmost columns of the index are used in the query.

By adding a `WHERE deleted in (true, false)` clause, we can avoid the full table scan and use the index.

At Xiaomi's scale (>2m records in the `executions` table), this shows a drastic reduction in query execution time on the `executions` table from 63s to 8 milliseconds!

This should optimize other tables queries as well.
Rapid tests on PotgreSQL show also small improvements even if the index was used before as PostgreSQL optimizer is more permissive than MySQL.

Check out [PR #12181](https://github.com/kestra-io/kestra/pull/12181) for more details.

## Purge task improvements

The `PurgeExecutions` task allow purging executions from the database including their related logs, metrics, and files.
To do so, it first lists all executions to purge, then deletes one by one their related logs, metrics, and files, and finally deletes the executions.

When there are a lot of executions to purge, this can take a long time as we delete one by one related resources.

The task has been updated to use bulk delete for logs and metrics, achieving a speedup of 2.5x on average.

Check out [PR #11685](https://github.com/kestra-io/kestra/pull/11685) for more details.

## Conclusion

TODO

Stay tuned—there’s more to come as we keep pushing performance, resiliency, and scalability forward.

:::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
:::
