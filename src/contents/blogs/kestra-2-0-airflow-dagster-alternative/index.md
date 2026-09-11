---
title: "Kestra 2.0: an Airflow and Dagster Alternative Worth a Second Look"
metaTitle: "Airflow and Dagster Alternative: What Kestra 2.0 Changes"
description: "For data engineers evaluating Airflow or Dagster alternatives: how Kestra 2.0's architecture removes the worker-to-database dependency, and where it still falls short."
date: 2026-09-11T09:00:00
category: Solutions
author:
  name: Adam Schroeder
  linkedin: https://www.linkedin.com/in/charming-data/
  image: aschroeder
  role: Developer Advocate
---

Kestra is an open source orchestration platform where you define workflows in YAML instead of Python, and its workers can run without holding a database connection. That second part is the detail worth understanding if you're evaluating orchestrators against Airflow or Dagster and haven't tried Kestra yet. This is what lets you place a worker in a separate cloud, an on-premises environment, or a network that only allows outbound traffic, with no inbound ports open at all.

## What Kestra is, if You Haven't Used it

Kestra ships with nearly 2000 [plugins](/plugins) covering data pipelines, dbt, cloud infrastructure, and AI agents, and you can use Python, Go, Rust, SQL, or a shell script inside any task. If you have used Airflow, you'll know that it requires you to write DAGs in Python. On the same token, Dagster asks you to model your pipeline as software-defined assets: you write Python functions that each declare what data they depend on, and running the pipeline means Dagster "materializes" those assets, computing and persisting each one in dependency order rather than just executing a list of steps. Kestra, on the other hand, treats the flow definition as configuration that sits on top of whatever code you already have.

Dagster gives you asset lineage and freshness tracking out of the box if you commit to writing your pipeline as Python assets; but Kestra skips that model entirely so you can orchestrate what you already have.

That distinction matters most for teams where not everyone codes in Python daily: analysts, ops, and platform engineers who need to schedule something without learning a new DSL. It also means changing a schedule or adding a trigger is a YAML edit from the UI, as opposed to a redeploy. In addition, Kestra doesn't need you to rewrite your existing code to make it work. Just point the workflow at it and it can run it out of the box.

## How the Engine Is Actually Built

Most orchestrators run into the same structural problem eventually. Workers need to read and write execution state somewhere, so they end up with direct database credentials and a network path to the database. That's true of Airflow's Celery and Kubernetes executors in various configurations, and it was true of Kestra before the 2.0 release. It works fine until you need a worker somewhere that a database can't reach such as a customer's restricted network, another region, or a facility with no inbound ports at all.

Kestra 2.0 removes that dependency with a new component called the Controller, which sits between workers and the rest of the system (the queue and the repository). Workers talk only to the Controller, over a single outbound gRPC connection that can be secured with mutual TLS. No inbound ports and no database credentials sitting on the worker itself.

A few positive outcomes from this redesign:

- **Workers go almost anywhere.** A separate VPC, a different cloud, on-premises next to systems that never leave the building, a restricted network that permits outbound traffic but blocks every inbound connection. For teams with data residency requirements, the data plane stays inside your perimeter while the control plane runs as a managed service elsewhere.
- **The queue and the repository are separate choices.** You can run everything on Postgres or MySQL to start, then move just the queue to something faster later without touching a single flow. Open source runs on JDBC. Redis, AMQP, and Kafka are Enterprise-only queue backends. There's one executor, one scheduler, one worker implementation regardless of which backend you pick, so behavior is consistent instead of subtly different depending on your setup.
- **Less data moves through the queue.** Task outputs load on demand instead of streaming through the queue on every execution by default. At high execution volume that's a meaningful reduction in traffic, and it shows up as better UI responsiveness and throughput.
- **Logs get their own backend.** The Enterprise-edition Log Data Store lets you point logs at JDBC, Elasticsearch, DataDog, or Splunk independent of where everything else lives. Logs are the highest-churn, bulkiest data an orchestrator writes, so moving them off the primary database is a real relief valve, and they still render in the UI exactly as before.

## Why This Matters When Compared to Airflow and Dagster

[Leroy Merlin runs 37 million workflow executions a month on Kestra](/blogs/enterprise-three-layer-architecture). They started on Airflow, where flows reportedly ran 20x slower than expected, and a single bad task could take down the whole cluster. The constraint is that Airflow workers generally need some form of database or broker connectivity depending on the executor you run.

Dagster's isolation looks similar but solves a different problem. Its gRPC code locations isolate Python dependencies, not database access, so self-hosted Dagster's run workers still connect directly to Postgres, the same constraint Airflow has. Dagster does offer outbound-only workers with no direct database access, but only through the Agent in its paid Dagster+ Hybrid product. Kestra ships that model in open source.

None of this means Kestra now beats either tool on every axis. Airflow still has the largest plugin ecosystem. Dagster's asset lineage and testing story is very attractive for teams fully bought into Python. What Kestra 2.0 changes is a specific, concrete operational limitation shared by most self-hosted orchestrators: needing your workers on the same network as your metadata store, which is something Airflow and self-hosted Dagster still require, but Kestra no longer does.

## The AI Layer Ships Alongside the Engine Work

2.0 isn't only infrastructure. Kestra now ships four AI-adjacent tools:

- Generate and edit your flow from natural language prompts inside the UI with AI Copilot, which can modify existing flows incrementally instead of regenerating the whole thing.
- Give an LLM a set of tools (web search, task execution, calling other flows) with an AI Agent task and let it decide the next action dynamically instead of following a fixed sequence. It still runs as a defined and observable task inside your flow, not like a black box.
- Teach external coding agents like Claude Code or Cursor how to write valid Kestra YAML and operate an instance via kestractl through Agent Skills.
- Give any MCP-compatible tool live access to plugin docs, blueprints, and search via MCP resources, so an agent working in your editor gets current information instead of guessing from stale training data.

## What's Free, What Isn't

Open source Kestra runs on JDBC (Postgres or MySQL) for both queue and repository, with the full plugin catalog and no license required. Enterprise adds the additional queue backends (Redis, AMQP, Kafka), SSO and RBAC, multi-tenancy, worker groups, audit logs, and the Log Data Store's non-JDBC destinations.

## Where to Go from Here

Try to spin up the [open source edition](/get-started) and see whether YAML-first orchestration with a decoupled worker model fits how your team actually works.

If you have any questions along the way, feel free to reach out to me directly via [LinkedIn](https://www.linkedin.com/in/charming-data/), or even better, [join our Slack](/slack) to have access to Kestra's awesome community.
