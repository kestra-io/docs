---
title: Software and Hardware Requirements to Run Kestra
h1: "Prerequisites: software and hardware requirements before deploying Kestra"
description: Check Kestra system requirements. Verify software prerequisites (Java, DB) and hardware recommendations for running Kestra effectively.
sidebarTitle: Software and Hardware Requirements
icon: /src/contents/docs/icons/admin.svg
---

This page outlines the software and hardware requirements for running Kestra.

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

#### MySQL settings

MySQL deployments need two settings that MySQL does not apply by default.

**Transaction isolation level.** Kestra requires the `READ COMMITTED` transaction isolation level. MySQL defaults to `REPEATABLE READ`, which can cause deadlocks in Kestra's JDBC queue. When a connection uses a different level, Kestra raises `IllegalStateException: Isolation level must be READ COMMITTED`.

Set the level on the MySQL server in your option file (`my.cnf`), then restart MySQL:

```ini
[mysqld]
transaction_isolation=READ-COMMITTED
```

On a managed service such as Amazon RDS or Cloud SQL, set the `transaction_isolation` parameter in the parameter group or database flags instead.

If you cannot change the server configuration, set the level for Kestra's connections in the datasource configuration:

```yaml
datasources:
  mysql:
    url: jdbc:mysql://localhost:3306/kestra
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: kestra
    password: k3str4
    dialect: MYSQL
    transaction-isolation: TRANSACTION_READ_COMMITTED
```

**Time zone tables.** Load the MySQL time zone tables. If the time zone data is missing, the scheduler can misfire or skip runs. Follow the MySQL guide to [load the time zone tables](https://dev.mysql.com/doc/refman/8.0/en/time-zone-support.html#time-zone-installation).

### Internal Storage

| Kestra Edition    | Storage Provider   | Required version          | Note                             |
|-------------------|--------------------|---------------------------|----------------------------------|
| OSS/Enterprise    | Google Cloud GCS   | N/A                       |                                  |
| OSS/Enterprise    | AWS S3             | N/A                       |                                  |
| OSS/Enterprise    | Azure Blob Storage | N/A                       |                                  |
| OSS/Enterprise    | S3-compatible      | N/A                       | Use the `minio` storage type     |


## Hardware requirements

A Kestra standalone server requires at least 4 GiB of memory and 2 vCPUs. To use script tasks, the server must support Docker-in-Docker (this is why, for example, AWS ECS Fargate is not supported).

For guidance on allocating memory and CPU for different architecture components, [contact us](/demo). We can help size your deployment based on your expected workload.
