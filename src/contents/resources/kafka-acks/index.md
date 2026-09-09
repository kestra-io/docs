---
title: "Kafka Acks Explained: Balancing Durability and Throughput"
description: "Kafka acknowledgments (acks) are crucial for producer reliability. Understand how acks=0, acks=1, and acks=all impact data durability, performance, and availability in your Kafka workflows."
metaTitle: "Kafka Acks Explained: Durability, Performance, Throughput"
metaDescription: "Kafka acks (0, 1, all) balance durability, throughput, and latency. Understand how producer acknowledgments work and configure them reliably."
tag: data
date: 2026-08-11
slug: "kafka-acks"
faq:
  - question: "What are ACKs in Kafka?"
    answer: "ACKs (acknowledgments) in Kafka refer to the setting that dictates how many Kafka brokers must acknowledge a message before the producer considers the write successful. This configuration is critical for balancing data durability, ensuring messages are not lost, with the performance and latency of message production."
  - question: "Does Kafka have an ACK?"
    answer: "Yes, Kafka producers use the 'acks' property to configure acknowledgment behavior. This setting determines if and how the producer waits for confirmation that messages have been successfully written to the Kafka cluster's brokers, directly influencing data safety and write performance."
  - question: "What is the Acks property in Kafka?"
    answer: "The 'acks' property in a Kafka producer's configuration specifies the level of acknowledgment required from Kafka brokers. It can be set to 0 (no acknowledgment), 1 (leader acknowledgment), or 'all' (full in-sync replica acknowledgment), each offering a different trade-off between durability and throughput."
  - question: "How does Kafka ACK work?"
    answer: "Kafka ACK works by having the producer send messages and then wait for a specified number of acknowledgments from the broker(s) before proceeding. Depending on the 'acks' setting (0, 1, or 'all'), the producer either doesn't wait, waits for the leader, or waits for all in-sync replicas to confirm the message write."
  - question: "Which one is better, Kafka or RabbitMQ?"
    answer: "Kafka and RabbitMQ serve different primary use cases. Kafka is generally better for high-throughput, fault-tolerant streaming data, while RabbitMQ excels at flexible message routing and complex queueing patterns. The 'better' choice depends on your specific application requirements for messaging and event streaming. For a detailed comparison, see our guide on RabbitMQ vs. Kafka."
---

> **TL;DR** — Kafka acknowledgments (acks) are a producer configuration that determines the level of durability for messages sent to a Kafka cluster, directly impacting throughput, latency, and data loss risk.

Reliably delivering data in a distributed streaming system like Kafka is a constant balancing act. Producers need to send messages quickly, but they also need assurance that those messages won't disappear. This tension between speed and safety is where Kafka's acknowledgment mechanism, known as `acks`, becomes critical.

Understanding and configuring `acks` correctly is fundamental for any Kafka deployment. This article will demystify Kafka acks, explaining how the different settings (`0`, `1`, `all`) directly impact your data's durability, the performance of your producers, and the overall availability of your message delivery.

## How Kafka Acks Work: Balancing Durability and Throughput

The `acks` setting is a producer-side configuration that determines how many acknowledgments the producer requires from broker replicas before considering a message successfully sent. Before diving into the `acks` values, it's essential to understand two core concepts from [Apache Kafka's architecture](/resources/data/what-is-kafka):

*   **Leader Replica**: For each topic partition, one broker acts as the "leader." All producer writes and consumer reads for that partition go through the leader.
*   **In-Sync Replicas (ISR)**: These are follower replicas that are fully caught up with the leader's log. They serve as hot standbys, ready to take over as leader if the current leader fails.

The `acks` setting leverages this leader/follower model to provide tunable durability guarantees. It's a fundamental concept in any [message queue](/resources/infrastructure/message-queue) system that offers replication.

### Acks=0: The "Fire and Forget" Approach

When a producer's `acks` are set to `0`, it sends the message to the leader broker and immediately considers it successful without waiting for any acknowledgment.

*   **Durability**: Lowest. Data can be lost if the leader broker fails before it has a chance to write the message to its log or replicate it. The producer will never know the message was dropped.
*   **Performance**: Highest throughput and lowest latency. The producer doesn't wait for any network round-trip from the broker, allowing it to send messages as fast as the network allows.
*   **Use Case**: Best for non-critical data where some loss is acceptable, such as metrics collection, logging, or IoT sensor data where occasional gaps are tolerated.

### Acks=1: Leader Acknowledgment for a Balance

With `acks=1`, the producer sends a message and waits for an acknowledgment from the leader replica only. The leader responds as soon as it writes the message to its local log, without waiting for follower replicas to confirm they have copied it. This is the default setting in Kafka.

*   **Durability**: Moderate. The message is confirmed to be on at least one broker (the leader). However, data loss can still occur if the leader fails immediately after acknowledging the message but before any followers have replicated it.
*   **Performance**: A good balance between throughput and durability. It introduces some latency due to the network round-trip for the leader's acknowledgment but is significantly more reliable than `acks=0`.
*   **Use Case**: Suitable for many common scenarios where a small risk of data loss in specific failure modes is acceptable, such as general application event tracking or analytics pipelines.

### Acks=all (-1): Ensuring Maximum Durability

Setting `acks` to `all` (or its equivalent, `-1`) provides the strongest available durability guarantee. The producer waits for the leader to receive acknowledgments from all brokers in the current in-sync replica (ISR) set.

*   **Durability**: Highest. As long as at least one in-sync replica remains online, the message will not be lost. This setting works in tandem with the broker-side configuration `min.insync.replicas`. If you set `min.insync.replicas=2` and `acks=all`, the producer will only receive a successful acknowledgment if the message is written to the leader and at least one follower.
*   **Performance**: Lowest throughput and highest latency of the three settings. The producer must wait for the message to be replicated across the network to follower brokers and for their acknowledgments to return.
*   **Use Case**: Essential for critical data where no loss can be tolerated, such as financial transactions, e-commerce orders, or audit trail events.

## Why Reliable Acknowledgments Need Orchestration

Simply setting `acks=all` is not enough to guarantee end-to-end reliability. In a production environment, managing Kafka producers involves more than just a single configuration parameter. This is where an orchestration platform becomes essential for several reasons:

*   **Dynamic Configuration**: Different data streams have different criticality. An orchestration platform can manage multiple producer flows, applying `acks=all` for financial data and `acks=1` for application logs, all within a governed framework.
*   **Automated Error Handling**: What happens when a producer with `acks=all` fails due to an insufficient number of in-sync replicas? An orchestration layer can automatically trigger alerts, retry the message with an exponential backoff strategy, or route it to a dead-letter queue for manual inspection.
*   **Observability and Auditing**: An orchestration platform provides a centralized view of all producer activity. It logs every success and failure, making it easy to audit delivery guarantees and troubleshoot issues without parsing scattered producer logs.
*   **Simplified Management**: Orchestration allows you to manage `acks` declaratively alongside other critical Kafka settings like idempotence and transactions. This configuration-as-code approach simplifies maintenance and ensures consistency across environments.

## Orchestrate Kafka Producer Acks with Kestra: Ensuring Delivery Guarantees

With Kestra, you can [orchestrate Kafka](/orchestration/kafka) workflows declaratively, ensuring that producer settings like `acks` are explicitly defined, version-controlled, and consistently applied.

The following flow demonstrates producing a message to a Kafka topic with `acks` set to `all` for maximum durability. If the produce task fails for any reason (e.g., brokers are unavailable or `min.insync.replicas` is not met), an error-handling task is triggered to log the failure for immediate investigation.

```yaml
id: kafka-guaranteed-delivery
namespace: company.team.production

inputs:
  - id: message_key
    type: STRING
    defaults: "order-12345"
  - id: message_value
    type: STRING
    defaults: '{"orderId": "12345", "amount": 99.99, "status": "CONFIRMED"}'

tasks:
  - id: produce-message
    type: io.kestra.plugin.kafka.Produce
    description: Produce a critical message with the highest durability guarantee.
    brokers: "{{ secret('KAFKA_BROKERS') }}"
    topic: critical_orders
    acks: all
    key: "{{ inputs.message_key }}"
    value: "{{ inputs.message_value }}"

  - id: log-success
    type: io.kestra.plugin.core.log.Log
    message: "Message produced successfully to Kafka topic {{ outputs['produce-message'].topic }} with acks=all."
    level: INFO

errors:
  - id: handle-failure
    type: io.kestra.plugin.core.log.Log
    message: "Failed to produce message to Kafka. Exception: {{ error.message }}"
    level: ERROR
```

Here’s what this declarative flow accomplishes:

*   **Explicit Durability**: The `acks: all` setting is clearly defined in the YAML, leaving no room for ambiguity. This is version-controlled in Git and auditable.
*   **Robust Error Handling**: The `errors` block provides a clean, built-in mechanism for handling failures. Instead of complex `try/catch` logic in producer code, the platform manages exceptions.
*   **Secret Management**: Broker connection strings are securely managed via Kestra's secret management, not hardcoded in scripts.
*   **Plugin-Based Simplicity**: The entire operation is handled by the official Kestra [Apache Kafka plugin](/plugins/plugin-kafka), abstracting away the boilerplate of Kafka client libraries.

### Choosing Between Batch and Realtime Kafka Triggers

When consuming messages, Kestra offers two primary mechanisms: the `Trigger` for batch processing and the `RealtimeTrigger` for streaming.

*   **`Trigger`**: Polls the topic on a schedule (e.g., every minute) and processes all new messages in a single batch execution. This is ideal for periodic data loads and analytics.
*   **`RealtimeTrigger`**: Maintains a persistent connection and processes each message as it arrives, triggering a new flow execution for every message. This is suited for low-latency, event-driven applications.

The choice of consumer model can influence your producer `acks` strategy. For example, a realtime pipeline processing financial transactions will almost certainly require `acks=all` on the producer side to prevent data loss.

## Advanced Considerations for Kafka Producer Reliability

### Idempotence and Transactional Producers with Acks

Even with `acks=all`, network issues can cause a producer to retry sending a message that was already successfully committed, leading to duplicate records. Kafka addresses this with two features:

*   **Idempotent Producer**: By setting `enable.idempotence=true`, the producer attaches a sequence number to each message. The broker tracks these numbers and discards any duplicates, guaranteeing exactly-once delivery per producer session. Enabling idempotence requires `acks` to be set to `all`.
*   **Transactional Producer**: Transactions extend idempotence across multiple partitions and topics. They allow you to group a series of produce and consume operations into a single atomic unit. This is the gold standard for exactly-once semantics in stream processing applications. Transactions also require `acks=all`.

For advanced use cases, refer to Kestra's documentation on [Enterprise and Advanced Configuration](/docs/configuration/enterprise-and-advanced).

### Troubleshooting Acks-Related Issues

When using stricter `acks` settings, you might encounter issues like:
*   **`TimeoutException`**: The producer did not receive acknowledgments within the configured `request.timeout.ms`. This can happen if the cluster is under heavy load or if there are network issues.
*   **`NotEnoughReplicasException`**: The number of available in-sync replicas is less than what is required by `min.insync.replicas`, preventing the producer from getting the required acknowledgments.
*   **`LeaderNotAvailableException`**: The leader for the partition is temporarily unavailable, often during a leadership election.

Debugging these often involves checking broker health, network connectivity between clients and brokers, and ensuring your topic's replication factor is appropriate for your `acks` and `min.insync.replicas` settings.

## Where Kafka Acks Pay Off

Configuring the right `acks` setting is crucial across various domains:
*   **Financial Services**: For processing payments, trades, and other transactions, `acks=all` is non-negotiable to prevent data loss.
*   **Real-Time Analytics**: Ingesting user activity for real-time dashboards often uses `acks=1` to balance data freshness with reliability.
*   **IoT Data Ingestion**: Collecting high-volume sensor data might use `acks=0` or `acks=1`, as losing a few data points is often acceptable for the sake of performance.
*   **Auditing and Compliance**: Systems that require a verifiable audit trail of events must use `acks=all` to ensure every message is durably stored.

## Related concepts

*   [Message Queue: A Guide to Asynchronous Communication](/resources/infrastructure/message-queue)
*   [Orchestrate Kafka with Kestra](/orchestration/kafka)
*   [What Is Apache Kafka? Architecture & Orchestration](/resources/data/what-is-kafka)
*   [Apache Kafka Plugin for Kestra](/plugins/plugin-kafka)
*   [RabbitMQ vs Kafka: Messaging and Event Streaming Comparison](/resources/data/rabbitmq-vs-kafka)
*   [Enterprise & Advanced Configuration in Kestra](/docs/configuration/enterprise-and-advanced)

Ready to simplify your Kafka operations and ensure data delivery? Explore how Kestra can orchestrate your event-driven workflows.
