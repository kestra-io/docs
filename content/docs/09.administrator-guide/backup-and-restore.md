---
title: Backup & Restore
icon: /docs/icons/admin.svg
---

Kestra didn't provide specific tools for backup and restore.
However, Kestra uses a database and an internal storage that can be backuped and restored using the implementation provided tools.

## Backup & Restore with the JDBC backend

With the JDBC backend, Kestra can be backuped and restored using the database provided tools,
the following example is when using Postgres, udpdate it with your database specific tools where needed.

First, you need to stop Kestra to be sure the database is in a stable state.
Postgres pg_dump allows to backup a running database so it may not be mandatory but if possible it's always better to do backup offline.

Then, you can use your database backup tool, for example, with Postgres:

```shell
pg_dump -h localhost -p 5432 -U <username> -d <database> -F tar -f kestra.tar
```

Then, you can use your database restore tool on a new database, for example, with Postgres:

```shell
pg_restore -h localhost -p 5432 -U <username> -d <database> kestra.tar
```

Finally, restart Kestra!

## Backup & Restore with the Elasticsearch and Kafka backend

With the Elasticsearch and Kafka backend, Kestra can be backuped and restored using Elasticsearch snapshots,
Kafka will then be reinitialized with the information from Elasticsearch.

In this guide, we assume you have an already configured snapshot repository in Elasticsearch that we named `my_snapshot_repository`, we will go througt basic snapshot and restore using the Elasticsearch API, for more advanced setup please see [Snapshot and restore](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html) from the Elasticsearch documentation.

First, we will create an Elasticsearch snapshot named `kestra`:

```
PUT _snapshot/my_snapshot_repository/kestra?wait_for_completion=true
```

Then, you can delete all kestra indices and recreate them using the snapshot:

```
POST _snapshot/my_fs_backup/kestra/_restore
{
  "indices": "kestra_*"
}
```

If you need to start from a fresh Kafka instance, you ca reindex Kafka from the data in Elasticsearch using the following Kestra command:

```shell
kestra sys restore-queue
```

Be aware that, as some execution information are only stored inside Kafka, pending executions may not all be restarted.

Finally, restart Kestra!

## Backup & Restore the internal storage

Kestra's internal storage is either implemented using a local filesystem or an object storage.

If you're using the local filesystem implementation, you can backup and restore the directory with standard filesystem backup tools.

If you're using an object storage provided by a cloud provider, they usually already replicate a bucket in multiple locations.
Depending on your availability need and you disaster recovery plan, this can be enought, if not, please reach to your cloud provider documentation for ways to backup externally a bucket or replicate to a different region (or multi-region).

If you're using an object storage that you run on yourself (for example using MinIO from ou Helm Chart), please backup as described in the object storage documentation or setup a replication strategy that fits your need.