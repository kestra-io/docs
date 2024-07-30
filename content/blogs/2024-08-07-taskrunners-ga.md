---
title: Task Runners are now Generally Available and Ready to Handle Your Most Demanding Workflows
description: Run your code anywhere with dynamically-provisioned resources.
date: 2024-08-07T13:00:00
category: News & Products Updates
author:
  name: Anna Geller
  image: ageller
image: /blogs/2024-08-07-taskrunners-ga.png
---

We are thrilled to announce the general availability of Task Runners, a major addition to Kestra's orchestration capabilities, allowing you to offload resource-intensive tasks to on-demand compute services. With task runners, you can guarantee that your workloads have enough resources while reducing compute costs.

## What are Task Runners

Task Runners is an extensible, pluggable system capable of executing your tasks in arbitrary remote environments. All you have to do to offload your task execution to a remote environment is to specify the `taskRunner` type in your task configuration. You can build a custom plugin to run your tasks in any environment you wish, or you can use one of the managed plugins offered by [Kestra](https://kestra.io/), such as AWS Batch, Azure Batch, Google Batch, or Kubernetes.

Many data processing tasks are computationally intensive and require a lot of resources (such as CPU, GPU, and memory). Instead of provisioning always-on servers, Task Runners can run your code on dynamically provisioned compute instances in the cloud, such as AWS ECS Fargate, Azure Batch, Google Batch, auto-scaled Kubernetes clusters, and more.


## From Beta to General Availability

We introduced task runners in Beta in Kestra 0.16.0, and since then, we've been improving their performance, stability, and usability. Among others, we've added the capability to terminate remote workers when the execution is canceled from the UI, integrated Task Runners into additional CLI and script plugins, improved file handling and recovery from failure in remote compute environments, and documented the feature extensively.

Thanks to the feedback from over 80 users and a large number of enhancements and bug fixes, Task Runners are now generally available and ready for production use at scale. **We are immensely grateful to all our beta testers** for their valuable input and suggestions.

*“Our pipelines were faster in GCP Batch service compared to Cloud Run Jobs, and they used even less memory and CPU. I attribute this to the simplified code, and simplified design of how Kestra Task Runners only poll VMs as a whole.” -* [Jack P., Data Engineer at Foundation Direct](https://jackskylord.medium.com/kestra-io-powerful-declarative-workflows-1dc79bce0b69)

## Key Benefits of Task Runners

Task Runners empower you with **fine-grained resource allocation**, ensuring that you can precisely adjust CPU, memory, and GPU needed for any given task. With support for multiple cloud environments such as AWS ECS Fargate, Azure Batch, Google Batch, and Kubernetes, Task Runners ensure flexibility and prevent vendor lock-in.

One of the key benefits of Task Runners is their ability to run the same business logic in different environments without changing anything in your code. This significantly **speeds up the development process** and **simplifies the transition from development to staging and production environments**.

Whether you are developing locally in Docker or running production workloads in Kubernetes, Task Runners offer a **consistent API**, requiring **no changes to your business-logic code** when moving your workflows from development to production. And with the centralized configuration through `pluginDefaults`, you can manage your task runner configuration and credentials in a single place for each environment without duplication.

## Next steps

Embrace the scalability of dynamically provisioned resources with Task Runners, now fully equipped to handle your most demanding data processing workflows.

Try Task Runners in [Kestra 0.18.0](https://kestra.io/docs/getting-started/installation) today and let us know what you think.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](https://kestra.io/slack).

