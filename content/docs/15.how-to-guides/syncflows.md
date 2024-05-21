---
title: SyncFlows Task
icon: /docs/icons/tutorial.svg
version: ">= 0.17.0"
---

Sync flows from a Git Repository to Kestra.


The [SyncFlows](/plugins/plugin-git/tasks/io.kestra.plugin.git.SyncFlows) task is a powerful integration that allows you to **sync your code with Git from the UI while still managing this process entirely in code**! Kestra unifies the development experience between the UI and code so you can combine the best of both worlds without sacrificing the benefits of version control.

The process is simple: you can sync your flows from a Git repository on a schedule or anytime you push a change to a given Git branch.

The task allows you to easily sync one or more flows from a given namespace.

## Before you begin

Before you start using the `PushFlows` task, make sure you have the following prerequisites in place:
1. A Git repository where you want to sync your flows. If you haven't pushed any flows yet, check out this [guide using the PushFlows task](pushflows.md).
2. A Personal Access Token (PAT) for Git authentication.
3. A running Kestra instance in a version 0.17.0 or later with the PAT stored as a [secret](https://kestra.io/docs/concepts/secret) within the Kestra instance.

## Using the `dryRun` property

Here is a system flow that will sync the `git` namespace with flows from the repository.

```yaml
id: sync_flows_from_git
namespace: system

tasks:
  - id: sync_flows
    type: io.kestra.plugin.git.SyncFlows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    url: https://github.com/kestra-io/flows 
    branch: main
    targetNamespace: git
    gitDirectory: flows
    dryRun: true  
```

Given that the `dryRun` property is set to `true`, the task will only output modifications without pushing any flows to Git yet:

![git1](/docs/how-to-guides/syncflows/git1.png)

The files listed are the same ones we added in the [PushFlows guide](pushflows.md).

## Sync all flows to a single namespace from Git

Let's now set the `dryRun` property to `false` and sync the repository with Kestra:

```yaml
id: sync_flows_from_git
namespace: system

tasks:
  - id: sync_flows
    type: io.kestra.plugin.git.SyncFlows
    ...
    dryRun: false
```

You should see the same flows from the earlier log now inside of Kestra:

![git2.png](/docs/how-to-guides/syncflows/git2.png)

We can also see a full list inside of the Outputs tab too:

![git3.png](/docs/how-to-guides/syncflows/git3.png)

## Sync all flows including child namespaces

On top of that, we can

```yaml
id: sync_flows_from_git
namespace: system

tasks:
  - id: git
    type: io.kestra.plugin.git.SyncFlows
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    url: https://github.com/kestra-io/flows 
    branch: main
    targetNamespace: git
    gitDirectory: flows
    includeChildNamespaces: true
    dryRun: true  
```

Similar to earlier, we can see all of our flows, including the ones from the `tutorial` child namespace were synced into Kestra:

![git4.png](/docs/how-to-guides/syncflows/git4.png)

We can also verify this with the Outputs tab too:

![git5.png](/docs/how-to-guides/syncflows/git5.png)