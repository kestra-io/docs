---
title: Super Admin Renamed to Instance Owner
sidebarTitle: Super Admin → Instance Owner
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["EE", "Cloud"]
description: The Super Admin privilege is renamed to Instance Owner in 2.0. Deprecated aliases are retained for the CLI and config; HTTP API responses emit instanceOwner instead of superAdmin.
---

Super Admin is renamed to Instance Owner in 2.0. The privilege is otherwise unchanged.

Deprecated aliases are retained for the CLI, configuration, and HTTP request bodies. The only breaking change is **HTTP API responses**: the field `superAdmin` is renamed to `instanceOwner` with no alias. Update API consumers that read this field.

## What changed

### Terminology

"Super Admin" and "Superadmin" become "Instance Owner" across the UI, docs, and API. The privilege is a boolean on a user or service account — not a role, not a binding, not tenant-scoped.

### CLI (`kestra auths users`)

| Old | New | Alias retained |
|---|---|---|
| `--superadmin` flag on `users create` | `--instance-owner` | Yes — `--superadmin` still works |
| `set-superadmin` subcommand | `set-instance-owner` | Yes — `set-superadmin` still works |

### Configuration

| Old key | New key | Alias retained |
|---|---|---|
| `kestra.security.super-admin` | `kestra.security.instance-owner` | Yes — old key still works |

Updated config structure:

```yaml
kestra:
  security:
    instance-owner:
      username: <username>
      password: <password>
      tenant-admin-access:
        - <optional>
```

### HTTP API

Request bodies still accept `superAdmin` via a JSON alias — no changes required for callers creating or updating users.

Responses now emit `instanceOwner` instead of `superAdmin`:

```diff
- if (user.superAdmin) { ... }
+ if (user.instanceOwner) { ... }
```

Deprecated HTTP paths under `/superadmin` still work but will be removed in a future major version.

## What requires action

1. **API consumers reading `superAdmin` from responses** — update to read `instanceOwner`. This is the only change without a deprecated alias.
2. **Config using `kestra.security.super-admin`** — update to `kestra.security.instance-owner` before the alias is removed.
3. **CLI scripts using `--superadmin` or `set-superadmin`** — update to `--instance-owner` and `set-instance-owner` before the aliases are removed.

No database migration is required. Existing users and service accounts with the Instance Owner privilege are unaffected.

## Related

- [Instance Owner](../../../07.enterprise/05.instance/00.instance-owner/index.md) — privilege overview, creating and managing Instance Owners
- [Security and Secrets configuration](../../../configuration/05.security-and-secrets/index.md) — full `kestra.security.instance-owner` reference
- [kestra server CLI](../../../kestra-cli/kestra-server/index.md) — `--instance-owner` and `set-instance-owner` reference
