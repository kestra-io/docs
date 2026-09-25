---
title: Git Dashboard Tasks Moved to Enterprise Edition
h1: Migrate SyncDashboards and PushDashboards to the EE Git Plugin
sidebarTitle: Git Dashboard Tasks (EE)
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["EE"]
description: SyncDashboards and PushDashboards are removed from the OSS plugin-git and replaced by io.kestra.plugin.ee.git.SyncDashboards and PushDashboards in the EE git plugin. OSS flows referencing the old task types will fail to load.
---

`SyncDashboards` and `PushDashboards` are removed from the OSS `plugin-git` package and replaced by equivalent tasks in the Enterprise Edition git plugin.

The dashboard create, update, and delete API routes moved to EE in Kestra 2.0 (`POST`/`PUT`/`DELETE /api/v1/{tenant}/dashboards` are now EE-only). The OSS tasks always failed with `405 Method Not Allowed` against a 2.0 instance, so they are removed rather than left as broken stubs.

## What changed

| Task | Before | After |
|---|---|---|
| Sync dashboards from Git | `io.kestra.plugin.git.SyncDashboards` | `io.kestra.plugin.ee.git.SyncDashboards` |
| Push dashboards to Git | `io.kestra.plugin.git.PushDashboards` | `io.kestra.plugin.ee.git.PushDashboards` |

In addition, `PushDashboards` output field `flows` is renamed to `dashboards`. Update any downstream expressions that reference `outputs.push_dashboards.flows`.

`TenantSync` from OSS `plugin-git` no longer syncs dashboards — the `_global/dashboards` directory in Git is silently ignored. Dashboard sync is available in the EE `TenantSync` (`io.kestra.plugin.git.TenantSync` from `plugin-ee-git`).

## Before

```yaml
tasks:
  - id: sync_dashboards
    type: io.kestra.plugin.git.SyncDashboards
    gitDirectory: _dashboards
    branch: main
    url: https://github.com/my-org/my-repo
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
```

## After

```yaml
tasks:
  - id: sync_dashboards
    type: io.kestra.plugin.ee.git.SyncDashboards
    gitDirectory: _dashboards
    branch: main
    url: https://github.com/my-org/my-repo
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
```

Only the `type` changes. All other properties are identical.

## PushDashboards output field rename

If you reference the `PushDashboards` output in a downstream task, update the field name:

```yaml
# Before
message: "{{ outputs.push_dashboards.flows }}"

# After
message: "{{ outputs.push_dashboards.dashboards }}"
```

## Impact on OSS

`SyncDashboards`, `PushDashboards`, and dashboard sync within `TenantSync` are not available on OSS in Kestra 2.0. Flows that reference `io.kestra.plugin.git.SyncDashboards` or `io.kestra.plugin.git.PushDashboards` will fail to load after upgrading. Remove or replace those tasks before upgrading.
