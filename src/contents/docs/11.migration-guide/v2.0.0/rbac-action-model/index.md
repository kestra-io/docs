---
title: RBAC Permissions Replaced by Resource and Action Model
sidebarTitle: RBAC Action Model
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["EE", "Cloud"]
description: Kestra 2.0 replaces the CRUD-based permission model with a resource and action model. Existing roles are migrated automatically; this guide covers what changed, how migration maps old values, and how to update CLI role definitions.
---

Kestra 2.0 replaces the CRUD-based permission model (`READ`, `CREATE`, `UPDATE`, `DELETE`) with a resource and action model where each resource has its own set of specific actions.

## What changed

Previously, every resource shared the same four CRUD actions. Kestra 2.0 removes this uniform set and gives each resource its own actions that match what users actually do with it. For example:

- `EXECUTION: READ` no longer exists. Instead, `EXECUTION` now has `VIEW`, `LIST`, `ACCESS_LOGS`, `ACCESS_OUTPUTS`, `ACCESS_FILES`, and `FOLLOW` as separate actions.
- `FLOW: UPDATE` no longer covers enabling, disabling, or executing flows. Those are now `FLOW: ENABLE`, `FLOW: DISABLE`, and `FLOW: EXECUTE`.
- Namespace files moved from `FLOW: READ/UPDATE` to `NAMESPACE: MANAGE_FILES`.
- Triggers moved from `FLOW: READ` to their own `TRIGGER` resource.

### Resources that were renamed or consolidated

| Old resource | New resource | Notes |
|---|---|---|
| `SETTING` | `SYSTEM_SETTINGS` + `TENANT_SETTINGS` | Split into two resources |
| `AI_COPILOT` | `COPILOT` | Renamed |
| `APPEXECUTION` | `APP` | Merged; app execution actions moved onto `APP` |
| `TENANT_ACCESS` | `USER` | Merged; tenant access actions moved onto `USER` |
| `GROUP_MEMBERSHIP` | `GROUP` | Merged; membership actions (`MANAGE_MEMBERS`) moved onto `GROUP` |
| `IMPERSONATE` | `USER: IMPERSONATE` | Converted from a standalone resource to an action on `USER` |

### Resources that were removed

| Removed resource | Reason |
|---|---|
| `TEMPLATE` | Templates were deprecated in an earlier release and are no longer permission-controlled |

## Automatic migration

Existing role permissions in the database are migrated automatically when you upgrade. You do not need to manually recreate roles. The database migration (`V2_1RolePermissionMigration`) runs on startup and expands each old `(resource, CRUD action)` pair into the equivalent new actions.

:::alert{type="warning"}
`TEMPLATE` permissions are silently dropped during migration — there is no equivalent resource in 2.0. If any of your roles had `TEMPLATE` permissions, review those roles after upgrading.

`IMPERSONATE` permissions are also dropped — there is no direct migration path. Grant `USER: IMPERSONATE` explicitly on affected roles after upgrading.
:::

## CRUD → action migration mapping

The table below shows exactly how the migration expands each old CRUD action. Actions not listed for a combination are not granted.

| Resource (old) | CRUD action | New resource | New actions granted |
|---|---|---|---|
| `FLOW` | `READ` | `FLOW` | `VIEW`, `LIST`, `EXPORT` |
| `FLOW` | `CREATE` | `FLOW` | `CREATE`, `IMPORT` |
| `FLOW` | `UPDATE` | `FLOW` | `UPDATE`, `EXECUTE`, `DISABLE`, `ENABLE`, `VALIDATE` |
| `FLOW` | `DELETE` | `FLOW` | `DELETE` |
| `EXECUTION` | `READ` | `EXECUTION` | `VIEW`, `LIST`, `ACCESS_LOGS`, `ACCESS_OUTPUTS`, `ACCESS_FILES`, `EXPORT`, `FOLLOW` |
| `EXECUTION` | `UPDATE` | `EXECUTION` | `UPDATE`, `RESTART`, `KILL`, `REPLAY`, `PAUSE`, `RESUME`, `CHANGE_LABELS`, `UNQUEUE`, `FORCE_RUN` |
| `EXECUTION` | `DELETE` | `EXECUTION` | `DELETE` |
| `TRIGGER` | `READ` | `TRIGGER` | `VIEW`, `LIST`, `EXPORT` |
| `TRIGGER` | `UPDATE` | `TRIGGER` | `UNLOCK`, `RESTART`, `DISABLE`, `ENABLE`, `BACKFILL` |
| `TRIGGER` | `DELETE` | `TRIGGER` | `DELETE` |
| `NAMESPACE` | `READ` | `NAMESPACE` | `VIEW`, `LIST`, `EXPORT_PLUGIN_DEFAULTS` |
| `NAMESPACE` | `UPDATE` | `NAMESPACE` | `UPDATE`, `MANAGE_FILES`, `IMPORT_PLUGIN_DEFAULTS` |
| `NAMESPACE` | `CREATE` | `NAMESPACE` | `CREATE` |
| `NAMESPACE` | `DELETE` | `NAMESPACE` | `DELETE` |
| `APP` | `UPDATE` | `APP` | `UPDATE`, `EXECUTE`, `ACCESS_FILES`, `ACCESS_LOGS` |
| `APP` | `CREATE` | `APP` | `CREATE` |
| `APP` | `DELETE` | `APP` | `DELETE` |
| `USER` | `READ` | `USER` | `VIEW`, `LIST` |
| `USER` | `UPDATE` | `USER` | `UPDATE`, `MANAGE_GROUP_MEMBERSHIP` |
| `USER` | `CREATE` | `USER` | `CREATE` |
| `USER` | `DELETE` | `USER` | `DELETE` |
| `GROUP` | `READ` | `GROUP` | `VIEW`, `LIST` |
| `GROUP` | `UPDATE` | `GROUP` | `UPDATE`, `MANAGE_MEMBERS` |
| `GROUP` | `CREATE` | `GROUP` | `CREATE` |
| `GROUP` | `DELETE` | `GROUP` | `DELETE` |
| `AUDITLOG` | `READ` | `AUDITLOG` | `VIEW`, `LIST`, `EXPORT` |
| `AUDITLOG` | `CREATE` / `UPDATE` / `DELETE` | — | Not migrated (no equivalent actions) |
| `SETTING` | `READ` | `SYSTEM_SETTINGS` + `TENANT_SETTINGS` | `VIEW` on each |
| `SETTING` | `UPDATE` | `SYSTEM_SETTINGS` + `TENANT_SETTINGS` | `UPDATE` on each |
| `SETTING` | `CREATE` / `DELETE` | — | Not migrated |
| `AI_COPILOT` | `READ` | `COPILOT` | `USE` |
| `AI_COPILOT` | `CREATE` / `UPDATE` / `DELETE` | — | Not migrated |
| All other resources | `READ` | Same resource | `VIEW`, `LIST` |
| All other resources | `CREATE` | Same resource | `CREATE` |
| All other resources | `UPDATE` | Same resource | `UPDATE` |
| All other resources | `DELETE` | Same resource | `DELETE` |

## kestractl: updating role definitions

The `kestractl roles create` and `kestractl roles update` commands use `--permission RESOURCE:ACTION[,ACTION]` syntax. The action values are now specific names like `VIEW`, `EXECUTE`, and `ACCESS_LOGS`, not CRUD verbs.

:::alert{type="warning"}
`READ` is still accepted as a legacy alias and maps to `VIEW` only — it does **not** expand to `VIEW` + `LIST` + `ACCESS_LOGS` + other actions the way the automatic database migration does. Using old CRUD values in new role definitions will silently under-grant permissions.
:::

Update your `kestractl` scripts to use the new action names:

```bash
# Before
kestractl roles create --name operator \
  --permission FLOW:READ,UPDATE \
  --permission EXECUTION:READ,UPDATE

# After
kestractl roles create --name operator \
  --permission FLOW:VIEW,LIST,EXECUTE,DISABLE,ENABLE \
  --permission EXECUTION:VIEW,LIST,RESTART,KILL,ACCESS_LOGS,ACCESS_FILES,FOLLOW
```

If you use `--permissions-file`, update your YAML files in the same way:

```yaml
# Before
FLOW:
  - READ
  - UPDATE
EXECUTION:
  - READ
  - UPDATE

# After
FLOW:
  - VIEW
  - LIST
  - EXECUTE
  - DISABLE
  - ENABLE
EXECUTION:
  - VIEW
  - LIST
  - RESTART
  - KILL
  - ACCESS_LOGS
  - ACCESS_FILES
  - FOLLOW
```

## Migration steps

1. **Upgrade to Kestra 2.0** — the database migration runs automatically on startup and expands all existing role permissions.
2. **Review roles that had `TEMPLATE` or `IMPERSONATE` permissions** — these are dropped and must be reconfigured manually.
3. **Update `kestractl` scripts and permissions files** — replace old CRUD values with the new action names to ensure roles are created with the correct scope.
4. **Verify access with impersonation** — use the impersonate feature in the Kestra UI to confirm each role behaves as expected after the upgrade.

## Related

- [RBAC overview](../../../07.enterprise/03.auth/rbac/index.md) — resources, actions, and managed roles in 2.0
- [Permissions reference](../../../07.enterprise/03.auth/rbac/permissions-reference/index.md) — full resource-to-endpoint mapping for the new action model
- [kestractl roles](../../../kestra-cli/kestractl/index.md#roles) — updating CLI role definitions to use the new action names
