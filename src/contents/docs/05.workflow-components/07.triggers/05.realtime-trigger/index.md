---
title: Realtime Trigger in Kestra – Millisecond Eventing
h1: React Instantly to Kafka, SQS, and MQTT Events
description: Achieve low-latency automation with Kestra's Realtime Triggers. React instantly to events from Kafka, SQS, MQTT, and other streaming systems.
sidebarTitle: Realtime Trigger
icon: /src/contents/docs/icons/flow.svg
---

Trigger workflows instantly as events occur, with millisecond latency.

Most Kestra [triggers](./index.md) poll external systems at a fixed interval. Realtime Triggers listen directly for events and start a flow the moment one arrives, with millisecond latency. Each Realtime Trigger runs as a dedicated listener thread on a worker; when an event arrives, the listener immediately starts a workflow execution to process it.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/bLzk4dKc95g?si=To23PJ0Ags7Mtb7f" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Supported event sources

Realtime Triggers continuously listen for events and launch a new workflow execution the moment an event occurs, such as:

- a message is published to a [Kafka topic](/plugins/plugin-kafka/io.kestra.plugin.kafka.realtimetrigger)
- a message is published to a [Pulsar topic](/plugins/plugin-pulsar/io.kestra.plugin.pulsar.realtimetrigger)
- a message is published to an [AMQP queue](/plugins/plugin-amqp/io.kestra.plugin.amqp.realtimetrigger)
- a message is published to an [MQTT queue](/plugins/plugin-mqtt/io.kestra.plugin.mqtt.realtimetrigger)
- a message is published to an [AWS SQS queue](/plugins/plugin-aws/aws-sqs/io.kestra.plugin.aws.sqs.realtimetrigger)
- a message is published to [Google Pub/Sub](/plugins/plugin-gcp/google-cloud-pubsub/io.kestra.plugin.gcp.pubsub.realtimetrigger)
- a message is published to [Azure Event Hubs](/plugins/plugin-azure/azure-event-hubs/io.kestra.plugin.azure.eventhubs.realtimetrigger)
- a message is published to a [NATS subject](/plugins/plugin-nats/nats-core/io.kestra.plugin.nats.core.realtimetrigger)
- an item is added to a [Redis list](/plugins/plugin-redis)
- a row is added, modified or deleted in [Postgres](/plugins/plugin-debezium-postgres/io.kestra.plugin.debezium.postgres.realtimetrigger), [MySQL](/plugins/plugin-debezium-mysql/io.kestra.plugin.debezium.mysql.realtimetrigger), or [SQL Server](/plugins/plugin-debezium-sqlserver/io.kestra.plugin.debezium.sqlserver.realtimetrigger).

## Configuring a Realtime Trigger

A Realtime Trigger is configured by setting `type` to the plugin's `RealtimeTrigger` class. The following example listens for new messages in an AWS SQS queue:

```yaml
id: sqs
namespace: company.team

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

## Worker failover for Realtime Triggers

Each Realtime Trigger runs as a dedicated listener thread on one specific worker. If that worker stops, the listener stops with it. Kestra's [liveness mechanism](../../../10.administrator-guide/server-lifecycle/index.md) detects this and re-emits the trigger so another available worker can pick it up.

The time before failover depends on how the worker stopped:

- **Graceful shutdown** (e.g. `docker stop`, rolling deploy): the Executor waits for `kestra.server.terminationGracePeriod` (default `PT5M`) before reassigning the trigger. This prevents duplicate processing when the worker is expected to come back shortly, such as during a rolling deployment.
- **Abrupt failure** (no heartbeat received): the Executor detects the missing heartbeat within `kestra.server.liveness.timeout` and reassigns the trigger without waiting for the grace period.

The failover time after a graceful shutdown is set by `terminationGracePeriod`:

```yaml
kestra:
  server:
    terminationGracePeriod: PT1M  # default is PT5M
```

:::alert{type="info"}
Events are not lost during the failover window. They remain in the source system (Kafka topic, SQS queue, etc.) and will be consumed once the trigger listener is restarted on another worker.
:::

Realtime Triggers are **stateless**: each event creates its own independent workflow execution.

To continue with Realtime Triggers, check out their [How-to Guide](../../../15.how-to-guides/realtime-triggers/index.md).
