---
title: Backup & Restore
icon: /docs/icons/admin.svg
---

Back up and restore your Kestra instance.

Kestra provides a backup feature for **metadata**. In addition, you can back up and restore the underlying database and internal storage if a metadata-only backup is not sufficient.

:::alert{type="info"}
The commands in the next section assume Kestra runs locally on the host. If you run Kestra in Docker, see the [container example](#example-backup-and-restore-inside-docker) below.
:::

## Metadata-only Backup & Restore (Enterprise Edition)

Since 0.19, [Kestra Enterprise Edition](../oss-vs-paid.md) provides **metadata** backup and restore. You can back up metadata from one Kestra instance and restore it into another—even across different Kestra versions or repository/queue backends.

We recommend performing metadata backup and restore while Kestra is paused to ensure consistency. As a best practice, enable [Maintenance Mode](../07.enterprise/05.instance/maintenance-mode.md) (available since 0.21) before starting.

A metadata backup includes all data **not** related to executions: blueprints, flows, namespaces, roles, secrets (for JDBC and Elasticsearch secrets-manager backends), security integrations, settings, templates, tenants, triggers, users, and access bindings. To include execution-related data, use the `--include-data` flag.

### Metadata backup

To back up instance metadata, run:

```bash
kestra backups create FULL
```

`FULL` backs up the entire instance. To back up a single tenant (when multi-tenancy is enabled), use `TENANT`. In `TENANT` mode, only the selected tenant’s data is included (global users/tenants are excluded).

Alternatively, you can also create a backup of only specific resources by using the `--resources` flag in the command. For example, to only create a backup of the [KV Store](../06.concepts/05.kv-store.md), use:

```bash
kestra backups create --resources KV_STORE
```

Other resources include: `FLOW`, `NAMESPACE_FILE`, `TRIGGER`, `LOG`, `SECRET`, and more.

By default, backups are encrypted with the embedded Kestra encryption key. You can change this behavior with:

- `--tenant` (for `TENANT` backups): the tenant name to back up. Defaults to the “default” tenant.
- `--encryption-key`: a custom encryption key to use instead of the embedded key.
- `--no-encryption`: disable encryption (not recommended; metadata may contain sensitive information).

:::badge{version=">=0.22" editions="EE"}
:::

- `--include-data`: include execution data (executions, logs, metrics, audit logs). By default, execution data is excluded due to potential size.
- `--internal-log`: set the level for internal logs to include in the backup.
- `-l, --log-level`: set the backup log level (`TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`). Default: `INFO`.

When you start the backup process from the command line, you will see the following logs which include a backup summary and the URI to the Kestra internal storage file where the backup will be stored.

```
2024-09-17 16:33:12,706 INFO  create       io.kestra.ee.backup.BackupService Backup summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, TRIGGER: 2, USER: 1]
2024-09-17 16:33:12,706 INFO  create       io.kestra.ee.backup.BackupService Backup instance created in 508 ms
Backup created: kestra:///backups/full/backup-20240917163312.kestra
```

### Metadata restore

To restore an instance from a metadata backup, run the following command using the internal-storage URI returned by the backup:

```bash
kestra backups restore kestra:///backups/full/backup-20240917163312.kestra
```

You can use the following command line parameters:

- `--encryption-key`: use it to specify a custom encryption key instead of the Kestra embedded one.
- `--to-tenant`: restore the backup into a different tenant.

Starting the restore process from the command line will display the following logs which include backup information and a restore summary.

```
2024-09-17 16:41:06,065 INFO  restore      io.kestra.ee.backup.BackupService Restoring kestra:///backups/full/backup-20240917163312.kestra
2024-09-17 16:41:06,149 INFO  restore      io.kestra.ee.backup.BackupService Restoring FULL backup from Kestra version 0.19.0-SNAPSHOT created at 2024-09-17T16:33:12.700099909
2024-09-17 16:41:06,150 INFO  restore      io.kestra.ee.backup.BackupService Backup summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, TRIGGER: 2, USER: 1]
2024-09-17 16:41:07,182 INFO  restore      io.kestra.ee.backup.BackupService Restore summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, USER: 1, TRIGGER: 2]
Backup restored from URI: kestra:///backups/full/backup-20240917163312.kestra
```

### Example: Backup and restore inside Docker

If Kestra runs in Docker, use `docker exec` and `docker cp` to move the backup file in and out of the container:

```bash
# Create a full backup (with execution data) from inside the container
docker exec your_container bash -c "./kestra backups create FULL --include-data --no-encryption"

# Copy the backup file from the container to a local directory
docker cp your_container:/app/storage/backups/full/backup123.kestra .

# After upgrading Kestra, copy the backup back into the container
docker cp ./backup123.kestra your_container:/app/storage/backups/full/

# Restore the backup from inside the container
docker exec your_container bash -c "./kestra backups restore kestra:///backups/full/backup123.kestra"
```

## Full backup and restore with backend tools

### Backup & Restore with the JDBC Backend

With the JDBC backend, Kestra can be backed up and restored using the database's native backup tools.

#### Backup & Restore for PostgreSQL

First, stop Kestra to ensure the database is in a stable state. Although `pg_dump` allows you to back up a running PostgreSQL database, it's always better to perform backups offline when possible.

Next, run the following command:

```bash
pg_dump -h localhost -p 5432 -U <username> -d <database> -F tar -f kestra.tar
```

To restore the backup to a new database, use `pg_restore`:

```bash
pg_restore -h localhost -p 5432 -U <username> -d <database> kestra.tar
```

Finally, restart Kestra.

#### Backup & Restore for MySQL

First, stop Kestra to ensure the database is in a stable state. Although MySQL's `mysqldump` allows you to back up a running MySQL database, it's always better to perform backups offline when possible.

Next, run the following command to back up the database:

```bash
mysqldump -h localhost -P 3306 -u <username> -p'<password>' <database> > kestra.sql
```

To restore the backup to a new database, use the following command:

```bash
mysql -h localhost -P 3306 -u <username> -p'<password>' <database> < kestra.sql
```

The `< kestra.sql` part tells MySQL to read and execute the SQL statements contained in the `kestra.sql` backup file as input.

Finally, restart Kestra.

---

### Backup & Restore with the Elasticsearch and Kafka Backend

With the Elasticsearch and Kafka backend, Kestra can be backed up and restored using Elasticsearch snapshots. Kafka will be reinitialized with the information from Elasticsearch.

This guide assumes you have already configured a snapshot repository in Elasticsearch named `my_snapshot_repository`. Elasticsearch provides several [backup options](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html). We will leverage basic snapshot and restore operations using the Elasticsearch API.

First, create an Elasticsearch snapshot named `kestra`:

```bash
# Kibana Dev Tools (Console) or curl (adjust host/auth as needed)
PUT _snapshot/my_snapshot_repository/kestra?wait_for_completion=true
```

Next, delete all Kestra indices (prefixed with `kestra_` by default) and recreate them using the snapshot:

```bash
POST _snapshot/my_snapshot_repository/kestra/_restore
{
  "indices": "kestra_*"
}
```

If you need to start from a fresh Kafka cluster, reindex Kafka from Elasticsearch with:

```bash
kestra sys-ee restore-queue
```

Since some execution information is stored only in Kafka, not all pending executions may be restarted.

Finally, restart Kestra.

### Backup & Restore of Internal Storage

Kestra’s internal storage can be either a local filesystem or object storage.

- **Local filesystem**: back up/restore the storage directory with your standard filesystem tools.
- **Managed object storage**: enable cross-region replication (often sufficient for DR) or use the provider’s backup tooling.
- **Self-hosted object storage (e.g., MinIO)**: use a tool like [Restic](https://blog.min.io/back-up-restic-minio/) and/or configure replication.
