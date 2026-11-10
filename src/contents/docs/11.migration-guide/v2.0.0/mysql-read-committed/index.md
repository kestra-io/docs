---
title: MySQL READ COMMITTED Isolation Level
h1: Set the MySQL Isolation Level to READ COMMITTED
sidebarTitle: MySQL Isolation Level
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: Kestra 2.0 requires the READ COMMITTED transaction isolation level on MySQL. Set it on the MySQL server or in the Kestra datasource configuration before upgrading.
---

Kestra 2.0 requires MySQL connections to use the `READ COMMITTED` transaction isolation level.

## What changed

Kestra's JDBC queue needs `READ COMMITTED` to avoid deadlocks. PostgreSQL uses this level by default. MySQL defaults to `REPEATABLE READ`.

Kestra 2.0 checks the isolation level of its database connection. If the level is not `READ COMMITTED`, Kestra raises this error:

```
java.lang.IllegalStateException: Isolation level must be READ COMMITTED
```

## Who is affected

You are affected if you run Kestra on MySQL and neither of these is set:

- `transaction_isolation=READ-COMMITTED` on the MySQL server
- `transaction-isolation: TRANSACTION_READ_COMMITTED` on the Kestra MySQL datasource

PostgreSQL, H2, and Kafka with Elasticsearch deployments are not affected.

## How to migrate

Before you start Kestra 2.0, apply one of the following options.

### Option 1: Set the level on the MySQL server

Add the setting to your MySQL option file (`my.cnf`), then restart MySQL:

```ini
[mysqld]
transaction_isolation=READ-COMMITTED
```

On a managed service such as Amazon RDS or Cloud SQL, set the `transaction_isolation` parameter in the parameter group or database flags.

This option changes the default for every client of the MySQL server.

### Option 2: Set the level in the Kestra datasource

Add `transaction-isolation` to the MySQL datasource in your Kestra configuration:

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

This option applies only to Kestra's connections. Use it when you cannot change the server configuration or when other applications share the MySQL server.

## Verify the setting

To check the server default, run this query in MySQL:

```sql
SELECT @@GLOBAL.transaction_isolation;
```

The query returns `READ-COMMITTED` when Option 1 is in place. If you used Option 2, the server value can stay `REPEATABLE-READ`.

After you start Kestra 2.0, confirm that the logs do not contain `Isolation level must be READ COMMITTED`.

For the full list of MySQL requirements, see [MySQL settings](../../../10.administrator-guide/00.requirements/index.md#mysql-settings).
