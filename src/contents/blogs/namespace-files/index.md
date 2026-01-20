---
title: "Namespace Files in Kestra: Reusable Logic Without Losing Control"
description: Kestra’s Namespace Files let you reuse code and config across workflows without giving up structure, security, or speed.
date: 2025-05-20T13:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: mproset
  role:
image: ./main.png
---
Engineering teams all face a familiar dilemma: strike the right balance between central governance and team autonomy or risk chaos. Centralization slows everyone down. Decentralization breeds inconsistency and risk. Most orchestration platforms force you to pick a side. **Kestra doesn’t.** Inspired by infrastructure best practices like Kubernetes, Kestra brings logical isolation, inheritance, and secure reusability to orchestration through a powerful feature called **Namespace Files**.

They let you define and share custom scripts, templates, and configuration files directly within your Kestra namespaces so each team can build and operate independently, without duplicating logic or bypassing governance. It’s a simple concept with a massive impact. Let’s break it down.

They let you define and share custom scripts, templates, and configuration files directly within your Kestra namespaces so each team can build and operate independently, without duplicating logic or bypassing governance. It’s a simple concept with a massive impact. Let’s break it down.

## Namespaces: A Proven Pattern from Infrastructure

Other engineering disciplines solved similar problems decades ago. In 2002, Linux introduced namespaces—logical boundaries that allow multiple applications to securely share resources without interference. Kubernetes later adopted namespaces, enabling teams to share cluster infrastructure with clear governance through inheritance and hierarchical policy management.

Yet, despite namespaces' success in software infrastructure, orchestration tools have mostly overlooked their potential until now.

![split](./split.jpg)

## How Kestra Leverages Namespaces

Kestra brings this proven best practice into data and workflow orchestration. By adopting namespaces, Kestra allows you to logically organize and secure your workflows just like Kubernetes does for containers.

Here’s how it works:

- **Hierarchical Organization:**

    Workflows and resources are structured within namespaces, which can be infinitely nested using dot-separated naming (e.g., `company.team.project`).

- **Shared Resources:**

    Store shared workflows, secrets, scripts, and configurations at higher-level namespaces (e.g., `company`), automatically available to child namespaces (`company.team`, `company.team.projectA`).

- **Inheritance and Overrides:**

    Child namespaces inherit configurations (e.g., credentials, variables, plugins) from their parents. Teams can override non-mandatory settings, balancing central control with local flexibility.

- **Secure Isolation:**

    Dedicated secrets, variables, and even storage buckets can be managed at each namespace level. Worker groups can also be assigned for physical isolation if needed.


## Namespace Files in Kestra

<div style="position: relative; padding-bottom: calc(48.95833333333333% + 41px); height: 0; width: 100%;"><iframe src="https://demo.arcade.software/o0JhnzDc0tRNlNu5AIUR?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Namespaces | Kestra" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

One standout Kestra feature is **Namespace Files**. These are custom scripts, code snippets, or configuration files stored within namespaces, ready to be reused across multiple workflows. This dramatically simplifies collaboration and speeds up workflow development.

For instance, you could store common Python scripts or SQL templates at the `company.team` namespace, instantly accessible and reusable by any project (`company.team.projectA`, `company.team.projectB`) within that team.

## Namespaces Work at Scale

Namespaces effectively balance centralized governance with team-level autonomy through inheritance. Root-level credentials, RBAC permissions, and security configurations propagate consistently, ensuring compliance and security. Simultaneously, individual teams can quickly adjust or add specific settings, maintaining agility and responsiveness.

By following this pattern, teams avoid the chaos that often comes with scaling, no fragmentation, no cumbersome monoliths—just a clear, secure, manageable structure.

## Benefits at a Glance

- ✅ **Reduced Complexity:** Central configurations eliminate redundant setup.
- ✅ **Enhanced Security:** Fine-grained RBAC and secrets management.
- ✅ **Team Autonomy:** Local overrides empower teams without sacrificing governance.
- ✅ **Rapid Innovation:** Shared namespace files streamline workflow development.



## Ready to Try It?

 Namespace Files make it easy to scale orchestration without chaos. Reuse scripts, enforce standards, and give teams the flexibility they need—all from a single, organized structure.

- 👉 Explore the [Namespace Files documentation](../../docs/06.concepts/02.namespace-files/index.md)
- 📺 Watch our [walkthrough on YouTube](https://youtu.be/BeQNI2XRddA)

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
