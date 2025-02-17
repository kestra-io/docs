---
title: Restarting parent flow
icon: /docs/icons/migration-guide.svg
release: 0.21.0
editions: ["OSS", "EE"]
---

Restarting Parent Flow with Failed Subflow

## Overview

When restarting an execution, `Subflow` or `ForEachItem` tasks now restart the existing failed subflow execution rather than creating a new one. This behavior is configurable via the new `restartBehavior` enum property; setting it to `NEW_EXECUTION` retains the previous behavior ([PR #6799](https://github.com/kestra-io/kestra/pull/6799); [Issue #6722](https://github.com/kestra-io/kestra/issues/6722)). A `system.restarted: true` label is added during restart for tracking, and the underlying subflow execution storage table is retained to avoid migration issues (scheduled for removal in v0.22).

## Example

To keep the previous behavior of creating a new subflow execution when restarting the parent flow, set the `restartBehavior` property to `NEW_EXECUTION`:

```yaml
id: parent
namespace: company.team

tasks:
  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    namespace: company.team
    flowId: child
    restartBehavior: NEW_EXECUTION # or RETRY_FAILED
```

The default behavior is `RETRY_FAILED`, which restarts the existing failed subflow execution when restarting the parent flow.