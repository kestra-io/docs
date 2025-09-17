---
title: Reserved keywords cannot be used as Flow IDs
icon: /docs/icons/migration-guide.svg
release: 1.0.0
editions: ["OSS", "EE"]
---

## Overview

Starting with Kestra 1.0, certain keywords are reserved and **cannot be used as Flow IDs**. These identifiers collide with internal API endpoints and are therefore restricted.

**Reserved keywords:**

```
pause
resume
force-run
change-status
kill
executions
search
source
disable
enable
````

If your flows use one of these IDs, you will not be able to edit them after upgrading. To avoid disruption, you must rename the flows **before upgrading**.

See the [commit introducing this change](https://github.com/kestra-io/kestra/commit/d4e7b0cde4cf5cfad99b3fb39bff5728e056a049) for details.

---

## Migration

### 1. Identify impacted flows

Check if any flows are using one of the reserved keywords as their `id`.

```yaml
id: pause          # ❌ Invalid in 1.0
namespace: company.team

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "This flow will break after upgrade"
````

### 2. Copy the flow under a new ID

Create a new flow with a different `id` that does not use a reserved keyword.

```yaml
id: session_pause   # ✅ Valid in 1.0
namespace: company.team

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "This flow works in 1.0"
```

### 3. Remove the old flow

Once you have validated the new flow, delete the old flow with the reserved keyword `id`.

---

## Recommendation

Perform this migration **before upgrading to Kestra 1.0**, as otherwise you will not be able to edit affected flows after the upgrade.

