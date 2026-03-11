---
title: Agent Skills – Operate Kestra from AI Coding Agents
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

Kestra provides two skills in the [kestra-io/agent-skills](https://github.com/kestra-io/agent-skills) repository.

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

```text
Use kestra-flow to write a flow that polls a REST API every 30 minutes and stores the result in KV store.
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

```text
Use kestra-ops to validate and deploy all flows in ./flows to prod.namespace with fail-fast enabled.
```

## Prerequisites

- **AI coding agent**: Claude Code, Cursor, Windsurf, OpenAI Codex, OpenCode, or any agent that supports skill files
- **For kestra-flow**: `curl` and network access to `https://api.kestra.io`
- **For kestra-ops**: [`kestractl`](../kestra-cli/kestractl/index.md) installed with valid credentials

## Setup

Install Kestra agent skills using [skills.sh](https://skills.sh) — it auto-detects your AI coding agent and places the skill files in the right location:

```bash
npx skills add kestra-io/agent-skills
```

This works with Claude Code, Cursor, Windsurf, OpenAI Codex, and other agents that support skill files. The CLI detects which agent you’re using and installs the `SKILL.md` files into the correct directory (e.g. `.claude/skills/` for Claude Code, `.cursor/rules/` for Cursor).

You can also browse all available skills in the [kestra-io/agent-skills](https://github.com/kestra-io/agent-skills) repository.

## Example Workflows

### Generate a flow with kestra-flow

Ask your agent to create a flow that polls an API on a schedule and persists the result:

```text
Use kestra-flow to write a flow in namespace company.data that fetches
https://api.example.com/metrics every 30 minutes and stores the response
in KV store under the key "latest_metrics".
```

The agent will fetch the live schema, generate valid YAML with a `Schedule` trigger and `io.kestra.plugin.core.kv.Set` task, and output ready-to-deploy flow code.

### Validate and deploy with kestra-ops

Ask your agent to validate local flow files and deploy them:

```text
Use kestra-ops to validate all flows in ./flows, then deploy them to
prod.pipelines namespace with --override and --fail-fast.
```

The agent will run `kestractl flows validate ./flows/`, confirm results, and then run `kestractl flows deploy` with the requested flags.

### Run a flow and report results with kestra-ops

Ask your agent to trigger an execution and summarize the outcome:

```text
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
