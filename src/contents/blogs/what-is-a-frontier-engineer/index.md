---
title: "What Is a Frontier Engineer and why most of the job is orchestration"
description: "A new engineering role is showing up on job boards in 2026. Here is what a frontier engineer actually does, how it differs from an ML or platform engineer."
date: 2026-09-22T10:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  linkedin: https://www.linkedin.com/in/martin-pierre-roset/
  image: "mproset"
image: ./main.png
---

A new job title started appearing on job boards this year: frontier engineer. Consulting firms are hiring for it, Microsoft's Work Trend Index measures how many people already work this way, and OpenAI named its enterprise agent platform after the same word.

If you run automation, data, or platform teams, you are going to be asked what it means and whether you need one. This post explains what the role is, what it is not, what a frontier engineer does in a normal week, where the work actually happens, and how to start.

## Definition

A frontier engineer designs and runs systems in which AI agents do part of the work and humans handle the rest. They decide which steps of a process can be delegated to an agent, which must stay deterministic, how the two connect, and what happens when an agent gets it wrong.

The word "frontier" refers to the boundary between what a model can do and what an organisation is willing to let it do in production.

![Where the frontier engineer works](./01-frontier-line.png)
*One process, three kinds of steps. The ML engineer owns how good the agent is at its part; the platform team owns the runbooks and the runtime; the frontier engineer owns the lines between them and the contracts across them.*

## Frontier engineer vs. the roles you already have

The role is easier to understand by contrast.

| Role | Owns | Does not own |
|---|---|---|
| **ML engineer** | Models: training, evaluation, serving, RAG pipelines | The business process the model sits in |
| **Software engineer** | Application code and its correctness | Cross-system coordination, approvals, operations |
| **Platform / DevOps engineer** | Infrastructure, CI/CD, reliability of the platform | What runs on it and why |
| **Prompt engineer** | The instructions given to a model | Anything after the model answers |
| **Frontier engineer** | The end-to-end process: where agents act, where humans decide, how it is governed and observed | The model itself |

Five responsibilities for the frontier engineer; one is about models (RAG, vector stores) and four are about the system around them: orchestrate multi-agent systems, integrate agent outputs into production, deploy and monitor agents with guardrails, build workflows with automation tools. Microsoft's research calls the same people "Frontier Professionals" and defines them by three behaviours: using agents for multi-step work, routinely redesigning workflows, and creating shared standards for how their team works with AI. About 16% of AI users qualify.

It is the person who decides what the model is allowed to do to your systems, and builds the machinery that enforces it.

## What a frontier engineer actually does

Strip the title and the week looks like this.

**Mapping a process into agentic and fixed steps.** Take incident response. Reading logs, correlating three dashboards, and proposing a root cause is a good job for an agent: it is research, it is tolerant of a wrong first guess, and a human reviews the output. Restarting a production service is not: it must happen once, in order, with a rollback, and someone accountable. The frontier engineer draws that line for every process the team owns. A useful test for each step: *if this is wrong, who notices, how fast, and what does it cost to undo?* Cheap to notice and cheap to undo means the step can be agentic. Expensive on either count means it stays fixed, or gets a human in front of it.

**Building the connection between the two.** The agent's output has to become an input to something deterministic. That means a contract (what the agent must return, in what shape: one runbook id from a known list, not free text), a gate (who approves, with what SLA, and what happens if nobody does), and a fallback (what happens if the agent times out, returns something outside the contract, or the provider is down). The contract is where most production incidents with agents are prevented, and it is the part pilots skip.

**Giving agents tools, not access.** An agent that can call any API is a liability. An agent that can call five reviewed, versioned, permissioned operations is a colleague. Most of the frontier engineer's design work is deciding what those operations are, and making sure the agent's only path to production goes through them.

**Making it observable.** Which model, which prompt, which tools were called with which arguments, how many tokens, why it stopped. Without this, nobody can review agent performance and nobody will sign off on more autonomy. Observability is also how autonomy grows: once a gate has been approved without edits a few hundred times, the data exists to argue for removing it.

**Putting it under change control.** Who can change the workflow the agent runs. Who can change the tools it has. How a change gets from a laptop to production. This is the second part most agent pilots skip, and the reason most agent pilots stay pilots.

Microsoft's report reduces this to three questions every organisation deploying agents has to answer: who reviews agent performance, who has the authority to update the workflows agents run, and how a local win gets captured and scaled. Those three questions are the frontier engineer's job description.

## Why the work is orchestration

Look at the list above again. Sequencing steps, passing outputs to inputs, gating on human approval, retries and fallbacks, tool permissions, observability, version control, promotion to production. None of that is new. It is what a workflow orchestrator has done for data pipelines and infrastructure automation for years.

Agent frameworks handle the orchestration *inside* an agent: which tool to call next, when to loop, when to hand off to a sub-agent. They do not handle the orchestration *around* it: the deterministic steps before and after, the humans, the other systems, the audit trail. That outer layer is where the frontier engineer spends their time, and it is where a general-purpose orchestrator belongs.

We built Kestra for that outer layer, and agents fit into it the same way any other task does. Here is what the incident example looks like as a flow:

```yaml
id: incident_triage
namespace: ops.sre

inputs:
  - id: alert
    type: JSON

tasks:
  - id: triage
    type: io.kestra.plugin.ai.agent.AIAgent
    # provider injected by a namespace Policy — or add it inline, see /docs/ai-tools/ai-agents
    systemMessage: |
      You are an SRE assistant. Correlate the alert with recent deployments and logs,
      identify the most likely root cause, and propose exactly one remediation from
      the runbook list. Never execute anything yourself.
    prompt: "{{ inputs.alert }}"
    tools:
      - type: io.kestra.plugin.ai.tool.KestraFlow
        namespace: ops.runbooks
        flowId: fetch_context
      - type: io.kestra.plugin.ai.tool.StreamableHttpMcpClient
        url: "{{ secret('OBSERVABILITY_MCP_URL') }}"

  - id: approve
    type: io.kestra.plugin.core.flow.Pause
    onResume:
      - id: approved
        type: BOOL
      - id: reason
        type: STRING

  - id: remediate
    type: io.kestra.plugin.core.flow.Subflow
    runIf: "{{ outputs.approve.onResume.approved }}"
    namespace: ops.runbooks
    flowId: "{{ outputs.triage.textOutput | jq('.runbook') | first }}"
    wait: true

errors:
  - id: open_case
    type: io.kestra.plugin.kestra.ee.cases.CreateCase
    title: "Triage failed for {{ inputs.alert | jq('.service') | first }}"
    linkMatchingExecutions: true
```

![The incident_triage flow in the Kestra topology view: a triage AI agent task running on GoogleGemini, an approve Pause, a remediate subflow, and an open_case branch on failure](./02-incident-triage-flow.png)

![The same flow in plain terms: something happens, the agent proposes, a human decides, the runbook runs, and any failure opens one case instead of ten alerts](./03-flow-simple.png)
*The agent is one task. Its tools are governed flows and a read-only MCP server. The decision goes through a Pause. The remediation is a versioned subflow with its own rollback.*

The agent is one task. Its tools are other Kestra flows and an MCP server, so it can only do what those flows allow, with their permissions. The decision goes to a human through [`Pause`](/docs/how-to-guides/pause-resume), with a name and a reason recorded on the execution; in the Enterprise edition the same gate can be surfaced to approvers as a form through [Apps](/docs/enterprise/scalability/apps), so they never open the Kestra UI. The remediation is a versioned subflow with its own `errors` block. If anything fails, one [Case](/docs/enterprise/governance/cases) is opened instead of ten alerts.

The three questions have plain answers here.

**Reviewing agent performance is reviewing an execution.** The details panel of an [`AIAgent`](/docs/ai-tools/ai-agents) task shows the model and provider, the system prompt, the tools it had, and after the run the full tool-call timeline with arguments and results, token usage and estimated cost, the reasoning chain, and why the model stopped, including guardrail triggers. Counters (`ai.agent.tool.calls`, `ai.provider.calls`) go to Prometheus or OpenTelemetry like any other metric.

**Changing what agents run is a Git commit.** Flows are code; they reach production through CI and a promotion with a diff and a recorded approval. Action-level [RBAC](/docs/enterprise/auth/rbac) decides who can edit `ops.runbooks` and who can only resume a Pause. A [Policy](/docs/enterprise/governance/policies) injects the LLM provider and its guardrails into every agent task in a namespace, so no author can point an agent at an unapproved model or strip the system message. Every change lands in the [audit log](/docs/enterprise/governance/audit-logs).

**Scaling a win is copying a flow.** A flow that works for one team goes into another namespace, gets parameterised with inputs, and is published as a [blueprint](/docs/concepts/blueprints). Agents call flows as tools with [`KestraFlow`](/plugins/plugin-ai/tool/kestraflow); external agents (Claude, Cursor, your own) call Kestra flows through the [MCP server](/docs/ai-tools/mcp-server), where any flow with an [MCP tool trigger](/docs/workflow-components/triggers/mcp-tool-trigger) becomes a named, permissioned tool.

## Where to start

If you want to try the pattern here is the shortest path.

1. **Run Kestra locally.** The [quickstart](/docs/quickstart) is one Docker command; [Docker Compose](/docs/installation/docker-compose) with Postgres if you want something that survives a restart.
2. **Wire one agent task.** The [AI Agents](/docs/ai-tools/ai-agents) page has a working flow; swap the provider for yours and store the key as a [secret](/docs/concepts/secret). Give it one `KestraFlow` tool pointing at a flow you already have.
3. **Put a gate after it.** Add a `Pause` with `onResume` inputs ([how-to](/docs/how-to-guides/pause-resume)) and a deterministic task that only runs when `approved` is true.
4. **Read the execution.** Open the agent task in the topology view and look at the tool-call timeline, the token count and the finish reason. That panel is what you will show your security team.
5. **Expose a flow to your coding agent.** Point Claude Code or Cursor at the [MCP server](/docs/ai-tools/mcp-server) and add an [MCP tool trigger](/docs/workflow-components/triggers/mcp-tool-trigger) to one flow. You now have an agent outside Kestra calling a governed operation inside it.
6. **Start from a blueprint.** The [AI blueprints](/blueprints?tags=AI) cover summarisation, classification, RAG and agent-with-tools patterns; most infra and data flows in the library can be handed to an agent as a tool without changes.

Nothing above needs the Enterprise edition. Apps, Policies, RBAC, Cases and the audit log do, and they are the pieces that turn a working pattern into something a regulated team can sign off. The [OSS vs Enterprise](/docs/oss-vs-paid) page has the exact line.

## Do you need one?

If your team has more than a couple of agents in production, someone is already doing this job without the title. The useful question is whether they have the tooling for it, or whether the approvals live in Slack, the tool permissions live in an environment variable, and the audit trail is the agent's own logs.

Titles come and go. The work of deciding where agents act and where humans decide, and building the system that enforces that decision, is not going anywhere. It is orchestration, and it is now the most important orchestration in the company.

---

Sources: [Cognizant, Frontier Certified Engineer announcement](https://news.cognizant.com/2026-06-01-Cognizant-Develops-Frontier-Certified-Engineer-and-Frontier-Business-Operator-Roles-to-Define-the-Next-Generation-of-AI-Powered-Work) and [Frontier Engineer job posting](https://careers.cognizant.com/global-en/jobs/000702458411/frontier-engineer/) · [Microsoft 2026 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization) · [OpenAI Frontier](https://openai.com/index/introducing-openai-frontier/) · [Kestra AI Agents docs](/docs/ai-tools/ai-agents)

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
