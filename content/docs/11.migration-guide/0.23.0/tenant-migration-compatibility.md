---
title: Kestra Tenant Migration & Compatibility Guide
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS", "EE"]
---

## Overview

Kestra now requires a tenant context across both the OSS and EE versions.

## Open Source Edition Changes

### Default Tenant

A fixed, non-configurable tenant named "main" is always used now in the open-source version. The tenant is not stored in the database and does not impact the user experience in the UI or building flows.

### Breaking change

All Open-source API URIs now include the tenantId:

**Before**: `/api/v1/...`

**0.23 & onwards**: `/api/v1/main/...`

Temporarily, there is a compatibility layer implemented to map `/api/v1/...` to `/api/v1/main/...` to ease the transition, but this compatibility layer will eventually be removed in a future Kestra version.

### Migration Script

To add the tenantId field across your existing database (flows, executions, logs, etc.), use:

```shell
kestra migrate tenant --dry-run
```

::alert{type="info"}
- Use `--dry-run` to preview changes without modifying data.
- Re-run without the flag to execute the migration.
::

## Enterprise Edition Changes

### Tenant System Now Always Enabled

The configuration properties `kestra.ee.tenants.enabled` and `kestra.ee.tenants.defaultTenant` have been removed. Tenants are now mandatory, and must be created manually.

### New Configuration Property

With this change, there is a new configuration property: `kestra.ee.tenants.fallbackTenant: tenant-id`.

This property is used to route non-tenant-specific API calls to a fallback tenant. This does not rewrite the route but internally assigns the tenant.

Unlike OSS, no compatibility layer is added to map `/api/v1/...` to `/api/v1/fllbackTenant/...`. The manual fallback tenant assignment will be removed in a future version, so make sure to create tenants in your instance.

### Migration Script

To successfully migrate, use the following script

```shell
kestra migrate tenant \
    --tenant-id=tenant \
    --tenant-name="Tenant Name" \
    [--dry-run]
```

- `--tenant-id` is required.
- If the tenant does not exist, you must provide `--tenant-name`.
- Use `--dry-run` to simulate the migration.

### Kafka Queue Handling

If you are using Kafka for queues, queues will be recreated after migration.
