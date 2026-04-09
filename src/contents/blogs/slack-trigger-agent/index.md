---
title: "Building a Slack AI Agent with Kestra: From Trigger to Autonomous Bot"
description: "Learn how to set up a Kestra Slack Trigger, respond to mentions with Gemini, and extend your bot into a fully autonomous AI agent using Kestra's AIAgent task and MCP tools."
date: 2026-04-09T09:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: bpimpaud
---

Slack is where your team already lives. It's the natural place to surface automation: ask a question in a channel, get an intelligent answer back within seconds. With Kestra's Slack Trigger and AI plugin, you can wire up that loop in a single declarative YAML flow — no custom bot server required, no long-polling daemon to keep alive.

This post walks through the full setup: creating a Slack App, configuring the Kestra trigger, building a Gemini-powered responder, and then pushing further — turning your bot into an autonomous agent that can operate your Kestra instance directly from Slack.

## How the Slack Trigger Works

Kestra's Slack plugin (`io.kestra.plugin.slack.app.core.Trigger`) acts as a Slack App backend. When your app receives an event (an `app_mention`, a direct message, etc.), Slack sends a signed HTTP request to your Kestra instance. The trigger validates the signature, deserializes the event payload, and starts an execution — passing the message body and metadata as trigger outputs.

This is different from a generic Webhook trigger. The Slack trigger handles the OAuth token exchange, request signature verification using `signingSecret`, and the Slack Events API challenge handshake automatically. You just provide credentials and write your response logic.

## Step 1 — Create a Slack App

Go to [api.slack.com/apps](https://api.slack.com/apps) and create a new app from scratch.

### OAuth & Permissions

Under **OAuth & Permissions**, add the following Bot Token Scopes:

| Scope | Why |
|---|---|
| `app_mentions:read` | Receive events when your bot is @mentioned |
| `chat:write` | Post messages back to channels |
| `channels:history` | Read message context (optional, for threaded replies) |

Once you install the app to your workspace, Slack generates a **Bot User OAuth Token** (starts with `xoxb-`). Copy it — this becomes your `BOT_TOKEN` secret in Kestra.

:::info{title="Screenshot placeholder"}
*[Add screenshot: OAuth & Permissions page showing Bot Token Scopes]*
:::

### Signing Secret

Under **Basic Information**, scroll to **App Credentials**. Copy the **Signing Secret** — this is what the Slack trigger uses to verify that incoming requests are genuinely from Slack.

:::info{title="Screenshot placeholder"}
*[Add screenshot: Basic Information page showing Signing Secret location]*
:::

Store both values as [Kestra Secrets](https://kestra.io/docs/concepts/secret):

- `BOT_TOKEN` → your `xoxb-...` token
- `SIGNING_SECRET` → your signing secret

### Event Subscriptions

Under **Event Subscriptions**, enable the feature and set the **Request URL** to your Kestra webhook endpoint:

```
https://<your-kestra-host>/api/v1/<tenant>/executions/webhook/<namespace>/<flow-id>/<webhook-key>
```

For local development with [ngrok](https://ngrok.com/), it looks like:

```
https://df36-195-68-39-198.ngrok-free.app/api/v1/main/executions/webhook/company.team/slack_agent/my_key
```

:::alert{type="warning"}
The **webhook key** must contain only letters and digits — no special characters. Treat it as a secret.
:::

Under **Subscribe to bot events**, add `app_mention`. Slack will send a POST to your Kestra instance every time someone @mentions your bot.

:::info{title="Screenshot placeholder"}
*[Add screenshot: Event Subscriptions page showing app_mention event and Request URL]*
:::

## Step 2 — The Base Flow: Mention → Gemini → Reply

Here is a minimal Kestra flow that responds to every @mention with a Gemini-generated reply:

```yaml
id: slack_agent
namespace: company.team

triggers:
  - id: slack_mention
    key: my_key
    type: io.kestra.plugin.slack.app.core.Trigger
    botToken: "{{ secret('BOT_TOKEN') }}"
    signingSecret: "{{ secret('SIGNING_SECRET') }}"

tasks:
  - id: gemini
    type: io.kestra.plugin.gemini.TextCompletion
    apiKey: "{{ secret('GEMINI_KEY') }}"
    model: gemini-2.5-flash
    prompt: |
      Answer the user in an informal, conversational tone: {{ trigger.body.text }}

  - id: respond_to_mention
    type: io.kestra.plugin.slack.app.chats.Post
    token: "{{ secret('BOT_TOKEN') }}"
    channel: "{{ trigger.body.channel }}"
    messageText: "{{ outputs.gemini['predictions'] | first | jq('.content') | first }}"
    timestamp: "{{ trigger.body.ts }}"
```

Walk through the components:

- **`io.kestra.plugin.slack.app.core.Trigger`** — listens on the webhook key and validates every incoming request. The `trigger.body` output contains the parsed Slack event: `text`, `channel`, `user`, `ts` (timestamp for threaded replies).
- **`io.kestra.plugin.gemini.TextCompletion`** — sends the message text to Gemini 2.5 Flash. The free-tier API key is sufficient for low-traffic bots.
- **`io.kestra.plugin.slack.app.chats.Post`** — posts the response. Setting `timestamp` to `{{ trigger.body.ts }}` makes Kestra reply in the same message thread, keeping conversations tidy.

Once you deploy this flow and configure your Slack App's Event Subscriptions URL, @mentioning your bot in any channel will trigger an execution and post Gemini's answer back within a few seconds.

## Step 3 — Extend with an Autonomous AI Agent

A text-completion call is a single turn. The real power comes from adding agentic behavior: give your bot tools, let it reason, let it act.

Kestra's `io.kestra.plugin.ai.agent.AIAgent` task does exactly that. Instead of a one-shot LLM call, it runs a reasoning loop: the agent receives a prompt, decides which tools to call, observes the results, and continues until it has a complete answer.

Here's the enhanced flow:

```yaml
id: slack_agent
namespace: company.team

triggers:
  - id: slack_mention
    key: my_key
    type: io.kestra.plugin.slack.app.core.Trigger
    botToken: "{{ secret('BOT_TOKEN') }}"
    signingSecret: "{{ secret('SIGNING_SECRET') }}"

tasks:
  - id: agent
    type: io.kestra.plugin.ai.agent.AIAgent
    provider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      modelName: gemini-2.5-flash
      apiKey: "{{ secret('GEMINI_KEY') }}"
    systemMessage: |
      You are a helpful assistant embedded in a Slack workspace.
      Answer questions conversationally and concisely.
      When a user asks about Kestra flows or executions, use the available tools to look up real data.
    prompt: "{{ trigger.body.text }}"

  - id: respond_to_mention
    type: io.kestra.plugin.slack.app.chats.Post
    token: "{{ secret('BOT_TOKEN') }}"
    channel: "{{ trigger.body.channel }}"
    messageText: "{{ outputs.agent.textOutput }}"
    timestamp: "{{ trigger.body.ts }}"
```

The `AIAgent` task emits a `textOutput` containing the final answer after its reasoning loop completes. The `respond_to_mention` task sends it back to Slack just like before — the Slack-facing interface stays the same regardless of how complex the agent's reasoning gets.

## Step 4 — Give the Agent Kestra Tools via MCP

So far the agent can answer general questions. But what if someone asks: *"What flows are running in the analytics namespace?"* or *"Trigger the daily report flow for me"*?

That requires the agent to actually interact with your Kestra instance. You can do that by adding a **DockerMcpClient** tool that connects to [Kestra's official MCP server](https://kestra.io/docs/ai-tools/ai-agents):

```yaml
id: slack_agent
namespace: company.team

triggers:
  - id: slack_mention
    key: my_key
    type: io.kestra.plugin.slack.app.core.Trigger
    botToken: "{{ secret('BOT_TOKEN') }}"
    signingSecret: "{{ secret('SIGNING_SECRET') }}"

tasks:
  - id: agent
    type: io.kestra.plugin.ai.agent.AIAgent
    provider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      modelName: gemini-2.5-flash
      apiKey: "{{ secret('GEMINI_KEY') }}"
    systemMessage: |
      You are a Kestra operations assistant available in Slack.
      Answer questions about running flows, executions, and namespaces.
      You can also trigger flows when asked to do so.
      Be concise — this is Slack, not a document editor.
    prompt: "{{ trigger.body.text }}"
    tools:
      - type: io.kestra.plugin.ai.tool.DockerMcpClient
        image: ghcr.io/kestra-io/mcp-server-python:latest
        env:
          KESTRA_BASE_URL: http://host.docker.internal:8080/api/v1
          KESTRA_TENANT_ID: main
          KESTRA_USERNAME: admin@kestra.io
          KESTRA_PASSWORD: "{{ secret('KESTRA_PASSWORD') }}"

  - id: respond_to_mention
    type: io.kestra.plugin.slack.app.chats.Post
    token: "{{ secret('BOT_TOKEN') }}"
    channel: "{{ trigger.body.channel }}"
    messageText: "{{ outputs.agent.textOutput }}"
    timestamp: "{{ trigger.body.ts }}"
```

The `DockerMcpClient` pulls the Kestra MCP server image and spins it up as a sidecar during the agent's reasoning loop. The agent gains access to tools like:

- **List flows** — query flows across namespaces
- **Get execution status** — check whether a run succeeded or failed
- **Trigger an execution** — kick off a flow with specific inputs

When a team member types `@kestra-bot show me the last 5 failed executions in company.analytics`, the agent calls the appropriate MCP tool, gets the data, formats it conversationally, and posts the answer back to Slack. All of this happens inside a single Kestra execution — fully observable, with logs you can inspect in the Kestra UI.

## Taking It Further

A few directions worth exploring:

**Conditional routing** — use Kestra's `Switch` task to route different kinds of mentions to different agent behaviors. Ops questions go to the MCP-equipped agent; general questions skip the tooling overhead.

**Memory across turns** — the `AIAgent` task supports persistent memory. You can give your Slack bot a per-user memory namespace, so it remembers context from previous conversations.

**kestractl from Kestra** — beyond MCP, you can also shell out to `kestractl` directly using `io.kestra.plugin.scripts.runner.Script` tasks. This gives you the same CLI interface that humans use, now available as an AI-callable tool.

**Multi-agent patterns** — Kestra supports flow-calling tools within agents. You could build a "dispatcher" agent in Slack that hands off specialized tasks — data analysis, infrastructure checks, code review — to dedicated sub-agents, each with their own tools and system prompt.

## Wrapping Up

A production-quality Slack AI bot with Kestra is three things:

1. A **Slack App** with the right OAuth scopes and a verified Event Subscriptions URL
2. A **Kestra flow** that starts with the Slack Trigger and ends with a Slack Post
3. An **AIAgent task** in the middle, with whatever tools the bot needs to be genuinely useful

The same flow that starts as a simple Gemini responder can grow into a full operations assistant — capable of querying flows, triggering executions, and answering real questions about your platform — without changing the Slack-facing interface at all.

The full plugin reference for the Slack trigger, the AI Agent, and the MCP tools is available in the [Kestra docs](https://kestra.io/docs/ai-tools/ai-agents).
