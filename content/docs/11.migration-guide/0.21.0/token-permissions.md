---
title: ME and APITOKEN user permissions
icon: /docs/icons/migration-guide.svg
release: 0.21.0
editions: ["EE"]
---

`ME` and `APITOKEN` permissions added to RBAC.

## Overview

Additional permissions were introduced for creating Users and Groups, allowing better control over personal data management and API Token creation for programmatic access.

## After 0.21

The `ME` and `APITOKEN` permissions were added in version 0.21.0. After upgrading to 0.21.0 or later, Admins must make sure to update any custom roles with these permissions as needed. Any roles managed by Kestra that need these permissions have them automatically applied in the upgrade.

`ME:READ` permission is added to all Kestra-managed roles. All users will be able to access profile information. Only the Admin role will be configured with:

- `ME: [CREATE, READ, UPDATE]`: Change profile data.
- `APITOKEN: [CREATE, READ, UPDATE, DELETE]`: Control user API access.

`ME:DELETE` is currently not supported. A user cannot delete its own account.

In the [Kestra API](../../api-reference/enterprise.md), the Users API `/api/v1/users/password` changed to `/api/v1/me/password`.