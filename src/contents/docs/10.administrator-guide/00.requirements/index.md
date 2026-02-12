---
title: Kestra Requirements – Software and Hardware Checklist
description: Check Kestra system requirements. Verify software prerequisites (Java, DB) and hardware recommendations for running Kestra effectively.
sidebarTitle: Software and Hardware Requirements
icon: /src/contents/docs/icons/admin.svg
---

This page outlines the software and hardware requirements for running Kestra.

## Confirm Kestra software and hardware requirements

## Software requirements

The table below lists the software requirements for Kestra.

### Java Runtime

| Kestra Edition | Required version | Note |
|----------------|------------------|------|
| Open Source / Enterprise | Runtime JDK 25; source/target 21 | Default: Java 25 (Eclipse Temurin); compiled with `--release 21` |

### Queue and Repository

Kestra Open Source supports PostgreSQL or MySQL for the queue and repository components.

Kestra Enterprise Edition (EE) provides two options:
- Use the same JDBC configuration as Open Source for standard deployments
- Use Kafka with Elasticsearch or OpenSearch for large-scale deployments

| Kestra Edition    | Database                 | Required version          | Note           |
|-------------------|--------------------------|---------------------------|----------------|
| OSS / Enterprise    | **PostgreSQL**           | >=14             | Default `latest` |
| OSS / Enterprise | **MySQL** | >= 8 (except version 8.0.31) | Default: 8.3.2 |
| Enterprise        | **Apache Kafka**         | >=3                       |                |
| Enterprise        | **Elasticsearch**        | >=7                       |                |
| Enterprise        | **Opensearch**           | >=2                       |                |

### Internal Storage

| Kestra Edition    | Storage Provider   | Required version          | Note                             |
|-------------------|--------------------|---------------------------|----------------------------------|
| OSS/Enterprise    | MinIO              | >=8                       |                                  |
| OSS/Enterprise    | Google Cloud GCS   | N/A                       |                                  |
| OSS/Enterprise    | AWS S3             | N/A                       |                                  |
| OSS/Enterprise    | Azure Blob Storage | N/A                       |                                  |


## Hardware requirements

A Kestra standalone server requires at least 4 GiB of memory and 2 vCPUs. To use script tasks, the server must support Docker-in-Docker (this is why, for example, AWS ECS Fargate is not supported).

For guidance on allocating memory and CPU for different architecture components, [contact us](/demo). We can help size your deployment based on your expected workload.
