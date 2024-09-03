---
title: Backup & Restore
icon: /docs/icons/admin.svg
---

Backup Kestra.

Kestra does not provide specific tools for backup and restore. However, Kestra uses a database and internal storage that can be backed up and restored.

## Backup & Restore with the JDBC Backend

With the JDBC backend, Kestra can be backed up and restored using the database's native backup tools. 

### Backup & Restore for PostgreSQL

First, stop Kestra to ensure the database is in a stable state. Although `pg_dump` allows you to back up a running PostgreSQL database, it's always better to perform backups offline when possible.

Next, run the following command:

```shell
pg_dump -h localhost -p 5432 -U <username> -d <database> -F tar -f kestra.tar
```

To restore the backup to a new database, use `pg_restore`:

```shell
pg_restore -h localhost -p 5432 -U <username> -d <database> kestra.tar
```

Finally, restart Kestra.

### Backup & Restore for MySQL

First, stop Kestra to ensure the database is in a stable state. Although MySQL's `mysqldump` allows you to back up a running MySQL database, it's always better to perform backups offline when possible.

Next, run the following command to back up the database:

```shell
mysqldump -h localhost -P 3306 -u <username> -p<password> <database> > kestra.sql
```

To restore the backup to a new database, use the following command:

```shell
mysql -h localhost -P 3306 -u <username> -p <password> <database> < kestra.sql
```

The `< kestra.sql` part tells MySQL to read and execute the SQL statements contained in the `kestra.sql` backup file as input.

Finally, restart Kestra.

---

## Backup & Restore with the Elasticsearch and Kafka Backend

With the Elasticsearch and Kafka backend, Kestra can be backed up and restored using Elasticsearch snapshots. Kafka will be reinitialized with the information from Elasticsearch.

This guide assumes you have already configured a snapshot repository in Elasticsearch named `my_snapshot_repository`. Elasticsearch provides several [backup options](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html). We will leverage basic snapshot and restore operations using the Elasticsearch API.

First, create an Elasticsearch snapshot named `kestra`:

```
PUT _snapshot/my_snapshot_repository/kestra?wait_for_completion=true
```

Next, delete all Kestra indices and recreate them using the snapshot:

```
POST _snapshot/my_snapshot_repository/kestra/_restore
{
  "indices": "kestra_*"
}
```

If you need to start from a fresh Kafka instance, you can reindex Kafka from the data in Elasticsearch using the following Kestra command:

```shell
kestra sys restore-queue
```

Since some execution information is stored only in Kafka, not all pending executions may be restarted.

Finally, restart Kestra.

## Backup & Restore of Internal Storage

Kestra's internal storage can be implemented using either a local filesystem or an object storage service.

If you're using the local filesystem implementation, you can back up and restore the directory with standard filesystem backup tools.

If you're using an object storage service provided by a cloud provider, you can replicate a bucket across multiple locations. Usually, this option is sufficient for disaster recovery. Alternatively, refer to your cloud provider's documentation for instructions on external bucket backup or replication to a different region.

If you're running your own object storage (e.g., using MinIO from our Helm Chart), you can [leverage Restic](https://blog.min.io/back-up-restic-minio/) or set up a replication strategy that fits your needs.