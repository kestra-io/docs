---
title: File-listing plugins now default to 25 results
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.3.0
description: All plugins that list files now cap results at 25 by default to protect execution size and database load; set an explicit limit if you need more.
---

## Context

Plugins that list files (local FS, SFTP, S3/GCS/Azure buckets, etc.) could previously return every matching object. In production, unbounded listings have produced executions with thousands of files, leading to huge `executions.value` payloads, overloaded MySQL/PostgreSQL storage, and, in worst cases, worker or server crashes.

## What changed

- A **default limit of 25 files** (e.g., `maxFiles: 25`) now applies to all file-listing plugins (tasks and triggers).
- The limit is **configurable** on each plugin — set it explicitly when you need more than 25 results.
- The change is **breaking** for users who relied on unbounded listings; those flows will now see truncated results unless a higher limit is provided.

## Who is affected

Any flow or trigger that lists files and expects more than 25 results in one invocation (for example, listing a bucket, large directory, or prefix/path on SFTP, local filesystems, S3/GCS/Azure, or similar storage backends).

## How to migrate

1) **Audit file-listing usages.** Identify tasks/triggers that list files (search for list-type tasks in your flow YAMLs, such as S3/GCS/Azure/FS/SFTP “List” operations).  
2) **Set an explicit limit where needed.** Add the plugin’s limit input (commonly named `limit`, sometimes `maxResults`/`maxKeys`, depending on the plugin) to the desired value. Refer to the plugin's documentation for properties.
3) **Prefer bounded values.** Raise the limit only as high as necessary; extremely large limits can still produce oversized executions and heavy database writes.  
4) **Consider pagination/partitioning.** Where possible, paginate by prefix/date folder or break listings into smaller batches to avoid large single executions.  
5) **Verify after upgrade.** Run validation or a dry-run listing in lower environments to confirm the new limit returns the expected number of files.
