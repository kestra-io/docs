---
title: Modernizing Mission‑Critical Workflows in a Highly Regulated Environment
description: How a leading pharmacy retailer replaced a 30+ year legacy critical
  integration platform using Kestra.
metaTitle: Modernizing Mission‑Critical Workflows in a Highly Regulated Environment
metaDescription: How a leading pharmacy retailer replaced a 30+ year legacy
  critical integration platform using Kestra.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.kafka.Trigger
  - io.kestra.plugin.scripts.python.Script
  - io.kestra.plugin.core.http.Request
kpi1: |-
  ##### 400+
  Pharmacy relies on Kestra workflows
kpi2: |-
  ##### 50+
  Cricital workflows modernized
kpi3: |-
  ##### 30+ Years
  Old platform, replaced in few months
quote: Stability was the turning point. With Kestra, our most critical flows
  finally run the way they should.
quotePerson: Infrastructure Lead
quotePersonTitle: ""
industry: Healthcare
headquarter: Sweden
solution: Pharmacy Retail
companyName: Pharmacy Retailer
---

## The context

This organization operates one of the largest pharmacy retail networks in its market, with hundreds of physical locations and a major online presence. Their integration layer sits in the middle of everything: supplier ordering, delivery confirmations, downstream updates, and the operational “glue” that keeps systems aligned.

But this is not a typical retail environment.

Healthcare-adjacent data and consumer purchase patterns create strict regulatory expectations. For certain flows, “move it to the cloud” is a compliance and risk decision.

> “The market is highly regulated, it’s really strict, most of the stuff needs to be on‑prem. It’s really hard to move it to the cloud.”
> 
> 
> **Solution Architect, IT Foundation**
> 

At the same time, the company was already modernizing aggressively: adopting Kafka for event-driven integration and expanding Azure services for workloads that can run in the cloud. What remained was the hard part: the integrations that must stay local, stable, and provable.

## The tension: the car can’t stop, but the platform was aging out

For years, a locally built legacy integration system handled “everything.” Over time it became a risk surface.

It was *operationally fragile* and difficult to evolve at the pace the business demanded.

> “We’re driving the car and changing all the parts at the same time. The car never stops.”
> 
> 
> **IT Foundation Lead**
> 

Under the hood, limitations piled up:

- A legacy platform dating back decades, with reliability issues that required daily attention.
- Modernization pressure: the organization is moving faster than the platform can.
- Engineering constraints: teams increasingly build integration logic in Python, but legacy runtime constraints and slow updates created friction.
- Governance gaps: knowing exactly what ran, when, and by whom mattered more as flows became more critical.

> “It’s custom made 30–40 years ago, and it is starting to show its age.”
> 
> 
> **Solution Architect, IT Foundation**
> 

The outcome was predictable: teams could still “make it work,” but the cost was growing: incidents, restarts, and increasing effort to keep critical flows dependable.

## Why Kestra

They needed an orchestration layer that could become the **operational control plane** for regulated, mission‑critical flows, without forcing a big-bang migration or rewriting everything at once.

Kestra stood out because it matched the constraints that actually mattered:

- **On‑prem first** for workflows that cannot leave regulated zones
- **Language‑agnostic orchestration** so teams can keep using Python (and shell where needed) instead of being boxed into a single runtime
- **Visibility and operability** so workflows stop being “tribal knowledge” and become observable systems
- **Enterprise controls** (SSO, access control, auditability, secrets) for regulated operations and third‑party consultant access
- **Support with SLA** because this is not a “best effort” platform—order and supplier flows are business‑critical

> “Kestra is really the modern solution we need, and it’s language agnostic!”
> 
> 
> **Solution Architect, IT Foundation**
> 

Just as importantly, Kestra aligned with a practical operating model: their long-term integration partner could implement and run the migration work, while internal platform engineers gained a maintainable foundation they could own.

---

## The solution: a governed on‑prem orchestration layer for supplier and order flows

The team began by validating Kestra in a non‑production environment using containerized deployment, then moved into enterprise onboarding—planning for a production-grade architecture with high availability and repeatable operations.

Their direction was clear:

- Keep the initial rollout **on‑prem** for sensitive workflows
- Use Kestra to orchestrate their existing integration patterns: **Kafka**, **SFTP file exchange**, **API calls**, and **database updates**
- Enable a support-friendly operating model where common interventions don’t require a developer to “dig into the old platform”

> “It would be really good to allow first‑line support to resend it… instead of getting developers to dig into the flow.”
> 
> 
> **Solution Architect, IT Foundation**
> 

This was a foundational shift: instead of integrations being “code that runs somewhere,” they become **workflows with guardrails, visibility, and controlled execution**.

---

## What they run on the platform

The first priority was supplier ordering, the workflows that connect internal systems to external supplier expectations.

A representative flow pattern includes:

- Ingest a supplier order or delivery message
- Validate schema and correctness
- Transform into supplier-specific formats
- Deliver via SFTP / file-based exchange (where APIs aren’t available)
- Emit or consume Kafka events as part of the broader integration fabric
- Update operational databases where needed

As the migration progresses, the target scope focuses on the integrations that **must remain on‑prem**, while cloud-native workloads continue to move toward managed services where allowed.

## The outcome: stability, clarity, and operational control, without breaking modernization

Even early in the journey, the impact is straightforward and operationally meaningful:

- **Reliability becomes a platform goal**, not a daily firefight, especially for order flows that cannot fail quietly.
- **Support teams can safely intervene** (replays, resends, standard actions) without requiring deep legacy knowledge.
- **Platform engineers gain a modern orchestration foundation** that can evolve with Kafka + cloud modernization—while keeping regulated workflows local.
- **Governance and accountability improve** because access and execution can be tied back to identity and controlled roles (critical in regulated environments and in consultant-heavy operating models).

Or as one team member summarized the driver:

> “ these flows are mission critical, Kestra allows us to let the right workflow management, to the right person ”
> 
> 
> **IT Foundation Lead**
> 

---

## What’s next

The rollout is deliberate and phased: migrate the highest-impact on‑prem order and supplier flows first, then expand toward the remaining regulated integrations, while keeping the option open to orchestrate cloud-based workloads later where policy allows.

The end-state is not “yet another tool.”

It’s a control plane for integration workflows: **observable, supportable, and designed to fit regulated reality.**


**What would it look like if your most regulated workflows ran through a true orchestration control plane, on‑prem, auditable, and support-friendly by design?**

→ [Explore governed automation with Kestra.](https://kestra.io/demo)
