---
title: Kestra Resources for AI Agents and LLMs
h1: Docs for Agents
sidebarTitle: Docs for Agents
icon: /src/contents/docs/icons/ai.svg
description: "Machine-readable resources for AI agents and LLMs: the Docs MCP server, Agent Skills, llms.txt, Markdown docs, plugin schemas, and OpenAPI specs."
---

A reference index of every machine-readable endpoint, format, and tool for connecting AI agents and LLMs to Kestra.

Use this page when you build an AI tool, agent, or integration that needs to read Kestra documentation or schemas. For step-by-step setup in a coding agent, start with the [Docs MCP server](../02.kestra-mcp-resources/index.md) and [Agent Skills](../03.agent-skills/index.md).

## Docs MCP server

The Kestra Docs MCP server gives AI tools live access to plugin documentation, blueprints, and product docs. Configure it in Claude Code, Cursor, or any MCP-compatible agent.

**Auto-discovery endpoint:**

```plaintext
https://kestra.io/.well-known/mcp.json
```

**Server URL:**

```plaintext
https://api.kestra.io/v1/mcp
```

No authentication required for the public server. For per-tool configuration, see [Docs MCP server](../02.kestra-mcp-resources/index.md). This server serves documentation only; to call your own flows from an agent, see [Flow MCP servers](../../ai-orchestration/03.mcp-server/index.md).

## Agent Skills

Agent Skills are structured knowledge files that teach AI coding agents how to generate valid Kestra flows, harden them for production, operate Kestra environments with `kestractl`, and migrate to Kestra 2.0.

Install all Kestra skills with:

```bash
npx skills add kestra-io/agent-skills
```

See [Agent Skills](../03.agent-skills/index.md) for the list of skills, what each one covers, and example prompts.

## Plain Markdown docs

Every Kestra documentation page is available as plain Markdown. Three ways to retrieve it:

- From the **Copy Page** menu on every docs page, choose **Copy as Markdown**, **View as Markdown**, **Open in ChatGPT**, or **Open in Claude**.

- Append `.md` to any `kestra.io/docs/*` URL:

  ```plaintext
  https://kestra.io/docs/quickstart.md
  ```

- Set the `Accept` header on the request:

  ```bash
  curl -H "Accept: text/markdown" https://kestra.io/docs/quickstart
  ```

This works for all docs pages, including versioned docs such as `kestra.io/docs/1.3/quickstart.md`.

## llms.txt endpoints

| Endpoint | Description |
|---|---|
| [`/llms.txt`](https://kestra.io/llms.txt) | Curated index with key concepts, resource links, and structured summaries |
| [`/llms-full.txt`](https://kestra.io/llms-full.txt) | Full content snapshot of all docs pages |

The `llms.txt` file follows the [llms.txt standard](https://llmstxt.org/) and includes the MCP server discovery URL.

## Plugin and flow schemas

| Resource | URL |
|---|---|
| Flow schema | `https://api.kestra.io/v1/plugins/schemas/flow` |
| Plugin task schema | `https://api.kestra.io/v1/plugins/schemas/{type}` |
| Plugin list | `https://api.kestra.io/v1/plugins` |
| Plugin versions | `https://api.kestra.io/v1/plugins/{group}/{artifact}/versions` |

The flow schema is the same schema used by Kestra's AI Copilot. Pass it to your agent to validate flow YAML before deploying.

## OpenAPI specs

Kestra's REST API is described by an OpenAPI specification. Use it to generate clients or give an agent a complete picture of available endpoints.

| Edition | URL |
|---|---|
| Open Source | `https://kestra.io/kestra.yml` |
| Enterprise | `https://kestra.io/kestra-ee.yml` |

The interactive API reference at [/docs/api-reference](../../api-reference/index.mdx) is rendered from these same spec files.
