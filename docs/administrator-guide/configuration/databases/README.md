---
order: 1
---
# Databases configuration

## Minimal examples
Most important configuration is to configure the way Kestra connect to a database. For now, Kestra support Postgres and Mysql.


Here is a minimal mysql configuration example :
```yaml
datasources:
  mysql:
    url: jdbc:mysql://local:3306/kestra
    driverClassName: com.mysql.cj.jdbc.Driver
    username: kestra
    password: k3str4
    dialect: MYSQL

kestra:
  queue:
    type: mysql
  repository:
    type: mysql
```


Here is minimal Postgres configuration:
```yaml
datasources:
  postgres:
    url: jdbc:postgresql://local:5432/kestra
    driverClassName: org.postgresql.Driver
    username: kestra
    password: k3str4

kestra:
  queue:
    type: postgres
  repository:
    type: postgres
```


## `datasources.*` properties
Since Kestra is built upon [micronaut](https://micronaut.io) and [HikariCP](https://github.com/brettwooldridge/HikariCP), many configurations are available in order to configure the database pool:


| Properties                    | Type   | Description                                                                                                                                           |
|-------------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `url`                         | String | Set the jdbc connection string.                                                                                                                       |
| `catalog`                     | String | Set the default schema name to be set on connections.                                                                                                 |
| `schema`                      | String | Set the default catalog name to be set on connections.                                                                                                |
| `username`                    | String | Set the default username used.                                                                                                                        |
| `password`                    | String | Set the default password to use.                                                                                                                      |
| `transaction-isolation`       | String | Set the default transaction isolation level.                                                                                                          |
| `pool-name`                   | String | Set the name of the connection pool.                                                                                                                  |
| `connection-init-sql`         | String | Set the SQL string that will be executed on all new connections when they are created, before they are added to the pool.                             |
| `connection-test-query`       | String | Set the SQL query to be executed to test the validity of connections.                                                                                 |
| `connection-timeout`          | Long   | Set the maximum number of milliseconds that a client will wait for a connection from the pool.                                                        |
| `idle-timeout`                | Long   | This property controls the maximum amount of time (in milliseconds) that a connection is allowed to sit idle in the pool.                             |
| `minimum-idle`                | Long   | The property controls the minimum number of idle connections that HikariCP tries to maintain in the pool, including both idle and in-use connections. |
| `initialization-fail-timeout` | Long   | Set the pool initialization failure timeout.                                                                                                          |
| `leak-detection-threshold`    | Long   | This property controls the amount of time that a connection can be out of the pool before a message is logged indicating a possible connection leak.  |
| `maximum-pool-size`           | Int    | The property controls the maximum size that the pool is allowed to reach, including both idle and in-use connections.                                 |
| `max-lifetime`                | Long   | This property controls the maximum lifetime of a connection in the pool.                                                                              |
| `validation-timeout`          | Long   | Sets the maximum number of milliseconds that the pool will wait for a connection to be validated as alive.                                            |
