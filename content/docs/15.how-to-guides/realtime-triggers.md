---
title: Realtime Triggers
icon: /docs/icons/plugins.svg
---

Realtime Triggers react to events as they happen with millisecond latency.

As soon as you add a Realtime Trigger to your workflow, Kestra starts an always-on thread that listens to the external system for new events. When a new event occurs, Kestra starts a workflow execution to process the event.

Let us understand how we can implement Realtime Trigger for some of the messaging systems.

## Apache Kafka

To setup Apache Kafka locally, follow the instructions mentioned in the [official documentation](https://kafka.apache.org/quickstart). Once Apache Kafka is installed, you can create the `logs` topic, and start producing data into the topic using the following commands:

```
# Create topic
$ bin/kafka-topics.sh --create --topic logs --bootstrap-server localhost:9092

# Produce data into Kafka topic
$ bin/kafka-console-producer.sh --topic logs --bootstrap-server localhost:9092
> Hello World
```

You can use the Apache Kafka [RealtimeTrigger](https://kestra.io/plugins/plugin-kafka/triggers/io.kestra.plugin.kafka.realtimetrigger) in the Kestra flow as follows:

```yaml
id: kafka
namespace: dev

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.value }}"

triggers:
  - id: realtime_trigger
    type: io.kestra.plugin.kafka.RealtimeTrigger
    topic: logs
    properties:
      bootstrap.servers: localhost:9092
    serdeProperties:
      valueDeserializer: STRING
    groupId: kestraConsumerGroup
```

When any message is pushed into the `logs` Kafka topic, this flow will get triggered immediately.

## Apache Pulsar

To setup Apache Pulsar locally, you can install the [standalone cluster](https://pulsar.apache.org/docs/next/getting-started-standalone/) or [docker cluster](https://pulsar.apache.org/docs/next/getting-started-docker/) for Apache Pulsar. For docker cluster, you can run the `pulsar-admin` commands from the Apache Pulsar docker container.

You can run the following commands to create the topic, and produce data to the topic:

1) Setup a tenant

`bin/pulsar-admin tenants create apache`

2) Create a namespace

`bin/pulsar-admin namespaces create apache/pulsar`

3) Create a topic

`bin/pulsar-admin topics create-partitioned-topic apache/pulsar/logs -p 4`

4) Produce data to topic

`bin/pulsar-client produce apache/pulsar/logs  -m '--Hello World--' -n 1`

You can use the Apache Pulsar [RealtimeTrigger](https://kestra.io/plugins/plugin-pulsar/triggers/io.kestra.plugin.pulsar.realtimetrigger) in the Kestra flow as follows:

```yaml
id: pulsar
namespace: dev

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.value }}"

triggers:
  - id: realtime_trigger
    type: io.kestra.plugin.pulsar.RealtimeTrigger
    topic: apache/pulsar/logs
    uri: pulsar://localhost:26650
    subscriptionName: kestra_trigger_sub
```

When any message is pushed into the `apache/pulsar/logs` Pulsar topic, this flow will get triggered immediately.

## AWS SQS

We will first create the SQS queue from the AWS Console. You can also AWS CLI for this purpose. This is how you can create the AWS SQS from the console:

![sqs_create_queue](/docs/how-to-guides/realtime-triggers/sqs_create_queue.png)

You only need to put in the Queue name. Rest all the configuration can be kept as is, and click on "Create Queue" at the bottom of the page.

You can now send messages to this queue by clicking on "Send and receive messages" button on the top of the page.

![sqs_send_and_receive_messages](/docs/how-to-guides/realtime-triggers/sqs_send_and_receive_messages.png)

On the Send and Receive messages page, you can put the Message body under the Send message section, and click on the "Send message" button to send the message to the queue.

![sqs_send_message](/docs/how-to-guides/realtime-triggers/sqs_send_message.png)

You can use the AWS SQS [RealtimeTrigger](https://kestra.io/plugins/plugin-aws/triggers/io.kestra.plugin.aws.sqs.realtimetrigger) in the Kestra flow as follows:

```yaml
id: aws-sqs
namespace: dev

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.data }}"

triggers:
  - id: "realtime_trigger"
    type: io.kestra.plugin.aws.sqs.RealtimeTrigger
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: "eu-central-1"
    queueUrl: "https://sqs.eu-central-1.amazonaws.com/000000000000/logs"
```

When any message is pushed into the `logs` SQS queue, this flow will get triggered immediately.

## GCP Pub/Sub

We will first create the Pub/Sub topic from the GCP console. For this, click on "Create topic" button on the GCP Pub/Sub console. On the Create topic page, put the topic name `logs` in the Topic ID text box, and leave the rest of the settings as default. Ensure the "Add a default subscription" checkbox is ticked. Click on "CREATE" button at the bottom. This will create the `logs` Pub/Sub topic with the default subscription `logs-sub`.

![pubsub_create_topic](/docs/how-to-guides/realtime-triggers/pubsub_create_topic.png)

![pubsub_navigate_to_messages](/docs/how-to-guides/realtime-triggers/pubsub_navigate_to_messages.png)

Navigate to the "MESSAGES" tab. On this tab, click on the "PUBLISH MESSAGE" button.

![pubsub_publish_message_button](/docs/how-to-guides/realtime-triggers/pubsub_publish_message_button.png)

On the Publish message popup, put the message you would like to publish to the topic, and click on the "PUBLISH" button on the bottom of the page. This would publish the message to the Pub/Sub topic.

![pubsub_publish_message](/docs/how-to-guides/realtime-triggers/pubsub_publish_message.png)

You can use the GCP Pub/Sub [RealtimeTrigger](https://kestra.io/plugins/plugin-gcp/triggers/io.kestra.plugin.gcp.pubsub.realtimetrigger) in the Kestra flow as follows:

```yaml
id: gcp-pubsub
namespace: dev

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.data }}"

triggers:
  - id: trigger
    type: io.kestra.plugin.gcp.pubsub.RealtimeTrigger
    projectId: test-project-id
    topic: logs
    subscription: logs-sub
```

When any message is published into the `logs` Pub/Sub topic, this flow will get triggered immediately.

This is how you can leverage the realtime triggers to react to events in real time to orchestrate business-critical processes.
