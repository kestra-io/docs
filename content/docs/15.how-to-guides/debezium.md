---
title: Debezium
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Integrations
---

In order to ensure the change data capture works seamlessly and get the Debezium tasks running, you need to perform the necessary setup on the database. We will look into the setup steps in detail.

## Debezium with MySQL

### Creating a user

A Debezium MySQL connector requires a MySQL user account. This MySQL user must have appropriate permissions on all databases for which the Debezium MySQL connector captures changes.

**Prerequisites**

- A MySQL server.
- Basic knowledge of SQL commands.

**Procedure**

1. Create the MySQL user:

```
mysql> CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
```

2. Grant the required permissions to the user:

```
mysql> GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'user' IDENTIFIED BY 'password';
```

For a description of the required permissions, see [Descriptions of user permissions](https://debezium.io/documentation/reference/3.0/connectors/mysql.html#permissions-explained-mysql-connector).

::alert{type="info"}
If using a hosted option such as Amazon RDS or Amazon Aurora that does not allow a global read lock, table-level locks are used to create the consistent snapshot. In this case, you need to also grant LOCK TABLES permissions to the user that you create. See [snapshots](https://debezium.io/documentation/reference/3.0/connectors/mysql.html#mysql-snapshots) for more details.
::

3. Finalize the user’s permissions:

```
mysql> FLUSH PRIVILEGES;
```

### Enabling the binlog

You must enable binary logging for MySQL replication. The binary logs record transaction updates in a way that enables replicas to propagate those changes.

**Prerequisites**

- A MySQL server.
- Appropriate MySQL user privileges.

**Procedure**

1. Check whether the `log-bin` option is enabled:

```
// for MySQL 5.x
mysql> SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
FROM information_schema.global_variables WHERE variable_name='log_bin';
// for MySQL 8.x
mysql> SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
FROM performance_schema.global_variables WHERE variable_name='log_bin';
```

2. If the binlog is `OFF`, add the properties in the following table to the configuration file for the MySQL server:

```
server-id         = 223344 # Querying variable is called server_id, e.g. SELECT variable_value FROM information_schema.global_variables WHERE variable_name='server_id';
log_bin                     = mysql-bin
binlog_format               = ROW
binlog_row_image            = FULL
binlog_expire_logs_seconds  = 864000
```

3. Confirm your changes by checking the binlog status once more:

```
// for MySQL 5.x
mysql> SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
FROM information_schema.global_variables WHERE variable_name='log_bin';
// for MySQL 8.x
mysql> SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
FROM performance_schema.global_variables WHERE variable_name='log_bin';
```

1. If you run MySQL on Amazon RDS, you must enable automated backups for your database instance for binary logging to occur. If the database instance is not configured to perform automated backups, the binlog is disabled, even if you apply the settings described in the previous steps.

### Enabling GTIDs

Global transaction identifiers (GTIDs) uniquely identify transactions that occur on a server within a cluster. Though not required for a Debezium MySQL connector, using GTIDs simplifies replication and enables you to more easily confirm if primary and replica servers are consistent.

GTIDs are available in MySQL 5.6.5 and later. See the [MySQL documentation](https://dev.mysql.com/doc/refman/8.2/en/replication-options-gtids.html#option_mysqld_gtid-mode) for more details.

**Prerequisites**

- A MySQL server.
- Basic knowledge of SQL commands.
- Access to the MySQL configuration file.

**Procedure**

1. Enable `gtid_mode`:

```
mysql> gtid_mode=ON
```

2. Enable `enforce_gtid_consistency`:

```
mysql> enforce_gtid_consistency=ON
```

3. Confirm the changes:

```
mysql> show global variables like '%GTID%';
```

**Result**

+--------------------------+-------+
| Variable_name            | Value |
+--------------------------+-------+
| enforce_gtid_consistency | ON    |
| gtid_mode                | ON    |
+--------------------------+-------+

### Configuring session timeouts

When an initial consistent snapshot is made for large databases, your established connection could timeout while the tables are being read. You can prevent this behavior by configuring `interactive_timeout` and `wait_timeout` in your MySQL configuration file.

**Prerequisites**

- A MySQL server.
- Basic knowledge of SQL commands.
- Access to the MySQL configuration file.

**Procedure**

1. Configure `interactive_timeout`:

```
mysql> interactive_timeout=<duration-in-seconds>
```

2. Configure wait_timeout:

```
mysql> wait_timeout=<duration-in-seconds>
```

### Enabling query log events

You might want to see the original SQL statement for each binlog event. Enabling the `binlog_rows_query_log_events` option in the MySQL configuration file allows you to do this.

This option is available in MySQL 5.6 and later.

**Prerequisites**

- A MySQL server.
- Basic knowledge of SQL commands.
- Access to the MySQL configuration file.

**Procedure**

1. Enable `binlog_rows_query_log_events` in MySQL:

```
mysql> binlog_rows_query_log_events=ON
```

`binlog_rows_query_log_events` is set to a value that enables/disables support for including the original SQL statement in the binlog entry.

- `ON` = enabled
- `OFF` = disabled

### Validating binlog row value options

Verify the setting of the `binlog_row_value_options` variable in the database. To enable the connector to consume **UPDATE** events, this variable must be set to a value other than `PARTIAL_JSON`.

**Prerequisites**

- A MySQL server.
- Basic knowledge of SQL commands.
- Access to the MySQL configuration file.

**Procedure**

1. Check current variable value

```
mysql> show global variables where variable_name = 'binlog_row_value_options';
```

**Result**
+--------------------------+-------+
| Variable_name            | Value |
+--------------------------+-------+
| binlog_row_value_options |       |
+--------------------------+-------+

If the value of the variable is set to `PARTIAL_JSON`, run the following command to unset it:

```
mysql> set @@global.binlog_row_value_options="" ;
```

### Running Debezium tasks on MySQL

You are now all set to run the Debezium MySQL based tasks and triggers. Here is an example flow using Debezium MySQL Realtime Trigger:

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

Debezium MySQL Realtime Trigger will collect the records from the change data capture as and when they occur. The flow can then process these records as required.

## Debezium with PostgreSQL

In order for Debezium to work with PostgreSQL, you need to enable write ahead logging (WAL) on the PostgreSQL server.

PostgreSQL’s [logical decoding](https://www.postgresql.org/docs/current/static/logicaldecoding-explanation.html) feature was introduced in version 9.4. It is a mechanism that allows the extraction of the changes that were committed to the transaction log and the processing of these changes in a user-friendly manner.

### Local PostgreSQL Installation

Before using the PostgreSQL connector to monitor the changes committed on a PostgreSQL server, decide which logical decoding plug-in you intend to use. If you plan not to use the native pgoutput logical replication stream support, then you must install the logical decoding plug-in into the PostgreSQL server. Afterward, enable a replication slot, and configure a user with sufficient privileges to perform the replication.

If your database is hosted by a service such as [Heroku Postgres](https://www.heroku.com/postgres) you might be unable to install the plug-in. If so, and if you are using PostgreSQL 10+, you can use the pgoutput decoder support to capture changes in your database. If that is not an option, you are unable to use Debezium with your database.

### PostgreSQL in the Cloud

#### PostgreSQL on Amazon RDS

It is possible to capture changes in a PostgreSQL database that is running in [Amazon RDS](https://aws.amazon.com/rds/). To do this:

- Set the instance parameter `rds.logical_replication` to `1`.

- Verify that the `wal_level` parameter is set to `logical` by running the query `SHOW wal_level` as the database RDS master user. This might not be the case in multi-zone replication setups. You cannot set this option manually. It is automatically changed when the `rds.logical_replication` parameter is set to `1`. If the `wal_level` is not set to `logical` after you make the preceding change, it is probably because the instance has to be restarted after the parameter group change. Restarts occur during your maintenance window, or you can initiate a restart manually.

- Set the Debezium `plugin.name` parameter to `pgoutput`.

- Initiate logical replication from an AWS account that has the `rds_replication` role. The role grants permissions to manage logical slots and to stream data using logical slots. By default, only the master user account on AWS has the `rds_replication` role on Amazon RDS. To enable a user account other than the master account to initiate logical replication, you must grant the account the rds_replication role. For example, `grant rds_replication to <my_user>`. You must have `superuser` access to grant the `rds_replication` role to a user. To enable accounts other than the master account to create an initial snapshot, you must grant `SELECT` permission to the accounts on the tables to be captured. For more information about security for PostgreSQL logical replication, see the [PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication-security.html).

#### PostgreSQL on Azure

It is possible to use Debezium with [Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/), which has support for the `pgoutput` logical decoding plug-in, which is supported by Debezium.

Set the Azure replication support to `logical`. You can use the [Azure CLI](https://docs.microsoft.com/en-us/azure/postgresql/concepts-logical#using-azure-cli) or the [Azure Portal](https://docs.microsoft.com/en-us/azure/postgresql/concepts-logical#using-azure-portal) to configure this. For example, to use the Azure CLI, here are the `az postgres server` commands that you need to execute:

```
az postgres server configuration set --resource-group mygroup --server-name myserver --name azure.replication_support --value logical

az postgres server restart --resource-group mygroup --name myserver
```

#### PostgreSQL on CrunchyBridge

It is possible to use Debezium with [CrunchyBridge](https://crunchybridge.com/); logical replication is already turned on. The `pgoutput` plugin is available. You will have to create a replication user and provide correct privileges.

::alert{type="info"}
While using the `pgoutput` plug-in, it is recommended that you configure `filtered` as the `publication.autocreate.mode`. If you use `all_tables`, which is the default value for `publication.autocreate.mode`, and the publication is not found, the connector tries to create one by using `CREATE PUBLICATION <publication_name> FOR ALL TABLES;`, but this fails due to lack of permissions.
::

### Installing the logical decoding output plug-in

::alert{type="info"}
For more detailed instructions about setting up and testing logical decoding plug-ins, see [Logical Decoding Output Plug-in Installation for PostgreSQL](https://debezium.io/documentation/reference/3.0/postgres-plugins.html).
::

As of PostgreSQL 9.4, the only way to read changes to the write-ahead-log is to install a logical decoding output plug-in. Plug-ins are written in C, compiled, and installed on the machine that runs the PostgreSQL server. Plug-ins use a number of PostgreSQL specific APIs, as described by the [PostgreSQL documentation](https://www.postgresql.org/docs/current/static/logicaldecoding-output-plugin.html).

The PostgreSQL connector works with one of Debezium’s supported logical decoding plug-ins to receive change events from the database in either the [Protobuf format](https://github.com/google/protobuf) or the [pgoutput](https://github.com/postgres/postgres/blob/master/src/backend/replication/pgoutput/pgoutput.c) format. The `pgoutput` plugin comes out-of-the-box with the PostgreSQL database. For more details on using Protobuf via the `decoderbufs` plug-in, see the plug-in [documentation](https://github.com/debezium/postgres-decoderbufs/blob/main/README.md) which discusses its requirements, limitations, and how to compile it.

For simplicity, Debezium also provides a container image based on the upstream PostgreSQL server image, on top of which it compiles and installs the plug-ins. You can [use this image](https://github.com/debezium/container-images/tree/main/postgres/13) as an example of the detailed steps required for the installation.

::alert{type="warning"}
The Debezium logical decoding plug-ins have been installed and tested on only Linux machines. For Windows and other operating systems, different installation steps might be required.
::

### Running Debezium tasks on PostgreSQL

Once the WAL is enabled, you can run the Debezium PostgreSQL based tasks and triggers. Here is an example flow using Debezium PostgreSQL Realtime Trigger:

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

Debezium PostgreSQL Realtime Trigger will collect the records from the change data capture as and when they occur. The flow can then process these records as required.

## Using Debezium with Microsoft SQL Server

For Debezium to capture change events from SQL Server tables, a SQL Server administrator with the necessary privileges must first run a query to enable CDC on the database. The administrator must then enable CDC for each table that you want Debezium to capture.

::alert{type="info"}
By default, JDBC connections to Microsoft SQL Server are protected by SSL encryption. If SSL is not enabled for a SQL Server database, or if you want to connect to the database without using SSL, you can disable SSL by setting the value of the `database.encrypt` property in connector configuration to `false`.
::

After CDC is applied, it captures all of the `INSERT`, `UPDATE`, and `DELETE` operations that are committed to the tables for which CDC is enabled. The Debezium connector can then capture these events and emit them to Kafka topics.

### Enabling CDC on the SQL Server database

Before you can enable CDC for a table, you must enable it for the SQL Server database. A SQL Server administrator enables CDC by running a system stored procedure. System stored procedures can be run by using SQL Server Management Studio, or by using Transact-SQL.

**Prerequisites**

- You are a member of the sysadmin fixed server role for the SQL Server.
- You are a db_owner of the database.
- The SQL Server Agent is running.

::alert{type="info"}
The SQL Server CDC feature processes changes that occur in user-created tables only. You cannot enable CDC on the SQL Server master database.
::

**Procedure**

1. From the **View** menu in SQL Server Management Studio, click **Template Explorer**.

2. In the **Template Browser**, expand **SQL Server Templates**.

3. Expand **Change Data Capture > Configuration** and then click **Enable Database for CDC**.

4. In the template, replace the database name in the `USE` statement with the name of the database that you want to enable for CDC.

5. Run the stored procedure `sys.sp_cdc_enable_db` to enable the database for CDC.

After the database is enabled for CDC, a schema with the name cdc is created, along with a CDC user, metadata tables, and other system objects.

The following example shows how to enable CDC for the database `MyDB`:

```
USE MyDB
GO
EXEC sys.sp_cdc_enable_db
GO
```

### Enabling CDC on a SQL Server table

A SQL Server administrator must enable change data capture on the source tables that you want to Debezium to capture. The database must already be enabled for CDC. To enable CDC on a table, a SQL Server administrator runs the stored procedure `sys.sp_cdc_enable_table` for the table. The stored procedures can be run by using SQL Server Management Studio, or by using Transact-SQL. SQL Server CDC must be enabled for every table that you want to capture.

**Prerequisites**

- CDC is enabled on the SQL Server database.

- The SQL Server Agent is running.

- You are a member of the `db_owner` fixed database role for the database.

**Procedure**

1. From the **View** menu in SQL Server Management Studio, click **Template Explorer**.

2. In the **Template Browser**, expand **SQL Server Templates**.

3. Expand **Change Data Capture > Configuration**, and then click **Enable Table Specifying Filegroup Option**.

4. In the template, replace the table name in the `USE` statement with the name of the table that you want to capture.

5. Run the stored procedure sys.sp_cdc_enable_table.

The following example shows how to enable CDC for the table `MyTable`:

```
USE MyDB
GO

EXEC sys.sp_cdc_enable_table
@source_schema = N'dbo',
@source_name   = N'MyTable', 
@role_name     = N'MyRole',  
@filegroup_name = N'MyDB_CT',
@supports_net_changes = 0
GO
```

**source_name**: Specifies the name of the table that you want to capture.

**role_name**: Specifies a role `MyRole` to which you can add users to whom you want to grant `SELECT` permission on the captured columns of the source table. Users in the `sysadmin` or `db_owner` role also have access to the specified change tables. Set the value of `@role_name` to `NULL`, to allow only members in the `sysadmin` or `db_owner` to have full access to captured information.

**filegroup_name**: Specifies the filegroup where SQL Server places the change table for the captured table. The named filegroup must already exist. It is best not to locate change tables in the same filegroup that you use for source tables.

### Verifying that the user has access to the CDC table

A SQL Server administrator can run a system stored procedure to query a database or table to retrieve its CDC configuration information. The stored procedures can be run by using SQL Server Management Studio, or by using Transact-SQL.

**Prerequisites**

- You have `SELECT` permission on all of the captured columns of the capture instance. Members of the `db_owner` database role can view information for all of the defined capture instances.

- You have membership in any gating roles that are defined for the table information that the query includes.

**Procedure**

1. From the **View** menu in SQL Server Management Studio, click **Object Explorer**.

2. From the **Object Explorer**, expand **Databases**, and then expand your database object, for example, `MyDB`.

3. Expand **Programmability > Stored Procedures > System Stored Procedures**.

4. Run the `sys.sp_cdc_help_change_data_capture` stored procedure to query the table.

Queries should not return empty results.

The following example runs the stored procedure `sys.sp_cdc_help_change_data_capture` on the database `MyDB`:

```
USE MyDB;
GO
EXEC sys.sp_cdc_help_change_data_capture
GO
```

The query returns configuration information for each table in the database that is enabled for CDC and that contains change data that the caller is authorized to access. If the result is empty, verify that the user has privileges to access both the capture instance and the CDC tables.

### SQL Server on Azure

The Debezium SQL Server connector can be used with SQL Server on Azure. Refer to [this example](https://learn.microsoft.com/en-us/samples/azure-samples/azure-sql-db-change-stream-debezium/azure-sql%2D%2Dsql-server-change-stream-with-debezium/) for configuring CDC for SQL Server on Azure and using it with Debezium.

### SQL Server Always On

The SQL Server connector can capture changes from an Always On read-only replica.

**Prerequisites**

- Change data capture is configured and enabled on the primary node. SQL Server does not support CDC directly on replicas.

- The configuration option `database.applicationIntent` is set to `ReadOnly`. This is required by SQL Server. When Debezium detects this configuration option, it responds by taking the following actions:

  - Sets `snapshot.isolation.mode` to `snapshot`, which is the only one transaction isolation mode supported for read-only replicas.

  - Commits the (read-only) transaction in every execution of the streaming query loop, which is necessary to get the latest view of CDC data.

### Running Debezium tasks on Microsoft SQL Server

You are now all set to run the Debezium Microsoft SQL Server based tasks and triggers. Here is an example flow using Debezium Microsoft SQL Server Realtime Trigger:

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

Debezium Microsoft SQL Server Realtime Trigger will collect the records from the change data capture as and when they occur. The flow can then process these records as required.

## Debezium with MongoDB

The MongoDB connector uses MongoDB’s change streams to capture the changes, so the connector works only with MongoDB replica sets or with sharded clusters where each shard is a separate replica set. See the MongoDB documentation for setting up a [replica set](https://docs.mongodb.com/manual/replication/) or [sharded cluster](https://docs.mongodb.com/manual/sharding/). Also, be sure to understand how to enable [access control and authentication](https://docs.mongodb.com/manual/tutorial/deploy-replica-set-with-keyfile-access-control/#deploy-repl-set-with-auth) with replica sets.

You must also have a MongoDB user that has the appropriate roles to read the `admin` database where the oplog can be read. Additionally, the user must also be able to read the `config` database in the configuration server of a sharded cluster and must have `listDatabases` privilege action. When change streams are used (the default) the user also must have cluster-wide privilege actions `find` and `changeStream`.

When you intend to utilize pre-image and populate the `before` field, you need to first enable `changeStreamPreAndPostImages` for a collection using `db.createCollection()`, `create`, or `collMod`.

### MongoDB in the Cloud

You can use the Debezium connector for MongoDB with [MongoDB Atlas](https://www.mongodb.com/atlas/database). Note that MongoDB Atlas only supports secure connections via SSL, i.e. the `[+mongodb.ssl.enabled](https://debezium.io/documentation/reference/3.0/connectors/mongodb.html#mongodb-property-mongodb-ssl-enabled)` connector option must be set to `true`.

### Running Debezium tasks on MongoDB

You are now all set to run the Debezium MongoDB based tasks and triggers. Here is an example flow using Debezium MongoDB Realtime Trigger:

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

Debezium MongoDB Realtime Trigger will collect the records from the change data capture as and when they occur. The flow can then process these records as required.
