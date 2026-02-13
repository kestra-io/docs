---
title: Kill Switch – Stop Problematic Executions (Enterprise)
description: Use Kill Switch in Kestra Enterprise to immediately kill, cancel, or ignore executions by scope, with scheduling, audit logs, and in-app banners.
sidebarTitle: Kill Switch
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: "1.3.0"
---

Kill Switch is an operational safety lever that lets administrators stop misbehaving executions directly from the UI. It replaces the older CLI-only `--skip` flags with a scoped, auditable experience.

> Located in **Instance Administration → Kill Switch**.

## What you can do

- Create a Kill Switch (with type, scope, schedule, and optional reason).
- View active Kill Switches and the archived history.
- See in-product banners that surface the reason to affected users.

## Kill Switch types

| Type | Behavior |
|------|----------|
| **KILL** | Immediately kills all running executions and worker tasks. New executions move to `KILLED` right away. |
| **CANCEL** | Blocks new executions; lets current task runs finish before marking the execution `CANCELLED`. |
| **IGNORE** | Ignores all messages for matching executions—use as a last resort when an execution cannot be killed or cancelled. |

For KILL and CANCEL, executions receive a system label identifying which Kill Switch applied.

## Configure a Kill Switch

### Scope
Pick exactly one scope; the UI shows the relevant multi-select:
- **Tenant**
- **Namespace**
- **Flow**
- **Execution**

### Scheduling
- Mandatory **Start Date** (default: now).
- Optional **End Date**.
- Enable/disable from the UI at any time.

### Reason
Optional free-text reason stored with the Kill Switch and surfaced in banners.

## Lifecycle and audit

- Creation and updates are written to **Audit Logs**.
- Deletion is a **soft delete** (archived). Archived entries stay visible for traceability.
- All state changes (create/enable/disable/archive) are logged.

## Announcement banner

Kill Switches raise contextual banners:
- Namespace scope: only users working in that namespace see the banner.
- Tenant scope: all users in the tenant see the banner across the UI.

## CLI compatibility

The CLI remains for open-source parity, with renamed flags to match the behavior:

```bash
# Old
--skip-executions / --skip-flows

# New
--ignore-executions / --ignore-flows
```

## Relationship to maintenance mode

Maintenance Mode pauses the platform broadly (queues new executions, lets running ones finish). Kill Switch keeps services up and targets specific tenants/namespaces/flows/executions to stop or ignore problematic runs—an operational tool rather than a platform pause.
