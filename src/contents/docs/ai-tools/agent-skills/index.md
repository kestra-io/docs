---
title: Agent Skills – Operate Kestra from AI Coding Agents
sidebarTitle: Agent Skills
icon: /src/contents/docs/icons/ai.svg
version: "1.0.0"
description: Give AI coding agents like Claude Code, Cursor, and Windsurf structured knowledge to generate Kestra flows and operate Kestra environments using kestractl.
---

Give AI coding agents structured knowledge to generate Kestra flows and operate Kestra environments.

## What are Agent Skills

Agent Skills are `SKILL.md` files that teach external AI coding agents how to build and operate Kestra flows. Each skill bundles schema rules, safe commands, and guardrails so agents generate valid flow YAML or run Kestra via the CLI without hardcoded secrets.

They differ from [AI Copilot](../ai-copilot/index.md) (in-UI assistance) and from [AI Agents](../ai-agents/index.md) (autonomous tasks inside flows); Agent Skills simply give your editor or terminal agent — Claude Code, Cursor, Windsurf, OpenAI Codex, and others — the Kestra know‑how it needs.

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

Download the `SKILL.md` into your agent’s rules/skills folder; pick one of the agent-specific recipes below. Skills live in the [repository](https://github.com/kestra-io/agent-skills) under `skills/<skill-name>/`.

The base URL for raw skill files is:

```text
https://raw.githubusercontent.com/kestra-io/agent-skills/main/skills/<skill-name>/SKILL.md
```

### Claude Code

Download skills into your project's `.claude/skills/` directory:

```bash
mkdir -p .claude/skills
for skill in kestra-flow kestra-ops; do
  curl -sL https://raw.githubusercontent.com/kestra-io/agent-skills/main/skills/$skill/SKILL.md \
    -o .claude/skills/$skill/SKILL.md
done
```

To make skills available across all your projects, use `~/.claude/skills/` instead.

See the [Claude Code Skills documentation](https://code.claude.com/docs/en/skills) for more details.

### Cursor

Copy skills into `.cursor/rules/`:

```bash
mkdir -p .cursor/rules
for skill in kestra-flow kestra-ops; do
  curl -sL https://raw.githubusercontent.com/kestra-io/agent-skills/main/skills/$skill/SKILL.md \
    -o .cursor/rules/$skill.md
done
```

### OpenAI Codex

Download skills into your project's `.agents/skills/` directory:

```bash
mkdir -p .agents/skills
for skill in kestra-flow kestra-ops; do
  curl -sL https://raw.githubusercontent.com/kestra-io/agent-skills/main/skills/$skill/SKILL.md \
    -o .agents/skills/$skill/SKILL.md
done
```

For personal skills available across all projects, use `~/.agents/skills/` instead. See the [Codex Skills documentation](https://developers.openai.com/codex/skills) for more details.

### Other agents

Clone the repository and point your agent to the skill files you need:

```bash
git clone https://github.com/kestra-io/agent-skills.git
```

Then reference `agent-skills/skills/kestra-flow/SKILL.md` or `agent-skills/skills/kestra-ops/SKILL.md` in your agent's context or configuration.

## Example Workflows

### Generate a flow with kestra-flow

Ask your agent to create a flow that polls an API on a schedule and persists the result:

```text
Use kestra-flow to write a flow in namespace company.data that fetches
https://api.example.com/metrics every 30 minutes and stores the response
in KV store under the key "latest_metrics".
```

The agent fetches the live schema, generates valid YAML with a `Schedule` trigger and `io.kestra.plugin.core.kv.Set` task, and outputs ready-to-deploy flow code.

### Validate and deploy with kestra-ops

Ask your agent to validate local flow files and deploy them:

```text
Use kestra-ops to validate all flows in ./flows, then deploy them to
prod.pipelines namespace with --override and --fail-fast.
```

The agent validates locally, then deploys with `--override --fail-fast` using `kestractl flows deploy`.

### Run a flow and report results with kestra-ops

Ask your agent to trigger an execution and summarize the outcome:

```text
Use kestra-ops to run nightly-refresh in analytics.jobs namespace,
wait for completion, and report the execution status.
```

The agent runs `kestractl executions run ... --wait`, then summarizes the execution result.

## Creating Custom Skills

You can create your own skills following the same `SKILL.md` format. Each skill file should include:

- **Frontmatter** with `name`, `description`, and `compatibility`
- **When to use** — trigger conditions for the skill
- **Required inputs** — what context the agent needs
- **Workflow** — step-by-step instructions
- **Guardrails** — safety rules and constraints
- **Example prompts** — realistic usage examples

See the [contributing guidelines](https://github.com/kestra-io/agent-skills) in the repository for more details.
