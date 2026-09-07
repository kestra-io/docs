---
title: local.Delete recursive Default Changed to false
sidebarTitle: local.Delete recursive Default
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The recursive property of io.kestra.plugin.fs.local.Delete now defaults to false. Flows that delete a directory without setting recursive explicitly will stop removing subdirectory contents after upgrading.
---

The `recursive` property of `io.kestra.plugin.fs.local.Delete` now defaults to `false` instead of `true`.

:::alert{type="warning"}
Flows that call `io.kestra.plugin.fs.local.Delete` on a directory without setting `recursive` explicitly will silently stop deleting subdirectory contents after upgrading to 2.0.0. No error is raised — the task will succeed but leave nested files in place.
:::

## Why the change

The previous default of `true` made directory deletions recursive without any explicit opt-in. A misconfigured `from` path could wipe an entire directory tree. The new default of `false` matches the behavior of every other `Delete` task in `plugin-fs` (SFTP, FTP, NFS, SMB) and requires an explicit opt-in for recursive deletion.

## Migration steps

1. Search all flows for tasks of type `io.kestra.plugin.fs.local.Delete`.
2. For each task where `from` points to a directory and `recursive` is not set, add `recursive: true` to preserve the previous behavior.
3. For tasks where `from` points to a single file, no change is needed — `recursive` has no effect on file targets.

**Before** (recursive deletion happened implicitly)

```yaml
- id: cleanup
  type: io.kestra.plugin.fs.local.Delete
  from: /data/uploads/processed/
```

**After** (opt in to keep the same behavior)

```yaml
- id: cleanup
  type: io.kestra.plugin.fs.local.Delete
  from: /data/uploads/processed/
  recursive: true
```
