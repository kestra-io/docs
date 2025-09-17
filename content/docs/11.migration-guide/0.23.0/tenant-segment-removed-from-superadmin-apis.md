---
title: Removal of tenant from Superadmin API routes
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["EE", "Cloud"]
---

## Overview

The `{tenant}` parameter has been removed from several API routes related to tenant management in Enterprise Edition. This change affects only EE users who interact with these endpoints programmatically (i.e., via direct API calls).

## Reason for change

These routes are relevant only to `Superadmin` users, who can see and manage all tenants:
* The `{tenant}` path parameter was unnecessary and led to confusion, as all access control is based on the authenticated user's privileges (i.e. their tenant access), not the path.
* The endpoints now reflect the actual access model: actions depend on the `Superadmin` context, not on a specified `{tenant}` in the path.

## Changed endpoints

The following API endpoints have been updated to remove the `{tenant}` path segment:
* `/api/v1/{tenant}/clusters` → `/api/v1/clusters`
* `/api/v1/{tenant}/tenants` → `/api/v1/tenants`
* `/api/v1/{tenant}/tenants/bindings/` → `/api/v1/tenants/bindings/`
* `/api/v1/{tenant}/tenants/{resourceTenant}/group` → `/api/v1/tenants/{resourceTenant}/group`
* `/api/v1/{tenant}/tenants/{resourceTenant}/invitations` → `/api/v1/tenants/{resourceTenant}/invitations`
* `/api/v1/{tenant}/tenants/{resourceTenant}/namespaces` → `/api/v1/tenants/{resourceTenant}/namespaces`
* `/api/v1/{tenant}/tenants/{resourceTenant}/roles` → `/api/v1/tenants/{resourceTenant}/roles`
* `/api/v1/{tenant}/tenants/{resourceTenant}/users/` → `/api/v1/tenants/{resourceTenant}/users/`


## How to migrate

* If you are using these endpoints programmatically, update your API clients to remove the `{tenant}` path segment.
* Access remains limited to `Superadmin` users only.
