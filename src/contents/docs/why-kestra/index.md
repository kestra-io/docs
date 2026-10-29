---
title: "Why Kestra: Simpler, More Powerful Orchestration"
h1: Why Teams Choose Kestra for Workflow Orchestration
description: Discover why teams choose Kestra for orchestration. A declarative, event-driven platform that scales from simple automations to complex enterprise pipelines.
hideSidebar: true
---

## How we see the orchestration market

Most orchestration solutions fall into one of two extremes.

On one side are code-centric frameworks like Apache Airflow, which can offer flexibility but come with a steep learning curve and large operational overhead. Before you can run your first workflow, you have to set up cumbersome infrastructure, learn complex frameworks, and deal with confusing deployment patterns.

On the other side, drag-and-drop automation tools like Zapier are easier to start with. They come with prebuilt integrations, there's no heavy infrastructure to manage, and they require no coding skills. But as soon as you need something custom (like running a Python script in a container), these tools hit a wall.

This creates a trade-off, forcing organizations to choose between flexible but complex developer tools or simple but inflexible drag-and-drop automation platforms. If you pick a code-first approach, you have to invest significant engineering resources to maintain the codebase, infrastructure, and deployment processes. If you pick a no-code tool, you outgrow it fast and start building shadow IT with workarounds. Mixing both creates chaos and confusion: each team builds its own silo, and soon nobody knows which workflows run where.

Kestra bridges this gap. Most orchestrators are built for one team. Kestra is built for the whole organization.

## What is Kestra?

Kestra is an open-source, event-driven orchestration platform for data, AI, and infrastructure workflows. It combines full-code, low-code, and no-code in one platform:

- Define workflows declaratively in YAML, or build them visually in the No-code editor or with the AI Copilot
- Run business logic in any language: Python, Node.js, Go, Rust, Bash, SQL, and more
- Connect to thousands of plugins across cloud, data, infrastructure, CI/CD, AI, and SaaS
- Trigger everything from schedules to real-time events, webhooks, and AI agents
- Keep everything versioned and governed, so it stays secure and auditable
- Scale from a single scheduled script to event-driven pipelines across the entire organization

Kestra follows a "start simple and grow as needed" philosophy. You can schedule a basic workflow in a few minutes, then later add Python scripts, Docker containers, or complicated branching logic if the situation calls for it.

## How Kestra solves common problems

### 1. Focus on business logic, not plumbing

With Kestra, flows are written in simple YAML. Use one of thousands of plugins or run tasks in any language, from a Python script to a Bash command in a container. If you want to change a schedule or add a new trigger, update the flow directly from the embedded code editor in the UI. You don't need to redeploy your entire application or fiddle with a complicated framework.

### 2. Simple by default, complex when needed

Plugins let you automate many tasks without writing code. When you need something custom, like an ingestion script packaged in Docker or a heavy data transformation in Spark, you add it to your flow as another task. Built-in flow control covers branching, parallel tasks, loops, subflows, and human-in-the-loop approvals, so there's no ceiling that blocks advanced use cases.

### 3. One-stop shop for automation

Everything lives in one place:

- **[Code editor](../09.ui/01.flows/index.md)**: Write or edit YAML in the browser with syntax validation, autocompletion, a live-updating dependency view, and integrated docs.
- **[No-code editor](../09.ui/01.flows/index.md)**: Build flows on a visual canvas, configuring each task and trigger through a guided form. The YAML editor, No-code editor, and AI Copilot stay in sync, so all three always show the same flow.
- **[AI Copilot](../ai-tools/01.ai-copilot/index.md)**: Generate, refine, or explain flows from natural language prompts directly in the UI. Switch between Plan, Edit, and Ask modes depending on what you need.
- **[Revision history](../06.concepts/03.revision/index.md)**: Every flow keeps a revision history. Compare changes side by side and roll back at any time.
- **Draft flows**: Save a flow as a draft to iterate without affecting live executions. Publish explicitly when the revision is ready.
- **[Git integration](../version-control-cicd/04.git/index.md)**: Sync flows and namespace files with a Git repository so your workflows follow the same review and CI/CD process as your code.
- **Blueprints**: Start with prebuilt examples, or publish templated custom blueprints that let teammates generate a new flow by filling in a form.

You decide whether to work in the UI or in your favorite IDE using the VS Code or JetBrains extensions. That flexibility means less context-switching for developers and fewer barriers for everyone else.

### 4. Prebuilt plugins and painless dependency management

Python-based orchestrators often require you to `pip install` every integration you want to use, which leads to dependency conflicts across teams. Kestra plugins are managed by the platform instead: the standard Kestra image bundles all of them, and the slim image installs each plugin automatically the first time a flow uses it. For custom code, run script tasks in their own Docker container or on a [task runner](../task-runners/index.mdx), so each script gets its own set of libraries without conflicting with the others.

### 5. Separation of orchestration and business logic

With Kestra, you don't have to turn your code into a special "task function" or adopt a specific programming style. If you already have a custom script that does some data processing, you can call it from Kestra as-is. This separation allows teams to update their business logic without the orchestrator getting in the way.

### 6. Bridging developer and non-developer worlds

Kestra isn't just for engineers. Business stakeholders can trigger flows, fill in input forms, approve paused executions, and use self-service [Apps](../07.enterprise/04.scalability/apps/index.md) directly from the UI, without an IDE or developer support. Engineers keep full control of the code underneath. This makes automation accessible across teams and removes unnecessary bottlenecks.

## Unique advantages

### API-first design

Everything in Kestra is driven by an API. Flows, tasks, logs, permissions: anything you do in the UI can also be done with an HTTP call. You can:

- Integrate Kestra with your internal applications or CI/CD pipelines
- Manage all Kestra resources via [Terraform](../13.terraform/index.mdx)
- Manage flows, executions, namespaces, and IAM from the command line using [`kestractl`](../kestra-cli/kestractl/index.md), the standalone Kestra CLI
- Build custom UIs
- Dynamically generate new workflow executions from anywhere
- Expose flows as tools through [flow MCP servers](../ai-tools/07.mcp-server/index.md) so AI assistants can trigger and monitor them directly

### Language-agnostic, YAML-based configuration

You can orchestrate tasks in Python, R, Node.js, Rust, Go, or any other language. You don't have to rewrite your code in a specific DSL or add special decorators. Kestra's YAML config is a lightweight layer that sits on top of your existing scripts or containers.

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

### Scalable and cloud-native

Kestra can handle a few daily jobs or high-volume, event-driven workloads across a multi-tenant organization. Deploy it on any major cloud provider or in your own data center using the standalone binary, Docker containers, or the official Helm charts for Kubernetes. Run it as a single standalone server, or as a [distributed cluster](../08.architecture/03.deployment-architecture/index.md) where each component scales independently. Enterprise Edition adds higher-throughput queue backends for the largest workloads; see the [benchmarks](../performance/benchmark/index.md) for measured throughput and latency.

Workers connect to Kestra over a single outbound connection, so you can run them in another region, another cloud, or a restricted network that allows only outbound traffic. Large organizations can isolate business units in separate tenants or namespaces, route tasks to dedicated worker groups, and give each tenant its own storage and secrets backends for better governance and compliance.

### Simple onboarding

Starting your first workflow in Kestra takes minutes. There's no long setup that involves building Docker images or editing config files in ten different places. Many users noted that tools like Airflow are tough to set up or that no-code tools aren't flexible enough for real-world tasks. Kestra brings the accessibility of no-code together with the power of code-first tools, all without the usual setup hurdles.

### Rich governance and security

The Enterprise Edition adds enterprise-grade security, scalability, and governance for organizations managing complex workflows across multiple teams or environments. See [Open-Source vs. Enterprise](../oss-vs-paid/index.md) for the full comparison.

- **Access & Identity**: SSO, SCIM, and action-based RBAC, with audit logs for full traceability.
- **Secrets & Policy**: Bring your own secrets manager or use built-in storage, apply read-only secrets, enforce allowed-plugin lists, and use Policies to inject or validate configuration across namespaces.
- **Isolation & Control**: Multi-tenancy with worker isolation and dedicated worker groups, quotas to cap execution volume, a kill switch to stop runaway executions, and maintenance mode with in-product announcements for change communication.
- **Change Safety**: [Promote](../07.enterprise/02.governance/promote/index.md) flows between environments from the UI with a diff and drift detection, pin plugin versions, and catch regressions with flow unit tests.
- **Incident Response**: [Cases](../07.enterprise/02.governance/cases/index.md) turn failed executions into tracked incidents with severity, SLA targets, assignees, and one-click remediation.
- **Operations Visibility**: Asset lineage shows how data moves across flows, and the Instance Owner console shows the health of every Kestra service.

### Clear visibility into dependencies

Kestra helps you stay organized with namespaces, labels, subflows, flow triggers, and event-driven orchestration. You can decouple processes but still see how they connect. This clarity makes it easier to diagnose issues and understand how data flows through the business.

### No vendor lock-in

Kestra is open source, and you can self-host it anywhere, so you retain full control over your environment and your data. Kestra Enterprise and Kestra Cloud run the same open-source core under the hood, so you're not tied to a proprietary system that might change or disappear. Export all your flows with one click, and contribute new features back to the community.

## Comparing Kestra to other tools

**Python-Focused Orchestrators (Airflow, Prefect, Dagster)**: Great for Python shops, but they create a barrier for non-developers and you need to rewrite your codebase to match their framework's DSL. Any change to your workflow requires redeploying code, leading to large operational overhead and slow feedback loops. You need dedicated engineering resources to manage complicated infrastructure and CI/CD processes. Kestra's lightweight YAML approach bypasses those issues, allowing you to make changes right from the UI while keeping everything version-controlled automatically.

**No-Code Solutions (Zapier, n8n)**: They're useful for basic automations, but they fall short on complex processes (like containerized jobs, large data pipelines, or advanced orchestration logic). Kestra maintains the same simplicity but adds the power to scale.

**Workflow Engines for Microservices (Temporal, Camunda)**: These can excel in specialized use cases (transactional microservices, BPMN-based processes) but may be too heavy or too dev-centric for broad company-wide adoption. Kestra aims to support multiple personas and simpler day-to-day automation tasks while still allowing advanced patterns for complex workflows.

## Common use cases for Kestra

- **Data Pipelines and ETL/ELT**: Orchestrate batch and real-time data processing jobs, load data from multiple sources, run dbt transformations, and scale computation for custom scripts with task runners.
- **Process Automation**: Empower non-engineers to automate routine tasks and complex business-critical processes with human-in-the-loop manual approval, intuitive UI forms, and user-facing Apps.
- **Microservice Coordination**: Trigger workflows based on events, integrate with message brokers or REST APIs, monitor long-running processes, and call containerized jobs in any language.
- **Generative AI Workflows**: Orchestrate LLM-powered tasks, build retrieval-augmented generation (RAG) pipelines, and run [AI agents](../ai-tools/05.ai-agents/index.md) that decide which tasks to run at runtime. Expose any flow as an MCP tool so AI assistants can trigger and monitor workflows directly. Use Pause & Resume to let humans validate AI-generated outputs before continuing.
- **IT Automation**: Automate resource requests for infrastructure provisioning across AWS, GCP, or on-prem. Orchestrate build processes with plugins for Terraform, Ansible, or Docker and simplify DevOps processes from a single orchestrator.
- **Cross-Team Collaboration**: Let analytics, finance, marketing, and engineering automate work in the same platform, each at their own comfort level.
- **Custom Applications**: Use Kestra as a backend workflow engine for your internal tools, SaaS products, or customer-facing applications.

## Outcomes Kestra delivers for our users

- **Shorter Time-to-Value**: You can build, test, and deploy new workflows in hours or days, not weeks or months.
- **Greater Operational Efficiency**: Non-technical users handle many tasks themselves, freeing engineers to tackle other projects.
- **Clarity and Structure**: Kestra provides visibility into dependencies across teams, data sources, and environments.
- **Single Pane of Glass**: Stop juggling multiple orchestration tools. With Kestra, you get a unified platform to automate everything from simple scheduled jobs to large-scale mission-critical data pipelines.

## Our vision: orchestrate everything, everywhere

We believe in a future where a single orchestration platform covers all use cases from small scripts to complex enterprise processes, without forcing you into a single language or framework. Kestra is designed to be:

- **The simplest orchestration app for both developers and non-developers.**
- **Equally at home orchestrating data pipelines, AI workflows, infrastructure automation, and business processes.**
- **Flexible enough to integrate with any technology stack, any scale, anywhere.**

## Try Kestra and see it in action

Kestra's goal is to remove the barriers that keep orchestration locked away in dev-centric tools or limited no-code apps. Thanks to a language-agnostic, API-first design, Kestra creates a place where everyone can automate and scale mission-critical workflows without wrestling with complex frameworks or feeling boxed in by rigid no-code solutions.

If you're tired of the old trade-offs between heavy code frameworks and limited no-code apps, Kestra stands ready to help. Get started by installing our forever-free open-source edition. You get to keep your favorite languages, empower non-technical teams, and orchestrate everything from small daily tasks to multi-stage, event-driven pipelines.

If you have questions or want to see how Kestra fits into your environment, [Book a Demo](https://kestra.io/demo) or [join our Slack community](https://kestra.io/slack). We're happy to discuss your specific use case and help you succeed in your orchestration and automation journey.
