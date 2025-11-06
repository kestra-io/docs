---
title: Prometheus Metrics
icon: assets/docs/icons/admin.svg
---

This page provides an overview of all available Prometheus metrics in Kestra.

## Overview

Prometheus metrics are enabled by default in Kestra, in contrast to [OpenTelemetry](./open-telemetry.md), which must be explicitly enabled in the configuration file. 

Each Prometheus metric is described with its purpose and the type of data it represents. You can access these metrics via the `http://localhost:8081/prometheus` endpoint in Kestra.

Example output from the Prometheus endpoint:

```text
# HELP executor_active_threads The approximate number of threads actively executing tasks
# TYPE executor_active_threads gauge
executor_active_threads 4
```

For deeper details on Micrometer metrics integration, see the [Micronaut Micrometer documentation](https://micronaut-projects.github.io/micronaut-micrometer/latest/guide/).

---

## Cache Metrics
* **`cache_size`** (gauge): Current number of entries in the cache. Approximate depending on cache type.

## Java Executor Pool Metrics
* **`executor_active_threads`** (gauge): Number of threads actively executing tasks.
* **`executor_completed_tasks_total`** (counter): Total number of tasks that have completed execution.
* **`executor_idle_seconds`** (summary): Time threads have spent idle in the executor pool.
* **`executor_idle_seconds_max`** (gauge): Maximum idle time observed for a thread.
* **`executor_pool_core_threads`** (gauge): Core (minimum) number of threads in the executor pool.
* **`executor_pool_max_threads`** (gauge): Maximum allowed number of threads in the executor pool.
* **`executor_pool_size_threads`** (gauge): Current number of threads in the executor pool.
* **`executor_queue_remaining_tasks`** (gauge): Remaining queue capacity before blocking.
* **`executor_queued_tasks`** (gauge): Number of tasks currently queued for execution.
* **`executor_seconds`** (summary): Time tasks have spent executing.
* **`executor_seconds_max`** (gauge): Maximum execution time observed for a task.

## HikariCP Connection Pool Metrics
* **`hikaricp_connections`** (gauge): Total number of connections in the pool.
* **`hikaricp_connections_acquire_seconds`** (summary): Time taken to acquire connections.
* **`hikaricp_connections_acquire_seconds_max`** (gauge): Maximum time observed for acquiring a connection.
* **`hikaricp_connections_active`** (gauge): Number of currently active connections.
* **`hikaricp_connections_creation_seconds`** (summary): Time taken to create new connections.
* **`hikaricp_connections_creation_seconds_max`** (gauge): Maximum observed connection creation time.
* **`hikaricp_connections_idle`** (gauge): Number of idle connections.
* **`hikaricp_connections_max`** (gauge): Maximum connections allowed in the pool.
* **`hikaricp_connections_min`** (gauge): Minimum connections maintained in the pool.
* **`hikaricp_connections_pending`** (gauge): Threads waiting to acquire a connection.
* **`hikaricp_connections_timeout_total`** (counter): Total count of connection timeouts.
* **`hikaricp_connections_usage_seconds`** (summary): Time connections are in use.
* **`hikaricp_connections_usage_seconds_max`** (gauge): Maximum observed connection usage time.

## HTTP Client Metrics
* **`http_client_requests_seconds`** (summary): Duration of HTTP client requests.
* **`http_client_requests_seconds_max`** (gauge): Maximum observed client request duration.

## HTTP Server Metrics
* **`http_server_requests_seconds`** (summary): Duration of HTTP server requests.
* **`http_server_requests_seconds_max`** (gauge): Maximum observed server request duration.

## JVM Buffer Pool Metrics
* **`jvm_buffer_count_buffers`** (gauge): Estimated number of buffers in a memory pool.
* **`jvm_buffer_memory_used_bytes`** (gauge): Estimated memory used by a buffer pool in bytes.
* **`jvm_buffer_total_capacity_bytes`** (gauge): Total capacity of buffers in a memory pool in bytes.

## JVM Class Loading Metrics
* **`jvm_classes_loaded_classes`** (gauge): Number of classes currently loaded in the JVM.
* **`jvm_classes_unloaded_classes_total`** (counter): Total number of classes unloaded.

## JVM Garbage Collection (GC) Metrics
* **`jvm_gc_concurrent_phase_time_seconds`** (summary): Time spent in concurrent GC phases.
* **`jvm_gc_concurrent_phase_time_seconds_max`** (gauge): Maximum observed concurrent GC phase time.
* **`jvm_gc_live_data_size_bytes`** (gauge): Size of long-lived heap memory pool after GC.
* **`jvm_gc_max_data_size_bytes`** (gauge): Maximum size of long-lived heap memory pool.
* **`jvm_gc_memory_allocated_bytes_total`** (counter): Total memory allocated between GCs.
* **`jvm_gc_memory_promoted_bytes_total`** (counter): Memory promoted from young to old generation pools.
* **`jvm_gc_pause_seconds`** (summary): Time spent in GC pauses.
* **`jvm_gc_pause_seconds_max`** (gauge): Maximum observed GC pause time.

## JVM Memory Metrics
* **`jvm_memory_committed_bytes`** (gauge): Memory committed for JVM use.
* **`jvm_memory_max_bytes`** (gauge): Maximum usable JVM memory.
* **`jvm_memory_used_bytes`** (gauge): Currently used JVM memory.

## JVM Thread Metrics
* **`jvm_threads_daemon_threads`** (gauge): Number of live daemon threads.
* **`jvm_threads_live_threads`** (gauge): Number of live threads (daemon + non-daemon).
* **`jvm_threads_peak_threads`** (gauge): Peak live thread count since JVM start/reset.
* **`jvm_threads_started_threads_total`** (counter): Total number of threads started.
* **`jvm_threads_states_threads`** (gauge): Number of threads in each state.

## Kestra Executor Metrics
* **`kestra_executor_execution_delay_created_count_total`** (counter): Execution delays created.
* **`kestra_executor_execution_duration_seconds`** (summary): Execution durations.
* **`kestra_executor_execution_duration_seconds_max`** (gauge): Maximum execution duration observed.
* **`kestra_executor_execution_end_count_total`** (counter): Executions ended.
* **`kestra_executor_execution_message_process_seconds`** (summary): Duration of single execution message processing.
* **`kestra_executor_execution_message_process_seconds_max`** (gauge): Maximum observed message processing time.
* **`kestra_executor_execution_started_count_total`** (counter): Executions started.
* **`kestra_executor_flowable_execution_count_total`** (counter): Flowable tasks executed.
* **`kestra_executor_taskrun_created_count_total`** (counter): Tasks created.
* **`kestra_executor_taskrun_ended_count_total`** (counter): Tasks ended.
* **`kestra_executor_taskrun_ended_duration_seconds`** (summary): Task durations.
* **`kestra_executor_taskrun_ended_duration_seconds_max`** (gauge): Maximum task duration observed.
* **`kestra_executor_thread_count`** (gauge): Number of executor threads.

## Kestra Indexer Metrics
* **`kestra_indexer_message_in_count_total`** (counter): Records received.
* **`kestra_indexer_message_out_count_total`** (counter): Records indexed.
* **`kestra_indexer_request_count_total`** (counter): Batches of records received.
* **`kestra_indexer_request_duration_seconds`** (summary): Duration of batch processing.
* **`kestra_indexer_request_duration_seconds_max`** (gauge): Maximum observed batch processing time.

## Kestra JDBC Metrics
* **`kestra_jdbc_query_duration_seconds`** (summary): Duration of database queries.
* **`kestra_jdbc_query_duration_seconds_max`** (gauge): Maximum observed query duration.

## Kestra Queue Metrics
* **`kestra_queue_big_message_count_total`** (counter): Big messages in the queue.
* **`kestra_queue_poll_size`** (gauge): Size of a single poll (batch size).
* **`kestra_queue_produce_count_total`** (counter): Messages produced to the queue.
* **`kestra_queue_receive_duration_seconds`** (summary): Duration to receive and consume messages.
* **`kestra_queue_receive_duration_seconds_max`** (gauge): Maximum observed receive duration.

## Kestra Scheduler Metrics
* **`kestra_scheduler_evaluate_count_total`** (counter): Triggers evaluated.
* **`kestra_scheduler_evaluation_loop_duration_seconds`** (summary): Duration of trigger evaluation loops.
* **`kestra_scheduler_evaluation_loop_duration_seconds_max`** (gauge): Maximum observed evaluation loop duration.
* **`kestra_scheduler_loop_count_total`** (counter): Evaluation loops executed.

## Kestra Worker Metrics
* **`kestra_worker_ended_count_total`** (counter): Tasks ended.
* **`kestra_worker_ended_duration_seconds`** (summary): Task run durations.
* **`kestra_worker_ended_duration_seconds_max`** (gauge): Maximum observed task run duration.
* **`kestra_worker_job_pending`** (gauge): Pending jobs waiting to be run.
* **`kestra_worker_job_running`** (gauge): Jobs currently running.
* **`kestra_worker_job_thread`** (gauge): Number of worker threads.
* **`kestra_worker_queued_duration_seconds`** (summary): Task queued durations.
* **`kestra_worker_queued_duration_seconds_max`** (gauge): Maximum observed queued duration.
* **`kestra_worker_running_count`** (gauge): Number of tasks currently running.
* **`kestra_worker_started_count_total`** (counter): Tasks started.

## Logback Metrics
* **`logback_events_total`** (counter): Log events enabled by the effective log level.

## Process Metrics
* **`process_cpu_time_ns_total`** (counter): CPU time used by the JVM process (ns).
* **`process_cpu_usage`** (gauge): Recent CPU usage for the JVM process (0.0–1.0).
* **`process_files_max_files`** (gauge): Maximum number of file descriptors.
* **`process_files_open_files`** (gauge): Current number of open file descriptors.
* **`process_start_time_seconds`** (gauge): JVM process start time since Unix epoch (s).
* **`process_uptime_seconds`** (gauge): JVM uptime (s).

## System Metrics
* **`system_cpu_count`** (gauge): Number of processors available to JVM.
* **`system_cpu_usage`** (gauge): Recent CPU usage of the system (0.0–1.0).
* **`system_load_average_1m`** (gauge): System load average over the last 1 minute.
