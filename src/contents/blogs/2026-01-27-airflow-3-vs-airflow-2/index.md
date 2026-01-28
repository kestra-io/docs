---
title: "Airflow 3 vs Airflow 2: Upgrade, or Migrate?"
description: "Airflow 3 brings real improvements, but the migration effort is substantial enough that teams should evaluate whether Airflow still fits their needs before committing engineering cycles to the upgrade."
date: 2026-01-27T13:00:00
category: Solutions
author:
  name: Elliot Gunn
  image: egunn
  role: Product Marketing Manager
image: ./main.png
---

Airflow 3 brings real improvements, but the migration effort is substantial enough that teams should evaluate whether Airflow still fits their needs before committing engineering cycles to the upgrade.

In a [previous post, we looked at Airflow alternatives](../2026-01-18-enterprise-airflow-alternatives/index.md) for teams considering a move away from Python-first orchestration. But what if you're not sure whether to leave Airflow at all? What if you just want to understand whether the Airflow 3 upgrade is worth the engineering effort?

This is the decision facing thousands of data teams right now. Airflow 2.x enters limited support mode in April 2026. That means security patches only, no bug fixes, no new features. You have a few months to decide: invest in migrating to Airflow 3, or use this forced refactor as an opportunity to reconsider your orchestration strategy entirely.

The answer depends on what you're optimizing for, and whether Airflow 3 fixes the specific pain points your team is experiencing. Let's break it down.

## What actually changed in Airflow 3

Airflow 3, released in April 2025, represents a fundamental architectural shift. The changes are deep enough that many teams are discovering their "upgrade" is actually a rewrite project.

Airflow 3 introduces a modern React-based UI that replaces the dated Flask interface. The new Task SDK provides cleaner abstractions for defining workflows. DAG versioning finally lets you track changes over time. The REST API has been rebuilt with FastAPI, making it faster and more capable.

Data-aware scheduling with Assets (the rebranded Datasets feature) makes it easier to trigger workflows based on data availability rather than just cron schedules. Human-in-the-Loop functionality allows workflows to pause for manual approval, useful for ML pipelines and content moderation workflows.

These are genuine improvements, but the migration cost is where things get complicated.

## What's better in Airflow 3

Let's acknowledge what the upgrade gets you:

**Modern interface.** The new React UI is significantly more responsive and intuitive than the old Flask-AppBuilder version. It feels like a product built in 2025, not 2015.

**Better developer experience.** The Task SDK simplifies how you define tasks. Less boilerplate, clearer patterns, easier to onboard new team members.

**Improved API performance.** The FastAPI-based REST API is noticeably faster, especially for teams that integrate Airflow with other systems programmatically.

**DAG versioning.** You can now track workflow changes over time without building your own versioning system on top of Git.

**Data-aware orchestration.** Assets make it easier to model dependencies based on actual data availability, not just guessing when upstream tasks finish.

If your team is Python-native, deeply invested in the Airflow ecosystem, and not hitting any major architectural limitations, these improvements are probably worth the migration effort. 

## What's harder in Airflow 3

Here's where the pain lives. Airflow 3 introduces breaking changes that will require refactoring across your entire DAG library.

**Direct database access is gone.** In Airflow 2, tasks could query the metadata database directly. Many teams built custom operators and monitoring around this. Airflow 3 removes this entirely. If your code uses database sessions, you'll need to refactor everything to use the REST API via the official Python client.

**Removed features you might rely on:**
- SubDAGs are completely deprecated (migrate to TaskGroups or Assets)
- Context variables like `execution_date`, `prev_ds`, `next_ds` are removed (your templates will break)
- REST API v1 is deprecated in favor of the new FastAPI-based v2
- Flask-AppBuilder authentication requires migration or a compatibility shim
- Sequential Executor is gone (use LocalExecutor instead)

**Architectural changes that affect deployment:**

The webserver is now split into two components: an API server and a separate DAG processor. Your Kubernetes manifests, deployment scripts, and monitoring all need updates. Standard operators (BashOperator, PythonOperator, etc.) now live in a separate `apache-airflow-providers-standard` package, requiring import updates across your codebase.

The Airflow team provides Ruff linter rules to identify breaking changes automatically (`ruff check dags/ --select AIR301,AIR302`), but you still need to manually refactor each broken pattern. For large DAG libraries, this is weeks of work, not days.


## The real question: upgrade or migrate?

Practically speaking, the Airflow 3 upgrade makes sense for a narrow subset of teams: those who are Python-native, have significant existing investment, and aren't hitting architectural walls.

But even teams that fit this profile should pause to consider where their orchestration needs are heading. If you're building [AI agent workflows](../../docs/ai-tools/ai-workflows/index.md), for example, a YAML-based declarative DSL often works better than Python code. Many teams are integrating AI capabilities into their data stacks, and the orchestrator you choose today will either enable or constrain that roadmap.

## Who should reconsider

But if you're hitting friction with Airflow's persistent limitations, the forced migration is worth pausing on. Here's what Airflow 3 doesn't fix:

**Still Python-only for workflow definitions.** If your team includes dbt analysts, Go developers, or anyone who doesn't want to learn Python decorators, they still can't contribute directly. You'll still be writing wrapper code.

**Multi-tenancy is still limited.** Enterprise teams with multiple business units sharing an Airflow instance will find the same [RBAC](../../docs/07.enterprise/03.auth/rbac/index.md) and namespace constraints. Governance is better, but not fundamentally different.

**Operational complexity arguably increased.** The split between API server and DAG processor adds deployment complexity. You now have more components to monitor, scale, and debug.

**Batch-first architecture unchanged.** If you need [event-driven workflows](../../docs/15.how-to-guides/realtime-triggers/index.md) that respond to webhooks, file uploads, or message queues in real-time, Airflow 3's architecture hasn't fundamentally changed. You're still working around a scheduler designed for cron-based batch jobs.

If any of these limitations are causing real pain for your team, you're going to refactor your workflows anyway. The question becomes: should you refactor toward Airflow 3, or toward something that addresses these gaps directly?

## Alternative modern orchestrators: Kestra

If you're already facing the task of refactoring for Airflow 3, it's a good moment to evaluate a different orchestration model, like Kestra.

Kestra is an open-source, event-driven orchestration platform for data, infrastructure, and AI workflows, with workflows defined as code - accessible through a unified interface:

![Data engineering pipeline example in Kestra](./kestra-data-eng-pipeline-ui.png)

**How Kestra is different:**
- **Declarative workflows** — YAML definitions instead of Python DAGs, readable by anyone on the team
- **Language-agnostic execution** — Run Python, SQL, dbt, Go, Node.js, or shell scripts without wrapper code
- **Event-driven by default** — Trigger from webhooks, file uploads, or message queues, not just cron schedules
- **Built-in governance** — RBAC, namespace isolation, and audit logging ship out of the box

Here's the practical difference. An Airflow DAG requires Python knowledge even for simple orchestration:

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime

with DAG('daily_etl', start_date=datetime(2024, 1, 1), schedule='@daily') as dag:
    extract = PythonOperator(task_id='extract', python_callable=extract_data)
    transform = BashOperator(task_id='transform', bash_command='dbt run')
    extract >> transform
```

In Kestra, the same workflow is declarative:

```yaml
id: daily_etl
namespace: company.team

tasks:
  - id: extract
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    commands:
      - python main.py

  - id: transform
    type: io.kestra.plugin.dbt.cli.DbtCLI
    commands:
      - dbt run

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 0 * * *"
```

The difference isn't just syntax. Kestra's architecture addresses the persistent gaps in Airflow 3:

**[Language-agnostic by design](../2024-10-25-code-in-any-language/index.md).** Orchestrate [Python](../../docs/15.how-to-guides/python/index.md), SQL, [dbt](../../docs/15.how-to-guides/dbt/index.md), shell scripts, Go, Node.js, whatever your team uses. No wrapper code, no forcing everyone into Python.

**Native governance built-in.** [RBAC](../../docs/07.enterprise/03.auth/rbac/index.md), [namespace isolation](../../docs/07.enterprise/02.governance/07.namespace-management/index.md), and [audit logging](../../docs/07.enterprise/02.governance/06.audit-logs/index.md) ship out of the box. You don't need to bolt on enterprise features later.

**Event-driven from the start.** Trigger workflows from [webhooks](../../docs/15.how-to-guides/webhooks/index.md), file uploads, message queues, or API calls. Not just cron schedules.

**Gentler migration path.** You can run Kestra alongside Airflow, migrate incrementally, and even trigger Kestra flows from Airflow DAGs during the transition. No big-bang cutover required. Teams like Crédit Agricole used this approach to move from Jenkins and Ansible to Kestra, orchestrating infrastructure across 100+ clusters without downtime.

**Complete lineage with [Assets](../../docs/07.enterprise/02.governance/01.assets/index.md).** Airflow 3 introduces Assets (rebranded from Datasets) for data-aware scheduling, but they only track data dependencies between tables. Kestra's Assets track both data artifacts (tables, files, datasets) and infrastructure resources (buckets, VMs, compute) in a unified inventory. When your DevOps team moves an S3 bucket or provisions new infrastructure, you can trace which workflows depend on it.

And Kestra builds the lineage graph automatically to show you the dependencies between Asset. Here, the blue represents Asset objects, grey represents the Flows.

![Assets DAG view in Kestra](assets-dag.png)

Kestra is open-source and can be [run locally with Docker](../../docs/02.installation/02.docker/index.md) in just 5 minutes with our [Quickstart Guide](../../docs/01.quickstart/index.md). 

## Making the decision

Here's a simple framework:

**Choose Airflow 3 if:**
- Your team is Python-native and comfortable with the ecosystem
- You're running on managed services (MWAA, Cloud Composer, Astronomer)
- Airflow's limitations aren't blocking your roadmap
- You have institutional knowledge and custom tooling you don't want to rebuild

**Reconsider your orchestrator if:**
- You have multi-language teams who can't contribute to Python DAGs
- You need event-driven workflows, not just batch scheduling
- Multi-tenancy and governance gaps are causing real friction
- You're already building workarounds for Airflow's architectural constraints

Whatever you decide, don't wait until April 2026. Either path requires planning, testing, and coordination time you don't want to compress into a few frantic weeks.

If you're reconsidering your orchestration strategy and want to see how Kestra addresses the gaps we've discussed, [book a demo](/demo) with our team. We'll walk through your specific use cases and help you determine if it's the right fit.