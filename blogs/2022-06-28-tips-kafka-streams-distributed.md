---
title: "Advanced tips and techniques for Kafka Streams"
description: Discover some tips and clever techniques that will help you build resilient and distributed applications
date: 2022-06-27T10:00:00
layout: BlogsPost
author:
  name: Ludovic Dehon
  image: "ldehon"
  twitter: "@tchiotludo"
image: /blogs/2022-06-28-tips-kafka-streams-distributed.jpg
draft: true
---

When it comes to advantages, the distributed event store and streamlining platform Kafka has many. Think high-throughput, low latency, durability, high concurrency, scalability, and fault-tolerance, and you have an idea of what I am talking about. So, it's not surprising that when we built [Kestra](https://github.com/kestra-io/kestra), an open-source data orchestration and scheduling platform, we decided to use Kafka as the central database to build a scalable architecture. Since Kafka allows high-throughput, which allows it to handle high-volume data at equally high velocity, we're confident of a fully scalable solution. However, we need to adapt to Kafka.

Considering our heavy reliance on [Kafka Streams](https://kafka.apache.org/documentation/streams/) for most of our services (executor and scheduler in our case), we have made some assumptions regarding how it handles the workload. In this blog post, I will show some advanced techniques we employed to make Kafka Stream more reliable. We discovered most of the tips I share here in the last two years.

## Same topic as source and destination
In [Kestra](https://github.com/kestra-io/kestra), we have a topic with the current execution, that is, the source and also the destination. We only update the current execution, to add some information and send it back to Kafka for further processing (new tasks status, for example). Is this design possible with Kafka? To find out, we asked [Matthias J. Sax](https://twitter.com/tchiotludo/status/1252197729406783488), one of the leading maintainers of Kafka Streams. He responded on [Stack Overflow](https://stackoverflow.com/questions/61316312/does-kafka-stream-with-same-sink-source-topics-with-join-is-supported).

The short answer: YES, it's possible. 

The long one: YES, it's possible **IF** you are 100% sure that for the same key (the execution in our case), you **have only one** process that can write. If you see this warning in the console `Detected out-of-order KTable update for execution at offset 10, partition 7,` the above statement probably refers to you, and this can lead to unexpected behavior. An example of such behavior could be overwriting of previous values. 

Struggling to understand what this means? Let me explain, imagine a topology with the topic as the source, some branching logic, and different process writing to the same destinations:
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

In that case, a concurrent process can write on the same topic, overwriting the previous value and dismantling the previous computing methods.
In such a context, you must define a single writer for a key at the same time. This leads to our next part: the custom joiner.

## Custom Joiner
To process execution, we have separated microservice into multiple topics. The more straightforward topology to understand is:
- A topic with the executions (with multiple tasks)
- A topic with task results

To allow the next task to start, we need to create a state with all task results merged into the current execution. The first choice was to use a simple `join()` from Kafka Streams. In hindsight, we can tell you that this was not such a very clever decision!

All join operations provided by Kafka Streams were designed with aggregation in mind (like sum, avg, and so on) and work well for such cases. How? It processes all incoming data from both topics one-on-one. We then see all the changes on the streams on both sides, as illustrated below:

```
# timeline
--A-------- > Execution
-----B--C-- > Task Result

# join result timeline
- (A,null)
- (A, B) => emit (A+B)
- (A, C) => emit (A+C) <=== you have overwritten the result of A+B
- (A+B, null)
- (A+C, null) <== we will never have (A+B+C)
```

In our case, we are building a state machine, and want to keep the last state of execution. This means we don't want to see all intermediate states (like in aggregation). In that case, we have no choice but to build [a custom joiner](https://github.com/kestra-io/kestra/blob/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/streams/ExecutorJoinerTransformer.java), since Kafka Stream doesn't have a built-in one.

To handle this case, we need to:
- [Manually create a store](https://github.com/kestra-io/kestra/blob/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/streams/ExecutorFromExecutionTransformer.java) that will save the last state of an execution.
- Create a custom [merge function](https://github.com/kestra-io/kestra/blob/8a17519b5b41e8ba0ab8e0044c9c6b1e887ccd94/runner-kafka/src/main/java/io/kestra/runner/kafka/executors/ExecutorMain.java#L216-L246) that will merge the execution stream with the task results stream.
- [Get the last value](https://github.com/kestra-io/kestra/blob/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/streams/ExecutorJoinerTransformer.java) from the state, add the task result and produce the new state that will be saved finally on the store and the final topics.

With all the tasks above, we are sure that the execution state will always be the last version, whatever the number of tasks results coming in parallel.

## Easy distribution of workload between multiple backends

In [Kestra](https://github.com/kestra-io/kestra), we have a scheduler that will look up all flows to schedule (timed-based) execution or use a long-pooling mechanism (detect the file on file systems like S3 or SFTP). Since we don't want to have a single point of failure in this service, we need to split the entire flow between all instances of schedulers.

To handle that case, we rely on Kafka's consumer groups, which will handle the whole complexity of a distributed system for us. The logic is:
- Create a [Kafka stream](https://github.com/kestra-io/kestra/blob/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/KafkaFlowListeners.java) that will read in a `KTable` and transmit all the results to a `Consumer.`
- Listen to state change, meaning mostly `REBALANCED` Streams, and empty all the flows for the `Consumer.`
- On the `READY` state, read all the `KTable` again.

With these, all flows will be dispatched to all listeners. This means that if you have 1,000 flows, every consumer will have ~ 500 flows (depending on the repartition of keys). Kafka will handle all the heavy parts of the distributed systems:
- Heartbeat to detect failure for a consumer.
- Notifications relating to rebalancing.
- Ensure exactly one pattern for a topic, ensuring that only one consumer will handle the data.

This way, you will have a fully distributed system, thanks to Kafka, without the pain of going through a Jespen analysis.

## Use partitions to detect dead consumers
For [Kestra](https://github.com/kestra-io/kestra), we need to detect when a worker "died" while processing a task. This "dying" can be attributed to different reasons, including a power outage or restarting a computer during processing.

Thanks to Kafka consumer, we can know the specific partition that affected such a consumer. We use these valuable features to detect "dead" workers. How? Here is the logic:
- We create a `UUID` startup for the worker.
- When a consumer connects to Kafka, we [listen to affected partitions](https://github.com/kestra-io/kestra/blob/4a61af45d668feab19313b9033826fa7075bf02b/runner-kafka/src/main/java/io/kestra/runner/kafka/KafkaWorkerTaskQueue.java#L157-L187) using a `ConsumerRebalanceListener` and we publish to Kafka a WorkerInstance with `UUID` and partition assigned.
- For each task run, we publish a message with [TaskRunning](https://github.com/kestra-io/kestra/blob/4a61af45d668feab19313b9033826fa7075bf02b/runner-kafka/src/main/java/io/kestra/runner/kafka/KafkaWorkerTaskQueue.java#L112-L123) with the Worker UUID.

Now, let's handle the data stored in Kafka. The main logic is a [Kafka Stream](https://github.com/kestra-io/kestra/blob/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/streams/WorkerInstanceTransformer.java) that:
- Creates a global `KTable` with all the `WorkerInstance.`
- Listens to `WorkerInstance` changed for every change.
- If there is a new `WorkerInstance,` we look at the partition assigned. Where there is an overlap between this instance's partitions and the previous ones, we are sure that the previous `WorkerInstance` is dead. This is because you can't have two consumers on the same partition in Kafka. 
- We only need to look at the task affected for this `WorkerInstance` and resend it for processing.

Et voila 🎉 We can detect dead consumers for free with Kafka API.

## State store `all()`

We need to use a [GlobalKTable](https://kafka.apache.org/31/documentation/streams/developer-guide/dsl-api.html#streams_concepts_globalktable) to detect [flow trigger](/docs/developer-guide/triggers/flow.html). To find matching flows, we test all the flows on the cluster [conditions](/docs/developer-guide/conditions/). For this purpose, we are using an API to fetch all flows from a `GlobalKTable` using `store.all()` that returned all the flows, fetching RockDb.

The first assumption is that `all()` returned is an object (Flow in our case), as the API return object. However, we discovered that the `all()` will:
- Fetch all the data from RockDB (But for what?).
- Deserialize the data from RockDB that is stored as byte and map it to concrete Java POJO.


So each time we call `all()` on the method, all values are deserialized, which can lead to high CPU usage and latency on the stream. For our usage case, we are talking about revision of all flows on our cluster. That means 2,500 flows (i.e. last revision) in our sample cases. However, we don't see people creating a lot of revisions (100,000). Imagine 100,000 `byte[]` to deserialize to POJO for every call (mostly all the execution end).

Since we only need the last revision in our use case, we create an in-memory map with all the flows using the following:

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
We accomplish this with [GlobalInMemoryStateProcessor](https://github.com/kestra-io/kestra/blob/master/runner-kafka/src/main/java/io/kestra/runner/kafka/streams/GlobalInMemoryStateProcessor.java), a simple wrapper that saves to state store and sends a complete list on every change (even though this doesn't happen frequently) and gathers all flow in memory. This works well in our use case because we know that an instance of Kestra will not have millions of flows.

But, it's important to remember that all store operations will lead to deserialization that costs you some CPU.


## Many source topics within a stream
First, we designed [Kestra](https://github.com/kestra-io/kestra) to have only one **huge** stream for all the processing from the executor. Even though this seemed like an excellent choice initially, we would soon face some problems.


Here is the last version of our main and only Kafka Stream with many topics 🙉:
![Kestra Topology](./2022-06-28-tips-kafka-streams-distributed/topology.jpg)
Yes, this is a massive Kafka stream. Despite its complexity, it worked well. However, there is a major drawback:
- **Monitoring**: all the metrics are under the same consumer groups.
- **Debugging**: during a crash, each topic is consumed independently; when a message fails, the whole process crushes.
- **Lag** (the most important): since Kafka stream optimizes the consumption of messages by itself, a topic with large outputs could lead to lag on other unrelated topics. In that case, it is impossible to properly understand the lag on our consumer.

Now, we have decided to split into multiple [streams](https://github.com/kestra-io/kestra/tree/develop/runner-kafka/src/main/java/io/kestra/runner/kafka/executors) to be able to monitor and properly understand the lag on our Kafka streams. 

To split our bad streams, we simply choose to deal with only one topic at a time -- to avoid large network transit -- so we grouped all streams by source topics.


## Conclusion

From the insights above, we can now confidently conclude that Kafka was able to assist [Kestra](https://github.com/kestra-io/kestra) as a backend, making millions of executions possible.

We hope you have enjoyed the insights in this piece. We would love to hear what you think. Do stay connected, and follow Kestra on [GitHub](https://github.com/kestra-io/kestra), [Twitter](https://twitter.com/kestra_io), or [Slack](https://api.kestra.io/v1/communities/slack/redirect).
