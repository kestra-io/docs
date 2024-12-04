---
title: System Labels & Hidden Labels
icon: /docs/icons/admin.svg
editions: ["OSS", "EE"]
version: ">= 0.20.0"
---

Special labels for system use only.

## Overview

System Labels and Hidden Labels are reserved for storing metadata used by administrators to manage and monitor Kestra. These labels are hidden in the UI by default. To view executions with a specific Hidden Label, you must explicitly filter for it using the `Labels` filter, such as `system.correlationId: 4DhfCBCDznBqipTAnd7zfm`.

![correlationId](/docs/concepts/correlationId.png)

---

## Hidden Labels

Hidden Labels are labels excluded from the UI by default. You can configure which prefixes should be hidden via the `kestra.hidden-labels.prefixes` configuration. For example, to hide labels starting with `admin.`, `internal.`, and `system.`, you can use the following configuration in your `application.yaml`:

```yaml
kestra:
  hidden-labels:
    prefixes:
      - system.
      - internal.
      - admin.
```

By default, System Labels (prefixed with `system.`) are hidden. To display them, simply remove the `system.` prefix from the list of hidden prefixes.

---

## System Labels

System Labels are labels prefixed with `system.` that serve specific purposes. Below are the available System Labels.

### `system.correlationId`

- Automatically set for every execution and propagated to downstream executions created by `Subflow` or `ForEachItem` tasks.
- Represents the ID of the first execution in a chain of executions, enabling tracking of execution lineage.
- Use this label to filter all executions originating from a specific parent execution.

For example, if a parent flow triggers multiple subflows, filtering by the parent's `system.correlationId` will display all related executions.

**Note:** The Execution API supports setting this label at execution creation but not modification.

---

### `system.username`

- Automatically set for every execution and contains the username of the user who triggered the execution.
- Useful for auditing and identifying who initiated specific executions.

---

### `system.readOnly`

- Used to mark a flow as read-only, disabling the flow editor in the UI.
- Helps prevent modifications to critical workflows, such as production flows managed through CI/CD pipelines.

**Example:**

```yaml
id: read_only_flow
namespace: company.team

labels:
  system.readOnly: true

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: Hello from a read-only flow!
```

Once this label is set, the editor for this flow will be disabled in the UI.

![readOnly](/docs/concepts/system-labels/readOnly.png)

**Note:** In the Enterprise Edition, updating a read-only flow server-side is restricted to service accounts or API keys.

