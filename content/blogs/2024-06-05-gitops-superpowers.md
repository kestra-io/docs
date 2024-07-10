---
title: "Unlock GitOps Superpowers For All your Workflows"
description: "Our latest version control integration introduces new Git tasks that bring enhanced flexibility and control to your workflows"
date: 2024-06-05T08:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: "mproset"
image: /blogs/2024-06-05-gitops-superpowers.jpg
---

We are excited to introduce a fully redesigned version control integration that takes your GitOps capabilities to new heights. This blog post explores how these new features can enhance productivity and collaboration.

## Simplify Your Workflow with New Git Tasks

With our new Git tasks, committing and pushing your saved work to a Git repository is as simple as adding a few YAML lines. The **PushFlows** task makes this a reality, allowing you to effortlessly move all your work from a development environment to a Git repository. The result? You save valuable time and reduce the risk of human error.

For example, when you’ve developed a new data pipeline flow, with PushFlows, you can push this flow to your Git repository with just a few lines of configuration. This ensures your code is versioned and safely stored, ready for review and deployment.

But we didn't stop there. The **SyncFlows** task automatically checks for changes in your Git branch and deploys them to your Kestra namespaces. This continuous synchronization means you no longer need to manually update your production environment. Whether you schedule it to run hourly or trigger it whenever changes are merged into a specific Git branch, SyncFlows ensures that your environments are always up-to-date and consistent.

![dev to prod](/blogs/2024-06-05-gitops-superpowers/as-code.png)

### Continuous Integration with SyncFlows

If you have a production environment that needs to stay updated with the latest approved changes, you can configure `SyncFlows` to automatically sync any changes merged into your main branch to your Kestra namespaces. This keeps your production environment up-to-date without configuring tedious CI/CD pipelines or manual intervention.

## Control and Precision with Selective Git Pushes

With the ability to target specific flows or namespace files, you can ensure that only the necessary changes are committed.

If you’re working on a major feature branch and only want to push changes related to a particular flow, the **PushNamespaceFiles** task makes it easy. 

## Moving From Development to Production Made Easy

By combining the **PushFlows** and **SyncFlows** tasks, you can create a comprehensive Git workflow that covers the full software development lifecycle for your workflows. 

Here is how that works: 
1. You push your flows from a development environment to a Git repository
2. You then sync them to your Kestra production environment after they have been reviewed and merged into the production branch. 

![dev to prod](/blogs/2024-06-05-gitops-superpowers/devtoprod.png)

## Validate Before You Commit with Dry-Run Mode

One of the standout features of our new Git tasks is the `dryrun` mode. Dry-run allows you to validate your workflows before committing any changes, giving you a preview of what will happen without making actual modifications. This way, you can be sure that only flows and files you want are included in your commit, and you can validate which changes will be synced to production before it happens.


## There is a Git Pattern for Every Case

Kestra supports various patterns to suit different workflows and preferences, ensuring that you can choose the one that best fits your needs:

1. **Git Sync**: Ideal for teams following the GitOps methodology or from a Kubernetes background. This pattern uses Git as a single source of truth and automatically syncs changes to Kestra.
2. **Git Push**: Perfect for those who prefer using the built-in editor and regularly committing changes to Git. This pattern allows for easy updates and version control directly from the UI.
3. **CI/CD**: Suitable for teams with established CI/CD pipelines. Manage your CI/CD process independently using tools like GitHub Actions or Terraform, while keeping Git as your single source of truth.

## Flexibility in Version Control

Whether you prefer using a built-in editor or an external IDE, our new Git tasks offer the flexibility to suit your workflow. For those who enjoy the convenience of a graphical interface, the **Git Push** pattern allows you to edit flows and namespace files directly from the UI and commit changes regularly. On the other hand, if you are managing CI/CD pipelines independently, our tools integrate seamlessly with platforms like GitHub Actions or Terraform, allowing you to maintain Git as your single source of truth.

## Get Started with GitOps for Your Automation Pipelines

With Kestra's new Git integration features, managing your version control has never been easier. To help you get started, we’ve created detailed guides in the documentation and a YouTube playlist that will walk you guide you through using these new Git tasks.

**Ready to Unlock Your GitOps Superpowers?**

- [Read the Documentation](https://kestra.io/docs/developer-guide/git): Dive into our comprehensive guides and learn how to implement and optimize your Git workflows with Kestra.
- [Watch the Video Playlist](https://youtu.be/OPlNKQZFeho): Follow our step-by-step video tutorials and get up to speed quickly.

---

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
