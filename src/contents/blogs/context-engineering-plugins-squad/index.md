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

At Kestra, building a new plugin feature involves the same repeatable steps every time: read the issue, design an approach, write the code, run the tests, open a pull request, get it reviewed, run QA, and ship. A senior engineer can do this in around four hours — not because the work is hard, but because it is thorough.

We asked a different question: what if we kept the thoroughness and removed the repetition?

This post describes how the Plugins & Ecosystem Squad introduced **Context Engineering** into its development workflow, and what happened when we let AI agents handle the mechanical parts while humans stayed in control of the decisions that actually matter.

I presented this approach at [DevLille 2026](https://github.com/fdelbrayelle/workflow-superpowers), with live terminal recordings of a full cycle on a real Kestra issue.

## Why Prompt Engineering Is Not Enough

Prompt engineering is about crafting the right question. Context Engineering is about building the right environment.

A well-prompted agent can write a Kestra task that compiles. A context-engineered agent can write one that follows Kestra plugin conventions, passes the test suite, handles edge cases correctly, includes YAML usage examples, and creates a pull request with the right reviewer team and a valid issue link in the body — on the first attempt.

The difference is not cleverness. It is structure: explicit domain knowledge encoded as **Skills** (focused markdown instruction sets under 500 lines each), deterministic workflow steps with clear success conditions, feedback loops that route QA failures back to the developer agent for correction, and **human approval gates** at the decisions that create the most value.

This is Context Engineering. It does not replace developer judgment — it channels it into the right moments.

## The Agentic AI Maturity Model

Before describing the workflow, it helps to locate where we are. We map agentic AI adoption across six levels:

| Level | Name | Description |
|-------|------|-------------|
| L1 | Manual | Prompts typed into a chat UI. Copy-paste driven. |
| L2 | Augmented | Copilot suggestions inline while a human codes. |
| L3 | Scripted | Deterministic, human-designed automation — fixed steps, no agent autonomy. |
| **L4a** | **Supervised Agentic** | **Dynamic multi-agent workflows with explicit human approval gates.** |
| L4b | Autonomous Agentic | Agents run end-to-end without human checkpoints. |
| L5a | Self-Optimizing | Agents emit telemetry and propose improvements to their own Skills. |
| L5b | Self-Authoring | Agents create new agents and Skills from scratch. |

The Plugins & Ecosystem Squad operates at **L4a**. Agents handle execution; humans own decisions. Every approval gate is an explicit checkpoint — not an accidental pause.

Most teams skip directly from L2 to L3 and stall there, because scripted automation breaks when requirements change. The jump to L4a — where agents adapt dynamically within a structured context — is where real productivity gains begin.

## The Entrypoint: GitHub Issues as Machine-Readable Specs

The workflow starts where all feature work starts: a GitHub issue.

We write issues differently now. A good issue for this workflow is a complete business and technical specification in markdown. It includes:
- A description of the desired behavior
- Acceptance criteria as a checklist
- One or more YAML usage examples showing what a correct implementation looks like from the user's perspective

This dual-audience design is intentional. A human engineer can read the issue and understand what to build. An AI agent can parse the same file and extract acceptance criteria, affected plugin classes, edge cases to handle, and expected outputs. No ambiguity. No "we'll figure it out during implementation."

The issue is not a ticket. It is the contract.

## The Workflow: Who Does What, and When

Here is the full lifecycle, with the exact skills and agents at each step.

### Step 1 — Write the Issue `/kestra-plugin-managing-issues`

**Actor: any squad member (human)**

The squad member runs `/kestra-plugin-managing-issues` with a description or an existing issue URL. The skill asks whether this is a new feature, a bug fix, or a reformat of an existing issue, then generates a fully structured GitHub issue body following Kestra plugin conventions — acceptance criteria, YAML examples, affected tasks — and posts it to the correct repository.

The issue becomes the contract for everything that follows. Weak spec in, weak output out.

### Step 2 — Generate the Plan `/kestra-plugin-planning`

**Actor: any squad member (human) → agent**

The squad member runs `/kestra-plugin-planning` with the issue URL. A planning agent reads the issue, queries the [Kestra MCP server](/blogs/kestra-mcp-docs) for relevant task schemas and blueprints, and generates a structured implementation plan covering four sections:

- **Design** — architectural approach and tradeoffs
- **Tasks** — implementation steps as a checklist
- **Edge Cases** — boundary conditions the implementation must handle
- **Docs Impact** — whether user-facing documentation needs updating

The plan is posted as a comment on the GitHub issue. No code is written at this stage. The squad member reads the plan, asks questions if needed, and — when satisfied — posts exactly `/plan-approved` on the issue.

### Step 3 — Approval Gate `/plan-approved`

**Actor: any kestra-io org member (human)**

This step does not require a skill. The approver posts `/plan-approved` as a comment on the issue. That is all.

Before implementation begins, the orchestrator verifies two things:
1. An **exact** `/plan-approved` comment body exists (partial matches are rejected)
2. The commenter is a verified member of the `kestra-io` GitHub organization

Both checks are hard gates. If either fails, the workflow stops with a clear error message. This is not a formality — it is the mechanism that keeps humans in control of what gets built and who authorized it. The approver can be a different person than the one who wrote the issue or ran the planning step.

### Step 4 — Implement `/kestra-plugin-implementing` or `/kestra-plugin-implementing-multiple`

**Actor: any squad member (human) → orchestrator → sub-agents**

The squad member runs one of two skills depending on the scope:

- **`/kestra-plugin-implementing <issue-url>`** — single issue, sequential execution
- **`/kestra-plugin-implementing-multiple <issue-url-1> <issue-url-2> ...`** — multiple approved issues run in parallel via an agent team, one teammate per issue

Again, this can be a different person than the ones who wrote the issue or approved the plan.

Once the orchestrator confirms the approval gate, it drives three sub-agents in sequence:

#### `kestra-plugin-developer` — the coder

Reads the issue and the approved plan. Implements the full feature in one batch: writes the code, runs the Gradle test suite, fixes any failures within the same session, and opens a pull request with the correct reviewer team (`kestra-io/plugins`), a `closes:` link to the issue, and a description that matches what was implemented.

#### `kestra-plugin-code-reviewer` — the reviewer

Reviews the full cumulative branch diff across **four independent tracks**:

| Track | What it checks |
|-------|----------------|
| **Business Requirements** | Does the implementation actually address the acceptance criteria from the issue? Any gaps, scope creep, or missing cases? |
| **Kestra Guidelines** | Correct `@Schema` annotations, proper `@Plugin` metadata, TDD conventions, backward compatibility — the shared coding standards that the developer agent also follows. |
| **Security (OWASP Top 10)** | Tenant isolation, secrets in logs, Pebble template injection, unsafe deserialization, vulnerable dependencies introduced without justification, and more — applied to every changed file in the Java/Kestra context. |
| **Performance** | Memory leaks from unclosed streams, unbounded allocation, O(n²) loops over user-controlled collections, thread-safety on shared state, blocking calls where async is available, regex compiled per iteration instead of as a static constant. |

The reviewer returns one of three verdicts: **APPROVE**, **REQUEST CHANGES**, or **BLOCK**. REQUEST CHANGES triggers another implementation cycle. BLOCK surfaces the problem for human review. A five-cycle retry limit prevents infinite loops.

#### `/kestra-plugin-doing-qa` — end-to-end testing

Runs browser-based QA against Kestra Enterprise Edition, exercising the scenarios from the issue's acceptance criteria. Complexity classification (Simple / Standard / Complex) determines the depth of coverage. On FAIL, the failing scenarios route back to the developer agent for a correction cycle.

### Step 5 — Review, Merge, and Release

**Actor: squad member (human)**

The human reviews the generated pull request. The PR arrives with a reviewed diff, passing tests, and a QA report — not raw output to triage. The reviewer focuses on semantics and product judgment, not syntax.

When satisfied, they merge and release via the Plugins Devtools. The release stays with the human — intentionally.

## What the Numbers Look Like

For a medium-complexity feature — a new Kestra task with CSV and JSON processing, full tests, and YAML usage examples:

| | Manual | With agents |
|--|--------|-------------|
| Time | ~4 hours | ~30 minutes |
| Speedup | — | **~8×** |
| Cost per issue | — | ~$1.65 (≈340K input tokens) |

The cost figure covers the full cycle: planning, implementation, code review, and QA. The developer agent and QA together consume about 70% of the token budget.

But the headline number understates the change. Manual processes routinely compress some steps under time pressure — planning gets light, code review skims, QA covers only the happy path. With agents, every issue gets thorough planning, detailed review across four tracks, and comprehensive QA. The quality floor rises alongside the speed.

## How the Knowledge Is Structured

The agents work because the knowledge they need is explicit and version-controlled.

A central hub holds all Skills and agent definitions. The developer agent and the code reviewer agent both reference the same shared Kestra plugin guidelines — so they operate from identical conventions without duplication. When a convention changes, one file changes and both agents pick it up immediately.

Skills are tool-agnostic at the source level. A build step generates Claude Code and OpenCode formats from a single markdown source, so the same knowledge works across AI coding tools.

No agent has implicit knowledge about Kestra plugin conventions. Everything it knows, it was told — explicitly, in writing, by engineers who have shipped plugins.

## The Human Role After Context Engineering

The developer's role shifted from typing code to curating context.

Writing issue specs that are complete enough to be machine-parseable is harder than writing vague tickets. Reviewing a generated plan critically is faster than writing it from scratch, but requires genuine domain expertise. Reviewing a pull request that already passes tests and QA requires a different kind of attention — less syntax, more semantics.

The human touchpoints that remain are the ones that should remain:

| Step | Who | What |
|------|-----|------|
| Write the issue | Any squad member | Spec authoring with `/kestra-plugin-managing-issues` |
| Approve the plan | Any kestra-io org member | `/plan-approved` comment on the issue |
| Trigger implementation | Any squad member | `/kestra-plugin-implementing` or `-multiple` |
| Review and merge | Squad member | PR review, merge, release |

Agents handle execution. Humans own decisions.

## Going Further: L4b and L5a

The current workflow sits at L4a — supervised agentic, with explicit human approval gates. Two natural next levels are within reach.

### L4b — Autonomous Agentic

At L4a, humans approve plans and review PRs. At L4b, those gates are selectively removed for classes of issues that have demonstrated reliable output quality. A bug fix with a clearly reproducible test case may not need a plan approval step. A documentation-only change may not need human PR review before merge.

The path to L4b is evidence-based: instrument each gate, measure how often human feedback changes the outcome, and remove gates where the change rate is below a meaningful threshold. Every gate that stays is a gate that earns its place.

The release gate — human merge and publish — is the last to go, and may never go. Autonomous release capability requires a level of trust in end-to-end correctness that takes time to establish and can only be built incrementally.

### L5a — Self-Optimizing

At L5a, agents emit structured telemetry about where they struggle. Planning agents flag issues where the spec was ambiguous. Developer agents flag patterns where the first implementation consistently fails code review. QA agents flag scenarios that reliably surface failures.

That telemetry becomes the input for Skill improvement proposals. An L5a system does not just execute the workflow — it identifies which parts of the workflow produce the most errors and proposes concrete edits to the Skills that govern those parts. A human reviews the proposal, approves it, and the Skill is updated.

The architecture we built supports L5a: Skills are version-controlled markdown files, agent output is structured and capturable, and the feedback loops already exist between QA, code review, and the developer agent. The missing piece is the telemetry layer and the Skill-improvement agent that reads it. That is the next thing we are building.

---

The full talk, demo recordings, and slides from DevLille 2026 are at [github.com/fdelbrayelle/workflow-superpowers](https://github.com/fdelbrayelle/workflow-superpowers), including asciinema recordings of a live planning and implementation session on a real Kestra issue.

If you are building something similar for your own team — the methodology transfers even when the Skills do not. Reach out.
