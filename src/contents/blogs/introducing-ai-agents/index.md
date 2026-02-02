---
title: "Introducing AI Agents: Autonomous Orchestration with Declarative Workflows"
description: "AI Agents in Kestra 1.0 turn workflows from static lists of tasks to dynamic decision engines. By combining LLMs, memory, and tools, they enable agentic orchestration that can reason and adapt autonomously."
date: 2025-09-10T13:00:00
category: News & Product Updates
authors:
  - name: Anna Geller
    image: ageller
    role: Product Lead
image: ./main.jpg
---

We're excited to announce **AI Agents** in Kestra 1.0. With AI Agents, workflows are no longer limited to a predefined sequence of tasks and triggers. Instead, you can launch autonomous processes that use Large Language Models (LLMs), memory, and tools to dynamically decide which actions to take and in what order.

## From Static Workflows to Autonomous Agents

Traditional orchestration requires defining every step of a workflow in advance. AI Agents change this paradigm. Each AI Agent task launches an autonomous process that can:

- **Think and reason** using Large Language Models
- **Remember context** across executions with persistent memory
- **Use tools dynamically** including web search, running Kestra tasks and executing Kestra flows
- **Adapt to dynamically retrieved information** and make decisions on the fly
- **Loop until conditions are met** rather than following a fixed sequence.

Kestra Agents can operate independently or collaborate in multi-agent systems, all while remaining fully observable and managed as code.

## How AI Agents Work in Kestra

Each AI Agent task brings together three building blocks: the system message & prompt that guide its reasoning, memory that carries context across runs, and tools that let the agent interact with external systems.

### 1. System Message & Prompt

The **system message** defines the agent's role and behavior, and the **prompt** carries the actual user input. Together, they guide the agent's response and decision-making process.

### 2. Memory

AI Agents can remember information across executions, providing context for subsequent prompts. Adding memory to your agent enables conversational workflows and stateful automation.

### 3. Tools & Content Retrievers

Agents can use a rich ecosystem of tools to augment their capabilities:

- **Web Search** - use Tavily or Google Custom Search to retrieve up-to-date information.
- **Code Execution** - agents rely on Judge0 to run code when needed; this tool comes in handy when your agent needs to perform mathematical operations.
- **Kestra Tasks** - call any Kestra task dynamically and integrate your agents with external systems using Kestra's built-in plugin ecosystem.
- **Kestra Flows** - orchestrate other flows dynamically.
- **MCP Clients** - integrate external systems via Model Context Protocol (MCP) clients.
- **File System Operations** - pass output files via Docker container bind-mounts.

You can configure your Kestra agents to return structured JSON output, log requests and responses, and each agent run automatically captures metrics incl. token usage for maximum observability.

---

## Real-World Examples

Let's explore some practical examples that demonstrate the power of AI Agents.

### 1. Market Research Agent

The agent shown below autonomously researches topics, gathers information from web sources, and generates a structured markdown report. We don't hardcode any logic about what web sources to use or how to search and summarize the retrieved data - the agent pulls live information, evaluates and structures it automatically and saves the final report in the output format we specified. As a user, you just declare the desired outcome and the agent figures out how to accomplish it using tools at its disposal.

```yaml
id: market_research_agent
namespace: company.ai

inputs:
  - id: prompt
    type: STRING
    defaults: |
      Research the latest trends in workflow and data orchestration.
      Use web search to gather current, reliable information from multiple sources.
      Then create a well-structured Markdown report that includes an introduction,
      key trends with short explanations, and a conclusion.
      Save the final report as `report.md` in the `/tmp` directory.

tasks:
  - id: agent
    type: io.kestra.plugin.ai.agent.AIAgent
    provider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
      modelName: gemini-2.5-flash
    prompt: "{{ inputs.prompt }}"
    systemMessage: |
      You are a research assistant that must always follow this process:
      1. Use the TavilyWebSearch content retriever to gather the most relevant and up-to-date information for the user prompt. Do not invent information.
      2. Summarize and structure the findings clearly in Markdown format. Use headings, bullet points, and links when appropriate.
      3. Save the final Markdown report as `report.md` in the `/tmp` directory by using the provided filesystem tool.

      Important rules:
      - Never output raw text in your response. The final result must always be written to `report.md`.
      - If no useful results are retrieved, write a short note in `report.md` explaining that no information was found.
      - Do not attempt to bypass or ignore the retriever or the filesystem tool.

    contentRetrievers:
      - type: io.kestra.plugin.ai.retriever.TavilyWebSearch
        apiKey: "{{ secret('TAVILY_API_KEY') }}"
        maxResults: 10

    tools:
      - type: io.kestra.plugin.ai.tool.DockerMcpClient
        image: mcp/filesystem
        command: ["/tmp"]
        binds: ["{{workingDir}}:/tmp"]
    outputFiles:
      - report.md
```


### 2. Multi-Agent Orchestration

You're not limited to a single agent per flow. Since each AI Agent is just a Kestra task, you can easily define multiple agents in the same flow.

This example demonstrates how multiple agents can share memory, enabling collaborative workflows where agents build upon each other's work:

```yaml
id: agent_with_memory
namespace: company.ai

tasks:
  - id: first_agent
    type: io.kestra.plugin.ai.agent.AIAgent
    prompt: Hi, my name is John and I live in New York!

  - id: second_agent
    type: io.kestra.plugin.ai.agent.AIAgent
    prompt: What's my name and where do I live?

pluginDefaults:
  - type: io.kestra.plugin.ai.agent.AIAgent
    values:
      provider:
        type: io.kestra.plugin.ai.provider.OpenAI
        apiKey: "{{ secret('OPENAI_API_KEY') }}"
        modelName: gpt-5-mini
      memory:
        type: io.kestra.plugin.ai.memory.KestraKVStore
        memoryId: JOHN
        ttl: PT1M
        messages: 5
```

Using multiple agent tasks can help scope each agent to a specific objective.

### 3. Dynamic Flow Orchestration

Your agents can also orchestrate other Kestra flows! The example below implements an agent that dynamically selects and executes different flows based on the user input:

```yaml
id: flow_calling_agent
namespace: company.ai
inputs:
  - id: use_case
    type: SELECT
    displayName: Select Your Orchestration Use Case
    defaults: Just Exploring
    values:
      - Business Automation
      - Business Processes
      - Data Engineering Pipeline
      - Data Warehouse and Analytics
      - Infrastructure Automation
      - Microservices and APIs
      - Just Exploring
tasks:
  - id: agent
    type: io.kestra.plugin.ai.agent.AIAgent
    prompt: |
      Execute a flow that best matches the {{inputs.use_case}} use case selected by the user. Use the following mapping of use cases to flow ids:
      - Business Automation: business-automation
      - Business Processes: business-processes
      - Data Engineering Pipeline: data-engineering-pipeline
      - Data Warehouse and Analytics: dwh-and-analytics
      - Infrastructure Automation: infrastructure-automation
      - Microservices and APIs: microservices-and-apis
      - Just Exploring: hello-world
      Remember that all those flows are in the tutorial namespace.
      Return only the Execution URI with no extra characters - the structure of URL is {{ kestra.url ?? 'http://localhost:8080/'}}ui/<tenantId>/executions/<namespace>/<flowId>/<id>
    provider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      modelName: gemini-2.5-flash
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
    tools:
      - type: io.kestra.plugin.ai.tool.KestraFlow
```


## Supported LLM Providers

AI Agents support a wide range of LLM providers, giving you flexibility in choosing the right model for your use case:

- **OpenAI** (GPT models)
- **Google Gemini** (Gemini models)
- **Anthropic** (Claude models)
- **Mistral AI** (Mistral models)
- **Amazon Bedrock** (Claude, Cohere, Titan, Nova, Llama, Mistral)
- **Azure OpenAI**
- **Google Vertex AI**
- **DeepSeek**
- **Ollama** (for self-hosted open-source models).

## Memory Providers

Currently, AI Agents support two memory backends:

- **Kestra KV Store** - Built-in key-value storage (great for prototyping)
- **Redis** - Production-ready memory with TTL support.

## Getting Started

To start using AI Agents, simply add an **AI Agent** task to your flow:

```yaml
id: analytics_agent
namespace: company.ai

inputs:
  - id: data
    type: JSON
    defaults: |
      [
        {"region": "North America", "sales": 120000, "month": "September"},
        {"region": "Europe", "sales": 95000, "month": "September"},
        {"region": "Asia", "sales": 143000, "month": "September"}
      ]

tasks:
  - id: agent
    type: io.kestra.plugin.ai.agent.AIAgent
    provider:
      type: io.kestra.plugin.ai.provider.GoogleGemini
      apiKey: "{{ secret('GEMINI_API_KEY') }}"
      modelName: gemini-2.5-flash
    systemMessage: You are an expert data analyst. Extract insights based on the provided data.
    prompt: "Analyze the following dataset: {{ inputs.data }}"
```

---

## The Future of Orchestration is Declarative

AI Agents enable new workflow orchestration patterns. Instead of manually scripting every possible path, you can now:

- **Describe your intent** and let the agent figure out how to achieve it
- **Adapt to changing conditions** without rewriting workflows
- **Build intelligent systems** that can reason and make decisions.

Think of it like giving directions to an intern: you don’t list every keystroke or click they need to perform, you simply state the outcome: "prepare a market research report" or "summarize yesterday’s customer tickets". The agent then decides which tools to use, what steps to follow, and when to stop. This makes prompts the ultimate form of declarative orchestration: you declare *what* you want to accomplish, and the system manages the *how*.

However, AI Agents are not a silver bullet. Because they are non-deterministic, they may not be suitable for mission-critical use cases that require strict repeatability and control. They also add cost and latency with each API call to an LLM provider. The key is knowing when agents add value and when traditional workflows are more appropriate.

With Kestra, you get the best of both worlds: traditional task-based orchestration for predictable, repeatable steps, and AI Agents for dynamic, adaptive processes. Whichever you choose, your workflows remain declarative, observable, and managed as code.

---

## Next Steps

Ready to get started? Check out our [AI Agent documentation](../../docs/ai-tools/ai-agents/index.md) for detailed examples and configuration options.

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️.

For questions or feedback, join [our Slack community](/slack) or open an issue on GitHub.

For a demo of AI Agents in action, check out the video below:

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/osrS9mi5-eg?si=POI9pQyGefA0RhjQ" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
