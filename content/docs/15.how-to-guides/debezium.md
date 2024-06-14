---
title: Debezium
icon: /docs/icons/tutorial.svg
---

In order to ensure the change data capture works seamlessly and get the Debezium tasks running, you need to perform the necessary setup on the database. We will look into the setup steps in detail.

## Debezium with MySQL

In order for Debezium to work with MySQL, you need to enable binary logging on the MySQL server.

If you are running the MySQL server with Docker, use the following Docker command to start the MySQL container:

```
docker run -d \
  --name mysql \
  -v /var/lib/mysql:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root\
  mysql \
  mysqld \
  --datadir=/var/lib/mysql \
  --user=mysql \
  --server-id=1 \
  --log-bin=/var/lib/mysql/mysql-bin.log \
  --binlog_do_db=test_db \
  --binlog_do_db=other_db
```

> Note that you can add multiple DBs with `binlog_do_db` directive as per your requirement.

The MySQL server will start on the Docker container with binary logging enabled.

In case, you are using MySQL server with local installation, edit MySQL config file, usually located at `/etc/my.cnf` or `/etc/mysql/my.cnf`. Set the following (under [mysqld] section)

```
server_id               = 1
log_bin                 = /var/log/mysql/mysql-bin.log
max_binlog_size         = 100M
binlog_format           = mixed
```

For MySQL 8+, also add this
```
binlog_expire_logs_seconds = 864000
```

For MySQL 5, add
```
expire_log_days = 10 
```

Restart the MySQL server post the configuration change.

Once the MySQL server is up and running, you can connect to the MySQL instance using any MySQL client, and check whether the binary logging is enabled using the following SQL command:

```sql
SHOW VARIABLES LIKE 'log_bin';
```

You can now run the Debezium MySQL based tasks and triggers. Here is an example flow using Debezium MySQL Trigger:

```yaml

```

Debezium MySQL Trigger will collect the records from the change data capture in a batch based on `maxRecords` or `maxDuration`. The flow can then process this batch of records as required. Here is the output from the above flow showing the batch of records that is captured by the trigger:

