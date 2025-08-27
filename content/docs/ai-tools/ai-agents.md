---
title: AI Agents
icon: /docs/icons/ai.svg
editions: ["OSS", "EE", "Cloud"]
version: "1.0.0"
---

Launch autonomous processes with LLM, memory, and tools.

Add autonomous AI-driven tasks to flows that can think, remember, and dynamically orchestrate tools and tasks.

## Overview

With AI Agents, workflows are no longer limited to a predefined sequence of tasks. An AI Agent task launches an autonomous process with the help of an LLM, memory, and tools such as web search, task execution, and flow calling, and can dynamically decide which actions to take and in what order. Unlike traditional flows, an AI Agent can loop tasks until a condition is met, adapt to new information, and orchestrate complex multi-step objectives on its own. This enables agentic orchestration patterns in Kestra, where agents can operate independently or collaborate in multi-agent systems, all while remaining fully observable and manageable in code.

To start using this feature, you can add an **AI Agent** task to your flow. The AI Agent will then use the tools you provide to achieve its goal, leveraging capabilities such as web search, task execution, and flow calling. Thanks to memory, your AI Agent can remember information across executions to provide context for future tasks and subsequent prompts.