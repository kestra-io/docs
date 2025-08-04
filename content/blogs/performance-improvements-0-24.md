---
title: "Performance Upgrades of 0.24"
description: "TODO"
date: 2025-08-12T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: /blogs/TODO.jpg
---

In 0.23, the engineering team focused on performance in multiple areas, you can find the details in this blog post [Optimizing Performance in Kestra in Version 0.23](https://kestra.io/blogs/performance-improvements-0.23.md).

This latest version delivers even more substantial enhancements in speed, efficiency, and system responsiveness.

## Scheduler improvements with the help of Xiaomi

[Wei Bo](https://github.com/gluttonweb) from Xiaomi significantly contributed a major improvements to the Scheduler startup that apply to both the JDBC and Kafka runner.

When starting, the Scheduler will load all flows and all triggers, then for each flow will try to find the corresponding trigger and update it's state of needed. We previously iterated for each flow over the list of triggers which was counter-performant.

On a benchmark with 100k flows and triggers, Xiaomi found that this stage of the Scheduler startup took 20mn, delaying the time when the Scheduler would be able to process triggers. After discussing possible optimizations with our engineering team, a solution has been found to use a local cache of the triggers in a Map to retrieve them by identifier.

The aforementioned change decreases the startup time of the Scheduler when using 100k flows and triggers from 20mn down to 8s! See [PR #10424](https://github.com/kestra-io/kestra/pull/10424).

Then, our engineering team found the same kind of improvements for a step done in the evaluation loop of the Scheduler, decreasing the time taken for this step with 1k flows and triggers (we usually didn't benchmark at the scale of Xiaomi) from 120ms to 30ms. This step is only a small step inside the evaluation loop, but it is one small step in optimizing it. See [PR #10457](https://github.com/kestra-io/kestra/pull/10457).


## Improve JDBC queues

Our JDBC queue has a polling mechanism, it periodically checks for messages inside the `queues` table for processing. When there is results from the poll query, it processes them then wait for some time to redo the poll query (minimum poll period).

We now re-do the poll query immediately in case the poll query returns results, this allows better processing capability when the executor is in high load and reduces execution latency.

See [PR #9332](https://github.com/kestra-io/kestra/pull/9332).

## Increase the number of threads used by the Kestra executor.

In 0.22, we parallelized JDBC Backend queues processing by the Kestra executor, which brings tremendous performance improvements, but with a caveat of way bigger memory usage and high load on the database.

In 0.23, we changed the way we parallelized JDBC Backend queues processing. Instead of querying the database multiple times in parallel, we made a single query but processed the query results in parallel. See [PR #8648](https://github.com/kestra-io/kestra/pull/8648)

We then change the default configuration for the number of threads used by the JDBC scheduler from half the number of available CPU count to the number of available CPU count. This provides better CPU utilization by the executor.

This change and the previous change of re-polling immediately when a poll query returns result bring an overall performance improvement of almost 2x.

On a contrived benchmark, performance improve as follows:

| Throughput (exec/s) | Latency in 0.23 | Latency in 0.24 | Improvement |
|--------------------|-----------------|-----------------|-------------|
| 10               | 300ms           | 150ms           | 50% faster  |
| 25               | 550ms           | 300ms           | 45% faster  |
| 50               | 17s             | 6s              | 65% faster  |

## Conclusion

Version 0.24 brings major upgrades in performance and scalability, thanks in no small part to the Xiaomi Engineering team. Their production-scale usage, diagnostics, and highly targeted contributions, like the scheduler improvements, continue to shape how Kestra evolves.

Stay tuned—there’s even more to come as we double down our focus on performance, resiliency, and scalability.

::alert{type="info"}
If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).
::
