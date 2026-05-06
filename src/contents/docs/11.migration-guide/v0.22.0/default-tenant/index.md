---
title: "Default Tenant Deprecated: Multi-Tenancy Now Default"
h1: Deprecating the Default Tenant and Enabling Multi-Tenancy
sidebarTitle: Default Tenant Deprecated
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.22.0
editions: ["EE"]
description: Deprecation of the default tenant functionality and enablement of multi-tenancy by default in Enterprise Edition.
---


## Default Tenant & Multi-Tenancy

Default tenant is deprecated and multi-tenancy is enabled by default.

[Multi-tenancy](../../../07.enterprise/02.governance/tenants/index.md) was introduced in Kestra 0.13. For backward compatibility with older versions (≤0.12), you could use the concept of a [default tenant](../../../07.enterprise/02.governance/tenants/index.md), which imitated the multitenancy feature with the so-called `null`-tenant or `default` tenant.

In Kestra 0.22, the default tenant functionality is deprecated and will be removed in the future. Sufficient migration time will be provided, along with a detailed migration guide for customers still using the default tenant.

:::alert{type="warning"}
Prior to Kestra 0.22, `tenants.enabled` was by default set to `false` and `defaultTenant` was set to `true`. Starting from Kestra 0.22, `tenants.enabled` is set to `true` and `defaultTenant` is set to `false` by default.
:::

## How to keep the default tenant for now

To continue using the default tenant, set the `defaultTenant` configuration flag to `true` and `tenants.enabled` to `false` in your `kestra.yml` configuration file:

```yaml
kestra:
  ee:
    tenants:
      enabled: false
      defaultTenant: true
```

In Kestra 0.22 and higher, `defaultTenant` is **no longer enabled by default**, so set that configuration option to `true` to keep using the default tenant.


### Before 0.22.0

Here is the default multi-tenancy configuration before 0.22.0:

```yaml
kestra:
  ee:
    tenants:
      enabled: false
      defaultTenant: true
```

### After 0.22.0

Here is the default multi-tenancy configuration after 0.22.0:

```yaml
kestra:
  ee:
    tenants:
      enabled: true
      defaultTenant: false
```
