---
title: "Airflow 2 End of Life: Upgrade to Airflow 3 or Rethink Your Orchestration?"
description: "Airflow 2 reached end-of-life on April 22, 2026. This guide breaks down what the Airflow 3 upgrade really involves, where the Airflow model hits its limits, and how to evaluate a declarative alternative."
metaTitle: "Airflow 2 End-of-Life: Upgrade to Airflow 3 or Replace It? | Kestra"
metaDescription: "Apache Airflow 2 reached EOL on April 22, 2026. Compare the Airflow 3 upgrade against a move to declarative orchestration — effort, risks, and a proven migration path."
tag: whitepapers
date: 2026-04-15
lastUpdated: 2026-09-15
href: /resources/airflow-2-eol-whitepaper
faq:
  - question: "Should we upgrade to Airflow 3 or switch to a different orchestrator?"
    answer: "It depends on how far your organization has grown beyond Airflow's original design assumptions. For small, Python-fluent teams running tightly coupled pipelines, Airflow 3 is a strong path: the ecosystem is deep and the improvements are real. For organizations where orchestration spans multiple teams, languages, and systems, the mandatory Airflow 3 refactoring effort is a natural window to evaluate a declarative, language-agnostic model like Kestra, because significant engineering work is required either way."
  - question: "How much effort is the Airflow 2 to Airflow 3 upgrade?"
    answer: "More than a routine version bump. SubDAG removal, deleted context variables, the REST API v1 deprecation, authentication changes, and the webserver split into separate API server and DAG processor components all require code and infrastructure changes at the same time. Airflow's Ruff linter rules identify breaking changes automatically, but each one still needs manual refactoring and validation. For organizations with large DAG libraries, teams typically measure the effort in weeks of engineering time."
  - question: "Can Kestra run alongside Airflow during a migration?"
    answer: "Yes. The recommended approach is the Strangler Fig pattern: new workflows are built in Kestra from day one, simple pipelines are translated first, and complex workflows stay in Airflow — Kestra can trigger them remotely — until confidence is established. Both systems run in parallel, production stays stable, and Airflow is decommissioned only when the organization is ready."
  - question: "Do we have to rewrite our pipelines to move from Airflow to Kestra?"
    answer: "No. Moving to Kestra is not a rewrite of your business logic — Python scripts, SQL queries, dbt models, and Spark jobs keep running as they are. The migration translates the orchestration layer (dependencies, schedules, retries, notifications) from Python DAG code into declarative YAML. AI-assisted translation can generate initial YAML definitions from existing DAG code, turning the most tedious 60–70% of the work into a review task rather than a rewrite."
  - question: "Is it risky to still be running Airflow 2 today?"
    answer: "Airflow 2 stopped receiving security patches, bug fixes, and provider updates on April 22, 2026. Every month on an unmaintained orchestrator increases exposure: new CVEs in Airflow 2 or its dependencies will not be fixed, and organizations with compliance requirements such as SOC 2 or PCI-DSS will struggle to justify an unsupported platform at the center of their data infrastructure."
---

Apache Airflow 2 reached end-of-life on **April 22, 2026**. The 2.x line no longer receives security patches, bug fixes, or provider updates. If you are still running it, the deferral period is over — the only question left is what to do next.

On the surface, it looks like a question of whether to upgrade. The actual question is whether to keep betting on the same architectural model. Airflow 3 is a better Airflow, but it does not change the architecture — and for many teams, that distinction is the whole decision. This guide walks through what actually changed in Airflow 3, where the Airflow model hits structural limits, and how to evaluate the alternative: orchestration as a declarative layer, decoupled from execution.

Airflow's design made sense in 2014, when Python dominated data teams and batch pipelines were the primary use case. As organizations have grown more heterogeneous, the constraints of the workflow-as-code model have become structural bottlenecks:

- **Organizational bottlenecks** — non-Python teams, from SQL-heavy analysts to infrastructure engineers, cannot self-serve in a system where every pipeline is an executable program.
- **Technical constraints** — the coupled model struggles to coordinate across modern, diverse stacks: AI services, SaaS APIs, and event-driven systems.
- **Operational scaling** — platform overhead increases faster than business value. When your system must execute Python just to reason about an orchestration plan, the design itself becomes the limiting factor.

These are not incidental issues fixed by a new version. They are outcomes of a model where orchestration logic is tightly coupled to execution — which raises the broader question this guide is built around: should orchestration remain embedded in executable code, or exist as a separate architectural layer that coordinates work across systems?

## Airflow 2 is now unmaintained — what that means

Since April 22, 2026, any vulnerability discovered in Airflow 2 or its dependency chain goes unpatched. Provider packages stop being updated against the 2.x line, so integrations gradually drift out of support as the underlying services evolve. For organizations with compliance requirements (SOC 2, HIPAA, PCI-DSS), an unsupported orchestrator at the center of the data platform is a finding waiting to happen.

For a detailed breakdown of the EOL timeline and the risks of staying, see [Airflow 2 End of Life: What It Means for Your Team](/blogs/2026-04-06-airflow-2-end-of-life). The rest of this guide focuses on the decision itself.

## Airflow 3 changes the upgrade scope

For most teams, upgrading Airflow has historically meant incremental work: update dependencies, adjust a few operators, move on. Airflow 3 is different. The transition is less a routine upgrade and more a structural refactor — workflow code, deployment assumptions, and operational tooling all need to change at the same time.

### What changed

Airflow 3 modernizes the platform with a new React UI, first-class DAG versioning, and improved Assets for explicit data-aware scheduling. At the same time, it removes SubDAGs, context variables, and direct database access, and moves operators to provider packages. The deployment model also changed: the webserver is split into a separate API server and DAG processor, which forces updates to infrastructure and monitoring setups. For a feature-by-feature comparison, see [Airflow 3 vs Airflow 2](/blogs/airflow-3-vs-airflow-2).

### What improved

There are real improvements for teams committed to the Airflow ecosystem. The new UI is significantly more usable, with faster navigation and clearer debugging. The Task SDK improves developer ergonomics with clearer abstractions and less boilerplate. The FastAPI-based REST API is faster. DAG versioning and data-aware orchestration make dependency modeling more explicit. For Python-centric teams, these improvements may justify the upgrade effort on their own.

### What got harder

The migration effort is where the scope becomes clear. Airflow 3's changes affect entire DAG libraries, not individual workflows:

- SubDAG deprecation requires migration to TaskGroups or Assets.
- Removed context variables mean many templates and macros need rewriting.
- The REST API v1 deprecation forces updates across external integrations.
- Authentication tied to Flask-AppBuilder requires migration or compatibility shims.
- The Sequential Executor was removed, so even development environments need a new executor.

The Airflow team provides tooling — including Ruff linter rules — to identify breaking changes automatically. But detection is not resolution: each identified issue still requires manual refactoring and validation. For organizations with DAG libraries that evolved over years, this is measured in weeks of engineering time, not days. Many teams describe the transition as a controlled rewrite.

### What stayed the same

Despite the scope of change, Airflow 3 does not alter the underlying architectural model. Workflows remain Python-first. DAGs are still executable code. Orchestration logic is still coupled to execution logic. The scheduler still determines dependencies by executing Python rather than evaluating a static plan. And the same scaling dynamics apply: as workflows and teams grow, operational overhead increases non-linearly.

### Why this matters

Most teams will invest engineering time regardless. The question is how that effort is framed. Treating the transition as routine maintenance assumes the existing orchestration model still fits. Treating it as an architectural decision acknowledges that significant refactoring is already required — and that this effort creates a window to reassess.

## The limits of the Airflow model at scale

At small scale, Airflow's trade-offs are manageable. As workflows and teams multiply, three constraints surface and compound:

| Airflow characteristic | Limitation | What happens at scale |
|---|---|---|
| Python-centric design | Workflows are Python scripts the scheduler executes. Even simple pipelines need imports, operators, and control flow. | Only engineers who know Python and Airflow internals can own workflows. Every orchestration change becomes a software project. |
| Orchestration coupled with execution | DAG files are executable programs, not declarations. The orchestration plan doesn't exist until the scheduler runs your code. | You can't see what was supposed to run, only what did. Visibility drops as workflows multiply; teams build custom tooling to compensate. |
| Non-linear operational complexity | Every DAG adds scheduler load, parse time, and database contention. Problems don't stay contained to individual workflows. | What worked fine with 50 DAGs breaks at 500. Teams hit a ceiling where adding workflows becomes prohibitively expensive. |

These constraints aren't hypothetical. Apple's ML team of 200 engineers evaluated Prefect and Dagster before [choosing Kestra as their Airflow alternative](/customers/apple-ml-team-orchestrates-large-scale-data-pipelines-with-kestra), citing scalability, language-agnostic YAML, robust error handling, and cost:

> "Apache Airflow is complex and has been challenging to manage, with significant operational overhead." — Senior Engineering Manager, Apple

## Code-driven vs. declarative: an architectural decision

Orchestration is often treated as scheduling glue. At scale, it does far more: it defines how work is expressed, who can change it, how failures are understood, and where responsibility sits when things go wrong. The shift from code-driven to declarative orchestration is not a product decision — it is an architectural one, with consequences for team structure, system design, and operational cost that compound over years.

| Code-driven (Airflow model) | Declarative (modern alternative) |
|---|---|
| Orchestration = executable program | Orchestration = configuration description |
| Logic embedded in code paths | Logic declared explicitly |
| Dependencies inferred at runtime | Dependencies visible statically |
| Flexible but opaque | Transparent but structured |
| Ownership tied to codebase fluency | Ownership extends to non-technical stakeholders |

The practical difference shows up in who can participate. Consider three roles that exist in most organizations running orchestration at scale:

| Role | In code-driven orchestration | In declarative orchestration |
|---|---|---|
| Platform engineers | Own everything: deployment, DAG reliability, custom operators, scheduler performance. Become the bottleneck for every team's pipelines. | Own infrastructure: deployment, RBAC policies, secrets, monitoring. Set guardrails without owning every workflow. |
| Workflow authors (data, ML, infra engineers) | Must write Python, conform to Airflow's execution model, and coordinate with the platform team to deploy. | Define workflows in YAML using their native tools (Python, SQL, dbt, Spark). Deploy independently within their namespace. |
| Domain consumers (analysts, ops, business users) | Depend entirely on platform or engineering teams. Cannot self-serve. | Trigger workflows, view execution status, or interact with pipelines directly. |

None of this means imperative orchestration is wrong. For small, Python-heavy teams running a handful of tightly coupled pipelines, Airflow's code-first model is genuinely powerful: arbitrary logic, the full standard library, and a decade of community-built operators. A team of five Python engineers running 50 DAGs will experience Airflow very differently from an organization with 200 engineers running 5,000 workflows across Python, SQL, Spark, and API integrations. Declarative orchestration is designed for the second scenario, not as a replacement for the first.

## The declarative alternative

In a declarative model, orchestration is expressed as configuration rather than code. The workflow describes *what* should happen — steps, dependencies, conditions, policies — without embedding *how* each step is implemented. Business logic stays native to the systems that execute it: SQL stays SQL, Python stays Python, dbt stays dbt. Orchestration becomes a control layer that coordinates those systems rather than a place where logic accumulates.

The most visible difference is how the same pipeline reads. In Airflow, a Snowflake-load-then-dbt pipeline with retries and Slack alerting is a Python program: imports, operator classes, a callback function, and dependencies inferred from `extract >> transform`. In Kestra, the same pipeline is a description:

```yaml
id: dbt_snowflake_etl
namespace: company.team

tasks:
  - id: extract
    type: io.kestra.plugin.jdbc.snowflake.Query
    url: jdbc:snowflake://account.snowflakecomputing.com
    username: "{{ secret('SNOWFLAKE_USER') }}"
    password: "{{ secret('SNOWFLAKE_PASS') }}"
    sql: |
      COPY INTO staging.orders
      FROM @my_s3_stage/orders/
      FILE_FORMAT = (TYPE = 'CSV' SKIP_HEADER = 1)
    retry:
      type: constant
      interval: PT30S
      maxAttempt: 3

  - id: transform
    type: io.kestra.plugin.dbt.cloud.TriggerRun
    accountId: "{{ secret('DBT_CLOUD_ACCOUNT_ID') }}"
    token: "{{ secret('DBT_CLOUD_API_TOKEN') }}"
    jobId: "366381"
    wait: true

errors:
  - id: notify_failure
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "Pipeline {{ flow.id }} failed on task {{ task.id }}: {{ error.message }}"
```

A declarative workflow can be inspected statically: reviewers see the full execution plan, dependencies, and conditions without running anything. Standard tooling — diffs, linters, version control, review workflows — applies naturally. This trades some dynamic flexibility for transparency and predictability: highly dynamic behavior that is trivial in Python must be modeled more deliberately. That constraint is intentional. It is what makes orchestration understandable, governable, and safe to change as systems grow.

Language-agnosticism compounds the benefit. In Python-centric orchestrators, SQL transformations, infrastructure commands, and API calls all get wrapped in Python operators — so orchestration ownership stays with those who understand the Python execution model, even when the underlying work isn't Python. A language-agnostic orchestrator treats tasks as external units of work: a workflow invokes Python, SQL, dbt, Spark, shell commands, or HTTP APIs directly, without a dominant language absorbing their logic.

## Where Kestra fits

[Kestra](/) is an open-source orchestration platform built around this declarative, language-agnostic architecture. Moving to Kestra is not about rewriting pipelines in a new framework — it is about translating existing work into an explicit orchestration layer that describes what runs, when, and why, without re-implementing the work itself.

In production deployments, a few patterns recur:

**Namespace-per-team operation.** A central platform team manages the Kestra deployment, RBAC, secrets (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault), and monitoring — but does not own every workflow. Individual teams operate in isolated namespaces with their own workflows, permissions, and execution history. Adding a new team creates a new boundary with clear ownership instead of extending an already-shared surface area.

**Reusable subflows.** Rather than duplicating logic across pipelines, teams define composable subflows for common operations — validation, notifications, integration steps — maintained once by the platform team and reused across namespaces:

```yaml
# Subflow: standardized error notification (maintained by platform team)
id: notify_on_failure
namespace: platform.common

inputs:
  - id: workflow_id
    type: STRING
  - id: error_message
    type: STRING

tasks:
  - id: send_slack_alert
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {
        "text": "❌ Workflow {{ inputs.workflow_id }} failed: {{ inputs.error_message }}"
      }
```

**Assets as a governance layer.** Airflow 3's Assets let DAGs trigger when upstream data updates, but asset definitions live inside DAG code — you still need Python to understand what triggers what. Kestra (Enterprise Edition) treats assets as a governance layer instead: teams declare asset inputs and outputs in YAML at the task level, and Kestra builds a searchable catalog with lineage graphs, execution history, and ownership metadata. When a downstream pipeline breaks, any team member can trace the dependency chain in the UI without filing a ticket or reading DAG code.

**Event-driven orchestration beyond cron.** While time-based scheduling remains available, Kestra workflows are often triggered by events: a message landing in an SQS queue, a file arriving in S3, a webhook, a database change. Triggers are declared directly in the workflow YAML, with configurable conditions and filters. Schedules become one trigger type among many rather than the default abstraction for all coordination.

## Trade-offs to evaluate

No platform switch comes without costs, and Kestra is no exception. Three areas of friction to plan around:

- **YAML verbosity.** Complex branching that fits in 30 lines of Python may take 80 lines of declarative YAML. Kestra mitigates this with reusable subflows and flow-level variables, but the trade is real.
- **Plugin ecosystem.** Kestra's 1,200+ plugins cover the major clouds, databases, and data tools, but niche connectors may not exist yet. The plugin SDK makes custom development straightforward.
- **Community size.** Airflow has a decade of Stack Overflow answers and institutional knowledge. Kestra's community is smaller (26k+ GitHub stars and growing) — though YAML requires no framework-specific expertise to read.

## The cost and shape of migration

Migration should never be evaluated in isolation. Compare it directly against the ongoing cost of staying:

| Staying (recurring) | Migrating (front-loaded) |
|---|---|
| 0.5–2 FTE dedicated to orchestration maintenance | Concentrated effort over a defined period |
| Debugging failures, maintaining custom operators | Assessment, foundation setup, incremental translation |
| Managing scheduler performance, responding to incidents | Each step reduces dependency on the old system |
| Cost compounds as workflows and teams grow | Cost is directional, not recurring |
| Unlimited duration | Time-limited initiative with a clear trajectory |

Migration is often framed as an all-or-nothing rewrite. That framing is misleading. The **Strangler Fig pattern** introduces the new orchestrator alongside Airflow rather than replacing it outright:

1. **Day 1:** new workflows are built in Kestra from the start.
2. **Phase 1:** simple, low-risk pipelines are translated first.
3. **Phase 2:** complex workflows remain in Airflow, triggered by Kestra when needed.
4. **Phase 3:** Airflow is decommissioned once confidence is established.

Production stays stable and feature delivery continues throughout. Parallel operation is an accepted, intentional state — the goal is not to eliminate overlap immediately but to ensure it shrinks rather than becoming permanent.

AI-assisted translation acts as a force multiplier here. Airflow DAGs are structured artifacts that AI can analyze mechanically: task structure, dependencies, and control flow translate from Python to YAML automatically, and engineers review, confirm correctness, and adjust edge cases. In practice this makes migration review-driven rather than rewrite-driven, reducing the most tedious parts of the work by 60–70%. See [how AI-assisted Airflow migration works in practice](/blogs/airflow-to-kestra-migration-with-ai).

## Case study: Leroy Merlin

Leroy Merlin, a global home-improvement retailer with over 24,000 employees, initially attempted to use Airflow for its Google Cloud migration. The platform team hit three walls: unstable architecture under simple benchmark tests, heavy infrastructure overhead (managed services proved too limited, forcing complex Kubernetes clusters that burned CPU even when idle), and total dependence on code — a single poorly written DAG could stall the platform.

They [pivoted to Kestra](/customers/datamesh-at-scale-increased-its-data-production-by-900percent) using exactly the incremental path described above: new cloud projects started on Kestra first, legacy systems ran in parallel, then event-driven flows took over the processing load. The results:

- **900% growth** in production data workflows over two years.
- **500+ data practitioners** (including 80+ data engineers and scientists) collaborating without specialized SDK mastery.
- **400,000+ monthly executions** and 3,000,000+ tasks processed.
- A full, atomic CI/CD lifecycle for data resources via Terraform and GitHub Actions.

> "Kestra made the data mesh possible. We produce far more data now, and deliver it nearly 10 times faster." — Julien Henrion, CDO, Leroy Merlin

## The decision window

Airflow 2's end-of-life created a decision point most organizations haven't had since they first adopted orchestration. The engineering effort required for Airflow 3 is real and unavoidable. The question is what that effort buys.

For teams where Python is the lingua franca, where workflows are owned by a small, tight-knit group, and where the current operational model works, Airflow 3 is a strong path. For organizations where orchestration has grown beyond a single team, a single language, or a single use case, this moment offers something rarer: the chance to treat orchestration as architecture rather than inherited tooling — see our full [Kestra vs. Airflow comparison](/vs/airflow) and the broader [landscape of Airflow alternatives](/resources/data/airflow-alternatives).

Kestra is open source. You can [install it in five minutes](/docs/quickstart), run it alongside Airflow from day one, and evaluate the architectural model with your own workflows — no rip-and-replace, no vendor lock-in.
