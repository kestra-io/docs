---
title: Default Tenant & Multi-Tenancy
icon: /docs/icons/migration-guide.svg
release: 0.22.0
editions: ["EE"]
---

Default tenant is deprecated and multi-tenancy is enabled by default.

## Overview

[Multi-tenancy](../../07.enterprise/02.governance/tenants.md) was introduced in Kestra 0.13. For backward compatibility with older versions (≤0.12), you could use the concept of a [default tenant](../../07.enterprise/02.governance/tenants.md#default-tenant), which imitated the multitenancy feature with the so-called `null`-tenant or `default` tenant.

One and a half years later in Kestra 0.22, we are deprecating the default tenant functionality and plan to remove it in the future. We will provide enough time for the migration before removing the functionality and we'll publish a detailed migration guide for all customers who still use the default tenant so that they can migrate to the multi-tenancy feature.

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

Note that in Kestra 0.22 and higher, `defaultTenant` is **no longer enabled by default**, so you must explicitly set that configuration option to `true` to keep using the default tenant.


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