---
title: "How We Keep Upgrading Kestra on 1.0"
description: "TODO"
date: 2025-09-15T17:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: TODO
---

In 0.24, the engineering team focused on performance in multiple areas. You can find the details in this blog post: [Optimizing Performance in Kestra in Version 0.24](https://kestra.io/blogs/performance-improvements-0.24.md).

TODO

## MySQL query improvements with the help of Xiaomi

[??? I asked for his name](https://github.com/thyw1) from Xiaomi contributed significant improvements to our MySQL list queries

For all MySQL queries that list table records, we used the `SQL_CALC_FOUND_ROWS` hint to return the number of queried rows using the `FOUND_ROWS()` function and avoid a separate `select count(*)` query.
MySQL deprecated this hint and the function and advises to use a separate `select count(*)` query.

At Xiaomi's scale (>100k records in tables), this shows a drastic reduction in query execution time from 30s to a few hundred milliseconds!

Check out the [PR #10765](https://github.com/kestra-io/kestra/pull/10765) for more details.


## Increase the number of threads used by the Kestra worker.

In versions 0.22, 0.23, and 0.24, we significantly improved the JDBC executor by parallelizing queue processing and tuning the number of threads used.

Now, with a much more powerful executor, we discovered that the default number of threads used by the worker, 4x the number of available cores, was not ideal, so we increased it to 8x the number of available cores.

In a controlled benchmark, performance improved as follows:

| Throughput (exec/mn) | Latency in 0.24 | Latency in 1.0 | Improvement |
|----------------------|-----------------|----------------|-------------|
| 1000                 | 284ms           | 246ms          | 14% faster  |
| 1500                 | 279ms           | 265ms          | 9% faster   |
| 2000                 | 307ms           | 336ms          | 9% slower*  |
| 2500                 | 1.5s            | 635ms          | 58% faster  |
| 3000                 | 30s             | 13s            | 57% faster  |

\* This is more probably a benchmark artifact, but I didn't rerun it

This improvement clearly reduces tail latency; however, what is more interesting is using a `io.kestra.plugin.core.flow.Sleep` task to emulate a long-running task.

In a benchmark with a single `Sleep` task of 5s, performance improved as follows:

| Throughput (exec/mn) | Latency in 0.24 | Latency in 1.0 | Improvement |
|----------------------|-----------------|----------------|-------------|
| 500                  | 5.1ms           | 5.1ms          | same        |
| 1000                 | 13s             | 5.1s           | 62% faster  |
| 1500                 | N/A             | 5.1s           | N/A         |
| 2000                 | N/A             | 13s            | N/A         |

Performance didn't improve at low throughput, but we can see that Kestra can now sustain 2x more executions with long-running tasks.

Check out the [PR #10559]https://github.com/kestra-io/kestra/pull/10559) for more details.


## Conclusion

TODO

Stay tuned—there’s more to come as the focus on performance, resiliency, and scalability continues.

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
