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

A metadata backup is not a copy of internal storage. It keeps only the latest value of each KV entry, and `--include-data` adds execution records but not the input and output files stored for those executions. To move internal storage to a different backend, follow [Migrate internal storage to another backend](#migrate-internal-storage-to-another-backend) instead.

<!-- TODO: remove this alert once https://github.com/kestra-io/kestra-ee/issues/11801 is fixed. -->
:::alert{type="warning"}
Metadata restore does not preserve namespace file revisions. Each stored revision is restored as a separate file (for example, `run.py.v2` and `run.py.v3`), the original path serves the first revision, and empty folders are dropped.
:::

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

Kestra doesn't back up internal storage itself, because it can hold arbitrary amounts of data. Use your storage provider's replication or backup tooling. To move internal storage to a different backend, see [Migrate internal storage to another backend](#migrate-internal-storage-to-another-backend).

## Migrate internal storage to another backend

To move internal storage from one object storage backend to another, for example from MinIO to Amazon S3 or SeaweedFS, copy every object to the new bucket while Kestra is stopped, then point Kestra at the new bucket. The database stores files as `kestra:///` URIs without a bucket name or endpoint, so the database itself doesn't change.

This procedure moves internal storage only. [Metadata backup](#metadata-backup-and-restore-enterprise-edition) can't do it, because it skips execution files and revision history.

### Prerequisites

- A host that can read the source bucket and a host that can write to the new bucket. One host can do both. The examples use the [AWS CLI](https://docs.aws.amazon.com/cli/) with one profile per backend, and `--endpoint-url` for S3-compatible storage such as MinIO.
- Enough local disk on each host for a full copy of the bucket.
- An empty bucket on the new backend.
- The database stays where it is. If you also move the database, dump and restore it in the same downtime window, so database and storage reflect the same point in time.

### Step 1: Stop Kestra

In Enterprise Edition, enable [Maintenance Mode](../../07.enterprise/05.instance/maintenance-mode/index.md) first. Wait for running executions to finish, then scale every Kestra component to zero. Keep Kestra stopped until step 7.

KV entries and namespace files are versioned: the database tracks each revision, and internal storage holds the content. If Kestra writes anything during the copy, the two drift apart and namespaces show missing or wrong content.

### Step 2: Remove file and folder name conflicts

If this instance ever ran a Kestra version earlier than 1.3.32, check for leftover empty objects that share a name with a namespace folder. MinIO hides the files inside such a folder from listings, so copies and metadata backups skip them without any error. Otherwise, skip this step.

Find these objects from the database:

```bash
psql -h <db-host> -U <username> -d <database> -At -F ' ' \
  -c "SELECT DISTINCT tenant_id, namespace, path FROM namespace_file_metadata WHERE path LIKE '%/' AND path <> '/'" > folders.txt

while read -r tenant namespace path; do
  key="$tenant/${namespace//.//}/_files${path%/}"
  aws s3api head-object --bucket <source-bucket> --key "$key" --profile source --endpoint-url https://<minio-endpoint> > /dev/null 2>&1 && echo "$key"
done < folders.txt > conflicts.txt
```

On MySQL, run the same `SELECT` with `mysql -N -B -e`. Review `conflicts.txt`, then delete each object it lists:

```bash
while read -r key; do
  aws s3api delete-object --bucket <source-bucket> --key "$key" --profile source --endpoint-url https://<minio-endpoint>
done < conflicts.txt
```

These empty objects aren't namespace files, so deleting them doesn't remove any content. If `conflicts.txt` is empty, there is nothing to remove.

### Step 3: Copy the objects

Download the source bucket to a local folder, then upload that folder to the new bucket. Object keys become file paths on download and turn back into the same keys on upload:

```bash
aws s3 sync s3://<source-bucket> ./kestra-bucket --profile source --endpoint-url https://<minio-endpoint>
aws s3 sync ./kestra-bucket s3://<new-bucket> --profile target
```

If no single host can reach both backends, run the download and upload on different hosts and move the folder between them with a tool such as [Restic](https://restic.readthedocs.io/). Copy objects through the S3 API: an object store's on-disk data directory can't be loaded into a different backend.

`aws s3 sync` uploads only missing or changed files, so you can re-run it after an interruption.

### Step 4: Copy the folder markers

Kestra writes an empty object whose key ends with `/` for every folder. Copying through a local folder drops these markers, because a folder on disk isn't an object, and some bucket-to-bucket tools such as `aws s3 sync` skip them too. Kestra runs without them, but [metadata backups](#metadata-backup) silently leave out the namespace files of any namespace whose `_files/` marker is missing.

List the markers in the source bucket, then create them in the new bucket:

```bash
aws s3api list-objects-v2 --bucket <source-bucket> --profile source --endpoint-url https://<minio-endpoint> \
  --query "Contents[?ends_with(Key, '/')].Key" --output text | tr '\t' '\n' > markers.txt

while read -r key; do
  aws s3api put-object --bucket <new-bucket> --key "$key" --profile target > /dev/null
done < markers.txt
```

If one host can reach both backends, rclone 1.63 and later copies objects and markers bucket to bucket in one command, replacing steps 3 and 4: `rclone copy -M --create-empty-src-dirs --s3-directory-markers <source-remote>:<source-bucket> <target-remote>:<new-bucket>`.

### Step 5: Compare object counts

Count files and markers on both sides. Each pair of numbers must match:

```bash
## Files
aws s3api list-objects-v2 --bucket <source-bucket> --profile source --endpoint-url https://<minio-endpoint> --query "length(Contents[?!ends_with(Key, '/')])"
aws s3api list-objects-v2 --bucket <new-bucket> --profile target --query "length(Contents[?!ends_with(Key, '/')])"

## Folder markers
aws s3api list-objects-v2 --bucket <source-bucket> --profile source --endpoint-url https://<minio-endpoint> --query "length(Contents[?ends_with(Key, '/')])"
aws s3api list-objects-v2 --bucket <new-bucket> --profile target --query "length(Contents[?ends_with(Key, '/')])"
```

### Step 6: Point Kestra at the new backend

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

### Step 7: Start Kestra and verify

Start Kestra, then check that:

- namespace files open and show their full revision history
- KV entries return their values
- input and output files of an older execution download

When everything checks out, disable Maintenance Mode.

### Roll back

The procedure doesn't modify the source bucket. To roll back, restore the previous `kestra.storage` configuration and restart Kestra.

Roll back only before any flow runs or file edits on the new backend. Anything written after the switch exists only in the new bucket, and Kestra serves the previous revision of an edited namespace file without reporting an error.

### Migrate to SeaweedFS

The same procedure moves internal storage to SeaweedFS. Download the bucket to a local folder, upload it to the SeaweedFS filer with `weed filer.copy`, which writes through the filer's gRPC port, then point Kestra's `seaweedfs` storage at that folder with `prefix`. Don't copy through the SeaweedFS S3 gateway, which isn't supported for this migration.

`prefix` requires `storage-seaweedfs` 2.0.0 or later, because earlier versions ignore it. With an earlier version, upload to the filer root instead and leave `prefix` unset.

The steps differ as follows:

- In step 3, run only the download command, then upload the folder's contents to a filer folder such as `/kestra/`:

  ```bash
  cd kestra-bucket
  weed filer.copy * http://<filer-host>:8888/kestra/
  ```

- Skip step 4. SeaweedFS stores folders as directories rather than empty objects, so there are no markers to copy, and metadata backups find namespace files without them.
- In step 5, compare the source file count with the count on the filer. The last line of `fs.tree` reports it as `<n> directories, <n> files`:

  ```bash
  echo "fs.tree /kestra" | weed shell -master=<master-host>:9333 -filer=<filer-host>:8888 | tail -1
  ```

- In step 6, configure the `seaweedfs` storage with that folder as `prefix`:

  ```yaml
  kestra:
    storage:
      type: seaweedfs
      seaweedfs:
        filer-host: <filer-host>
        filer-port: 18888
        prefix: kestra
  ```
