---
order: 3
---
# Architecture

![Kestra Architecture](./architecture.svg "Kestra Architecture")


## Dependencies

At the heart, Kestra have a pluggable system allowing to switch some dependencies, but for now there is only one production environments architecture available :

### Kafka
[Kafka](https://kafka.apache.org/) is the real main dependencies of Kestra, all the most important servers need to have a Kafka up & running. Kafka allowing Kestra to be an infinite scalable solution.

### ElasticSearch 
[ElasticSearch](https://www.elastic.co/) is the database of Kestra, allowing displaying, search, aggregate all the data from Kestra (Flow, executions, ...)

### Storage
Kestra need to store some files (incoming or outgoing files) and this notion is included in the heart of Kestra. Nowadays, storage availability are backup by many file systems, we rely on these in order to guarantee scalability of Kestra.

The storage is a simple plugin that you need to include and configure, by default only a Local (not scalable) storage is available.

The storage is used can be used by any Kestra servers exept the [Executor](#executor) & the [Indexer](#indexer) that don't need it.

Available storage are : 
- [Storage Minio](https://github.com/kestra-io/storage-minio) for [Minio](https://min.io/) compatible with [AWS S3](https://aws.amazon.com/s3/) and all others *S3 Like* storage
- [Storage GCS](https://github.com/kestra-io/storage-gcs) for [Google Cloud Storage](https://cloud.google.com/storage)

## Servers

Kestra consist of multiple servers that can be scaled independently:

### Executor
Executors handle all executions and [flowable tasks](../../developer-guide/flowable). The only goal is to receive created execution and find what will be next tasks.
There isn't (and can't) heavy computing on this part. Only looking at current execution and find next tasks.

The executor also handle special execution case : 

- [Listeners](../../developer-guide/listeners)
- [Flow Trigger](../../developer-guide/triggers/flow.md)
- [Template](../../developer-guide/templates)

Internally, the executor is a heavy [Kafka Stream](https://kafka.apache.org/documentation/streams/). The executor processes all events coming from Kafka in the right order, keep an internal state of the execution and merge taskrun result coming from the worker. 
It also detect a dead Worker and resubmit the task running by a dead worker.

Since the application is a Kafka Stream, the application can be scale infinitely (with the limit of partition count on Kafka) but since no heavy computation are done on the executor, this server doesn't use a lot of resources (except if you have a very high rate of execution). 

### Worker
Workers is where the task are done. Worker will receive task from Executor and will process then. 
Since tasks could be everything (heavy computation, simple api call), worker is ThreadPool where you can configure the amount of thread you need.

Internally, Worker are a simple [Kafka Consumer](https://kafka.apache.org/documentation/#consumerapi) that will process any taskrun submitted. Worker will receive all task and dispatch internally in his Thread Pool.
You can also scale as you want workers and have many instance on multiple servers(with the limit of partition count on Kafka), each own with Thread Pool.
If a worker is dead, the *Executor* will detect him and resubmit their current taskrun to another worker.

### Scheduler
Scheduler will handle most of the [triggers](../../developer-guide/triggers) (except the [Flow Trigger](../../developer-guide/triggers/flow.md)). It will watch continuously all the triggers and detect if all the conditions is meet to trigger an Execution (submitted to Executor). 

Internally, Scheduler are 2 ThreadPool : 

- **ScheduledExecutorService** : that will tick every second and try to find a available job
- **CachedThreadPool** : that will compute in a separate Thread for all the trigger  

::: warning
For now, Scheduler can be only a single instance per cluster! In a near future, Scheduler will also be scalable as other services. 

Also for now, Scheduler depends on [Repositories](#repositories) to keep the last execution date for all the trigger, and in a futur, we will remove the dependency to rely only on Kafka
:::

### Indexer
Indexer will watch for many *Kafka topic* and will simply copy the content to [Repositories](#repositories). This will save to ElastiSearch all the execution & flow allowing to have a rich ui.

### Webserver
Webserver will offer 2 main module in the same server : 
- **Api**: All the api allowing triggering execution for any systems, and to interact with Kestra.
- **Ui**: The ui is also serve from the same webserver 

The webserver mostly interact with Elasticsearch in order to have a rich api / ui. And it also interacts with Kafka in order to trigger new execution, follow execution in real-time, ... 


::: tip
As you understand, all the application is able to work only with Kafka and [Storage](#storage) (mostly except Scheduler). 
Elasticsearch is only available for the Web ui and if ElasticSearch is down, you are able to continue any workload on Kestra
:::


## Plugins

Kestra core doesn't allow to handle many tasks type. We have included a [Plugins](../../plugins) systems that allow you to develop as many tasks as you need.
A wide range of plugins will delivered by Kestra team ! 

