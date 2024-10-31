---
title: System Labels & Hidden Labels
icon: /docs/icons/admin.svg
editions: ["OSS", "EE"]
version: ">= 0.20.0"
---

Special labels for system use only.

## Overview

System Labels and Hidden Labels are special labels used to store additional metadata used by administrators to manage and monitor the platform. Those labels are by default hidden in the UI, e.g. if you want to display all Executions with a given Hidden Label, you need to explicitly filter for it within the `Labels` filter: `system.correlationId: 4DhfCBCDznBqipTAnd7zfm`.

TODO: add a screenshot of the UI once the new filter is implemented.

## Hidden Labels

Hidden Labels are labels hidden by default in the UI. You can configure the list of prefixes that should be hidden in the `kestra.hidden-labels.prefixes` configuration. For example, to hide all labels starting with `admin.` and `internal.`, you can add the following configuration to your `application.yaml`:

```yaml
kestra:
  hiddem-labels:
    prefixes:
      - system.
      - internal.
      - admin.
```

Note that System Labels are hidden by default but if you prefer to display them, you can remove the `system.` prefix from the list of hidden prefixes.


## System Labels

System Labels are labels that start with the `system.` prefix. Let's look at the available System Labels and their purpose.

### system.correlationId

The `system.correlationId` label is set by default for any execution and it's propagated to all downstream executions created by the `Subflow` or `ForEachItem` tasks. The value of the `system.correlationId` label is set to the first execution ID in the chain of executions. If you have a parent flow that triggers a subflow, the `system.correlationId` label will be the parent execution ID.

The main goal of this label is to help you track the lineage of executions and understand the relationship between them. For example, if you have a parent flow that triggers a subflow and this subflow triggers other subflows, filtering executions by the `system.correlationId` of the parent will allow you to track all executions that are part of the same lineage i.e. all executions that originated from that parent execution.

The Execution API will allow to pass this label at execution creation time but not at execution modification time.

### system.username

The `system.username` label is set by default for any execution and it's the username of the user who triggered the execution. This label is useful for auditing purposes and to understand who triggered a given execution.

### system.readOnly

The `system.readOnly` label is a special label that can be set on a flow to make it read-only. When a flow is marked as read-only, it will disable the editor in the UI. This label is useful when you want to prevent users from modifying a flow, for example, a production workflow that is deployed from a CI/CD pipeline after being approved and tested.

Here's how you can set the `system.readOnly` label on a flow:

```yaml
id: read_only_flow
namespace: company.team

labels:
  system.readOnly: "true"

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: Hello from a read-only flow!
```

As soon as you save that flow, try to edit it from the UI — you will notice that the editor is disabled.

![readOnly](/docs/concepts/system-labels/readOnly.png)

Note that on the Enterprise Edition, Kestra will refuse to update the flow server-side if the user is not a service account or an API key.
