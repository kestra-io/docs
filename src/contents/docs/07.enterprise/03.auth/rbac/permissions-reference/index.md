---
title: RBAC Permissions Reference for Kestra Enterprise
h1: RBAC Resources and Actions Mapped to API Endpoints
description: Reference for Kestra RBAC resources and actions mapped to API endpoints. Use this to design least-privilege roles and troubleshoot authorization errors.
sidebarTitle: Permissions Reference
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
docId: iam
---

This reference maps each RBAC resource and action to the API endpoints that enforce it. Use it to design least-privilege roles and troubleshoot authorization errors.

## How to read this page

- Endpoints are grouped by resource and action.
- Each resource section gates all its endpoints: a user must have at least one valid action on the resource to reach any endpoint within it. Endpoints that do not check a specific action beyond this gate are marked "any action".
- Some endpoints require permissions on more than one resource; notes call these out.
- Namespace-scoped resources respect namespace bindings: access is evaluated against the namespace of the target item, and child namespaces inherit access.

:::collapse{title="FLOW"}
**Scope:** Namespace

**Actions and their meaning**
- `VIEW`: read a single flow, its graph, revisions, tasks, dependencies, and expressions context.
- `LIST`: search or browse flows.
- `CREATE`: create a flow. Creating a flow in a namespace that does not yet exist also requires `NAMESPACE: CREATE`.
- `UPDATE`: modify a flow's source, tasks, or graph.
- `DELETE`: delete a flow or its revisions.
- `EXECUTE`: trigger an execution of a flow.
- `DISABLE`: disable a flow.
- `ENABLE`: enable a disabled flow.
- `VALIDATE`: validate flow YAML. (Accessible with any `FLOW` action — no dedicated check.)
- `EXPORT`: export flows as a ZIP archive.
- `IMPORT`: import flows from an archive.

**Endpoints**

VIEW
- `GET /api/v1/{tenant}/flows/{namespace}/{id}`
- `GET /api/v1/{tenant}/flows/{namespace}/{id}/graph`
- `GET /api/v1/{tenant}/flows/{namespace}/{id}/revisions`
- `GET /api/v1/{tenant}/flows/{namespace}/{id}/tasks/{taskId}`
- `GET /api/v1/{tenant}/flows/{namespace}/{id}/dependencies`
- `GET /api/v1/{tenant}/namespaces/{namespace}/dependencies`
- `POST /api/v1/{tenant}/flows/expressions`

LIST
- `GET /api/v1/{tenant}/flows/search`
- `GET /api/v1/{tenant}/flows/{namespace}`
- `GET /api/v1/{tenant}/flows/source`
- `GET /api/v1/{tenant}/flows/distinct-namespaces` (any `FLOW` action)
- `GET /api/v1/{tenant}/flows/deprecated`

CREATE
- `POST /api/v1/{tenant}/flows` (single flow)
- `POST /api/v1/{tenant}/flows/{namespace}` (bulk upsert; also requires `UPDATE` and `DELETE`)

UPDATE
- `PUT /api/v1/{tenant}/flows/{namespace}/{id}`
- `PATCH /api/v1/{tenant}/flows/{namespace}/{id}/{taskId}`
- `POST /api/v1/{tenant}/flows/bulk` (also requires `CREATE` and `DELETE`)
- `POST /api/v1/{tenant}/executions/{executionId}/eval/{taskRunId}`
- `POST /api/v1/{tenant}/executions/{executionId}/{taskRunId}/eval`

DELETE
- `DELETE /api/v1/{tenant}/flows/{namespace}/{id}`
- `DELETE /api/v1/{tenant}/flows/{namespace}/{id}/revisions` (specific revisions)
- `DELETE /api/v1/{tenant}/flows/delete/by-query`
- `DELETE /api/v1/{tenant}/flows/delete/by-ids`

EXECUTE
- `POST /api/v1/{tenant}/executions/{namespace}/{id}` (create execution)
- `POST /api/v1/{tenant}/executions/{namespace}/{id}/validate`
- `GET /api/v1/{tenant}/executions/namespaces/{namespace}/flows`

DISABLE
- `POST /api/v1/{tenant}/flows/disable/by-query`
- `POST /api/v1/{tenant}/flows/disable/by-ids`

ENABLE
- `POST /api/v1/{tenant}/flows/enable/by-query`
- `POST /api/v1/{tenant}/flows/enable/by-ids`

EXPORT
- `GET /api/v1/{tenant}/flows/export/by-query`
- `POST /api/v1/{tenant}/flows/export/by-ids`
- `GET /api/v1/{tenant}/flows/export/by-query/csv` (streaming)

IMPORT
- `POST /api/v1/{tenant}/flows/import`

VALIDATE (any `FLOW` action — no dedicated check)
- `POST /api/v1/{tenant}/flows/validate`
- `POST /api/v1/{tenant}/flows/validate/task`
- `POST /api/v1/{tenant}/flows/validate/trigger`

Notes
- Webhook execution endpoints (`/executions/webhook/{namespace}/{id}/{key}`) are authorized by webhook key, not RBAC.
- `POST /api/v1/{tenant}/flows/graph` has no action check.
:::

---

:::collapse{title="EXECUTION"}
**Scope:** Namespace

**Actions and their meaning**
- `VIEW`: read a single execution's details, graph, or associated flow.
- `LIST`: search or browse executions.
- `DELETE`: delete executions.
- `RESTART`: restart one or more executions from the beginning or a specific task.
- `KILL`: kill a running execution.
- `REPLAY`: replay an execution (creates a new execution from a previous one).
- `PAUSE`: pause a running execution.
- `RESUME`: resume a paused execution.
- `CHANGE_LABELS`: update labels on a terminated execution.
- `ACCESS_LOGS`: read or stream execution logs.
- `ACCESS_OUTPUTS`: read task run outputs.
- `ACCESS_FILES`: download or preview execution output files.
- `FOLLOW`: stream live execution status events via SSE.
- `EXPORT`: export execution data as CSV.
- `UNQUEUE`: move a queued execution out of the queue.
- `FORCE_RUN`: force a paused or queued execution to run immediately.
- `UPDATE`: change the state of a task run within an execution.

**Endpoints**

VIEW
- `GET /api/v1/{tenant}/executions/{executionId}`
- `GET /api/v1/{tenant}/executions/{executionId}/graph`
- `GET /api/v1/{tenant}/executions/{executionId}/flow`
- `GET /api/v1/{tenant}/executions/flows/{namespace}/{flowId}`

LIST
- `GET /api/v1/{tenant}/executions/search`
- `GET /api/v1/{tenant}/executions`
- `GET /api/v1/{tenant}/executions/flows/{namespace}/{flowId}` (search by flow)
- `GET /api/v1/{tenant}/executions/namespaces` (distinct namespaces with executions)
- `POST /api/v1/{tenant}/executions/latest` (any `EXECUTION` action)

DELETE
- `DELETE /api/v1/{tenant}/executions/{executionId}`
- `DELETE /api/v1/{tenant}/executions/by-ids`
- `DELETE /api/v1/{tenant}/executions/by-query`
- `DELETE /api/v1/{tenant}/logs/{executionId}` (delete logs for an execution)
- `DELETE /api/v1/{tenant}/logs/{namespace}/{flowId}` (delete logs for a flow)

RESTART
- `POST /api/v1/{tenant}/executions/{executionId}/restart`
- `POST /api/v1/{tenant}/executions/restart/by-ids`
- `POST /api/v1/{tenant}/executions/restart/by-query`

KILL
- `DELETE /api/v1/{tenant}/executions/{executionId}/kill`
- `DELETE /api/v1/{tenant}/executions/kill/by-ids`
- `DELETE /api/v1/{tenant}/executions/kill/by-query`

REPLAY
- `POST /api/v1/{tenant}/executions/{executionId}/replay`
- `POST /api/v1/{tenant}/executions/{executionId}/replay-with-inputs`
- `POST /api/v1/{tenant}/executions/replay/by-ids`
- `POST /api/v1/{tenant}/executions/replay/by-query`

PAUSE
- `POST /api/v1/{tenant}/executions/{executionId}/pause`
- `POST /api/v1/{tenant}/executions/pause/by-ids`
- `POST /api/v1/{tenant}/executions/pause/by-query`

RESUME
- `POST /api/v1/{tenant}/executions/{executionId}/resume`
- `POST /api/v1/{tenant}/executions/{executionId}/resume-from-breakpoint`
- `POST /api/v1/{tenant}/executions/resume/by-ids`
- `POST /api/v1/{tenant}/executions/resume/by-query`

CHANGE_LABELS
- `POST /api/v1/{tenant}/executions/{executionId}/labels`
- `POST /api/v1/{tenant}/executions/labels/by-ids`
- `POST /api/v1/{tenant}/executions/labels/by-query`

ACCESS_LOGS
- `GET /api/v1/{tenant}/logs/search`
- `GET /api/v1/{tenant}/logs/{executionId}`
- `GET /api/v1/{tenant}/logs/{executionId}/download`
- `GET /api/v1/{tenant}/logs/{executionId}/follow` (SSE log stream)

ACCESS_OUTPUTS
- `GET /api/v1/{tenant}/outputs/{executionId}/{taskRunId}`
- `GET /api/v1/{tenant}/outputs/{executionId}`

ACCESS_FILES
- `GET /api/v1/{tenant}/executions/{executionId}/file`
- `GET /api/v1/{tenant}/executions/{executionId}/file/metas`
- `GET /api/v1/{tenant}/executions/{executionId}/file/preview`

FOLLOW
- `GET /api/v1/{tenant}/executions/{executionId}/follow` (SSE execution state stream)
- `GET /api/v1/{tenant}/executions/{executionId}/follow-dependencies`

EXPORT
- `GET /api/v1/{tenant}/executions/export/by-query/csv` (streaming)

UNQUEUE
- `POST /api/v1/{tenant}/executions/{executionId}/unqueue`
- `POST /api/v1/{tenant}/executions/unqueue/by-ids`
- `POST /api/v1/{tenant}/executions/unqueue/by-query`

FORCE_RUN
- `POST /api/v1/{tenant}/executions/{executionId}/force-run`
- `POST /api/v1/{tenant}/executions/force-run/by-ids`
- `POST /api/v1/{tenant}/executions/force-run/by-query`

UPDATE
- `POST /api/v1/{tenant}/executions/{executionId}/state`
- `POST /api/v1/{tenant}/executions/change-status/by-ids`
- `POST /api/v1/{tenant}/executions/change-status/by-query`
- `POST /api/v1/{tenant}/executions/{executionId}/{taskRunId}/state`

Notes
- Webhook execution endpoints are authorized by webhook key only; RBAC is not checked.
- Execution creation (`POST /executions/{namespace}/{id}`) checks `FLOW: EXECUTE`, not an `EXECUTION` action.
:::

---

:::collapse{title="TRIGGER"}
**Scope:** Namespace

**Actions and their meaning**
- `LIST`: search or browse triggers.
- `UNLOCK`: unlock a locked trigger.
- `RESTART`: restart a trigger.
- `DISABLE` / `ENABLE`: disable or enable triggers (both operations currently check the `DISABLE` action).
- `DELETE`: delete triggers.
- `EXPORT`: export trigger configuration.
- `BACKFILL`: create, pause, unpause, or delete a backfill on a schedule trigger.

**Endpoints**

LIST
- `GET /api/v1/{tenant}/triggers/search`
- `GET /api/v1/{tenant}/triggers/{namespace}/{flowId}`

UNLOCK
- `POST /api/v1/{tenant}/triggers/{namespace}/{flowId}/{triggerId}/unlock`
- `POST /api/v1/{tenant}/triggers/unlock/by-ids`

RESTART
- `POST /api/v1/{tenant}/triggers/{namespace}/{flowId}/{triggerId}/restart`

DISABLE / ENABLE
- `POST /api/v1/{tenant}/triggers/disable/by-ids` (also used for re-enabling)

DELETE
- `DELETE /api/v1/{tenant}/triggers/{namespace}/{flowId}/{triggerId}`
- `DELETE /api/v1/{tenant}/triggers/by-ids`
- `DELETE /api/v1/{tenant}/triggers/by-query`

EXPORT
- `GET /api/v1/{tenant}/triggers/export/by-query` (streaming)

BACKFILL
- `POST /api/v1/{tenant}/triggers/backfills` (create)
- `POST /api/v1/{tenant}/triggers/backfills/pause`
- `POST /api/v1/{tenant}/triggers/backfills/pause/by-ids`
- `POST /api/v1/{tenant}/triggers/backfills/unpause`
- `POST /api/v1/{tenant}/triggers/backfills/unpause/by-ids`
- `DELETE /api/v1/{tenant}/triggers/backfills`
- `DELETE /api/v1/{tenant}/triggers/backfills/by-ids`
:::

---

:::collapse{title="NAMESPACE"}
**Scope:** Namespace

**Actions and their meaning**
- `VIEW`: read a namespace's details, inherited variables, and inherited plugin defaults.
- `LIST`: search or browse namespaces.
- `CREATE`: create a namespace.
- `UPDATE`: update namespace configuration.
- `DELETE`: delete a namespace.
- `MANAGE_FILES`: all namespace file operations (search, read, create, move, delete, export).
- `EXPORT_PLUGIN_DEFAULTS`: export a namespace's plugin defaults.
- `IMPORT_PLUGIN_DEFAULTS`: import plugin defaults into a namespace.

**Endpoints**

VIEW
- `GET /api/v1/{tenant}/namespaces/{id}`
- `GET /api/v1/{tenant}/namespaces/{id}/inherited-variables`
- `GET /api/v1/{tenant}/namespaces/{id}/inherited-plugindefaults`

LIST
- `GET /api/v1/{tenant}/namespaces/search`
- `POST /api/v1/{tenant}/namespaces/autocomplete`

CREATE
- `POST /api/v1/{tenant}/namespaces`

UPDATE
- `PUT /api/v1/{tenant}/namespaces/{id}`

DELETE
- `DELETE /api/v1/{tenant}/namespaces/{id}`

MANAGE_FILES (all namespace file operations)
- `GET /api/v1/{tenant}/namespaces/{namespace}/files/search`
- `GET /api/v1/{tenant}/namespaces/{namespace}/files`
- `GET /api/v1/{tenant}/namespaces/{namespace}/files/stats`
- `GET /api/v1/{tenant}/namespaces/{namespace}/files/revisions`
- `GET /api/v1/{tenant}/namespaces/{namespace}/files/directory`
- `GET /api/v1/{tenant}/namespaces/{namespace}/files/export`
- `POST /api/v1/{tenant}/namespaces/{namespace}/files/directory` (create directory)
- `POST /api/v1/{tenant}/namespaces/{namespace}/files` (create file)
- `PUT /api/v1/{tenant}/namespaces/{namespace}/files` (move file or directory)
- `DELETE /api/v1/{tenant}/namespaces/{namespace}/files` (delete file or directory)

EXPORT_PLUGIN_DEFAULTS
- `POST /api/v1/{tenant}/namespaces/{id}/plugindefaults/export`

IMPORT_PLUGIN_DEFAULTS
- `POST /api/v1/{tenant}/namespaces/{id}/plugindefaults/import`
:::

---

:::collapse{title="KVSTORE"}
**Scope:** Namespace

**Actions and their meaning**
- `VIEW`: read a KV entry.
- `LIST`: list or browse KV entries, including inherited entries.
- `CREATE` / `UPDATE`: set a KV value (the same endpoint creates or updates depending on whether the key exists).
- `DELETE`: delete KV entries.

**Endpoints**

VIEW
- `GET /api/v1/{tenant}/namespaces/{namespace}/kv/{key}`
- `GET /api/v1/{tenant}/namespaces/{namespace}/kv/{key}/detail`

LIST
- `GET /api/v1/{tenant}/namespaces/{namespace}/kv`
- `GET /api/v1/{tenant}/namespaces/{namespace}/kv/inheritance`

CREATE / UPDATE
- `PUT /api/v1/{tenant}/namespaces/{namespace}/kv/{key}` (creates if key does not exist, updates if it does)

DELETE
- `DELETE /api/v1/{tenant}/namespaces/{namespace}/kv/{key}`
- `DELETE /api/v1/{tenant}/namespaces/{namespace}/kv` (bulk delete)
:::

---

:::collapse{title="DASHBOARD"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: read dashboards and their charts.
- `CREATE`: create dashboards.
- `UPDATE`: update dashboard configuration.
- `DELETE`: delete dashboards.

**Endpoints**

VIEW / LIST (any `DASHBOARD` action — no dedicated per-action check at controller level)
- `GET /api/v1/{tenant}/dashboards`
- `GET /api/v1/{tenant}/dashboards/{id}`
- `POST /api/v1/{tenant}/dashboards/{id}/charts/{chartId}`
- `POST /api/v1/{tenant}/dashboards/charts/preview`
- `POST /api/v1/{tenant}/dashboards/validate`
- `POST /api/v1/{tenant}/dashboards/validate/chart`
- `POST /api/v1/{tenant}/dashboards/{id}/charts/{chartId}/export/to-csv`
- `POST /api/v1/{tenant}/dashboards/charts/export/to-csv`

CREATE
- `POST /api/v1/{tenant}/dashboards`

UPDATE
- `PUT /api/v1/{tenant}/dashboards/{id}`

DELETE
- `DELETE /api/v1/{tenant}/dashboards/{id}`
:::

---

:::collapse{title="SECRET"}
**Scope:** Namespace

**Actions and their meaning**
- `VIEW` / `LIST`: list secrets and view their metadata. Secret values are never returned by the API.
- `UPDATE`: create or update a secret (creation is enforced via this action).
- `DELETE`: delete a secret.

**Endpoints**

VIEW / LIST (any `SECRET` action)
- `GET /api/v1/{tenant}/namespaces/{namespace}/secrets`
- `GET /api/v1/{tenant}/namespaces/{namespace}/inherited-secrets`

UPDATE
- `PUT /api/v1/{tenant}/namespaces/{namespace}/secrets`
- `PATCH /api/v1/{tenant}/namespaces/{namespace}/secrets/{key}`

DELETE
- `DELETE /api/v1/{tenant}/namespaces/{namespace}/secrets/{key}`

Notes
- `SECRET` has no `CREATE` action; creation uses `UPDATE`.
:::

---

:::collapse{title="CREDENTIAL"}
**Scope:** Namespace or tenant (depending on whether the credential is namespace-level or tenant-level)

**Actions and their meaning**
- `VIEW` / `LIST`: list and view credentials.
- `CREATE`: create credentials.
- `UPDATE`: update credentials or test a connection.
- `DELETE`: delete credentials.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/credentials`
- `GET /api/v1/{tenant}/credentials/{id}`
- `GET /api/v1/{tenant}/namespaces/{namespace}/credentials`
- `GET /api/v1/{tenant}/namespaces/{namespace}/credentials/{name}`
- `GET /api/v1/{tenant}/namespaces/{namespace}/credentials/inherited`

CREATE
- `POST /api/v1/{tenant}/credentials`
- `POST /api/v1/{tenant}/namespaces/{namespace}/credentials`

UPDATE
- `PUT /api/v1/{tenant}/credentials/{id}`
- `POST /api/v1/{tenant}/credentials/{id}/test`
- `PUT /api/v1/{tenant}/namespaces/{namespace}/credentials/{name}`
- `POST /api/v1/{tenant}/namespaces/{namespace}/credentials/{name}/test`

DELETE
- `DELETE /api/v1/{tenant}/credentials/{id}`
- `DELETE /api/v1/{tenant}/namespaces/{namespace}/credentials/{name}`
:::

---

:::collapse{title="BLUEPRINT"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: view or browse custom blueprints.
- `CREATE`: create a blueprint.
- `UPDATE`: update a blueprint.
- `DELETE`: delete a blueprint.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/blueprints/custom`
- `GET /api/v1/{tenant}/blueprints/custom/{id}`
- `GET /api/v1/{tenant}/blueprints/custom/{id}/source`
- `GET /api/v1/{tenant}/blueprints/custom/tags`
- `GET /api/v1/{tenant}/blueprints/flows/{id}`
- `POST /api/v1/{tenant}/blueprints/flows/{id}/use-template`

CREATE
- `POST /api/v1/{tenant}/blueprints/flows`

UPDATE
- `PUT /api/v1/{tenant}/blueprints/flows/{id}`

DELETE
- `DELETE /api/v1/{tenant}/blueprints/flows/{id}`

Notes
- Community blueprint endpoints (`/blueprints/community/...`) do not require `BLUEPRINT` permission.
:::

---

:::collapse{title="APP"}
**Scope:** Tenant (with namespace checks when the app definition references a namespace)

**Actions and their meaning**
- `VIEW` / `LIST`: view app source, search, and catalog.
- `CREATE`: create or import apps.
- `UPDATE`: update apps, enable, or disable them.
- `DELETE`: delete apps.
- `EXECUTE`: dispatch actions through an app (run the app).
- `ACCESS_FILES`: download or preview files generated by an app execution.
- `ACCESS_LOGS`: view app execution logs.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/apps/search`
- `GET /api/v1/{tenant}/apps/catalog`
- `GET /api/v1/{tenant}/apps/tags`
- `GET /api/v1/{tenant}/apps/{uid}`
- `GET /api/v1/{tenant}/apps/view/{uid}` (PRIVATE apps require `APP: EXECUTE` or equivalent access level)

CREATE
- `POST /api/v1/{tenant}/apps`
- `POST /api/v1/{tenant}/apps/import`
- `POST /api/v1/{tenant}/apps/preview`
- `POST /api/v1/{tenant}/apps/export`

UPDATE
- `PUT /api/v1/{tenant}/apps/{uid}`
- `POST /api/v1/{tenant}/apps/{uid}/enable`
- `POST /api/v1/{tenant}/apps/{uid}/disable`
- `POST /api/v1/{tenant}/apps/enable`
- `POST /api/v1/{tenant}/apps/disable`

DELETE
- `DELETE /api/v1/{tenant}/apps/{uid}`
- `DELETE /api/v1/{tenant}/apps`

EXECUTE
- `POST /api/v1/{tenant}/apps/view/{id}/dispatch/{dispatch}`
- `GET /api/v1/{tenant}/apps/view/{id}/streams/{stream}`

ACCESS_FILES
- `GET /api/v1/{tenant}/apps/view/{id}/file/preview`
- `GET /api/v1/{tenant}/apps/view/{id}/file/meta`
- `GET /api/v1/{tenant}/apps/view/{id}/file/download`

ACCESS_LOGS
- `GET /api/v1/{tenant}/apps/view/{uid}/logs/download`

Notes
- PUBLIC apps are accessible without authentication for view and dispatch. PRIVATE apps require appropriate `APP` actions.
:::

---

:::collapse{title="TESTSUITE"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: view tests and test results.
- `CREATE`: create a test.
- `UPDATE`: update or enable/disable tests.
- `DELETE`: delete tests.
- `EXECUTE`: run tests.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/tests/{namespace}/{id}`
- `GET /api/v1/{tenant}/tests/search`
- `POST /api/v1/{tenant}/tests/validate`
- `GET /api/v1/{tenant}/tests/results/{id}`
- `POST /api/v1/{tenant}/tests/results/search/last`
- `GET /api/v1/{tenant}/tests/results/search`

CREATE
- `POST /api/v1/{tenant}/tests`

UPDATE
- `PUT /api/v1/{tenant}/tests/{namespace}/{id}`
- `POST /api/v1/{tenant}/tests/disable/by-ids`
- `POST /api/v1/{tenant}/tests/enable/by-ids`

DELETE
- `DELETE /api/v1/{tenant}/tests/{namespace}/{id}`
- `DELETE /api/v1/{tenant}/tests/by-ids`

EXECUTE
- `POST /api/v1/{tenant}/tests/{namespace}/{id}/run`
- `POST /api/v1/{tenant}/tests/run`
:::

---

:::collapse{title="ASSET"}
**Scope:** Tenant (with namespace checks when the asset has a namespace)

**Actions and their meaning**
- `VIEW` / `LIST`: view assets and their dependency or usage graphs.
- `CREATE`: create assets.
- `DELETE`: delete assets.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/assets/{id}`
- `GET /api/v1/{tenant}/assets/{id}/dependencies`
- `GET /api/v1/{tenant}/assets/search`
- `GET /api/v1/{tenant}/assets/usages/search`

CREATE
- `POST /api/v1/{tenant}/assets`

DELETE
- `DELETE /api/v1/{tenant}/assets/{id}`
- `DELETE /api/v1/{tenant}/assets/by-ids`
- `DELETE /api/v1/{tenant}/assets/by-query`
:::

---

:::collapse{title="MCP_SERVER"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: view MCP server configuration and registered tools.
- `CREATE`: create an MCP server.
- `UPDATE`: update an MCP server.
- `DELETE`: delete an MCP server.

Notes
- Connecting an AI agent to a PRIVATE server also requires `FLOW: EXECUTE` on at least one namespace with a flow that has an `McpToolTrigger` pointing at that server.
:::

---

:::collapse{title="COPILOT"}
**Scope:** Tenant

**Actions and their meaning**
- `USE`: access AI flow generation and Copilot features.

**Endpoints**

USE (any `COPILOT` action)
- `POST /api/v1/{tenant}/ai/generate/flow`
:::

---

:::collapse{title="AUDITLOG"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: search audit logs and view diffs.
- `EXPORT`: export audit logs.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/auditlogs/search`
- `POST /api/v1/{tenant}/auditlogs/find`
- `GET /api/v1/{tenant}/auditlogs/history/{detailId}`
- `GET /api/v1/{tenant}/auditlogs/{id}/diff`

EXPORT
- `GET /api/v1/{tenant}/auditlogs/export`

Notes
- Cross-tenant audit log endpoints under `/api/v1/auditlogs/...` (no tenant segment) are superadmin-only and are not controlled by `AUDITLOG` permissions.
:::

---

:::collapse{title="SYSTEM_SETTINGS"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW`: read instance-level settings.
- `UPDATE`: modify instance-level settings.
:::

---

:::collapse{title="TENANT_SETTINGS"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW`: read tenant-level settings.
- `UPDATE`: modify tenant-level settings.
:::

---

:::collapse{title="USER"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: view user details and group membership.
- `CREATE` / `UPDATE` / `DELETE`: manage users.
- `MANAGE_GROUP_MEMBERSHIP`: update a user's group assignments.
- `IMPERSONATE`: impersonate a user to test their access.

Notes
- `USER` is not included in any of the standard managed roles (Viewer, Launcher, Editor, Developer). Only Admin includes it. Custom roles with `USER` actions are intended for platform administrators.
- IAM user management endpoints under `/api/v1/users` (no tenant segment) are superadmin-only and do not require `USER` permissions.
:::

---

:::collapse{title="GROUP"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: view groups and their members.
- `CREATE`: create groups.
- `UPDATE`: update group metadata.
- `DELETE`: delete groups.
- `MANAGE_MEMBERS`: add or remove members from a group.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/groups/{id}`
- `GET /api/v1/{tenant}/groups/search`
- `POST /api/v1/{tenant}/groups/autocomplete`
- `POST /api/v1/{tenant}/groups/ids`
- `GET /api/v1/{tenant}/groups/{id}/members`

CREATE
- `POST /api/v1/{tenant}/groups`

UPDATE
- `PUT /api/v1/{tenant}/groups/{id}`

DELETE
- `DELETE /api/v1/{tenant}/groups/{id}`

MANAGE_MEMBERS
- `PUT /api/v1/{tenant}/groups/{id}/members/{userId}`
- `PUT /api/v1/{tenant}/groups/{id}/members/membership/{userId}`
- `DELETE /api/v1/{tenant}/groups/{id}/members/{userId}`
- `PUT /api/v1/{tenant}/users/{id}/groups`

Notes
- SCIM group endpoints (`/integrations/{integration}/scim/v2/Groups`) also use `GROUP` permissions.
:::

---

:::collapse{title="ROLE"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: view roles and their permissions.
- `CREATE`: create roles.
- `UPDATE`: update roles.
- `DELETE`: delete roles.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/roles/{id}`
- `GET /api/v1/{tenant}/roles/search`
- `POST /api/v1/{tenant}/roles/autocomplete`
- `POST /api/v1/{tenant}/roles/ids`
- `GET /api/v1/{tenant}/acls/permissions` (any `ROLE` action)
- `GET /api/v1/{tenant}/acls/actions` (any `ROLE` action)

CREATE
- `POST /api/v1/{tenant}/roles`

UPDATE
- `PUT /api/v1/{tenant}/roles/{id}`

DELETE
- `DELETE /api/v1/{tenant}/roles/{id}`
:::

---

:::collapse{title="BINDING"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: view bindings.
- `CREATE`: create a binding.
- `DELETE`: delete a binding.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/bindings/{id}`
- `GET /api/v1/{tenant}/bindings/search`

CREATE
- `POST /api/v1/{tenant}/bindings`
- `POST /api/v1/{tenant}/bindings/bulk`

DELETE
- `DELETE /api/v1/{tenant}/bindings/{id}`

Notes
- Bindings are immutable. To change a binding's scope or roles, delete it and create a new one.
:::

---

:::collapse{title="SERVICE_ACCOUNT"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: view service accounts and their API tokens.
- `CREATE`: create service accounts.
- `UPDATE`: update service accounts and issue API tokens.
- `DELETE`: delete service accounts or revoke API tokens.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/service-accounts/{id}`
- `GET /api/v1/{tenant}/service-accounts/{id}/api-tokens`

CREATE
- `POST /api/v1/{tenant}/service-accounts`

UPDATE
- `PUT /api/v1/{tenant}/service-accounts/{id}`
- `POST /api/v1/{tenant}/service-accounts/{id}/api-tokens`

DELETE
- `DELETE /api/v1/{tenant}/service-accounts/{id}`
- `DELETE /api/v1/{tenant}/service-accounts/{id}/api-tokens/{tokenId}`

Notes
- Superadmin-only endpoints under `/api/v1/service-accounts` (no tenant segment) do not use `SERVICE_ACCOUNT` permissions.
:::

---

:::collapse{title="INVITATION"}
**Scope:** Tenant

**Actions and their meaning**
- `VIEW` / `LIST`: view invitations.
- `CREATE`: send an invitation.
- `DELETE`: revoke an invitation.

**Endpoints**

VIEW / LIST
- `GET /api/v1/{tenant}/invitations/search`
- `GET /api/v1/{tenant}/invitations/email/{email}`
- `GET /api/v1/{tenant}/invitations/{id}`

CREATE
- `POST /api/v1/{tenant}/invitations`

DELETE
- `DELETE /api/v1/{tenant}/invitations/{id}`
:::

## Related

- [RBAC overview](../index.md) — resources, actions, and managed roles explained
- [RBAC action model migration guide](../../../../11.migration-guide/v2.0.0/rbac-action-model/index.md) — how old CRUD permissions map to the new actions when upgrading from 1.x
- [kestractl roles](../../../../kestra-cli/kestractl/index.md#roles) — create and manage roles from the CLI
