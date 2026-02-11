---
title: Permissions Reference for Kestra Enterprise API
description: Map RBAC permissions and CRUD actions to API endpoints.
sidebarTitle: Permissions Reference
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
docId: iam
---

This reference maps each RBAC Permission and Action to the Enterprise API endpoints that enforce it. Use it to design least-privilege roles and troubleshoot authorization errors.

## How to read this page
- Endpoints are grouped by Permission and CRUD Action.
- Notes labeled "any action" mean the endpoint only checks that the Permission exists on the role; the specific CRUD action is not enforced.
- Some endpoints require multiple permissions; notes call out additional checks.
- Namespace bindings apply to the namespace and all child namespaces.


## Permissions reference

:::collapse{title="FLOW"}
**Scope:** Namespace

**CRUD meaning**
- Create: create flows or namespace files; import flows.
- Read: view flows, revisions, tasks, graphs, dependencies; export flows; read namespace files and triggers.
- Update: modify flow source, tasks, enable or disable flows; move namespace files.
- Delete: delete flows or namespace files.

**Endpoints**
Create
- POST `/api/v1/{tenant}/flows` (YAML)
- POST `/api/v1/{tenant}/flows` (JSON, deprecated)
- POST `/api/v1/{tenant}/flows/{namespace}` (bulk upsert; also requires UPDATE and DELETE)
- POST `/api/v1/{tenant}/flows/import` (imports require CREATE + UPDATE per flow)
- POST `/api/v1/{tenant}/namespaces/{namespace}/files/directory`
- POST `/api/v1/{tenant}/namespaces/{namespace}/files`

Read
- GET `/api/v1/{tenant}/flows/{namespace}/{id}`
- GET `/api/v1/{tenant}/flows/{namespace}/{id}/graph`
- POST `/api/v1/{tenant}/flows/graph` (any action; no action check)
- GET `/api/v1/{tenant}/flows/{namespace}/{id}/revisions`
- GET `/api/v1/{tenant}/flows/{namespace}/{id}/tasks/{taskId}`
- GET `/api/v1/{tenant}/flows/search`
- GET `/api/v1/{tenant}/flows/{namespace}`
- GET `/api/v1/{tenant}/flows/source`
- GET `/api/v1/{tenant}/flows/{namespace}/{id}/dependencies`
- GET `/api/v1/{tenant}/namespaces/{namespace}/dependencies`
- GET `/api/v1/{tenant}/flows/distinct-namespaces` (any action; no action check)
- POST `/api/v1/{tenant}/flows/validate` (any action; no action check)
- POST `/api/v1/{tenant}/flows/validate/task` (JSON, any action; no action check)
- POST `/api/v1/{tenant}/flows/validate/task` (YAML, any action; no action check)
- POST `/api/v1/{tenant}/flows/validate/trigger` (any action; no action check)
- GET `/api/v1/{tenant}/flows/export/by-query`
- POST `/api/v1/{tenant}/flows/export/by-ids`
- GET `/api/v1/{tenant}/flows/export/by-query/csv`
- GET `/api/v1/{tenant}/namespaces/{namespace}/files/search`
- GET `/api/v1/{tenant}/namespaces/{namespace}/files`
- GET `/api/v1/{tenant}/namespaces/{namespace}/files/stats`
- GET `/api/v1/{tenant}/namespaces/{namespace}/files/revisions`
- GET `/api/v1/{tenant}/namespaces/{namespace}/files/directory`
- GET `/api/v1/{tenant}/namespaces/{namespace}/files/export`
- GET `/api/v1/{tenant}/triggers/search`
- GET `/api/v1/{tenant}/triggers/{namespace}/{flowId}`
- GET `/api/v1/{tenant}/triggers/export/by-query/csv`

Update
- PUT `/api/v1/{tenant}/flows/{namespace}/{id}` (YAML)
- PUT `/api/v1/{tenant}/flows/{namespace}/{id}` (JSON, deprecated)
- PATCH `/api/v1/{tenant}/flows/{namespace}/{id}/{taskId}`
- POST `/api/v1/{tenant}/executions/{executionId}/eval/{taskRunId}`
- POST `/api/v1/{tenant}/flows/bulk`
- POST `/api/v1/{tenant}/flows/disable/by-query`
- POST `/api/v1/{tenant}/flows/disable/by-ids`
- POST `/api/v1/{tenant}/flows/enable/by-query`
- POST `/api/v1/{tenant}/flows/enable/by-ids`
- PUT `/api/v1/{tenant}/namespaces/{namespace}/files`

Delete
- DELETE `/api/v1/{tenant}/flows/{namespace}/{id}`
- DELETE `/api/v1/{tenant}/flows/delete/by-query`
- DELETE `/api/v1/{tenant}/flows/delete/by-ids`
- DELETE `/api/v1/{tenant}/namespaces/{namespace}/files`

Notes
- Trigger update operations require EXECUTION permissions, but trigger routes also require FLOW permission at the route level.
- Creating a flow in a new namespace also requires NAMESPACE CREATE.
:::

:::collapse{title="EXECUTION"}
**Scope:** Namespace

**CRUD meaning**
- Create: trigger or create executions; replay executions (creates new executions).
- Read: view executions, graphs, logs, metrics, files, and exports.
- Update: change state, pause or resume, restart, replay by ids, set labels, unqueue, force-run, update task run state.
- Delete: delete executions and logs.

**Endpoints**
Create
- POST `/api/v1/{tenant}/executions/trigger/{namespace}/{id}` (deprecated)
- POST `/api/v1/{tenant}/executions/{namespace}/{id}`
- POST `/api/v1/{tenant}/executions/{namespace}/{id}/validate` (any action; no action check)
- POST `/api/v1/{tenant}/executions/{executionId}/replay`
- POST `/api/v1/{tenant}/executions/{executionId}/replay-with-inputs`
- POST `/api/v1/{tenant}/executions/replay/by-query` (any action; no action check)
- GET `/api/v1/{tenant}/executions/namespaces` (requires CREATE)
- GET `/api/v1/{tenant}/executions/namespaces/{namespace}/flows` (requires CREATE)

Read
- GET `/api/v1/{tenant}/executions/search`
- GET `/api/v1/{tenant}/executions`
- GET `/api/v1/{tenant}/executions/{executionId}`
- GET `/api/v1/{tenant}/executions/{executionId}/graph`
- GET `/api/v1/{tenant}/executions/{executionId}/flow`
- GET `/api/v1/{tenant}/executions/flows/{namespace}/{flowId}`
- GET `/api/v1/{tenant}/executions/{executionId}/file`
- GET `/api/v1/{tenant}/executions/{executionId}/file/metas`
- GET `/api/v1/{tenant}/executions/{executionId}/file/preview`
- GET `/api/v1/{tenant}/executions/{executionId}/follow`
- GET `/api/v1/{tenant}/executions/{executionId}/follow-dependencies`
- POST `/api/v1/{tenant}/executions/latest` (any action; no action check)
- GET `/api/v1/{tenant}/executions/export/by-query/csv`
- GET `/api/v1/{tenant}/logs/search`
- GET `/api/v1/{tenant}/logs/{executionId}`
- GET `/api/v1/{tenant}/logs/{executionId}/download`
- GET `/api/v1/{tenant}/logs/{executionId}/follow`
- GET `/api/v1/{tenant}/metrics/{executionId}`
- GET `/api/v1/{tenant}/metrics/names/{namespace}/{flowId}`
- GET `/api/v1/{tenant}/metrics/names/{namespace}/{flowId}/{taskId}`
- GET `/api/v1/{tenant}/metrics/tasks/{namespace}/{flowId}`
- GET `/api/v1/{tenant}/metrics/aggregates/{namespace}/{flowId}/{metric}`
- GET `/api/v1/{tenant}/metrics/aggregates/{namespace}/{flowId}/{taskId}/{metric}`

Update
- POST `/api/v1/{tenant}/executions/{executionId}/restart`
- POST `/api/v1/{tenant}/executions/restart/by-ids`
- POST `/api/v1/{tenant}/executions/restart/by-query` (any action; no action check)
- POST `/api/v1/{tenant}/executions/{executionId}/state`
- POST `/api/v1/{tenant}/executions/{executionId}/change-status`
- POST `/api/v1/{tenant}/executions/change-status/by-ids`
- POST `/api/v1/{tenant}/executions/change-status/by-query` (any action; no action check)
- DELETE `/api/v1/{tenant}/executions/{executionId}/kill{?isOnKillCascade}`
- DELETE `/api/v1/{tenant}/executions/kill/by-ids`
- DELETE `/api/v1/{tenant}/executions/kill/by-query` (any action; no action check)
- POST `/api/v1/{tenant}/executions/{executionId}/resume/validate` (any action; no action check)
- POST `/api/v1/{tenant}/executions/{executionId}/resume`
- POST `/api/v1/{tenant}/executions/{executionId}/resume-from-breakpoint`
- POST `/api/v1/{tenant}/executions/resume/by-ids`
- POST `/api/v1/{tenant}/executions/resume/by-query` (any action; no action check)
- POST `/api/v1/{tenant}/executions/{executionId}/pause`
- POST `/api/v1/{tenant}/executions/pause/by-ids`
- POST `/api/v1/{tenant}/executions/pause/by-query` (any action; no action check)
- POST `/api/v1/{tenant}/executions/{executionId}/labels`
- POST `/api/v1/{tenant}/executions/labels/by-ids`
- POST `/api/v1/{tenant}/executions/labels/by-query` (any action; no action check)
- POST `/api/v1/{tenant}/executions/{executionId}/unqueue`
- POST `/api/v1/{tenant}/executions/unqueue/by-ids`
- POST `/api/v1/{tenant}/executions/unqueue/by-query` (any action; no action check)
- POST `/api/v1/{tenant}/executions/{executionId}/force-run`
- POST `/api/v1/{tenant}/executions/force-run/by-ids`
- POST `/api/v1/{tenant}/executions/force-run/by-query` (any action; no action check)
- POST `/api/v1/{tenant}/executions/replay/by-ids` (uses UPDATE in current implementation)

Delete
- DELETE `/api/v1/{tenant}/executions/{executionId}`
- DELETE `/api/v1/{tenant}/executions/by-ids`
- DELETE `/api/v1/{tenant}/executions/by-query` (any action; no action check)
- DELETE `/api/v1/{tenant}/logs/{executionId}`
- DELETE `/api/v1/{tenant}/logs/{namespace}/{flowId}` (any action; no action check)

Notes
- Webhook execution endpoints (`/executions/webhook/{namespace}/{id}/{key}`) are anonymous and are authorized by webhook key, not RBAC.
- `GET /api/v1/{tenant}/logs/search` only checks that the EXECUTION permission exists (any action).
:::

:::collapse{title="TEMPLATE"}
**Scope:** Namespace

**CRUD meaning**
- Create: create templates or bulk update a namespace of templates.
- Read: view templates, search, export, validate.
- Update: update templates or bulk update a namespace of templates.
- Delete: delete templates, bulk delete by query or ids.

**Endpoints**
Create
- POST `/api/v1/{tenant}/templates`
- POST `/api/v1/{tenant}/templates/{namespace}` (bulk update; also requires UPDATE and DELETE)
- POST `/api/v1/{tenant}/templates/import` (requires FLOW CREATE + UPDATE)

Read
- GET `/api/v1/{tenant}/templates/{namespace}/{id}`
- GET `/api/v1/{tenant}/templates/search`
- GET `/api/v1/{tenant}/templates/distinct-namespaces` (any action; no action check)
- POST `/api/v1/{tenant}/templates/validate` (any action; no action check)
- GET `/api/v1/{tenant}/templates/export/by-query`
- POST `/api/v1/{tenant}/templates/export/by-ids`

Update
- PUT `/api/v1/{tenant}/templates/{namespace}/{id}`
- POST `/api/v1/{tenant}/templates/{namespace}` (bulk update; also requires CREATE and DELETE)

Delete
- DELETE `/api/v1/{tenant}/templates/{namespace}/{id}`
- DELETE `/api/v1/{tenant}/templates/delete/by-query`
- DELETE `/api/v1/{tenant}/templates/delete/by-ids`

Notes
- `POST /api/v1/{tenant}/templates/import` uses FLOW CREATE and UPDATE permissions in the current implementation.
:::

:::collapse{title="NAMESPACE"}
**Scope:** Namespace

**CRUD meaning**
- Create: create namespaces.
- Read: view namespaces, inherited variables, inherited plugin defaults, and export plugin defaults.
- Update: update namespace metadata and import plugin defaults.
- Delete: delete namespaces.

**Endpoints**
Create
- POST `/api/v1/{tenant}/namespaces`

Read
- POST `/api/v1/{tenant}/namespaces/autocomplete`
- GET `/api/v1/{tenant}/namespaces/{id}`
- GET `/api/v1/{tenant}/namespaces/search`
- GET `/api/v1/{tenant}/namespaces/{id}/inherited-variables`
- GET `/api/v1/{tenant}/namespaces/{id}/inherited-plugindefaults`
- POST `/api/v1/{tenant}/namespaces/{id}/plugindefaults/export`

Update
- PUT `/api/v1/{tenant}/namespaces/{id}`
- POST `/api/v1/{tenant}/namespaces/{id}/plugindefaults/import`

Delete
- DELETE `/api/v1/{tenant}/namespaces/{id}`
:::

:::collapse{title="KVSTORE"}
**Scope:** Namespace

**CRUD meaning**
- Create: create new KV entries.
- Read: list or retrieve KV entries, including inherited entries.
- Update: update existing KV entries.
- Delete: delete KV entries.

**Endpoints**
Create
- PUT `/api/v1/{tenant}/namespaces/{namespace}/kv/{key}` (creates if key does not exist)

Read
- GET `/api/v1/{tenant}/kv` (any action; no action check)
- GET `/api/v1/{tenant}/namespaces/{namespace}/kv` (deprecated)
- GET `/api/v1/{tenant}/namespaces/{namespace}/kv/inheritance`
- GET `/api/v1/{tenant}/namespaces/{namespace}/kv/{key}`
- GET `/api/v1/{tenant}/namespaces/{namespace}/kv/{key}/detail`

Update
- PUT `/api/v1/{tenant}/namespaces/{namespace}/kv/{key}` (updates if key exists)

Delete
- DELETE `/api/v1/{tenant}/namespaces/{namespace}/kv/{key}`
- DELETE `/api/v1/{tenant}/namespaces/{namespace}/kv`

Notes
- The PUT endpoint chooses CREATE vs UPDATE based on whether the key already exists.
:::

:::collapse{title="DASHBOARD"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create: create dashboards.
- Read: view dashboards and charts.
- Update: update dashboards and charts.
- Delete: delete dashboards.

**Endpoints**
Create
- POST `/api/v1/{tenant}/dashboards`

Read
- GET `/api/v1/{tenant}/dashboards`
- GET `/api/v1/{tenant}/dashboards/{id}`
- POST `/api/v1/{tenant}/dashboards/{id}/charts/{chartId}`
- POST `/api/v1/{tenant}/dashboards/charts/preview`
- POST `/api/v1/{tenant}/dashboards/validate`
- POST `/api/v1/{tenant}/dashboards/validate/chart`
- POST `/api/v1/{tenant}/dashboards/{id}/charts/{chartId}/export/to-csv`
- POST `/api/v1/{tenant}/dashboards/charts/export/to-csv`

Update
- PUT `/api/v1/{tenant}/dashboards/{id}`

Delete
- DELETE `/api/v1/{tenant}/dashboards/{id}`

Notes
- Read endpoints rely on repository-level permission checks (any DASHBOARD action); action-specific READ checks are not enforced at the controller level.
:::

:::collapse{title="SECRET"}
**Scope:** Namespace

**CRUD meaning**
- Create: create secrets (implemented via UPDATE in current API).
- Read: list and view secret metadata.
- Update: update secret values or metadata.
- Delete: delete secrets.

**Endpoints**
Read
- GET `/api/v1/{tenant}/secrets` (any action; no action check)
- GET `/api/v1/{tenant}/namespaces/{namespace}/secrets`
- GET `/api/v1/{tenant}/namespaces/{namespace}/inherited-secrets`

Update
- PUT `/api/v1/{tenant}/namespaces/{namespace}/secrets`
- PATCH `/api/v1/{tenant}/namespaces/{namespace}/secrets/{key}`

Delete
- DELETE `/api/v1/{tenant}/namespaces/{namespace}/secrets/{key}`

Notes
- No endpoint currently checks SECRET CREATE; secret creation is enforced via UPDATE on `PUT /namespaces/{namespace}/secrets`.
:::

:::collapse{title="CREDENTIAL"}
**Scope:** Namespace or global (tenant-level credentials)

**CRUD meaning**
- Create: create tenant or namespace credentials.
- Read: list and view credentials.
- Update: update credentials or test connections.
- Delete: delete credentials.

**Endpoints**
Create
- POST `/api/v1/{tenant}/credentials`
- POST `/api/v1/{tenant}/namespaces/{namespace}/credentials`

Read
- GET `/api/v1/{tenant}/credentials`
- GET `/api/v1/{tenant}/credentials/{id}`
- GET `/api/v1/{tenant}/namespaces/{namespace}/credentials`
- GET `/api/v1/{tenant}/namespaces/{namespace}/credentials/{name}`
- GET `/api/v1/{tenant}/namespaces/{namespace}/credentials/inherited`

Update
- PUT `/api/v1/{tenant}/credentials/{id}`
- POST `/api/v1/{tenant}/credentials/{id}/test`
- PUT `/api/v1/{tenant}/namespaces/{namespace}/credentials/{name}`
- POST `/api/v1/{tenant}/namespaces/{namespace}/credentials/{name}/test`

Delete
- DELETE `/api/v1/{tenant}/credentials/{id}`
- DELETE `/api/v1/{tenant}/namespaces/{namespace}/credentials/{name}`
:::

:::collapse{title="BLUEPRINT"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create: create custom blueprints.
- Read: list or view custom blueprints and templates.
- Update: update custom blueprints.
- Delete: delete custom blueprints.

**Endpoints**
Create
- POST `/api/v1/{tenant}/blueprints/flows`
- POST `/api/v1/{tenant}/blueprints/custom` (deprecated)

Read
- GET `/api/v1/{tenant}/blueprints/custom`
- GET `/api/v1/{tenant}/blueprints/custom/{id}`
- GET `/api/v1/{tenant}/blueprints/custom/{id}/source`
- GET `/api/v1/{tenant}/blueprints/custom/tags`
- GET `/api/v1/{tenant}/blueprints/flow/{id}`
- GET `/api/v1/{tenant}/blueprints/flows/{id}`
- POST `/api/v1/{tenant}/blueprints/flows/{id}/use-template`

Update
- PUT `/api/v1/{tenant}/blueprints/flows/{id}`
- PUT `/api/v1/{tenant}/blueprints/custom/{id}` (deprecated)

Delete
- DELETE `/api/v1/{tenant}/blueprints/flows/{id}`
- DELETE `/api/v1/{tenant}/blueprints/custom/{id}` (deprecated)

Notes
- Community blueprint endpoints under `/api/v1/{tenant}/blueprints/community/...` do not use BLUEPRINT permission.
:::

:::collapse{title="APP"}
**Scope:** Global (tenant) with namespace checks on app definitions

**CRUD meaning**
- Create: create apps and import apps.
- Read: view app source, search, export apps.
- Update: update apps and enable or disable apps.
- Delete: delete apps.

**Endpoints**
Create
- POST `/api/v1/{tenant}/apps`
- POST `/api/v1/{tenant}/apps/import`
- POST `/api/v1/{tenant}/apps/preview` (requires global APP CREATE)

Read
- GET `/api/v1/{tenant}/apps/search`
- GET `/api/v1/{tenant}/apps/catalog` (private apps also require APPEXECUTION READ)
- GET `/api/v1/{tenant}/apps/tags`
- GET `/api/v1/{tenant}/apps/{uid}`
- POST `/api/v1/{tenant}/apps/export`

Update
- PUT `/api/v1/{tenant}/apps/{uid}`
- POST `/api/v1/{tenant}/apps/{uid}/enable`
- POST `/api/v1/{tenant}/apps/{uid}/disable`
- POST `/api/v1/{tenant}/apps/enable`
- POST `/api/v1/{tenant}/apps/disable`

Delete
- DELETE `/api/v1/{tenant}/apps/{uid}`
- DELETE `/api/v1/{tenant}/apps`
:::

:::collapse{title="APPEXECUTION"}
**Scope:** Namespace (checked when app access is PRIVATE)

**CRUD meaning**
- Create: not used for apps (execution happens via app dispatch).
- Read: view apps and read execution artifacts through apps.
- Update: dispatch app actions and stream updates.
- Delete: not used.

**Endpoints**
Read
- GET `/api/v1/{tenant}/apps/view/{uid}` (PRIVATE apps require APPEXECUTION READ)
- GET `/api/v1/{tenant}/apps/view/{id}/file/preview`
- GET `/api/v1/{tenant}/apps/view/{id}/file/meta`
- GET `/api/v1/{tenant}/apps/view/{id}/file/download`
- GET `/api/v1/{tenant}/apps/view/{uid}/logs/download`

Update
- POST `/api/v1/{tenant}/apps/view/{id}/dispatch/{dispatch}`
- GET `/api/v1/{tenant}/apps/view/{id}/streams/{stream}`

Notes
- App view endpoints are anonymous for PUBLIC apps; PRIVATE apps require APPEXECUTION permissions and, if configured, group membership.
:::

:::collapse{title="ASSET"}
**Scope:** Global (tenant) with namespace checks when an asset has a namespace

**CRUD meaning**
- Create: create assets.
- Read: view assets, search assets, and dependency or usage graphs.
- Update: not used (create or replace is done via POST).
- Delete: delete assets.

**Endpoints**
Create
- POST `/api/v1/{tenant}/assets`

Read
- GET `/api/v1/{tenant}/assets/{id}`
- GET `/api/v1/{tenant}/assets/{id}/dependencies`
- GET `/api/v1/{tenant}/assets/search`
- GET `/api/v1/{tenant}/assets/usages/search`

Delete
- DELETE `/api/v1/{tenant}/assets/{id}`
- DELETE `/api/v1/{tenant}/assets/by-ids`
- DELETE `/api/v1/{tenant}/assets/by-query`
:::

:::collapse{title="TEST"}
**Scope:** Namespace

**CRUD meaning**
- Create: create tests or run tests.
- Read: view tests and test results.
- Update: update tests or enable or disable tests.
- Delete: delete tests.

**Endpoints**
Create
- POST `/api/v1/{tenant}/tests`
- POST `/api/v1/{tenant}/tests/{namespace}/{id}/run`
- POST `/api/v1/{tenant}/tests/run`

Read
- GET `/api/v1/{tenant}/tests/{namespace}/{id}`
- GET `/api/v1/{tenant}/tests/search`
- POST `/api/v1/{tenant}/tests/validate`
- GET `/api/v1/{tenant}/tests/results/{id}`
- POST `/api/v1/{tenant}/tests/results/search/last`
- GET `/api/v1/{tenant}/tests/results/search`

Update
- PUT `/api/v1/{tenant}/tests/{namespace}/{id}`
- POST `/api/v1/{tenant}/tests/disable/by-ids`
- POST `/api/v1/{tenant}/tests/enable/by-ids`

Delete
- DELETE `/api/v1/{tenant}/tests/{namespace}/{id}`
- DELETE `/api/v1/{tenant}/tests/by-ids`
:::

:::collapse{title="AUDITLOG"}
**Scope:** Global (tenant)

**CRUD meaning**
- Read: search and export audit logs; read resource history and diffs.

**Endpoints**
Read
- GET `/api/v1/{tenant}/auditlogs/search`
- POST `/api/v1/{tenant}/auditlogs/find`
- GET `/api/v1/{tenant}/auditlogs/history/{detailId}` (requires READ on the underlying resource)
- GET `/api/v1/{tenant}/auditlogs/{id}/diff` (requires READ on the underlying resource or AUDITLOG READ; superadmin-only for certain resources)
- GET `/api/v1/{tenant}/auditlogs/export`

Notes
- Cross-tenant audit log endpoints under `/api/v1/auditlogs/...` are superadmin-only and are not controlled by AUDITLOG permissions.
:::

:::collapse{title="USER"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create, Read, Update, Delete: manage users via SCIM provisioning endpoints.

**Endpoints**
Create
- POST `/api/v1/{tenant}/integrations/{integration}/scim/v2/Users`

Read
- GET `/api/v1/{tenant}/integrations/{integration}/scim/v2/Users`
- GET `/api/v1/{tenant}/integrations/{integration}/scim/v2/Users/{id}`

Update
- PUT `/api/v1/{tenant}/integrations/{integration}/scim/v2/Users/{id}`
- PATCH `/api/v1/{tenant}/integrations/{integration}/scim/v2/Users/{id}`

Delete
- DELETE `/api/v1/{tenant}/integrations/{integration}/scim/v2/Users/{id}`

Notes
- IAM user management endpoints under `/api/v1/users` are superadmin-only and do not use USER permissions.
:::

:::collapse{title="SERVICE_ACCOUNT"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create: create service accounts.
- Read: list or view service accounts and API tokens.
- Update: update service accounts and create API tokens.
- Delete: delete service accounts or API tokens.

**Endpoints**
Create
- POST `/api/v1/{tenant}/service-accounts`

Read
- GET `/api/v1/{tenant}/service-accounts/{id}`
- GET `/api/v1/{tenant}/service-accounts/{id}/api-tokens`

Update
- PUT `/api/v1/{tenant}/service-accounts/{id}`
- POST `/api/v1/{tenant}/service-accounts/{id}/api-tokens`

Delete
- DELETE `/api/v1/{tenant}/service-accounts/{id}`
- DELETE `/api/v1/{tenant}/service-accounts/{id}/api-tokens/{tokenId}`

Notes
- Superadmin-only service account endpoints under `/api/v1/service-accounts` do not use SERVICE_ACCOUNT permissions.
:::

:::collapse{title="GROUP"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create, Read, Update, Delete: manage groups.

**Endpoints**
Create
- POST `/api/v1/{tenant}/groups`

Read
- GET `/api/v1/{tenant}/groups/{id}`
- GET `/api/v1/{tenant}/groups/search`
- POST `/api/v1/{tenant}/groups/autocomplete`
- POST `/api/v1/{tenant}/groups/ids`

Update
- PUT `/api/v1/{tenant}/groups/{id}`

Delete
- DELETE `/api/v1/{tenant}/groups/{id}`

Notes
- SCIM group endpoints under `/api/v1/{tenant}/integrations/{integration}/scim/v2/Groups` use GROUP permissions for CRUD.
:::

:::collapse{title="GROUP_MEMBERSHIP"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create: add users to groups.
- Read: list group members.
- Update: update membership roles or replace a user's group list.
- Delete: remove users from groups.

**Endpoints**
Create
- PUT `/api/v1/{tenant}/groups/{id}/members/{userId}`

Read
- GET `/api/v1/{tenant}/groups/{id}/members`

Update
- PUT `/api/v1/{tenant}/groups/{id}/members/membership/{userId}`
- PUT `/api/v1/{tenant}/users/{id}/groups`

Delete
- DELETE `/api/v1/{tenant}/groups/{id}/members/{userId}`

Notes
- Group owners can manage membership without GROUP_MEMBERSHIP permission; non-owners require it.
:::

:::collapse{title="ROLE"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create, Read, Update, Delete: manage roles.

**Endpoints**
Create
- POST `/api/v1/{tenant}/roles`

Read
- GET `/api/v1/{tenant}/roles/{id}`
- GET `/api/v1/{tenant}/roles/search`
- POST `/api/v1/{tenant}/roles/autocomplete`
- POST `/api/v1/{tenant}/roles/ids`
- GET `/api/v1/{tenant}/acls/permissions` (any action; no action check)
- GET `/api/v1/{tenant}/acls/actions` (any action; no action check)

Update
- PUT `/api/v1/{tenant}/roles/{id}`

Delete
- DELETE `/api/v1/{tenant}/roles/{id}`
:::

:::collapse{title="BINDING"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create, Read, Delete: manage bindings between users, groups, and roles.

**Endpoints**
Create
- POST `/api/v1/{tenant}/bindings`
- POST `/api/v1/{tenant}/bindings/bulk`

Read
- GET `/api/v1/{tenant}/bindings/{id}`
- GET `/api/v1/{tenant}/bindings/search`

Delete
- DELETE `/api/v1/{tenant}/bindings/{id}`
:::

:::collapse{title="INVITATION"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create: create invitations.
- Read: list or view invitations.
- Delete: delete invitations.

**Endpoints**
Create
- POST `/api/v1/{tenant}/invitations`

Read
- GET `/api/v1/{tenant}/invitations/search`
- GET `/api/v1/{tenant}/invitations/email/{email}`
- GET `/api/v1/{tenant}/invitations/{id}`

Delete
- DELETE `/api/v1/{tenant}/invitations/{id}`
:::

:::collapse{title="TENANT_ACCESS"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create: grant a user access to a tenant.
- Read: list tenant access or fetch a user's tenant access.
- Delete: revoke tenant access.

**Endpoints**
Create
- PUT `/api/v1/{tenant}/tenant-access/{userId}`
- POST `/api/v1/{tenant}/tenant-access`

Read
- GET `/api/v1/{tenant}/tenant-access`
- POST `/api/v1/{tenant}/tenant-access/autocomplete`
- GET `/api/v1/{tenant}/tenant-access/{userId}`

Delete
- DELETE `/api/v1/{tenant}/tenant-access/{userId}`

Notes
- `GET /tenant-access/{userId}` is allowed for the authenticated user without TENANT_ACCESS permission; all other access requires the permission.
:::

:::collapse{title="IMPERSONATE"}
**Scope:** Global (tenant)

**CRUD meaning**
- Read: allow impersonation via the API header.

**Endpoints**
Read
- Use `X-Kestra-Impersonate: user@example.com` on authenticated requests (requires IMPERSONATE READ).

Notes
- The IAM endpoint `POST /api/v1/users/{id}/impersonate` is superadmin-only and does not use IMPERSONATE permission.
:::

:::collapse{title="SETTING"}
**Scope:** Global (tenant)

**CRUD meaning**
- Create, Read, Update, Delete: reserved for webserver settings.

**Endpoints**
- No API endpoints currently enforce SETTING permissions.
:::

:::collapse{title="AI_COPILOT"}
**Scope:** Global (tenant)

**CRUD meaning**
- Read: access AI flow generation.

**Endpoints**
Read
- POST `/api/v1/{tenant}/ai/generate/flow` (any action; no action check)
:::
