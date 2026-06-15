---
title: Modernizing Mission-Critical E-commerce Integrations with Kestra
rank: 2
description: Víssimo chose Kestra over Temporal, Airflow, Prefect, and n8n for
  resilient e-commerce and BI workflows.
metaTitle: Modernizing Mission-Critical E-commerce Integrations with Kestra
metaDescription: Víssimo chose Kestra over Temporal, Airflow, Prefect, and n8n
  for resilient e-commerce and BI workflows.
heroImage: ./hero.png
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.kafka.Consume
  - io.kestra.plugin.core.http.Request
  - io.kestra.plugin.aws.s3.Upload
kpi1: |-
  ##### 40%
  BI and ETL platform cost reduction
kpi2: |-
  ##### 90%
  Reduction in integration costs 
kpi3: |-
  ##### 0 incidents
  During Black Friday 2025
quote: With Kestra, orchestration stopped being a fragile point in the
  architecture and became a stable foundation for the business.
quotePerson: Rafael Bartalotti
quotePersonTitle: Engineering and Architecture Manager
industry: largest wine e-tailers in Latin America
headquarter: São Paulo, Brazil
region: South America
companySize: "51–500"
solution: E-commerce & Data Platform
tagline: Latin America's largest wine e-commerce platform
companyName: Víssimo
useCase: Business Automation
cta: "What would change if your e-commerce integrations ran mission-critical workflows automatically—keeping inventory, orders, and fulfillment in sync at scale?"
---

## The context

Víssimo Group operates a portfolio of premium wine and food e-commerce brands in Brazil, including Evino and Grand Cru. Together, these brands handle high-volume, mission-critical commerce flows spanning e-commerce platforms, ERP systems, peripheral services, and BI.

At the group level, this translates into a shared integration and data backbone that must remain reliable under heavy load, seasonal spikes, and complex legacy constraints, while supporting multiple operating brands with different needs.

Like many companies in the Brazilian e-commerce ecosystem, these integrations had grown organically over time, built under delivery pressure, across multiple tools, services, scripts, and platforms.

The result worked, but only barely.

## The pain: critical flows without real orchestration

When failures occurred, orders stuck on the way to the ERP, broken inventory synchronization, or inconsistencies in BI pipelines—understanding *what actually happened* required digging through logs spread across systems.

Problem resolution often depended on a small group of specialists who understood the full integration landscape.

> “Many nights were spent analyzing stuck order queues or reprocessing large volumes of data due to failures.”
> 

Integrations that were core to the business were treated as peripheral systems, lacking:

- End-to-end visibility
- Explicit state and traceability
- Standardized retry and reprocessing mechanisms
- Governance and versioning
- Predictable cost and scalability models

As volume and complexity increased, so did operational cost, incident frequency, and dependency on external tools and vendors.

## The turning point: cost optimization exposed structural limits

In 2024, Víssimo launched a broader technology optimization and FinOps initiative, with a clear goal: **scale sustainably by simplifying the platform and reducing structural inefficiencies**.

That work surfaced two structural problems. The iPaaS and lambda-heavy BI stack were expensive and hard to govern. And without true orchestration, every incident required hands-on intervention from the same small group of specialists.

The path forward became clear in quarterly steps:

- **Q1/2025**: iPaaS and BI lambdas identified as structural bottlenecks; the team evaluated n8n, Temporal, Prefect, Airflow, and Kestra
- **Q2/2025**: Kestra consolidates the BI and ETL stack
- **Q3/2025**: Kestra consolidates iPaaS

Kestra emerged as the most balanced solution—the best fit across open source, declarative YAML, native state and replay, full observability, and a mental model that maps naturally to e-commerce flows.

> “It became clear that Kestra allowed us to consolidate responsibilities that were previously split across multiple tools—without increasing complexity.”


## Why Kestra

Kestra stood out as a **structural upgrade**.

It allowed Víssimo to:

- Model **resilient asynchronous workflows** explicitly
- Treat **state, retries, and failures as first-class concepts**
- Consolidate orchestration for both **BI pipelines and critical integrations**
- Gain **native observability and traceability** without bolting on external systems
- Reduce total cost of ownership compared to iPaaS and lambda-centric architectures

Kestra made orchestration **core infrastructure**, not a peripheral concern layered on top of existing flows.

## The solution: orchestration as the backbone

Víssimo adopted Kestra as the orchestration backbone for both data and integration flows.

The rollout was deliberately phased:

- **BI first**: migrating ETL pipelines to Kestra to validate architecture, performance, and governance
- **Critical e-commerce integrations next**: inventory, orders, and high-resilience flows

Kestra was deployed on Kubernetes and operated as a production-grade platform, with a clear separation between:

- **Control plane**: orchestration, state, retries, visibility
- **Workers**: execution, scaling, and isolation

Under high load and during large-scale reprocessing, that separation is what held.

Here's a representative workflow from the order-to-ERP integration, showing how resilience is declared rather than coded:

```yaml
id: order_to_erp_pipeline
namespace: ecommerce.production

labels:
  order_id: "{{ trigger.orderId }}" # idempotency by business key

triggers:
  - id: order_created
    type: io.kestra.plugin.core.trigger.Webhook
    key: 4wjtkzwVGBM9yKnjm3yv8r

concurrency:
  limit: 50         # protects ERP from burst
  behavior: QUEUE   # absorbs peak without crashing legacy

tasks:
  - id: push_to_sap
    type: io.kestra.plugin.core.http.Request
    timeout: PT30S   # expected failure, handled declaratively
    retry:
      type: exponential
      maxAttempts: 5
      interval: PT1M
      maxInterval: PT5M
```

Timeout, retry, concurrency, and idempotency are workflow contracts—not scattered defensive code.

## What they run on the platform

Today, Kestra orchestrates:

- Asynchronous e-commerce integration workflows
- ERP interactions and inventory synchronization
- BI and ETL pipelines
- Event-driven processes backed by messaging queues
- Controlled reprocessing and backfills

Resilience is modeled directly in workflows through:

- Explicit retries and timeouts
- Idempotency anchored to business keys
- Concurrency control to protect legacy systems
- Safe, repeatable reprocessing without data duplication

## The results: 40% BI cost reduction, zero Black Friday incidents

The impact was both operational and financial:

- **40% reduction** in BI and ETL platform costs
- **Integration costs reduced to ~10%** of the previous iPaaS spend
- **Significant drop in incidents**, with failures becoming visible and manageable
- **Zero incidents during Black Friday 2025**, even under peak load

> “It was the most predictable and controlled Black Friday we’ve ever experienced.”
> 

Failures that once required a specialist to diagnose now appeared directly in the workflow log.

## What’s next

With a stable orchestration foundation in place, Víssimo is expanding Kestra’s role across additional business processes and omnichannel flows.

On AI, the team’s view is direct: without orchestration it’s unpredictable. An AI agent with no replay, no audit trail, and no determinism isn’t automation—it’s operational variability. Kestra gives AI tasks the same contract as any other workflow step: replay on failure, idempotency by business key, SLA and timeout enforcement, full audit trail, and governance from day one.

What started as a cost optimization review ended with a transformed architecture. BI costs fell 40%, iPaaS spend dropped by an order of magnitude, and Black Friday 2025 ran without a single incident.


>A big thank you to [Rafael Bartalotti](https://www.linkedin.com/in/rafaelbartalotti/) Engineering Manager at Víssimo for sharing his story with us.


**What would change if your most critical e-commerce and data flows were designed as orchestrated, observable, and governable processes—not improvised integrations?**

→ [Discover how Kestra powers resilient orchestration in production.](https://kestra.io/demo)
