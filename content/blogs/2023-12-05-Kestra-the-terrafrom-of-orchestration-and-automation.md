---
title: "Kestra: The Terraform of Automation and Orchestration"
description: Many people have recently been describing Kestra as Terraform for data pipelines. This post will elaborate on that aspect in terms of our approach towards workflow management and orchestration. While we want to offer Software and Data Engineers the same transformative impact as Terraform had on the world of infrastructure management, there are some differences in how we see the Everything as Code paradigm being applied to the world of workflow automation.
date: 2023-12-05T08:00:00
category: Company News
author:
  name: Emmanuel Darras
  image: "edarras"
image: /blogs/2023-12-05-Kestra-the-terrafrom-of-orchestration-and-automation.jpg
---

Many people have recently been comparing Kestra to Terraform, as both tools provide a declarative DSL to manage and automate workflows.

Terraform has had a transformative impact on DevOps, setting the standard for Infrastructure as Code (IaC). Kestra aims to bring a similar level of rigor and utility to the field of orchestration and automation, albeit with some differences in our approach.

This blog post will delve into how Kestra compares to Terraform in offering declarative workflow semantics and syntax.

<br>

## Declarative Language

![declarative](/blogs/2023-12-05-Kestra-the-terrafrom-of-orchestration-and-automation/declarative.png)

Like Terraform, which uses its HashiCorp Configuration Language (HCL) for declarative infrastructure management, Kestra employs a declarative YAML-based approach to define workflows.

### How it Works

This declarative approach means that you specify the *what*—the end state you desire—rather than the *how*—the steps to reach that state. For example, in Terraform you might specify that you want an AWS EC2 instance and a VPC but don't specify that the VPC needs to be created first; Terraform figures it out for you.

By defining workflows in a YAML-based configuration file, Kestra abstracts away the complexities of procedural code, thereby making it easier to create, understand, and maintain workflows. This also allows for simpler version control, streamlined debugging, and easier collaboration among team members.

### What it Allows

- **Abstraction**: Easier to write and understand.
- **Portability**: Workflow changes without changing the core logic.
- **Scalability**: More straightforward management of complex architectures.

### What it Changed

Before declarative languages, most infrastructure setups were done imperatively, requiring you to provide step-by-step instructions, which were error-prone and hard to manage at scale. With declarative languages, the abstraction level is higher, making infrastructure management more accessible, less error-prone, and quicker to deploy.

Kestra embodies the same philosophy for workflow orchestration. It transitions from Python-centric logic, which can be hard to deploy and maintain, to a more accessible API-first system that exposes a human-readable YAML syntax.

<br>

## Cloud-Agnostic and Language-Agnostic

![agnostic](/blogs/2023-12-05-Kestra-the-terrafrom-of-orchestration-and-automation/agnostic.png)

### Terraform's Cloud-Agnostic Approach

Terraform's provider plugins enable the tool to support a multitude of cloud service providers. This cloud-agnostic approach allows organizations to manage a diverse array of cloud resources, catering to multi-cloud strategies and reducing the risk of vendor lock-in.

### Kestra’s Language-Agnostic Flexibility

While Kestra uses YAML for workflow definitions, it offers the freedom to use any programming language for scripting tasks within those workflows. This language-agnostic capability allows developers to leverage their existing skills, whether it be in Python, R, Julia, or other languages.

<br>

## Event-Driven Philosophy

### How Events Drive Terraform

Even if Terraform is not commonly seen as an event-driven tool, its operations often align with event-driven paradigms when integrated into a broader architecture. In Terraform's operational mechanics, the internal dependency resolution acts like a micro-event-driven system. Resources await the "completion event" of their dependencies before they begin provisioning.

### Kestra's Native Event-Driven Nature

Kestra is built from the ground up to be an event-driven orchestration tool. Kestra can automatically initiate workflows based on:

- **Data Changes**: Reacting to changes in data stores or data states.
- **Scheduled Timings**: Like cron jobs, but supercharged with additional schedule conditions, backfills, and a friendlier syntax.
- **API Changes**: Being able to trigger or alter workflows based on incoming API requests gives a high level of adaptability and responsiveness to Kestra workflows.

Moreover, Kestra gives you control and visibility to manage complex workflows that can conditionally branch or loop, offering robust capabilities to handle complex event scenarios, whether they are scheduled, manual, or API-driven.

### Philosophical Synergy

At the core, both Terraform and Kestra represent a move towards automating responses to events, ranging from changes in code repositories to shifts in data or other external triggers. This enables:

- **Efficiency**: Automated reactions to events minimize manual interventions.
- **Consistency**: The behavior in response to specific events is predictable and version-controlled.
- **Flexibility**: An event-driven model can adapt to a wide variety of use cases and integrates easily with other tools and systems.

<br>

## Modularity and Reusability

Terraform's design is centered around modular constructs—modules—that allow for the compartmentalization of complex resources into reusable components. This modular design is further enhanced by a plugin system, empowering users to scale and customize their setups to meet varied project demands. These modules, coupled with Terraform's resource blocks, are engineered for high reusability, allowing customization and parameterization to suit differing scenarios, streamlining the management of multiple environments.

Kestra echoes this modular philosophy. With features like blueprints and subflows, it provides a structured approach to workflow creation that enhances reuse and maintenance. Kestra's subflows particularly stand out, as they enable parts of workflows to be reused across different processes, facilitating updates and changes within a single, centralized component.

<br>

## Scalability

![scalable](/blogs/2023-12-05-Kestra-the-terrafrom-of-orchestration-and-automation/scalable.png)

Both Kestra and Terraform are designed with scalability at their core, enabling organizations to expand their operations smoothly and efficiently.

### Scalability in Terraform
Terraform approaches scalability with infrastructure as code (IaC), which allows the automatic provisioning and management of a large number of resources across various cloud providers. The state management in Terraform is designed to handle large infrastructures with hundreds or even thousands of resources, efficiently tracking the state of each element. Additionally, Terraform's backend system can be configured to use remote state backends like AWS S3 with locking mechanisms like DynamoDB, enabling multiple team members to work collaboratively and securely on large infrastructures without conflict or overlap.

### Scalability in Kestra
Kestra is engineered to facilitate the scaling of workflow orchestration. It is capable of handling an increase in workload by enabling the distribution of tasks across multiple nodes. The event-driven architecture of Kestra ensures that as workflows become more complex or increase in number, the system can scale out horizontally. This means additional instances can be added to manage the load, and the distributed nature of Kestra means that workflows can run concurrently, efficiently using available resources.

Moreover, Kestra's API-first approach allows seamless integration with external systems and scalability across an organization's infrastructure. The declarative nature of the tool, combined with its ability to orchestrate and schedule workflows defined in YAML, allows for clear and concise workflow definitions that can be versioned and scaled along with the applications they support.

<br>

## Complementary Tools for Modern Infrastructure

Kestra's orchestration solutions align closely with the principles that have guided Terraform's infrastructure management. Both tools are designed with the intent to simplify, modularize, and make the workflow and infrastructure processes scalable and reusable.

[Our partnership with HashiCorp](https://kestra.io/blogs/2023-09-19-kestra-terraform-partnership) emphasizes that alignment. Our official Terraform provider, with over 210,000 downloads, is used successfully across hundreds of organizations.

Kestra Terraform provider allows you to manage all Kestra resources as code, just like you manage infrastructure. This "everything as code" approach not only streamlines workflow creation and deployment but also leverages Terraform's strengths in version control, collaboration, and auditing for your orchestration needs.

By combining these tools, you create a system managed entirely via code that's not only highly efficient but also scalable so that you can benefit from the modern infrastructure. Check our [documentation](https://kestra.io/docs/developer-guide/cicd/terraform) to learn how to manage all Kestra resources with Terraform.

Additionally, our recently launched [Terraform plugin](/plugins/plugin-terraform) allows you to orchestrate Infrastructure as Code by executing Terraform CLI commands directly from Kestra. Yes, you read that right — you can manage Kestra with Terraform, and you can also orchestrate Terraform with Kestra.

>To see how Kestra and Terraform can work together for your orchestration needs, check our [Terraform Provider page](https://kestra.io/use-cases/terraform-provider).


---
Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance. Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
