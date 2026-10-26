---
title: Prevent Concurrent Changes to a Shared Resource with Asset Locks
h1: Prevent Concurrent Changes to a Shared Resource
description: Lock a Kestra asset while a flow patches or changes the resource, so other executions wait or skip their writes until the work is done.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
editions: ["EE", "Cloud"]
topics:
  - Kestra Concepts
  - DevOps
---

Lock an asset while one execution changes the underlying resource, so other executions can't change it at the same time.

Two executions that patch the same server, or a patch that runs while an inventory refresh rewrites the server's metadata, leave the resource and its asset record in an unknown state. An asset lock gives one execution exclusive write access for a limited time. Other executions either wait for the lock or have their writes skipped.

## Prerequisites

- A Kestra Enterprise Edition or Cloud instance.
- `LOCK` and `UNLOCK` permissions on the `ASSET` resource for the credentials that the lock tasks use. See [Connection properties for API-based tasks](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#connection-properties-for-api-based-tasks).
- An asset to lock. A lock can only be taken on an asset that exists.

## Register the resource as an asset

If the server isn't an asset yet, register it. This flow declares a `VM` asset as the output of a log task:

```yaml
id: register_db_server
namespace: company.infra

tasks:
  - id: register
    type: io.kestra.plugin.core.log.Log
    message: Registering db-prod-01
    assets:
      outputs:
        - id: vm.db-prod-01
          namespace: company.infra
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            provider: aws
            region: eu-west-1
            state: running
```

After one execution, `vm.db-prod-01` appears in the **Assets** list.

## Lock the asset around the work

This flow takes the lock, patches the server, records the patch on the asset, and releases the lock:

```yaml
id: patch_db_server
namespace: company.infra

tasks:
  - id: acquire_lock
    type: io.kestra.plugin.kestra.ee.locks.Acquire
    assetId: vm.db-prod-01
    ttl: PT30M
    retry:
      type: constant
      interval: PT1M
      maxAttempts: 30

  - id: patch
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - echo "Patching vm.db-prod-01"
      - sleep 60
    assets:
      outputs:
        - id: vm.db-prod-01
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            last_patched: "{{ execution.startDate }}"
            patched_by: "{{ execution.id }}"

finally:
  - id: release_lock
    type: io.kestra.plugin.kestra.ee.locks.Release
    assetId: vm.db-prod-01
```

Notice these choices:

- `ttl` covers the longest expected run of the work, with margin. If the execution stops without releasing the lock, the lock still expires.
- `retry` makes `acquire_lock` wait. If another owner holds the lock, `Acquire` fails with HTTP 423, and the retry tries again every minute for up to 30 attempts.
- The `patch` task writes the asset while the lock is held. The execution that holds the lock can write, and each write extends the lock.
- `release_lock` runs in [`finally`](../../05.workflow-components/19.finally/index.md), so the lock is released whether the patch succeeds or fails. `Release` does nothing if the lock has already expired.

Replace the Shell commands with your real patching task.

## See what a competing execution gets

Start `patch_db_server` twice in a row. The second execution's `acquire_lock` task fails with HTTP 423, retries, and takes the lock once the first execution releases it.

Writes that don't go through `Acquire` behave differently. This flow refreshes the inventory and writes the same asset without taking a lock:

```yaml
id: refresh_inventory
namespace: company.infra

tasks:
  - id: refresh
    type: io.kestra.plugin.core.log.Log
    message: Refreshing inventory for vm.db-prod-01
    assets:
      outputs:
        - id: vm.db-prod-01
          type: io.kestra.plugin.ee.assets.VM
          metadata:
            state: running
```

If it runs while `patch_db_server` holds the lock, the `refresh` task ends in `WARNING`, and its logs explain that the asset is locked. Kestra doesn't change the asset. To make that case fail the task instead, set `assetFailureBehavior: FAIL` in the task's `assets` block. See [Failure behavior](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#failure-behavior).

## Lock an asset for a maintenance window

To stop every flow from changing a resource during manual maintenance, lock it as a user:

1. Open the asset from the **Assets** list.
2. Open the **⋮** menu, select **Lock**, choose a duration from 5 minutes to 24 hours or **Custom**, and confirm.
3. When the maintenance is done, open the **⋮** menu and select **Unlock**.

A user lock blocks writes from every execution, including executions you start yourself. `Acquire` tasks fail with HTTP 423 until the lock ends.

To script the maintenance window, call the API. This request locks the asset for two hours:

```bash
curl -X POST "https://kestra.example.com/api/v1/main/assets/vm.db-prod-01/lock" \
  -H "Authorization: Bearer $KESTRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ttl": "PT2H"}'
```

This request removes the lock, whatever its owner:

```bash
curl -X DELETE "https://kestra.example.com/api/v1/main/assets/vm.db-prod-01/lock" \
  -H "Authorization: Bearer $KESTRA_API_TOKEN"
```

Removing a lock that an execution holds leaves that execution's later writes unprotected. Use it to clear a lock that a stopped execution left behind.

## Verify the result

- While `patch_db_server` runs, the asset's **Overview** tab shows who holds the lock and until when, and the **Assets** list can be filtered by lock status.
- After the run, the asset's metadata shows `last_patched` and `patched_by`, and the **Executions** tab lists both `register_db_server` and `patch_db_server`.
- If `refresh_inventory` ran during the patch, its execution ended in `WARNING`, and the asset's metadata still has the values from `patch_db_server`.

## Next steps

- [Acquire and Release reference](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#acquire-and-release)
- [How locks affect each write path](../../07.enterprise/02.governance/01.assets/03.manage-assets/index.md#lock-an-asset)
- [Asset best practices](../../14.best-practices/13.assets/index.md)
