---
title: Forced Plugin Defaults Precedence Change in Kestra 1.3.22
h1: Parent Namespace Wins for Forced Plugin Defaults from 1.3.22
sidebarTitle: Forced Plugin Defaults Precedence
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.3.22
editions: ["OSS", "EE"]
description: From 1.3.22, a forced plugin default on a parent namespace overrides a forced default on a child namespace. Before 1.3.22, the child's forced default won.
---

## What changed

From **1.3.22** (fix for [kestra#16590](https://github.com/kestra-io/kestra/pull/16590)), when a parent namespace and a child namespace both define a `forced: true` plugin default for the same plugin type and property, the **parent's value wins**.

Before 1.3.22, the child's forced default took precedence.

This change affects only `forced: true` defaults. Non-forced defaults are unaffected — the closest namespace (the child) still wins for those.

### Example

Suppose namespace `company` and namespace `company.team` both define a forced plugin default for `containerImage`:

```yaml
# Namespace: company
pluginDefaults:
  - type: io.kestra.plugin.scripts.shell.Commands
    forced: true
    values:
      containerImage: alpine:latest

# Namespace: company.team
pluginDefaults:
  - type: io.kestra.plugin.scripts.shell.Commands
    forced: true
    values:
      containerImage: ubuntu:latest
```

A flow in `company.team` that does not set `containerImage` explicitly:

| Version | Effective `containerImage` |
|---|---|
| Up to 1.3.21 | `ubuntu:latest` (child wins) |
| 1.3.22 and later | `alpine:latest` (parent wins) |

## Who is affected

You are affected if **all** of the following apply:

- You are upgrading from 1.2.x or 1.3.0–1.3.21 to 1.3.22 or later.
- A parent namespace and one of its child namespaces both define `forced: true` plugin defaults for the same plugin type and property.
- You expected the child's value to take effect.

## How to audit your configuration

1. Open the **Namespace** editor in the Kestra UI (or inspect your namespace configuration files).
2. For each namespace that has `forced: true` plugin defaults, check whether any ancestor namespace defines `forced: true` for the same plugin type and property.
3. Where both exist, the ancestor's value will apply from 1.3.22 onward. Verify that this is the intended behavior.

## How to migrate

If the child namespace's value should take effect, remove `forced: true` from the parent namespace's default for that property:

```yaml
# Namespace: company — parent no longer forces this property
pluginDefaults:
  - type: io.kestra.plugin.scripts.shell.Commands
    forced: false          # or omit `forced` entirely; defaults to false
    values:
      containerImage: alpine:latest

# Namespace: company.team — child's forced default now wins
pluginDefaults:
  - type: io.kestra.plugin.scripts.shell.Commands
    forced: true
    values:
      containerImage: ubuntu:latest
```

With the parent's default non-forced, the child's `forced: true` value takes precedence and flows in `company.team` use `ubuntu:latest`.

