---
title: Administrator Guide
---

Here, you will find the necessary information for deploying and configuring your Kestra cluster.

## Software requirements

| Component         | Required version            | Note                              |
|-------------------|-----------------------------|-----------------------------------|
| **Java**          | 17-21                       | By default, using Eclipse Temurin |
| **MySQL**         | x.y.z with exception 8.0.31 |                                   |
| **PostgreSQL**    | 14-15.5                     |                                   |
| **MinIO**         | x.y.z or newer              |                                   |
| **Apache Kafka**  | x.y.z                       |                                   |
| **Elasticsearch** | x.y.z up to a.b.c           | Alternatively OpenSearch          |
| **OpenSearch**    | x.y.z or newer              | Alternatively Elasticsearch       |


## Hardware requirements

Kestra standalone server needs at least 4GiB Memory and 2vCPU to run correctly. In order to use script tasks, the server also needs to be able to run Docker-in-Docker (_this is why e.g. AWS ECR Fargate is currently not supported_).

If you need more guidance on how much memory and CPU to allocate to each architecture component, [reach out to us](https://kestra.io/demo) and we'll help you with the sizing based on your expected workload.

## Kestra configuration

The pages provide information on how to configure Kestra for different environments and use cases.

<ChildTableOfContents />
