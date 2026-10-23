---
title: "Backup and Restore Kestra: Flows, Secrets, and Executions"
h1: How to back up and restore flows, secrets, and execution data
sidebarTitle: Backup & Restore
icon: /src/contents/docs/icons/admin.svg
description: Learn how to perform full or metadata-only backups and restores of your Kestra instance for disaster recovery and migration.
---

Back up and restore your Kestra instance.

Kestra provides a built-in metadata backup feature in Enterprise Edition. For full disaster recovery, you can also back up the underlying database and internal storage directly using backend tools.

Backup and restore are CLI-only operations — there is no REST API, no UI, and no built-in scheduler. Wire the CLI commands into your own cron, CI/CD, or disaster-recovery tooling.

:::alert{type="info"}
The commands in the next section assume Kestra runs locally on the host. If you run Kestra in Docker, see the [container example](#example-backup-and-restore-inside-docker) below.
:::

## Metadata backup and restore (Enterprise Edition)

[Kestra Enterprise Edition](../../oss-vs-paid/index.md) provides metadata backup and restore. You can back up metadata from one Kestra instance and restore it into another — even across different Kestra versions or repository/queue backends.

Perform metadata backup and restore while Kestra is paused to ensure consistency. As a best practice, enable [Maintenance Mode](../../07.enterprise/05.instance/maintenance-mode/index.md) before starting.

### What is included

A metadata backup exports all resource types except execution history. By default, it includes:

apps, banners, bindings, blueprints, cases (with their templates, linked executions and events), credentials, dashboards, flows, groups, invitations, kill switches, KV entries, namespace files, namespaces, policies, promotion targets, roles, secrets (when using a compatible secret backend), security integrations, settings, tenants, tenant accesses, test suites, triggers, users, worker groups, and worker queues.

Execution data (executions, logs, metrics, audit logs, test runs) is excluded by default due to size. Use `--include-data` to include it.

Each backup run writes a new timestamped archive and never overwrites existing files. Archives are not pruned automatically — removing old archives is your responsibility.

### Metadata backup

To back up instance metadata, run:

```bash
kestra backups create FULL
```

`FULL` backs up the entire instance including all tenants and instance-level resources (users, settings, worker groups, kill switches). To back up a single tenant, use `TENANT` — only that tenant's data is included; instance-level resources are excluded.

To back up only specific resource types, use `--resources`:

```bash
kestra backups create FULL --resources FLOW,KV_STORE,SECRET
```

Available resource names: `APP`, `AUDIT_LOG`, `BANNER`, `BINDING`, `BLUEPRINT`, `CASE`, `CASE_EVENT`, `CASE_EXECUTION`, `CASE_TEMPLATE`, `CREDENTIAL`, `DASHBOARD`, `EXECUTION`, `FLOW`, `GROUP`, `INVITATION`, `KILL_SWITCH`, `KV_STORE`, `LOG`, `METRIC`, `NAMESPACE`, `NAMESPACE_FILE`, `POLICY`, `PROMOTION_TARGET`, `ROLE`, `SECRET`, `SECURITY_INTEGRATION`, `SETTING`, `TENANT`, `TENANT_ACCESS`, `TEST`, `TEST_RUN`, `TRIGGER_STATE`, `USER`, `WORKER_GROUP`, `WORKER_QUEUE`. `TRIGGER` is a deprecated alias of `TRIGGER_STATE`.

**Backup options:**

- `--tenant`: (for `TENANT` backups) the tenant to back up. Defaults to the `default` tenant.
- `--encryption-key`: a custom encryption key. If omitted, the instance encryption key (`kestra.encryption.secret-key`) is used. If neither is configured, the command fails.
- `--no-encryption`: disable encryption. Use only for non-sensitive content such as seeding a demo instance.
- `--include-data`: include execution data (executions, logs, metrics, audit logs, test runs). Excluded by default due to size.

When the backup completes, the CLI logs a summary and the internal storage URI of the archive:

```plaintext
2024-09-17 16:33:12,706 INFO  create       io.kestra.ee.backup.BackupService Backup summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, TRIGGER: 2, USER: 1]
2024-09-17 16:33:12,706 INFO  create       io.kestra.ee.backup.BackupService Backup instance created in 508 ms
Backup created: kestra:///backups/full/backup-20240917163312.kestra
```

Full archives are stored under `kestra:///backups/full/`; tenant archives under `kestra:///backups/tenants/<tenant>/`.

### Metadata restore

To restore from a metadata backup, run the command using the URI returned by the backup:

```bash
kestra backups restore kestra:///backups/full/backup-20240917163312.kestra
```

Restore is idempotent for most resource types. Records are upserted on a stable key, so a partially completed restore can be safely re-run for those types.

`LOG` and `METRIC` records do not carry stable identifiers and are always inserted rather than upserted. Re-running a restore that includes these types will add duplicate log and metric entries. Use `--resources` to exclude them from a re-run if the instance already contains data from a previous restore attempt.

The restore command checks the archive's Kestra version against the running instance and logs a warning when they differ. This does not block the restore, but review the warning before proceeding in production.

**Restore options:**

- `--encryption-key`: decryption key. Falls back to the instance key if omitted; fails if neither is available.
- `--to-tenant`: restore a tenant backup into a different tenant. Rewrites every record's tenant ID to the target tenant. Not supported for full archives — the restore command fails if `--to-tenant` is used with a full archive. When the source tenant still exists on the instance, the restore also fails if the backup contains executions, test runs or cases; see [Copy a tenant within the same instance](#copy-a-tenant-within-the-same-instance).
- `--resources`: restore only specific resource types (same names as `create`).

The CLI logs a summary when complete:

```plaintext
2024-09-17 16:41:06,065 INFO  restore      io.kestra.ee.backup.BackupService Restoring kestra:///backups/full/backup-20240917163312.kestra
2024-09-17 16:41:06,149 INFO  restore      io.kestra.ee.backup.BackupService Restoring FULL backup from Kestra version 2.0.0 created at 2024-09-17T16:33:12.700099909
2024-09-17 16:41:06,150 INFO  restore      io.kestra.ee.backup.BackupService Backup summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, TRIGGER: 2, USER: 1]
2024-09-17 16:41:07,182 INFO  restore      io.kestra.ee.backup.BackupService Restore summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, USER: 1, TRIGGER: 2]
Backup restored from URI: kestra:///backups/full/backup-20240917163312.kestra
```

### Copy a tenant within the same instance

To initialize a new tenant from an existing one on the same instance, create the target tenant, back up the source tenant without `--include-data`, and restore with `--to-tenant`:

```bash
kestra tenants create staging staging
kestra backups create TENANT --tenant main
kestra backups restore kestra:///backups/tenants/main/backup-20240917163312.kestra --to-tenant staging \
  --resources APP,BANNER,BINDING,BLUEPRINT,CREDENTIAL,DASHBOARD,FLOW,GROUP,INVITATION,KV_STORE,NAMESPACE,NAMESPACE_FILE,POLICY,PROMOTION_TARGET,ROLE,SECRET,SECURITY_INTEGRATION,TENANT_ACCESS,TEST,TRIGGER_STATE
```

While the source tenant exists on the instance, Kestra refuses to restore `EXECUTION`, `TEST_RUN`, `CASE`, `CASE_TEMPLATE`, `CASE_EXECUTION` and `CASE_EVENT` into another tenant. The check runs before anything is written, and the error lists the resources to exclude:

```plaintext
Cannot restore CASE_TEMPLATE into tenant 'staging' while the source tenant 'main' still exists on this instance. Exclude them from the restored resources, or restore the backup on another instance.
```

Every tenant has a default case template, so a restore with the default resources is always refused in this situation: pass `--resources` as above. Restoring into another instance, or restoring the backup of a deleted tenant, is not affected.

### Example: Backup and restore inside Docker

If Kestra runs in Docker, use `docker exec` and `docker cp` to move the archive in and out of the container:

```bash
## Create a full backup (with execution data) from inside the container
docker exec your_container bash -c "./kestra backups create FULL --include-data --no-encryption"

## Copy the backup file from the container to a local directory
docker cp your_container:/app/storage/backups/full/backup123.kestra .

## After upgrading Kestra, copy the backup back into the container
docker cp ./backup123.kestra your_container:/app/storage/backups/full/

## Restore the backup from inside the container
docker exec your_container bash -c "./kestra backups restore kestra:///backups/full/backup123.kestra"
```

## Full backup and restore with backend tools

### Backup and restore with the JDBC backend

Use the database's native backup tools to back up and restore Kestra when running the JDBC backend.

If the queue runs on a [dedicated queue database](../../configuration/02.runtime-and-storage/index.md#dedicated-queue-database), back up and restore both databases. Kestra doesn't recreate the `queues` table in an empty queue database, so restoring only the main database leaves Kestra unable to start.

#### PostgreSQL

Stop Kestra first to ensure the database is in a stable state.

```bash
pg_dump -h localhost -p 5432 -U <username> -d <database> -F tar -f kestra.tar
```

To restore:

```bash
pg_restore -h localhost -p 5432 -U <username> -d <database> kestra.tar
```

Restart Kestra after the restore completes.

#### MySQL

Stop Kestra first.

```bash
mysqldump -h localhost -P 3306 -u <username> -p'<password>' <database> > kestra.sql
```

To restore:

```bash
mysql -h localhost -P 3306 -u <username> -p'<password>' <database> < kestra.sql
```

Restart Kestra after the restore completes.

#### SQL Server

Stop Kestra first, then create a backup using SQL Server Management Studio or `sqlcmd`:

```sql
BACKUP DATABASE [kestra] TO DISK = '/var/opt/mssql/backup/kestra.bak' WITH INIT;
```

To restore:

```sql
RESTORE DATABASE [kestra] FROM DISK = '/var/opt/mssql/backup/kestra.bak' WITH REPLACE;
```

Restart Kestra after the restore completes.

### Backup and restore with the Elasticsearch and Kafka backend

With the Elasticsearch or OpenSearch backend, back up and restore using Elasticsearch snapshots. Kafka is reinitialized from Elasticsearch after the restore.

This guide assumes you have configured a snapshot repository named `my_snapshot_repository`. See the [Elasticsearch snapshot documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html) for setup options.

Create a snapshot:

```bash
## Kibana Dev Tools (Console) or curl (adjust host/auth as needed)
PUT _snapshot/my_snapshot_repository/kestra?wait_for_completion=true
```

Delete all Kestra indices and restore from the snapshot:

```bash
POST _snapshot/my_snapshot_repository/kestra/_restore
{
  "indices": "kestra_*"
}
```

If starting from a fresh Kafka cluster, reinitialize Kafka from Elasticsearch:

```bash
kestra sys-ee restore-queue
```

Some in-flight execution state is stored only in Kafka — pending executions may not be fully recovered.

Restart Kestra after the restore completes.

### Backup and restore of internal storage

Kestra's internal storage can be a local filesystem or object storage.

- **Local filesystem**: back up and restore the storage directory with your standard filesystem tools.
- **Managed object storage**: enable cross-region replication (often sufficient for DR) or use the provider's backup tooling.
- **Self-hosted object storage (e.g., Ceph or SeaweedFS)**: use a tool like [Restic](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html#amazon-s3) and/or configure replication.
