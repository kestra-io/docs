---
title: "Kestra 1.0: Achieving 99% Faster Queries and Massive Scale With Xiaomi"
description: "How we continue to improve Kestra’s performance and scalability in the 1.0 release series."
date: 2025-09-18T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: ./main.jpg
---

In 0.24, the engineering team focused on performance in multiple areas. You can find the details in this blog post: [Optimizing Performance in Kestra in Version 0.24](../performance-improvements-0-24/index.md)

With 1.0, we’ve continued that momentum by optimizing MySQL queries, scaling worker threads, and improving Kafka Streams. These changes bring faster execution times, reduced latency, and higher throughput across both open-source and Enterprise deployments.

## MySQL query improvements with the help of Xiaomi

[Li Zi](https://github.com/thyw1) from Xiaomi contributed significant improvements to our MySQL list queries.

For all MySQL queries that list table records, we used the `SQL_CALC_FOUND_ROWS` hint to return the number of queried rows using the `FOUND_ROWS()` function and avoid a separate `select count(*)` query.
MySQL deprecated this hint and the function and advises to use a separate `select count(*)` query.

At Xiaomi's scale (>100k records in tables), this shows a drastic reduction in query execution time from 30s to a few hundred milliseconds!

Check out [PR #10765](https://github.com/kestra-io/kestra/pull/10765) for more details.

## Increase the number of threads used by the Kestra worker

In versions 0.22, 0.23, and 0.24, we significantly improved the JDBC executor by parallelizing queue processing and tuning the number of threads used.

Now, with a much more powerful executor, we discovered that the default number of threads used by the worker (4x the number of available cores) was not ideal. We increased it to 8x the number of available cores.

In a controlled benchmark, performance improved as follows:

| Throughput (exec/mn) | Latency in 0.24 | Latency in 1.0 | Improvement |
|----------------------|-----------------|----------------|-------------|
| 1000                 | 284ms           | 246ms          | 14% faster  |
| 1500                 | 279ms           | 265ms          | 9% faster   |
| 2000                 | 307ms           | 336ms          | 9% slower*  |
| 2500                 | 1.5s            | 635ms          | 58% faster  |
| 3000                 | 30s             | 13s            | 57% faster  |

This change clearly reduces tail latency. More interestingly, using a `io.kestra.plugin.core.flow.Sleep` task to emulate a long-running task shows how performance scales at higher throughput.

In a benchmark with a single `Sleep` task of 5s, performance improved as follows:

| Throughput (exec/mn) | Latency in 0.24 | Latency in 1.0 | Improvement |
|----------------------|-----------------|----------------|-------------|
| 500                  | 5.1ms           | 5.1ms          | same        |
| 1000                 | 13s             | 5.1s           | 62% faster  |
| 1500                 | N/A             | 5.1s           | N/A         |
| 2000                 | N/A             | 13s            | N/A         |

Performance didn’t improve at low throughput, but Kestra can now sustain twice as many executions with long-running tasks.

Check out [PR #10559](https://github.com/kestra-io/kestra/pull/10559) for more details.

## Increase the number of threads used by Kafka Stream (EE)

In previous releases, we focused heavily on JDBC performance. Now we’ve extended improvements to the Kafka backend (Enterprise Edition).

By default, Kafka Stream uses a single thread to process tasks, which can underutilize resources. Since the Kafka Kestra Executor is a complex Kafka Stream, it can benefit significantly from concurrency.

We now configure the number of Kafka Stream threads (`num.stream.threads`) to match the number of available CPU cores by default. This can be fine-tuned with the configuration property `kestra.kafka.executor.stream-threads`, where `0` means “use all available cores.”

On our regular benchmark (a simple flow with two tasks), performance improved as follows:

| Throughput (exec/mn) | Latency in 0.24 | Latency in 1.0 | Improvement |
|----------------------|-----------------|---------------|-------------|
| 1000                 | 300ms           | 270ms         | 10% faster  |
| 1500                 | 360ms           | 280ms         | 23% faster  |
| 2000                 | 490ms           | 300ms         | 39% faster  |
| 2500                 | 9s              | 350ms         | 96% faster  |
| 3000                 | N/A             | 390ms         | —           |
| 3500                 | N/A             | 900ms         | —           |
| 4000                 | N/A             | 640ms         | —           |
| 4500                 | N/A             | 4s            | —           |

This improvement significantly reduces latency, especially at high throughput. The maximum supported throughput doubled from 2000 executions per minute in 0.24 to up to 4000 in 1.0!

:::alert{type="info"}
This improvement is only available starting with 1.0.1, as more testing was required before release.
:::

## Conclusion

With Kestra 1.0, we continue to raise the bar on performance and scalability. Contributions from the community and our internal tuning have led to major gains across MySQL, worker threads, and Kafka Streams. These improvements reduce latency, increase throughput, and help Kestra scale smoothly as workloads grow.

Stay tuned—there’s more to come as we keep pushing performance, resiliency, and scalability forward.

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
