---
title: Backup & Restore
icon: /docs/icons/admin.svg
---

Backup Kestra.

Kestra only provides a backup tool for Kestra __metadata__: all things that are not execution data.
However, Kestra uses a database and internal storage that can be backed up and restored if a metadata backup is not enough.

## Metadata only Backup & Restore in the Enterprise Edition

Since version 0.19, Kestra [Enterprise Edition](/enterprise) provides __metadata__ backup & restore.
This can be used to backup Kestra metadata in a Kestra instance, and restore them in another instance that can be in a different version or using a different backend.

It is strongly advised to backup and restore metadata when Kestra is stopped or the backup may not be in a consistency state.

Currently, metadata backup will backup everything that is not related to Kestra execution data, which includes at the time of writing this documentation: custom blueprints, flows, namespaces, roles, secrets (for JDBC and Elasticsearch secrets), security integrations, settings, templates, tenants, triggers and users.

### Metadata backup

To backup Kestra instance metadata you can use the following command:

```shell
kestra backups create FULL
```

`FULL` indicate that we want to backup the full instance, if you want to backup only a single tenant (in case multi-tenancy is enabled), you can use `TENANT` instead. In this case, users and tenants will not be included in the backup (only the selected tenant will be included).

By default, backups are encrypted using the Kestra embedded encryption key, this can be changed using command line parameters.

You can use the following command line parameters:
- `--tenant`: only when backup type is `TENANT`, use it to specify the name of the tenant to backup. If not set, the default tenant will be used.
- `--encryption-key`: use it to specify a custom encryption key instead of the Kestra embedded one.
- `--no-encryption`: use it to bypass backup encryption. Be careful that metadata can contain sensitive information so it may not be a good idea.

Launching the command line will display the following logs which include a backup summary and the URI to the Kestra internal storage file where the backup has been created.

```
2024-09-17 16:33:12,706 INFO  create       io.kestra.ee.backup.BackupService Backup summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, TRIGGER: 2, USER: 1]
2024-09-17 16:33:12,706 INFO  create       io.kestra.ee.backup.BackupService Backup instance created in 508 ms
Backup created: kestra:///backups/full/backup-20240917163312.kestra
```

### Metadata restore

To restore Kestra instance metadata you can use the following command with the URI provided by the backup command:

```shell
kestra backups restore kestra:///backups/full/backup-20240917163312.kestra
```

You can use the following command line parameters:
- `--encryption-key`: use it to specify a custom encryption key instead of the Kestra embedded one.

Launching the command line will display the following logs which include backup information and a restore summary.

```
2024-09-17 16:41:06,065 INFO  restore      io.kestra.ee.backup.BackupService Restoring kestra:///backups/full/backup-20240917163312.kestra
2024-09-17 16:41:06,149 INFO  restore      io.kestra.ee.backup.BackupService Restoring FULL backup from Kestra version 0.19.0-SNAPSHOT created at 2024-09-17T16:33:12.700099909
2024-09-17 16:41:06,150 INFO  restore      io.kestra.ee.backup.BackupService Backup summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, TRIGGER: 2, USER: 1]
2024-09-17 16:41:07,182 INFO  restore      io.kestra.ee.backup.BackupService Restore summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, USER: 1, TRIGGER: 2]
Backup restored from URI: kestra:///backups/full/backup-20240917163312.kestra
```

## Full Backup & Restore

### Backup & Restore with the JDBC Backend

With the JDBC backend, Kestra can be backed up and restored using the database's native backup tools.

#### Backup & Restore for PostgreSQL

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

#### Backup & Restore for MySQL

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

### Backup & Restore with the Elasticsearch and Kafka Backend

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

### Backup & Restore of Internal Storage

Kestra's internal storage can be implemented using either a local filesystem or an object storage service.

If you're using the local filesystem implementation, you can back up and restore the directory with standard filesystem backup tools.

If you're using an object storage service provided by a cloud provider, you can replicate a bucket across multiple locations. Usually, this option is sufficient for disaster recovery. Alternatively, refer to your cloud provider's documentation for instructions on external bucket backup or replication to a different region.

If you're running your own object storage (e.g., using MinIO from our Helm Chart), you can [leverage Restic](https://blog.min.io/back-up-restic-minio/) or set up a replication strategy that fits your needs.