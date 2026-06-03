```markdown
---
title: kestractl bindings
description: Manage IAM role bindings using the Kestra CLI.
sidebarTitle: bindings
---

:::tip Enterprise Edition
Managing IAM role bindings is an Enterprise Edition feature.
:::

The `kestractl bindings` command group manages IAM role bindings in your Kestra instance. A binding assigns a role to a user or group, optionally scoped to a namespace. Bindings are tenant-scoped resources.

## Commands

### `kestractl bindings list`

List all role bindings in the active tenant. Optionally filter results by subject type, external ID, or namespace.

```bash
kestractl bindings list [flags]
```

**Flags:**

*   `--type string`: Filter bindings by subject type (`USER` or `GROUP`).
*   `--external-id string`: Filter bindings by the bound user/group ID.
*   `--namespace string`: Filter bindings by namespace.
*   `--page int32`: Page number (default: `1`).
*   `--size int32`: Page size (default: `100`).
*   `--sort stringArray`: Sort expression (e.g., `'namespace:asc'`, repeatable).

**Examples:**

```bash
# List all bindings
kestractl bindings list

# List bindings of a group
kestractl bindings list --type GROUP --external-id group_id

# List bindings scoped to a namespace
kestractl bindings list --namespace company.team

# List bindings as JSON
kestractl bindings list --output json
```

### `kestractl bindings get <binding_id>`

Retrieve detailed information about a specific role binding.

```bash
kestractl bindings get <binding_id> [flags]
```

**Arguments:**

*   `<binding_id>`: The ID of the binding to retrieve.

**Examples:**

```bash
# Get details for a specific binding
kestractl bindings get b1234567-89ab-cdef-0123-456789abcdef
```

### `kestractl bindings create`

Create a new role binding, assigning a role to a user or group.

To scope the binding to a namespace, pass `--namespace`. Otherwise, it applies tenant-wide.

```bash
kestractl bindings create [flags]
```

**Flags:**

*   `--type string` (required): Subject type (`USER` or `GROUP`).
*   `--external-id string` (required): ID of the user or group to bind.
*   `--role string` (required): Role ID to assign.
*   `--namespace string`: Namespace to scope the binding to (optional).

**Examples:**

```bash
# Assign a role to a user tenant-wide
kestractl bindings create --type USER --external-id user_id --role role_id

# Assign a role to a group within a namespace
kestractl bindings create --type GROUP --external-id group_id --role role_id \
  --namespace company.team
```

### `kestractl bindings delete <binding_id>`

Delete (revoke) a role binding. The command prompts for confirmation. Provide `--yes` to skip the prompt.

```bash
kestractl bindings delete <binding_id> [flags]
```

**Arguments:**

*   `<binding_id>`: The ID of the binding to delete.

**Flags:**

*   `-y`, `--yes`: Skip the confirmation prompt.

**Examples:**

```bash
# Delete a binding with confirmation
kestractl bindings delete b1234567-89ab-cdef-0123-456789abcdef

# Delete a binding without confirmation
kestractl bindings delete b1234567-89ab-cdef-0123-456789abcdef --yes
```
```markdown
---
title: kestractl
description: Kestra CLI reference.
---

# kestractl

The `kestractl` command-line interface (CLI) is a powerful tool for interacting with your Kestra instance.

## Commands

*   [`kestractl bindings`](./bindings.md)
*   [`kestractl config`](./config.md)
*   [`kestractl executions`](./executions.md)
*   [`kestractl flows`](./flows.md)
*   [`kestractl groups`](./groups.md)
*   [`kestractl invitations`](./invitations.md)
*   [`kestractl kv`](./kv.md)
*   [`kestractl namespace-files`](./namespace-files.md)
*   [`kestractl namespaces`](./namespaces.md)
*   [`kestractl plugins`](./plugins.md)
*   [`kestractl roles`](./roles.md)
*   [`kestractl service-accounts`](./service-accounts.md)
*   [`kestractl users`](./users.md)
*   [`kestractl version`](./version.md)
*   [`kestractl workers`](./workers.md)
```
```markdown
---
title: Identity and Access Management (IAM)
description: Understand Kestra's Identity and Access Management (IAM) features.
---

# Identity and Access Management (IAM)

Kestra Enterprise Edition provides robust Identity and Access Management (IAM) capabilities to control who can access your Kestra instance and
```