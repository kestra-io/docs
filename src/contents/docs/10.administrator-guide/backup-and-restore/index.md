---
title: "Backup and Restore Kestra: Flows, Secrets, and Executions"
h1: How to back up and restore flows, secrets, and execution data
sidebarTitle: Backup & Restore
icon: /src/contents/docs/icons/admin.svg
description: Learn how to perform full or metadata-only backups and restores of your Kestra instance for disaster recovery and migration.
---

Kestra provides a built-in metadata backup feature in Enterprise Edition. For full disaster recovery, you can also back up the underlying database and internal storage directly using backend tools.

Backup and restore are CLI-only operations — there is no REST API, no UI, and no built-in scheduler. Wire the CLI commands into your own cron, CI/CD, or disaster-recovery tooling.

:::alert{type="info"}
The commands in the next section assume Kestra runs locally on the host. If you run Kestra in Docker, see the [container example](#example-backup-and-restore-inside-docker) below.
:::

## Metadata-only Backup & Restore (Enterprise Edition)

Since 0.19, [Kestra Enterprise Edition](../../oss-vs-paid/index.md) provides **metadata** backup and restore. You can back up metadata from one Kestra instance and restore it into another — even across different Kestra versions or repository/queue backends.

Perform metadata backup and restore while Kestra is paused to ensure consistency. As a best practice, enable [Maintenance Mode](../../07.enterprise/05.instance/maintenance-mode/index.md) (available since 0.21) before starting.

A metadata backup includes all data **not** related to executions: blueprints, flows, namespaces, roles, secrets (for JDBC and Elasticsearch secrets-manager backends), security integrations, settings, templates, tenants, triggers, users, and access bindings. To include execution-related data, use the `--include-data` flag.

Namespace discovery during backup relies on each resource's metadata repository. Ensure the required [metadata migrations](/docs/migration-guide/v1.3.0/lts-migration) have been run so that namespaces containing only KV items, namespace files, or secrets — but no flows — are correctly included.

A metadata backup is not a copy of internal storage. It keeps only the latest value of each KV entry, and `--include-data` adds execution records but not the input and output files stored for those executions. To move internal storage to a different backend, follow [Migrate internal storage to another backend](#migrate-internal-storage-to-another-backend) instead.

<!-- TODO: remove this alert once https://github.com/kestra-io/kestra-ee/issues/11801 is fixed. -->
:::alert{type="warning"}
Metadata restore does not preserve namespace file revisions. Each stored revision is restored as a separate file (for example, `run.py.v2` and `run.py.v3`), the original path serves the first revision, and empty folders are dropped.
:::

### Metadata backup

To back up instance metadata, run:

```bash
kestra backups create FULL
```

`FULL` backs up the entire instance. To back up a single tenant (when multi-tenancy is enabled), use `TENANT`. In `TENANT` mode, only the selected tenant’s data is included (global users/tenants are excluded).

To back up only specific resources, use the `--resources` flag. For example, to back up the [KV Store](../../06.concepts/05.kv-store/index.md):

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

```plaintext
2024-09-17 16:33:12,706 INFO  create       io.kestra.ee.backup.BackupService Backup summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, TRIGGER: 2, USER: 1]
2024-09-17 16:33:12,706 INFO  create       io.kestra.ee.backup.BackupService Backup instance created in 508 ms
Backup created: kestra:///backups/full/backup-20240917163312.kestra
```

### Metadata restore

To restore an instance from a metadata backup, run the following command using the internal-storage URI returned by the backup:

```bash
kestra backups restore kestra:///backups/full/backup-20240917163312.kestra
```

`LOG` and `METRIC` records do not carry stable identifiers and are always inserted rather than upserted. Re-running a restore that includes these types will add duplicate log and metric entries. Use `--resources` to exclude them from a re-run if the instance already contains data from a previous restore attempt.

**Restore options:**

- `--encryption-key`: decryption key. Falls back to the instance key if omitted; fails if neither is available.
- `--to-tenant`: restore a tenant backup into a different tenant. Not supported for full archives — the restore command fails if `--to-tenant` is used with a full archive.
- `--resources`: restore only specific resource types (same names as `create`).

:::alert{type="warning"}
To initialize a new tenant from another tenant on the same instance, create the backup without `--include-data`. Execution IDs are not scoped to a tenant, so executions restored into another tenant on the same instance collide with the source tenant's executions.
:::

Starting the restore process from the command line will display the following logs which include backup information and a restore summary.

```plaintext
2024-09-17 16:41:06,065 INFO  restore      io.kestra.ee.backup.BackupService Restoring kestra:///backups/full/backup-20240917163312.kestra
2024-09-17 16:41:06,149 INFO  restore      io.kestra.ee.backup.BackupService Restoring FULL backup from Kestra version 0.19.0-SNAPSHOT created at 2024-09-17T16:33:12.700099909
2024-09-17 16:41:06,150 INFO  restore      io.kestra.ee.backup.BackupService Backup summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, TRIGGER: 2, USER: 1]
2024-09-17 16:41:07,182 INFO  restore      io.kestra.ee.backup.BackupService Restore summary: [BINDING: 3, BLUEPRINT: 1, FLOW: 13, GROUP: 1, NAMESPACE: 1, ROLE: 6, SECRET: 1, SECURITY_INTEGRATION: 0, SETTING: 1, TENANT: 1, TENANT_ACCESS: 2, USER: 1, TRIGGER: 2]
Backup restored from URI: kestra:///backups/full/backup-20240917163312.kestra
```

### Example: Backup and restore inside Docker

If Kestra runs in Docker, use `docker exec` and `docker cp` to move the backup file in and out of the container:

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

First, create an Elasticsearch snapshot named `kestra`:

```bash
## Kibana Dev Tools (Console) or curl (adjust host/auth as needed)
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

Kestra doesn't back up internal storage itself, because it can hold arbitrary amounts of data. Use your storage provider's replication or backup tooling. To move internal storage to a different backend, see [Migrate internal storage to another backend](#migrate-internal-storage-to-another-backend).

## Migrate internal storage to another backend

To move internal storage from one object storage backend to another, for example from MinIO to Amazon S3, copy every object to the new bucket while Kestra is stopped, then point Kestra at the new bucket. The database stores files as `kestra:///` URIs without a bucket name or endpoint, so the database itself doesn't change.

This procedure moves internal storage only. [Metadata backup](#metadata-backup) can't do it, because it skips execution files and revision history.

### Prerequisites

- A host that can read the source bucket and a host that can write to the new bucket. One host can do both. The examples use the [AWS CLI](https://docs.aws.amazon.com/cli/) with one profile per backend, and `--endpoint-url` for S3-compatible storage such as MinIO.
- Enough local disk on each host for a full copy of the bucket.
- An empty bucket on the new backend.
- The database stays where it is. If you also move the database, dump and restore it in the same downtime window, so database and storage reflect the same point in time.

### Step 1: Stop Kestra

In Enterprise Edition, enable [Maintenance Mode](../../07.enterprise/05.instance/maintenance-mode/index.md) first. Wait for running executions to finish, then scale every Kestra component to zero. Keep Kestra stopped until step 6.

KV entries and namespace files are versioned: the database tracks each revision, and internal storage holds the content. If Kestra writes anything during the copy, the two drift apart and namespaces show missing or wrong content.

### Step 2: Copy the objects

Download the source bucket to a local folder, then upload that folder to the new bucket. Object keys become file paths on download and turn back into the same keys on upload:

```bash
aws s3 sync s3://<source-bucket> ./kestra-bucket --profile source --endpoint-url https://<minio-endpoint>
aws s3 sync ./kestra-bucket s3://<new-bucket> --profile target
```

If no single host can reach both backends, run the download and upload on different hosts and move the folder between them with a tool such as [Restic](https://restic.readthedocs.io/). Copy objects through the S3 API: an object store's on-disk data directory can't be loaded into a different backend.

`aws s3 sync` uploads only missing or changed files, so you can re-run it after an interruption.

### Step 3: Copy the folder markers

Kestra writes an empty object whose key ends with `/` for every folder. Copying through a local folder drops these markers, because a folder on disk isn't an object, and some bucket-to-bucket tools such as `aws s3 sync` skip them too. Kestra runs without them, but [metadata backups](#metadata-backup) silently leave out the namespace files of any namespace whose `_files/` marker is missing.

List the markers in the source bucket, then create them in the new bucket:

```bash
aws s3api list-objects-v2 --bucket <source-bucket> --profile source --endpoint-url https://<minio-endpoint> \
  --query "Contents[?ends_with(Key, '/')].Key" --output text | tr '\t' '\n' > markers.txt

while read -r key; do
  aws s3api put-object --bucket <new-bucket> --key "$key" --profile target > /dev/null
done < markers.txt
```

If one host can reach both backends, rclone 1.63 and later copies objects and markers bucket to bucket in one command, replacing steps 2 and 3: `rclone copy -M --create-empty-src-dirs --s3-directory-markers <source-remote>:<source-bucket> <target-remote>:<new-bucket>`.

### Step 4: Compare object counts

Count files and markers on both sides. Each pair of numbers must match:

```bash
## Files
aws s3api list-objects-v2 --bucket <source-bucket> --profile source --endpoint-url https://<minio-endpoint> --query "length(Contents[?!ends_with(Key, '/')])"
aws s3api list-objects-v2 --bucket <new-bucket> --profile target --query "length(Contents[?!ends_with(Key, '/')])"

## Folder markers
aws s3api list-objects-v2 --bucket <source-bucket> --profile source --endpoint-url https://<minio-endpoint> --query "length(Contents[?ends_with(Key, '/')])"
aws s3api list-objects-v2 --bucket <new-bucket> --profile target --query "length(Contents[?ends_with(Key, '/')])"
```

### Step 5: Point Kestra at the new backend

Change `kestra.storage` to the new backend. See [Internal storage](../../configuration/02.runtime-and-storage/index.md#internal-storage) for each backend's options.

Object keys must stay identical. If the source backend sets a key prefix with `path`, set the same `path` on the new backend. MinIO has no prefix option, so leave `path` unset when moving from MinIO:

```yaml
kestra:
  storage:
    type: s3
    s3:
      bucket: <new-bucket>
      region: <region>
```

### Step 6: Start Kestra and verify

Start Kestra, then check that:

- namespace files open and show their full revision history
- KV entries return their values
- input and output files of an older execution download

When everything checks out, disable Maintenance Mode.

### Roll back

The procedure doesn't modify the source bucket. To roll back, restore the previous `kestra.storage` configuration and restart Kestra.

Roll back only before any flow runs or file edits on the new backend. Anything written after the switch exists only in the new bucket, and Kestra serves the previous revision of an edited namespace file without reporting an error.
