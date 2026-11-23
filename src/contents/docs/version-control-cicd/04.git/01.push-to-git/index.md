---
title: Push Flows and Namespace Files to Git
h1: Push Flows and Namespace Files from Kestra to Git
sidebarTitle: Push to Git
icon: /src/contents/docs/icons/git.svg
description: Use the PushFlows and PushNamespaceFiles tasks to commit flows and namespace files from Kestra to a Git repository, with dry runs, child namespaces, and scheduled pushes.
---

Commit flows and namespace files that you build in the Kestra UI to a Git repository.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/OPlNKQZFeho?si=ZvRQfLjnhjDYk1qN" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

The [PushFlows](/plugins/plugin-git/io.kestra.plugin.git.pushflows) and [PushNamespaceFiles](/plugins/plugin-git/io.kestra.plugin.git.pushnamespacefiles) tasks export resources from a namespace and push them to a Git branch. Use them when your team builds and tests flows in the UI, for example in a development namespace, and wants a reviewed history in Git. To go the other way, from Git into Kestra, see [Sync from Git](../02.sync-from-git/index.md).

## Before you begin

- A Git repository and a personal access token (PAT) with write access to it. Store the PAT as a [secret](../../../06.concepts/04.secret/index.md), for example `GITHUB_ACCESS_TOKEN`.
- Credentials for the Kestra API. Both tasks read resources through the API, so on an instance with authentication they need either task-level `auth` (and `kestraUrl` if the API isn't reachable at the default URL) or default credentials configured with `kestra.tasks.sdk.authentication.*`, or at the namespace or tenant level in Enterprise Edition. See [SDK authentication](../../../11.migration-guide/v2.0.0/sdk-authentication/index.md).

## Push flows

This flow pushes every flow in `company.team` to the `develop` branch. With `dryRun: true`, it computes the changes without committing anything:

```yaml
id: push_flows_to_git
namespace: company.ops

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushFlows
    url: https://github.com/my-org/kestra-flows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: develop
    sourceNamespace: company.team
    gitDirectory: flows
    commitMessage: "Push flows from company.team"
    dryRun: true
```

Run the flow and open the task's **Outputs** tab. The `flows` output is a file with one row per added, changed, or deleted file in Git. Check it, then set `dryRun: false` and run the flow again. The task commits and pushes the changes, and its `commitId` and `commitURL` outputs point to the new commit.

Each flow is written to `<gitDirectory>/<flowId>.yml`. If `branch` doesn't exist yet, the task creates it, so you can push to a feature branch and open a pull request for review.

### Choose which flows to push

- `flows` takes one or more glob patterns matched against flow IDs, such as `etl_*`. The default `**` matches every flow. To push only the flow that runs the task, use `flows: "{{ flow.id }}"`.
- Draft flows are never pushed.
- `targetNamespace` rewrites each flow's top-level `namespace` before the push, for example from `company.team` to `company.prod`, so the files in Git are ready to sync into production. Nested `namespace` properties, such as a Subflow's, keep their value.

### Include child namespaces

Set `includeChildNamespaces: true` to also push flows from namespaces below `sourceNamespace`. Each child namespace becomes a subfolder named after the part of the namespace below `sourceNamespace`:

| Flow | Namespace | Path in Git (`gitDirectory: flows`) |
| --- | --- | --- |
| `hello_world` | `company.team` | `flows/hello_world.yml` |
| `hello_world_1` | `company.team.tutorial` | `flows/tutorial/hello_world_1.yml` |
| `report` | `company.team.tutorial.daily` | `flows/tutorial/daily/report.yml` |

## Push namespace files

`PushNamespaceFiles` works the same way for [namespace files](../../../06.concepts/02.namespace-files/index.md). This flow pushes the Python scripts of `company.team` to the `_files` directory:

```yaml
id: push_files_to_git
namespace: company.ops

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushNamespaceFiles
    url: https://github.com/my-org/kestra-flows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: develop
    namespace: company.team
    files:
      - "**.py"
    gitDirectory: _files
    commitMessage: "Push scripts from company.team"
    dryRun: true
```

- `files` takes glob patterns matched against each file's path from the namespace root. The default `**` matches every file.
- The dry-run diff is in the task's `files` output.
- With `includeChildNamespaces: true`, files from each child namespace go under a folder named after the full namespace, such as `_files/company.team.tutorial/`.
- Set `errorOnMissing: true` to fail the task when no file matches.

### Push one folder of a namespace

Use `namespaceDirectory` to push only the files under one folder of the namespace. The folder prefix is removed from the Git path, so a file at `/shared-scripts/helpers/parse.py` in the namespace lands at `scripts/helpers/parse.py` with this configuration:

```yaml
id: push_shared_scripts
namespace: company.ops

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushNamespaceFiles
    url: https://github.com/my-org/kestra-flows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: develop
    namespace: company.team
    gitDirectory: scripts
    namespaceDirectory: /shared-scripts
    files:
      - "shared-scripts/**"
    commitMessage: "Push shared scripts"
```

The `files` patterns still match the full path from the namespace root, not the path inside `namespaceDirectory`. A [SyncNamespaceFiles](../02.sync-from-git/index.md#sync-one-folder-of-a-namespace) task with the same `gitDirectory` and `namespaceDirectory` is the exact inverse, so syncing and then pushing produces no changes.

## Deleted resources

By default, `delete` is `true`: when a flow or file no longer exists in Kestra, the push removes its file from Git. Only files the task manages are affected, such as files under `gitDirectory`, or under `namespaceDirectory` for a scoped push. Set `delete: false` to keep files in Git after you delete them in Kestra.

To push only deletions, set `pushMode: DELETE_ONLY`. The task removes files for resources that no longer exist and leaves every other file unchanged, even if the resource changed since the last push.

## Push on a schedule

Add a [Schedule trigger](../../../05.workflow-components/07.triggers/01.schedule-trigger/index.md) to push changes regularly. This flow pushes every flow in `company.team` and its child namespaces every day at 17:00:

```yaml
id: push_flows_daily
namespace: company.ops

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushFlows
    url: https://github.com/my-org/kestra-flows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: develop
    sourceNamespace: company.team
    includeChildNamespaces: true
    gitDirectory: flows
    commitMessage: "Daily push from company.team"

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 17 * * *"
```

Git doesn't order concurrent pushes to the same branch. If several flows or people push at the same time, a push can fail or conflict. Run pushes one at a time, for example with a [concurrency limit](../../../05.workflow-components/14.concurrency/index.md) of 1, or push to separate branches.

## Defaults

| Property | `PushFlows` default | `PushNamespaceFiles` default |
| --- | --- | --- |
| `branch` | `main`, created if missing | `main`, created if missing |
| `gitDirectory` | `_flows` | `_files` |
| Source namespace | `sourceNamespace`: the namespace of the flow that runs the task | `namespace`: the namespace of the flow that runs the task |
| `includeChildNamespaces` | `false` | `false` |
| `delete` | `true` | `true` |
| `dryRun` | `false` | `false` |

For every property, see the [PushFlows](/plugins/plugin-git/io.kestra.plugin.git.pushflows) and [PushNamespaceFiles](/plugins/plugin-git/io.kestra.plugin.git.pushnamespacefiles) plugin pages.
