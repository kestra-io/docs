---
title: "How Kestra engineers optimized orchestrator performance"
description: "Optimized performance is critical to every application, check out how Kestra engineers improved the orchestrator's performance in recent versions. "
date: 2025-02-06T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: /blogs/optimized-performance.png
---

Kestra engineers are continuously improving the performance of the orchestrator to be more resource efficient. Recently, in Kestra versions 0.19 and 0.20, we tackled performance inefficiencies in data serialization, database query indexes, log handling, and more. Let's dig into the details of the recent performance improvements.

## Serialization performance improvements

Data is at the heart of Kestra. To represent data, you need a format, which in Kestra is the ION format.
ION is like a richer (with more types) and slightly less verbose JSON-like format. We also support a variety of other format like JSON, CSV, and Avro. It is often necessary to transform a file in one format to another.

To make that transformation, we have a dedicated plugin: [plugin-serdes](/plugins/plugin-serdes).

Both our default format handling and the serialization plugin use the same code facility, [FileSerde](https://github.com/kestra-io/kestra/blob/develop/core/src/main/java/io/kestra/core/serializers/FileSerde.java), under the hood.

FileSerde uses the [Jackson](https://github.com/FasterXML/jackson) serialization library, and it has been changed to use Jackson's `MappingIterator` and `SequenceWriter` for optimized batch serialization; this avoids creating temporary objects when serializing a batch of records and reuses some internal serialization components.

We also took the opportunity to rewrite our serialization layer to align all usage to buffer more aggressively (i.e., with a 32KB buffer).

Both changes led to performance improvements measured between 20% to 40%! As a result, all existing tasks have been updated to take advantage of these optimizations.

This was a joint effort between an external contributor, Yoann Vernageau from CleverConnect, and our team. We want to take the opportunity to thank him for the time and effort given to improving Kestra.

More information can be found in this [Pull Request](https://github.com/kestra-io/plugin-serdes/pull/105).

## PostgreSQL backend performance improvement

In our PostgreSQL backend, we make extensive use of JSONB support for representing all Kestra-related internal resources, such as flows and executions.

We discovered a performance issue in the way JSONB was handled in [jOOQ](https://www.jooq.org/), the Java library we use to access the database.

We worked around the issue by changing the way we handle JSONB, improving CPU usage by 15% and memory allocation by 20% in some conducted benchmarks.

More information can be found in this [Pull Request](https://github.com/kestra-io/kestra/pull/4899).

We shared our findings with the jOOQ team, and they implemented a fix directly inside jOOQ. See this [GitHub Pull Request](https://github.com/jOOQ/jOOQ/issues/17497#issuecomment-2462506427) for more information.

## JDBC backend performance improvement

All our JDBC backends (H2, MySQL, PostgreSQL, SQLServer) had some performance improvements when processing queued executions (see [flow concurrency limit](/docs/workflow-components/concurrency)).

We discovered that queries to the execution queued table were missing an index! This has been fixed in the following [Pull Request](https://github.com/kestra-io/kestra/pull/6050).

## Worker default number of threads

Previously, we configured the Worker with 128 threads by default in our docker-compose and Helm chart.

This provided good performance for task executions, as it allows a Worker to process as many as 128 tasks concurrently.

However, most people deploy Kestra in containerized environments, with multiple Workers for redundancy and high availability. In these environments, 128 tasks is too many and can lead to high memory usage (each thread uses a 1MB stack) and incorrect CPU utilization if the container has a very low CPU count.

We reduced the default number of threads to four times the number of available CPU cores, optimizing the balance between memory utilization and task execution performance.

Performance highly depends on the nature of the tasks you are running inside the Worker. If you experience low CPU utilization, you can change the number of worker threads to fit your needs via the `--threads` command line option of the Worker.

## Logs performance improvements

Our Kafka/Elasticsearch backend emits logs asynchronously via a dedicated indexer component, which needs to be started independently. However, this was not the case for our JDBC backends (H2, MySQL, PostgreSQL, SQLServer).

We introduced a JDBC indexer so that now logs are always emitted asynchronously, this moved the insertion of logs inside the database from the emission of the logs into our internal queue, to the reception of the logs. So logs are now inserted into the database inside the indexer instead of the Executor or the Worker. We also now insert them in batches that lower the network round-trips between Kestra and the database.

This leads to an average performance improvements of 20%, and for log intensive tasks (for example, tasks that generated tens of thousands of logs) this can speed the task execution to up to 10x!

To facilitate the deployment of the indexer, we decided to automatically start an indexer from the standalone runner or the Webserver if launching Kestra with multiple components. This enhancement is also available with the kafka runner, so it is no longer mandatory to start a separate indexer when using it.

An indexer can still be started to speed up resource indexation, but our test shows that this is rarely necessary.

More information in the [Pull Request](https://github.com/kestra-io/kestra/pull/4974).

## Logging to a file

Even with recent performance improvements to log handling, logging can still take up a significant portion of task execution time, as logs must be inserted into our internal queue before being indexed asynchronously.

When a task emits many logs and you don't need them inside the UI but still want to be able to access them, you can configure tasks and triggers with `logToFile: true` to log to a file. When enabled, logs will be stored inside an internal storage file, accessible from the UI, instead of inside the Kestra database.

More information in the [Pull Request](https://github.com/kestra-io/kestra/pull/4757).

Of course, if you don't need the log, you can just avoid emitting them completely by configuring the `logLevel` of the task from the default `INFO` level to `WARN` or `ERROR`.

## Worker performance improvements

The Worker is one of the most performance-sensitive components in Kestra, as it processes task executions.

We strive to use immutability in our codebase, as it makes the code more predictable and easier to understand while usually providing better performance characteristics.

However, the Worker mutates the `WorkerTask`—the message that it receives from the Executor to process a task. This mutation leads to suboptimal code, requiring us to clean up temporary structures before sending a `WorkerTaskResult` message back to the Executor.

After some benchmark tests, we found that this can eat up to 15% of CPU cycles of the Worker!

By refactoring the Worker to never mutate the `WorkerTask`, we avoid temporary structure cleanup and recover these CPU cycles for what matters: executing your tasks!

More information in the [Pull request](https://github.com/kestra-io/kestra/pull/5348).

## Conclusion

These are just some of the most impactful performance improvements I recall working on recently, and as always, our team is committed to continuously enhancing performance. We consider and prioritize performance for each improvement we make to Kestra, ensuring it remains one of the most scalable and high-performing orchestration platforms available.