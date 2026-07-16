---
title: How Víssimo Consolidated an iPaaS and AWS Lambdas onto One Orchestration Platform
rank: 1
description: Víssimo Group consolidated Digibee iPaaS and AWS Lambda-based BI onto Kestra, cutting integration costs by 90%, BI costs by 40%, and running its first zero-incident Black Friday in company history.
metaTitle: "Víssimo & Kestra: Zero Black Friday Incidents, 90% Cost Reduction"
metaDescription: Víssimo consolidated Digibee iPaaS and AWS Lambdas onto Kestra, cutting integration costs by 90%, BI costs by 40%, and achieving zero incidents on Black Friday.
heroImage: ./hero.png
featured: false
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.core.trigger.Webhook
  - io.kestra.plugin.core.http.Request
kpi1: |-
  ##### 40%
  BI and ETL cost reduction
kpi2: |-
  ##### 90%
  integration cost reduction
kpi3: |-
  ##### 0 incidents
  Black Friday
kpi4: |-
  ##### ~600
  workflows in production
quote: With Kestra, orchestration stopped being a fragile point in the architecture and became a stable foundation for the business.
quotePerson: Rafael Bartalotti
quotePersonTitle: Engineering and Architecture Manager
industry: E-commerce
industry2: Retail
headquarter: São Paulo, Brazil
region: Americas
companySize: "< 100"
solution: Víssimo Group is the holding company behind Evino (Brazil's largest digital wine e-tailer) and Grand Cru (premium physical wine retail). Together they run mission-critical commerce integrations, ERP synchronization, and BI pipelines across Magento, SAP, and a shared data platform serving both brands.
tagline: Brazil's leading premium wine e-commerce and retail group
companyName: Víssimo Group
useCase: Consolidating an iPaaS and AWS Lambdas onto one platform to cut costs 90% and run Brazil's premium wine group's first zero-incident Black Friday
useCaseShort: E-commerce Orchestration
deployment: Kestra OSS (self-hosted)
intro: "Víssimo Group runs two premium wine brands in Brazil, Evino and Grand Cru, on a shared integration and data backbone spanning e-commerce platforms, ERPs, and BI. That backbone had grown organically: an iPaaS for commerce integrations, AWS Lambdas for BI pipelines, and scattered scripts filling the gaps. Under peak load it showed its limits. A 2024 FinOps review confirmed the structural problem. Víssimo consolidated both tool layers onto Kestra, cutting BI costs by 40%, reducing integration spend to roughly 10% of previous iPaaS levels, and running its first zero-incident Black Friday."
cta: "What would change if your most critical e-commerce flows were observable, replayable, and governed from a single platform?"
---

## The problem

<div class="problem-list">
<div class="problem-item">
<span class="problem-number">01</span>
<div class="problem-title">No end-to-end traceability: failures only surfaced on the business dashboard</div>
<div class="problem-desc">Víssimo's integration landscape had grown to cover two brands, two ERPs, and multiple commerce systems. Logs were spread across Datadog, CloudWatch, the ERP, BI systems, and Slack. When something failed, recovery meant hunting across five tools to find where in the chain it broke. Silent failures (order flows that dropped without raising an alert) only became visible when the business dashboard showed a gap. Knowledge of how integrations actually worked lived in two or three engineers' heads, not in any system.</div>
</div>
<div class="problem-item">
<span class="problem-number">02</span>
<div class="problem-title">Resilience improvised in code, not expressed as policy</div>
<div class="problem-desc">Retry logic, timeout behavior, and reprocessing mechanisms were written by hand into each integration by whoever built it. An iPaaS gave connectors but no governance. AWS Lambdas gave execution but no state. Every failure scenario was something an engineer had coded, which also meant something an engineer had to understand, debug, and maintain. <em class="inline-quote">"Many nights were spent analyzing stuck order queues or reprocessing large volumes of data due to failures."</em> There was no way to read a workflow definition and understand what its failure policy was.</div>
</div>
<div class="problem-item">
<span class="problem-number">03</span>
<div class="problem-title">A FinOps audit exposed two tools growing faster in cost than in value</div>
<div class="problem-desc">In 2024, Víssimo launched a FinOps initiative to scale sustainably. The audit surfaced two structural line items. First: AWS Lambda-based BI pipelines, expensive and hard to govern as data complexity grew. Second: Digibee, the iPaaS running e-commerce integrations, where licensing costs were growing faster than the value delivered. Both pointed to the same root cause: the tools weren't orchestration. They were execution. Governance was improvised everywhere else. <em class="inline-quote">"Cost optimization was the trigger. Architecture was the gain."</em></div>
</div>
</div>

<div class="problem-close">
<div class="problem-close-prefix">// The requirement</div>
A platform where <strong class="problem-close-key">resilience is declared, not improvised</strong>, and where retries, timeouts, and concurrency limits are visible in the workflow definition, not buried in application code.
</div>

## What Kestra fixed

<div class="fix-list">
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Declarative resilience: retries and timeouts in the workflow, not in the code</div>
<div class="fix-desc">Every Kestra workflow is a YAML file with explicit failure policy: triggers, concurrency limits, retry strategies, timeouts, and idempotency keys. The order-to-ERP pipeline caps at 50 concurrent executions (protecting SAP from burst), retries with exponential backoff up to five attempts, and anchors every execution to an <code>order_id</code> label for idempotent reprocessing. Retry logic stopped being an engineering decision and became an operational contract that anyone on the team can read. <em class="inline-quote">"Clicking doesn't scale. Versioned YAML does. Workflow is code. Code has PR, review, rollback, blame."</em></div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">End-to-end observability: every execution has a trace</div>
<div class="fix-desc">When a flow fails, engineers can see exactly when the event fired, where the timeout occurred, and when the retry resolved it, all in a single view without switching between Datadog, CloudWatch, and the ERP. Mean time to resolution dropped. Knowledge that had lived in individual engineers' heads moved into the orchestrator, where anyone on the team can read it.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Idempotency by design: reprocessing without fear of duplicates</div>
<div class="fix-desc">Every workflow is anchored to a business key — an <code>order_id</code>, an <code>inventory_update_id</code>, a <code>payment_id</code>. Replaying a failed batch is routine, not an emergency. There's no risk of duplicate orders or double-processed inventory updates because the idempotency contract is declared in the workflow definition, not handled case-by-case in application code.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">One platform consolidating two tool layers at once</div>
<div class="fix-desc">The evaluation covered five alternatives: n8n, Temporal, Prefect, Airflow, and Kestra. Víssimo's criteria reflected what the existing stack lacked: open source, declarative YAML, native state and replay, native observability, and a mental model that mapped to e-commerce workflows. Kestra was the only tool that met all five. Lambda-based BI pipelines were consolidated onto Kestra in Q2 2025. Digibee was decommissioned after the commerce integration migration in Q3 2025. Both cost lines collapsed at the same time. <em class="inline-quote">"It became clear that Kestra allowed us to consolidate responsibilities that were previously split across multiple tools — without increasing complexity."</em> — Rafael Bartalotti, Engineering and Architecture Manager</div>
</div>
</div>
</div>

## Outcomes

<div class="results-list">
<div class="result-item">
<div class="result-metric">90% integration cost reduction</div>
<div class="result-desc">Digibee's licensing model was expensive relative to what Kestra delivers at the infrastructure layer. After migration, integration costs dropped to roughly 10% of previous iPaaS spend.</div>
</div>
<div class="result-item">
<div class="result-metric">40% BI and ETL cost reduction</div>
<div class="result-desc">Consolidating Lambda-based pipelines onto Kestra brought cost down while improving observability and performance. The same workloads now run with full execution tracing and declarative retry policies.</div>
</div>
<div class="result-item">
<div class="result-metric">Zero catastrophic incidents on Black Friday 2025</div>
<div class="result-desc"><em class="inline-quote">"It was the most predictable and controlled Black Friday we've ever experienced."</em> With ~600 workflows handling 70 to 100k executions per day and peak traffic concentrated in a single window, zero incidents represented a structural improvement, not a lucky night.</div>
</div>
<div class="result-item">
<div class="result-metric">~600 workflows, 70–100k executions/day</div>
<div class="result-desc">The phased migration ran Q2 through Q3 2025: BI pipelines first, commerce integrations second. By late 2025, roughly 600 workflows were running in production on Kubernetes, covering the full Víssimo operation across both brands.</div>
</div>
</div>

## Kestra at Víssimo Group

Kestra OSS runs self-hosted on Kubernetes on AWS, with a JDBC backend (PostgreSQL). The deployment maintains a clear separation between the control plane (orchestration, state, retries, visibility) and workers (execution, scaling, isolation). Under heavy load and large-scale reprocessing, that separation is what held. The architecture is event-driven at its core: Kafka events and webhook triggers initiate workflows rather than polling schedules. Kafka absorbs volume; the workflow defines behavior.

The order-to-ERP pipeline illustrates the architecture. An order created in Magento fires a webhook event. Kestra picks it up, applies concurrency controls (capped at 50 concurrent executions to protect SAP from burst), pushes the order to SAP via HTTP, retries with exponential backoff on failure, and labels the execution with the `order_id` for idempotent replay. The full failure policy is in the YAML definition: no application code required to understand what happens when something breaks.

```yaml
id: order_to_erp_pipeline
namespace: ecommerce.production

labels:
  order_id: "{{ trigger.orderId }}"

triggers:
  - id: order_created
    type: io.kestra.plugin.core.trigger.Webhook
    key: 4wjtkzwVGBM9yKnjm3yv8r

concurrency:
  limit: 50
  behavior: QUEUE

tasks:
  - id: push_to_sap
    type: io.kestra.plugin.core.http.Request
    timeout: PT30S
    retry:
      type: exponential
      maxAttempts: 5
      interval: PT1M
      maxInterval: PT5M
```

Rafael Bartalotti has moved into an AI innovation focus, and Víssimo is now prototyping Kestra as an orchestration layer for AI agents — starting with fraud detection. An agent that pulls recent orders, flags anomalies (five sequential orders with different credit cards from the same session), and routes alerts through a governed workflow with full audit trail. The architecture is the same as their e-commerce patterns: triggers, concurrency limits, idempotency, replay — applied to AI decision loops instead of ERP calls. <em class="inline-quote">"AI without orchestration is Russian roulette. An AI agent without replay and audit isn't automation. It's operational variability."</em>

<div class="stack-row">
<span class="stack-pill">Kestra OSS</span>
<span class="stack-pill">Kubernetes</span>
<span class="stack-pill">Kafka</span>
<span class="stack-pill">SAP</span>
<span class="stack-pill">Magento</span>
<span class="stack-pill">PostgreSQL</span>
<span class="stack-pill">AWS</span>
<span class="stack-pill">Webhook triggers</span>
</div>
