---
title: "Advanced tips and techniques for Kafka Streams"
description: Discover some tips and nice techniques that will help you build a resilient and distributed applications
date: 2022-06-27T10:00:00
layout: BlogsPost
author:
  name: Ludovic Dehon
  image: "ldehon"
  twitter: "@tchiotludo"
image: /blogs/2022-06-28-tips-kafka-streams-distributed.jpg
draft: true
---

While building [Kestra](https://github.com/kestra-io/kestra), an open-source data orchestration and scheduling platform, we decided to use Kafka as the main database to build a scalable architecture. Since Kafka allows gigabytes of throughput, we are confident to have a fully scalable solution, but we need to adapt to Kafka.

Since we heavily rely on [Kafka Streams](https://kafka.apache.org/documentation/streams/) for most of our services (executor and scheduler mostly), we have made some assumptions on how it handles the workload. This blog post is here to show some advanced techniques we have to use to have a Kafka Stream reliable, we want to share with you the tips we have discovered during the last two years.

## Same topic as source and destination
In [Kestra](https://github.com/kestra-io/kestra), we have a topic with the current execution that is the source and also the destination, we only update the current execution to add some information and send it back to Kafka to further processing (New tasks status for example). We are not sure that this design is possible with Kafka which lead to asking [Matthias J. Sax](https://twitter.com/tchiotludo/status/1252197729406783488), one of the main maintainers of Kafka Streams, that respond to me on [Stack Overflow](https://stackoverflow.com/questions/61316312/does-kafka-stream-with-same-sink-source-topics-with-join-is-supported)

The short response: YES it's possible

The long one: YES it's possible **IF** you are sure at 100% that for the same key (the execution in our case), you must **have only one** process that can write. If you see this warning in the console `Detected out-of-order KTable update for execution at offset 10, partition 7.`, you are probably in that case and this can lead to unexpected behavior (like overwrite of previous values).

Let me explain, imagine a topology with topic as source, some branching logic, and to different process writing to the same destinations:
```java
KStream<String, Execution> executions = builder
    .stream("executions", Consumed.with(Serdes.String(), JsonSerde.of(Execution.class)));

executions
    .mapValues((readOnlyKey, value) -> value)
    .to("executions", Produced.with(Serdes.String(), JsonSerde.of(Execution.class)));

executions
    .leftJoin(
        builder.table("results", Consumed.with(Serdes.String(), JsonSerde.of(WorkerTaskResult.class))),
        (readOnlyKey, value1, value2) -> value1
    )
    .to("executions", Produced.with(Serdes.String(), JsonSerde.of(Execution.class)));
```

In that case, a concurrent process can write on the same topic, overwriting the previous value and destroying the previous computed methods.
For that usage, you must define a single writer for a Key at the same time. That led to our next part: a custom joiner

## Custom Joiner
In order to process execution, we have separated microservice as multiple topics, the easier topology to understand is:
- a topic with the executions (with multiple tasks)
- a topic with task results.

To allow the next task to start, we need to create a state with all task results merge into the current execution. The first choice was to use a simple `join()` from Kafka Streams, what a terrible choice!

All join provided by Kafka Streams were designed thinking with aggregation in minds (like sum, avg, ...) and works well for that case. How? It will simply process all the incoming data from both topics 1 per 1, we will see all the changes on the streams on both sides, as seen below :

```
# timeline
--A-------- > Execution
-----B--C-- > Task Result

# join result timeline
- (A,null)
- (A, B) => emit (A+B)
- (A, C) => emit (A+C) <=== you have overwrite the result of A+B
- (A+B, null)
- (A+C, null) <== we will never have (A+B+C)
```

In our case, we are building a state machine, and we want to keep the last state of execution, meaning we don't want to see all intermediate states (like in aggregation). In that case, we have no other choice but to build [a custom joiner](https://github.com/kestra-io/kestra/blob/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/streams/ExecutorJoinerTransformer.java) since Kafka Stream doesn't have any one built-in.

To handle this case, we need to :
- create a [manually a store](https://github.com/kestra-io/kestra/blob/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/streams/ExecutorFromExecutionTransformer.java) that will save the last state of an execution
- create a custom [merge function](https://github.com/kestra-io/kestra/blob/8a17519b5b41e8ba0ab8e0044c9c6b1e887ccd94/runner-kafka/src/main/java/io/kestra/runner/kafka/executors/ExecutorMain.java#L216-L246) that will merge the execution stream with the task results stream
- [get the last value](https://github.com/kestra-io/kestra/blob/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/streams/ExecutorJoinerTransformer.java) from the state, add the task result and emit the new state that will be saved finally on the store and the final topics.

With all of that, we are sure that the execution state will always be the last version whatever the number of tasks results coming in parallel.

## Easy distributed workload between multiple backends

In [Kestra](https://github.com/kestra-io/kestra), we have a scheduler that will look up all flows to schedule (timed-based) execution or with a long-pooling mechanism (detect file on file systems like S3 or SFTP). As we wanted to have no single point of failure also on this service, we need to split all the flow between all instances of schedulers.

To handle that case, we rely on Kafka's consumer groups that will handle the whole complexity of a distributed system for us. The logic is :
- Create a [Kafka stream](https://github.com/kestra-io/kestra/blob/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/KafkaFlowListeners.java) that will read in a `KTable` and transmit all the result to a `Consumer`
- Listen to state change, meaning mostly `REBALANCED` Streams, and empty all the flows for the `Consumer`
- On the `READY` state, read all the `KTable` again.

With these, all flows will be dispatched on all listeners, that's mean if you have 1,000 flows, approximately every consumer will have ~ 500 flows (depending on the repartition of keys). Kafka will handle all the heavy parts of the distributed systems :
- Heartbeat to detect failure for a consumer
- Notifying of rebalancing
- Ensure exactly-once pattern for a topic, giving the assurance that only one consumer will handle the data.

This way you will have a fully distributed system thanks to Kafka without the pain to pass a Jespen analysis.

## Use partitions to detect dead consumers
For [Kestra](https://github.com/kestra-io/kestra), we need to detect when a worker was processing a task and died (many cases possible through outage to simple restart during processing works).

Thanks to Kafka consumer, we can know the partition that is affected this consumer. We use these nice features to detect dead workers. How? Here is the logic :
- We create a `UUID` a startup for the worker
- When a consumer connects to Kafka, we [listen to partitions](https://github.com/kestra-io/kestra/blob/4a61af45d668feab19313b9033826fa7075bf02b/runner-kafka/src/main/java/io/kestra/runner/kafka/KafkaWorkerTaskQueue.java#L157-L187) affected using a `ConsumerRebalanceListener` and we publish to Kafka a WorkerInstance with `UUID` and partition assigned.
- For each task run, we publish a message with [TaskRunning](https://github.com/kestra-io/kestra/blob/4a61af45d668feab19313b9033826fa7075bf02b/runner-kafka/src/main/java/io/kestra/runner/kafka/KafkaWorkerTaskQueue.java#L112-L123) with the Worker UUID

Now, let's handle the data stored in Kafka. The main logic is a [Kafka Stream](https://github.com/kestra-io/kestra/blob/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/streams/WorkerInstanceTransformer.java) that:
- Create a global `KTable` with all the `WorkerInstance`
- On every change, it will listen to `WorkerInstance` changed
- If there is a new `WorkerInstance`, we look at the partition assigned on this one, if there is an overlap between this instance partitions and the previous, we are sure that the previous `WorkerInstance` is dead (in Kafka, you can't have 2 consumers on the same partition).
- We only need to look at the Task affected to this `WorkerInstance` and resend them for processing.

Et voila 🎉 We have detection of dead consumers for free only with Kafka  API.

## State store `all()`

We need to use a [GlobalKTable](https://kafka.apache.org/31/documentation/streams/developer-guide/dsl-api.html#streams_concepts_globalktable) in order to detect [flow trigger](/docs/developer-guide/triggers/flow.html): for all the flow on the cluster, we test all the flows [conditions](/docs/developer-guide/conditions/) in order to find matching flows. For this, we are using an API to fetch all flows from a `GlobalKTable` using `store.all()` that returned all the flows, fetching RockDb.

The first assumption is that `all()` returned is an object (Flow in our case), as the API return Object, but we discovered that the `all()` will:
- fetch all the data from RockDB (ok for that)
- deserialize the data from RockDB that is stored as byte and map it to concrete Java POJO


So each time we call `all()` on the method, all values are deserialized, which can lead to high CPU usage and latency on your stream. For our usage case, we are talking about all flows revision on our cluster, 2,500 flows (last revision) in our cases, but we don't see people are creating a lot of revisions (100,000), imagine 100,000 `byte[]` to deserialize to POJO for every call (mostly all the execution end).

Since we only need the last revision in our use case, we create an in-memory Map with all the flows using:

```java
builder.addGlobalStore(
    Stores.keyValueStoreBuilder(
        Stores.persistentKeyValueStore(FLOW_STATE_STORE_NAME),
        Serdes.String(),
        JsonSerde.of(Flow.class)
    ),
    kafkaAdminService.getTopicName(Flow.class),
    Consumed.with(Serdes.String(), JsonSerde.of(Flow.class)).withName("GlobalStore.Flow"),
    () -> new GlobalInMemoryStateProcessor<>(
        FLOW_STATE_STORE_NAME,
        flows -> kafkaFlowExecutor.setFlows(flows),
        store -> kafkaFlowExecutor.setStore(store)
    )
);
```
with [GlobalInMemoryStateProcessor](https://github.com/kestra-io/kestra/blob/master/runner-kafka/src/main/java/io/kestra/runner/kafka/streams/GlobalInMemoryStateProcessor.java) a simple wrapper that saves to state store and sends a full list on every change (not so frequent) and decided to gather all flow in memory. This works well on our use cases because we know that an instance of Kestra will not have millions of flows.

But keep in mind, all store operations (also get) will lead to deserialization that costs you some CPU.


## Many source topics within a stream
At first, we designed [Kestra](https://github.com/kestra-io/kestra) to have only one **huge** stream for all the processing from the executor. At first, it seems to be cool but this lead to some drawback.


Here is the last version of our main and only one Kafka Stream with many topics 🙉:
![Kestra Topology](./2022-06-28-tips-kafka-streams-distributed/topology.jpg)
Yes, this is some kind of very large Kafka Streams. It was working almost despite the complexity of this one. But the major drawback was :
- **Monitoring**: all the metrics are under the same consumer groups
- **Debugging**: during a crash, each topic is consumed independently, when a message failed, the whole process is crashed
- and the most important is **lag**: since Kafka Stream optimizes the consumption of messages by themselves, a topic with large outputs could lead to lag on other topics unrelated topics. In that case, impossible to understand properly the lag on our consumer.

Now, we have decided to split into multiple [streams](https://github.com/kestra-io/kestra/tree/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/executors) to be able to monitors and understand properly the lag on our Kafka Streams.

How to split your evil streams? We simply choose to consume only one time a topic (to avoid large network transit), so we grouped all streams by source topics.


## Conclusion

We have covered here some tips that took us a large amount of time to find the way to deal with the issue. [Kestra](https://github.com/kestra-io/kestra) is the only infinitely scalable data orchestration and scheduling platform, that used Kafka as backend, that allows millions of executions.

We hope you have enjoyed this one, stay connected, and follow Kestra on [GitHub](https://github.com/kestra-io/kestra), [Twitter](https://twitter.com/kestra_io), or [Slack](https://api.kestra.io/v1/communities/slack/redirect).
