---
title: "What is an MCP Server: Connecting AI to External Systems"
description: "An MCP (Model Context Protocol) server exposes tools, data, and prompts to AI applications through one open protocol. Learn how it works, how it differs from an API, and how to call MCP servers from orchestrated workflows."
metaTitle: "What is an MCP Server & How It Works"
metaDescription: "Understand what an MCP server is, how the Model Context Protocol standardizes AI interaction with external systems, and its benefits for AI orchestration."
tag: ai
date: 2026-10-02
slug: mcp-server
faq:
  - question: "What is an MCP server?"
    answer: "An MCP (Model Context Protocol) server is a component that provides a standardized interface for AI models to discover and interact with external tools, data sources, and services. The AI application connects to it through an MCP client, lists what the server offers, and calls it over a standard JSON-RPC protocol, so one integration works with any MCP-compatible model or agent."
  - question: "What is the difference between MCP and a traditional API?"
    answer: "An MCP server usually wraps one or more existing APIs. The difference is who it is built for: a REST API is called by code a developer writes against its documentation, while an MCP server describes its own tools at runtime, with names, descriptions, and input schemas, so an AI agent can discover and call them without custom glue code for each service."
  - question: "Is MCP similar to USB-C for AI?"
    answer: "Yes, the analogy is apt. Just as USB-C provides a universal hardware interface for power, data, and display, MCP aims to be a universal software protocol for AI. It standardizes how AI models interact with diverse external capabilities, eliminating the need for custom integrations for every tool or service an AI might need to use."
  - question: "Does ChatGPT use MCP?"
    answer: "Yes. OpenAI supports MCP: ChatGPT can connect to remote MCP servers as connectors, and the OpenAI API lets developers attach remote MCP servers as tools. MCP was introduced by Anthropic in November 2024 as an open standard and is now supported by most major AI providers and agent frameworks."
  - question: "What are the core components of an MCP server?"
    answer: "An MCP server exposes three kinds of capabilities: tools (functions the model can call), resources (data the application can read, such as files or records), and prompts (reusable templates). It communicates with clients over JSON-RPC 2.0, either locally through stdio or remotely through Streamable HTTP. Conversation history stays in the AI application, not in the server."
  - question: "How does MCP enhance AI capabilities?"
    answer: "MCP gives models standardized access to live data and real actions, such as querying a database, reading a ticket, or triggering a workflow. Grounding answers in data fetched at run time limits guesswork, and because every capability is described the same way, adding a new system means adding one server rather than writing a new integration for each AI application."
---
> **TL;DR** — An MCP (Model Context Protocol) server exposes tools, data, and prompts to AI applications through one open protocol. An AI agent connects through an MCP client, discovers what the server offers, and calls it, so a single integration works across models and agent frameworks instead of custom glue code per tool.

Artificial intelligence models have become incredibly powerful at understanding language and generating content. Yet their ability to act, by searching a database, calling an API, or running code, depends on integrations that each tool needs separately. Each new tool or data source requires custom integration, turning potential into "glue code" maintenance.

The Model Context Protocol (MCP) addresses this with one open standard for connecting AI applications to external systems. An MCP server is the piece that exposes a system through that standard.

## How Model Context Protocol (MCP) servers work

The [Model Context Protocol](https://modelcontextprotocol.io/docs/learn/architecture) defines three roles. The **host** is the AI application the user interacts with, such as a chat assistant, an IDE, or an agent runtime. The host runs one **MCP client** per connection, and each client talks to one **MCP server**, which wraps a system: a database, a SaaS product, a file store, or an internal service.

An MCP server exposes three kinds of capabilities:

*   **Tools:** Functions the model can decide to call, each described by a name, a natural-language description, and a JSON Schema for its arguments. Searching documentation, creating a ticket, or running a query are typical tools.
*   **Resources:** Read-only data the application can load into the model's context, such as files, records, or API responses.
*   **Prompts:** Reusable templates the server offers for common tasks, which the user or the application can select.

Messages follow JSON-RPC 2.0. A local server runs as a subprocess and communicates over standard input and output (stdio); a remote server is reached over Streamable HTTP, which replaced the earlier HTTP with Server-Sent Events transport in the [2025 specification](https://modelcontextprotocol.io/specification/2025-06-18). When a client connects, it negotiates capabilities with the server, lists the available tools, and the host passes those tool descriptions to the model. When the model chooses a tool, the client sends the call and returns the result to the model.

One point is often misunderstood: the server does not hold the conversation. The host keeps the chat history and decides what goes into the model's context; the server only answers the requests it receives. That separation is what lets one server be reused by many different AI applications.

Kestra works on both sides of the protocol. The [Kestra MCP server](/docs/ai-tools/mcp-server) exposes flows as tools that AI agents can call, and Kestra flows can also act as MCP clients, as shown below. For the broader picture of coordinating many servers and agents, see [MCP orchestration](/resources/ai/mcp-orchestration).

## MCP as the "USB-C for AI"

The most effective analogy for MCP is "USB-C for AI." Before USB-C, connecting devices required a tangled mess of proprietary cables for power, data, and video. USB-C replaced this fragmentation with a single, universal standard.

MCP aims to do the same for software. Instead of writing custom API wrappers and parsers for every database, SaaS application, or internal service an AI needs to access, you expose them through a single, standardized MCP interface. This dramatically simplifies the process of giving AI new capabilities. An AI agent only needs to know how to speak MCP to gain access to a world of tools, just as a laptop only needs a USB-C port to connect to countless peripherals. Anthropic introduced MCP as an open standard in [November 2024](https://www.anthropic.com/news/model-context-protocol), and it has since been adopted by the major model providers and agent frameworks, which is what makes the USB-C comparison hold: the value comes from everyone using the same port. Kestra's [AI tools](/docs/ai-tools) follow the same standard.

## Why AI needs a standardized tool interface

Traditional APIs are built for predictable, programmatic interactions between applications. They are rigid and require developers to know the exact endpoints, methods, and data schemas in advance. This model breaks down when dealing with autonomous AI agents, which need to dynamically discover and decide which tools to use based on a high-level goal.

A standardized interface like MCP offers several benefits:
*   **Grounds answers in live data:** A model that can fetch the current record or document has less reason to guess.
*   **Enables Complex Reasoning:** Access to external tools allows an AI to break down complex problems into smaller, executable steps, such as searching for information, performing calculations, and then synthesizing a result.
*   **Enhances Flexibility:** New tools can be added to the MCP server without changing the AI agent's core logic. The agent can discover and use new capabilities on the fly.
*   **Concentrates access control:** Tool calls go through servers you choose to deploy, which gives you one place to log calls, scope credentials, and decide which actions an agent may take.

Kestra's [AI plugin](/plugins/plugin-ai/tool) provides a rich set of tasks for building these kinds of agentic workflows.

## Orchestrate AI tool calls with a Kestra MCP client: real-time documentation access

Most MCP traffic comes from interactive assistants, but the same servers are useful inside scheduled or event-driven workflows. A Kestra flow can call any MCP server directly, without a model in between, when the tool to call is already known. This is the deterministic counterpart to letting an agent decide.

The flow below connects to a documentation MCP server over Streamable HTTP, lists the tools it exposes, calls one of them, and logs the result.

```yaml
id: mcp-client-documentation-search
namespace: company.team.ai

inputs:
  - id: question
    type: STRING
    defaults: How do I add a webhook trigger to a flow?

tasks:
  - id: list-tools
    type: io.kestra.plugin.ai.mcp.ListTools
    url: "{{ secret('DOCS_MCP_SERVER_URL') }}"
    headers:
      Authorization: "Bearer {{ secret('DOCS_MCP_TOKEN') }}"

  - id: search-docs
    type: io.kestra.plugin.ai.mcp.CallTool
    url: "{{ secret('DOCS_MCP_SERVER_URL') }}"
    headers:
      Authorization: "Bearer {{ secret('DOCS_MCP_TOKEN') }}"
    tool: search_docs
    arguments:
      query: "{{ inputs.question }}"

  - id: log-results
    type: io.kestra.plugin.core.log.Log
    message: |
      The server exposes {{ outputs['list-tools'].count }} tools.
      Answer: {{ outputs['search-docs'].result }}
```

What's worth noticing in this flow:
*   **Discovery, then a call:** `ListTools` returns the server's tool catalog with each tool's argument schema, and `CallTool` invokes one tool by name. Both default to the Streamable HTTP transport.
*   **No model in the loop:** The tool and its arguments are fixed in YAML, so the call is repeatable and testable. When the choice of tool should be left to a model, attach the same server to an [AI agent](/docs/ai-tools/ai-agents) as a `StreamableHttpMcpClient` tool instead.
*   **Credentials stay in secrets:** The server URL and token come from Kestra's secret management rather than the flow definition.
*   **Usable downstream:** The tool's text answer is available as the `result` output, so later tasks can store it, post it, or pass it to another step in the same [Kestra flow](/docs/workflow-components/flow).

The reverse direction also works: the [MCP Tool trigger](/docs/workflow-components/triggers/mcp-tool-trigger) exposes a Kestra flow as a tool, so an AI assistant can start a governed workflow instead of calling a production system directly. Kestra's own MCP server also [exposes plugins, blueprints, and documentation](/docs/ai-tools/kestra-mcp-resources) to coding agents.

### MCP vs. traditional APIs: understanding the distinction

| Aspect | Traditional API (e.g., REST) | Model Context Protocol (MCP) |
|---|---|---|
| **Design Focus** | Application-to-application integration | AI agent-to-tool integration |
| **Interaction** | Rigid, pre-defined endpoints and methods | Dynamic tool discovery and invocation |
| **Session** | Usually stateless requests | A connection with capability negotiation; the conversation itself stays in the host |
| **Discovery** | Requires reading static documentation (e.g., OpenAPI) | Provides a live, machine-readable tool registry |
| **Use Case** | Reliable data exchange between known systems | Letting AI agents use a system without custom integration code |

## Building or choosing an MCP server

Many products now ship an official MCP server, so the first step is usually to check whether the system you need already has one. When it does not, SDKs for Python, TypeScript, and other languages let you wrap an existing API in a few dozen lines; frameworks such as [FastMCP](/resources/ai/fast-mcp) reduce this further. A few rules of thumb apply either way:

*   **Keep tools narrow.** A tool called `create_ticket` with three arguments is easier for a model to use correctly than a generic `call_api` tool.
*   **Write descriptions for the model.** The tool description is what the model reads to decide whether to call it, so it should say when to use the tool, not only what it does.
*   **Scope credentials per server.** A read-only server for search and a separate server for write actions make it simpler to decide which agents get which capabilities.
*   **Put irreversible actions behind a workflow.** Exposing a governed Kestra flow as the tool, rather than the raw production API, adds retries, logs, and an approval step where needed.

## Where MCP servers pay off for AI orchestration

MCP servers are most useful where an AI application has to work with systems it does not own.
*   **Autonomous Data Analysis:** An AI agent can use tools exposed by an MCP server to query databases, run statistical analyses, and generate visualizations to answer complex business questions.
*   **AI-Driven Infrastructure Management:** An agent can interact with tools for Terraform, Ansible, or Kubernetes to provision, configure, or troubleshoot infrastructure based on natural language requests.
*   **Intelligent Customer Support:** A support bot can use MCP tools to look up customer order information, process refunds, or escalate tickets within a CRM system.
*   **Content Generation Workflows:** An AI can use tools to perform web searches for research, check facts in a knowledge base, and then write an article, all within a single, [orchestrated AI agent workflow](/resources/ai/ai-agent-orchestration).

## Related concepts
*   [What Is an AI Agent?](/resources/ai/ai-agent)
*   [Agentic Workflows](/resources/ai/agentic-workflows)
*   [Multi-Agent Systems](/resources/ai/multi-agent-system)
*   [Kestra MCP: Live Documentation Access for AI Coding Agents](/blogs/kestra-mcp-docs)
*   [A Live Plugin and Blueprint Catalog for AI Coding Agents](/blogs/2026-04-30-kestra-mcp-plugins-blueprints)
*   [Context Engineering in Practice](/blogs/context-engineering-plugins-squad)

MCP servers give AI applications a common way to reach tools and data. Orchestration decides what happens around those calls: when they run, with which credentials, and what is logged.
