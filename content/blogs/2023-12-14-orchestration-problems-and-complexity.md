---
title: "How to Solve Complex Orchestration Problems Without Adding Complexity"
description: "Orchestration problems always start simple, but then they grow into unmaintainable systems with workflow and data silos. How to avoid it? Find out in this post."
date: 2023-12-14T11:30:00
category: Solutions
author:
  name: Anna Geller
  image: "ageller"
image: /blogs/2023-12-14-orchestration-problems-and-complexity.png
---

Orchestration is critical for any organization that wants to automate and scale its operations. Many teams start with simple scripts deployed with serverless functions only to realize that such an approach doesn't scale as new use cases emerge.

This post presents how to solve the problem of orchestration without adding more complexity to your system as your use cases inevitably evolve. We'll demonstrate how [Kestra](https://github.com/kestra-io/kestra) simplifies orchestration by enabling _Everything as Code_ and _Everything from the UI_.


## The Simplicity Trap

Orchestration typically starts with a simple objective: schedule data workflows, automate infrastructure deployments, or coordinate a business process. Initially, ad-hoc scripts and serverless functions seem adequate — they're easy to set up and deploy. However, this simplicity can be deceptive, as it hides the inherent dependencies between processes, systems and teams.


## The Rise of Complexity

As more systems and services get integrated, your evolving use cases outgrow the capabilities of your initial orchestration solution. As a result, your organization adopts new specialized tools to meet these needs. These tools often have their own embedded orchestration capabilities. This leads to the formation of silos, as each tool, while effective in its domain, contributes to the growing complexity and fragmentation. Observability, dependency management and troubleshooting become increasingly difficult, making your system nearly impossible to maintain and understand.

![Complexity](/blogs/2023-12-14-orchestration-problems-and-complexity/complexity.gif)


## How to Solve Complexity Without Adding Complexity

Adding more layers of complexity to an already complex system only makes things worse. A more reasonable approach is to simplify and unify by committing to a solution that can adapt to your evolving needs and meet users where they are.

At Kestra, we believe that solving complex orchestration challenges requires a balanced approach that combines the **simplicity** of building workflows from the **UI** with the **flexibility** of **code** that you can write in your favorite IDE in your preferred programming language. By focusing on these aspects, organizations can build manageable and scalable systems without falling into the trap of accidental complexity.

### Everything as Code AND from the UI

Kestra allows users to work in their preferred environment, whether coding from a local IDE or building flows from the UI. This approach also helps maintain consistency and control over the workflows, as the configurations done via UI are translated into declarative code, which is automatically versioned.

Kestra UI offers an embedded code editor allowing you to seamlessly orchestrate business logic written in any language without the pain of packaging and deploying code. The embedded editor helps you write workflow code that follows best practices thanks to autocompletion, code autoformatting, built-in documentation, verified blueprint examples and continuous syntax validation powered by Kestra's [open-source VS Code extension](https://marketplace.visualstudio.com/items?itemName=kestra-io.kestra).

![code](/blogs/2023-12-14-orchestration-problems-and-complexity/editor.png)

For business users, Kestra offers UI forms allowing to build workflows without requiring a programming experience. These UI-created pipelines generate human-readable YAML configuration files, organized into namespaces and automatically versioned, just as you would with Git.

If that's your preference, you can make the built-in code editor and UI forms read-only. This is useful in production environments that rely on CI/CD-based deployments. Alternatively, you can use the [Git plugin](/plugins/plugin-git/) to ensure that Kestra always uses the latest version of your code from your custom repository, keeping Git as the single source of truth for your workflows.


### Preventing New Silos

To solve silos without creating new ones, Kestra meets users where they are.

⚡️**The product adapts to how you work:** Whether you prefer building your workflows in a local code IDE or directly from the UI, Kestra adapts to your preferences.

⚡️**Everything is managed as code, always:** By allowing engineers and domain experts to work on the same platform, Kestra prevents the formation of new silos that naturally emerge when tooling is too complex for less technical users. Instead of having to rely on spreadsheets or no-code automation software, all stakeholders are equally empowered — each pipeline built from the UI results in declarative, automatically versioned code rather than generating siloed solutions. We believe this aspect of empowering everyone in the organization through a declarative interface is critical in eliminating silos.


### Integrations Ecosystem

To meet users where they are and remove the need for new silos, Kestra integrates with tools you already know and love. Because each plugin is a single binary file, there’s no package dependency hell, even without relying on Docker (_Docker is supported but not required_). These integrations reduce the complexity of orchestration, and in combination with blueprints, they enable hundreds of use cases out of the box.

Thanks to the open-source contributions, the list of supported plugins keeps growing with every new release. You can check the [list of supported plugins](/plugins/) to see if your favorite tool is already supported. If not, you can [build your own](https://kestra.io/docs/plugin-developer-guide) in minutes.

![ui](/blogs/2023-12-14-orchestration-problems-and-complexity/ui.png)


## Next Steps

Building reliable data platforms doesn't need to involve adding more layers of complexity. Solving complex orchestration challenges requires a balanced approach that combines simplicity, flexibility, and user-centric design. Kestra offers a simple yet flexible platform that adapts to your evolving needs and makes orchestration an enabler of automation rather than a source of frustration and silos.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [⭐️ GitHub star](https://github.com/kestra-io/kestra) and join [🫶 the community](https://kestra.io/slack).
