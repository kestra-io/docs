---
order: 1
---
# Database configuration

First, you need to configure Kestra to use a database for its Queue and Repository, for example for MySQL:

```yaml
kestra:
  queue:
    type: mysql
  repository:
    type: mysql
```

Currently, Kestra supports three databases: H2, MySQL and PostgreSQL. H2 can be convenient to use for local development but MySQL or PostgreSQL must be used in production.

## Minimal configuration
The most important thing is to configure the way Kestra connects to a database, what is called a datasource.


Here is a minimal configuration for MySQL:
```yaml
kestra:
  queue:
    type: mysql
  repository:
    type: mysql

datasources:
  mysql:
    url: jdbc:mysql://localhost:3306/kestra
    driverClassName: com.mysql.cj.jdbc.Driver
    username: kestra
    password: k3str4
    dialect: MYSQL
```


Here is a minimal configuration for PostgreSQL:
```yaml
kestra:
  queue:
    type: postgres
  repository:
    type: postgres

datasources:
  postgres:
    url: jdbc:postgresql://localhost:5432/kestra
    driverClassName: org.postgresql.Driver
    username: kestra
    password: k3str4
```


Here is a minimal configuration for H2:
```yaml
kestra:
  queue:
    type: h2
  repository:
    type: h2

datasources:
  h2:
    url: jdbc:h2:mem:public;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
    username: sa
    password: ""
    driverClassName: org.h2.Driver
```


## Datasource properties

Since Kestra is built with [Micronaut](https://micronaut.io) and [HikariCP](https://github.com/brettwooldridge/HikariCP), many configuration options are available to configure the datasource and the connection pool:


| Properties                    | Type   | Description                                                                                                                                           |
|-------------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `url`                         | String | The jdbc connection string.                                                                                                                       |
| `catalog`                     | String | The default schema name to be set on connections.                                                                                                 |
| `schema`                      | String | The default catalog name to be set on connections.                                                                                                |
| `username`                    | String | The default username used.                                                                                                                        |
| `password`                    | String | The default password to use.                                                                                                                      |
| `transaction-isolation`       | String | The default transaction isolation level.                                                                                                          |
| `pool-name`                   | String | The name of the connection pool.                                                                                                                  |
| `connection-init-sql`         | String | The SQL string that will be executed on all new connections when they are created, before they are added to the pool.                             |
| `connection-test-query`       | String | The SQL query to be executed to test the validity of connections.                                                                                 |
| `connection-timeout`          | Long   | The maximum number of milliseconds that a client will wait for a connection from the pool.                                                        |
| `idle-timeout`                | Long   | The maximum amount of time (in milliseconds) that a connection is allowed to sit idle in the pool.                             |
| `minimum-idle`                | Long   | The minimum number of idle connections that HikariCP tries to maintain in the pool, including both idle and in-use connections. |
| `initialization-fail-timeout` | Long   | The pool initialization failure timeout.                                                                                                          |
| `leak-detection-threshold`    | Long   | The amount of time that a connection can be out of the pool before a message is logged indicating a possible connection leak.  |
| `maximum-pool-size`           | Int    | The maximum size that the pool is allowed to reach, including both idle and in-use connections.                                 |
| `max-lifetime`                | Long   | The maximum lifetime of a connection in the pool.                                                                              |
| `validation-timeout`          | Long   | The maximum number of milliseconds that the pool will wait for a connection to be validated as alive.                                            |

## Queues configuration

### `kestra.jdbc.queues`

Kestra database queues simulate queuing doing long polling. They queries a `queues` table to detect new messages.

You can change these parameters to reduce the polling latency, but be aware it will increase the load on the database:

- `kestra.jdbc.queues.poll-size`: the maximum number of queues items fetched by each poll.
- `kestra.jdbc.queues.min-poll-interval`: the minimum duration between 2 polls.
- `kestra.jdbc.queues.max-poll-interval`: the maximum duration between 2 polls.
- `kestra.jdbc.queues.poll-switch-interval`: the delay for switching from min-poll-interval to max-poll-interval when no message is received. (ex: when one message is received, the `min-poll-interval` is used, if no new message arrived within `poll-switch-interval`, we switch to `max-poll-interval`).


Here is the default configuration:

```yaml
kestra:
  jdbc:
    queues:
      poll-size: 100
      min-poll-interval: 100ms
      max-poll-interval: 1000ms
      poll-switch-interval: 5s

```

### `kestra.jdbc.cleaner`

Kestra cleans the `queues` table periodically to avoid infinite grow. 
You can control how often you want this cleaning to happen, and how long messages should be kept in the `queues` table .

Here is the default configuration:

```yaml
kestra:
  jdbc:
    cleaner:
      initial-delay: 1h
      fixed-delay: 1h
      retention: 7d
```