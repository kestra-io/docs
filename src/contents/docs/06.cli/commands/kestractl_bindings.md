---
title: kestractl bindings
description: Manage IAM role bindings (list, get, create, delete) using the Kestra CLI.
sidebarTitle: bindings
---

<div class="enterprise-edition">
This feature is part of Kestra Enterprise Edition.
</div>

Manage role bindings in your Kestra instance.

A binding assigns a role to a user or group, optionally scoped to a namespace. Bindings are tenant-scoped resources.

## Commands

### kestractl bindings list

List all role bindings in the active tenant, optionally filtered by `--type`, `--external-id` or `--namespace`.

#### Usage

```bash
kestractl bindings list [flags]
```

#### Flags

| Flag          | Type     | Description                                     |
| :------------ | :------- | :---------------------------------------------- |
| `--type`      | `string` | Filter bindings by subject type (`USER` or `GROUP`) |
| `--external-id` | `string` | Filter bindings by the bound user/group ID      |
| `--namespace` | `string` | Filter bindings by namespace                    |
| `--page`      | `int32`  | Page number (default: `1`)                      |
| `--size`      | `int32`  | Page size (default: `100`)                      |
| `--sort`      | `string` | Sort expression (e.g., `'namespace:asc'`, repeatable) |

#### Examples

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

---

### kestractl bindings get

Retrieve detailed information about a specific role binding.

#### Usage

```bash
kestractl bindings get <binding_id> [flags]
```

#### Arguments

| Argument     | Description          |
| :----------- | :------------------- |
| `<binding_id>` | The ID of the binding to retrieve. |

#### Examples

```bash
# Get details for a specific binding
kestractl bindings get my_binding_id
```

---

### kestractl bindings create

Create a role binding, assigning a role to a user or group.

Pass `--namespace` to scope the binding to a namespace; otherwise, it applies tenant-wide.

#### Usage

```bash
kestractl bindings create [flags]
```

#### Flags

| Flag          | Type     | Description                                     | Required |
| :------------ | :------- | :---------------------------------------------- | :------- |
| `--type`      | `string` | Subject type (`USER` or `GROUP`)                | Yes      |
| `--external-id` | `string` | ID of the user or group to bind                 | Yes      |
| `--role`      | `string` | Role ID to assign                               | Yes      |
| `--namespace` | `string` | Namespace to scope the binding to (optional)    | No       |

#### Examples

```bash
# Assign a role to a user tenant-wide
kestractl bindings create --type USER --external-id user_id --role role_id

# Assign a role to a group within a namespace
kestractl bindings create --type GROUP --external-id group_id --role role_id \
  --namespace company.team
```

---

### kestractl bindings delete

Delete a role binding. You will be prompted for confirmation unless you provide `--yes`.

#### Usage

```bash
kestractl bindings delete <binding_id> [flags]
```

#### Arguments

| Argument     | Description          |
| :----------- | :------------------- |
| `<binding_id>` | The ID of the binding to delete. |

#### Flags

| Flag    | Type      | Description                  |
| :------ | :-------- | :--------------------------- |
| `-y`, `--yes` | `boolean` | Skip the confirmation prompt |

#### Examples

```bash
# Delete a binding with confirmation
kestractl bindings delete my_binding_id

# Delete a binding without confirmation
kestractl bindings delete my_binding_id --yes
```
---
title: kestractl invitations
description: Manage IAM user invitations (list, get, create, delete) using the Kestra CLI.
sidebarTitle: invitations
---

<div class="enterprise-edition">
This feature is part of Kestra Enterprise Edition.
</div>

Manage user invitations in your Kestra instance.

Invitations are tenant-scoped resources.

## Commands

### kestractl invitations list

List all invitations in the active tenant, optionally filtered by `--email` or `--status`.

#### Usage

```bash
kestractl invitations list [flags]
```

#### Flags

| Flag     | Type     | Description                                     |
| :------- | :------- | :---------------------------------------------- |
| `--email`  | `string` | Filter invitations by invitee email             |
| `--status` | `string` | Filter invitations by status (`PENDING`, `ACCEPTED`, or `EXPIRED`) |
| `--page`   | `int32`  | Page number (default: `1`)                      |
| `--size`   | `int32`  | Page size (default: `100`)                      |
| `--sort`   | `string` | Sort expression (e.g., `'sentAt:desc'`, repeatable) |

#### Examples

```bash
# List all invitations
kestractl invitations list

# List pending invitations only
kestractl invitations list --status PENDING

# List invitations sent to an address
kestractl invitations list --email jane@example.com

# List invitations as JSON
kestractl invitations list --output json
```

---

### kestractl invitations get

Retrieve detailed information about a specific invitation, including its status and assigned roles/groups.

#### Usage

```bash
kestractl invitations get <invitation_id> [flags]
```

#### Arguments

| Argument        | Description                 |
| :-------------- | :-------------------------- |
| `<invitation_id>` | The ID of the invitation to retrieve. |

#### Examples

```bash
# Get details for a specific invitation
kestractl invitations get my_invitation_id
```

---

### kestractl invitations create

Create and send a user invitation. The `--email` flag is required.

Pre-assign roles and groups so the invitee receives them upon acceptance. If the invitee already has a user account (or you use `--create-user-if-not-exist`), Kestra grants tenant access directly instead of sending an invitation.

#### Usage

```bash
kestractl invitations create [flags]
```

#### Flags

| Flag                       | Type      | Description                                                                                             | Required |
| :------------------------- | :-------- | :------------------------------------------------------------------------------------------------------ | :------- |
| `--email`                  | `string`  | Email address of the invitee                                                                            | Yes      |
| `--role`                   | `string`  | Role ID to pre-assign (repeatable)                                                                      | No       |
| `--group`                  | `string`  | Group ID to pre-assign (repeatable)                                                                     | No       |
| `--superadmin`             | `boolean` | Grant superadmin to the invitee                                                                         | No       |
| `--create-user-if-not-exist` |