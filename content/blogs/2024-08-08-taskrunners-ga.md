---
title: Task Runners are now Generally Available and Ready to Handle Your Most Demanding Workflows
description: Run your code anywhere with dynamically-provisioned resources.
date: 2024-08-08T13:00:00
category: News & Products Updates
author:
  name: Anna Geller
  image: ageller
image: /blogs/2024-08-08-taskrunners-ga.png
---

We are thrilled to announce the general availability of Task Runners, a major addition to Kestra's orchestration capabilities, allowing you to offload resource-intensive tasks to on-demand compute services. Task runners guarantee that your workflows have enough resources while reducing compute costs.

## Why Task Runners?

Many data processing tasks are computationally intensive and require a lot of resources (such as CPU, GPU, and memory). Instead of provisioning always-on servers, Task Runners can execute your code on dynamically provisioned containers in the cloud, such as AWS ECS Fargate, Azure Batch, Google Batch, Google Cloud Run, auto-scaled Kubernetes clusters, and more.

## What are Task Runners

[Task Runners](../docs/task-runners/index.md) is an extensible ecosystem of plugins capable of executing your tasks in arbitrary remote environments. All you have to do to offload data processing to a remote environment is to specify the `taskRunner` type in your task configuration.

You can either build a custom plugin to run your tasks in any environment you wish, or you can use one of the **managed plugins** offered in Kestra Enterprise or Kestra Cloud, such as AWS Batch, Azure Batch, Google Batch, Google Cloud Run, or Kubernetes.

![task_runner_plugins](/blogs/2024-08-08-taskrunners-ga/task_runner_plugins.png)

## From Beta to General Availability

We introduced task runners [in Beta in Kestra 0.16.0](./2024-04-12-release-0-16.md), and since then, we've been improving their performance, stability, and usability. Among others, we've added the capability to **terminate remote workers when the execution is canceled from the UI**, integrated Task Runners into **additional CLI and script plugins**, improved **file handling** and **recovery from failures** in remote compute environments, and documented the feature extensively.

Thanks to feedback from over 80 users and many enhancements and bug fixes, Task Runners are now generally available and ready for production use at scale. **We are grateful to all our Beta testers** for their valuable input and suggestions.

> “Our pipelines were faster in GCP Batch service compared to Cloud Run Jobs, and they used even less memory and CPU. I attribute this to the simplified code, and simplified design of how Kestra Task Runners only poll VMs as a whole.” — [Jack P., Data Engineer at Foundation Direct](https://jackskylord.medium.com/kestra-io-powerful-declarative-workflows-1dc79bce0b69)

## Key Benefits of Task Runners

### Fine-grained resource allocation

Task Runners empower you with **fine-grained resource allocation**, ensuring that you can precisely adjust the CPU, memory, and GPU needed for any given task. With built-in support for multiple cloud providers and the ability to build custom plugins for any environment, Task Runners give you full flexibility to evolve your infrastructure as your needs change over time.

### Fast development with autocompletion, built-in documentation and blueprints

Thanks to the built-in documentation and autocompletion, building workflows with Task Runners is easy and fast. When you add a specific `taskRunner` to your workflow in the Code Editor, its documentation appears on the right side of the screen, providing immediate access to all available properties and usage examples. Additionally, the syntax validation helps you gain confidence that your task runner configuration is correct before you run it.

To help you get started, we've created several pre-built workflow templates. Many of them include automated deployment of IAM roles and other required Cloud services to quickly set up the Task Runner that matches your environment. The [blueprint example below](https://kestra.io/blueprints/aws/225-run-multiple-python-scripts-in-parallel-on-aws-ecs-fargate-with-aws-batch) automates the setup of an AWS Batch environment to run multiple containerized Python scripts on AWS ECS Fargate.

![task_runner_blueprints](/blogs/2024-08-08-taskrunners-ga/task_runner_blueprints.png)

### From development to production

One of the key benefits of Task Runners is their ability to run the same business logic in different environments without changing anything in your code. This significantly **speeds up the development process** and **simplifies the transition from development to staging and production environments**.

### Consistent API with centralized configuration

Whether you are developing locally in Docker or running production workloads in Kubernetes, Task Runners offer a **consistent API**, requiring **no changes to your business logic code**. Thanks to `pluginDefaults`, you can manage your task runner configuration and credentials in a single place for each environment without code duplication.

::alert{type="info"}
Check the video below summarizing the key benefits of Task Runners.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/edYa8WAMAdQ?si=2vu6XPUUeTQziWNq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
::

## Next steps

Embrace the scalability of dynamically-provisioned resources with Task Runners, now fully equipped to handle your most demanding data processing workflows.

To help you get started, we prepared extensive [How-To Guides](../docs/15.how-to-guides/index.md), [Blueprints](https://kestra.io/blueprints) and [Video Tutorials](https://www.youtube.com/playlist?list=PLEK3H8YwZn1pbL_nRKDqE3s7J8os_yc31) on how to use Task Runners. The videos linked below will guide you through the process of setting up a Task Runner for your chosen cloud provider.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/N-Bq-TWqxiw?si=2u4_xmm2vLivKLPO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/U2TzypTbpI8?si=64eTuk-QhnGVU_3s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/nHzgPFbXIxY?si=TPh03i4XmRHNeW-b" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/kk084vVyZDM?si=TF7SqVaDUrwSX4uy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/pxN8sCreUAA?si=u5nEZG2TrklFef8a" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/CC_CnH74qnk?si=_Pq-GBV2UadYlKxE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

Try Task Runners in [Kestra 0.18.0](../docs/01.getting-started/01.quickstart.md) today and let us know what you think!

- If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).
- If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).

