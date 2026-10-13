---
title: EE Git Clone Removed — Use OSS git.Clone
h1: Migrate io.kestra.plugin.ee.git.Clone to io.kestra.plugin.git.Clone
sidebarTitle: EE Git Clone Removed
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["EE"]
description: io.kestra.plugin.ee.git.Clone is removed in Kestra EE 2.0. Flows that reference it fail to save with "Invalid type". Rename the type to io.kestra.plugin.git.Clone; SSH flows that use privateKey also need strictHostKeyChecking pinned.
---

`io.kestra.plugin.ee.git.Clone` is removed in Kestra EE 2.0. Any flow that references it returns `422 Invalid type: io.kestra.plugin.ee.git.Clone` on save and cannot be deployed.

The replacement is the OSS `io.kestra.plugin.git.Clone`. Every property (`url`, `branch`, `depth`, `directory`, `cloneSubmodules`, `auth`, `username`, `password`, `privateKey`, `gitConfig`, `knownHosts`, `strictHostKeyChecking`) maps directly — no renaming needed.

## What changed

| | Before (EE 1.3) | After (EE 2.0) |
|---|---|---|
| Task type | `io.kestra.plugin.ee.git.Clone` | `io.kestra.plugin.git.Clone` |
| `strictHostKeyChecking` default | `true` | `false` |
| SSH host-key check behavior | Host keys verified by default | Host keys **not** verified by default |

## HTTPS and token-based flows

For flows that authenticate over HTTPS or with a username and password (no `privateKey`), the migration is a plain type rename. No properties change and no behavior differs.

**Before:**

```yaml
tasks:
  - id: clone
    type: io.kestra.plugin.ee.git.Clone
    url: https://github.com/my-org/my-repo
    branch: main
    password: "{{ secret('GITHUB_TOKEN') }}"
```

**After:**

```yaml
tasks:
  - id: clone
    type: io.kestra.plugin.git.Clone
    url: https://github.com/my-org/my-repo
    branch: main
    password: "{{ secret('GITHUB_TOKEN') }}"
```

## SSH flows with `privateKey`

The EE Clone verified SSH host keys by default (`strictHostKeyChecking: true`). The OSS Clone does not (`strictHostKeyChecking: false`). This default only applies when `privateKey` is set — both plugins read the property exclusively in the SSH-key transport path, so HTTPS and token-based flows are not affected.

To preserve host-key verification after renaming, set `strictHostKeyChecking: true` explicitly. If you had already set `strictHostKeyChecking: false` to disable verification, keep that value — it is carried over as-is.

**Before:**

```yaml
tasks:
  - id: clone
    type: io.kestra.plugin.ee.git.Clone
    url: git@github.com:my-org/my-repo.git
    privateKey: "{{ secret('SSH_KEY') }}"
```

**After:**

```yaml
tasks:
  - id: clone
    type: io.kestra.plugin.git.Clone
    url: git@github.com:my-org/my-repo.git
    strictHostKeyChecking: true
    privateKey: "{{ secret('SSH_KEY') }}"
```

:::alert{type="warning"}
Omitting `strictHostKeyChecking: true` on an SSH clone that used `ee.git.Clone` silently disables host-key verification. SSH clones that previously relied on host-key checking will stop verifying host keys after the rename.
:::

## `pluginDefaults` entries

A flow-level `pluginDefaults` entry for `io.kestra.plugin.ee.git.Clone` needs its type renamed to `io.kestra.plugin.git.Clone`. Do not add `strictHostKeyChecking` directly under the `pluginDefaults` entry — it is not valid there. Set it on individual tasks that use `privateKey`.

**Before:**

```yaml
pluginDefaults:
  - type: io.kestra.plugin.ee.git.Clone
    values:
      branch: main
```

**After:**

```yaml
pluginDefaults:
  - type: io.kestra.plugin.git.Clone
    values:
      branch: main
```

## Automated migration with kestra-migrate

`kestra-migrate` handles this change automatically on the v2 path:

- Renames `io.kestra.plugin.ee.git.Clone` to `io.kestra.plugin.git.Clone`.
- Pins `strictHostKeyChecking: true` on tasks that set `privateKey`, when the property is not already set explicitly.
- Renames `pluginDefaults` entries for the type without adding `strictHostKeyChecking`.
- Leaves the value unchanged if `strictHostKeyChecking` is already set on a task.

This migration is skipped under `--stay-v1-compatible` because `io.kestra.plugin.ee.git.Clone` still exists on EE 1.3 and the OSS `git.Clone` on that version does not have the `strictHostKeyChecking` property.

## Background

The EE Clone was an internal duplicate of the OSS `git.Clone`, marked `@Plugin(internal = true)`. It was deleted in plugin-ee-git 2.2.1 (shipped with EE 2.0.4 as plugin-ee-git 2.3.1) when the EE plugin moved to the shared `plugin-git-lib`. Because it was internal, it was never listed in the plugin reference — but EE 1.3 accepted it, so flows that used it deployed without issue on 1.3 and fail immediately on 2.0.
