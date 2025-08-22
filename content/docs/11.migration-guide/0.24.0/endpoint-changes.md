---
title: IAM and API Endpoint Changes
icon: /docs/icons/migration-guide.svg
release: 0.24.0
editions: ["EE"]
---

## Overview

To streamline API usage, reduce ambiguity, and improve security and manageability for large organizations, the IAM and related API endpoints have been significantly revised in 0.24. These changes consolidate user, group, and role management around explicit, well-defined routes and permissions, and remove redundant or confusing API paths.

### Global API Changes

- `/v1/api/{tenant}/me` moved to `/v1/api/me`
- `/v1/api/cluster` moved to `/v1/api/instance`
- All `/v1/api/{tenant}/users` endpoints are removed:
    - Use `/v1/api/users` (instance-level, Superadmin only)
    - Use `/v1/api/{tenant}/tenant-access` for tenant access management
    - Use `/v1/api/{tenant}/service-accounts` for service account management
- All Superadmin endpoints under `/v1/api/tenants/{tenant}/groups`, `/bindings`, `/roles`, `/invitations`, and `/namespaces` are removed.

### Role APIs

- `GET /v1/api/tenants/{tenant}/roles/[search|autocomplete]` now only returns operation-relevant fields; `tenantId`, `deleted`, `description`, and `permissions` have been removed.
- `GET /v1/api/tenants/{tenant}/roles/{id}` now only returns relevant fields; `tenantId` and `deleted` are removed.
- `POST/PUT /v1/api/tenants/{tenant}/roles`: the request body now excludes `id`, `tenantId`, and `deleted`.

### Group APIs

- `GET /v1/api/tenants/{tenant}/groups/[search|autocomplete]` now only returns `id` and `name`.
- `GET /v1/api/tenants/{tenant}/groups/{id}` now only returns `id`, `name`, and `description`.
- `POST/PUT /v1/api/tenants/{tenant}/groups` the request body now excludes `id`, `tenantId`, and `deleted`.
- `GET /v1/api/tenants/{tenant}/groups/{groupId}/members` and `/members/{userId}` now return only `id`, `username`, `displayName`, and `groups`.

### RBAC Updates

- Permissions `API_TOKEN` and `ME` are removed.
- New permissions:
    - `SERVICE_ACCOUNT` for managing service accounts
    - `INVITATION` for managing invitations
    - `TENANT_ACCESS` for managing users in a tenant
    - `GROUP_MEMBERSHIP` for group membership management
- The `USER` permission is now only required for SCIM integration.

### Action Required for applications built on top of Kestra API

- Update any API clients or scripts that interact with affected endpoints.
- Review permission assignments and RBAC configurations to use the updated permissions.
- For file uploads, ensure the request format matches the new requirements.

