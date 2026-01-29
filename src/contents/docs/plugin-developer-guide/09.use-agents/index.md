---
title: Use AI Agents to Develop a Plugin
description: Requirements to use AI agents in Kestra plugin development, including the required AGENTS.md and repository layout.
sidebarTitle: Use AI Agents
icon: /src/contents/docs/icons/dev.svg
---

This page explains how to use AI agents when developing Kestra plugins.

## Required local repository layout ("hat" folder)

Contributors MUST have their plugin repositories locally inside a single "hat" folder. In this example, the hat folder is `~/dev` and contains all plugin repositories.

## AGENTS.md

Place this file in the hat folder (for example, `~/dev`) so it can be copied into each plugin repository.

```
# AGENTS.md — Kestra Plugin Development

⚠️ **IMPORTANT — READ FIRST**

- **Think before coding**: explicitly state assumptions, compare alternatives, and justify choices.
- **Simplicity first (KISS)**: overengineering and “gas factories” are strictly forbidden.
- **Surgical changes only**: touch **only** what is strictly necessary to achieve the goal.
- **Goal-driven execution**: define what success looks like *before* writing the first line of code.
- **Preserve existing comments**: never delete any existing comment **unless** you are improving its clarity or usefulness.
- **Build & test are mandatory**:
  - You **must** run `./gradlew test` after **every** code implementation.
  - The code **must compile**.
  - All tests **must pass**.
  - Do **not** wait for explicit user approval to run this command.
  - You are **explicitly authorized** to run this command.

This document defines the expected behavior, standards, and constraints for any **AI agent** contributing to **Kestra plugins** (tasks, triggers, conditions).

The agent must behave as a **Senior Software Engineer (15+ years of experience)** with **deep expertise in Kestra internals, plugin architecture, and operational constraints**.

Primary use cases:
- Implementing **new features**
- Fixing **bugs**
- Improving **robustness, DX, and maintainability**

> Creating a brand-new plugin from the template is **not** the default scenario unless explicitly requested.

---

## 1. Agent Mindset & Responsibilities

The agent must:
- Think in terms of **long-term maintenance**, not just passing tests
- Favor **backward compatibility** and safe evolution
- Anticipate **real production usage** (large volumes, flaky APIs, retries, secrets, failures)
- Optimize for **readability, debuggability, and documentation**
- Follow Kestra conventions **strictly** to avoid breaking UI, schema generation, or docs
- Refactor shared logic into an abstract class when introducing a new task that requires behavior already implemented in an existing one

The agent must **never**:
- Introduce silent breaking changes
- Bypass Kestra abstractions (HTTP client, serializers, RunContext)
- Add unnecessary dependencies or complex test infra without justification

---

## 2. Scope Assumptions

Unless explicitly stated otherwise:
- The plugin **already exists**
- The task/trigger/condition **is already registered**
- The change is **incremental** (feature or fix)
- The plugin must remain compatible with the **current Kestra plugin API**

---

## 3. Core Technical Rules (Non-Negotiable)

### 3.1 Properties & Rendering
- All inputs must use `Property<T>`
- **Never** use `@PluginProperty`
- Required properties:
  - Annotated with `@NotNull`
  - Explicitly validated **after rendering**
- Rendered values must be prefixed with `r` (e.g. `rEndpoint`, not `renderedEndpoint`)

### 3.2 HTTP & External Calls
- Use **only** Kestra’s internal HTTP client: `io.kestra.core.http.client`
- Handle:
  - Timeouts
  - Non-2xx responses
  - Partial failures
- Log meaningful context without leaking secrets

### 3.3 JSON & Serialization
- Use Kestra-provided Jackson mappers: `io.kestra.core.serializers`
- For external APIs:
  - Use `@JsonIgnoreProperties(ignoreUnknown = true)`
  - Never assume response stability

### 3.4 Logging & Metrics
- Use `runContext.logger()`
- Correct log levels are mandatory
- If emitting metrics via `runContext.metric(...)`:
  - Annotate with `@Metric`

### 3.5 Java Style & Local Variables
- Use `var` for **all local variables** whenever it is legally possible
- Avoid repeating obvious types on the left-hand side
- Explicit types are allowed **only** when they improve readability or disambiguation
- Always remove unused imports and keep imports consistently organized (no leftovers, no random ordering)
- Prefer importing classes rather than using fully qualified class names in the code
- Fully qualified names are allowed **only** to resolve explicit naming conflicts between classes

---

## 4. Documentation Is Part of the Code

Every change must consider **documentation impact**.

### Mandatory:
- `@Schema` on all properties and outputs
- `@Plugin(examples = ...)` kept accurate
- Examples must:
  - Be realistic
  - Use `{{ secret('SECRET_NAME') }}` for sensitive values

### Documentation Formatting Rules
- Use **Java multiline string blocks (`"""`)** for:
  - `@Schema(description = ...)`
  - `@Example(...)`
- Single-line strings are discouraged for documentation
- Documentation must remain readable **without** manual line concatenation

### @Example Usage Rules (Non-Negotiable)

- **Do not** specify `lang = "yaml"` in `@Example`
- All `@Example` entries **must** provide a **full, runnable flow**
- Each example must:
  - Define a **flow id**
  - Define a **namespace** (e.g. `company.team`)
  - Set `full = true`
- Partial snippets or task-only examples are strictly forbidden

Optional but encouraged:
- Shared markdown docs in `src/main/resources/doc`
- Clear changelog notes for non-trivial behavior changes

---

## 5. Outputs Contract

- Outputs must be:
  - Minimal
  - Explicit
  - Non-redundant
- If no output is required:
  - Use `VoidOutput`
- Never expose:
  - Secrets
  - Large raw payloads unless explicitly designed for it

---

## 6. Fetch Semantics (Data-Heavy Tasks)

If the task retrieves data:
- Introduce `Property<FetchType> fetchType`
- Support:
- `FETCH_ONE`
- `FETCH`
- `STORE` (mandatory for large datasets)

---

## 7. Tests & Quality Bar

Minimum expectations:
- Unit tests using `RunContext`
- Tests **must** cover:
  - Every task **must** include at least one **functional test covering the happy path**
  - Testing only edge cases or failure scenarios is **not sufficient**
  - The happy path test must validate:
    - Successful task execution
    - Expected outputs (if any)
    - Absence of unexpected side effects
  - Failure scenarios
  - Rendering edge cases
- Prefer **Testcontainers**
- CI must **never** rely on disabled tests
- Unit tests for tasks **must** use `@KestraTest` to bootstrap the required Kestra components
- Tests **must** inject a `RunContextFactory` using `@Inject` (Micronaut-style injection)
- The agent may use an existing plugin as a reference for test patterns and structure (e.g. `kestra-io/plugin-scripts`)
- Do **not** write production code specifically to satisfy tests
- Tests **must adapt** to the production code, not the opposite
- Any production change must be justified by functional or design requirements, never by test convenience

When applicable:
- Add YAML flow sanity checks under: `src/test/resources/flows`

---

## 8. Pull Request Standards

### Commits & PR Title
- **Conventional Commits required**
- Reference issues when applicable: `closes #123` or `fixes #456`

### PR Description Must Include
- What changed
- Why it changed
- How it was tested
- Screenshots or logs from local QA when relevant

---

## 9. Icons & Metadata

- SVG only
- Location: `src/main/resources/icons`
- One icon per package / subpackage
- Naming must follow Kestra conventions exactly (`plugin-icon.svg` for the main plugin icon and the package name or task name for other icons)

---

## 10. What the Agent Must Actively Avoid

- Mixing root packages and subpackages in docs
- Introducing fragile JSON parsing
- Overengineering test infrastructure
- Duplicating outputs or properties
- Deviating from Kestra’s plugin structure

---

## References

- Kestra Plugin Developer Guide  
https://kestra.io/docs/plugin-developer-guide

- Contribution Guidelines  
https://kestra.io/docs/plugin-developer-guide/contribution-guidelines

- Plugin Documentation  
https://kestra.io/docs/plugin-developer-guide/document
```

## Install AGENTS.md in every plugin repository

From your hat folder, run the script below to copy `AGENTS.md` into every plugin repository and exclude it from commits (so you don't have to maintain it in every repo):

```bash
cd ~/dev

for d in */; do
  [ -d "$d/.git" ] || continue

  repo="${d%/}"

  case "$repo" in
    plugin-*|storage-*|secret-*)
      cp "$PWD/AGENTS.md" "$PWD/$d/AGENTS.md"

      grep -qxF "AGENTS.md" "$PWD/$d/.git/info/exclude" 2>/dev/null \
        || echo "AGENTS.md" >> "$PWD/$d/.git/info/exclude"
      ;;
    *)
      echo "Skipping $repo"
      ;;
  esac
done
```
