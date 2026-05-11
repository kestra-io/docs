---
title: "Kestra MCP: Live Documentation Access for AI Coding Agents"
description: "The Kestra MCP server now exposes three documentation tools — search_docs, get_doc, and list_doc_children — giving AI coding agents direct access to the full Kestra documentation. Combined with the plugin and Blueprint tools, an agent can go from writing correct flows to reasoning about your entire Kestra architecture."
date: 2026-05-12T09:00:00
category: Solutions
author:
  name: François Delbrayelle
  linkedin: https://www.linkedin.com/in/fdelbrayelle/
  twitter: "@fdelbrayelle"
  image: fdelbrayelle
  role: Lead Software Engineer
image: ./main.png
schema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity:
    - "@type": "Question"
      name: "What are the new Kestra MCP documentation tools?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Three new tools have been added to the Kestra MCP server: search_docs (search documentation pages by keyword), get_doc (fetch full markdown content and metadata for a page by path or docId), and list_doc_children (list all child pages under a path prefix ordered by navigation order). They are available at the same endpoint as the existing plugin and Blueprint tools: https://api.kestra.io/v1/mcp."
    - "@type": "Question"
      name: "How do the documentation tools differ from the existing search tool?"
      acceptedAnswer:
        "@type": "Answer"
        text: "The existing search tool performs full-text search across multiple content types (plugins, docs, blueprints, blogs) and returns lightweight snippets. The new search_docs tool searches documentation pages specifically and returns parsedUrl and title so an agent can find the right page. get_doc then fetches the complete markdown content of that page. list_doc_children lets an agent navigate the documentation hierarchy by listing all pages under a given path prefix."
    - "@type": "Question"
      name: "What does it mean for an AI agent to be a Kestra architect?"
      acceptedAnswer:
        "@type": "Answer"
        text: "A flow-writing agent knows how to compose task YAML correctly. An architect-level agent understands why architectural decisions exist: which storage backend fits a deployment, how RBAC namespaces should be structured, when to use subflows versus triggers, how worker groups isolate workloads, and what the tradeoffs between task runner backends are. The MCP documentation tools give an agent access to that layer of knowledge directly in the conversation."
    - "@type": "Question"
      name: "Does adding the documentation tools change how I connect to the MCP server?"
      acceptedAnswer:
        "@type": "Answer"
        text: "No. The endpoint is the same: https://api.kestra.io/v1/mcp. The three new tools are automatically available to any connected client alongside the existing 13 tools. No reconnection or configuration change is needed if you already have the Kestra MCP server set up."
---

The [Kestra MCP server](./2026-04-30-kestra-mcp-plugins-blueprints/index.md) started with 13 tools covering the full plugin registry and Blueprint catalog. That was enough for an AI coding agent to write correct Kestra flows: discover plugins, inspect task schemas, retrieve ready-made YAML templates.

It was not enough to reason about the platform itself.

Choosing a storage backend, structuring RBAC namespaces, deciding between a polling trigger and a reactive one, understanding how worker groups isolate execution — these decisions live in the documentation, not in task schemas. Three new tools close that gap: `search_docs`, `get_doc`, and `list_doc_children`.

## Connecting Claude Code

Add the Kestra MCP server to Claude Code with a single command. If you already have it configured from the earlier release, no change is needed — the documentation tools are automatically available alongside the existing 13.

```bash
# Project-scoped (stores in .claude/settings.json in current repo)
claude mcp add --transport http kestra https://api.kestra.io/v1/mcp

# User-scoped (global, available in every project)
claude mcp add --transport http --scope user kestra https://api.kestra.io/v1/mcp
```

The same endpoint also works with Codex CLI, Gemini CLI, OpenCode, and any other MCP-compatible agent — see the [Plugins & Blueprints post](./2026-04-30-kestra-mcp-plugins-blueprints/index.md) for configuration snippets.

## The three new tools

All three tools carry `readOnlyHint: true`. They are backed by the same Elasticsearch index that powers the documentation search on kestra.io, and they support an optional `version` parameter to target a specific Kestra release (e.g. `v0.23`). When omitted, the current installed version is used.

| Tool | What it does |
|------|--------------|
| `search_docs` | Search documentation pages by keyword. Returns matching pages with their `parsedUrl` and `title`. |
| `get_doc` | Fetch the full markdown content and metadata of a documentation page. Accepts a `parsedUrl` path (e.g. `docs/getting-started`) or a `docId`. |
| `list_doc_children` | List all documentation pages under a given path prefix, ordered by navigation order. Returns each child's `parsedUrl` and metadata. |

## Three levels of usage

### Level 1 — Writing valid flows

The foundation. An agent connected to the Kestra MCP server can write a flow without guessing task names or property shapes:

1. `list_plugins` to discover which plugins are available
2. `plugin_tasks` to enumerate tasks, triggers, and task runners for the right plugin
3. `task_schema` to get the exact JSON schema, property types, defaults, and outputs for each task

The result is valid YAML on the first attempt, with no hallucinated property names and no tab to the plugin reference. This is the baseline: correct flows, every time.

### Level 2 — Bootstrapping from Blueprints

Before writing from scratch, a smarter agent checks whether the problem has already been solved:

1. `blueprints` with a keyword like `"dbt"`, `"slack"`, or `"file transfer"` to scan available templates
2. `get_blueprint_flow` on the best match to retrieve the full YAML
3. `task_schema` on the tasks it does not recognize to understand the properties to customize

This is faster than authoring from scratch and produces output that follows Kestra's own patterns. The agent is not just writing flows — it is inheriting the team's accumulated best practices.

### Level 3 — Reasoning about the platform

Levels 1 and 2 make an agent a good flow writer. Level 3 makes it a Kestra architect.

Flow YAML expresses _what_ to execute. Architecture is about _how the platform is deployed_ and _why specific design choices apply to this environment_. That knowledge lives in the documentation: storage backends, secret manager integrations, RBAC namespace design, worker group isolation, subflow composition, trigger types, task runner tradeoffs.

With the documentation tools, an agent can fetch that knowledge on demand:

**Designing a storage strategy**

```
Agent calls: search_docs("internal storage backends")
→ returns: docs/concepts/storage and related pages

Agent calls: get_doc("docs/concepts/storage")
→ returns: full markdown explaining GCS, S3, Azure Blob, MinIO options,
  configuration syntax, and tradeoffs

Agent calls: list_doc_children("docs/concepts/storage")
→ returns: child pages for each backend with their navigation order
```

The agent can now tell you not just _how_ to configure a storage backend, but _which one_ fits a given deployment and _why_ — including the configuration keys and the caveats specific to each.

**Structuring RBAC namespaces for a multi-tenant deployment**

```
Agent calls: search_docs("namespace RBAC multi-tenant")
→ surfaces: docs on namespaces, roles, bindings, and tenant isolation

Agent calls: get_doc("docs/enterprise/rbac")
→ returns: full RBAC model, role hierarchy, binding syntax, and examples
```

With that context, the agent can propose a namespace structure, generate the YAML for namespace creation, and explain what each role allows — without the human ever leaving the conversation.

**Choosing between task runner backends**

```
Agent calls: list_task_runners
→ lists all available backends: Docker, Kubernetes, GCP Batch, AWS Batch, …

Agent calls: search_docs("task runners Kubernetes")
→ surfaces: configuration guide and comparison pages

Agent calls: get_doc("docs/task-runners/kubernetes")
→ returns: full setup guide, resource configuration, isolation model
```

The agent understands the tradeoffs between a local Docker runner and a cloud-managed batch runner, can recommend one given a deployment context, and generates the complete configuration.

**The key distinction**

A flow-writing agent knows how to call `io.kestra.plugin.aws.s3.Upload` correctly. An architect-level agent knows whether S3 is the right storage choice for this deployment, how to configure the corresponding internal storage backend, and how that decision affects every flow that writes to internal storage. The documentation tools provide the second layer.

## What this enables end-to-end

Consider a team onboarding to Kestra with an AI agent as their guide. Without documentation tools, the agent can write flows and answer task-level questions. With documentation tools, it can:

- Audit an existing deployment against Kestra's recommended practices
- Propose a namespace and RBAC structure for a new team
- Explain why a trigger fires unexpectedly by reading the trigger lifecycle documentation
- Recommend a secret manager integration based on the team's cloud provider
- Walk through the worker group configuration needed to isolate sensitive workloads

The agent does not just execute — it advises.

---

## Frequently asked questions

### What are the new Kestra MCP documentation tools?
Three tools added to the existing MCP server: `search_docs` (keyword search returning `parsedUrl` and title), `get_doc` (full markdown content and metadata for a page), and `list_doc_children` (all child pages under a path prefix, ordered by navigation). All three support an optional `version` parameter; the current Kestra version is used by default.

### How do the documentation tools differ from the existing `search` tool?
`search` returns lightweight snippets across all content types. `search_docs` focuses on documentation pages and returns `parsedUrl` and title so an agent can find the right page. `get_doc` then fetches the complete markdown. `list_doc_children` enables structured navigation — useful when an agent needs to survey a whole section rather than retrieve one specific page.

### What does it mean for an AI agent to be a Kestra architect?
A flow-writing agent composes correct task YAML. An architect-level agent understands platform decisions: which storage backend fits a deployment, how to structure RBAC for a multi-tenant environment, when subflows are preferable to trigger chaining, and how worker groups isolate workloads. The documentation tools provide that second layer of reasoning, directly in the conversation.

### Does adding the documentation tools change how I connect to the MCP server?
No. The endpoint is unchanged: `https://api.kestra.io/v1/mcp`. The three new tools appear automatically alongside the existing 13. No reconnection or configuration update is needed if you already have the server registered.
