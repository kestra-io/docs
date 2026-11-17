---
title: Sync Flows and Namespace Files from Git
h1: Sync Flows and Namespace Files from Git into Kestra
sidebarTitle: Sync from Git
icon: /src/contents/docs/icons/git.svg
description: Use the SyncFlows and SyncNamespaceFiles tasks to apply flows and namespace files from a Git repository to Kestra on a schedule or on every push.
---

Apply flows and namespace files from a Git repository to Kestra, with Git as the source of truth.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/YbIuqYWLrpA?si=4g11iHE4qm0VdKMv" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

The [SyncFlows](/plugins/plugin-git/io.kestra.plugin.git.syncflows) and [SyncNamespaceFiles](/plugins/plugin-git/io.kestra.plugin.git.syncnamespacefiles) tasks read a Git branch and create or update the matching flows and namespace files in Kestra. A changed resource in Git overwrites the version in Kestra, including edits made in the UI. To commit resources from Kestra to Git instead, see [Push to Git](../01.push-to-git/index.md).

## Before you begin

- A Git repository with your flows or namespace files, and a personal access token (PAT) with read access to it. Store the PAT as a [secret](../../../06.concepts/04.secret/index.md), for example `GITHUB_ACCESS_TOKEN`.
- Credentials for the Kestra API. Both tasks create and update resources through the API, so on an instance with authentication they need either task-level `auth` (and `kestraUrl` if the API isn't reachable at the default URL) or default credentials configured with `kestra.tasks.sdk.authentication.*`, or at the namespace or tenant level in Enterprise Edition. See [SDK authentication](../../../11.migration-guide/v2.0.0/sdk-authentication/index.md).

## Sync flows

This flow syncs the flows in the `flows` directory of the `main` branch into the `company.team` namespace. With `dryRun: true`, it computes the changes without applying them:

```yaml
id: sync_flows_from_git
namespace: company.ops

tasks:
  - id: sync_flows
    type: io.kestra.plugin.git.SyncFlows
    url: https://github.com/my-org/kestra-flows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: main
    targetNamespace: company.team
    gitDirectory: flows
    dryRun: true
```

Run the flow and open the task's **Outputs** tab. The `flows` output is a file with one row per flow that the sync adds, updates, or deletes. Check it, then set `dryRun: false` and run the flow again to apply the changes.

- `targetNamespace` is required. Every synced flow is written to this namespace, whatever `namespace` its YAML file declares.
- Flows that fail validation stop the sync. Set `ignoreInvalidFlows: true` to log a warning and skip them instead.
- By default, `delete` is `false`, so flows that exist in Kestra but not in Git are kept. Set `delete: true` to remove them, and run a dry run first to see what would be deleted.

### Include child namespaces

Set `includeChildNamespaces: true` to sync subfolders of `gitDirectory` into child namespaces of `targetNamespace`. With `targetNamespace: company.team`, a flow at `flows/tutorial/hello_world_1.yml` is synced into `company.team.tutorial`. This matches the layout that [PushFlows](../01.push-to-git/index.md#include-child-namespaces) creates.

## Sync namespace files

`SyncNamespaceFiles` works the same way for [namespace files](../../../06.concepts/02.namespace-files/index.md). This flow syncs the `_files` directory into the `company.team` namespace:

```yaml
id: sync_files_from_git
namespace: company.ops

tasks:
  - id: sync_files
    type: io.kestra.plugin.git.SyncNamespaceFiles
    url: https://github.com/my-org/kestra-flows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: main
    namespace: company.team
    gitDirectory: _files
    dryRun: true
```

- The dry-run diff is in the task's `files` output.
- By default, `delete` is `false`. Set `delete: true` to remove namespace files that aren't in Git.
- With `includeChildNamespaces: true`, a folder under `gitDirectory` named after an existing child namespace, such as `_files/company.team.tutorial/`, is synced into that namespace. This matches the layout that `PushNamespaceFiles` creates.

### Sync one folder of a namespace

Use `namespaceDirectory` to write files into one folder of the namespace, independently of `gitDirectory`, which sets the folder to read in the repository. This configuration reads from `scripts/` in Git and writes to `/shared-scripts` in the namespace, so `scripts/helpers/parse.py` lands at `/shared-scripts/helpers/parse.py`:

```yaml
id: sync_shared_scripts
namespace: company.ops

tasks:
  - id: sync_files
    type: io.kestra.plugin.git.SyncNamespaceFiles
    url: https://github.com/my-org/kestra-flows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: main
    namespace: company.team
    gitDirectory: scripts
    namespaceDirectory: /shared-scripts
```

With `delete: true`, only files under `namespaceDirectory` can be deleted. Files elsewhere in the namespace are kept, even if they aren't in Git.

### Namespace creation

In Enterprise Edition, if the target `namespace` doesn't exist, `SyncNamespaceFiles` creates it before writing files. This needs the Kestra API credentials from [Before you begin](#before-you-begin). Without credentials, the task logs a warning and still writes the files to internal storage, but the namespace doesn't appear in the UI until you create it. Dry runs never create namespaces.

Open-Source has no API to create namespaces, so the files are synced but the namespace isn't created.

## Sync on a schedule

Add a [Schedule trigger](../../../05.workflow-components/07.triggers/01.schedule-trigger/index.md) to keep Kestra in step with Git. This flow syncs flows and namespace files at the start of every hour:

```yaml
id: sync_from_git
namespace: company.ops

tasks:
  - id: sync_flows
    type: io.kestra.plugin.git.SyncFlows
    url: https://github.com/my-org/kestra-flows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: main
    targetNamespace: company.team
    gitDirectory: flows

  - id: sync_files
    type: io.kestra.plugin.git.SyncNamespaceFiles
    url: https://github.com/my-org/kestra-flows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: main
    namespace: company.team
    gitDirectory: _files

triggers:
  - id: every_hour
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 * * * *"
```

## Sync on every push

To sync as soon as changes land in Git, trigger the flow with a [Webhook trigger](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md) and register its URL as a webhook in your Git provider. Store the webhook key as a secret:

```yaml
id: sync_from_git_on_push
namespace: company.ops

tasks:
  - id: sync_flows
    type: io.kestra.plugin.git.SyncFlows
    url: https://github.com/my-org/kestra-flows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    branch: main
    targetNamespace: company.team
    gitDirectory: flows

triggers:
  - id: github_push
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('WEBHOOK_KEY') }}"
```

In GitHub, open the repository's **Settings** > **Webhooks** > **Add webhook**, and set **Payload URL** to the flow's webhook URL:

```text
https://<your_kestra_host>/api/v1/<tenant>/executions/webhook/company.ops/sync_from_git_on_push/<webhook_key>
```

In Open-Source, the tenant is `main`. You can also copy the URL from the flow's **Triggers** tab. Your Kestra host must be reachable from GitHub; to test from a local instance, expose it with a tunnel such as [ngrok](https://ngrok.com/). To reject requests that don't come from GitHub, set a webhook secret in GitHub and [verify the request signature](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md#verify-the-request-signature) on the trigger.

After you save the webhook, push a commit to the repository. A new execution of `sync_from_git_on_push` starts and applies the change.

## Defaults

| Property | `SyncFlows` default | `SyncNamespaceFiles` default |
| --- | --- | --- |
| `branch` | `main` | `main` |
| `gitDirectory` | `_flows` | `_files` |
| Target namespace | `targetNamespace`: required | `namespace`: the namespace of the flow that runs the task |
| `includeChildNamespaces` | `false` | `false` |
| `delete` | `false` | `false` |
| `dryRun` | `false` | `false` |

If `branch` or `gitDirectory` doesn't exist in the repository, the sync fails. For every property, see the [SyncFlows](/plugins/plugin-git/io.kestra.plugin.git.syncflows) and [SyncNamespaceFiles](/plugins/plugin-git/io.kestra.plugin.git.syncnamespacefiles) plugin pages.
