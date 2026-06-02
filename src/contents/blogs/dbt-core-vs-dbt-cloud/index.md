---
title: "dbt Core vs. dbt Cloud: Key Differences & How to Choose"
description: "Compare dbt Core vs. dbt Cloud to understand their key differences. Discover which solution best fits your data team's needs, whether you prioritize control or convenience."
metaTitle: "dbt Core vs. dbt Cloud: Differences & Choice Guide"
metaDescription: "Compare dbt Core vs. dbt Cloud to understand their key differences. Discover which solution best fits your data team's needs, from self-hosting to managed platforms. Read more!"
date: 2026-05-20T13:00:00
category: Solutions
tag: "Data Orchestration"
author:
  name: Elliot Gunn
  linkedin: https://www.linkedin.com/in/elliotgunn/
  image: egunn
  role: Product Marketing Manager
image: ./main.jpg
faq:
  - question: "What is dbt Cloud?"
    answer: "dbt Cloud is a fully managed, cloud-hosted SaaS platform that provides a complete environment for developing, testing, and deploying dbt projects. It includes a web-based IDE, a scheduler, logging, and collaboration features, all built on top of the open-source dbt Core engine. It's designed for teams seeking convenience, scalability, and an all-in-one solution without managing infrastructure."
  - question: "What is dbt Core?"
    answer: "dbt Core is the open-source command-line tool that forms the foundation of all dbt offerings. It allows data professionals to transform data in their warehouse using SQL-based models, tests, and documentation. dbt Core provides maximum flexibility and control, requiring users to manage their own development environment, scheduling, and infrastructure."
  - question: "Is dbt Core free to use?"
    answer: "Yes, dbt Core is entirely free and open-source under an Apache 2.0 license. Users only incur costs for the infrastructure they use to run it (e.g., cloud compute, data warehouse usage, separate orchestrator). It's ideal for teams who want full control and are comfortable with self-managing their environment."
  - question: "Is dbt Cloud free?"
    answer: "dbt Cloud offers a Developer plan which is free for individual users, allowing limited access to its features. For teams and production use, dbt Cloud operates on a subscription model with paid tiers that offer more users, advanced features, and increased job concurrency. While there's a free entry point, robust team usage requires a paid subscription."
  - question: "What are the main differences between dbt Core and dbt Cloud?"
    answer: "The primary differences lie in infrastructure management, development environment, scheduling, and collaboration. dbt Core is self-hosted, requiring manual setup for everything, offering full control. dbt Cloud is a managed SaaS, providing an integrated IDE, scheduler, and collaboration tools out-of-the-box, simplifying operations at the cost of some flexibility."
  - question: "Who manages the infrastructure around dbt Core vs. dbt Cloud?"
    answer: "With dbt Core, your team is responsible for managing all underlying infrastructure, including development environments, orchestrators, and compute resources. For dbt Cloud, dbt Labs manages the platform's infrastructure, handling the web IDE, scheduler, and other services, allowing your team to focus solely on data transformation logic."
---

If your team runs dbt, the question comes up fast: dbt Core or dbt Cloud? Both run the same underlying transformation engine, so the choice isn’t about SQL models or testing logic. It’s about where you want to own operational complexity. In practice, the decision usually hinges on one question: do your dbt jobs stay entirely within dbt, or do they need to connect to other tools in your stack?

I’ll compare both options across infrastructure management, development environment, scheduling, collaboration, and cost, then offer a framework for making the call based on your team’s context.

## Understanding dbt Core and dbt Cloud

At its heart, dbt is a transformation engine that allows you to build, test, and document data models using SQL. The choice between Core and Cloud isn't about the transformation logic itself, but about how you operationalize it.

### What is dbt Core? The open-source engine

dbt Core is the open-source, command-line tool that started it all. It provides the fundamental capabilities to compile SQL `SELECT` statements into tables and views in your data warehouse. With dbt Core, you have a powerful framework for modular data modeling, automated testing, and documentation generation.

Because it's a CLI tool, dbt Core gives you complete control. You are responsible for setting up your development environment, managing dependencies, and scheduling job runs. This typically involves integrating it with other tools like a version control system (Git), a local IDE (like VS Code), and an external [orchestrator to run dbt Core in production](/blogs/2026-03-09-dbt-core-with-kestra). The [dbt CLI plugin](/plugins/plugin-dbt/dbt-cli) is the engine that executes your `dbt run` or `dbt build` commands.

### What is dbt Cloud? The managed platform

dbt Cloud is a commercial SaaS platform built on top of dbt Core. It provides a comprehensive, web-based solution that handles not just the transformation but also the entire development and deployment lifecycle. It includes a browser-based IDE, a built-in scheduler, seamless Git integration, CI/CD automation, and tools for collaboration and documentation hosting.

With dbt Cloud, the focus shifts from managing infrastructure to building data models. It's an all-in-one solution designed to accelerate development and simplify operations for data teams. While it offers less direct control over the underlying environment, it significantly reduces the operational burden. Even with its built-in scheduler, many teams find they need a more robust solution for [orchestrating dbt Cloud jobs](/blogs/2026-03-26-using-dbt-cloud-with-kestra) as part of a larger [ETL pipeline with tools like Airbyte](/blueprints/airbyte-cloud-dbt-cloud).

## Core differences: dbt Core vs. dbt Cloud

The decision between dbt Core and dbt Cloud hinges on several key trade-offs. Here's a side-by-side summary before we break each one down.

| Dimension | dbt Core | dbt Cloud |
| --- | --- | --- |
| **License & cost** | Open-source (Apache 2.0), free | Free Developer tier, paid Team/Enterprise plans |
| **Hosting** | Self-managed (your infra) | Fully managed SaaS |
| **Development environment** | Local IDE (VS Code, PyCharm) + CLI | Web-based IDE with Git integration |
| **Scheduler** | None (bring your own orchestrator) | Built-in scheduler + API triggers |
| **CI/CD** | Self-built via GitHub Actions, GitLab CI, etc. | Native CI checks on pull requests |
| **Collaboration** | Git workflows, self-hosted docs | Shared environment, dbt Explorer, hosted docs |
| **Security & governance** | DIY (auth, secrets, access control) | RBAC, SSO, audit logs out-of-the-box |
| **Observability** | Provided by your orchestrator | Built-in job monitoring + metadata API |
| **Best for** | Engineering-heavy teams needing full control | Teams optimizing for speed and low ops overhead |
| **Operational overhead** | High | Low |

### Infrastructure management and hosting

- **dbt Core**: You manage everything. This includes provisioning the compute resources to run dbt, setting up Python environments, and maintaining the scheduler. Teams often manage this stack using [Infrastructure as Code](/resources/infrastructure/what-is-infrastructure-as-code) principles, treating dbt as one component in a larger self-managed ecosystem. The model offers maximum flexibility for complex [multi-cloud orchestration](/resources/infrastructure/multi-cloud-orchestration) or strict security environments, but it means higher operational overhead.
- **dbt Cloud**: It’s a fully managed SaaS platform. dbt Labs handles all the infrastructure, including hosting, scaling, and maintenance. This convenience allows your team to focus on analytics engineering rather than [infrastructure automation](/resources/infrastructure/automation).

### Development environment and tooling

- **dbt Core**: Developers use their preferred local IDE (e.g., VS Code, PyCharm) and command-line tools. This is ideal for engineers who are comfortable with a traditional software development workflow and want to customize their environment. All changes are managed through a standard [Git workflow](/docs/best-practices/git), or synced directly from Git into [Kestra's built-in code editor](/docs/how-to-guides/dbt).
- **dbt Cloud**: It features a web-based IDE that comes pre-configured with Git integration. This provides a consistent and accessible development environment for all team members, regardless of their local setup. It lowers the barrier to entry and simplifies onboarding.

### Scheduling and orchestration capabilities

- **dbt Core**: It has no built-in scheduler. To run dbt Core jobs in production, you must use an external [orchestrator](/resources/data/orchestrator). This gives you the flexibility to choose a tool that fits your entire stack, enabling you to build complex dependencies between dbt jobs and other processes.
- **dbt Cloud**: It includes an integrated scheduler that can run jobs on a schedule, trigger runs via API, or run CI checks on pull requests. This is sufficient for workflows that are entirely contained within dbt. For more complex [data orchestration](/resources/data/data-orchestration) involving multiple tools, you might still need an external orchestrator to call the dbt Cloud API. Kestra provides [plugins for both dbt Core and dbt Cloud](/plugins/plugin-dbt).

### Collaboration features

- **dbt Core**: Collaboration relies on standard software development practices like Git pull requests and code reviews. Documentation is generated locally and must be hosted separately.
- **dbt Cloud**: Collaboration is a core feature. It offers a shared development environment, automatically generated documentation hosting (dbt Explorer), and metadata integration. This makes it easier for teams to work together, review code, and understand data lineage.

### Security, governance, and access control

- **dbt Core**: Security is entirely your responsibility. You must configure authentication, manage credentials for your data warehouse, and set up any access controls yourself.
- **dbt Cloud**: It provides enterprise-grade security features out-of-the-box, including role-based access control (RBAC), SSO integration, and audit logs. This simplifies [governance and security management](/docs/enterprise/governance), especially for larger organizations.

### Pricing and cost considerations

- **dbt Core**: The software is free and open-source. The costs are associated with the infrastructure you use to run it (compute instances, data warehouse usage, orchestrator licensing).
- **dbt Cloud**: It offers a free Developer tier for individuals. For teams, it’s a subscription-based service with paid tiers based on the number of developer seats and features. While there’s a subscription fee, it can be offset by reduced infrastructure and operational costs.

## When to choose which dbt solution

Teams often get this wrong in one of two directions: choosing dbt Core for cost reasons and discovering six months in that they've built a fragile orchestration layer that costs more in engineering hours than a dbt Cloud subscription would have, or choosing dbt Cloud and finding its scheduler too limited once pipelines cross tool boundaries.

### Ideal use cases for dbt Core

Choose dbt Core if your team:
- **Has strong engineering expertise**: Comfortable with the command line, Git, and managing infrastructure.
- **Requires maximum control and customization**: Needs to run dbt in a specific environment or integrate it deeply with custom tooling.
- **Has an existing orchestration platform**: Already uses a powerful orchestrator like Kestra to [manage dbt jobs](/blogs/2024-04-02-dbt-kestra) and can easily add dbt as another step.
- **Is on a tight budget**: Wants to avoid subscription fees and has the engineering resources to manage the infrastructure. A good example is running [dbt transformations on DuckDB from Git](/blueprints/dbt-duckdb) for a low-cost setup.

### Ideal use cases for dbt Cloud

Choose dbt Cloud if your team:
- **Wants to move fast and reduce operational overhead**: Prefers to focus on building models rather than managing infrastructure.
- **Is growing or has mixed technical skills**: Benefits from a user-friendly web IDE and integrated tools that simplify onboarding.
- **Needs robust collaboration features**: Requires a centralized platform for development, code reviews, and documentation.
- **Prioritizes integrated CI/CD and observability**: Wants out-of-the-box continuous integration checks and job monitoring. For more details, see how to [orchestrate dbt workflows](/docs/use-cases/dbt).

## Making your decision: key factors to consider

Four factors tend to drive the decision:

### Team size and technical expertise

Smaller, highly technical teams may find the control of dbt Core appealing. Larger teams or those with a mix of analysts and engineers often benefit from the structured, collaborative environment of dbt Cloud.

### Project complexity and scalability needs

For simple projects, the overhead of setting up dbt Core with an orchestrator might be unnecessary. As your projects grow in complexity with more models, dependencies, and developers, the managed environment and CI/CD features of dbt Cloud become increasingly valuable.

### Budget and resource availability

Calculate the Total Cost of Ownership (TCO). For dbt Core, factor in the cost of engineering time for setup and maintenance. For dbt Cloud, weigh the subscription fee against the productivity gains and reduced operational burden.

### Integration with existing data stack

Where dbt sits in your end-to-end [data pipeline](/resources/data/data-pipeline) shapes the answer, and for most teams at scale, this factor alone determines the call. Do you need to trigger dbt jobs after an ingestion tool runs? Do you need to run [data quality](/resources/data/data-quality) checks or trigger a [reverse ETL](/resources/data/reverse-etl) sync after dbt models are updated? Your integration needs will influence whether a simple built-in scheduler is sufficient or if a more powerful, universal orchestrator is required. This is where a platform for [modern data engineers](/data) can unify your stack.

## How Kestra complements both dbt Core and dbt Cloud

Regardless of your choice, a universal orchestration platform like Kestra can enhance your dbt workflows. Because Kestra is language- and tool-agnostic, it can manage dependencies across your entire data stack.

**For dbt Core users**, Kestra provides the missing scheduling and operational layer. You can define your entire ELT workflow in a single declarative YAML file, from running [parallel Airbyte syncs to triggering dbt Core transformations](/blueprints/airbyte-sync-parallel-with-dbt). Kestra's event-driven triggers and 1300+ plugins let you build resilient, production-grade pipelines around dbt Core. For a full walkthrough of Git sync, task runners, and the code editor setup, see [building scalable dbt workflows with Kestra](/blogs/2024-10-08-dbt-kestra).

```yaml
id: dbt-core-run
namespace: company.team
tasks:
  - id: git-clone
    type: io.kestra.plugin.git.Clone
    url: https://github.com/your-org/dbt-project.git
    branch: main
  - id: dbt-build
    type: io.kestra.plugin.dbt.cli.DbtCLI
    runner: DOCKER
    commands:
      - dbt build
```

**For dbt Cloud users**, Kestra extends orchestration beyond the transformation layer. While dbt Cloud can run its own jobs, Kestra can manage the entire [end-to-end data flow](/blogs/2023-06-26-end-to-end-data-orchestration). You can use Kestra to trigger an ingestion job, call the [dbt Cloud API](/plugins/plugin-dbt/dbt-cloud) to run a transformation, and trigger a reverse ETL sync, all tracked in a single observable workflow.

## Conclusion: transformation framework vs. platform

The choice between dbt Core and dbt Cloud is a classic trade-off between control and convenience.

- **dbt Core** is a powerful, flexible transformation framework that puts you in complete control of your environment. It’s best for teams with the engineering capacity to build and manage their own data platform.
- **dbt Cloud** is a comprehensive platform that streamlines the entire analytics engineering lifecycle. It’s ideal for teams who want to maximize productivity and minimize operational overhead.

Whichever you choose, dbt is one piece of a larger data stack. As your pipelines grow to include ingestion, data quality checks, and downstream syncs, you’ll want an orchestrator that can manage the full flow, not just the transformation step.

To learn more about building and orchestrating data workflows, explore our [Data Engineering Resources](/resources/data) and see how you can build more reliable [data pipelines with Kestra](/data).
