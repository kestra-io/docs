---
title: "kestractl: Kestra CLI for Flows and Executions"
h1: Manage Flows, Executions, and Namespaces with kestractl
sidebarTitle: kestractl
icon: /src/contents/docs/icons/bash.svg
editions: ["OSS","EE"]
description: Manage Kestra flows, executions, namespaces, and files from the command line. The kestractl CLI provides full control over your instance without a UI.
---

Use `kestractl` to interact with the Kestra host API for flows, executions, namespaces, namespace files, and key-value pairs.

For server components, plugins, and system maintenance commands, see the [Kestra Server CLI](../kestra-server/index.mdx).

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/kestra-io/kestractl/main/install-scripts/install.sh | bash
```

## Quick Setup

### Open Source (basic auth)

```bash
kestractl config add default http://localhost:8080 main --username YOUR_USERNAME --password YOUR_PASSWORD --default
```

### Enterprise (API token)

```bash
kestractl config add default https://kestra.example.com production --token YOUR_TOKEN --default
```

Your configuration is saved at `~/.kestractl/config.yaml` and the default context is used automatically.

```yaml
contexts:
  default:
    host: https://kestra.example.com
    tenant: production
    auth_method: token
    token: YOUR_TOKEN
default_context: default
```

For basic auth contexts, `auth_method` is `basicAuth` and the file stores `username` and `password` instead of a token.



## Usage

### Examples

```bash
# Deploy flows, then run one and wait for completion
kestractl flows deploy ./flows --namespace prod --override --fail-fast
kestractl executions run prod nightly-refresh --wait --output json
```

```bash
# Sync namespace files for a release
kestractl nsfiles upload prod ./assets --path resources --override --fail-fast
```

```bash
# List flows as JSON
kestractl flows list my.namespace --output json
```

### Command groups

- `config`: manage authentication contexts.
- `flows`: list, get, deploy, and validate flows.
- `executions`: run and inspect executions.
- `namespaces`: list and filter namespaces.
- `nsfiles`: list, get, upload, and delete namespace files.
- `kv`: list, set, update, get, and delete key-value pairs. Note: `kv list` requires token auth and returns 401 with basic auth.
- `users`: list, get, create, update, delete, set group membership, set passwords, and manage API tokens for users. Requires Kestra EE; operates at the instance level (not tenant-scoped).
- `groups`: list, get, create, update, delete groups and manage their members. Requires Kestra EE; tenant-scoped.
- `roles`: list, get, create, update, and delete roles with resource-level permissions. Requires Kestra EE; tenant-scoped.
- `service-accounts` (aliases: `service-account`, `sa`): list, get, create, update, delete service accounts and manage their API tokens. Requires Kestra EE; instance-level (not tenant-scoped).
- `bindings`: list, get, create, and delete role bindings (the assignment of a role to a user or group). Requires Kestra EE; tenant-scoped.

Use `kestractl --help` or `kestractl <command> --help` for the full command reference.

## IAM management (Enterprise Edition)

The `users`, `groups`, `roles`, `service-accounts`, and `bindings` command groups require Kestra Enterprise Edition. `users` and `service-accounts` operate at the instance level while `groups`, `roles`, and `bindings` are tenant-scoped and use the active tenant from your context.

### Users

:::alert{type="warning"}
Use `--user-password` to set a user's password — **not** `--password`. The `--password` flag authenticates the CLI itself with basic auth. Passing a user's new password to `--password` sends it as your own credentials.
:::

```bash
# List / filter users
kestractl users list
kestractl users list --query alice --output json

# Get user details
kestractl users get <user_id>

# Create a user (--email is required)
kestractl users create --email alice@example.com --first-name Alice --user-password 'S3cret!'
kestractl users create --email bob@example.com --superadmin

# Update a user — only the flags you pass change; other attributes are preserved
kestractl users update <user_id> --first-name Alicia
kestractl users update <user_id> --superadmin=false

# Set a user's password
kestractl users set-password <user_id> --user-password 'N3wPass!'

# Assign a user to groups in the active tenant
# Passing no --group clears all group memberships for that tenant
kestractl users set-groups <user_id> --group <group_id>

# Delete a user — prompts for confirmation; skip with --yes
kestractl users delete <user_id>
kestractl users delete <user_id> --yes

# Manage a user's API tokens (the full token value is shown only once, at creation)
kestractl users tokens create <user_id> --name ci-token
kestractl users tokens list <user_id>
kestractl users tokens delete <user_id> <token_id>
```

### Groups

```bash
# List / filter groups
kestractl groups list
kestractl groups list --query admins --output json

# Get group details
kestractl groups get <group_id>

# Create a group (--name is required; --member is repeatable for initial members)
kestractl groups create --name admins --description 'Platform admins'
kestractl groups create --name admins --member <user_id> --member <user_id>

# Update a group — only the flags you pass change; other attributes are preserved
kestractl groups update <group_id> --name platform-admins
kestractl groups update <group_id> --description 'Updated description'

# Delete a group — prompts for confirmation; skip with --yes
kestractl groups delete <group_id>
kestractl groups delete <group_id> --yes

# Manage group members
kestractl groups members list <group_id>
kestractl groups members add <group_id> <user_id>
kestractl groups members remove <group_id> <user_id>
```

### Roles

A role carries a `permissions` payload: a map of resource type (e.g. `FLOW`, `EXECUTION`, `NAMESPACE`, `SECRET`, `KVSTORE`) to a list of permission levels (`READ`, `CREATE`, `UPDATE`, `DELETE`). Provide permissions either inline with the repeatable `--permission TYPE:LEVEL[,LEVEL]` flag or from a YAML/JSON file with `--permissions-file` — not both at once.

:::alert{type="warning"}
Passing `--permission` or `--permissions-file` on `roles update` **replaces the entire permissions block** — it does not merge with the existing permissions. Omit both flags on update if you only want to change the name or description.
:::

```bash
# List / filter roles
kestractl roles list
kestractl roles list --query editor --output json
kestractl roles list --page 1 --size 50 --sort name:asc

# Get role details, including its permissions
kestractl roles get <role_id>

# Create a role (--name required; at least one --permission or --permissions-file required)
kestractl roles create --name editor \
  --description "Can edit flows and view executions" \
  --permission FLOW:READ,CREATE,UPDATE \
  --permission EXECUTION:READ

# Create a role from a permissions file (YAML or JSON)
kestractl roles create --name viewer --permissions-file perms.yaml
```

```yaml
# perms.yaml
FLOW:
  - READ
EXECUTION:
  - READ
```

```bash
# Update a role — only the flags you pass change; other attributes are preserved
# Exception: --permission replaces the entire permissions block
kestractl roles update <role_id> --description "Updated description"
kestractl roles update <role_id> --permission FLOW:READ,CREATE,UPDATE,DELETE
kestractl roles update <role_id> --default

# Delete a role — prompts for confirmation; skip with --yes
kestractl roles delete <role_id>
kestractl roles delete <role_id> --yes
```

### Service accounts

Service accounts are instance-level resources. The command can be shortened to `service-account` or `sa`.

`update` is a partial update — only `--name` and `--description` are accepted. Super-admin status, tenant grants, and group membership cannot be changed with `update`. Pass at least one of `--name` or `--description`; passing neither returns an error.

```bash
# List service accounts
kestractl service-accounts list
kestractl service-accounts list --output json
kestractl service-accounts list --page 1 --size 50 --sort name:asc

# Get service account details
kestractl service-accounts get <service_account_id>

# Create a service account (--name is required; lowercase alphanumeric and dashes)
kestractl service-accounts create --name ci-bot --description "CI pipeline"

# Create a super-admin service account with tenant access (--tenant-grant is repeatable)
kestractl service-accounts create --name ops-bot --superadmin --tenant-grant main

# Update name or description only (at least one flag required)
kestractl service-accounts update <service_account_id> --description "Updated description"
kestractl service-accounts update <service_account_id> --name new-bot-name

# Delete a service account — prompts for confirmation; skip with --yes
kestractl service-accounts delete <service_account_id>
kestractl service-accounts delete <service_account_id> --yes

# Manage API tokens (the full token value is shown only once, at creation)
kestractl service-accounts tokens create <service_account_id> --name deploy-token
kestractl service-accounts tokens create <service_account_id> --name short-lived --max-age P30D --extended
kestractl service-accounts tokens list <service_account_id>
kestractl service-accounts tokens delete <service_account_id> <token_id>
```

### Bindings

A binding assigns a role to a user or group, optionally scoped to a namespace. Bindings are tenant-scoped.

```bash
# List all bindings
kestractl bindings list

# Filter by subject type or ID
kestractl bindings list --type USER --external-id <user_id>
kestractl bindings list --type GROUP --external-id <group_id>

# Filter by namespace
kestractl bindings list --namespace company.team

# Get binding details
kestractl bindings get <binding_id>

# Assign a role to a user tenant-wide
kestractl bindings create --type USER --external-id <user_id> --role <role_id>

# Assign a role to a group scoped to a namespace
kestractl bindings create --type GROUP --external-id <group_id> --role <role_id> \
  --namespace company.team

# Delete a binding — prompts for confirmation; skip with --yes
kestractl bindings delete <binding_id>
kestractl bindings delete <binding_id> --yes
```

## Configuration

### Global flags

- `--host` - Kestra host URL
- `--tenant` - Tenant name
- `--token` / `-t` - API token (Enterprise)
- `--username` - Basic auth username (Open Source)
- `--password` - Basic auth password (Open Source)
- `--output` / `-o` - Output format (`table` or `json`)
- `--config` - Custom config file path (default: `~/.kestractl/config.yaml`)
- `--verbose` / `-v` - Verbose output (warning: prints credentials in HTTP requests)

### Config file and contexts

Manage contexts with `kestractl config add`, `kestractl config show`, `kestractl config use`, and `kestractl config remove`.

### Environment variables

Environment variables override config file settings. Use either `KESTRACTL_TOKEN` or `KESTRACTL_USERNAME` and `KESTRACTL_PASSWORD`.

```bash
export KESTRACTL_HOST=http://localhost:8080
export KESTRACTL_TENANT=main
export KESTRACTL_TOKEN=YOUR_TOKEN
export KESTRACTL_USERNAME=admin
export KESTRACTL_PASSWORD=admin
export KESTRACTL_OUTPUT=json
```

### Configuration precedence

1. **Command-line flags** (`--host`, `--token`, etc.)
2. **Environment variables** (`KESTRACTL_HOST`, `KESTRACTL_TOKEN`, etc.)
3. **Config file** (`~/.kestractl/config.yaml` or custom via `--config`)
4. **Default values**

### Override per command

```bash
kestractl flows get my.namespace my-flow \
  --host https://kestra.example.com \
  --tenant production \
  --token YOUR_TOKEN
```
