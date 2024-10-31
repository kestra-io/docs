---
title: Sync Namespace Files from a Git Repository
icon: /docs/icons/git.svg
stage: Getting Started
topics:
  - Version Control
  - DevOps
version: ">= 0.17.0"
---

Sync files from a Git Repository to Kestra with SyncNamespaceFiles Task.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/AbxaDtINcr8?si=IeCvWT-0PWl5Jq8t" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

The [SyncNamespaceFiles](/plugins/plugin-git/tasks/io.kestra.plugin.git.syncnamespacefiles) task is a powerful integration that allows you to **sync your namespace files with Git from the UI while still managing this process entirely in code**! Kestra unifies the development experience between the UI and code so you can combine the best of both worlds without sacrificing the benefits of version control.

The process is simple: you can sync your files from a Git repository on a schedule or anytime you push a change to a given Git branch. The task allows you to easily sync one or more files from a given namespace.

## Before you begin

Before you start using the `SyncNamespaceFiles` task, make sure you have the following prerequisites in place:
1. A Git repository where you want to sync your files. If you haven't pushed any files yet, check out this [guide using the PushNamespaceFiles task](pushnamespacefiles.md).
2. A Personal Access Token (PAT) for Git authentication.
3. A running Kestra instance in a version 0.17.0 or later with the PAT stored as a [secret](../05.concepts/04.secret.md) within the Kestra instance.

## Using the `dryRun` property

Here is a system flow that will sync the `git` namespace with files from the repository in the `_files` directory.

```yaml
id: sync_files_from_git
namespace: system

tasks:
  - id: sync_files
    type: io.kestra.plugin.git.SyncNamespaceFiles
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    url: https://github.com/git_username/scripts
    branch: main
    namespace: git
    gitDirectory: _files
    dryRun: true
```

Given that the `dryRun` property is set to `true`, the task will only output changes from the Git repository without syncing any files to Kestra yet:

![git1](/docs/how-to-guides/syncnamespacefiles/git1.png)

The files listed are the same ones we added in the [PushNamespaceFiles guide](pushnamespacefiles.md).

## Sync all files to a single namespace from Git

Let's now set the `dryRun` property to `false` and sync the repository with Kestra:

```yaml
id: sync_files_from_git
namespace: system

tasks:
  - id: sync_files
    type: io.kestra.plugin.git.SyncNamespaceFiles
    ...
    dryRun: false
```

You should see the same files from the earlier log now inside of Kestra:

![git2](/docs/how-to-guides/syncnamespacefiles/git2.png)

We can also see a full list inside of the Outputs tab too:

![git3](/docs/how-to-guides/syncnamespacefiles/git3.png)

## Set up a schedule

A common use case for this task is to setup a routine schedule to keep Kestra in sync with the Git repository. To do this, we can simply use a [Schedule trigger](../04.workflow-components/07.triggers/01.schedule-trigger.md). This example has a cron expression to execute once every hour:

```yaml
id: sync_files_from_git
namespace: system

tasks:
  - id: sync_files
    type: io.kestra.plugin.git.SyncNamespaceFiles
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    url: https://github.com/git_username/scripts
    branch: main
    namespace: git
    gitDirectory: _files

triggers:
  - id: every_full_hour
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "* 0 * * *"
```

## Automatically sync when a change is pushed to Git

We can also automate the syncing process by adding a [Webhook trigger](../04.workflow-components/07.triggers/03.webhook-trigger.md) and creating a Webhook on our GitHub repository to trigger our flow every time something is pushed to the repository. This is useful for keeping Kestra always in sync with the repository.

```yaml
id: sync_files_from_git
namespace: system

tasks:
  - id: sync_files
    type: io.kestra.plugin.git.SyncNamespaceFiles
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    url: https://github.com/git_username/scipts
    branch: main
    namespace: git
    gitDirectory: _files

triggers:
  - id: gh_webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: abcdefg
```

To setup this webhook, go to the Settings for your GitHub repository and head to Webhooks and create a new Webhook:

![webhook1.png](/docs/how-to-guides/syncnamespacefiles/webhook1.png)

For the Payload URL, your URL will follow the following format:

```
https://{your_hostname}/api/v1/executions/webhook/system/sync_files_from_git/abcdefg
```

This will require your host name to be publicly accessible. If you want to test this without having to deploy Kestra first, you can use a tool like [ngrok](https://ngrok.com/) to tunnel Kestra so GitHub can see it. As we're putting the secret in the URL, we can leave the Secret field blank.

Once we've done this, we can press save and test it by committing something to our Git repository.

![webhook2.png](/docs/how-to-guides/syncnamespacefiles/webhook2.png)

We can see that the most recent execution was triggered by our Webhook. This is a great way to automate this task so Kestra is always up to date with your Git repository.

If you also want to sync your flows, check out our guide on how to set that up [here](./syncflows.md)!
