---
title: "AI Gateway: The Orchestration Layer for LLM Applications"
description: "An AI gateway is a proxy between your applications and LLM providers that handles routing, fallbacks, caching, rate limits, and security in one place. See how it differs from an API gateway, which options exist, and how it fits with workflow orchestration."
metaTitle: "AI Gateway: Orchestrating LLM Routing, Security & Cost"
metaDescription: "Explore AI gateways for LLM apps. Learn about dynamic routing, caching, security, and cost optimization, and how Kestra orchestrates multi-model AI workflows."
tag: ai
date: 2026-10-26
slug: "ai-gateway"
faq:
  - question: "What are AI gateways?"
    answer: "An AI gateway is a proxy between your LLM applications and the model providers they call. It handles request routing, fallbacks, caching, rate limits, and security in one place, so applications use one endpoint instead of managing each provider's API and keys."
  - question: "Do I need an AI gateway for production LLM applications?"
    answer: "Not always. A single application calling one provider can do without. A gateway becomes useful when several teams or applications share providers, when you need fallbacks across providers, central key management, spending limits, or one place to log every model call."
  - question: "What's the best AI gateway solution?"
    answer: "It depends on where you run and what you need. LiteLLM, the Portkey gateway, and MLflow AI Gateway are open source and self-hostable. Cloudflare AI Gateway and Vercel AI Gateway are managed services. Azure API Management and Kong add AI features to an existing API management layer. Compare deployment model, supported providers, and governance features."
  - question: "How does an AI gateway differ from a traditional API gateway?"
    answer: "While both are proxies, an AI gateway is specifically designed for LLM APIs. It handles unique challenges like dynamic model routing, intelligent caching of LLM responses, token metering, prompt injection detection, PII redaction, and fallbacks across model providers. Traditional API gateways focus on HTTP routing, authentication, and request-based rate limiting."
  - question: "Does adding an AI gateway introduce noticeable latency?"
    answer: "It adds one network hop, which is usually small next to the time a model takes to generate a response. Cache hits can make some requests faster than calling the provider directly. Measure it on your own traffic, especially for streaming or low-latency use cases."
  - question: "Can an AI gateway integrate with orchestration platforms?"
    answer: "Yes. Most gateways expose an OpenAI-compatible API, so an orchestrator can call them like any provider. In Kestra, you point the AI tasks at the gateway's base URL; Kestra then handles the workflow around the call: triggers, retries, approvals, passing context to other tasks, and the execution history."
  - question: "How can I optimize LLM costs using an AI gateway?"
    answer: "An AI gateway helps optimize LLM costs through several mechanisms: intelligent caching of frequent queries reduces redundant API calls, dynamic routing can direct requests to the most cost-effective model for a given task, and unified metering provides detailed usage analytics to identify areas for optimization. Combined with an orchestrator, you can also pause workloads when a budget threshold is reached."
---

> **TL;DR** — An AI gateway is a proxy between your applications and LLM providers. It gives every model call one endpoint and one set of controls: routing and fallbacks across providers, caching, token-based rate limits, key management, and logging. An orchestrator such as Kestra then runs the multi-step workflows that make those calls.

Once more than one team calls large language models (LLMs), the same problems appear everywhere: API keys copied into several services, no shared view of token spend, and an outage at one provider taking applications down. An AI gateway puts one layer in front of all model providers to handle these concerns once.

This article explains what an AI gateway does, how it differs from a traditional API gateway, which options exist, and how it fits with workflow orchestration.

## What an AI Gateway Does

An AI gateway sits between your applications and the LLM providers you use, such as OpenAI, Anthropic, or Google Gemini. Applications send every model request to one endpoint, usually with an OpenAI-compatible API, and the gateway routes it to the right model.

### AI Gateways vs. Traditional API Gateways

While both are proxy layers, their focus and capabilities are distinct. A traditional API gateway is designed for general-purpose API management, focusing on concerns like HTTP routing, authentication (OAuth, API keys), and rate limiting for microservices.

An AI gateway is built for model traffic: it reads prompts, responses, and token counts, so it can route, limit, and log at that level.

| Capability | Traditional API Gateway | AI Gateway |
|------------|-------------------------|------------|
| **Routing** | Based on URL path and HTTP method | Based on prompt content, model availability, cost, latency |
| **Caching** | Standard HTTP caching (e.g., based on headers) | Semantic caching (based on prompt meaning, not just text) |
| **Rate Limiting** | Based on number of requests | Based on tokens per minute, requests per minute, and cost |
| **Security** | Authentication, authorization, WAF | Prompt injection detection, PII redaction, output moderation |
| **Observability** | Request/response logs, latency metrics | Token usage tracking, cost attribution, prompt/response tracing |
| **Fallbacks** | Simple retry on HTTP failure | Intelligent fallback to different models or providers |

### Key Capabilities of an AI Gateway

An AI gateway typically combines:

*   **Dynamic Routing and Fallback:** Automatically route requests to different models based on rules you define. For example, you could send complex queries to a large model and simpler ones to a faster, cheaper one. If a primary model provider is down, the gateway can automatically fall back to a secondary option. 
*   **Caching:** Reduce costs and latency by caching responses to common prompts. Semantic caching can even recognize when two different prompts have the same meaning and serve a cached response, avoiding a redundant API call.
*   **Unified Observability:** Gain a single view of all your LLM usage, costs, and performance. Track token consumption, latency, and error rates across all models and applications, making it easier to monitor and optimize your [LLM cost](/resources/ai/llm-cost-optimization).
*   **Token Metering and Budgeting:** Centralize billing and set spending limits or alerts to prevent unexpected cost overruns. You can attribute costs to specific teams, projects, or users.

## Why Production AI Relies on an AI Gateway

In production, reliability, security, and governance matter more than in a prototype. A gateway gives one place to enforce them.

### Mitigating Vendor Lock-in and Enhancing Reliability

By abstracting the underlying model providers, an AI gateway gives you the flexibility to switch models or add new ones without rewriting your application code. This reduces vendor lock-in and lets you pick the right model for each task. If one provider has an outage, the gateway can reroute traffic to another.

### Ensuring Security, Governance, and Compliance

Centralizing LLM traffic through a gateway creates a single point for enforcing security policies. 

*   **API Key Management:** Store all your provider API keys in the gateway's secure vault instead of scattering them across multiple applications.
*   **PII Redaction:** Automatically detect and mask Personally Identifiable Information (PII) from prompts before they are sent to the LLM, helping you meet compliance requirements.
*   **Prompt Guardrails:** Implement security measures to detect and block prompt injection attacks, where malicious input tries to manipulate the model's behavior; [OWASP ranks prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) first among LLM application risks. The [LLM Prompt Injection and PII Redaction Security Gateway blueprint](/blueprints/llm-prompt-injection-and-pii-redaction-gateway) shows how to implement this pattern.
*   **Role-Based Access Control (RBAC):** Define which teams or applications are allowed to use which models, enforcing organizational policies and controlling access.

For more on building secure and governed AI systems, explore our [AI Orchestration Resources](/resources/ai).

## Orchestrating AI Gateway Interactions with Kestra

A gateway manages individual model requests; it is not a workflow engine. Production AI systems are multi-step: fetch data, call a model, validate the output, write results, ask a human. An orchestrator like Kestra runs those [AI automation](/ai-automation) workflows, while the gateway handles each model call.

This combination allows you to:
*   **Build Complex Agentic Workflows:** Orchestrate sequences of LLM calls, tool usage, and data processing steps.
*   **Implement Event-Driven Execution:** Trigger AI workflows based on events from other systems, such as a new file arriving in S3 or a new record in a database.
*   **Manage Context and State:** Pass data and context between different tasks in your workflow, enabling more sophisticated AI interactions.
*   **Automate FinOps Policies:** Use Kestra to read gateway usage and act on it, such as pausing non-critical workloads when a spending threshold is reached.

## YAML Example: Calling Models Through a Gateway, With Fallback

Because most gateways speak the OpenAI API, Kestra's AI tasks can use them by setting the provider's `baseUrl`. The [`Fallback` provider](/plugins/plugin-ai/provider/io.kestra.plugin.ai.provider.fallback) tries providers in order and moves to the next one on connection failures, timeouts, HTTP 5xx, or 429 responses. Here the gateway is the first choice and a direct Gemini call is the backup.

```yaml
id: ai-gateway-request-with-fallback
namespace: company.team.ai

inputs:
  - id: ticket_text
    type: STRING
    defaults: "My invoice for October shows a duplicate charge."

tasks:
  - id: summarize_ticket
    type: io.kestra.plugin.ai.completion.ChatCompletion
    provider:
      type: io.kestra.plugin.ai.provider.Fallback
      providers:
        - type: io.kestra.plugin.ai.provider.OpenAI
          baseUrl: "{{ secret('AI_GATEWAY_BASE_URL') }}"
          apiKey: "{{ secret('AI_GATEWAY_KEY') }}"
          modelName: gpt-5-mini
        - type: io.kestra.plugin.ai.provider.GoogleGemini
          apiKey: "{{ secret('GEMINI_API_KEY') }}"
          modelName: gemini-2.5-flash
    messages:
      - type: SYSTEM
        content: Summarize the support ticket in one sentence and name its category.
      - type: USER
        content: "{{ inputs.ticket_text }}"

  - id: log_summary
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.summarize_ticket.textOutput }}"

errors:
  - id: notify_on_failure
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {"text": "All model providers failed for {{ flow.id }} (execution {{ execution.id }})."}
```

A few things are worth noticing:
*   **The gateway is just a base URL:** routing, caching, and key management stay in the gateway; the flow does not change if you switch gateway.
*   **Fallback outside the gateway:** if the gateway itself is down, the call goes straight to a second provider. Authentication and invalid-request errors do not trigger a fallback, so configuration mistakes still surface.
*   **Token usage per run:** the task reports input and output token counts as metrics, next to the gateway's own logs.
*   **Secrets:** gateway and provider keys come from Kestra secrets, not from the flow. For a self-hosted variant, see the [LLM gateway with fallback blueprint](/blueprints/llm-gateway-fallback-vllm-to-gemini-with-langfuse).

## Comparing Leading AI Gateway Solutions

The market includes open-source proxies, managed cloud services, and AI features added to API management platforms. Most expose an OpenAI-compatible endpoint, so Kestra can call any of them through the `baseUrl` of its AI providers or with an HTTP request.

| Solution | Type | Notable features (from the vendor's documentation) |
|---|---|---|
| [LiteLLM Proxy](https://docs.litellm.ai/docs/simple_proxy) | Open source, self-hosted | OpenAI-compatible proxy for many providers, spend tracking, virtual keys, fallbacks |
| [Portkey Gateway](https://github.com/Portkey-AI/gateway) | Open source, also managed | Routing, retries, fallbacks, load balancing, guardrails |
| [MLflow AI Gateway](https://mlflow.org/docs/latest/genai/governance/ai-gateway/) | Open source | Unified endpoint across providers, credential management, part of MLflow |
| [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/) | Managed | Caching, rate limiting, analytics, logging |
| [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) | Managed | One endpoint for many providers, usage monitoring, fallbacks |
| [Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities) | Managed, API management | Token limits, semantic caching, load balancing for Azure OpenAI and other models |
| [Kong AI Gateway](https://developer.konghq.com/ai-gateway/) | API management, open source and enterprise | AI proxy, prompt guards, semantic caching on top of Kong Gateway |

## Where AI Gateways Deliver Value

AI gateways are valuable in a wide range of use cases:
*   **RAG (Retrieval-Augmented Generation):** Cache responses for frequently accessed documents to reduce latency and cost in your [RAG architecture](/resources/ai/rag-architecture).
*   **Agentic Systems:** Dynamically route different sub-tasks in an [agentic orchestration](/resources/ai/agentic-orchestration) to the most suitable model, balancing cost and capability.
*   **Multi-Modal Applications:** Use a single gateway to manage requests to different types of models, including text, image, and audio generation.
*   **Cost-Sensitive Scenarios:** Set budget limits, use caching, and pair them with an orchestrated [circuit breaker](/blueprints/cloud-llm-finops-circuit-breaker) that pauses workloads past a threshold.

## Related concepts

*   [AI orchestration](/resources/ai/ai-orchestration)
*   [API orchestration](/resources/infrastructure/api-orchestration)
*   [Human-in-the-loop orchestration](/resources/ai/human-in-the-loop-orchestration)

Kestra runs the workflows around your model calls, whichever gateway you use, with retries, approvals, and a full execution history.
