---
title: Modernizing Mission-Critical E-commerce Integrations with Kestra
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
quotePersonTitle: Engineering Manager
industry: largest wine e-tailers in Latin America
headquarter: São Paulo, Brazil
solution: E-commerce & Data Platform
companyName: Víssimo
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

In 2025, Víssimo launched a broader technology optimization and FinOps initiative, with a clear goal: **scale sustainably by simplifying the platform and reducing structural inefficiencies**.

This process made two things clear:

- The existing iPaaS and lambda-heavy BI architecture were becoming costly and hard to govern.
- The lack of true orchestration was amplifying operational risk and complexity.

The team evaluated several orchestration options, including n8n, Temporal, Prefect, and Airflow. Kestra emerged as the most balanced solution for their needs.

> “It became clear that Kestra allowed us to consolidate responsibilities that were previously split across multiple tools—without increasing complexity.”


## Why Kestra

Kestra stood out as a **structural upgrade**.

It allowed Víssimo to:

- Model **resilient asynchronous workflows** explicitly
- Treat **state, retries, and failures as first-class concepts**
- Consolidate orchestration for both **BI pipelines and critical integrations**
- Gain **native observability and traceability** without bolting on external systems
- Reduce total cost of ownership compared to iPaaS and lambda-centric architectures

Most importantly, Kestra enabled orchestration to be treated as **core infrastructure**.

## The solution: orchestration as the backbone

Víssimo adopted Kestra as the orchestration backbone for both data and integration flows.

The rollout was deliberately phased:

- **BI first**: migrating ETL pipelines to Kestra to validate architecture, performance, and governance
- **Critical e-commerce integrations next**: inventory, orders, and high-resilience flows

Kestra was deployed on Kubernetes and operated as a production-grade platform, with a clear separation between:

- **Control plane**: orchestration, state, retries, visibility
- **Workers**: execution, scaling, and isolation

This separation proved critical during high-load scenarios and large-scale reprocessing.

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

## The results: resilience, clarity, and measurable ROI

The impact was both operational and financial:

- **40% reduction** in BI and ETL platform costs
- **Integration costs reduced to ~10%** of the previous iPaaS spend
- **Significant drop in incidents**, with failures becoming visible and manageable
- **Zero incidents during Black Friday 2025**, even under peak load

> “It was the most predictable and controlled Black Friday we’ve ever experienced.”
> 

Native workflow observability shifted operations from reactive firefighting to proactive control, while reducing dependency on individual expertise.

## What’s next

With a stable orchestration foundation in place, Víssimo is expanding Kestra’s role:

- Automating additional business processes
- Exploring AI-driven workflows and self-healing patterns
- Strengthening omnichannel and reverse-ETL use cases

What started as cost optimization became a strategic transformation: **orchestration as a platform capability**, supporting growth with predictability, governance, and resilience.


>A big thank you to [Rafael Bartalotti](https://www.linkedin.com/in/rafaelbartalotti/) Engineering Manager at Víssimo for sharing his story with us.


**What would change if your most critical e-commerce and data flows were designed as orchestrated, observable, and governable processes—not improvised integrations?**

→ [Discover how Kestra powers resilient orchestration in production.](https://kestra.io/demo)
