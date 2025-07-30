---
title: Manual user refresh to migrate Superadmin property
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["EE", "Cloud"]
---

## Overview

The handling of `Superadmin` users in Kestra Cloud and Enterprise Edition has changed. Previously, the `Superadmin` status was determined by the user type (`SUPER_ADMIN`). In version 0.23, this is now managed through a dedicated property (`isSuperAdmin`). This change enables new use cases such as assigning a `Superadmin` permission to a Service Account as well as sending an invite with `Superadmin` permissions, but it also impacts user role detection for existing users.

**Required action**:
All EE customers must run the following CLI command after upgrading to 0.23:

```shell
kestra auths users refresh
```

This command migrates and refreshes user data to correctly assign `Superadmin` status under the new property-based model.

## Impact

- Existing Enterprise and Cloud users with the type `SUPER_ADMIN` will not automatically have the new `isSuperAdmin` property set unless you run the migration command after upgrading to 0.23.
- This may result in users unexpectedly losing `Superadmin` privileges. If you see this happening, run `kestra auths users refresh` from the CLI to resolve the missing access.


