---
title: MCP Tool Trigger in Kestra – Expose Flows as AI Tools
h1: Expose Flows as MCP Tools with the McpToolTrigger
description: Use the McpToolTrigger to expose Kestra flows as tools on an MCP server. AI agents can discover and invoke them automatically, with inputs and outputs mapped to a JSON schema.
sidebarTitle: MCP Tool Trigger
icon: /src/contents/docs/icons/flow.svg
version: ">= 2.0.0"
---

Expose a flow as a named tool on a Kestra MCP server.

The `McpToolTrigger` makes any flow discoverable and callable by MCP-compatible AI agents such as Claude Desktop, Claude Code, and Cursor. Flow inputs are automatically converted to a JSON schema tool spec so the AI agent knows exactly what parameters to pass. Each invocation creates a new flow execution tagged with `system.from:mcp` for observability.

```yaml
type: io.kestra.plugin.core.trigger.McpToolTrigger
```

:::alert{type="info"}
Every tenant has a `default` MCP server provisioned on startup, so the trigger works without creating a server first. See [MCP Server](../../../ai-tools/mcp-server/index.md) to create additional servers and connect AI agent clients.
:::

## Example

```yaml
id: hello_world
namespace: company.team

inputs:
  - id: user
    type: STRING
    defaults: John Doe
    description: "The name of the user to greet."

tasks:
  - id: greet
    type: io.kestra.plugin.core.output.OutputValues
    values:
      greeting: "Hello, {{ inputs.user }}!"

outputs:
  - id: greeting
    type: STRING
    value: "{{ outputs.greet.values.greeting }}"

triggers:
  - id: mcp
    type: io.kestra.plugin.core.trigger.McpToolTrigger
    toolName: hello_world
    title: Hello World greeting tool
    toolDescription: Returns a personalised greeting. Call this when the user asks for a greeting.
    mcpServer: default
```

When deployed, an MCP client connected to the `default` server will discover a tool named `hello_world`. It will accept a `user` parameter (typed as `string` from the flow input) and return a `greeting` string in the tool response.

## Properties

| Property | Required | Default | Description |
|---|---|---|---|
| `toolName` | Yes | — | Tool identifier shown to the AI agent. Must contain only alphanumeric characters, hyphens, underscores, or dots, and must start and end with an alphanumeric character. Maximum 64 characters. |
| `title` | Yes | — | Human-readable name shown to the AI agent. |
| `toolDescription` | Yes | — | Description of the tool shown to the AI agent, used to decide when to invoke it. A well-written description significantly improves tool-selection accuracy. |
| `mcpServer` | No | `"default"` | ID of the MCP server to register this tool on. Must match the `id` of an existing [MCP server](../../../ai-tools/mcp-server/index.md). |
| `annotations.readOnly` | No | `false` | Hint that this tool does not modify its environment. |
| `annotations.destructive` | No | `true` | Hint that this tool may perform destructive updates. Only meaningful when `readOnly` is `false`. |
| `annotations.openWorld` | No | `true` | Hint that this tool may interact with entities outside its closed domain. |
| `annotations.idempotent` | No | `false` | Hint that calling the tool repeatedly with the same arguments has no additional effect. Only meaningful when `readOnly` is `false`. |
| `annotations.returnDirect` | No | `false` | When `true`, the AI agent forwards the raw tool output to the user without further interpretation or summarisation. |

Annotations are informational hints for MCP clients. They do not affect execution behavior.

A flow can be registered on exactly one MCP server at a time via the `mcpServer` property. Multiple flows can share the same server, each appearing as a separate tool.

### Writing effective tool descriptions

The `toolDescription` is what the AI agent reads to decide whether to call your tool. Describe *when* and *why* to invoke the flow, not just what it does. For example:

```yaml
toolDescription: >
  Returns a personalised greeting for a named user.
  Call this tool whenever the user asks to be greeted or wants a welcome message.
```

## Input and output mapping

Flow inputs and outputs are automatically mapped to the MCP tool's input and output schema.

- Each flow `input` becomes a tool parameter. The `description` field on the input is passed to the AI agent as the parameter description.
- Flow `outputs` are returned in the tool response. Each output's `displayName` is used as the label in the response.

To constrain the structure of a `JSON`-type input, use the `jsonSchema` property. See [JSON input validation](../../05.inputs/index.md#input-validation).

## Observability

Every execution created via MCP carries two [system labels](../../../06.concepts/system-labels/index.md):

| Label | Value |
|---|---|
| `system.from` | `mcp` |
| `system.mcpServerId` | The `id` of the MCP server that invoked the tool |
| `system.mcpSessionId` | The session ID of the MCP client connection |

Filter executions by `system.from: mcp` in the Executions view to see all MCP-triggered runs.
