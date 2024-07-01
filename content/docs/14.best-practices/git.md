---
title: Version Control
icon: /docs/icons/best-practices.svg
version: ">= 0.14.0"
---

This section describes best practices for Version Control with Git in Kestra.

By default, **all Kestra flows are automatically versioned**. You don't need to use any additional version control system to track changes to your flows. Kestra automatically creates a new revision of a flow whenever you save it, and you can view the history of changes to a flow, compare changes between revisions, and restore a previous version at any time.

However, if you want to use Git to track changes to your [Flows](../04.workflow-components/01.flow.md) and [Namespace Files](../08.developer-guide/03.namespace-files.md), you can do so using the built-in Git support in Kestra.

There are multiple ways to use Git with Kestra:
- The [git.SyncFlows](/plugins/plugin-git/tasks/io.kestra.plugin.git.syncflows) pattern allows you to implement GitOps and use Git as a single source of truth for your flows.
- The [git.SyncNamespaceFiles](https://kestra.io/plugins/plugin-git/tasks/io.kestra.plugin.git.syncnamespacefiles) pattern allows you to implement GitOps and use Git as a single source of truth for your namespace files.
- The [git.PushFlows](/plugins/plugin-git/tasks/io.kestra.plugin.git.PushFlows) pattern allows you to edit your flows from the UI and regularly commit and push changes to Git; this pattern is useful if you want to use the built-in Editor in the UI and still have your code in Git.
- The [git.PushNamespaceFiles](/plugins/plugin-git/tasks/io.kestra.plugin.git.pushnamespacefiles) pattern allows you to edit your namespace files from the UI and regularly commit and push changes to Git; this pattern is useful if you want to use the built-in Editor in the UI and still have your files in Git.
- The [CI/CD](../08.developer-guide//cicd/index.md) pattern is useful if you want to manage the CI/CD process yourself e.g. via GitHub Actions or Terraform, and keep Git as a single source of truth for your code.

The image below shows how to choose the right pattern based on your needs:

![git](/docs/developer-guide/git/git.png)

For a detailed comparison of the three patterns, check the [Version Control with Git](../08.developer-guide/04.git.md) page.

