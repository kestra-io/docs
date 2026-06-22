---
title: "Context Engineering in Practice: How We Automated Plugin Development at Kestra"
description: "How Kestra's Plugins & Ecosystem Squad introduced Context Engineering to automate the full plugin development lifecycle — from GitHub issue to merged PR — cutting delivery time from 4 hours to 30 minutes using structured AI agents and human-in-the-loop approval gates."
date: 2026-06-25T09:00:00
category: Solutions
author:
  name: François Delbrayelle
  linkedin: https://www.linkedin.com/in/fdelbrayelle/
  twitter: "@fdelbrayelle"
  image: fdelbrayelle
  role: Lead Software Engineer
image: ./main.png
---

At Kestra, building a new plugin feature typically involves the same repeatable steps every time: read the issue, design an approach, write the code, run the tests, open a pull request, get it reviewed, run end-to-end QA, and finally ship. A senior engineer can do this in around four hours. Not because the work is hard, but because it is thorough.

We asked a different question: what if we kept the thoroughness and removed the repetition?

This post describes how the Plugins & Ecosystem Squad introduced **Context Engineering** into its development workflow — and what happened when we let AI agents handle the mechanical parts while humans stayed in control of the decisions that actually matter.

I presented this approach at [DevLille 2026](https://github.com/fdelbrayelle/workflow-superpowers). Everything you read here is reproducible and transferable to your own team.

## Why Prompt Engineering is Not Enough

Prompt engineering is about crafting the right question. Context Engineering is about building the right environment.

A well-prompted agent can write a Kestra task that compiles. A context-engineered agent can write one that follows Kestra plugin conventions, passes the test suite, handles edge cases correctly, includes YAML usage examples, and creates a pull request with the right reviewer team and a valid issue link in the body — on the first attempt.

The difference is not cleverness. It is structure: explicit domain knowledge encoded as **Skills** (focused markdown instruction sets), deterministic **workflow steps** with numbered sequence and clear success conditions, **feedback loops** that send QA failures back to the developer agent for correction, and **human approval gates** at the decisions that matter.

This combination is what we call Context Engineering. It does not replace developer judgment — it channels it into the right moments.

## The Entrypoint: GitHub Issues as Machine-Readable Specs

The workflow starts where all feature work starts: a GitHub issue.

We write issues differently now. A good issue for this workflow is a complete business and technical specification in markdown. It includes a description of the desired behavior, acceptance criteria as a checklist, and one or more YAML usage examples showing what a correct implementation looks like from the user's perspective. No ambiguity. No "we'll figure it out during implementation."

This dual-audience design is intentional. A human engineer can read the issue and understand what to build. An AI agent can parse the same file and extract acceptance criteria, affected plugin classes, edge cases to handle, and expected outputs.

The issue is not a ticket. It is the contract.

## The AI Maturity Framework

Before describing the workflow, it helps to know where we are on the map.

We think about agentic AI adoption in levels:

| Level | Description |
|-------|-------------|
| L1 | Manual UI prompts — copy-paste in a chat interface |
| L2 | Augmented — copilot suggestions inline while coding |
| L3 | Scripted — deterministic, human-designed automation |
| **L4a** | **Supervised Agentic — dynamic multi-agent with human approval gates** |
| L4b | Autonomous — unsupervised agents |
| L5a | Self-optimizing — agents that update their own instructions |
| L5b | Self-authoring — agents that create new agents |

The Plugins & Ecosystem Squad operates at **L4a**. Agents handle execution; humans own decisions. The approval gates are explicit checkpoints, not accidental pauses.

## The Workflow in Five Phases

### Phase 0 — Planning

An engineer runs `/kestra-plugin-planning` with an issue URL. A planning agent reads the issue, queries the Kestra MCP server for relevant task schemas and blueprints, and generates a structured plan covering:

- **Design** — architectural approach and any tradeoffs
- **Tasks** — implementation steps as a checklist
- **Edge Cases** — boundary conditions the implementation must handle
- **Docs Impact** — whether user-facing documentation needs updating

The plan is posted as a GitHub comment on the issue. No code is written at this stage.

The engineer reads the plan, asks questions, requests changes, or accepts it. When the plan is correct, they comment exactly `/plan-approved` on the issue.

### Phase 1 — Approval Gate

Before any implementation begins, the orchestrator verifies two things:

1. An exact `/plan-approved` comment body exists on the issue (partial matches do not count)
2. The commenter is a member of the `kestra-io` GitHub organization

If either check fails, the workflow stops with a clear error message. This is not a formality. It is the mechanism that keeps humans in control of what gets built and who authorized it.

### Phase 2 — Implementation

Once approved, a developer agent runs a full batch implementation. It reads the issue and the approved plan, writes the code, runs the test suite, and opens a pull request — all in one session.

The agent follows strict conventions throughout: correct `@Schema` annotations for UI generation, proper `@Plugin` metadata, TDD where tests can be written before implementation, no gratuitous abstractions, and backward compatibility as a default assumption.

After tests pass, a code review agent reads the full branch diff and returns one of three verdicts: **APPROVE**, **REQUEST CHANGES**, or **BLOCK**. REQUEST CHANGES triggers another implementation cycle. BLOCK stops the workflow and surfaces the problem for human review. There is a five-cycle retry limit — an infinite loop is not a recovery strategy.

### Phase 3 — QA

A QA skill runs browser-based end-to-end tests against Kestra Enterprise Edition. It exercises the scenarios described in the issue's acceptance criteria, validates the plugin behavior from a user perspective, and returns a **PASS** or **FAIL** report.

On FAIL, the failing scenarios are routed back to the developer agent as a new implementation cycle. The loop continues until QA passes or the retry limit is reached.

Complexity classification shapes the depth of testing. A simple new property on an existing task gets lighter coverage than a new task with multi-format output processing.

### Phase 4 — Ship

The final step assesses whether user-facing documentation needs updating, performs a final cumulative PR review, and prepares the PR for human merge. The squad member reviews the generated pull request, asks any remaining questions, and merges when satisfied.

The release itself — publishing the plugin to the registry — stays with the human. That one stays intentional.

## What the Numbers Look Like

For a medium-complexity feature — a new Kestra task with CSV and JSON processing, full tests, and YAML usage examples:

| | Manual | With agents |
|--|--------|-------------|
| Time | ~4 hours | ~30 minutes |
| Speedup | — | **~8×** |
| Cost per issue | — | ~$1.65 (≈340K input tokens) |

The cost figure covers the full cycle: planning, implementation, code review, and QA. The token distribution is skewed toward the developer agent and QA, which together consume about 70% of the budget.

But the headline number undersells the change. With a manual process, engineers routinely skip or compress some steps — planning gets light, code review skims, QA covers the happy path. With agents, every issue gets thorough planning, detailed code review, and comprehensive QA. The quality floor rises, not just the speed.

## How the Knowledge is Structured

The agents work because the knowledge they need is explicit.

A central hub holds the Skills and agent definitions. Skills are markdown instruction files, each under 500 lines, encoding one area of domain expertise: plugin coding conventions, PR conventions, QA testing strategy, documentation impact criteria. Agent definitions are system prompts that reference the relevant Skills and describe the agent's identity, responsibilities, and constraints.

This structure has a few important properties. Skills are composable — the developer agent and the code reviewer agent both reference the shared plugin guidelines, so they operate from the same conventions without duplication. Skills are version-controlled, so changes are reviewable and reversible. And Skills are tool-agnostic at the source level — a build step generates tool-specific formats for Claude Code and OpenCode from a single markdown source.

No agent in this system has implicit knowledge about Kestra plugin conventions. Everything it knows, it was told — explicitly, in writing, by engineers who have shipped plugins.

## The Human Role After Context Engineering

The most common concern when introducing AI agents into a development workflow is that developers become passive. The opposite happened.

The developer's role shifted from typing code to curating context. Writing issue specs that are complete enough to be machine-parseable is harder than writing vague tickets. Reviewing a generated plan critically is faster than writing it from scratch, but requires genuine domain expertise to do well. Reviewing a generated pull request that already passes tests and QA requires a different kind of attention — less syntax, more semantics.

The human touchpoints that remain are exactly the ones that should remain:
- Writing and refining the specification
- Approving the implementation plan
- Reviewing the generated pull request
- Merging and releasing to production

Agents handle execution. Humans own decisions. That distinction is not a compromise — it is the design.

## What Transfers to Your Team

The specific agents and skills we built encode Kestra plugin conventions. They will not transfer directly to a team building a different kind of software. The methodology will.

Every team has domain knowledge that currently lives in senior engineers' heads. Context Engineering externalizes that knowledge into structured, executable form. The process is the same regardless of domain:

1. Identify the repeatable workflow
2. Map the human decision points that must stay human
3. Encode the domain knowledge as explicit Skills
4. Wire the Skills into a sequential workflow with feedback loops
5. Test against real issues until the output quality matches what a senior engineer would produce

The workflow presented here — planning, approval gate, batch implementation, automated code review, browser QA, ship — is a starting template, not a final answer. Every squad will tune it to their own conventions, their own quality bar, their own definition of done.

## What We Are Building Toward

The current workflow sits at L4a: supervised agentic, with explicit human approval gates. The logical next step is reducing friction at the gates that have proven reliable enough to trust — not removing oversight, but relocating it to the moments where it creates the most value.

Longer term, the most interesting direction is self-optimization: agents that emit telemetry about where plans fail, where QA finds the most issues, where code review catches the most problems — and propose improvements to the Skills that govern their own behavior. That is L5a. We are not there yet. But the architecture is designed to get there.

---

The full talk, demo recordings, and the slides from DevLille 2026 are available at [github.com/fdelbrayelle/workflow-superpowers](https://github.com/fdelbrayelle/workflow-superpowers). The repository includes asciinema recordings of a live planning and implementation session on a real Kestra issue.

If you are building something similar for your own team, reach out. Context Engineering is more useful when the methodology is shared.
