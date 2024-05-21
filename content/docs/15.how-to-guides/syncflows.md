---
title: SyncFlows Task
icon: /docs/icons/tutorial.svg
version: ">= 0.17.0"
---

The `SyncFlows` task allows you to sync flows from a Git repository to Kestra.


The [SyncFlows](/plugins/plugin-git/tasks/io.kestra.plugin.git.SyncFlows) task is a powerful integration that allows you to **sync your code with Git from the UI while still managing this process entirely in code**! Kestra unifies the development experience between the UI and code so you can combine the best of both worlds without sacrificing the benefits of version control.

The process is simple: you can sync your flows from a Git repository on a schedule or anytime you push a change to a given Git branch.

The task allows you to easily sync one or more flows from a given namespace (and optionally)


## Before you begin

Before you start using the `PushFlows` task, make sure you have the following prerequisites in place:
1. A Git repository where you want to push your flows.
2. A Personal Access Token (PAT) for Git authentication.
3. A running Kestra instance in a version 0.17.0 or later with the PAT stored as a [secret](https://kestra.io/docs/concepts/secret) within the Kestra instance.

## Using the `dryRun` property

gitDirectory is the folder in the git repo
targetNamespaces is which namespace the flows should go to, regardless of what they have

Here is a system flow that will sync

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
    dryRun: true  

triggers:
  - id: every_full_hour
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 * * * *"
```

##