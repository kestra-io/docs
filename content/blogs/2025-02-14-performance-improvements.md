---
title: "Recent performance improvements"
description: "Kestra engineering team continuously improves the performance of the orchestrator, let's dig into recent improvements"
date: 2025-02-14T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: /blogs/TODO
---

Kestra engineering team continuously improves the performance of the orchestrator, let's dig into recent improvements made around Kestra 0.19 and 0.20 a few months ago.

## Serialization performance improvements

Data is at the heart of Kestra. To represent data, you need a format, which in Kestra is the ION format.
ION is like a richer (with more types), and slightly less verbose JSON like format, as we also support a variety of other format like JSON, CSV, Avro,... it is often necessary to transform a file in one format to another.

To do that, we have a dedicated plugin: [plugin-serdes](/plugins/plugin-serdes).

Both our default format handling, and the serialization plugin uses under the cover the same code facility, the [FileSerde](https://github.com/kestra-io/kestra/blob/develop/core/src/main/java/io/kestra/core/serializers/FileSerde.java).

The FileSerde uses the [Jackson](https://github.com/FasterXML/jackson) serialization library, it has been changed to use Jackson's `MappingIterator` and `SequenceWriter` for optimized batch serialization, this avoids creating temporary objects when serializing a batch of records and reuse some internal serialization components.

We also take the opportunity of rewritting our serialization layer to align all usage to buffering more aggressively (with a 32KB buffer).

Both changes can lead to performance improvements measured between 20% to 40%! All existing tasks have been updated to take advantage of these optimizations.

This was a joint effort between an external contributor, Yoann Vernageau from CleverConnect, and our team. We want to take the opportunity to thank him for its time and effort in improving Kestra.

More information can be found in this Pull Request: https://github.com/kestra-io/plugin-serdes/pull/105.

## PostgreSQL backend performance improvement

In our PostgreSQL backend, we intensively use JSONB support for all Kestra related internal resource representation (like flow, executions, ...).

We discovered a performance issue in the way JSONB was handled in [jOOQ](https://www.jooq.org/), the Java library we use to access the database.

We worked around the issue by changing the way we handle JSONB which improves CPU usage by 15% and memory allocation by 20% is some contrived benchmarks.

TODO: there are flamegraphs in the PR, maybe it would be worth it to add it in the blog post and explain what it is and how to get some.

More information can be found in this Pull Request: https://github.com/kestra-io/kestra/pull/4899.

We share our findings with the jOOQ team, and they implement a fix directly inside jOOQ. See this GitHub Pull Request for more information: https://github.com/jOOQ/jOOQ/issues/17497#issuecomment-2462506427.

## JDBC backend performance improvement

All our JDBC backends (H2, MySQL, PostgreSQL, SQLServer) had some performance improvements when processing queued executions (see [flow concurrency limit](/docs/workflow-components/concurrency)).

We discovered that queries to the execution queued table was missing an index! This has been fixed in the following Pull Request: https://github.com/kestra-io/kestra/pull/6050.

## Worker default number of threads

Previously, we configured the Worker with 128 threads by default in our docker-compose and Helm chart.

This provided a good performance for task executions as it allows a Worker to process as many as 128 tasks concurrently.

But most people deployed Kestra in containerized environments, with multiple Workers for redundancy and high availability. In these environments, 128 is too much and can lead to high memory usage (each thread uses a 1MB stack) and incorrect CPU utilization if the container has very few CPU count.

We reduce the default number of threads to four times the number of available CPU cores, this should be a good balance between memory utilization and task execution performance.

As it highly depends on the nature of the tasks you are running inside the Worker, if you experience low CPU utilization, you can change the number of worker threads to fit your needs via the `--threads` command line option of the Worker.

## Logs performance improvements

In our Kafka/Elasticsearch backend, logs were emitted asynchronously, but it was not the case in our JDBC backends (H2, MySQL, PostgreSQL, SQLServer).

To do so, our Kafka backend has a dedicated component: the indexer, which needed to be started independently.

We introduced a JDBC indexer so that now logs are always emitted asynchronously, this moved the insertion of logs inside the database from the emission of the logs into our internal queue, to the reception of the logs. So logs are now inserted into the database inside the indexer instead of the Executor or the Worker. We also now insert them in batches that lower the network round-trips between Kestra and the database.

This leads to an average performance improvements of 20%, and for log intensive tasks (for example, tasks that generated tens of thousands of logs) this can speed the task execution to up to 10x!

To facilitate the deployment of the indexer, we decided to automatically start an indexer from the standalone runner or the Webserver if launching Kestra with multiple components. This enhancement is also available with the kafka runner, so it is no longer mandatory to start a separate indexer when using it.

An indexer can still be started to speed up resource indexation, but our test shows that this is rarely necessary.

More information in the pull request: https://github.com/kestra-io/kestra/pull/4974.

## Logging to a file

Even with the recent performance improvements into logs handling, logging can take a faire amount of a task execution time as they need to be inserted into our internal queue to be then indexing asynchronously.

When a task emits a lot of logs, and you don't need them inside the UI but still want to be able to access them, you can log to a file by configuring tasks and triggers with `logToFile: true`. When enabled, logs will be stored inside an internal storage file, accessible from the UI, instead of inside the Kestra database.

More information in the pull request: https://github.com/kestra-io/kestra/pull/4757.

Of course, if you don't need the log, you can just avoid emitting them totally by configuring the `logLevel` of the task form de default `INFOR` level to `WARN` or `ERROR`.

## Worker performance improvements

The Worker is one of the most performance sensible components in Kestra as it processes task executions.

We try to use immutability in our code base as it allows code that is easier to reason about, and have usually better performance characteristics.

But the Worker mutate the `WorkerTask`, the message that it receives from the Executor to process a task, which lead to suboptimal code where we need to clean up temporary structures before sending a `WorkerTaskResult` message back to the Executor.

On some contrived benchmarks, this can eat up to 15% or CPU cycles of the Worker!

By refactoring the Worker to never mutate the `WorkerTask`, we can avoid temporary structures clean up and get back these CPU cycle for what matters: executing your tasks!

More information in the pull request: https://github.com/kestra-io/kestra/pull/5348.

## Conclusion

This was just some of the more impactful performance improvements I can remember working on lately, but our team is commited to enhance performance continuously. Performance is one of the topics we keep looking at and we care for it on each improvement me made to Kesra to provide one of the most performant and scalable platforms for your orchestration need.