---
title: Agent Skills – Operate Kestra from AI Coding Agents
h1: Give Claude Code, Cursor & Windsurf Knowledge to Generate Flows
sidebarTitle: Agent Skills
icon: /src/contents/docs/icons/ai.svg
description: Give AI coding agents like Claude Code, Cursor, and Windsurf structured knowledge to generate Kestra flows and operate Kestra environments using kestractl.
---

Teach your coding agent how to write valid Kestra flows, harden them, deploy them, and migrate to Kestra 2.0.

This page is for developers who build flows in Claude Code, Cursor, Windsurf, Codex, or another coding agent. To get AI help inside the Kestra UI instead, use [AI Copilot](../01.ai-copilot/index.md). To run AI as part of a flow, see [LLM tasks and AI agents](../05.ai-agents/index.md).

## What Agent Skills are

Agent Skills are structured knowledge files (`SKILL.md`) that give an external coding agent the context, commands, and guardrails it needs to generate valid flow YAML or operate a Kestra environment with `kestractl`. They follow the [Agent Skills](https://agentskills.io/home) format, which many coding agents support.

Skills work best alongside two other pieces:

- The [Docs MCP server](../02.kestra-mcp-resources/index.md) gives the agent live plugin schemas and docs, so it doesn't invent task properties.
- [`kestractl`](../../kestra-cli/kestractl/index.md) lets the agent validate and deploy flows against your instance.

## Available skills

Kestra publishes five skills in the [kestra-io/agent-skills](https://github.com/kestra-io/agent-skills) repository.

### kestra-flow

Generate, modify, or debug Kestra Flow YAML grounded in the live flow schema (the same approach used by Kestra's AI Copilot).

**Use when:**
- Generating a new flow from a description
- Modifying or extending an existing flow
- Debugging invalid YAML or incorrect task/trigger references

**Covers:**
- Fetching and validating against the live flow schema from `https://api.kestra.io/v1/plugins/schemas/flow`
- Schema-validated task and trigger generation
- Partial modifications that touch only the relevant part of a flow
- Guardrails: no invented types, no hardcoded secrets, correct looping and trigger patterns

**Example prompt:**

```plaintext
Use kestra-flow to write a flow that polls a REST API every 30 minutes and stores the result in KV store.
```

### kestra-flow-hardening

Audit existing flows and add production-hardening controls. The skill is **audit-first**: it produces a severity-ranked findings report with a risk, caveat, and proposed fix per finding, then applies only the edits you confirm.

**Use when:**
- Hardening one or more flows for production
- Auditing flows for resilience, idempotency, and guardrail gaps
- Adding retries, timeouts, error handling, concurrency limits, SLAs, or idempotency guards

**Covers:**
- Severity-ranked audit report (Critical / High / Medium / Low) with risk, caveat, and proposed fix per finding
- Idempotency checks: never recommends a blind retry on a non-idempotent write, and flags where a deduplication guard is needed instead
- Proportional auditing calibrated by flow signals (triggers, side-effects, namespace environment); "already sound" is a valid result
- Surgical, schema-validated edits applied on confirmation, inline and structure-preserving
- Version- and edition-aware (OSS / EE), with EE-only patterns labeled and given an OSS fallback

**Example prompt:**

```plaintext
Use kestra-flow-hardening to audit the flows in ./flows and add retries, timeouts, and failure alerting where they're missing.
```

### kestra-ops

Operate Kestra using `kestractl` for flow, execution, namespace, and namespace-file operations.

**Use when:**
- Validating or deploying flows
- Triggering executions and checking status
- Managing namespaces and namespace files (`nsfiles`)
- Configuring or switching CLI contexts

**Covers:**
- Context and auth setup (`config add`, `config use`, `config show`)
- Flow operations: list, get, validate, deploy
- Execution monitoring: run with `--wait`, get status
- Namespace file management: list, get, upload, delete
- Production guardrails: validate before deploy, confirm destructive actions, avoid exposing credentials

**Example prompt:**

```plaintext
Use kestra-ops to validate and deploy all flows in ./flows to prod.namespace with fail-fast enabled.
```

### migrate-kestra-2

Guide a Kestra 1.3 instance and its flows through the upgrade to Kestra 2.0: readiness audit, server upgrade, flow migration with `kestra-migrate`, and guided rewrites of the patterns the CLI can't automate.

**Use when:**
- Checking whether an instance is ready for 2.0
- Upgrading a Docker Compose or Kubernetes deployment to 2.0
- Triaging `kestra-migrate` warnings or flows that fail to parse after the upgrade

**Covers:**
- A readiness report with a Low, Medium, High, or Critical complexity rating
- Backup guardrails for the one-way parts of the upgrade
- A persistent migration ledger that tracks every flow to validated, deployed, or deferred
- Guided rewrites for `ForEach` and `ForEachItem` to `Loop`, trigger `conditions` to `when` and `dependsOn`, and `pluginDefaults` to Policies

**Example prompt:**

```plaintext
Use migrate-kestra-2 to check whether my dev instance is ready for Kestra 2.0 and write a readiness report.
```

The skill follows the [Kestra 2.0 migration guide](../../11.migration-guide/v2.0.0/index.mdx).

### migrate-airflow-kestra

Migrate an Apache Airflow DAG to a production-ready Kestra flow, preserving task dependencies and parallelism.

**Use when:**
- Converting an Airflow DAG (`.py`) to a Kestra flow YAML
- Translating `@task`-decorated functions or operators into Kestra tasks
- Preserving Airflow parallel execution (fan-out/fan-in) in Kestra

**Covers:**
- Reading and analysing the Airflow DAG structure, tasks, and dependencies
- Fetching the live Kestra schema from `https://api.kestra.io/v1/plugins/schemas/flow`
- Extracting Python business logic into namespace files
- Generating schema-validated Kestra flow YAML with correct task ordering and parallelism
- Mapping Airflow XCom data passing to Kestra `outputFiles`/`inputFiles`

**Example prompt:**

```plaintext
Use migrate-airflow-kestra to migrate dags/ingest_pipeline.py from Airflow to Kestra, output to kestra/.
```

## Prerequisites

- **AI coding agent**: Claude Code, Cursor, Windsurf, OpenAI Codex, OpenCode, or any agent that supports skill files
- **For kestra-flow, kestra-flow-hardening, and migrate-airflow-kestra**: `curl` and network access to `https://api.kestra.io`
- **For kestra-ops and migrate-kestra-2**: [`kestractl`](../../kestra-cli/kestractl/index.md) installed with valid credentials

## Setup

Install the skills with [skills.sh](https://skills.sh). It detects your coding agent and writes the skill files where that agent looks for them:

```bash
npx skills add kestra-io/agent-skills
```

To install a single skill, add its name: `npx skills add kestra-io/agent-skills@kestra-ops`.

### Manual installation

You can also manually download skill files from the [kestra-io/agent-skills](https://github.com/kestra-io/agent-skills) repository. Each skill is a `SKILL.md` file under `skills/<skill-name>/`.

For example, to add the `kestra-ops` skill to Claude Code:

```bash
mkdir -p .claude/skills/kestra-ops
curl -sL https://raw.githubusercontent.com/kestra-io/agent-skills/main/skills/kestra-ops/SKILL.md \
  -o .claude/skills/kestra-ops/SKILL.md
```

Repeat for any other skill you need, and use the skills directory your agent documents. Some skills ship supporting files next to `SKILL.md`, such as `references/hardening-patterns.md` in `kestra-flow-hardening`. Copy the whole skill directory so the agent can read them.

## Example workflows

### Write, validate, and deploy a flow in one prompt

With the Docs MCP server connected, the skills installed, and `kestractl` configured, one prompt covers authoring and deployment:

```plaintext
Use kestra-flow to write a flow in namespace company.data that fetches
https://api.example.com/metrics every 30 minutes and stores the response in
the KV store under the key latest_metrics. Validate it with kestractl, then
deploy it to the dev instance.
```

The agent looks up the plugin schemas on the MCP server and generates YAML with a `Schedule` trigger and an `io.kestra.plugin.core.kv.Set` task, following the skill's guardrails. It then runs `kestractl flows validate` and deploys with `kestractl flows deploy`.

### Harden a flow for production with kestra-flow-hardening

Ask your agent to audit an existing flow and add resilience controls before promoting it to production:

```plaintext
Use kestra-flow-hardening to audit ./flows/extract.yaml and add retries,
timeouts, and failure alerting where they're missing.
```

The agent produces a severity-ranked findings report, for example a missing failure alert on a scheduled flow (High) and missing retries on external HTTP calls (Medium). It then applies only the fixes you confirm and validates each edit against the live schema.

### Validate and deploy with kestra-ops

Ask your agent to validate local flow files and deploy them:

```plaintext
Use kestra-ops to validate all flows in ./flows, then deploy them to
prod.pipelines namespace with --override and --fail-fast.
```

The agent runs `kestractl flows validate ./flows/`, reports the results, and then runs `kestractl flows deploy` with the requested flags.

### Run a flow and report results with kestra-ops

Ask your agent to trigger an execution and summarize the outcome:

```plaintext
Use kestra-ops to run nightly-refresh in analytics.jobs namespace,
wait for completion, and report the execution status.
```

The agent runs `kestractl executions run analytics.jobs nightly-refresh --wait` and summarizes the result.

## Create custom skills

You can create your own skills following the same `SKILL.md` format. Each skill file should include:

- **Frontmatter** with `name`, `description`, and `compatibility`
- **When to use**: trigger conditions for the skill
- **Required inputs**: what context the agent needs
- **Workflow**: step-by-step instructions
- **Guardrails**: safety rules and constraints
- **Example prompts**: realistic usage examples

See the [contributing guidelines](https://github.com/kestra-io/agent-skills) in the repository for more details.
