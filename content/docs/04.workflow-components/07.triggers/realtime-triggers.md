---
title: Real-time Triggers
icon: /docs/icons/flow.svg
version: ">= 0.17.0"
---

React to events as they happen with millisecond latency.


[Triggers](index.md) in Kestra can listen to external events and start a workflow execution when the event occurs. Most of these triggers **poll** external systems for new events **at regular intervals** e.g. every second. This works well for data processing use cases. However, business-critical workflows often require reacting to events as they happen with **millisecond latency** and this is where **Real-time Triggers** come into play.

<div class="video-container">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/bLzk4dKc95g?si=To23PJ0Ags7Mtb7f" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What are Real-time Triggers

Real-time triggers listen to events in real-time and start a workflow execution as soon as:
- a new message is published to a [Kafka topic](/plugins/plugin-kafka/triggers/io.kestra.plugin.kafka.realtimetrigger)
- a new message is published to an [AMQP queue](/plugins/plugin-amqp/triggers/io.kestra.plugin.amqp.realtimetrigger)
- a new message arrives in [AWS SQS](/plugin-aws/triggers/sqs/io.kestra.plugin.aws.sqs.realtimetrigger) or [Google Pub/Sub](/plugins/plugin-gcp/triggers/pubsub/io.kestra.plugin.gcp.pubsub.realtimetrigger)
- a new key is added to a [Redis list](/plugins/plugin-redis/triggers/io.kestra.plugin.redis.realtimetriggerlist)
- ...and many more.

## Use Cases

Using Real-time Triggers, you can orchestrate **business-critical processes** and **microservices** in real-time. This covers scenarios such as:
- fraud and anomaly detection,
- order processing,
- real-time predictions or recommendations,
- reacting to stock price changes,
- shipping and delivery notifications.

In addition, real-time triggers can be used for **real-time data orchestration** using our Change Data Capture (CDC) plugins. For example, you can use the [Debezium Postgres](/plugins/plugin-debezium-postgres/triggers/io.kestra.plugin.debezium.postgres.realtimetrigger) plugin to listen to changes in a database table and start a workflow execution as soon as a new row is inserted, updated, or deleted.

## When to use Triggers vs. Real-time Triggers

The table below compares Triggers with Real-time Triggers to help you choose the right trigger type for your use case:

| Criteria             | Trigger                                                               | Real-time Trigger                                                                               |
|----------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| **Implementation**   | Micro-batch                                                           | Real-time                                                                                       |
| **Event Processing** | Batch-process all events received until the poll interval has elapsed | Process each event immediately as it happens                                                    |
| **Latency**          | Second(s) or minute(s)                                                | Millisecond(s)                                                                                  |
| **Execution Model**  | Each execution processes one or many events                           | Each execution processes exactly one event                                                      |
| **Data Handling**    | Store all received events in a file                                   | Store each event in a raw format                                                                |
| **Output format**    | URI of a file in internal storage                                     | Raw data of the event payload and related metadata                                              |
| **Application**      | Data applications processing data in batch                            | Business-critical operations reacting to events in real-time                                    |
| **Use cases**        | Data orchestration for analytics and building data products           | Process and microservice orchestration (real-time updates, anomaly detection, order processing) |


## How to Use Real-time Triggers

To use Real-time Triggers, simply choose the `RealtimeTrigger` as a trigger type of your desired service. Here, we use the `RealtimeTrigger` to [listen to new messages in an AWS SQS queue](https://youtu.be/bLzk4dKc95g):

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

