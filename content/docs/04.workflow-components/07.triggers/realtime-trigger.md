---
title: Realtime Trigger
icon: /docs/icons/flow.svg
version: ">= 0.17.0"
---

React to events as they happen with millisecond latency.


[Triggers](./index.md) in Kestra can listen to external events and start a workflow execution when the event occurs. Most of these triggers **poll** external systems for new events **at regular intervals** e.g. every second. This works well for data processing use cases. However, business-critical workflows often require reacting to events as they happen with **millisecond latency** and this is where **Realtime Triggers** come into play.

<div class="video-container">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/bLzk4dKc95g?si=To23PJ0Ags7Mtb7f" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What are Realtime Triggers

Realtime triggers listen to events in real time and start a workflow execution as soon as:
- a new message is published to a [Kafka topic](/plugins/plugin-kafka/triggers/io.kestra.plugin.kafka.realtimetrigger)
- a new message is published to a [Pulsar topic](/plugins/plugin-pulsar/triggers/io.kestra.plugin.pulsar.realtimetrigger)
- a new message is published to an [AMQP queue](/plugins/plugin-amqp/triggers/io.kestra.plugin.amqp.realtimetrigger)
- a new message is published to an [MQTT queue](/plugins/plugin-mqtt/triggers/io.kestra.plugin.mqtt.realtimetrigger)
- a new message is published to an [AWS SQS queue](/plugins/plugin-aws/triggers/sqs/io.kestra.plugin.aws.sqs.realtimetrigger)
- a new message is published to [Google Pub/Sub](/plugins/plugin-gcp/triggers/pubsub/io.kestra.plugin.gcp.pubsub.realtimetrigger)
- a new message is published to [Azure Event Hubs](/plugins/plugin-azure/triggers/eventhubs/io.kestra.plugin.azure.eventhubs.realtimetrigger)
- a new message is published to a [NATS subject](/plugins/plugin-nats/triggers/io.kestra.plugin.nats.realtimetrigger)
- a new item is added to a [Redis list](/plugins/plugin-redis/triggers/io.kestra.plugin.redis.realtimetriggerlist)
- a new row is added, modified or deleted in [Postgres](/plugins/plugin-debezium-postgres/triggers/io.kestra.plugin.debezium.postgres.realtimetrigger), [MySQL](/plugins/plugin-debezium-mysql/triggers/io.kestra.plugin.debezium.mysql.realtimetrigger), or [SQL Server](/plugins/plugin-debezium-sqlserver/triggers/io.kestra.plugin.debezium.sqlserver.realtimetrigger).

## How Realtime Triggers Work

As soon as you add a Realtime Trigger to your workflow, Kestra starts an always-on thread that listens to the external system for new events. When a new event occurs, Kestra starts a workflow execution to process the event.


## Use Cases

Using Realtime Triggers, you can orchestrate **business-critical processes** and **microservices** in real time. This covers scenarios such as:
- fraud and anomaly detection,
- order processing,
- realtime predictions or recommendations,
- reacting to stock price changes,
- shipping and delivery notifications,
- ...and many more use cases that require reacting to events as they happen.

In addition, Realtime Triggers can be used for **data orchestration**, especially for **Change Data Capture** use cases. The [Debezium Postgres RealtimeTrigger](/plugins/plugin-debezium-postgres/triggers/io.kestra.plugin.debezium.postgres.realtimetrigger) plugin can listen to changes in a database table and start a workflow execution as soon as a new row is inserted, updated, or deleted.

## When to use Triggers vs. Realtime Triggers

The table below compares Triggers with Realtime Triggers to help you choose the right trigger type for your use case:

| Criteria             | Trigger                                                               | Realtime Trigger                                                                                |
|----------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| **Implementation**   | Micro-batch                                                           | Realtime                                                                                        |
| **Event Processing** | Batch-process all events received until the poll interval has elapsed | Process each event immediately as it happens                                                    |
| **Latency**          | Second(s) or minute(s)                                                | Millisecond(s)                                                                                  |
| **Execution Model**  | Each execution processes one or many events                           | Each execution processes exactly one event                                                      |
| **Data Handling**    | Store all received events in a file                                   | Store each event in a raw format                                                                |
| **Output format**    | URI of a file in internal storage                                     | Raw data of the event payload and related metadata                                              |
| **Application**      | Data applications processing data in batch                            | Business-critical operations reacting to events in real time                                    |
| **Use cases**        | Data orchestration for analytics and building data products           | Process and microservice orchestration (real time updates, anomaly detection, order processing) |


## How to Use Realtime Triggers

To use Realtime Triggers, simply choose the `RealtimeTrigger` as a trigger type of your desired service. Here, we use the `RealtimeTrigger` to [listen to new messages in an AWS SQS queue](https://youtu.be/bLzk4dKc95g):

```yaml
id: sqs
namespace: realtime

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger }}"

triggers:
  - id: realtime_trigger
    type: io.kestra.plugin.aws.sqs.RealtimeTrigger
    region: eu-north-1
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID')}}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    queueUrl: https://sqs.eu-north-1.amazonaws.com/123456789/MyQueue
```

## Comparison with Realtime Data Processing Engines

It's important to note that Kestra's Realtime Triggers are not intended to be used as a replacement for real-time data processing engines such as Apache Flink, Apache Beam or Google Dataflow.

Those data processing engines excel at **stateful** streaming applications and complex SQL transformations over real-time data streams.

In contrast, Kestra's Realtime Triggers are **stateless**, meaning they trigger one workflow execution per event. They are designed primarily to react to events in real time to orchestrate business-critical processes.
