---
title: "How Kestra engineers optimized orchestrator performance"
description: "Performance is a critical aspect of an orchestrator. Read how Kestra engineers improved the orchestrator's performance in recent versions."
date: 2025-02-06T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: /blogs/optimized-performance.png
---

Kestra's engineering team is continuously improving orchestrator performance to make it more resource efficient. In versions 0.19 and 0.20, they addressed inefficiencies in data serialization, database query indexes, log handling, and more. Below is an overview of these recent enhancements.

## Serialization performance improvements

Kestra relies on the ION format to represent data, which supports richer types and is slightly more verbose than JSON. It also supports other formats such as JSON, CSV, and Avro. Converting data between these formats relies on a dedicated plugin: [plugin-serdes](/plugins/plugin-serdes).

Both the default format handling and the serialization plugin use [FileSerde](https://github.com/kestra-io/kestra/blob/develop/core/src/main/java/io/kestra/core/serializers/FileSerde.java), which is powered by the [Jackson](https://github.com/FasterXML/jackson) library. We updated FileSerde to use `MappingIterator` and `SequenceWriter` for improved batch serialization, reducing temporary objects and reusing internal serialization components. We also made the serialization layer buffer data more aggressively (32KB), leading to measured performance gains between 20% and 40%.

All existing tasks now benefit from [these optimizations](https://github.com/kestra-io/plugin-serdes/pull/105) — big thanks to Yoann Vernageau from CleverConnect for working with us on this improvement.

## PostgreSQL backend performance improvement

Kestra's PostgreSQL backend extensively uses JSONB to represent internal resources. We identified a performance bottleneck in how [jOOQ](https://www.jooq.org/) handles JSONB. By modifying JSONB usage, we [improved CPU usage](https://github.com/kestra-io/kestra/pull/4899) by up to 15% and reduced memory allocation by 20% in certain benchmarks.

We shared our findings with the jOOQ team, and they have [implemented a fix](https://github.com/jOOQ/jOOQ/issues/17497#issuecomment-2462506427) in jOOQ itself.

## JDBC backend performance improvement

All JDBC backends (H2, MySQL, PostgreSQL, SQLServer) received performance boosts for queued executions (see [flow concurrency limit](/docs/workflow-components/concurrency)). The improvement came from [adding a missing index](https://github.com/kestra-io/kestra/pull/6050) on queries to the `queues` table.

## Worker default number of threads

Previously, the Worker was configured with 128 threads by default in docker-compose and Helm charts. While this allowed concurrent processing of many tasks, most deployments run multiple Workers in containerized environments, where 128 threads per Worker can be excessive and lead to high memory usage (each thread uses a 1MB stack).

We changed the default to four times the number of available CPU cores, balancing memory usage with task execution efficiency. Users can still override this setting via the `--threads` command line option if they observe low CPU utilization.

## Logs performance improvements

Our Kafka/Elasticsearch backend emits logs asynchronously through a dedicated indexer component, but JDBC backends (H2, MySQL, PostgreSQL, SQLServer) previously did not. We [introduced a JDBC indexer](https://github.com/kestra-io/kestra/pull/4974) so logs are now always emitted asynchronously. This shifted log insertion into the database from the moment logs are emitted to the moment they are received, and we batch these insertions to reduce network overhead.

Benchmarks show a 20% average performance boost, with log-intensive tasks sometimes running up to 10x faster. For easier deployment, an indexer is now automatically started by the standalone runner or the Webserver. A separate indexer can still be started if needed.

## Logging to a file

Even with the improvements to log handling, logging can still impact task execution time. For tasks that generate numerous logs but do not require them in the UI, [you can now](https://github.com/kestra-io/kestra/pull/4757) use `logToFile: true` to store logs in an internal storage file rather than the Kestra database.

If logs are not needed, adjusting the `logLevel` of the task to `WARN` or `ERROR` (instead of the default `INFO`) can further reduce overhead.

## Worker performance improvements

The Worker, which processes task executions, is one of Kestra’s most performance-sensitive components. Although Kestra generally favors immutability, the Worker previously mutated `WorkerTask`, leading to unnecessary cleanup before sending results back to the Executor.

Benchmarks showed this could consume up to 15% of the Worker’s CPU cycles. By [refactoring the Worker](https://github.com/kestra-io/kestra/pull/5348) to avoid mutating `WorkerTask`, we reclaimed that processing time for task execution.

## Conclusion

These highlights represent some of the most significant recent performance enhancements in Kestra. Ongoing updates continue to prioritize performance at every opportunity, keeping Kestra among the most scalable and high-performing orchestration platforms [on the market](https://kestra.io/docs/why-kestra).
