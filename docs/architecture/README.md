---
order: 3
---
# Architecture


## Dependencies

Kestra is a simple Java application that is provided as an executable. You have many deployments options:
- [Docker](../administrator-guide/deployment/docker)
- [Kubernetes](../administrator-guide/deployment/kubernetes)
- [Manual deployment](../administrator-guide/deployment/manual)

At its heart, Kestra has a pluggable system allowing some dependencies to be switched out, for now there is two different production environment architectures available:

### Medium-sized environment
![Kestra Architecture](./architecture-sql.svg "Kestra Architecture")

For medium-sized deployment where high availability is not a strict requirement, you can use a simple database (Postgres or MySQL) as only dependencies. This allows to run Kestra with a minimal stack to maintain. We have for now 2 databases available:
- Postgres
- Mysql

More detail on configurations are available [here](../administrator-guide/configuration/databases/README.md)

### High Availability and No Single Point of Failure

![Kestra Architecture](./architecture.svg "Kestra Architecture")

In order to support higher throughput, and full horizontal and vertical scaling of the Kestra cluster, we can replace the database with Kafka and Elasticsearch. In that case, all the process can be scaled without any single point of failure.

#### Kafka
[Kafka](https://kafka.apache.org/) is Kestra's primary dependency. Each of the most important server components in the deployment need to have a Kafka instance up & running. Kafka allows Kestra to be an infinitely scalable solution.

#### ElasticSearch
[ElasticSearch](https://www.elastic.co/) is Kestra's user interface database, allowing the display, search and aggregation of all Kestra's data (Flows, Executions, etc...). ElasticSearch is only used by the webserver (api & ui).

### Storage
As with most systems, Kestra requires storage to handle incoming and outgoing files of varying sizes. This notion is included in the heart of Kestra. Nowadays, storage availability is backed up by many file systems, we rely on these to guarantee scalability of Kestra. The *Kestra Internal Storage* will transmit all the files between the different tasks.

The storage is a simple plugin that you need to include and configure, by default only local (not scalable) storage is available.

Any storage implementations can be used by any Kestra server components except the [Executor](#executor) & the [Indexer](#indexer) which don't use the storage.

You can replace the local storage by one of the following storage implementations:
- [Storage Minio](https://github.com/kestra-io/storage-minio) for [Minio](https://min.io/), which is compatible with [AWS S3](https://aws.amazon.com/s3/) and all other *S3 Like* storage.
- [Storage GCS](https://github.com/kestra-io/storage-gcs) for [Google Cloud Storage](https://cloud.google.com/storage).
- [Storage Azure](https://github.com/kestra-io/storage-azure) for [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/).

## Servers

Kestra consists of multiple server components that can be scaled independently:

### Executor
Executors handle all executions and [flowable tasks](../../developer-guide/flowable). The only goal of the Executor is to receive created executions and look for the  next tasks. There is no heavy computation required (and no capacity for it) for this server component. The only purpose of the Executor is looking at current executions and finding the next tasks.

The Executor also handles special execution cases:
- [Listeners](../developer-guide/listeners).
- [Flow Triggers](../developer-guide/triggers/flow.md).
- [Templates](../developer-guide/templates).

Internally, the Executor is a heavy [Kafka Stream](https://kafka.apache.org/documentation/streams/) application. The Executor processes all events coming from Kafka in the right order, keeps an internal state of the execution, and merges task run results coming from the Worker.
It also detects dead Workers and resubmits the tasks ran by a dead Worker.

Since the application is a Kafka Stream, it can be scaled infinitely (within the limits of partitions count on Kafka), but since no heavy computations are done in the Executor, this server component does not require a lot of resources (unless you have a very high rate of executions).


### Worker
A Worker is where the task is run. A Worker will receive a task from the Executor and will process it. Since tasks can be nearly anything (heavy computations, simple api calls, etc...), the Worker is essentially a Thread Pool where you can configure the amount of threads you need.

Internally, Workers are a simple [Kafka Consumer](https://kafka.apache.org/documentation/#consumerapi) that will process any Task Run submitted to it. Workers will receive all tasks and dispatch them internally in its Thread Pool.

You can also scale Workers as necessary, and have many instances on multiple servers (within the limits of the partitions count on Kafka), each with its own Thread Pool. If a Worker is dead, the Executor will detect it and resubmit their current task run to another Worker.

### Scheduler
The Scheduler will handle most of the [Triggers](../developer-guide/triggers) (except the [Flow Trigger handle by the Executor](../developer-guide/triggers/flow.md)). It will continuously watch all triggers and, if all the conditions are met, will trigger an Execution (submitted to the Executor).

Internally, a Scheduler has two Thread Pools:

- **ScheduledExecutorService**: This Thread Pool will tick every second and try to find an available job.
- **CachedThreadPool**: This Thread Pool will deal with all other scheduler computational needs: detecting files, executing queries, fetching queues, ...

::: warning
By default, Kestra will handle all dates based on your system timezone. You can change the timezone with [JVM options](../administrator-guide/configuration/others#jvm-configuration).
:::

::: warning
With MySQL or PostgreSQL as database, you can't scale the replicas count for the scheduler, and you must have only **one** instance for the whole cluster.
:::

### Indexer
The Indexer will watch for many Kafka topics and will simply copy the content to [Repositories](#repositories). This will save all the executions & flows to ElasticSearch providing Kestra with a rich UI.

### Webserver
The Webserver offers 2 main modules in the same component:
- **Api**: All the [apis](../api-guide/) that allowed to trigger executions for any system, and to interact with Kestra.
- **UI**: The [User Interface](../user-interface-guide) (UI) is also served by the same webserver.

The Webserver interacts mostly with Elasticsearch to deliver a rich API/UI. It also interacts with Kafka in order to trigger new executions, follow executions in real-time, etc...


::: tip
Each Application/Server (other than the Scheduler) can continue to function, provided Kafka and its Storage is up and running. ElasticSearch is only used to help provide our rich Web UI, and even if ElasticSearch is down, workloads can continue to process on Kestra.
:::


## Plugins
Kestra's core is not by itself able to handle many task types. We have therefore included a [Plugins](../../plugins) system that allows to develop as many task types as you need.
A wide range of plugins is already available, and many more will be delivered by the Kestra team!

## Repositories
Repositories are the internal way to fetch data. On production servers, these will fetch data from ElasticSearch. 

There exist a memory repository that is used for internal Kestra unit tests that has an incomplete API. Never use this repository for production.
