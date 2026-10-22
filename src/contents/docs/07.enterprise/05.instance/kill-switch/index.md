---
title: "Kill Switch in Kestra Enterprise: Stop Executions"
h1: Immediately Kill, Cancel, or Ignore Executions by Scope
description: Use Kill Switch in Kestra Enterprise to immediately kill, cancel, or ignore executions by scope, with scheduling, audit logs, and in-app banners.
sidebarTitle: Kill Switch
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: "1.3.0"
---

Kill Switch is an operational safety lever that lets administrators stop misbehaving executions directly from the UI.

## Why a Kill Switch exists

A runaway flow, a bad deployment, or a tenant-specific incident can flood workers with problematic executions. The Kill Switch lets administrators halt or quarantine those executions instantly, without pausing the entire platform or touching infrastructure.

Kill Switch targets individual tenants, namespaces, flows, or executions, stopping or quarantining problematic runs without pausing the entire platform. Creation, enable, disable, and archive events are written to Audit Logs. Affected users see a contextual banner scoped to the affected namespace or tenant.

Kill Switch replaces the CLI-only `--skip-executions` and `--skip-flows` commands with a scoped, auditable administration interface.

## Configure a Kill Switch

Kill Switches are managed under **Instance Owner → Instance → Kill Switch**. Each switch has a name (e.g., `Kill Switch – Payments Namespace Outage (TEMP)`) and the specifications below.

### Kill Switch types

| Type | Behavior |
|------|----------|
| **KILL** | Kills running executions: Workers stop their running tasks, and remaining tasks don't run. New executions are saved as `KILLED` without running. |
| **CANCEL** | Marks running executions `CANCELLED` immediately, without stopping tasks already running on Workers; their results are discarded. New executions are saved as `CANCELLED` without running. |
| **IGNORE** | Ignores all messages for matching executions. Use it as a last resort when an execution can't be killed or canceled. |

Matching executions receive the `system.killSwitch` [system label](../../../06.concepts/system-labels/index.md), set to the action applied: `killed` or `cancelled`. New executions that match **IGNORE** are labeled `ignored`.

### Scope

Scope sets the reach of the Kill Switch with **Tenant** being the most inclusive and **Execution** the most specific. A **Namespace** scope requires a **Tenant**, and a **Flow** scope requires a **Tenant** and **Namespace**. The UI automatically adjusts to show only the relevant scope requirements depending on your first selection. 

All possible scopes are listed below:

- **Tenant**
- **Namespace**
- **Flow**
- **Execution**

### Scheduling

The Kill Switch requires a **Start Date** and can be kept open ended if needed.

- Mandatory **Start Date** (default: now)
- Optional **End Date**
- Enable/disable from the **Kill Switch** tab at any time

### Description

Admins can optionally include a free-text reason stored with the Kill Switch and surfaced in banners to document the incident or change request.

## Lifecycle and audit

Creation and updates are written to [**Audit Logs**](../../02.governance/06.audit-logs/index.md), and every state change (create, enable, disable, or archive) is recorded. Deleting a Kill Switch performs a soft delete, so the archived entry remains visible for traceability.

## Announcement banner

Kill Switches raise contextual banners to alert affected users. A namespace-scoped Kill Switch shows the banner only to users working in that namespace, while a tenant-scoped one surfaces the banner across the UI for all users in the tenant.

## CLI compatibility

The CLI remains for open-source parity, with renamed flags to match the behavior:

```bash
# Old
--skip-executions / --skip-flows

# New
--ignore-executions / --ignore-flows
```

The `kestra server executor` and `kestra server standalone` commands accept these troubleshooting flags. Each takes a comma-separated list:

| Flag | Ignores |
|---|---|
| `--ignore-executions` | Execution IDs |
| `--ignore-flows` | Flows, as `namespace.flowId` |
| `--ignore-namespaces` | Namespaces, as `tenant\|namespace` |
| `--ignore-tenants` | Tenant IDs |
| `--ignore-queue-records` | Queue record keys. Also available on the `controller`, `indexer`, and `webserver` commands. |

## Relationship to maintenance mode

[Maintenance Mode](../maintenance-mode/index.md) pauses the platform broadly: requests to create executions are held, and running executions don't advance until maintenance ends. Kill Switch keeps services up and targets specific tenants/namespaces/flows/executions to stop or ignore problematic runs: it is an operational tool, not a platform pause.
