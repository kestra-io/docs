---
title: Version Control
icon: /docs/icons/best-practices.svg
---

This section describes best practices for Version Control with Git in Kestra.

By default, **all Kestra flows are automatically versioned**. You don't need to use any additional version control system to track changes to your flows. Kestra automatically creates a new revision of a flow whenever you save it, and you can view the history of changes to a flow, compare changes between revisions, and restore a previous version at any time.

However, if you want to use Git to track changes to your [Flows](/docs/workflow-components/flow) and [Namespace Files](/docs/developer-guide/namespace-files), you can do so using the built-in Git support in Kestra.

There are multiple ways to use Git with Kestra:
- The [git.Sync](/plugins/plugin-git/tasks/io.kestra.plugin.git.sync) pattern allows you to implement GitOps and use Git as a single source of truth; this pattern is useful if you want to use Git as a single source of truth and avoid making changes to flows and Namespace Files from the UI
- The [git.Push](/plugins/plugin-git/tasks/io.kestra.plugin.git.push) pattern allows you to edit your flows and Namespace Files from the UI and regularly commit and push changes to Git; this pattern is useful if you want to use the built-in Editor in the UI and still have your code in Git
- The [CI/CD](/docs/developer-guide/cicd) pattern is useful if you want to manage the CI/CD process yourself e.g. via GitHub Actions or Terraform, and keep Git as a single source of truth for your code.

The image below shows how to choose the right pattern based on your needs:

![git](/docs/developer-guide/git/git.png)

For a detailed comparison of the three patterns, check the [Version Control with Git](/docs/developer-guide/git) page.

