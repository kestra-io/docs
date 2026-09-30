---
title: "AI Agent Observability: What to Trace, and Where Tracing Stops"
description: "AI agent observability combines model-level insights with execution-level control. Understand what to capture, which tools cover each layer, and how to ensure auditable, replayable agent workflows."
metaTitle: "AI Agent Observability: Tracing, Tools & Execution Control"
metaDescription: "AI agent observability has two layers: model tracing and execution state. Learn what to capture, which tools cover what, and how to make agent runs auditable."
tag: "ai"
date: 2026-09-29
slug: "agent-observability"
faq:
  - question: "What is the difference between model-level and execution-level AI agent observability?"
    answer: "Model-level observability focuses on the LLM's internal mechanics, such as prompt effectiveness, token usage, and response quality. Execution-level observability, on the other hand, monitors the agent's external actions, tool calls, workflow steps, inputs, outputs, and human interventions, ensuring the agent's overall process is traceable and auditable."
  - question: "Why is human approval critical for AI agent observability?"
    answer: "Human approval is a vital checkpoint, especially for irreversible agent actions. Recording these approvals as first-class events within the execution logs provides an auditable trail, demonstrating accountability and control over autonomous agent behavior. This matters for governance and compliance in production environments."
  - question: "Can OpenTelemetry be used for AI agent observability?"
    answer: "Yes, OpenTelemetry, particularly with its GenAI semantic conventions, is an excellent standard for instrumenting AI agent traces and spans. It helps capture LLM calls, tool interactions, and retrieval processes in a vendor-neutral format, preventing lock-in and enabling integration with various observability platforms."
  - question: "How does Kestra contribute to AI agent observability?"
    answer: "Kestra provides execution-level observability by orchestrating AI agents as workflows. It captures immutable logs of every task, tool call, and decision point, offering a complete audit trail. This allows teams to trace agent execution paths, review inputs and outputs, and replay runs, ensuring transparent and auditable agent operations."
  - question: "What are the common failure patterns in AI agents that observability can help debug?"
    answer: "Observability helps identify issues like tool looping, context overflow where the agent loses focus, silent partial failures where a task completes without fully achieving its goal, and retry storms. By tracing execution paths and monitoring states, teams can pinpoint the root cause of these non-deterministic agent behaviors."
  - question: "Why is self-hosted observability important for AI agents in regulated industries?"
    answer: "AI agent traces can contain sensitive information, including PII or proprietary data. For regulated industries, self-hosted or air-gapped observability solutions are essential to maintain data sovereignty and comply with strict privacy regulations, ensuring that sensitive traces do not leave controlled environments."
---

> **TL;DR** — Agent observability captures what an AI agent saw, decided, and did: prompts, tool calls, outputs, and the approvals around them. Model-level tracing shows the reasoning; an orchestrator's immutable execution log shows what actually ran, when, and who signed off. Production agents need both, often self-hosted when traces contain sensitive data.

AI agents promise to automate complex tasks, but their non-deterministic nature introduces new challenges. When an agent's run goes awry, or when an audit demands to know why a decision was made, "why" can be a hard question to answer. Traditional monitoring often falls short, leaving teams with a black box instead of an explanation.

This article dissects AI agent observability into its two essential layers: understanding the LLM's internal workings and tracing the agent's external execution. We'll explore what data truly matters, the tools designed to capture it, and how to build an auditable, controllable system that brings clarity to autonomous workflows.

## What is AI agent observability?

The core challenge of managing AI agents isn't just that they might fail, but that they can fail in unpredictable ways. Unlike traditional software with defined error codes and stack traces, an [AI agent](/resources/ai/ai-agent) might silently produce a suboptimal result, get stuck in a loop, or take an unexpected but valid path to a solution. This is where observability becomes critical.

### What is observability in an AI agent?
AI agent observability is the practice of capturing, measuring, and analyzing data from an agent's entire lifecycle to understand its internal state and external behavior. It provides deep insights that go beyond simple pass/fail metrics, enabling teams to trace decisions, evaluate performance, debug failures, and ensure governance over autonomous systems.

This practice operates on two distinct layers:

1.  **Model-Level Observability:** This layer focuses on the LLM itself. It answers questions about prompt construction, token usage, response quality, cost, and latency. It's about understanding the "thinking" part of the agent.
2.  **Execution-Level Observability:** This layer focuses on the agent's actions in the world. It tracks which tools were called, with what inputs, in what sequence, and what the outcomes were. It's about understanding the "doing" part of the agent.

Many teams start by instrumenting the model, only to find that production issues often stem from the execution. A European fintech team noted a "lack of unified visibility and central observability across workflows" as their primary challenge. They could see what the LLM said, but not what the system *did* as a result. This is why the approach has to cover both layers of [agentic AI](/resources/ai/agentic-ai).

Agent failures differ from traditional service failures due to their non-deterministic nature. A variable execution path might be a feature, not a bug. Side effects from tool calls can be subtle and hard to trace. Observability provides the context needed to distinguish between creative problem-solving and a system going off the rails.

## What you actually need to capture

A complete agent observability strategy captures data from both the model and its execution environment. Here are the essential signals to collect:

*   **Traces and Spans:** This is the foundation. Every interaction, from the initial user request to the final output, should be part of a single trace. Key spans within that trace include the LLM call, any retrieval-augmented generation (RAG) steps, and each tool call. This provides a complete, time-ordered narrative of the agent's run.
*   **Execution State:** For every step in the agent's workflow, you need to know what ran, with what inputs, and what it produced. This includes not just the final output but also intermediate artifacts. This data is what makes debugging possible and runs replayable.
*   **Decision Provenance:** It's not enough to know *what* the agent did; you need to know *why*. This involves logging the agent's reasoning process—the chain of thought or internal monologue that led it to choose a specific tool or sequence of actions. This is invaluable for understanding unexpected behavior.
*   **Human Checkpoints:** When a human-in-the-loop is involved, their actions are a critical part of the observability record. Log who approved a step, when they approved it, and what version of the data or plan they signed off on. This is a non-negotiable requirement for auditability.
*   **Cost and Latency Attribution:** Track token counts and execution time for each step. This allows you to attribute costs and identify performance bottlenecks, whether they lie within the LLM, a slow tool, or a complex retrieval process.

## How to implement AI agent observability

Putting agent observability into practice involves a combination of instrumentation, workflow design, and best practices for data management.

### How to add observability to an AI agent?
To add observability, you start by instrumenting your agent's code with a standard like OpenTelemetry to capture traces and spans. Then, you design your system to make agent runs fully replayable, not just viewable. Implement evaluation at the workflow boundaries and gate any irreversible actions behind an auditable human approval step.

Here is a more detailed breakdown of the steps:

1.  **Instrument with OpenTelemetry:** Adopt the OpenTelemetry standard, specifically the [GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/). This provides a vendor-neutral way to capture traces, metrics, and logs for LLM interactions, tool calls, and other agent activities. Instrumenting with a standard from the start prevents vendor lock-in with your observability backend. For more details on this, see how Kestra enhances [flow observability with OpenTelemetry traces](/blogs/observability-with-opentelemetry-traces).
2.  **Make Runs Replayable:** True debugging requires more than just reading logs; it requires the ability to replay a failed or problematic run with the exact same inputs and state. This means architecting your orchestration layer to capture not just logs, but the full execution context.
3.  **Evaluate at the Boundary:** Instead of trying to evaluate the quality of an agent's output deep inside a complex loop, perform evaluations at the clear entry and exit points of a workflow. This simplifies the process and makes it easier to establish clear pass/fail criteria for regression testing.
4.  **Gate Irreversible Actions:** For any tool or action that makes a permanent change (e.g., sending an email, updating a database, charging a credit card), build in a mandatory approval step. This action, and its sign-off, must be logged as a first-class event in your observability system.

When implementing, also consider best practices like establishing clear data retention policies for traces, which can contain sensitive PII, and using sampling for high-volume agents to manage costs without losing critical insights.

## AI agent observability tools

The market for agent observability tools is evolving rapidly, with different products focusing on different layers of the problem. No single tool covers everything; a complete solution typically involves combining tools from different categories.

### What are the top AI agent observability tools?
The best tools depend on your focus. For model-level tracing, Langfuse and LangSmith are leaders. For system-wide performance, APM platforms like Datadog are strong. And for execution-level audit and control, orchestrators like Kestra provide the necessary governance.

Here’s a breakdown of the landscape:

| Category | Tools | What they answer |
|---|---|---|
| **LLM Tracing & Evaluation** | Langfuse, LangSmith, Arize Phoenix, Braintrust | What did the model say, at what cost, and with what quality? |
| **APM / Platforms** | Datadog LLM Observability, Dynatrace, New Relic | How does the agent behave as part of the overall system? |
| **Standards** | OpenTelemetry GenAI conventions | How can we instrument traces in a vendor-neutral way? |
| **Orchestration & Execution** | Kestra, Temporal, Prefect | What step ran, who approved it, and how can we replay it? |

### What are the top 3 observability tools?
The "top 3" depends entirely on the layer you need to observe.
1.  **For model-level tracing and evaluation**, **Langfuse** is a powerful open-source choice that provides detailed insights into LLM chains and RAG pipelines.
2.  **For integrating agent performance into existing application monitoring**, **Datadog LLM Observability** extends a familiar APM platform to cover AI-specific signals.
3.  **For execution-level auditability and governance**, **Kestra** provides an immutable, replayable log of every workflow step, which is essential for production control.

The role of OpenTelemetry is to act as the universal language between these layers. By instrumenting your agent with OpenTelemetry, you can send trace data to any compatible backend, whether it's an LLM tracing tool, an APM platform, or a custom data warehouse, enabling a flexible and future-proof [AI agent orchestration](/resources/ai/ai-agent-orchestration) strategy.

## Governance: observability that holds up in an audit

As agents move from experiments to production, observability becomes a cornerstone of governance. When an auditor asks why an autonomous system took a specific action, a sampled trace from a SaaS vendor may not be sufficient. This is where execution-level observability proves its value.

A key distinction is between **immutable execution logs** and **sampled traces**. While traces are excellent for debugging, a true audit trail requires an unchangeable, complete record of every execution. An orchestrator provides this by design, capturing the full history of what ran, when, and with what parameters.

Human approval must be treated as a first-class, recorded event. A global IT services firm described its need for "LLM-driven agentic incident diagnostics with mandatory human approval check." This check isn't just a workflow step; it's a critical governance artifact. An auditable system logs who granted the approval and the exact state of the system at that moment.

```yaml
id: agent-with-approval
namespace: company.team.governance

inputs:
  - id: alert
    type: STRING

tasks:
  - id: generate-plan
    type: io.kestra.plugin.ai.agent.AIAgent
    provider:
      type: io.kestra.plugin.ai.provider.OpenAI
      apiKey: "{{ secret('OPENAI_API_KEY') }}"
      modelName: gpt-5-mini
    systemMessage: You are an SRE assistant. Propose a remediation plan. Never run commands yourself.
    prompt: "Generate a remediation plan for this alert: {{ inputs.alert }}"
    observability:
      type: io.kestra.plugin.ai.domain.LangfuseObservability
      endpoint: "{{ secret('LANGFUSE_ENDPOINT') }}"
      publicKey: "{{ secret('LANGFUSE_PUBLIC_KEY') }}"
      secretKey: "{{ secret('LANGFUSE_SECRET_KEY') }}"
      capturePrompt: true
      captureOutput: true

  - id: human-approval
    type: io.kestra.plugin.core.flow.Pause
    description: "Review the plan generated by the AI agent before execution."

  - id: record-approved-plan
    type: io.kestra.plugin.core.log.Log
    message: "Approved remediation plan: {{ outputs['generate-plan'].textOutput }}"
```

The agent's prompts and outputs are exported to [Langfuse](https://langfuse.com/docs), which can run self-hosted, while Kestra keeps the execution log: which plan was generated, who approved it, and when. The approved plan is logged rather than executed, so nothing the model wrote reaches a shell.

For many organizations, especially in regulated industries, data sovereignty is non-negotiable. Agent traces can contain highly sensitive data. An energy-sector manufacturer required "self-hosted orchestration integrated with internal LLM agents under EU compliance standards." Sending this data to a third-party SaaS observability platform was not an option. Self-hosted or air-gapped observability ensures that sensitive data remains within a controlled environment, satisfying strict compliance and privacy requirements. This is a fundamental component of building reliable [AI governance workflows](/resources/ai/ai-governance-workflows).

## Debugging and improving agents with observability

Observability is not just for post-mortems; it's a proactive tool for improving agent performance. By analyzing traces and execution logs, teams can identify and address common failure patterns that are unique to agentic systems.

Common patterns include:
*   **Tool Loop:** The agent repeatedly calls the same tool without making progress, often due to ambiguous instructions or a flawed reasoning process.
*   **Context Overflow:** The agent's context window becomes filled with irrelevant information, causing it to lose track of its original goal.
*   **Silent Partial Failure:** A tool or step appears to succeed but fails to deliver the expected outcome, and the agent continues without recognizing the error.
*   **Retry Storm:** A transient failure in a tool can cause the agent to retry aggressively, potentially overwhelming a downstream system.

By identifying these patterns, teams can refine prompts, improve tool design, and add guards to their orchestration logic. Traces from failed runs can be converted directly into regression tests, creating a feedback loop that systematically hardens the agent against future failures.

## Orchestrating Auditable AI Agents

Effective AI agent observability requires a dual focus: deep insights into the model's behavior and a firm grip on the execution's reality. While specialized tools provide essential model-level tracing, the orchestration platform is what delivers the auditable, replayable, and governable record of an agent's actions.

For teams building production-grade agents, this execution-level view is not optional. It’s the foundation for trust, control, and compliance in an increasingly autonomous world.

To explore related topics, see our resources on [workflow observability](/resources/infrastructure/workflow-observability) for infrastructure and [data observability](/resources/data/data-observability) for data pipelines.

To learn more about how Kestra can help you build, run, and observe auditable AI agents, explore our platform for [AI Automation](/ai-automation) or browse our full library of [AI Orchestration Resources](/resources/ai).
