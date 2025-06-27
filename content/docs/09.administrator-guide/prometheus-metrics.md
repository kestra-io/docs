---
title: Prometheus Metrics
icon: /docs/icons/admin.svg
---

This page provides an overview of all available Prometheus metrics in Kestra.

## Overview

Prometheus metrics are enabled by default in Kestra (in contrast to [OpenTelemetry](./open-telemetry.md)) which needs to be explicitly enabled in the configuration file). Each Prometheus metric is described with its purpose and the type of data it represents. You can access these metrics via `http://localhost:8081/prometheus` endpoint in Kestra.


## Cache Metrics
* **`cache_size`**: The number of entries currently in the cache. This might be an approximation depending on the cache type.


## Executor Metrics
* **`executor_active_threads`**: The approximate number of threads that are actively executing tasks within the executor.
* **`executor_completed_tasks_total`**: The total approximate number of tasks that have completed execution.
* **`executor_idle_seconds`**: A summary of the time threads have spent idle in the executor pool.
* **`executor_idle_seconds_max`**: The maximum idle time observed for a thread in the executor pool.
* **`executor_pool_core_threads`**: The core (minimum) number of threads for the executor pool.
* **`executor_pool_max_threads`**: The maximum allowed number of threads in the executor pool.
* **`executor_pool_size_threads`**: The current number of threads in the executor pool.
* **`executor_queue_remaining_tasks`**: The number of additional tasks the queue can accept without blocking.
* **`executor_queued_tasks`**: The approximate number of tasks currently queued for execution.
* **`executor_seconds`**: A summary of the time tasks have spent executing within the executor.
* **`executor_seconds_max`**: The maximum execution time observed for a task within the executor.


## HikariCP Connection Pool Metrics
* **`hikaricp_connections`**: The total number of connections in the HikariCP pool.
* **`hikaricp_connections_acquire_seconds`**: A summary of the time taken to acquire connections from the pool.
* **`hikaricp_connections_acquire_seconds_max`**: The maximum time observed for acquiring a connection.
* **`hikaricp_connections_active`**: The number of currently active connections.
* **`hikaricp_connections_creation_seconds`**: A summary of the time taken to create new connections.
* **`hikaricp_connections_creation_seconds_max`**: The maximum time observed for creating a connection.
* **`hikaricp_connections_idle`**: The number of idle connections in the pool.
* **`hikaricp_connections_max`**: The maximum number of connections allowed in the pool.
* **`hikaricp_connections_min`**: The minimum number of connections maintained in the pool.
* **`hikaricp_connections_pending`**: The number of threads currently waiting to acquire a connection.
* **`hikaricp_connections_timeout_total`**: The total count of connection timeouts.
* **`hikaricp_connections_usage_seconds`**: A summary of the time connections are in use.
* **`hikaricp_connections_usage_seconds_max`**: The maximum time observed for connection usage.


## HTTP Client Metrics
* **`http_client_requests_seconds`**: A summary of the duration of HTTP client requests.
* **`http_client_requests_seconds_max`**: The maximum duration observed for an HTTP client request.


## HTTP Server Metrics
* **`http_server_requests_seconds`**: A summary of the duration of HTTP server requests.
* **`http_server_requests_seconds_max`**: The maximum duration observed for an HTTP server request.


## JVM Buffer Pool Metrics
* **`jvm_buffer_count_buffers`**: An estimate of the number of buffers in a specific memory pool.
* **`jvm_buffer_memory_used_bytes`**: An estimate of the memory used by the JVM for a buffer pool in bytes.
* **`jvm_buffer_total_capacity_bytes`**: An estimate of the total capacity of buffers in a memory pool in bytes.


## JVM Class Loading Metrics
* **`jvm_classes_loaded_classes`**: The number of classes currently loaded in the JVM.
* **`jvm_classes_unloaded_classes_total`**: The total number of classes unloaded in the JVM.


## JVM Garbage Collection (GC) Metrics
* **`jvm_gc_concurrent_phase_time_seconds`**: A summary of the time spent in the concurrent GC phase.
* **`jvm_gc_concurrent_phase_time_seconds_max`**: The maximum time observed for the concurrent GC phase.
* **`jvm_gc_live_data_size_bytes`**: The size of the long-lived heap memory pool after garbage collection.
* **`jvm_gc_max_data_size_bytes`**: The maximum size of the long-lived heap memory pool.
* **`jvm_gc_memory_allocated_bytes_total`**: The total memory allocated in the young heap memory pool between GCs.
* **`jvm_gc_memory_promoted_bytes_total`**: The total memory promoted from young to old generation memory pools.
* **`jvm_gc_pause_seconds`**: A summary of the time spent in GC pauses.
* **`jvm_gc_pause_seconds_max`**: The maximum time observed for a GC pause.


## JVM Memory Metrics
* **`jvm_memory_committed_bytes`**: The amount of memory in bytes committed for the JVM to use.
* **`jvm_memory_max_bytes`**: The maximum amount of memory in bytes that can be used for memory management.
* **`jvm_memory_used_bytes`**: The amount of used memory in bytes.


## JVM Thread Metrics
* **`jvm_threads_daemon_threads`**: The current number of live daemon threads.
* **`jvm_threads_live_threads`**: The current number of live threads, including both daemon and non-daemon.
* **`jvm_threads_peak_threads`**: The peak live thread count since the JVM started or was reset.
* **`jvm_threads_started_threads_total`**: The total number of application threads started in the JVM.
* **`jvm_threads_states_threads`**: The current number of threads in different states (e.g., blocked, runnable, waiting).


## Kestra Executor Metrics
* **`kestra_executor_execution_delay_created_count_total`**: The total number of execution delays created by the Executor.
* **`kestra_executor_execution_duration_seconds`**: A summary of the duration of executions within the Executor.
* **`kestra_executor_execution_duration_seconds_max`**: The maximum duration observed for an execution within the Executor.
* **`kestra_executor_execution_end_count_total`**: The total number of executions ended by the Executor.
* **`kestra_executor_execution_message_process_seconds`**: A summary of the duration for a single execution message processed by the Executor.
* **`kestra_executor_execution_message_process_seconds_max`**: The maximum duration observed for a single execution message processed by the Executor.
* **`kestra_executor_execution_started_count_total`**: The total number of executions started by the Executor.
* **`kestra_executor_flowable_execution_count_total`**: The total number of flowable tasks executed by the Executor.
* **`kestra_executor_taskrun_created_count_total`**: The total number of tasks created by the Executor.
* **`kestra_executor_taskrun_ended_count_total`**: The total number of tasks ended by the Executor.
* **`kestra_executor_taskrun_ended_duration_seconds`**: A summary of the task duration within the Executor.
* **`kestra_executor_taskrun_ended_duration_seconds_max`**: The maximum task duration observed within the Executor.
* **`kestra_executor_thread_count`**: The number of executor threads.


## Kestra Indexer Metrics
* **`kestra_indexer_message_in_count_total`**: The total number of records received by the Indexer.
* **`kestra_indexer_message_out_count_total`**: The total number of records indexed by the Indexer.
* **`kestra_indexer_request_count_total`**: The total number of batches of records received by the Indexer.
* **`kestra_indexer_request_duration_seconds`**: A summary of the duration of processing a batch of records inside the Indexer.
* **`kestra_indexer_request_duration_seconds_max`**: The maximum duration observed for processing a batch of records inside the Indexer.


## Kestra JDBC Metrics
* **`kestra_jdbc_query_duration_seconds`**: A summary of the duration of database queries.
* **`kestra_jdbc_query_duration_seconds_max`**: The maximum duration observed for a database query.


## Kestra Queue Metrics
* **`kestra_queue_big_message_count_total`**: The total number of big messages in the queue.
* **`kestra_queue_poll_size`**: The size of a single poll (batch size) to the queue.
* **`kestra_queue_produce_count_total`**: The total number of messages produced to the queue.
* **`kestra_queue_receive_duration_seconds`**: A summary of the duration to receive and consume a batch of messages from the queue.
* **`kestra_queue_receive_duration_seconds_max`**: The maximum duration observed to receive and consume a batch of messages from the queue.


## Kestra Scheduler Metrics
* **`kestra_scheduler_evaluate_count_total`**: The total number of triggers evaluated by the Scheduler.
* **`kestra_scheduler_evaluation_loop_duration_seconds`**: A summary of the trigger evaluation loop duration inside the Scheduler.
* **`kestra_scheduler_evaluation_loop_duration_seconds_max`**: The maximum duration observed for the trigger evaluation loop inside the Scheduler.
* **`kestra_scheduler_loop_count_total`**: The total number of evaluation loops executed by the Scheduler.


## Kestra Worker Metrics
* **`kestra_worker_ended_count_total`**: The total number of tasks ended by the Worker.
* **`kestra_worker_ended_duration_seconds`**: A summary of the task run duration inside the Worker.
* **`kestra_worker_ended_duration_seconds_max`**: The maximum task run duration observed inside the Worker.
* **`kestra_worker_job_pending`**: The number of jobs (tasks or triggers) waiting to be run by the Worker.
* **`kestra_worker_job_running`**: The number of jobs (tasks or triggers) currently running inside the Worker.
* **`kestra_worker_job_thread`**: The number of worker threads.
* **`kestra_worker_queued_duration_seconds`**: A summary of the task queued duration inside the Worker.
* **`kestra_worker_queued_duration_seconds_max`**: The maximum task queued duration observed inside the Worker.
* **`kestra_worker_running_count`**: The number of tasks currently running inside the Worker.
* **`kestra_worker_started_count_total`**: The total number of tasks started by the Worker.


## Logback Metrics
* **`logback_events_total`**: The number of log events that were enabled by the effective log level.


## Process Metrics
* **`process_cpu_time_ns_total`**: The total "CPU time" used by the Java Virtual Machine process in nanoseconds.
* **`process_cpu_usage`**: The "recent CPU usage" for the Java Virtual Machine process (a value between 0.0 and 1.0).
* **`process_files_max_files`**: The maximum number of file descriptors that can be opened by the process.
* **`process_files_open_files`**: The current number of open file descriptors for the process.
* **`process_start_time_seconds`**: The start time of the process since the Unix epoch in seconds.
* **`process_uptime_seconds`**: The uptime of the Java Virtual Machine in seconds.


## System Metrics
* **`system_cpu_count`**: The number of processors available to the Java virtual machine.
* **`system_cpu_usage`**: The "recent CPU usage" of the system the application is running in (a value between 0.0 and 1.0).
* **`system_load_average_1m`**: The system load average over the last 1 minute, representing the average number of runnable entities.