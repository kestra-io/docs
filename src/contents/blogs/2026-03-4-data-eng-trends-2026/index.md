---
title: "2026 Data Engineering Trends: Everyone's a Workflow Engineer Now"
description: "AI is making data engineering easier to enter and larger in scope at the same time. The interesting shift isn't in the tooling layer — it's how the role is fracturing and why orchestration is becoming the coordination layer for everything."
date: 2026-03-04T09:00:00
category: Solutions
author:
  name: Elliot Gunn
  image: egunn
  role: Product Marketing Manager
image: ./main.png
---

The first two months of 2026 delivered more capable AI models than the prior two years. That pace is doing something strange to data engineering: making the job easier to enter and larger in scope at the same time.

The contradiction is real. AI lowers the bar of entry: Claude Code drafts your pipeline, explains it, debugs it. But every business process that gets structured becomes automatable. The surface area of things that need orchestrating is expanding faster than the tools are democratizing access.

Not everyone encountering that surface is a data engineer by title. The spectrum runs from an analytics engineer who used Claude to build incremental [dbt](/plugins/plugin-dbt) models with cross-schema dependencies and dynamic ref logic, well beyond what they could have tackled pre-LLM, to a legal ops manager who pointed Claude at five contract folders and asked for a daily summary. The legal ops manager doesn't think of themselves as an engineer, but they're doing workflow engineering anyway.

Most 2026 trend pieces stop here and run a tool comparison, but we're not going to do that today because the interesting shifts are structural: how the data engineer role is fracturing, why orchestration is becoming the coordination layer for data pipelines, infrastructure, and business processes alike, and what that means for the teams building in this environment.

This workflow pattern reveals a category error: "data orchestration" was always too narrow. Traditional orchestrators like Airflow only track data assets like tables and views. They can't track infrastructure assets like buckets, VMs, files, or API endpoints because those weren't part of the original design scope. When your lineage tool only tracks tables, you lose visibility into the infrastructure your workflows depend on. The dependency graph is incomplete.


## What this means for data engineering


### The "data engineer" role is fragmenting

> Diagram showing "Data Engineer (2022)" splitting into three roles: Platform Engineer, Workflow Engineer, and AI Engineer

Traditional data engineers are splitting into at least three distinct roles:
* Platform engineers build the orchestration systems that handle the full stack at scale. They work in [Kubernetes](/plugins/plugin-kubernetes), [Terraform](/plugins/plugin-terraform), and build internal platforms. 
* Workflow engineers build pipelines and automations using SQL and YAML-based orchestration without needing deep Python or Java expertise. They live in dbt, [Airbyte](/plugins/plugin-airbyte) configurations, and orchestration UIs. 
* AI engineers combine data engineering with machine learning operations. They coordinate between feature stores (Feast, Tecton), model training (PyTorch, TensorFlow), and inference infrastructure.

The modern data stack is the forcing function. When your stack includes [Fivetran](/plugins/plugin-fivetran) for extraction, dbt for transformation, [Snowflake](/plugins/plugin-jdbc-snowflake) for warehousing, and [Hightouch](/plugins/plugin-hightouch) for reverse ETL, plus infrastructure provisioning and API coordination, you need orchestration that handles all of it and not just the SQL parts.


### Orchestration becomes the universal language

> Kestra workflow with tasks in multiple languages — SQL, Python, and shell — running in the same flow

If everyone can write code, everyone can break production. The new bottleneck isn't writing the SQL query or the Python script. It's coordinating that work across different systems, languages, and teams. When does this run? What happens if the Fivetran sync fails? What downstream dbt models depend on this table? Who gets alerted when Snowflake queries time out? How do we retry the Hightouch sync without duplicating records in Salesforce?

Answering these questions requires orchestration thinking, not traditional engineering thinking. Understanding dependencies across systems, not just within databases. A product manager who can write a dbt model with Claude Code still needs to think like an operator when that model depends on upstream Airbyte extractions, S3 file arrivals, and API rate limits.

These aren't "data engineering" concepts. They're workflow engineering concepts, and they apply whether you're orchestrating dbt models, Terraform deployments, or a Kubernetes job that nobody planned for.

The spectrum isn't metaphorical. A developer sets up Claude Code with MCP servers and hooks. When a file lands in S3, a hook fires, Claude pulls context from the MCP knowledge base, generates a summary, and writes it to a [Slack](/plugins/plugin-slack) channel. They wrote maybe 20 lines of YAML and some hook configuration. That's [event-driven orchestration](../2024-06-27-realtime-triggers/index.md). 

On the other end, a financial analyst at a bank uses Claude Cowork to run a morning briefing: pull from their portfolio dashboard, compare against yesterday's close, flag anomalies, draft commentary. One click. They're doing the same thing: event-driven, dependency-aware orchestration. They just call it "my AI."

The tooling differs, but the pattern doesn't. Both are orchestrating dependencies across systems; the spectrum just describes how much of the plumbing they have to see.


### Developer experience becomes a competitive moat

The old question was: "Can our tool do X?" The new question is: "Can someone learn our tool in 5 minutes with an AI assistant?"

[Declarative, language-agnostic tooling](../2024-10-25-code-in-any-language/index.md) is what's winning. AI assistants can generate clean configurations, validate them before runtime, and explain them to the non-engineer who has to maintain them next month. 

When you ask Claude Code to "build a workflow that triggers on file upload and sends Slack alerts on failure," it produces working configs in tools designed for this pattern. Imperative Python frameworks require more context switching and produce code that's harder for non-engineers to modify later.

YAML wins because it separates what you want from how to execute it: the orchestration logic lives in YAML, the execution logic lives in whatever language makes sense for each task. That separation is what lets AI validate configurations before runtime, and it's what makes the result readable to someone who didn't write it.

When you're coordinating across languages and systems, imperative Python creates lock-in. A Python-based DAG can only coordinate Python tasks easily. If you need to orchestrate a shell script, a SQL query, and a Go microservice in the same workflow, you either wrap everything in Python (adding unnecessary complexity) or you need a different tool. Declarative orchestration treats all tasks as equal: the orchestration layer is YAML, the execution layer is whatever language makes sense for each task.

This isn't a new pattern. Infrastructure-as-code took off with Terraform and Kubernetes for exactly the same reason: declarative configuration handles heterogeneous systems better than imperative code does. Workflow-as-code is following the same path, just a few years behind.

Run a SQL query daily, alert on failure, retry three times: in Airflow, this requires 40+ lines of Python with imports, decorators, error handling, and DAG configuration. In a YAML-first orchestration tool, it's 10 lines of declarative configuration. Both work. But only one is maintainable by a workflow engineer who learned SQL last week, and only one is easy for an AI assistant to generate, validate, and explain.

If your tool is a mess, AI will generate messy code. If your tool is clean and declarative, AI will generate clean, maintainable workflows.

When I was doing research for this article, I spoke to Benoit, who runs product at Kestra and is a daily Claude power user. He shared how he works at the frontier of exactly this pattern. He writes a large spec document, hands it to Opus via a CLI tool called Bids (a DAG for agents, backed by a database), which breaks it into epics and issues. He spins up five Claude Code sessions in parallel. The agents coordinate via MCP Agent Mail: when one claims an issue, it broadcasts to the others so they can reprioritize their queues. Kestra sits underneath as the scheduler and execution layer. The whole thing only works because the tooling is clean enough for AI to generate, read, and modify without losing coherence.


## Three predictions

**Prediction 1: "Workflow engineer" becomes an official job title by 2027.** 
Not a data engineer, not a DevOps engineer, but someone who orchestrates work across systems, languages, and teams. The key skills: understanding dependencies, event-driven architecture, and debugging distributed systems. Deep expertise in any single programming language becomes optional. Domain expertise and orchestration thinking become mandatory. 

You don't need to be a Python expert. You need to understand how your business workflows map to technical dependencies, and how to coordinate those dependencies reliably. The title doesn't exist yet at most companies. The work does.

**Prediction 2: The pendulum swings again.** 
Just as everyone becomes a workflow engineer, we'll see the opposite trend emerge. Some companies will realize they've over-distributed engineering work and created chaos. A new category will emerge: "workflow governance" tools designed to prevent the mess that happens when 50 people can ship production workflows with no central oversight. 

The problem will shift from "how do we build faster" to "how do we prevent disasters." When orchestration scope expands from data pipelines to infrastructure and business processes, the blast radius of failures expands too.

**Prediction 3: Data engineering becomes operations engineering.** 
The "data" part gets commoditized. Anyone can write SQL or Python with AI assistance. The "engineering" part becomes the differentiator: reliability, incident response, cost. AI is already starting to manage the transformation logic itself. 

Take Salesforce-to-PostgreSQL ingestion: today that's a pipeline someone builds, field mapping by field mapping. Describe the same transformation in natural language and an agent figures out the mapping; the orchestration layer handles scheduling and retries. What remains is the operations work: did the sync run? Did it fail? Was it retried? Did it corrupt data? The best data engineers of 2026 think like SREs. They'll build platforms that let workflow engineers ship safely, with guardrails that prevent the most common failure modes.

Enterprise companies will resist. Startups will embrace it too early and burn themselves with workflow sprawl. The companies that get it right will be the ones that figure out the division of labor early: platform engineers own the orchestration layer, workflow engineers own the domain logic, and neither steps on the other.


## What to do about it

### For data practitioners
Learn orchestration thinking, not just coding. Understand how systems talk to each other, how dependencies cascade, and how failures propagate across distributed systems. 

If you're a data analyst, knowing how your dbt model depends on upstream Fivetran syncs and downstream Hightouch activations matters more than mastering every SQL optimization technique. 

Your domain expertise is your moat. AI can help you write code, but it can't replicate your understanding of the business problem. Orchestration patterns work across data, infrastructure, and business processes. The skills transfer.

> Kestra namespace view showing platform-owned namespaces with RBAC permissions for workflow engineer teams


### For companies
Invest in orchestration platforms that handle the full scope: pipelines, deployments, and the business processes that tie them together. Declarative, structured tools will be easier for your teams to learn and maintain, especially when AI assistants are generating the configurations. 

Build governance guardrails before you need them. Don't mistake "everyone can code" for "everyone should code everything." Platform engineers should own the orchestration layer. Workflow engineers should own the domain logic. That separation matters.


### For tooling companies
Documentation matters less when AI can explain your tool on demand. Developer experience was always important, and your API design, error messages, and structural consistency matter more than ever because AI will amplify both good patterns and bad ones.

If your tool is scoped narrowly to data pipelines or infrastructure, you'll lose to tools that handle the full dependency graph. Workflow engineers think in dependencies, not system categories. If your tool can only see one system at a time, it won't be their tool for long.


## Closing thoughts

The no-code revolution promised to democratize software development by hiding code behind visual interfaces. It failed because the abstraction was wrong. What actually democratized software development was making the real tools accessible, with AI assistants as guides.

When non-engineers start building workflows, they immediately bump into the limitations of category thinking. Real workflows cross boundaries. An analytics workflow pulls from the [Stripe](/plugins/plugin-stripe) API, writes to S3, triggers schema validation, loads into Snowflake, runs dbt transformations, exports metrics to Looker, and syncs customer segments to Braze. Calling this "data orchestration" ignores the API coordination, infrastructure dependencies, and business system integration.

Orchestration is the universal layer. Now that everyone can build workflows, the tools that win will be the ones that treat the Stripe extraction, the S3 dependency, and the Braze sync as equally first-class problems, not as side effects of a "data" tool stretching past its original design.

If you're building the orchestration layer for your team (whether that's [data pipelines](../../docs/use-cases/01.data-pipelines/index.md), [infrastructure automation](../../docs/use-cases/04.infrastructure/index.md), or the business processes that connect them), [Kestra](/) is worth a look. Browse the [plugin library](/plugins) to see coverage for Fivetran, dbt, Snowflake, Airbyte, and the rest of the modern data stack.

You can have a workflow running in [under five minutes](../../docs/01.quickstart/index.md). [Book a demo](/demo) if you want to see how enterprise teams handle the governance side: namespaces, [RBAC](../../docs/07.enterprise/03.auth/rbac/index.md), [audit logs](../../docs/07.enterprise/02.governance/06.audit-logs/index.md), and [cross-stack lineage](../../docs/07.enterprise/02.governance/01.assets/index.md).
