---
title: Database Migrations
sidebarTitle: Database Migrations
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: How to run Kestra 2.0 database migrations before upgrading, including the migrate plan, run, and unlock commands and the EE startup behavior.
---

Run database migrations before starting Kestra 2.0 for the first time. The migration system applies schema changes, converts V1 trigger records, rehashes BasicAuth passwords, and migrates RBAC permissions.

## OSS vs. Enterprise behavior

| Edition | Default behavior |
|---|---|
| Open-source | Migrations run automatically on every startup. No configuration required. |
| Enterprise Edition | Migrations do **not** run automatically (`kestra.migration.auto=false` by default). Kestra **refuses to start** if any pending migrations exist. Execute `kestra migrate run` before restarting. |

To configure an EE instance to auto-migrate on startup, set:

```yaml
kestra:
  migration:
    auto: true
```

Running migrations manually with `kestra migrate run` is recommended for production. It gives you control over timing and lets you preview changes with `kestra migrate plan` first.

## Upgrade sequence

1. Stop all Kestra instances.
2. Run `kestra migrate plan` to preview pending migrations (optional but recommended).
3. Run `kestra migrate run`.
4. Restart all Kestra instances.

## Commands

### `kestra migrate plan`

Lists all pending migrations without applying any of them. Read-only: acquires no lock, writes nothing.

```bash
kestra migrate plan
```

Add `--sql` to print the raw SQL for each SQL-based migration:

```bash
kestra migrate plan --sql
```

Example output:

```
14 pending migration(s):
  2.0.01-upgrade — Schema upgrade from 1.x: drops deprecated tables, creates locks/task_outputs, adds VNode columns
  2.0.07-triggers — Convert V1 trigger rows to TriggerState format
  2.0.10-basic-auth-password — Rehash BasicAuth passwords from SHA-512 to bcrypt (CWE-916)
  ...
```

### `kestra migrate run`

Applies all pending migrations in order. Acquires a distributed lock so only one process runs migrations at a time.

```bash
kestra migrate run
```

If the lock is already held by another process, the command exits immediately with code `1`:

```
Migration lock is held by another process. Another instance may be running migrations.
If this is unexpected, use 'kestra migrate unlock' to force-release the lock.
```

`kestra migrate run` makes a single non-blocking lock attempt. There is no `--retry` or `--wait` option. Use `kestra migrate plan` to preview before running; there is no `--dry-run`.

### `kestra migrate unlock`

Force-releases the migration lock. Use this only when `kestra migrate run` exited abnormally and left the lock held.

```bash
kestra migrate unlock
```

:::alert{type="warning"}
**PostgreSQL, MySQL, and H2:** The migration lock is session-scoped and cannot be released from another process. `kestra migrate unlock` always exits `0` on these backends but does nothing. The lock releases automatically when the process that acquired it terminates. If `kestra migrate run` is stuck on a JDBC backend, kill the hung process. Do not use `migrate unlock` as a fix.

**Elasticsearch:** `kestra migrate unlock` works as expected and deletes the lock document.
:::

## Running migrations in Docker Compose

Override the container command to run migrations as a one-off step before starting the server:

```yaml
services:
  kestra:
    image: registry.kestra.io/docker/kestra-ee:latest
    command: migrate run
    # Use the same environment and volume mounts as your server service
```

Wait for the container to exit cleanly (exit code `0`), then start the server normally:

```yaml
services:
  kestra:
    image: registry.kestra.io/docker/kestra-ee:latest
    command: server standalone
```

## Running migrations in Kubernetes

Create a one-time Job before rolling out the updated server Pods:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: kestra-migrate
spec:
  template:
    spec:
      containers:
        - name: migrate
          image: registry.kestra.io/docker/kestra-ee:latest
          command: ["/app/kestra", "migrate", "run"]
          # Mount the same ConfigMap and Secrets as your server Deployment
      restartPolicy: Never
  backoffLimit: 0
```

Once the Job completes successfully, roll out your updated Kestra server Deployment as usual.

## What migrations run in 2.0

Kestra 2.0 applies multiple migration scripts depending on your backend and edition. Key migrations to be aware of:

| scriptId | Scope | Description |
|---|---|---|
| `2.0.01-upgrade` | OSS, JDBC | Drops deprecated `templates` and `executorstate` tables; creates `locks` and `task_outputs`; adds VNode columns and `trigger_id` to executions |
| `2.0.07-triggers` | OSS | Converts all V1 trigger rows to the TriggerState format used in 2.0 |
| `2.0.08-ee-worker-groups` | EE | Migrates the Worker Group schema to the 2.0 model |
| `2.0.10-basic-auth-password` | OSS | Rehashes BasicAuth passwords from SHA-512 to bcrypt (security fix, CWE-916) |
| `2.0.11-role-permissions-ee` | EE | Migrates RBAC permissions from the CRUD model to the Resource and Action model |

:::alert{type="warning"}
The `2.0.10-basic-auth-password` migration is irreversible. Once it runs, rolling back to Kestra 1.x will break BasicAuth login for all users.
:::

Use `kestra migrate plan --sql` before starting Kestra 2.0 to see the full list of pending scripts and their SQL.

## Configuration reference

| Property | Scope | Default | Description |
|---|---|---|---|
| `kestra.migration.auto` | EE only | `false` | When `true`, runs pending migrations automatically on startup. When `false`, Kestra refuses to start if any migrations are pending. |
| `kestra.migration.lock-acquire-timeout` | All | `PT1H` | Maximum time the startup auto-run waits to acquire the migration lock. Does not apply to `kestra migrate run`, which uses a single non-blocking attempt. |
| `kestra.migration.force-rerun-scripts` | EE only | `[]` | List of scriptIds to re-execute on every startup. Use for idempotent migrations targeting in-memory stores (such as H2) that reset on JVM restart. |
