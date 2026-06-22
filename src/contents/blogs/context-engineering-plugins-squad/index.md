---
title: "Context Engineering in Practice: Automating the Plugin SDLC at Kestra"
description: "How Kestra's Plugins & Ecosystem Squad introduced Context Engineering to automate the full software development lifecycle (SDLC) for plugins — from GitHub issue to merged PR — cutting delivery time from 4 hours — and even way more — to 30 minutes using structured AI agents and human-in-the-loop approval gates."
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

At Kestra, building a new plugin feature involves the same repeatable steps every time: read the issue, design an approach, write the code, run the tests, open a pull request, get it reviewed, run QA, and ship. A senior engineer can do this in around four hours for a basic or medium-complexity task — and several days for a comprehensive, multi-task plugin — not because the work is hard, but because it is thorough.

We asked a different question: what if we kept the thoroughness and removed the repetition?

This post describes how the Plugins & Ecosystem Squad introduced **Context Engineering** into its development workflow, and what happened when we let AI agents handle the mechanical parts while humans stayed in control of the decisions that actually matter.

I presented this approach at [DevLille 2026](https://github.com/fdelbrayelle/workflow-superpowers), with live terminal recordings of a full cycle on a [real Kestra issue](https://github.com/kestra-io/plugin-datagen/issues/53).

## Why Prompt Engineering Is Not Enough

Prompt engineering is about crafting the right question. Context Engineering is about building the right environment.

A well-prompted agent can write a Kestra task that compiles. A context-engineered agent can write one that follows Kestra plugin conventions, passes the test suite, handles edge cases correctly, includes YAML usage examples, and creates a pull request with the right reviewer team and a valid issue link in the body — on the first attempt.

The difference is not cleverness. It is structure: explicit domain knowledge encoded as **Skills** (focused markdown instruction sets under 500 lines each), deterministic workflow steps with clear success conditions, feedback loops that route QA failures back to the developer agent for correction, and **human approval gates** at the decisions that create the most value.

This is Context Engineering. It does not replace developer judgment — it channels it into the right moments.

## The Agentic AI Maturity Model

Before describing the workflow, it helps to locate where we are. We map agentic AI adoption across five levels, with two sub-levels each for L4 and L5:

| Level | Name | Description |
|-------|------|-------------|
| L1 | Manual | Prompts typed into a chat UI. Copy-paste driven. |
| L2 | Augmented | Copilot suggestions inline while a human codes. |
| L3 | Scripted | Deterministic, human-designed automation — fixed steps, no agent autonomy. |
| **L4a** | **Supervised Agentic** | **Dynamic multi-agent workflows with explicit human approval gates.** |
| L4b | Autonomous Agentic | Agents run end-to-end without human checkpoints. |
| L5a | Self-Optimizing | Agents emit telemetry and propose improvements to their own Skills. |
| L5b | Self-Authoring | Agents create new agents and Skills from scratch. |

The Plugins & Ecosystem Squad operates at **L4a**: agents handle execution, humans own decisions. Every approval gate is an explicit checkpoint — not an accidental pause.

Most teams skip directly from L2 to L3 and stall there, because scripted automation breaks when requirements change. The jump to L4a — where agents adapt dynamically within a structured context — is where real productivity gains begin.

## The Entrypoint: GitHub Issues as Machine-Readable Specs

The workflow starts where all feature work starts: a GitHub issue. But before any issue is written, a more fundamental question has to be answered — **why does this work exist?**

Every plugin feature on the backlog has an origin. It is either:
- A **customer signal** — a request surfaced by the Sales or Customer Success squads, with real names and real use cases attached
- A **Dev Marketing initiative** — a plugin that strengthens an integration story, a category, or a release theme
- An **internal bet** — the squad believes a new connector or capability is strategically valuable, before external demand has materialized
- **Innovation** — an experiment, a proof-of-concept, something nobody asked for yet

This is product thinking, and it belongs at the very start of the SDLC. The answer shapes the spec: a customer-signal issue names the use case and the success criterion. A Dev Marketing issue frames the plugin in the context of the integration story it supports. An innovation issue admits its exploratory nature upfront and scopes the acceptance criteria accordingly.

An issue that skips the "why" is an issue that will be built correctly and shipped to nobody.

We write issues differently now. A good issue for this workflow is a complete business and technical specification in markdown. It includes:
- A description of the desired behavior
- Acceptance criteria as a checklist
- One or more YAML usage examples showing what a correct implementation looks like from the user's perspective

This dual-audience design is intentional. A human engineer can read the issue and understand what to build. An AI agent can parse the same file and extract acceptance criteria, affected plugin classes, edge cases to handle, and expected outputs. No ambiguity. No "we'll figure it out during implementation."

The issue is not a ticket. It is the contract — and it drives the entire software development lifecycle (SDLC) that follows.

## The SDLC: Who Does What, and When

:::alert{type="info"}
**Skills and agents are both plain markdown files** — but they behave differently.

A **skill** is a procedural instruction set: a numbered sequence of steps, decision points, and success conditions that runs in the main context window. It is invoked by a human (e.g. `/kestra-plugin-planning`) and may orchestrate other steps or spawn agents. Think of it as a runbook the AI follows on your behalf.

An **agent** is a role definition: a system prompt that describes a specific persona, its responsibilities, and its constraints. When a skill spawns an agent, that agent runs in its own isolated context window — no shared history with the orchestrator — and returns a structured result when done. The developer and the reviewer are agents; the planning and implementation steps are skills.

The distinction matters because agents can be reused across skills, updated independently, and invoked directly when needed. For example, `kestra-plugin-code-reviewer` can be called manually to review a colleague's PR outside of the full workflow, and `/kestra-plugin-doing-qa` can be run standalone to perform a non-regression QA pass on an existing branch.
:::

Here is the full lifecycle, with the exact skills and agents at each step.

### Step 1 — Write the Issue `/kestra-plugin-managing-issues`

**Actor: any squad member (human)**

The squad member runs `/kestra-plugin-managing-issues` with a description or an existing issue URL. The skill first asks about the origin of the work — customer signal, Dev Marketing initiative, internal bet, or innovation — then asks whether this is a new feature, a bug fix, or a reformat of an existing issue. From those answers, it generates a fully structured GitHub issue body following Kestra plugin conventions — acceptance criteria, YAML examples, affected tasks, and a clear statement of why the work exists — and posts it to the correct repository.

The issue becomes the contract for everything that follows. Weak spec in, weak output out.

### Step 2 — Generate the Plan `/kestra-plugin-planning`

**Actor: any squad member (human) → agent**

The squad member runs `/kestra-plugin-planning` with the issue URL. A planning agent reads the issue, queries the [Kestra MCP server](/blogs/kestra-mcp-docs) for relevant task schemas, blueprints, and documentation, and generates a structured implementation plan covering four sections:

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

If the approver is not satisfied with the plan, they leave a comment on the issue explaining what needs to change. The squad member reruns `/kestra-plugin-planning` — which picks up the feedback from the issue thread — and a revised plan is posted. This loop continues until `/plan-approved` is posted. No implementation starts until it does.

### Step 4 — Implement `/kestra-plugin-implementing` or `/kestra-plugin-implementing-multiple`

**Actor: any squad member (human) → orchestrator → sub-agents**

The squad member runs one of two skills depending on the scope:

- **`/kestra-plugin-implementing <issue-url>`** — single issue, sequential execution
- **`/kestra-plugin-implementing-multiple <issue-url-1> <issue-url-2> ...`** — multiple approved issues run in parallel via an agent team, one teammate per issue

Again, this can be a different person than the ones who wrote the issue or approved the plan.

Once the orchestrator confirms the approval gate, it drives two sub-agents and one skill in sequence:

#### `kestra-plugin-developer` — the developer

Reads the issue and the approved plan, then targets the listed files directly — no broad codebase exploration, since the planning skill already mapped the relevant classes and design decisions. Implements the full feature in one batch: writes the code, runs the Gradle test suite, fixes any failures within the same session, and opens a pull request with the correct reviewer team (`kestra-io/plugins`), a `closes:` link to the issue, and a description that matches what was implemented.

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
| Cost per issue | — | ~$1.65 (≈340K input + 30K output tokens) |

Token breakdown for the same session:

| Budget item | Share |
|---|---|
| Skills + agent definitions loaded into context | ~20K tokens (~6% of input) |
| Developer agent + QA skill | ~70% of total input |
| Planning (Opus) + implementation and review (Sonnet) | 100% of cost |

The cost figure covers the full cycle: planning, implementation, code review, and QA. The developer agent and QA together consume about 70% of the token budget — which is expected, since they do the most work.

But the headline number understates the change. Manual processes routinely compress some steps under time pressure — planning gets light, code review skims, QA covers only the happy path. With agents, every issue gets thorough planning, detailed review across four tracks, and comprehensive QA. The quality floor rises alongside the speed.

### How We Keep the Cost Down

Token consumption in agentic workflows grows faster than linearly: every turn adds to the context window that all subsequent turns must read. We use three techniques to counteract this.

**Pass the plan to the developer.** The planning skill maps the relevant classes and design decisions upfront and posts them as a structured comment on the issue. The developer agent reads that comment and targets the listed files directly — skipping broad codebase exploration. Eliminating even a few exploration turns has an outsized effect: each saved turn roughly halves its own cost because context window growth is roughly triangular.

**Compact at strategic points.** The workflow issues `/compact` — a context pruning command — at three specific moments: mid-implementation (after all files are written, before running tests), after the developer agent returns, and after QA (which accumulates significant browser and terminal history). Each compaction flushes turn history while preserving the essential state, keeping the context window lean for the next heavy stage.

**Filter terminal output with `rtk`.** All shell commands in the workflow are proxied through `rtk`, a token-optimizing CLI layer that strips redundant output from `git`, `gradle`, `gh`, and similar tools before it enters the context window. On a full implementation session this saves 60–90% of terminal output tokens.

These optimizations together saved nearly $1 per issue compared to the unoptimized baseline — a cost reduction of more than 35% with no change to output quality.

## How the Knowledge Is Structured

The agents work because the knowledge they need is explicit and version-controlled.

A central hub holds all Skills and agent definitions. The developer agent and the code reviewer agent both reference the same shared Kestra plugin guidelines — so they operate from identical conventions without duplication. When a convention changes, one file changes and both agents pick it up immediately.

Skills are tool-agnostic at the source level. A build step generates Claude Code and OpenCode formats from a single markdown source, so the same knowledge works across AI coding tools.

No agent has implicit knowledge about Kestra plugin conventions. Everything it knows, it was told — explicitly, in writing, by engineers who have shipped plugins.

## The Human Role After Context Engineering

Software Engineers have always lived at the intersection of Product, Software Architecture, and Outcomes — translating business intent into working systems while making the design decisions that shape what gets built and why. That was true before AI coding tools existed. In 2026, with agents handling the mechanical execution layer, it is even more true: the craft moves up the stack, not out of the picture.

The developer's role shifted from typing code to curating context.

Writing issue specs that are complete enough to be machine-parseable is harder than writing vague tickets. Reviewing a generated plan critically is faster than writing it from scratch, but requires genuine domain expertise. Reviewing a pull request that already passes tests and QA requires a different kind of attention — less syntax, more semantics.

The human touchpoints that remain are the ones that should remain:

| Step | Who | What |
|------|-----|------|
| Write the issue | Any squad member | Spec authoring with `/kestra-plugin-managing-issues` |
| Approve the plan | Any kestra-io org member | `/plan-approved` comment on the issue |
| Trigger implementation | Any squad member | `/kestra-plugin-implementing` or `-multiple` |
| Review and merge | Squad member | PR review, merge, release |

At L4a, agents handle execution; humans own decisions. Advancing to L4b or L5a does not change that principle — it changes which decisions are worth a human's attention.

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

The full talk, demo recordings, and slides from DevLille 2026 are at [github.com/fdelbrayelle/workflow-superpowers](https://github.com/fdelbrayelle/workflow-superpowers), including asciinema recordings of a live planning and implementation session on a [real Kestra issue](https://github.com/kestra-io/plugin-datagen/issues/53).

If you are building something similar for your own team — the methodology transfers even when the Skills do not. Reach out.
