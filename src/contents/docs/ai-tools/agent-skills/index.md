---
title: Agent Skills – Operate Kestra from AI Coding Agents
h1: Give Claude Code, Cursor & Windsurf Knowledge to Generate Flows
sidebarTitle: Agent Skills
icon: /src/contents/docs/icons/ai.svg
version: "1.0.0"
description: Give AI coding agents like Claude Code, Cursor, and Windsurf structured knowledge to generate Kestra flows and operate Kestra environments using kestractl.
---

Give AI coding agents structured knowledge to generate Kestra flows and operate Kestra environments.

## What are Agent Skills

Agent Skills are structured knowledge files (`SKILL.md`) that teach external AI coding agents how to work with Kestra. They provide the context, commands, and guardrails an agent needs to generate valid flow YAML or operate a Kestra environment via the CLI.

Unlike [AI Copilot](../ai-copilot/index.md), which works inside the Kestra UI, Agent Skills bring Kestra expertise to the tools you already use in your editor or terminal — Claude Code, Cursor, Windsurf, OpenAI Codex, and others.

Unlike [AI Agents](../ai-agents/index.md), which are autonomous tasks running inside Kestra flows, Agent Skills equip your external coding agent with Kestra-specific knowledge so it can help you build and operate flows from your development environment.

Agent Skills follow an emerging standard for giving AI tools domain-specific knowledge. Learn more at [agentskills.io](https://agentskills.io/home), the community hub for agent skills across tools and domains.

## Available Skills

Kestra provides multiple skills in the [kestra-io/agent-skills](https://github.com/kestra-io/agent-skills) repository.

### kestra-flow

Generate, modify, or debug Kestra Flow YAML grounded in the live flow schema — the same approach used by Kestra's AI Copilot.

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

Audit existing flows and add production-hardening controls — the consulting counterpart to `kestra-flow`. It is **audit-first**: it produces a severity-ranked findings report (risk, caveat, and proposed fix per finding), then applies only the edits you confirm.

**Use when:**
- Hardening one or more flows for production
- Auditing flows for resilience, idempotency, and guardrail gaps
- Adding retries, timeouts, error handling, concurrency limits, SLAs, or idempotency guards

**Covers:**
- Severity-ranked audit report (Critical / High / Medium / Low) with risk, caveat, and proposed fix per finding
- Idempotency judgment — never recommends a blind retry on a non-idempotent write; flags the dedup-guard vs. retry-if-safe branches
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
- **For kestra-ops**: [`kestractl`](../../kestra-cli/kestractl/index.md) installed with valid credentials

## Setup

The easiest way to install Kestra agent skills is with [skills.sh](https://skills.sh) — it auto-detects your AI coding agent and places the skill files in the right location:

```bash
npx skills add kestra-io/agent-skills
```

This works with Claude Code, Cursor, Windsurf, OpenAI Codex, and other agents that support skill files. The CLI detects which agent you’re using and installs the `SKILL.md` files into the correct directory (e.g. `.claude/skills/` for Claude Code, `.cursor/rules/` for Cursor).

### Manual installation

You can also manually download skill files from the [kestra-io/agent-skills](https://github.com/kestra-io/agent-skills) repository. Each skill is a `SKILL.md` file under `skills/<skill-name>/`.

For example, to add the `kestra-ops` skill to Claude Code:

```bash
mkdir -p .claude/skills/kestra-ops
curl -sL https://raw.githubusercontent.com/kestra-io/agent-skills/main/skills/kestra-ops/SKILL.md \
  -o .claude/skills/kestra-ops/SKILL.md
```

Repeat for any other skill you need (e.g. `kestra-flow`). Adjust the target directory for your agent — `.cursor/rules/` for Cursor, `.agents/skills/` for OpenAI Codex, etc. Some skills ship supporting files alongside `SKILL.md` (for example, `kestra-flow-hardening` includes `references/hardening-patterns.md`) — copy the whole skill directory so those files are available. Using `skills.sh` handles this automatically.

## Example Workflows

### Generate a flow with kestra-flow

Ask your agent to create a flow that polls an API on a schedule and persists the result:

```plaintext
Use kestra-flow to write a flow in namespace company.data that fetches
https://api.example.com/metrics every 30 minutes and stores the response
in KV store under the key "latest_metrics".
```

The agent will fetch the live schema, generate valid YAML with a `Schedule` trigger and `io.kestra.plugin.core.kv.Set` task, and output ready-to-deploy flow code.

### Harden a flow for production with kestra-flow-hardening

Ask your agent to audit an existing flow and add resilience controls before promoting it to production:

```plaintext
Use kestra-flow-hardening to audit ./flows/extract.yaml and add retries,
timeouts, and failure alerting where they're missing.
```

The agent will produce a severity-ranked findings report — for example, flagging missing retries on external HTTP calls (Medium), a silent fallback masking a geocoding failure (data-correctness risk), and no failure alerting on a scheduled flow (High) — then apply only the fixes you confirm, validating each edit against the live schema.

### Validate and deploy with kestra-ops

Ask your agent to validate local flow files and deploy them:

```plaintext
Use kestra-ops to validate all flows in ./flows, then deploy them to
prod.pipelines namespace with --override and --fail-fast.
```

The agent will run `kestractl flows validate ./flows/`, confirm results, and then run `kestractl flows deploy` with the requested flags.

### Run a flow and report results with kestra-ops

Ask your agent to trigger an execution and summarize the outcome:

```plaintext
Use kestra-ops to run nightly-refresh in analytics.jobs namespace,
wait for completion, and report the execution status.
```

The agent will run `kestractl executions run analytics.jobs nightly-refresh --wait`, then summarize the execution result.

## Creating Custom Skills

You can create your own skills following the same `SKILL.md` format. Each skill file should include:

- **Frontmatter** with `name`, `description`, and `compatibility`
- **When to use** — trigger conditions for the skill
- **Required inputs** — what context the agent needs
- **Workflow** — step-by-step instructions
- **Guardrails** — safety rules and constraints
- **Example prompts** — realistic usage examples

See the [contributing guidelines](https://github.com/kestra-io/agent-skills) in the repository for more details.
