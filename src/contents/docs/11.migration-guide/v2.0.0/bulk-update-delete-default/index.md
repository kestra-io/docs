---
title: flows bulk-update --delete Default Changed to false
h1: Pass --delete Explicitly with flows bulk-update
sidebarTitle: bulk-update --delete Default
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The --delete flag on kestractl flows bulk-update now defaults to false. Pipelines that relied on the previous default will no longer delete flows absent from the file unless --delete is passed explicitly.
---

The `--delete` flag on `kestractl flows bulk-update` now defaults to `false` instead of `true`.

:::alert{type="warning"}
Pipelines that ran `kestractl flows bulk-update` without an explicit `--delete` flag previously deleted every flow absent from the file. After upgrading, those flows are left in place. Pass `--delete` explicitly to retain the old behavior.
:::

## Why the change

The previous default of `true` made `bulk-update` the only destructive-by-default command in the CLI. A truncated YAML file, bad merge, or partial pipeline output could silently wipe every flow not present in the file. The new default matches `flows namespace-sync`, the Git `SyncFlows` and `SyncNamespaceFiles` plugin tasks, and the server-side namespace update behavior changed in kestra-io/kestra#1462.

## Migration steps

1. Find all CI/CD pipeline invocations of `kestractl flows bulk-update`.
2. If a pipeline relied on implicit deletion, add `--delete` explicitly to preserve the behavior.

**Before** (deletion happened implicitly)

```bash
kestractl flows bulk-update --file flows.yaml
```

**After** (opt in to keep deletion behavior)

```bash
kestractl flows bulk-update --file flows.yaml --delete
```

Pipelines that never relied on implicit deletion require no change.
