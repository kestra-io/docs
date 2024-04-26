---
title: How to Use the PushFlows Task
icon: /docs/icons/tutorial.svg
version: ">= 0.17.0"
---

The `PushFlows` task allows you to commit and push your saved flows to a Git repository. 

## How it works

The `PushFlows` task is a powerful integration that allows you to **push your code to Git from the UI while still managing this process entirely in code**! Kestra unifies the development experience between the UI and code so you can combine the best of both worlds without sacrificing the benefits of version control.

The process is simple: you can **build your flows** in a development namespace using all **productivity features of the Kestra UI** (_such as the built-in code editor, autocompletion, syntax validation, documentation, blueprint examples, live-updating topology view, output previews, replays, execution and revision history_) and then **push them to Git** after you have tested and validated them.

The task allows you to easily push one or more flows from a given namespace (and optionally also child namespaces) to Git. 

Additionally, the `dryRun` property will help you see what files will be added, modified, or deleted based on the Git version without overwriting the files in Git yet.

Let's look at a few common patterns to better understand how you can leverage the `PushFlows` task in your workflows.

## Before you begin

Before you start using the `PushFlows` task, make sure you have the following prerequisites in place:
1. A Git repository where you want to push your flows.
2. A Personal Access Token (PAT) for Git authentication. If you're using a private repository, you'll need to provide the PAT in the `password` property.
3. A running Kestra instance in a version 0.17.0 or later with the PAT stored as a [secret](https://kestra.io/docs/concepts/secret) within the Kestra instance.

## Using the `dryRun` property

Let's start by creating a single `hello_world` flow in the `dev` namespace and pushing it to a Git repository. We'll set the `dryRun` property to `true` to confirm the changes before pushing them to Git.

```yaml
id: hello_world
namespace: dev

inputs:
  - id: greeting
    type: STRING
    defaults: hey

tasks:
  - id: welcome
    type: io.kestra.core.tasks.log.Log
    message: hi {{ inputs.greeting }}
```

Here is a system flow that will push the `hello_world` flow to a Git repository:

```yaml
id: push_to_git
namespace: system

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushFlows
    username: anna-geller
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}" 
    url: https://github.com/anna-geller/flows
    branch: develop 
    flows:
      - hello_world
    sourceNamespace: dev
    targetNamespace: prod
    gitDirectory: flows
    commitMessage: "changes to kestra flows"
    dryRun: true
```

Given that the `dryRun` property is set to `true`, the task will only output modifications without pushing any flows to Git yet:

TODO screen shot

![git1](/docs/how-to-guides/pushflows/git1.png)

## Pushing a single flow to Git

Let's not set the `dryRun` property to `false` and push the `hello_world` flow to the Git repository:

```yaml
id: push_to_git
namespace: system

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushFlows
    ...
    dryRun: false
```

You should see the following log message:

![img_2.png](/docs/how-to-guides/pushflows/git2.png)

And here is what you should see in the Outputs tab:

![img_2.png](/docs/how-to-guides/pushflows/git3.png)


When you click on the commit URL from the logs or from the Outputs tab, you'll be redirected to the commit page on GitHub:

![img.png](/docs/how-to-guides/pushflows/git4.png)

Now, you can create a pull request and merge the changes to the main branch!

![img.png](/docs/how-to-guides/pushflows/git5_pr.png)

## Pushing all flows from a single namespace to Git

To see how you can push all flows from a given namespace to Git, let's create two more flows in the `dev` namespace:

```yaml
id: flow1
namespace: dev
tasks:
  - id: test
    type: io.kestra.core.tasks.log.Log
    message: this is too easy
```

The `flow2` flow is just a copy of the `flow1` with a different flow ID and message:
```yaml
id: flow2
namespace: dev
tasks:
  - id: test
    type: io.kestra.core.tasks.log.Log
    message: this is the simplest dev-to-prod workflow ever
```

![img.png](/docs/how-to-guides/pushflows/git6_all_flows.png)

Let's now adjust the system flow to push all flows from the `dev` namespace to the Git repository:

```yaml
id: push_to_git
namespace: system

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushFlows
    username: anna-geller
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}" 
    url: https://github.com/anna-geller/flows
    branch: develop 
    sourceNamespace: dev
    targetNamespace: prod
    gitDirectory: flows
    commitMessage: "push all development flows to Git and create a PR"
    dryRun: true
```

Again, we can set the `dryRun` property to `true` to see what files will be added, modified, or deleted based on the Git version without overwriting the files in Git yet:

![img.png](/docs/how-to-guides/pushflows/git7.png)

Now if you change the `dryRun` property to `false` and run the system flow again, you should see all 3 flows being pushed to the `flows` directory on the `develop` branch with the exact commit messages we have specified in the `commitMessage` property:

![img.png](/docs/how-to-guides/pushflows/git8.png)


## Pushing all flows including child namespaces

Finally, we get to the fun part of pushing all flows from the `dev` namespace **including all child namespaces** to the Git repository. Kestra will automatically create a subfolder for each child namespace and push the flows there to keep everything organized.

Let's create two more flows in the `dev.tutorial` namespace:

1. `hello_world_1` flow:
```yaml
id: hello_world_1
namespace: dev.tutorial

inputs:
  - id: greeting
    type: STRING
    defaults: hey

tasks:
  - id: print_status
    type: io.kestra.core.tasks.log.Log
    message: hello on {{ inputs.greeting }}
```

2. `hello_world_2` flow:
```yaml
id: hello_world_2
namespace: dev.tutorial

inputs:
  - id: greeting
    type: STRING
    defaults: hey

tasks:
  - id: print_status
    type: io.kestra.core.tasks.log.Log
    message: hello on {{ inputs.greeting }}
```

To include all child namespaces in our Git commit, we only need to set the `includeChildNamespaces` property to `true`:

```yaml
id: push_to_git
namespace: system

tasks:
  - id: commit_and_push
    type: io.kestra.plugin.git.PushFlows
    username: anna-geller
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}" 
    url: https://github.com/anna-geller/flows
    branch: develop 
    sourceNamespace: dev
    targetNamespace: prod
    gitDirectory: flows
    commitMessage: "push all flows"
    includeChildNamespaces: true
```
    
When you run this final system flow, you should see the following output:

![img.png](/docs/how-to-guides/pushflows/git9.png)

And here is a confirmation that all flows from the `dev` namespace and its child namespaces have been pushed to the Git repository:

![img.png](/docs/how-to-guides/pushflows/git10.png)

Here is a simple table to illustrate how flows are mapped to files in the Git repository:

| Flow          | Source namespace in the flow code | Git directory path               |
|---------------|-----------------------------------|----------------------------------|
| hello_world   | namespace: dev                    | flows/hello_world.yml            |
| flow1         | namespace: dev                    | flows/flow1.yml                  |
| flow2         | namespace: dev                    | flows/flow2.yml                  |
| hello_world_1 | namespace: dev.tutorial           | flows/tutorial/hello_world_1.yml |
| hello_world_2 | namespace: dev.tutorial           | flows/tutorial/hello_world_2.yml |

You can see that each child namespace is represented as a subfolder in the Git repository, and all flows are neatly organized in their respective directories.


## Extra notes

- The `flows` property allows you to specify a list of Regex strings that declare which flows should be included in the Git commit. By default, all flows from the specified `sourceNamespace` will be pushed (and optionally adjusted to match the `targetNamespace` before pushing to Git). If you want to push only the current flow, you can use the `{{flow.id}}` expression or specify the flow ID explicitly, e.g. `myflow`. You can also use this property to push only specific flows — you have full flexibility to customize this task to your preferred deployment strategy.
- The `branch` property allows you to specify the branch to which files should be committed and pushed. If the branch doesn’t exist yet, it will be created.
- The `commitMessage` property allows you to specify the Git commit message. You can use templating to include dynamic values in your commit message.
- The `gitDirectory` property allows you to specify the directory to which flows should be pushed. If not set, flows will be pushed to a Git directory named `_flows` and will optionally also include subdirectories named after the child namespaces. If you prefer, you can specify an arbitrary path, e.g., `kestra/flows`, allowing you to push flows to that specific Git directory.
- If you omit the `targetNamespace`, the `sourceNamespace` will be used as the `targetNamespace` by default. The `targetNamespace` is an optional mechanism to help you prepare your development flows to be merged into the production branch/namespace. If you set the `targetNamespace`, the `sourceNamespace` in the source code will be overwritten by the `targetNamespace` so that you can seamlessy sync the flows to production.
- If you try to add the Personal Access Token (PAT) directly in your source code in the `password` property, you will get an error message. This is a safety mechanism to prevent you and your users from accidentally exposing your PAT in the source code. You should store the PAT as a Kestra Secret, environment variable, namespace variable or as a SECRET-type input in your flow. 

![img.png](credential_detected.png)
