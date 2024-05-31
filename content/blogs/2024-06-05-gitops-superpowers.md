---
title: "GitOps Superpowers for Your Version Control"
description: "Our latest version control integration introduces new Git tasks that bring enhanced flexibility and control to your workflows"
date: 2024-06-05T08:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: "mproset"
image: 
---

We are excited to introduce a fully redesigned version control integration that takes your GitOps capabilities to new heights. This blog post explores how these new features can transform your workflow, delivering tangible outcomes that enhance productivity and collaboration.


## Simplify Your Workflow with New Git Tasks

Whith those new features to our Git tasks, committing and pushing your saved flows to a Git repository is as simple as adding a few YAML lines. With the new **PushFlows** task, this is now a reality. This feature allows you to effortlessly move your flows from a development environment to a Git repository. The result? You save valuable time and reduce the risk of human error.

But we didn't stop there. We also introduced the **SyncFlows** task, which automatically checks for changes in your Git branch and deploys them to your Kestra namespaces. This continuous synchronization means you no longer need to manually update your production environment. Whether you schedule it to run hourly or trigger it whenever changes are merged into a specific Git branch, SyncFlows ensures that your environments are always up-to-date and consistent.

## Control and Precision with Selective Git Pushes

Gone are the days of all-or-nothing commits. Our new Git tasks allow for selective pushes, giving you granular control over what gets committed and pushed to your repositories. With the ability to target specific flows or namespace files, you can ensure that only the necessary changes are committed, reducing the risk of unintended modifications and enhancing the reliability of your codebase.

For example, if you’re working on a major feature branch and only want to push changes related to a particular flow, the **PushNamespaceFiles** task makes it easy. This task ensures that your namespace configurations are accurately tracked and versioned, providing better organization and making it easier to rollback changes if needed.

## Seamless Integration for Continuous Development

By combining the **PushFlows** and **SyncFlows** tasks, you can create a comprehensive Git workflow that integrates seamlessly into your development cycle. Picture this: you push your flows from a development environment to a Git repository, and then sync them back to your Kestra environment after they have been reviewed and merged into the production branch. This integration supports a continuous development cycle, maintaining consistency and reducing manual intervention.

Take, for example, a typical development workflow. You make changes in your development environment, push these changes using PushFlows, and after code review and approval, SyncFlows automatically updates your production environment. This streamlined process not only saves time but also ensures that your production environment always reflects the latest approved changes.

## Validate Before You Commit with Dry-Run Mode

One of the standout features of our new Git tasks is the dry-run mode. This feature allows you to validate your workflows before committing any changes, giving you a preview of what will happen without making actual modifications. By testing workflows in advance, you can catch potential issues early, ensuring error-free deployments and maintaining a stable production environment.

## From Development to Production

you can configure  **Scheduled Sync** to sync flows from a Git repository to a Kestra namespace every hour. This automation ensures that your Kestra environment is always aligned with the latest changes from your Git repository, providing a reliable and up-to-date production environment without the need for manual synchronization.

Or think about the push from development to production. With the **PushFlows** task, you can commit and push changes from a development environment to a Git repository, and then use **SyncFlows** to sync these changes to production after review. This ensures that only reviewed and approved changes make it to the production environment, streamlining your deployment process and enhancing its reliability.

## **Flexibility in Version Control**

Whether you prefer using a built-in editor or an external IDE, our new Git tasks offer the flexibility to suit your workflow. For those who enjoy the convenience of a graphical interface, the **Git Push** pattern allows you to edit flows and namespace files directly from the UI and commit changes regularly. On the other hand, if you are managing CI/CD pipelines independently, our tools integrate seamlessly with platforms like GitHub Actions or Terraform, allowing you to maintain Git as your single source of truth.

## There is a Git Pattern for Every Case

Kestra supports various patterns to suit different workflows and preferences, ensuring that you can choose the one that best fits your needs:

1. **Git Sync**: Ideal for teams following the GitOps methodology or from a Kubernetes background. This pattern uses Git as a single source of truth and automatically syncs changes to Kestra.
2. **Git Push**: Perfect for those who prefer using the built-in editor and regularly committing changes to Git. This pattern allows for easy updates and version control directly from the UI.
3. **CI/CD**: Suitable for teams with established CI/CD pipelines. Manage your CI/CD process independently using tools like GitHub Actions or Terraform, while keeping Git as your single source of truth.

### Git Sync Pattern

**Outcome**: Simplified and Automated Operations

Implementing the Git Sync pattern ensures that your flows and namespace files in Kestra are always synchronized with the versions in Git. 


**Outcome**: Flexibility and Control

The Git Push pattern provides the flexibility to edit flows and namespace files directly from the UI while maintaining a robust version control system. This approach allows you to leverage the convenience of the UI without sacrificing the benefits of Git-based version control.

### CI/CD Pattern

**Outcome**: Robust and Scalable Pipelines

Managing your CI/CD process with Git ensures that your development and deployment workflows are robust and scalable. This pattern supports complex workflows and integrations, allowing you to build and deploy with confidence.


## Get Started with GitOps for Your Automation Pipelines

With Kestra's new Git integration features, managing your version control has never been easier or more powerful. These tools are designed to help you streamline your workflows, maintain consistency across your environments, and boost productivity. Now is the perfect time to elevate your automation pipelines with GitOps.

To help you get started, we’ve created detailed documentation and an amazing video playlist. These resources will guide you through the setup and best practices to maximize the potential of Kestra's Git integration.

### Ready to Unlock Your GitOps Superpowers?

- [Read the Documentation](https://kestra.io/docs/developer-guide/git): Dive into our comprehensive guides and learn how to implement and optimize your Git workflows with Kestra.
- [Watch the Video Playlist](): Follow our step-by-step video tutorials and get up to speed quickly your Git game!

---

Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
