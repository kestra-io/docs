---
order: 3
---
# Architecture

![Kestra Architecture](./architecture.svg "Kestra Architecture")


## Dependencies

At the heart, Kestra has a pluggable system allowing to switch some dependencies, but for now there is only one production environments architecture available :

### Kafka
[Kafka](https://kafka.apache.org/) is the real main dependency of Kestra, all the most important servers need to have a Kafka up & running. Kafka allows Kestra to be an infinitely scalable solution.

### ElasticSearch
[ElasticSearch](https://www.elastic.co/) is the database of Kestra, allowing displaying, searching, aggregating of all the data from Kestra (Flow, executions, ...)

### Storage
Kestra needs to store some files (incoming or outgoing files) and this notion is included in the heart of Kestra. Nowadays, storage availability is backup by many file systems, we rely on these to guarantee scalability of Kestra.

The storage is a simple plugin that you need to include and configure, by default only Local (not scalable) storage is available.

The storage used can be used by any Kestra servers except thee [Executor](#executor) & the [Indexer](#indexer) that don't need it.

Available storages are :
- [Storage Minio](https://github.com/kestra-io/storage-minio) for [Minio](https://min.io/) compatible with [AWS S3](https://aws.amazon.com/s3/) and all others *S3 Like* storage
- [Storage GCS](https://github.com/kestra-io/storage-gcs) for [Google Cloud Storage](https://cloud.google.com/storage)

## Servers

Kestra consist of multiple servers that can be scaled independently:

### Executor
Executors handle all executions and [flowable tasks](../../developer-guide/flowable). he only goal is to receive created execution and find what will be next tasks. There isn't (and can't) heavy computing on this part. Only looking at current execution and finding next tasks.

The executor also handles special execution cases:
- [Listeners](../../developer-guide/listeners)
- [Flow Trigger](../../developer-guide/triggers/flow.md)
- [Template](../../developer-guide/templates)

Internally, the executor is a heavy [Kafka Stream](https://kafka.apache.org/documentation/streams/). The executor processes all events coming from Kafka in the right order, keep an internal state of the execution and merge taskrun result coming from the worker. 
It also detects a dead Worker and resubmits the task running by a dead worker.

Since the application is a Kafka Stream, the application can be scale infinitely (with the limit of partition count on Kafka) but since no heavy computation are done on the executor, this server doesn't use a lot of resources (except if you have a very high rate of execution)


### Worker
A worker is where the task is done. Worker will receive a task from Executor and will process it. Since tasks could be anything(heavy computation, simple api call, etc), worker is ThreadPool where you can configure the amount of thread you need.

Internally, workers are a simple [Kafka Consumer](https://kafka.apache.org/documentation/#consumerapi) that will process any taskrun submitted. Worker will receive all tasks and dispatch internally in its Thread Pool. 
You can also scale as you want workers and have many instances on multiple servers(with the limit of partition count on Kafka), each own with Thread Pool. If a worker is dead, the Executor will detect it and resubmit their current taskrun to another worker.

### Scheduler
Scheduler will handle most of the [triggers](../../developer-guide/triggers) (except the [Flow Trigger handle by executor](../../developer-guide/triggers/flow.md)). It will watch continuously all the triggers and detect if all the conditions are met to trigger an Execution (submitted to Executor).

Internally, Scheduler has two ThreadPool :

- **ScheduledExecutorService** : that will tick every second and try to find an available job
- **CachedThreadPool** : that will compute in a separate Thread for all the trigger

::: warning
By default, Kestra will handle all date with your system timezone. You can change the timezone with [JVM options](../administrator-guide/configuration/others#jvm-configuration).
:::

### Indexer
Indexer will watch for many Kafka topics and will simply copy the content to [Repositories](#repositories). This will save to ElasticSearch all the execution & flow allowing to have a rich ui.

### Webserver
Webserver will offer 2 main modules in the same server :
- **Api**: All the api allowing triggering execution for any systems, and to interact with Kestra.
- **Ui**: The ui is also served by the same webserver

The webserver mostly interacts with Elasticsearch to have a rich api / ui. It also interacts with Kafka in order to trigger new execution, follow execution in real-time, ...


::: tip
As you understand, all the application is able to work only with Kafka and Storage (mostly except Scheduler). Elasticsearch is only available for the Web ui and if ElasticSearch is down, you can continue any workload on Kestra
:::


## Plugins
Kestra core doesn't allow to handle many tasks type. We have included a [Plugins](../../plugins) systems that allow you to develop as many tasks as you need.
A wide range of plugins will be delivered by the Kestra team !

## Repositories
Repositories are the internal way to fetch data. On production servers, it will fetch data from ElasticSearch. There is a memory repository that is used during internal Kestra unit test and has an incomplete api. Never use this one on production
