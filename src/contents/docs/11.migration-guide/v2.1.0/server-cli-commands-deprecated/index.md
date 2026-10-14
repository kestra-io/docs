---
title: Server CLI Commands Deprecated in Favor of kestractl
h1: Replace Deprecated kestra CLI Commands with kestractl
sidebarTitle: Server CLI Commands Deprecated
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["OSS", "EE"]
description: Seven kestra server CLI commands that call the Kestra API are deprecated in 2.1.0 and will be removed in a future release. Each one has a kestractl replacement.
---

Seven `kestra` server CLI commands are deprecated in 2.1.0 and will be removed in a future release. Each one now has an equivalent in [`kestractl`](../../../kestra-cli/kestractl/index.md), the API client CLI.

The deprecated commands still work. Each one prints a deprecation message before it runs:

```text
This command is deprecated and will be removed in a future version. Please use kestractl instead (https://kestra.io/docs/kestra-cli/kestractl).
```

The message is printed to standard output. If a script captures the output of a deprecated command, such as `TOKEN=$(kestra workers registration-tokens generate)`, the captured value now includes this line. Switch the script to `kestractl` to get clean output.

## Command mapping

| Deprecated command | Edition | Replacement |
|---|---|---|
| `kestra flow export` | OSS, EE | `kestractl flows export` |
| `kestra flow delete` | OSS, EE | `kestractl flows delete` |
| `kestra namespace kv update` | OSS, EE | `kestractl kv set` |
| `kestra auths users create` | EE | `kestractl users create` |
| `kestra auths users create-basic-auth` | EE | `kestractl users set-password` |
| `kestra tenants create` | EE | `kestractl tenants create` |
| `kestra workers registration-tokens generate` | EE | `kestractl workers registration-tokens generate` |

Most `kestractl` commands call the Kestra API, so they need a running instance and an authenticated [context](../../../kestra-cli/kestractl/index.md#quick-setup). `kestractl workers registration-tokens generate` is the exception: it runs offline.

## Differences to account for

The replacements are not always drop-in. Check the following before updating scripts.

### `flow export`

The two commands select flows differently:

- `kestra flow export --namespace my.namespace` exports flows in `my.namespace` and all of its child namespaces. `--namespace` is required.
- `kestractl flows export --namespace my.namespace` exports flows in `my.namespace` only. `--namespace` is optional, and omitting it exports every flow in the tenant.

To keep child namespaces in the export, use `kestractl flows export-by-query` with a `PREFIX` filter. `kestra flow export` also takes a directory and writes `flows.zip` into it, while `kestractl` takes the output file path:

```bash
# Before
kestra flow export --namespace my.namespace /path/to/export-directory

# After: my.namespace and its child namespaces
kestractl flows export-by-query --filter NAMESPACE:PREFIX:my.namespace --output-file /path/to/export-directory/flows.zip

# After: my.namespace only
kestractl flows export --namespace my.namespace --output-file /path/to/export-directory/flows.zip
```

### `namespace kv update`

`kestra namespace kv update` creates the key if it does not exist. Use `kestractl kv set`, which has the same behavior. `kestractl kv update` fails when the key does not exist.

`kestractl kv set` takes the value type as a required argument, and the TTL is an ISO 8601 duration passed with `--ttl`:

```bash
# Before
kestra namespace kv update my.namespace my-key "my-value" -e 1d

# After
kestractl kv set my.namespace STRING my-key "my-value" --ttl P1D
```

### `auths users create`

`kestractl users create` identifies the user with `--email` and sets the password with `--user-password`. Do not use `--password`, which authenticates `kestractl` itself.

The `--instance-owner` flag maps to `--superadmin` in `kestractl`. To grant the Admin role in a tenant, which `--admin` did, create a binding after you create the user:

```bash
# Before
kestra auths users create --tenant=main --admin alice@example.com 'S3cret!'

# After
kestractl users create --email alice@example.com --user-password 'S3cret!'
kestractl bindings create --tenant main --type USER --external-id <user_id> --role <admin_role_id>
```

Run `kestractl roles list --tenant main` to find the Admin role ID.

`kestractl` needs an existing user to authenticate, so it can't create the first user on a new instance. Create the first Instance Owner with the [setup wizard](../../../07.enterprise/01.overview/02.setup/index.md) or the [`kestra.security.instance-owner`](../../../07.enterprise/05.instance/00.instance-owner/index.md#through-configuration) configuration.

### `tenants create`

`kestractl tenants create` grants you, the authenticated user, the Admin role in the new tenant. `kestra tenants create --admin-username` granted it to the user you named. To make someone else the tenant admin, create a binding after the tenant exists:

```bash
# Before
kestra tenants create stage "Staging" --admin-username alice

# After
kestractl tenants create stage --name "Staging"
kestractl bindings create --tenant stage --type USER --external-id <user_id> --role <admin_role_id>
```

`kestractl users set-password` and `kestractl bindings create` take a user ID, not a username. Run `kestractl users list --query <username>` to find it.

## Related

- [`kestractl` reference](../../../kestra-cli/kestractl/index.md)
- [Kestra server CLI reference](../../../kestra-cli/kestra-server/index.md)
