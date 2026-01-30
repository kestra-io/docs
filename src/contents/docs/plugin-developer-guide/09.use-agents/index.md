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
  - You **must** (and you are allowed to) run `./gradlew test` after **every** code implementation.
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
- Ensure contributions are:
  - easy to review
  - easy to QA
  - consistent with Kestra conventions
  - safe and maintainable over time

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

## 3. Pull Request & Contribution Guidelines

Follow these baseline rules for every pull request.

- PR title and commits follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
- Add a `closes #ISSUE_ID` or `fixes #ISSUE_ID` in the description if the PR relates to an opened issue.
- Documentation updated (plugin docs from `@Schema` for properties and outputs, `@Plugin` with examples, `README.md` file with basic knowledge and specifics).
- Setup instructions included if needed (API keys, accounts, etc.).
- Prefix all rendered properties by `r` not `rendered` (e.g., `rHost`).
- Use `runContext.logger()` to log important information with the right level (DEBUG, INFO, WARN, or ERROR).

---

## 4. Core Technical Rules (Non-Negotiable)

### 4.1 Properties & Rendering
- All inputs must use `Property<T>`
- **Never** use `@PluginProperty`
- Mandatory properties must be annotated with `@NotNull` and checked during the rendering.
- Rendered values must be prefixed with `r` (e.g. `rEndpoint`, not `renderedEndpoint`)
- You can model a JSON thanks to a simple `Property<Map<String, Object>>`.

### 4.2 HTTP & External Calls
- Must use Kestra’s internal HTTP client from `io.kestra.core.http.client`.
- Use Kestra’s internal HTTP client **only if no more robust SDK is explicitly provided or required in the prompt**.
- When an official or well-maintained SDK is specified in the prompt, prefer the SDK over raw HTTP calls.
- Handle:
  - Timeouts
  - Non-2xx responses
  - Partial failures
- Log meaningful context without leaking secrets

### 4.3 JSON & Serialization
- Must use Jackson mappers provided by core (`io.kestra.core.serializers`).
- If you are serializing response from an external API, you may have to add a `@JsonIgnoreProperties(ignoreUnknown = true)` at the mapped class level to prevent crashes when providers add new fields.
- Never assume response stability

### 4.4 Logging & Metrics
- Use `runContext.logger()`
- Correct log levels are mandatory
- Every time you use `runContext.metric(...)` you have to add a `@Metric`

### 4.5 Java Style & Local Variables
- Use `var` for **all local variables** whenever it is legally possible
- Avoid repeating obvious types on the left-hand side
- Explicit types are allowed **only** when they improve readability or disambiguation
- Always remove unused imports and keep imports consistently organized (no leftovers, no random ordering)
- Prefer importing classes rather than using fully qualified class names in the code
- Fully qualified names are allowed **only** to resolve explicit naming conflicts between classes
- Use `getFirst()` instead of `get(0)` when accessing the first element of a list
- Prefer immutability whenever possible to improve safety and concurrency handling
- When using streams:
  - Prefer `.toList()` over `collect(Collectors.toList())`
- Avoid exposing or mutating collections after creation unless explicitly required

---

## 5. Documentation Is Part of the Code

Every change must consider **documentation impact**.

### Mandatory:
- `@Schema` on all properties and outputs
- `@Plugin(examples = ...)` kept accurate
- Examples must:
  - Be realistic
  - Use `{{ secret('SECRET_NAME') }}` for sensitive values
- Use `"{{ secret('YOUR_SECRET') }}"` in the examples for sensible infos such as an API KEY.
- Align the `"""` to close examples blocks with the flow id.

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

## 6. Outputs Contract

- Outputs must be:
  - Minimal
  - Explicit
  - Non-redundant
- You can send back as outputs the same information you already have in your properties if they are important.
- If you do not have any output use `VoidOutput`
- Do not output twice the same information (e.g., a status code and an error code saying the same thing).
- Never expose:
  - Secrets
  - Large raw payloads unless explicitly designed for it

---

## 7. Fetch Semantics (Data-Heavy Tasks)

If the task retrieves data:
- Introduce `Property<FetchType> fetchType`
- Support:
  - `FETCH_ONE`
  - `FETCH`
  - `STORE` (mandatory for large datasets)

---

## 8. New plugins / subplugins

Keep new packages aligned with project conventions and metadata.

- Make sure your new plugin is configured like mentioned here:
  https://kestra.io/docs/plugin-developer-guide/gradle#mandatory-configuration
- Add a `package-info.java` under each sub package respecting this format:
  https://github.com/kestra-io/plugin-odoo/blob/main/src/main/java/io/kestra/plugin/odoo/package-info.java  
  and choosing the right category.
- Docs don't support to have both tasks/triggers in the root package (e.g. `io.kestra.plugin.kubernetes`) and in a sub package (e.g. `io.kestra.plugin.kubernetes.kubectl`), whether it's: all tasks/triggers in the root package OR only tasks/triggers in sub packages.
- Update the existing `index.yaml` for the main plugin, and for each new subpackage add a metadata file named exactly after the subpackage (e.g. `s3.yaml` for `io.kestra.plugin.aws.s3`) under `src/main/resources/metadata/`, following the same schema.

---

## 9. Tests & Quality Bar

Minimum expectations:
- Unit tests added or updated to cover the change (using the `RunContext` to actually run tasks).
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
- Prefer **Testcontainers** when possible to avoid running extra Docker services that can consume a lot of GitHub Actions runner disk space (and reduce flakiness / CI setup complexity).
- If Testcontainers is not suitable, avoid disabling tests for CI. Instead, configure a local environment with `.github/setup-unit.sh` (to be set executable with `chmod +x setup-unit.sh`) (which can be executed locally and in the CI) all along with a new `docker-compose-ci.yml` file (do **not** edit the existing `docker-compose.yml`). If needed, create an executable (`chmod +x cleanup-unit.sh`) `cleanup-unit.sh` to remove the potential costly resources (tables, datasets, etc).
- If Testcontainers cannot be used (e.g. no available Docker image):
  - Fall back to **Wiremock**
  - Use the following dependency:
    - `testImplementation "org.wiremock:wiremock-jetty12"`
- CI must **never** rely on disabled tests
- Unit tests for tasks **must** use `@KestraTest` to bootstrap the required Kestra components
- Tests **must** inject a `RunContextFactory` using `@Inject` (Micronaut-style injection)
- The agent may use an existing plugin as a reference for test patterns and structure (e.g. `kestra-io/plugin-scripts`) or take inspiration from other existing tests in the current repository
- Do **not** write production code specifically to satisfy tests
- Tests **must adapt** to the production code, not the opposite
- Any production change must be justified by functional or design requirements, never by test convenience

When applicable:
- Add sanity checks if possible with a YAML flow inside `src/test/resources/sanity-checks/[FLOW_NAME].yaml`. Use these sanity checks in a `RunnerTest` class annotated with `@KestraTest(startRunner = true)`. Test methods in this class will be annotated with `@Test` and `@ExecuteFlow("sanity-checks/[FLOW_NAME].yaml")`. The FLOW_NAME must match the flow id inside the file. Here is how such a test looks like:

```java
    @Test
    @ExecuteFlow("sanity-checks/[FLOW_NAME].yaml")
    void flow_name(Execution execution) {
        assertThat(execution.getTaskRunList(), hasSize(42));
        assertThat(execution.getState().getCurrent(), is(State.Type.SUCCESS));
    }
```

---

## 10. Icons & Metadata

- Icons added in `src/main/resources/icons` in SVG format and not in thumbnail (keep it big):
  - `plugin-icon.svg`
  - One icon per package / subpackage
- Naming must follow Kestra conventions exactly (`plugin-icon.svg` for the main plugin icon and the package name or task name for other icons)
- For subpackages, e.g. `io.kestra.plugin.aws.s3`, add `io.kestra.plugin.aws.s3.svg`  
  See example here: https://github.com/kestra-io/plugin-elasticsearch/blob/master/src/main/java/io/kestra/plugin/elasticsearch/Search.java#L76

---

## 11. What the Agent Must Actively Avoid

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
