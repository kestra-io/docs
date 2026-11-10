---
title: Use Debezium Tasks and Triggers in Kestra
h1: Enable Change Data Capture with Debezium in Your Workflows
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Integrations
description: Enable Change Data Capture (CDC) in your databases to use Debezium tasks and triggers in Kestra for real-time data ingestion.
---

To use Debezium tasks and triggers, enable Change Data Capture (CDC) on your database. Each connector has different prerequisites — follow the links to the Debezium documentation for complete setup steps.

## MySQL

Before using the Debezium MySQL connector, you must:
- Create a MySQL user with `SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT` privileges
- Enable binary logging with `binlog_format = ROW` and `binlog_row_image = FULL`
- Optionally enable GTIDs for simpler replication management

See the [Debezium MySQL connector documentation](https://debezium.io/documentation/reference/3.0/connectors/mysql.html) for complete setup instructions, including hosted options such as Amazon RDS and Aurora.

### Kestra flow

```yaml
id: debezium_mysql
namespace: company.team

tasks:
  - id: send_data
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.data }}"

triggers:
  - id: realtime
    type: io.kestra.plugin.debezium.mysql.RealtimeTrigger
    serverId: 123456789
    hostname: 127.0.0.1
    port: 63306
    username: mysql_user
    password: mysql_passwd
```

The `RealtimeTrigger` collects records from change data capture as they occur. The flow processes each record when it arrives.

## PostgreSQL

Before using the Debezium PostgreSQL connector, enable Write-Ahead Logging (WAL) on your PostgreSQL server. The `pgoutput` logical decoding plugin is available natively since PostgreSQL 10 and is the recommended choice — no additional installation required.

See the [Debezium PostgreSQL connector documentation](https://debezium.io/documentation/reference/3.0/connectors/postgresql.html) for complete setup instructions, including cloud-hosted options such as Amazon RDS, Azure Database for PostgreSQL, and CrunchyBridge.

### Kestra flow

```yaml
id: debezium_postgres
namespace: company.team

tasks:
  - id: send_data
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.data }}"

triggers:
  - id: realtime
    type: io.kestra.plugin.debezium.postgres.RealtimeTrigger
    database: postgres
    hostname: 127.0.0.1
    port: 65432
    username: postgres
    password: pg_passwd
```

## Microsoft SQL Server

Before using the Debezium SQL Server connector, a database administrator must enable CDC on the SQL Server database and on each table to capture. The SQL Server Agent must be running.

See the [Debezium SQL Server connector documentation](https://debezium.io/documentation/reference/3.0/connectors/sqlserver.html) for complete setup instructions, including SQL Server on Azure and Always On read-only replicas.

### Kestra flow

```yaml
id: debezium_sqlserver
namespace: company.team

tasks:
  - id: send_data
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.data }}"

triggers:
  - id: realtime
    type: io.kestra.plugin.debezium.sqlserver.RealtimeTrigger
    hostname: 127.0.0.1
    port: 61433
    username: sa
    password: password
    database: deb
```

## MongoDB

Before using the Debezium MongoDB connector, MongoDB must be configured as a replica set or sharded cluster. Create a MongoDB user with the permissions to read the `admin` database (for oplog access) and `listDatabases`, `find`, and `changeStream` cluster-wide privilege actions.

See the [Debezium MongoDB connector documentation](https://debezium.io/documentation/reference/3.0/connectors/mongodb.html) for complete setup instructions, including MongoDB Atlas (SSL required).

### Kestra flow

```yaml
id: debezium_mongodb
namespace: company.team

tasks:
  - id: send_data
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.data }}"

triggers:
  - id: realtime
    type: io.kestra.plugin.debezium.mongodb.RealtimeTrigger
    snapshotMode: INITIAL
    connectionString: mongodb://mongo_user:mongo_passwd@mongos0.example.com:27017,mongos1.example.com:27017/
```
