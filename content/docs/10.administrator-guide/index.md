---
title: Administrator Guide
---

Here, you will find the necessary information for deploying and configuring your Kestra cluster.

## Software requirements

The table below lists the software requirements for Kestra i.e. the lowest versions of the software that Kestra is compatible with.

| Component         | Required version        | Note                             |
|-------------------|-------------------------|----------------------------------|
| **Java**          | >= 17 && < 18           | Default 17 using Eclipse Temurin |
| **MySQL**         | >=8 with exception 8.0.31 | Default 8.3.2                    |
| **PostgreSQL**    | >=14 && <= 15           | Default 15.3.2                   |
| **MinIO**         | >=8                     |                                  |
| **Apache Kafka**  | >=3                     |                                  |
| **Elasticsearch** | >=7                     | Alternatively OpenSearch >= 2    |


## Hardware requirements

Kestra standalone server needs at least 4GiB Memory and 2vCPU to run correctly. In order to use script tasks, the server also needs to be able to run Docker-in-Docker (_this is why e.g. AWS ECR Fargate is currently not supported_).

If you need more guidance on how much memory and CPU to allocate to each architecture component, [reach out to us](https://kestra.io/demo) and we'll help you with the sizing based on your expected workload.

## Kestra configuration

The pages provide information on how to configure Kestra for different environments and use cases.

<ChildTableOfContents />
