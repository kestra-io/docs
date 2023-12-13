---
title: "How to Solve Complex Orchestration Problems Without Adding More Complexity"
description: "Enter the labyrinth of orchestration silos and then, find a way out"
date: 2023-12-13T15:30:00
category: Solutions
author:
  name: Anna Geller
  image: "ageller"
image: /blogs/2023-12-13-breaking-orchestration-silos.jpg
---

Orchestration is about automated coordination — whether for deploying infrastructure, executing data workflows, or streamlining business processes. The goal is to guarantee a reliable sequence of steps while maintaining visibility into the who, what, when, and why of each operation.

At first glance it might look pretty simple, I want to move data from System A to System B. To do so, you write a script, then, you schedule and deploy it.

Over time, you get requests to integrate data from more and more systems.

With each new system, you need to write more scripts. And those scripts become increasingly interdependent. Now you also need to guarantee the correct sequence of execution, even if some of those scripts fail.

In this blog post we will dive on how we can break orchestrations silos.

## The Rise of Complexity

![Complexity](/blogs/2023-12-13-breaking-orchestration-silos/complexity.gif)

Let say you used AWS Lambda for your scripting deployement, it's serverless, and a go to solution for simple scripts.

Scheduled Lambda functions alone can NOT handle this increasing complexity.

To tackle this, you opt for AWS Step Functions, because that’s the default service to orchestrate Lambda. 

You go to the AWS console, and you configure the service to ensure that your lambda scripts execute in the right order.
With more and more requests, you realize that custom scripts to move data don’t scale. You adopt Airbyte for data ingestion and dbt for transformation to build scalable data pipelines, only to find that Step Functions (your orchestrator) falls short in supporting them.

So you decide to use a default data pipeline orchestrator for Airbyte and dbt, while sticking with Step Functions for Lambda scripts to avoid migration headaches. Over time, the same pattern keeps repeating every time someone ask to add more complexity. each new request leads to yet another default tool that works well—until it doesn't.

Before you know it, You're juggling all kinds of orchestrators:one for microservices, another one for data ingestion and goes on...


**That's what we mean by orchestration silos**

When each use case requires a dedicated orchestrator, the complexity keeps growing, until your platform is nearly impossible to maintain and understand. 

Users have their own diverse needs. If the tooling doesn’t support them, or is too complex, end users will find shortcuts and workarounds to find a solution that is aligned with how they work.

They will build hidden spreadsheets, CRON jobs, Zapier automations, or scheduled GitHub Actions scattered across repositories. 
We end up with orchestration silos without even knowing that they exist.

The example with growing complexity over time shows that we can't solve silos by adding more silos. In the same way, we can't solve complexity by adding more complexity. 

Hyper-specialized tools work great initially, but they fall short the moment you apply them to new, more advanced use cases.

## Escaping the Labyrinth of Orchestration Silos

How do we break free from these silos without creating new ones? The answer lies in user-centric orchestration:

To solve silos without creating new ones, we meet users where they are. We ask them how they want to work.

- **User-Centric Approach:** Aligning tooling with how end-users work is crucial. Whether they prefer coding in an IDE or seek the simplicity of UI-driven workflows, the solution should cater to these preferences.

- **Kestra's Versatile Platform:** Kestra harmonizes user needs with the efficiency of orchestration. It allows for the creation of data pipelines through both a user-friendly UI and as code, offering the best of both worlds.

- **Empowering Users with Choices:** Users can leverage Kestra's VS Code extension for autocompletion and validation or disable the built-in code editor in production for CI/CD-led deployments. The UI, far from being an afterthought, is treated as a firt class citizen for creating and managing pipelines.

All data pipelines, created via UI, generate human-readable YAML configuration files, which are organized into namespaces and automatically versioned, just as you would with Git. 

You keep the advantages of workflows as Code without the pain of dependency management and deployments..

Since both engineers, and end-users they support, can work on the same platform as equals, you can prevent new silos, and enable Everything as Code and from the UI.

## Integrations Possibilities

To meet users where they are and remove the need for new silos, kestra easily integrates with tools you already know and love. Because each plugin is a single binary file, there’s no package dependency hell, even without using Docker.

These integrations reduce the complexity of orchestration, and in combination with blueprints, they enable hundreds of use cases out of the box.

And thanks to the open-source contributions, the list of supported plugins keeps growing with every new release.

## What's Next

We can't solve complexity by adding more complexity. Instead, we should favor tools that meet users where they are and adapt to your evolving needs.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [⭐️ GitHub star](https://github.com/kestra-io/kestra) and join [🫶 the community](https://kestra.io/slack).


