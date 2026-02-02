---
title: "How We Keep Upgrading Kestra Before 1.0"
description: "Once again, we boosted performances with faster scheduling, improved JDBC queues, and nearly 2x execution throughput."
date: 2025-09-03T17:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: ./main.png
---

In 0.23, the engineering team focused on performance in multiple areas. You can find the details in this blog post: [Optimizing Performance in Kestra in Version 0.23](../performance-improvements-0-23/index.md).

Today, we delivers even more substantial speed, efficiency, and system responsiveness enhancements.

## Scheduler improvements with the help of Xiaomi

[Wei Bo](https://github.com/gluttonweb) from Xiaomi contributed significant improvements to the Scheduler startup that apply to both the JDBC and Kafka runners.

When starting, the Scheduler loads all flows and triggers, then tries to find the corresponding trigger for each flow and update its state if needed. We previously iterated over the list of triggers for each flow, which was counterproductive.

On a benchmark with 100,000 flows and triggers, Xiaomi found that this stage of the Scheduler startup took 20 minutes, delaying the time when the Scheduler could process triggers. After discussing possible optimizations with our engineering team, a solution was found: to use a local cache of the triggers in a map to retrieve them by identifier.

The aforementioned change decreases the Scheduler's startup time using 100,000 flows and triggers from 20 minutes to 8 seconds! For more details, refer to the [PR #10424](https://github.com/kestra-io/kestra/pull/10424).

Then, our engineering team found the same kind of improvements for a step done in the scheduler's evaluation loop, decreasing the time taken for this step with 1,000 flows and triggers (we usually didn't benchmark at Xiaomi's scale) from 120 milliseconds to 30 milliseconds. This step is only a small step in the evaluation loop but one small step in optimizing it. Check out the [PR #10457](https://github.com/kestra-io/kestra/pull/10457) for more details.


## Improve JDBC queues

Our JDBC queue has a polling mechanism that periodically checks for messages inside the `queues` table for processing. When the poll query returns results, it processes them and then waits for some time to redo the poll query (minimum poll period).

We now re-do the poll query immediately in case the poll query returns results, which allows better processing capability when the executor is under high load and reduces execution latency.

For more information, refer to the [PR #9332](https://github.com/kestra-io/kestra/pull/9332).

## Increase the number of threads used by the Kestra executor.

In version 0.22, the Kestra executor parallelized JDBC backend queue processing, delivering significant performance improvements. However, this comes with increased memory usage and higher load on the database.

In version 0.23, the approach to parallelizing JDBC backend queue processing was changed. Instead of running multiple parallel database queries, Kestra now makes a single query and processes the results in parallel. See [PR #8648](https://github.com/kestra-io/kestra/pull/8648).

The default configuration for the number of threads used by the JDBC scheduler was also updated—from half the available CPU count to the full CPU count—allowing the executor to make better use of available resources.

Combined with the earlier improvement that re-polls immediately when a poll query returns results, these changes deliver an overall performance gain of nearly 2x.

In a controlled benchmark, performance improved as follows:

| Throughput (exec/s) | Latency in 0.23 | Latency in 0.24 | Improvement |
|--------------------|-----------------|-----------------|-------------|
| 10               | 300ms           | 150ms           | 50% faster  |
| 25               | 550ms           | 300ms           | 45% faster  |
| 50               | 17s             | 6s              | 65% faster  |

## Conclusion

We delivers major performance and scalability improvements, largely thanks to the Xiaomi Engineering team. Their production-scale usage, in-depth diagnostics, and targeted contributions—such as the scheduler enhancements—continue to shape the evolution of Kestra.

Stay tuned—there’s more to come as the focus on performance, resiliency, and scalability continues.

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
