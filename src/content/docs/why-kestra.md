---
title: Why Kestra
description: "A Simpler, More Powerful Way to Orchestrate Everything"
hideSidebar: true
---

How We See the Orchestration and Automation Market

Most orchestration solutions fall into one of two extremes.

On one side are code-centric frameworks like Apache Airflow, which can offer flexibility but come with a steep learning curve and large operational overhead. Before you can run your first workflow, you have to set up cumbersome infrastructure, learn complex frameworks, and deal with confusing deployment patterns.

On the other side, drag-and-drop automation tools like Zapier are easier to start with. They come with prebuilt integrations, there's no heavy infrastructure to manage, and they require no coding skills. But as soon as you need something custom (like running a Python script in a container), these tools hit a wall.

This creates a trade-off, forcing organizations to choose between flexible but complex developer tools or simple but inflexible drag-and-drop automation platforms. If you pick a code-first approach, you have to invest significant engineering resources to maintain the codebase, infrastructure, and deployment processes. If you pick a no-code tool, you outgrow it fast and start building shadow IT with workarounds. Mixing both can create chaos and confusion — each team builds their own silos, and soon nobody knows which workflows run where.

Kestra bridges this market gap. It combines the flexibility of code-based orchestration with a no-code interface that anyone can learn in minutes. This means your teams can start simple and scale up to complex distributed pipelines—all within a single, unified platform.

## Meet Kestra: A Simple Orchestration Platform for Everyone

Kestra combines full-code, low-code, and no-code in one place. It’s simple enough for non-developers to start building basic workflows, yet powerful enough to handle massive data pipelines or distributed processes.

Kestra was built to provide a single source of truth for the entire business. You can schedule a small daily script or orchestrate a multi-step, event-driven pipeline. In both cases, you don’t need separate tools or complex infrastructure.

## What Is Kestra?

Kestra is an open-source orchestration platform that:

- Lets you define workflows declaratively in YAML
- Allows non-developers to automate tasks with a no-code interface
- Keeps everything versioned and governed, so it stays secure and auditable
- Extends easily for custom use cases through plugins and custom scripts.

Kestra follows a “start simple and grow as needed” philosophy. You can schedule a basic workflow in a few minutes, then later add Python scripts, Docker containers, or complicated branching logic if the situation calls for it.

## How Kestra Solves Common Problems

### 1. Focus on Business Logic, Not Plumbing

With Kestra, flows are written in simple YAML. You can use one of over 500 built-in plugins or create tasks in any language—Python, Node.js, Go, Rust, SQL, or even a Bash script running in a container. If you want to change a schedule or add a new trigger, you just update the flow configuration directly from the embedded code editor in the UI. You don’t need to redeploy your entire application or fiddle with a complicated framework.

### 2. Simple by Default, Complex When Needed

Kestra comes with many built-in plugins. You can automate many tasks without writing code. But if you need to orchestrate something custom—like an ingestion script packaged in Docker or a heavy data transformation in Spark—you can add it to your flow with minimal effort. There’s no ceiling that blocks advanced use cases.

### 3. One-Stop Shop for Automation

Everything lives in one place:

- **Built-in Code Editor**: Write or edit YAML in the browser with syntax validation, autocompletion, live-updating dependency view and integrated docs.
- **No-Code Forms**: Non-developers can create or adjust flows without having to set up complex development environments.
- **Version Control**: All flows have a revision history. You can roll back or compare changes side by side.
- **Blueprints**: Start with prebuilt examples or create custom blueprints to speed up repetitive tasks.

You decide whether to work in the UI or in your favorite IDE (using our VS Code or JetBrains extensions). That flexibility means less context-switching for developers and fewer barriers for everyone else.

### 4. Prebuilt Plugins and Painless Dependency Management

Kestra avoids package dependency issues common in Python-based orchestrators, where you would have to manually “pip install” all integrations you want to use, leading to dependency conflicts across teams. In contrast, when you install Kestra, you get immediate access to a broad ecosystem of plugins available out of the box. For custom code, each script task runs in its own container or task runner environment, so each of them can have its own set of libraries, eliminating any dependency conflicts.

### 5. Separation of Orchestration and Business Logic

With Kestra, you don’t have to turn your code into a special “task function” or adopt a specific programming style. If you already have a custom script that does some data processing, you can call it from Kestra as-is. This separation allows teams to update their business logic without the orchestrator getting in the way.

### 6. Bridging Developer and Non-Developer Worlds

Kestra isn’t just for engineers — business stakeholders can schedule flows, validate data quality, and manage key tasks directly from the UI. There’s no need for an IDE or developer support for simple changes; they can write and run code in the built-in editor. This makes automation accessible across teams and removes unnecessary bottlenecks.

## Unique Advantages

### API-First Design

Everything in Kestra is driven by an API. Flows, tasks, logs, permissions—anything you do in the UI can also be done with an HTTP call. This opens up all sorts of automation possibilities. You can:

- Integrate Kestra with your internal applications or CI/CD pipelines
- Manage all Kestra resources via Terraform
- Build custom UIs
- Dynamically generate new workflow executions from anywhere.

### Language-Agnostic, YAML-Based Configuration

You can orchestrate tasks in Python, R, Node.js, Rust, Go or any other language. You don’t have to rewrite your code in a specific DSL or add special decorators. Kestra’s YAML config is a lightweight layer that sits on top of your existing scripts or containers.

```yaml
id: python
namespace: company.team

tasks:
  - id: script_from_git
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/scripts
        branch: main

      - id: container
        type: io.kestra.plugin.scripts.python.Commands
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: ghcr.io/kestra-io/pydata:latest
        commands:
          - python etl/global_power_plant.py

```

### Scalable and Cloud-Native

Kestra can handle a few daily jobs on a single server or scale to millions of events in a multi-tenant environment. It can be deployed to any major cloud provider and on-prem data centers using standalone binary, Docker containers, or official Helm Charts for Kubernetes deployments. High availability is baked in when using the Enterprise Edition, so there’s no single point of failure. Large organizations can isolate business units in separate tenants or namespaces with dedicated workers, as well as storage and secrets backends for better governance, compliance and reliability.

### Simple Onboarding

Starting your first workflow in Kestra takes minutes. There’s no long setup that involves building Docker images or editing config files in ten different places. Many users noted that tools like Airflow are tough to set up or that no-code tools aren’t flexible enough for real-world tasks. Kestra brings the accessibility of no-code together with the power of code-first tools, all without the usual setup hurdles.

### Rich Governance and Security

Kestra Enterprise Edition has built-in features for:

- **RBAC and SSO**: Control who can create, run, or view workflows.
- **Audit Logs**: See exactly who changed what and when.
- **Secrets Management**: Securely manage API tokens, passwords, and other sensitive data.
- **Cluster Monitoring:** View the health of your infrastructure from the integrated Admin dashboard.
- **Multi-Tenant Architecture**: Isolate different business units, teams or projects for security and clarity.

### Clear Visibility into Dependencies

Kestra helps you stay organized with namespaces, labels, subflows, flow triggers, and event-driven orchestration. You can decouple processes but still see how they connect. This clarity makes it easier to diagnose issues and understand how data flows through the business.

### No Vendor Lock-In

Since Kestra is open-source and self-hosted, you retain full control over your environment and your data. Even if you use Kestra Enterprise or Kestra Cloud, you’re still running the same open-source core under the hood. You’re not tied to a proprietary system that might change or disappear. You can host Kestra anywhere, export all flows with one click, and even contribute new features back to the community.

## Comparing Kestra to Other Tools

**Python-Focused Orchestrators (Airflow, Prefect, Dagster)**: Great for Python shops, but create barrier for non-developers and you need to rewrite your codebase to match their framework's DSL. Any change to your workflow requires redeploying code, leading to large operational overhead and slow feedback loops. You need dedicated engineering resources to manage complicated infrastructure and CI/CD processes. Kestra's lightweight YAML approach bypasses those issues, allowing you to make changes right from the UI while keeping everything version-controlled automatically.

**No-Code Solutions (Zapier, n8n)**: They’re useful for basic automations, but they fall short on complex processes (like containerized jobs, large data pipelines, or advanced orchestration logic). Kestra maintains the same simplicity but adds the power to scale.

**Workflow Engines for Microservices (Temporal, Camunda)**: These can excel in specialized use cases (transactional microservices, BPMN-based processes) but may be too heavy or too dev-centric for broad company-wide adoption. Kestra aims to support multiple personas and simpler day-to-day automation tasks while still allowing advanced patterns for complex workflows.

## Common Use Cases for Kestra

- **Data Pipelines and ETL/ELT**: Orchestrate batch and real-time data processing jobs, load data from multiple sources, run dbt transformations, and scale computation for custom scripts with task runners.
- **Process Automation**: Empower non-engineers to automate routine tasks and complex business-critical processes with human-in-the-loop manual approval, intuitive UI forms and user-facing Apps.
- **Microservice Coordination**: Trigger workflows based on events, integrate with message brokers or REST APIs, monitor long-running processes and call containerized jobs in any language.
- **Generative AI Workflows**: Orchestrate LLM-powered tasks and build custom AI agents. Trigger AI steps in response to any business event and use Kestra’s Pause & Resume functionality to let humans validate AI-generated outputs.
- **IT Automation**: Automate resource requests for infrastructure provisioning across AWS, GCP, or on-prem. Orchestrate build processes with plugins for Terraform, Ansible, or Docker and simplify DevOps processes from a single orchestrator.
- **Cross-Team Collaboration**: Let analytics, finance, marketing, and engineering automate work in the same platform, each at their own comfort level.
- **Custom Applications**: Use Kestra as a backend workflow engine for your internal tools, SaaS products, or customer-facing applications.

## Outcomes Kestra Delivers for Our Users

- **Shorter Time-to-Value**: You can build, test, and deploy new workflows in hours or days, not weeks or months.
- **Greater Operational Efficiency**: Non-technical users handle many tasks themselves, freeing engineers to tackle other projects.
- **Clarity and Structure**: Kestra provides visibility into dependencies across teams, data sources, and environments.
- **Single Pane of Glass**: Stop juggling multiple orchestration tools. With Kestra, you get a unified platform to automate everything from simple scheduled jobs to large-scale mission-critical data pipelines.

## Our Vision: Orchestrate Everything, Everywhere

We believe in a future where a single orchestration platform covers all use cases from small scripts to complex enterprise processes—without forcing you into a single language or framework. Kestra is designed to be:

- **The simplest orchestration app for both developers and non-developers**.
- **Equally at home orchestrating data pipelines, business processes, or microservices**.
- **Flexible enough to integrate with any technology stack, any scale, anywhere**.

## Try Kestra and See it in Action

Kestra’s goal is to remove the barriers that keep orchestration locked away in dev-centric tools or limited no-code apps. Thanks to a language-agnostic, API-first design, Kestra creates a place where everyone can automate and scale mission-critical workflows without wrestling with complex frameworks or feeling boxed in by rigid no-code solutions.

If you’re tired of the old trade-offs—heavy code frameworks vs. limited no-code apps—Kestra stands ready to help. Get started by installing our forever-free open-source edition. You get to keep your favorite languages, empower non-technical teams, and orchestrate everything from small daily tasks to multi-stage, event-driven pipelines.

If you have questions or want to see how Kestra fits into your environment, [Talk to us](https://kestra.io/demo) or [join our Slack community](http://kestra.io/slack). We’re happy to discuss your specific use case and help you succeed in your orchestration and automation journey.
