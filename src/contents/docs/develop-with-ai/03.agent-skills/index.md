---
title: "Agent Skills for Kestra: Teach Coding Agents to Write Flows"
h1: Teach Your Coding Agent to Write and Deploy Kestra Flows
sidebarTitle: Agent Skills
icon: /src/contents/docs/icons/ai.svg
description: Give AI coding agents like Claude Code, Cursor, and Windsurf structured knowledge to generate Kestra flows and operate Kestra environments using kestractl.
---

Teach your coding agent how to write valid Kestra flows, harden them, deploy them, and migrate to Kestra 2.0.

This page is for developers who build flows in Claude Code, Cursor, Windsurf, Codex, or another coding agent. To get AI help inside the Kestra UI instead, use [AI Copilot](../01.ai-copilot/index.md). To run AI as part of a flow, see [LLM tasks and AI agents](../../ai-orchestration/01.ai-agents/index.md).

## What Agent Skills are

Agent Skills are structured knowledge files (`SKILL.md`) that give an external coding agent the context, commands, and guardrails it needs to generate valid flow YAML or operate a Kestra environment with [`kestractl`](../../kestra-cli/kestractl/index.md#installation). They follow the [Agent Skills](https://agentskills.io/home) format, which many coding agents support.

Skills work best alongside two other pieces:

- The [Docs MCP server](../02.kestra-mcp-resources/index.md) gives the agent live plugin schemas and docs, so it doesn't invent task properties.
- [`kestractl`](../../kestra-cli/kestractl/index.md) lets the agent validate and deploy flows against your instance.

## Available skills

Kestra publishes five skills in the [kestra-io/agent-skills](https://github.com/kestra-io/agent-skills) repository.

### kestra-flow

Generate, modify, or debug Kestra Flow YAML grounded in live plugin schemas, with the same guardrails as Kestra's AI Copilot.

**Use when:**
- Generating a new flow from a description
- Modifying or extending an existing flow
- Debugging invalid YAML or incorrect task/trigger references

**Covers:**
- Fetching the schema of each task and trigger type on demand from the [Docs MCP server](../02.kestra-mcp-resources/index.md), then validating the whole flow, instead of downloading the full flow schema
- Using your Kestra instance's own schema instead when you have one, so the flow matches your version and installed plugins
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
- **For kestra-flow**: the [Docs MCP server](../02.kestra-mcp-resources/index.md) connected to your agent. Installing the skills as a [plugin](#install-as-a-plugin) connects it. Installing them with skills.sh or copying them manually doesn't, so add the server to your agent yourself.
- **For kestra-flow-hardening and migrate-airflow-kestra**: `curl` and network access to `https://api.kestra.io`
- **For kestra-ops and migrate-kestra-2**: [`kestractl`](../../kestra-cli/kestractl/index.md) installed with valid credentials

## Setup

Install the skills with [skills.sh](https://skills.sh). It detects your coding agent and writes the skill files where that agent looks for them:

```bash
npx skills add kestra-io/agent-skills
```

To install a single skill, add its name: `npx skills add kestra-io/agent-skills@kestra-ops`.

### Install as a plugin

Claude Code, Codex, and Cursor can also install the skills as a plugin that bundles all of them and connects the [Docs MCP server](../02.kestra-mcp-resources/index.md) that `kestra-flow` needs.

In Claude Code, add the repository as a plugin marketplace, then install the `kestra` plugin from it:

```text
/plugin marketplace add kestra-io/agent-skills
/plugin install kestra@kestra-agent-skills
```

The skills are namespaced as `kestra:<skill>`, for example `kestra:kestra-flow`. Run `/skills` to check that they're listed. The plugin follows the repository's `main` branch, so each new commit there counts as a plugin update.

In Codex, run the same two steps from the command line, then start a new Codex session:

```bash
codex plugin marketplace add kestra-io/agent-skills
codex plugin add kestra@kestra-agent-skills
```

In Cursor, add the plugin, then check that the skills appear under **Settings → Rules, Skills, Subagents**:

```text
/add-plugin kestra-io/agent-skills
```

Kestra isn't in the ChatGPT plugin directory yet. To try the plugin in the ChatGPT desktop app, clone the [repository](https://github.com/kestra-io/agent-skills), add it as a repository marketplace, restart the app, and install **Kestra** from the Plugins directory. Workspace admins can then publish it to the workspace from **Plugins → Personal**. In ChatGPT, `kestra-flow`, `kestra-flow-hardening`, and `migrate-airflow-kestra` work when web access is on, and `migrate-kestra-2` only gives guidance. `kestra-ops` isn't available, since it needs a shell to run `kestractl`.

### Manual installation

You can also manually download skill files from the [kestra-io/agent-skills](https://github.com/kestra-io/agent-skills) repository. Each skill is a `SKILL.md` file under `skills/<skill-name>/`.

For example, to add the `kestra-ops` skill to Claude Code:

```bash
mkdir -p .claude/skills/kestra-ops
curl -sL https://raw.githubusercontent.com/kestra-io/agent-skills/main/skills/kestra-ops/SKILL.md \
  -o .claude/skills/kestra-ops/SKILL.md
```

Repeat for any other skill you need, and use the skills directory your agent documents. Some skills ship supporting files next to `SKILL.md`, such as `references/hardening-patterns.md` in `kestra-flow-hardening`. Copy the whole skill directory so the agent can read them.

## Usage data

The skills send anonymous usage data so Kestra can see which skills people use. It's metadata only, never the content of your prompts, flows, files, or credentials:

- When a skill runs `kestractl`, the `kestractl` usage event records which skill called it.
- With a plugin install, each request to the Docs MCP server carries an `X-Kestra-Plugin: agent-skills/<agent>` header.
- In Claude Code, the plugin sends an event when one of its skills loads, with the skill name, the plugin's Git reference, the operating system and architecture, and a random anonymous ID.

To turn off the `kestractl` data and the Claude Code event, set `KESTRACTL_TELEMETRY_DISABLED=true`. To turn off only the Claude Code event, set `KESTRA_SKILLS_TELEMETRY_DISABLED=true`. The MCP header can't be turned off with a variable: remove the `headers` entry from the plugin's MCP configuration (`.mcp.json` for Claude Code, `mcp.json` for Codex, `.cursor-plugin/mcp.json` for Cursor), or connect the Docs MCP server yourself instead of through the plugin.

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
