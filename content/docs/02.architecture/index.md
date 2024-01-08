---
title: 🏗️ Architecture
---


The following diagram shows the main components of the **Open-Source** and the **Enterprise Edition** of Kestra. The arrows visualize how the components interact with each other.

![Kestra OSS Architecture](/docs/architecture/comparison.png "Kestra Architecture")

When comparing both diagrams, the main difference between the architecture of an **Open-Source** and an **Enterprise Edition** is the data layer (_JDBC Database vs. Kafka and Elasticsearch_).

Note that apart from Postgres, the JDBC setup also supports MySQL and H2 databases. Also, it's possible to use the Enterprise Edition with a JDBC database backend for smaller deployments.

The **Worker** is the only component communicating with your private data sources to extract and transform data. The Worker also interacts with **Internal Storage** to persist intermediary results and store the final task run outputs.

All components of the **application layer** (incl. Worker, Executor, and Scheduler) are **decoupled microservices**. They are stateless and communicate with each other through the **Queue** (Kafka/JDBC). You can deploy and scale them independently — the only exception is the Scheduler, you can have only one Scheduler component in a JDBC-based architecture. When using Kafka and Elasticsearch, you can scale the replica count for the Scheduler as well, making it highly available.

The **Webserver** communicates with the (Elasticsearch/JDBC) Repository to serve data for Kestra UI and API.

The **data layer** is decoupled from the application layer and provides a separation between:
- storing your private data processing artifacts — **Internal Storage** is used to store outputs of your executions; you can think of Internal Storage as your own private S3 bucket
- storing execution metadata — (Kafka/JDBC) **Queue** is used as the orchestration backend
- storing logs and user-facing data — the (Elasticsearch/JDBC) **Repository** is used to store data needed to serve Kestra UI and API.

The Indexer, available only in the Enterprise Edition, indexes content from Kafka topics (_such as the flows and executions topics_) to the Elasticsearch repositories. Thanks to the separation between Queue and Repository in the Enterprise Edition, even if your Elasticsearch instance experiences downtime, your executions will continue to work by relying on the Kafka backend.


<ChildTableOfContents :max="3" />
