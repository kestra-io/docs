---
title: AI Tools
icon: /docs/icons/ai.svg
---

Create, refine, and orchestrate workflows using natural language or autonomous decision-making.

# AI Copilot & AI Agents

Kestra provides two AI-powered features — **AI Copilot** and **AI Agents** — that extend how workflows can be created and executed.

## AI Copilot

AI Copilot allows users to generate and refine flow definitions from natural language prompts. Instead of manually writing YAML, you can describe the desired behavior (for example, *“Make a REST API call to https://kestra.io/api/mock and allow failure”*) and Copilot will generate the corresponding flow code. The generated YAML can then be reviewed, accepted, or modified. Copilot can also update existing flows incrementally, such as adding tasks or adjusting triggers, without affecting unrelated parts of the flow.

## AI Agents

AI Agents provide autonomous orchestration capabilities. An AI Agent task uses a large language model (LLM), optional memory, and configured tools such as web search, task execution, or flow calling. The agent can dynamically decide which actions to take, loop until conditions are satisfied, and adapt based on new information. Unlike static flows that follow a fixed sequence, agents operate adaptively while remaining observable and fully defined as code.

## Summary

Together, AI Copilot and AI Agents introduce two complementary approaches:
- **AI Copilot**: speeds up flow creation and modification by translating natural language instructions into YAML.
- **AI Agents**: enable adaptive orchestration patterns where task sequences are not predetermined but are chosen dynamically at runtime.

Both features maintain Kestra’s principle of declarative, code-based orchestration while extending flexibility for different use cases.

:::ChildCard
:::
