---
title: "Integrating Kestra and Debezium to capture database changes without Kafka Connect"
description: Discover how Leroy Merlin moved all their data pipelines to Google Cloud with Kestra
date: 2022-04-05T12:00:00
category: Solutions
author:
  name: Ludovic Dehon
  image: "ldehon"
  twitter: "@tchiotludo"
image: /blogs/2022-04-05-debezium-without-kafka-connect.jpg
---

There are several products on the market to help you with your data pipeline management and data orchestration. Each handles data differently, and it can be difficult to determine the differences because many perform the same tasks, but with different methods. In this article, we will be discussing the differences between Debezium with Kafka Connect and our own product, [Kestra](https://github.com/kestra-io/kestra) (an **open-source orchestration and scheduling platform** with a robust set of plugins) and how they can integrate to provide a **more efficient and cost-effective** hybrid solution.

![Debezium architecture](/blogs/2022-04-05-debezium-without-kafka-connect/debezium-architecture.png)


First, let’s discuss Debezium. [Debezium](https://debezium.io/) is an open-source change data capture platform from Red Hat, offering a set of distributed services that captures row-level changes in your databases so that connected applications can see and respond to those changes in real-time. All changes (row-level) are recorded in a transaction log, and each application simply reads the transaction logs that are pertinent to them.

Debezium ensures **exactly-once delivery** of all changes and ensures that changes arrive in the order they were sent.

In other words, Debezium is essentially a modernized method of [Change Data Capture (CDC)](https://en.wikipedia.org/wiki/Change_data_capture).  CDC is the process of identifying and capturing changes made to data in a database, and then delivering those changes in real-time to a downstream process or system. Debezium allows the monitoring of changes in data from multiple sources and can monitor multiple databases of different types.


## Real-Time Delivery

The key selling point of Debezium is the **real-time delivery of data changes** whether from streaming sources or databases with heavy workloads. To support modern high-volume workloads, particularly streaming workloads, sources require constant monitoring, which means that connectors for Debezium must operate continuously. Debezium leverages [Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html) to establish this always-on connection, capturing data changes whenever they occur. This can consume a fair bit of bandwidth, as well as resources (CPU, memory) to process the events pushed through the pipeline.

Debezium **continuously monitors upstream databases**, and for each row-level change, produces a corresponding event that completely describes those changes. Because the Kafka Connect connectors operate continuously, and because events have to make sense even if the structure of the tables change over time, events can grow quite large. The larger and more complex an event, the more resources it requires.

Add to this that even in the simplest Debezium deployment, there are **at least two Kafka Connect connectors** running at any given time. One pulls data from the upstream source, whatever that may be, and the second pushes data changes out to various destinations data warehouses, databases, applications, etc). These connectors operate continuously, at a steady bandwidth, with **dedicated processing and memory power** to ensure that data is both received and delivered as close to instantaneously as possible. When this capacity is warranted, Debezium is an efficient and performance-oriented machine, perfect for real-time CDC use cases.

## Trouble in Paradise

While Debezium offers clear advantages for real-time CDC use cases, it may not be efficient if the **requirements are not strictly real-time**. Depending on the complexity of your deployment, the **number of persistent connectors** (all Kafka Connect) required can become a drain on system resources. This is because for each process that consumes a Debezium event, a corresponding process consumes the same event from Kafka to the data warehouse. Each additional source requires two Kafka Connect connectors. Each process consumes a set minimum resource amount, regardless of the traffic.

For example, from [Amazon MSK connect](https://docs.aws.amazon.com/msk/latest/developerguide/msk-connect-connectors.html) documentation :
> Each MCU represents 1 vCPU of compute and 4 GiB of memory.


<p align="center">
  <img class="zoom" src="/blogs/2022-04-05-debezium-without-kafka-connect/msk.png" alt="MSK connect pricing on aws">
</p>

This lead to $160 for 1 source and 1 destination per month.

Chances are, in a complex deployment, a fair number of sources may **not generate much traffic**. It might only be a few rows per hour. For such a source, having a persistent, always-on process does not make much sense.

This situation can be **exacerbated by your company ACLS**. Because you do not want every user in your organization consuming the entirety of your dataset, you may need to define fine-grained role-based access control, and these rules, once applied, can necessitate numerous additional connectors (Kafka Connect), each requiring and competing for the same system resources.

In short, the same features that make Debezium’s performance in streaming / high volume scenarios can quickly become inefficient if the **requirements are less stringent**.

## Kestra and Micro-Batch to the Rescue

[Kestra](https://kestra.io) is an orchestration and scheduling platform that is designed to simplify the building, running, scheduling, and monitoring of complex data pipelines. Data pipelines can be built in real-time, no matter how complex the workflow, and can connect to **multiple resources** as needed (including Debezium).

Real-time change data capture is an **amazing accomplishment, and a valuable tool** to have in your toolbox, to be sure. But a racecar is not very useful on a highway, or in a school zone, and in the same way, real-time delivery of data changes is not required for every use case. A dashboard or KPI might only need to be **refreshed once a day**, or every few hours, for example. Whether it is cloud services or on-premises, resources cost money, and the challenge is to make the **most efficient use of resources** based on your requirements. Bandwidth, compute resources, or services based on throughput (such as BigQuery) are all expensive commodities, especially if they are always running.  If real-time performance is not necessary, then why waste money on resources you do not need?

<p align="center">
  <img class="zoom" src="/blogs/2022-04-05-debezium-without-kafka-connect/money.gif" alt="waste money">
</p>

Kestra is perfect for such situations and can scale performance up or down as needed from periodic updates to **near-real-time scenarios**. This functionality is possible due to the use of batch or micro-batch processing. Batch processing sends data at intervals, rather than in real-time. It is typically used when data freshness **is not a mission-critical issue**, and when you are working with large datasets and running complex algorithms that require a full dataset (sorting for example). **Micro-batch processing** is a similar process but on much smaller data sets, typically about a minute or so’s worth of data. This allows for near-real-time processing of datasets and is perfect for low-flow situations where a few minutes of delay is acceptable. In many cases, micro-batch processing and stream processing are used interchangeably in data architecture descriptions, because, depending on configuration, they can offer nearly the same performance.

A complex use case involving multiple data sources might have varying requirements, some real-time, some more forgiving. For these, a **hybrid solution** might be advisable. Debezium can be used (with the Kafka Connect service) for those streams that require real-time CDC. For near-real-time or batch processing, you can leverage Kestra. Kestra can consume events directly (without configuring a Kafka Connect service) by leveraging [Debezium Engine](https://debezium.io/documentation/reference/stable/development/engine.html) and forward to **any destination supported** by Kestra (BigQuery, JDBC, Cloud Storage, and more), without a streaming pipeline. Changes/transfers can be scheduled for any interval, every  5 minutes, every hour, every day, whatever is required. [Triggers](../plugins/plugin-debezium-mysql/triggers/io.kestra.plugin.debezium.mysql.Trigger.md) can also be used to create an execution whenever there is data available. Kestra can also be leveraged to transform data before sending it to the destination.

Debezium leverages Kafka and Kafka Connect to deliver streaming performance, and the larger and more complex the deployment, the more challenging it can be to deliver enterprise-grade 99.9% availability while **still managing resources and costs**. Managing it in the cloud can be even more challenging. This involves picking the appropriate compute instance for the brokers, sizing the non-ephemeral storage accordingly, applying end-to-end security, ensuring high availability across availability zones, and more. These same challenges apply when Kafka is a component of another service as well - there is a reason that many organizations turn to managed services rather than deploying their own instance on-premise. There are challenges to visibility as well - users must be familiar with Kafka eccentricities to troubleshoot issues via logs and dashboards.

By leveraging Kestra for **near-real-time or batch workloads**, and Debezium for streaming, some of the advantages are obvious. This allows for a solution that leverages **only the resources required** for the use case in question, rather than applying resource-intensive streaming resources to every process. For workflows that are not real-time, CPU and memory resources are limited or shut down when not in use. Services that charge based on the throughput, such as BigQuery, are **only charged when in use**. All of this combines to create an efficient solution that wastes no resources and **saves money**. All row-level changes are still captured, and with Debezium, a built-in feature snapshots the database on the first start.

![Kestra Topology](/blogs/2022-04-05-debezium-without-kafka-connect/topology.png)

But there are less obvious advantages to adding Kestra to the mix. Pipelines **are visibly presented**, ensuring that dependencies are **continuously monitored**, and you can see exactly where in a data pipeline the problem lies. This monitoring capacity provides a great deal of peace of mind when managing different data flow requirements, and mitigates the complexity of clustered Kafka deployments (such as those that make part of more complex Debezium deployments).


Changes to pipelines can be iterative as well with Kestra. A working data pipeline can be modified on the fly with a few lines of yaml code, adding new components and integrations without disrupting a working flow. A new pipeline of data can be **applied in minutes**.

```yaml
id: debezium-mysql
namespace: com.kestra.lde

tasks:
  - id: capture
    type: io.kestra.plugin.debezium.mysql.Capture
    hostname: 192.168.0.1
    maxDuration: "PT1M"
    password: mysql_passwd
    username: root
  - id: fileTransform
    type: io.kestra.plugin.scripts.nashorn.FileTransform
    from: "{{ outputs.capture.uris.users }}"
    script: |
      if (row['contactName']) {
        row['contactName'] = "*".repeat(row['contactName'].length);
      }
  - id: jsonWriter
    type: io.kestra.plugin.serdes.json.JsonWriter
    from: "{{ outputs.fileTransform.uri }}"
  - id: load
    type: io.kestra.plugin.gcp.bigquery.Load
    destinationTable: my-project.demo.users
    format: JSON
    from: "{{outputs.jsonWriter.uri }}"
    writeDisposition: WRITE_APPEND
```


Kestra’s flexibility is key to this potential solution and many others. With [numerous plugins](../plugins/index.md), Kestra offers deep integrations with **multiple systems** to create complex workflows. Systems without existing plugins can be integrated with simple-to-create containers such as Docker and Kubernetes. The only limit is your imagination. We hope to highlight many such possibilities in the coming weeks.

Our newly created Debezium plugins include connectors for [Postgres](../plugins/plugin-debezium-postgres/index.md) and [MySQL](../plugins/plugin-debezium-mysql/index.md), and we are steadily working to include additional connectors to improve our product. Our current roadmap includes connectors for MongoDB, PostgresSQL, Oracle, SQL Server, Cassandra, and more. What connectors do you think we should work on first? We’d love to hear from you!

Give us your opinion on this [Twitter poll](https://twitter.com/kestra_io/status/1511296199025991680).