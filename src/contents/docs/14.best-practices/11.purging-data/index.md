---
title: Designing Data Retention and Purging in Kestra
sidebarTitle: Purging Data
icon: /src/contents/docs/icons/best-practices.svg
description: Learn how to choose the right purge strategy in Kestra for executions, logs, key-value pairs, Namespace files, assets, and other retained data.
---

How to choose the right purge strategy for operational data, retained artifacts, and mutable state in Kestra.

## Choose the right purge strategy

Kestra stores different kinds of data for different reasons. Some data supports execution history and troubleshooting, some supports runtime state, and some supports retained files or assets.

Because of that, purging data in Kestra is not a single decision. The right approach depends on:

- what kind of data you want to remove
- why the data exists
- how long you need to keep it
- whether you want hard deletion or simply to hide it from the UI

## Quick recommendation

Use this rule of thumb:

- purge **executions** and **logs** to control operational storage growth
- purge **KV pairs** only when they represent expired runtime state
- purge **Namespace files** only when you need version retention on file history
- purge **assets and lineage** only when you are enforcing a retention policy for asset metadata
- do not rely on UI deletion when your goal is storage reclamation or permanent deletion

## Comparison table

| If you want to remove... | Prefer | Why |
| --- | --- | --- |
| Old execution records | `PurgeExecutions` | It permanently deletes execution metadata and related execution data |
| Old execution and trigger logs | `PurgeLogs` | It is designed for bulk log cleanup |
| Expired runtime state in the KV Store | `PurgeKV` or automatic KV expiration purge | It removes stale KV entries without treating them as static configuration |
| Old Namespace file versions | `PurgeFiles` | It applies retention rules to Namespace files and their versions |
| Old asset records, usages, or lineage data | `PurgeAssets` | It applies retention to asset-related records without touching executions or logs |
| A flow, namespace, or other object only in the UI | UI deletion | It hides records, but does not perform the same hard deletion as purge tasks |

## Use purge tasks for retention, not for routine cleanup by hand

If data should be deleted on a recurring basis, treat it as a retention policy rather than a manual maintenance task.

Best practice:

- define retention periods explicitly
- schedule purge flows
- keep those flows in a central administrative or `system` namespace
- test purge behavior in non-production environments first

This makes retention predictable and easier to review.

## When to purge executions and logs

Use `PurgeExecutions` and `PurgeLogs` when your main goal is to reduce the footprint of historical operational data.

This is usually the right choice when:

- you no longer need old execution history for troubleshooting
- old logs are consuming storage
- you already have another system for long-term observability or audit retention

Best practice:

- set separate retention periods for executions and logs if your teams use them differently
- avoid deleting recent data that is still useful for troubleshooting failed workflows
- run purge flows on a schedule instead of waiting for storage pressure

## When to purge KV pairs

Use `PurgeKV` only for runtime state that has expired or is no longer valid.

The KV Store is best used for mutable state such as:

- cursors
- offsets
- checkpoints
- last processed timestamps

Best practice:

- set TTLs where possible
- enable automatic purging of expired KV pairs when that matches your operational model
- avoid using KV purge as a substitute for redesigning unclear state lifecycles

If a value is actually configuration or a secret, it probably does not belong in the KV Store in the first place.

## When to purge Namespace files

Use `PurgeFiles` when your goal is to manage retention of Namespace file versions rather than execution data.

This is useful when:

- teams frequently update scripts or SQL files stored as Namespace files
- you want to keep only the most recent versions
- you want to remove versions older than a given date

Best practice:

- scope purge rules with `filePattern` so you do not delete unrelated files
- define whether you want date-based or version-based retention
- be careful when applying purge rules across parent and child namespaces

## When to purge assets and lineage

Use `PurgeAssets` when you need retention for asset metadata, asset usage records, or lineage data.

This is different from purging executions or logs. Asset retention is its own concern and should be managed separately.

Best practice:

- filter by namespace, asset type, or metadata when possible
- define retention based on operational or compliance requirements
- purge only the records you intend to remove, especially if you want to keep lineage or usage data longer than the assets themselves

`PurgeAssets` is an Enterprise Edition feature.

## Purge tasks vs. UI deletion

Do not treat purge tasks and UI deletion as equivalent.

- purge tasks perform hard deletion and reclaim storage
- UI deletion is a soft deletion and preserves underlying history

Use purge tasks when you need permanent removal or storage reduction. Use UI deletion when you only want to remove an item from the visible working set without changing retention at the storage level.

## What purge tasks do not cover

Purge tasks are not a universal retention mechanism for every internal component.

In particular:

- purge tasks do not manage internal queue retention
- queue retention is configured separately depending on your backend

Avoid assuming that a purge flow alone covers all retained system data.

## Recommended patterns

### Pattern 1: Scheduled operational retention

Create a scheduled purge flow for executions and logs with a clearly defined retention period.

This is the most common pattern for controlling storage growth.

### Pattern 2: State lifecycle management for KV pairs

Use KV TTLs and expired-key cleanup for temporary runtime state rather than accumulating state indefinitely.

### Pattern 3: Version retention for Namespace files

Apply `PurgeFiles` with explicit namespace scope and file patterns when teams manage reusable scripts or SQL as Namespace files.

### Pattern 4: Separate retention policies by data type

Use different purge flows or schedules for executions, logs, KV pairs, Namespace files, and assets.

This keeps retention aligned with how each type of data is actually used.

## Anti-patterns

Avoid these patterns:

- using one retention period for every type of data without considering how the data is used
- relying on manual cleanup only after storage becomes a problem
- using UI deletion when you actually need hard deletion
- purging KV pairs that are really standing in for missing configuration or poor state design
- running broad Namespace file purges without a `filePattern` or namespace scope

## Decision guide

Ask these questions:

1. Is the data operational history, mutable state, retained files, or asset metadata?
Choose the purge task that matches that data type.

2. Do you need hard deletion or only to remove an item from the UI?
If you need permanent deletion, use a purge task.

3. Should the data expire automatically based on age or lifecycle?
If yes, define a retention policy and schedule it.

4. Is the data still needed for troubleshooting, auditability, or compliance?
If yes, shorten retention carefully rather than purging broadly.

5. Are you trying to solve a storage problem or a modeling problem?
If the data should never have been long-lived state, fix the design instead of only adding a purge flow.

## Summary

- Use purge tasks based on the type of data you want to remove.
- Treat retention as a deliberate operational policy, not an afterthought.
- Use hard-deletion purge tasks for permanent cleanup and storage reclamation.
- Keep separate retention strategies for executions, logs, KV pairs, Namespace files, and assets.

For the underlying purge tasks and configuration options, see [Purge old data in Kestra](../../10.administrator-guide/purge/index.md).
