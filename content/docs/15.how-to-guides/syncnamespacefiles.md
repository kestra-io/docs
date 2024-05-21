---
title: SyncNamespaceFiles Task
icon: /docs/icons/tutorial.svg
version: ">= 0.17.0"
---

Sync files from a Git Repository to Kestra.

The [SyncFlows](/plugins/plugin-git/tasks/io.kestra.plugin.git.syncnamespacefiles) task is a powerful integration that allows you to **sync your code with Git from the UI while still managing this process entirely in code**! Kestra unifies the development experience between the UI and code so you can combine the best of both worlds without sacrificing the benefits of version control.

The process is simple: you can sync your files from a Git repository on a schedule or anytime you push a change to a given Git branch. The task allows you to easily sync one or more files from a given namespace.

## Before you begin

Before you start using the `PushFlows` task, make sure you have the following prerequisites in place:
1. A Git repository where you want to sync your files.
2. A Personal Access Token (PAT) for Git authentication.
3. A running Kestra instance in a version 0.17.0 or later with the PAT stored as a [secret](https://kestra.io/docs/concepts/secret) within the Kestra instance.

## Using the `dryRun` property