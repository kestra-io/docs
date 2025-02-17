---
title: Push Namespace Files to a Git Repository
icon: /docs/icons/git.svg
stage: Getting Started
topics:
  - Version Control
  - DevOps
version: ">= 0.17.0"
---

Push files in your namespace to a Git Repository with the PushNamespaceFiles Task.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/-bEnwR5t7VI?si=Eim8_Las9LJ5jTY6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## How it works

The [PushNamespaceFiles](/plugins/plugin-git/tasks/io.kestra.plugin.git.PushNamespaceFiles) task is a powerful integration that allows you to **push your namespace files to Git from the UI while still managing this process entirely in code**! Kestra unifies the development experience between the UI and code so you can combine the best of both worlds without sacrificing the benefits of version control.

The process is simple: you can **build your flows and files** in a development namespace using all **productivity features of the Kestra UI** (_such as the built-in code editor, autocompletion, syntax validation, documentation, blueprint examples, live-updating topology view, output previews, replays, execution and revision history_) and then **push them to Git** after you have tested and validated them.

The task allows you to easily push one or more files from a given namespace (and optionally also child namespaces) to any Git-based Version Control System.

Additionally, the `dryRun` property will help you see what files will be added, modified, or deleted without overwriting the files on Git yet.

Let's look at a few common patterns of using the `PushNamespaceFiles` task.

## Before you begin

Before you start using the `PushNamespaceFiles` task, make sure you have the following prerequisites in place:
1. A Git repository where you want to push your files.
2. A Personal Access Token (PAT) for Git authentication.
3. A running Kestra instance in a version 0.17.0 or later with the PAT stored as a [secret](../05.concepts/04.secret.md) within the Kestra instance.

## Using the `dryRun` property

Let's start by creating a single `example.py` file in the `dev` namespace and pushing it to a Git repository. We'll initially set the `dryRun` property to `true` to validate the changes before committing them to Git. To do this, we'll need to have a flow already in the `dev` namespace in order to create a new file.

```python
print("Hello, World")
```

Here is a system flow that will push the `example.py` file to a Git repository:

```yaml
id: push_to_git
namespace: system

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushNamespaceFiles
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    url: https://github.com/git_username/scripts
    branch: dev
    namespace: company.team
    files:
      - "example.py"
    gitDirectory: _files
    commitMessage: "add namespace files"
    dryRun: true
```

Given that the `dryRun` property is set to `true`, the task will only output modifications without pushing any files to Git yet:

![git1](/docs/how-to-guides/pushnamespacefiles/git1.png)

## Pushing a single file to Git

Let's now set the `dryRun` property to `false` and push the `example.py` file to Git:

```yaml
id: push_to_git
namespace: system

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushNamespaceFiles
    ...
    dryRun: false
```

You should see the following log message:

![git2.png](/docs/how-to-guides/pushnamespacefiles/git2.png)

And here is what you should see in the Outputs tab:

![git3.png](/docs/how-to-guides/pushnamespacefiles/git3.png)

When you click on the commit URL from the logs or from the Outputs tab, you'll be redirected to the commit page on GitHub:

![git4.png](/docs/how-to-guides/pushnamespacefiles/git4.png)

Now, you can create a pull request and merge the changes to the main branch.

![git5_pr.png](/docs/how-to-guides/pushnamespacefiles/git5_pr.png)

## Pushing all files from a single namespace to Git

To see how you can push all files from a given namespace to Git, let's create two more files in the `dev` namespace:

`example.sh` file:
```sh
echo "Hello, World"
```

`example.js` file:
```js
console.log("Hello, World")
```

![git6_all_files.png](/docs/how-to-guides/pushnamespacefiles/git6_all_files.png)

Let's now adjust the system flow to push all files from the `dev` namespace to the `dev` branch:

```yaml
id: push_to_git
namespace: system

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushNamespaceFiles
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    url: https://github.com/git_username/scripts
    branch: dev
    namespace: company.team
    gitDirectory: _files
    commitMessage: "push all namespace files and create a PR"
    dryRun: true
```

Again, we can set the `dryRun` property to `true` to see what files will be added, modified, or deleted based on the Git version without overwriting the files in Git yet:

![git7.png](/docs/how-to-guides/pushnamespacefiles/git7.png)

Now if you change the `dryRun` property to `false` and run the system flow again, you should see all three files being pushed to the `_files` directory on the `develop` branch with the exact commit messages we have specified in the `commitMessage` property:

![git8.png](/docs/how-to-guides/pushnamespacefiles/git8.png)
