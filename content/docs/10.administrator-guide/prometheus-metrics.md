---
title: Prometheus Metrics
icon: /docs/icons/admin.svg
---

This page provides an overview of all available [Prometheus](https://prometheus.io/) metrics in Kestra.

## Overview

Prometheus metrics are enabled by default in Kestra, in contrast to [OpenTelemetry](./open-telemetry.md), which must be explicitly enabled in the configuration file.

Metrics include custom metrics defined within the application and framework-provided metrics collected via [Micrometer](https://micrometer.io/).

Each Prometheus metric is described with its purpose and the type of data it represents. You can access these metrics via the `http://localhost:8081/prometheus` endpoint in Kestra.

Example output from the Prometheus endpoint:

```text
# HELP executor_active_threads The approximate number of threads that are actively executing tasks
# TYPE executor_active_threads gauge
executor_active_threads 4
```

:::alert{type="info"}
For deeper details on Micrometer metrics integration, see the [Micronaut Micrometer documentation](https://micronaut-projects.github.io/micronaut-micrometer/latest/guide/).
:::

---

## Kestra

### Kestra Executor Metrics

Executor server exclusive:

* `kestra_executor_execution_delay_created_count_total` (counter): The total number of execution delays created by the Executor.
* `kestra_executor_execution_duration_seconds` (summary): Execution duration inside the Executor.
* `kestra_executor_execution_duration_seconds_max` (gauge): Maximum observed execution duration inside the Executor.
* `kestra_executor_execution_end_count_total` (counter): The total number of executions ended by the Executor.
* `kestra_executor_execution_message_process_seconds` (summary): Duration of a single execution message processed by the Executor.
* `kestra_executor_execution_message_process_seconds_max` (gauge): Maximum observed duration of a single execution message processed by the Executor.
* `kestra_executor_execution_started_count_total` (counter): The total number of executions started by the Executor.
* `kestra_executor_flowable_execution_count_total` (counter): The total number of flowable tasks executed by the Executor
* `kestra_executor_taskrun_created_count_total` (counter): The total number of tasks created by the Executor.
* `kestra_executor_taskrun_ended_count_total` (counter): he total number of tasks ended by the Executor.
* `kestra_executor_taskrun_ended_duration_seconds` (summary): Task duration inside the Executor.
* `kestra_executor_taskrun_ended_duration_seconds_max` (gauge): Maximum observed task duration inside the Executor.
* `kestra_executor_thread_count` (gauge): The number of executor threads.
* `kestra_executor_worker_job_resubmit_count_total` (counter): The total number of worker jobs resubmitted to the Worker by the Executor.

### Kestra Indexer Metrics

Indexer server exclusive:

* `kestra_indexer_message_in_count_total` (counter): Total number of records received by the Indexer
* `kestra_indexer_message_out_count_total` (counter): Total number of records indexed by the Indexer
* `kestra_indexer_request_count_total` (counter): Total number of batches of records received by the Indexer
* `kestra_indexer_request_duration_seconds` (summary): Batch of records duration inside the Indexer.
* `kestra_indexer_request_duration_seconds_max` (gauge): Maximum observed batch of records duration inside the Indexer.

### Kestra Scheduler Metrics

Scheduler server exclusive:

* `kestra_scheduler_evaluate_count_total` (counter): Total number of triggers evaluated by the Scheduler.
* `kestra_scheduler_evaluation_loop_duration_seconds` (summary): Trigger evaluation loop duration inside the Scheduler.
* `kestra_scheduler_evaluation_loop_duration_seconds_max` (gauge): Maximum observed trigger evaluation loop duration inside the Scheduler.
* `kestra_scheduler_loop_count_total` (counter): Total number of evaluation loops executed by the Scheduler.

### Kestra Worker Metrics

Worker server exclusive:

* `kestra_worker_ended_count_total` (counter): The total number of tasks ended by the Worker.
* `kestra_worker_ended_duration_seconds` (summary): Task run duration inside the Worker.
* `kestra_worker_ended_duration_seconds_max` (gauge): Maximum observed task run duration inside the Worker.
* `kestra_worker_job_pending` (gauge): The number of jobs (tasks or triggers) pending to be run by the Worker.
* `kestra_worker_job_running` (gauge): The number of jobs (tasks or triggers) currently running inside the Worker.
* `kestra_worker_job_thread` (gauge): The number of worker threads.
* `kestra_worker_queued_duration_seconds` (summary): Task queued duration inside the Worker.
* `kestra_worker_queued_duration_seconds_max` (gauge): Maximum observed task queued duration inside the Worker.
* `kestra_worker_running_count` (gauge): The number of tasks currently running inside the Worker.
* `kestra_worker_started_count_total` (counter): The total number of tasks started by the Worker.

### Kestra JDBC Metrics

Various Kestra-specific database queries:

* `kestra_jdbc_query_duration_seconds` (summary): Duration of database queries.
* `kestra_jdbc_query_duration_seconds_max` (gauge): Maximum observed query duration.

### Kestra Queue Metrics

For each internal queue:

* `kestra_queue_big_message_count_total` (counter): Big messages in the queue.
* `kestra_queue_poll_size` (gauge): Size of a poll to the queue (message batch size).
* `kestra_queue_produce_count_total` (counter): Total number of produced messages.
* `kestra_queue_receive_duration_seconds` (summary): Queue duration to receive and consume a batch of messages.
* `kestra_queue_receive_duration_seconds_max` (gauge): Maximum observed queue duration to receive and consume a batch of messages.

## Cache metrics

Micronaut web server caching overview:

* `cache_size` (gauge): Current number of entries in the cache. Approximate depending on cache type.

## HikariCP Connection Pool Metrics

Database connection pool status:

* `hikaricp_connections` (gauge): Total number of connections in the pool.
* `hikaricp_connections_acquire_seconds` (summary): Time taken to acquire connections.
* `hikaricp_connections_acquire_seconds_max` (gauge): Maximum time observed for acquiring a connection.
* `hikaricp_connections_active` (gauge): Number of currently active connections.
* `hikaricp_connections_creation_seconds` (summary): Time taken to create new connections.
* `hikaricp_connections_creation_seconds_max` (gauge): Maximum observed connection creation time.
* `hikaricp_connections_idle` (gauge): Number of idle connections.
* `hikaricp_connections_max` (gauge): Maximum connections allowed in the pool.
* `hikaricp_connections_min` (gauge): Minimum connections maintained in the pool.
* `hikaricp_connections_pending` (gauge): Threads waiting to acquire a connection.
* `hikaricp_connections_timeout_total` (counter): Total count of connection timeouts.
* `hikaricp_connections_usage_seconds` (summary): Time connections are in use.
* `hikaricp_connections_usage_seconds_max` (gauge): Maximum observed connection usage time.

## HTTP Client Metrics

Outbound HTTP requests:

* `http_client_requests_seconds` (summary): Duration of HTTP client requests.
* `http_client_requests_seconds_max` (gauge): Maximum observed client request duration.

## HTTP Server Metrics

Inbound HTTP requests to Micronaut web server endpoints:

* `http_server_requests_seconds` (summary): Duration of HTTP server requests.
* `http_server_requests_seconds_max` (gauge): Maximum observed server request duration.

## JVM

## Java executor pool metrics

Various asynchronous task executors:

* `executor_active_threads` (gauge): The approximate number of threads that are actively executing tasks.
* `executor_completed_tasks_total` (counter): The approximate total number of tasks that have completed execution.
* `executor_idle_seconds` (summary): Time threads have spent idle in the executor pool.
* `executor_idle_seconds_max` (gauge): Maximum idle time observed for a thread.
* `executor_pool_core_threads` (gauge): The core number of threads for the pool.
* `executor_pool_max_threads` (gauge): The maximum allowed number of threads in the pool.
* `executor_pool_size_threads` (gauge): The current number of threads in the pool.
* `executor_queue_remaining_tasks` (gauge): The number of additional elements that this queue can ideally accept without blocking.
* `executor_queued_tasks` (gauge): The approximate number of tasks that are queued for execution.
* `executor_seconds` (summary): Time tasks have spent executing.
* `executor_seconds_max` (gauge): Maximum execution time observed for a task.

### JVM Buffer Pool Metrics

Overview of Java buffer pools type statistics:

* `jvm_buffer_count_buffers` (gauge): An estimate of the number of buffers in the pool.
* `jvm_buffer_memory_used_bytes` (gauge): An estimate of the memory that the Java virtual machine is using for this buffer pool.
* `jvm_buffer_total_capacity_bytes` (gauge): An estimate of the total capacity of the buffers in this pool.

### JVM Class Loading Metrics

Overview of Java class loading activity:

* `jvm_classes_loaded_classes` (gauge): The number of classes that are currently loaded in the Java virtual machine.
* `jvm_classes_unloaded_classes_total` (counter): The number of classes unloaded in the Java virtual machine.

### JVM Garbage Collection (GC) Metrics

Overview of runtime Java GC:

* `jvm_gc_concurrent_phase_time_seconds` (summary): Time spent in concurrent phase.
* `jvm_gc_concurrent_phase_time_seconds_max` (gauge): Maximum observed time spent in concurrent phase.
* `jvm_gc_live_data_size_bytes` (gauge): Size of long-lived heap memory pool after reclamation.
* `jvm_gc_max_data_size_bytes` (gauge): Max size of long-lived heap memory pool.
* `jvm_gc_memory_allocated_bytes_total` (counter): Incremented for an increase in the size of the (young) heap memory pool after one GC to before the next.
* `jvm_gc_memory_promoted_bytes_total` (counter): Count of positive increases in the size of the old generation memory pool before GC to after GC.
* `jvm_gc_pause_seconds` (summary): Time spent in GC pause.
* `jvm_gc_pause_seconds_max` (gauge): Maximum observed time spent in GC pause.

### JVM Memory Metrics

Overview of various Java memory regions:

* `jvm_memory_committed_bytes` (gauge): The amount of memory in bytes that is committed for the Java virtual machine to use.
* `jvm_memory_max_bytes` (gauge): The maximum amount of memory in bytes that can be used for memory management.
* `jvm_memory_used_bytes` (gauge): The amount of used memory.

### JVM Thread Metrics

Java threading model:

* `jvm_threads_daemon_threads` (gauge): The current number of live daemon threads.
* `jvm_threads_live_threads` (gauge): The current number of live threads including both daemon and non-daemon threads.
* `jvm_threads_peak_threads` (gauge): The peak live thread count since the Java virtual machine started or peak was reset.
* `jvm_threads_started_threads_total` (counter): The total number of application threads started in the JVM.
* `jvm_threads_states_threads` (gauge): The current number of threads.

## Logback metrics

Logger emitted events by log level:

* `logback_events_total` (counter): Log events enabled by the effective log level.

## Runtime metrics

### Process Metrics

Kestra from OS process point of view:

* `process_cpu_time_ns_total` (counter): The "cpu time" used by the Java Virtual Machine process.
* `process_cpu_usage` (gauge): The "recent cpu usage" for the Java Virtual Machine process.
* `process_files_max_files` (gauge):The maximum file descriptor count.
* `process_files_open_files` (gauge): The open file descriptor count.
* `process_start_time_seconds` (gauge): Start time of the process since unix epoch.
* `process_uptime_seconds` (gauge): The uptime of the Java virtual machine.

### System Metrics

Runtime resources overview:

* `system_cpu_count` (gauge): The number of processors available to the Java virtual machine.
* `system_cpu_usage` (gauge): The "recent cpu usage" of the system the application is running in.
* `system_load_average_1m` (gauge): The sum of the number of runnable entities queued to available processors and the number of runnable entities running on the available processors averaged over a period of time.
