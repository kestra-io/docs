---
title: AI Agents
icon: /docs/icons/ai.svg
version: "1.0.0"
---

Launch autonomous processes with an LLM, memory, and tools.

Add autonomous AI-driven tasks to flows that can think, remember, and dynamically orchestrate tools and tasks.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/osrS9mi5-eg?si=Tc8kMRP6NhqLQ4_u" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Overview

An AI Agent is an autonomous system that uses a Large Language Model (LLM). Each run combines a **system message** and a **prompt**. The system message defines the agent's role and behavior, while the prompt carries the actual user input for that execution. Together, they guide the agent's response.

With AI Agents, workflows are no longer limited to a predefined sequence of tasks. An AI Agent task launches an autonomous process with the help of an LLM, memory, and tools such as web search, task execution, and flow calling, and can dynamically decide which actions to take and in what order. Unlike traditional flows, an AI Agent can loop tasks until a condition is met, adapt to new information, and orchestrate complex multi-step objectives on its own. This enables agentic orchestration patterns in Kestra, where agents can operate independently or collaborate in multi-agent systems, all while remaining fully observable and manageable in code.

To start using this feature, you can add an [**AI Agent**](/plugins/plugin-ai/agent) task to your flow. The AI Agent will then use the tools you provide to achieve its goal, leveraging capabilities such as web search, task execution, and flow calling. Thanks to memory, your AI Agent can remember information across executions to provide context for future tasks and subsequent prompts.

## AI Agent flow example

<div style="position: relative; padding-bottom: calc(48.95833333333333% + 41px); height: 0; width: 100%;"><iframe src="https://demo.arcade.software/KL8TVCdgVc4nS5OTS6VS?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="AI Agent 3 | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

---

To demonstrate, below is a flow that summarizes arbitrary text with controllable length and language. Each component of the flow is broken down.

```yaml
id: simple_summarizer_agent
namespace: company.ai
inputs:
  - id: summary_length
    displayName: Summary Length
    type: SELECT
    defaults: medium
    values:
        - short
        - medium
        - long
  - id: language
    displayName: Language ISO code
    type: SELECT
    defaults: en
    values:
        - en
        - fr
        - de
        - es
        - it
        - ru
        - ja
  - id: text
    type: STRING
    displayName: Text to summarize
    defaults: |
        Kestra is an open-source orchestration platform that:
        - Allows you to define workflows declaratively in YAML
        - Allows non-developers to automate tasks with a no-code interface
        - Keeps everything versioned and governed, so it stays secure and auditable
        - Extends easily for custom use cases through plugins and custom scripts.
        Kestra follows a "start simple and grow as needed" philosophy. You can schedule a basic workflow in a few minutes, then later add Python scripts, Docker containers, or complicated branching logic if the situation calls for it. 
tasks:
  - id: multilingual_agent
    type: io.kestra.plugin.ai.agent.AIAgent
    systemMessage: |
        You are a precise technical assistant.
        Produce a {{ inputs.summary_length }} summary in {{ inputs.language }}.
        Keep it factual, remove fluff, and avoid marketing language.
        If the input is empty or non-text, return a one-sentence explanation.
        Output format:
        - 1-2 sentences for 'short'
        - 2-5 sentences for 'medium'
        - Up to 5 paragraphs for 'long'
    prompt: |
        Summarize the following content: {{ inputs.text }}

  - id: english_brevity
    type: io.kestra.plugin.ai.agent.AIAgent
    prompt: Generate exactly 1 sentence English summary of "{{ outputs.multilingual_agent.textOutput }}"

pluginDefaults:
  - type: io.kestra.plugin.ai.agent.AIAgent
    values:
        provider:
          type: io.kestra.plugin.ai.provider.GoogleGemini
          modelName: gemini-2.5-flash
          apiKey: "{{ secret('GEMINI_API_KEY') }}"
          configuration:
            logRequests: true
            logResponses: true
            responseFormat: 
              type: TEXT
```

### Inputs

The goal of the AI Agent is to summarize text. The flow uses three inputs -- `summary_length`, `language`, and `text` -- to control the length, language, and source text for the summary.

All inputs have a default value, and more or less can be used and referenced in downstream agentic tasks depending on the use case with [expressions](../expressions/index.md). When executing the flow, all the inputs can be selected or modified from the defaults.

![AI Agent Flow Inputs](/docs/ai-tools/ai-agent-inputs.png)

Continuing below for reference, we select `short` for the summary length and German (`de`) for the summary language.

### Tasks

In the flow, there are two tasks using the [AI Agent plugin](/plugins/plugin-ai/agent): `multilingual_agent` and `english_brevity`. The first task, `multilingual_agent`, includes the `systemMessage` property which dictates the system message to the LLM provider. The system message references the input selections for the desired summary length and in what language to generate the summary in. It also defines what should be outputted when the input is short, medium, or long.

Now that the AI Agent is familiar with its role, the `prompt` property tells it what to do, which is to summarize the inputted text. Taking a look at the output for a short summary, the `multilingual_agent` task does provide a 1–2 sentence summary of Kestra in German.

![AI Agent Initial Summary](/docs/ai-tools/ai-agent-summary.png)

Following `multilingual_agent` is the `english_brevity` task, which only needs a `prompt` because the `systemMessage` moves downstream in the flow. Whether a shorter English translation is needed, or the original outputted summary is in a different language, the `english_brevity` task provides a different output to match the need. In the execution context, the output is abbreviated and limited to exactly one sentence per the prompt.

![AI Agent Abbreviated Summary](/docs/ai-tools/ai-agent-brevity.png)

These outputs can then be passed on as notifications or system messages to external tools or subflows within Kestra. Other useful outputs include `tokenUsage` to compare different providers for the same tasks. For more examples and details about properties, outputs, and definitions, refer to the AI [Agent plugin documentation](/plugins/plugin-ai/agent).

### Plugin defaults

Each task using the AI Agent requires the `provider` property. To avoid repetition and simplify the flow building experience, first consider using [Kestra's AI Copilot](ai-copilot.md), next consider using [Plugin Defaults](../05.workflow-components/09.plugin-defaults.md) to ensure consistency and remove repetition. Additionally, for your provider API key, make sure to secure it either through the [Key-Value Store](../06.concepts/05.kv-store.md) or as a [Secret](../06.concepts/04.secret.md) if using [Kestra Enterprise Edition](../07.enterprise/01.overview/01.enterprise-edition.md).
