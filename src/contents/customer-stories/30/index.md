---
title: Building a Government-Grade Orchestration Control Plane with Kestra
description: standardized API-driven cloud orchestration on private cloud using Kestra.
metaTitle: Building a Government-Grade Orchestration Control Plane with Kestra
metaDescription: standardized API-driven cloud orchestration on private cloud using Kestra.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.ee.kubernetes.runner.Kubernetes
  - io.kestra.plugin.kafka.Trigger
  - io.kestra.plugin.core.http.Trigger
  - io.kestra.plugin.scripts.python.Script
  - io.kestra.plugin.scripts.shell.Script
  - io.kestra.plugin.jdbc.postgresql.Trigger
kpi1: |-
  ##### 1 Control Plane
  For private-cloud automation
kpi2: |-
  ##### 3 Weeks
  To validate compliancy
kpi3: |-
  ##### 0 Dependency
  Fully self-hosted by design
quote: Kestra gives us a modern orchestration platform we can run ourselves
  without compromising on governance.
quotePerson: Platform Architect
quotePersonTitle: ""
industry: Service Provider
headquarter: Berlin - Germany
solution: Build a government-grade cloud service portal
companyName: Public-sector IT services provider
---

## The context

This organization is a major public-sector IT services provider in Germany. Its role is to design, operate, and evolve shared digital platforms for government institutions.

As part of a broader cloud initiative, the team was building a **private cloud service portal**, a platform that would expose infrastructure services through APIs while meeting strict public-sector requirements.

Automation was essential. But in this environment, automation must be **controlled, auditable, and self-hosted**. External SaaS platforms were not an option, and ad-hoc scripting could not meet governance expectations.

They needed an orchestration layer that could act as a **reliable control plane** for long-running infrastructure workflows.

## The tension: automation is required, but control cannot be delegated

The team faced a familiar public-sector dilemma.

On one side, demand for cloud services was increasing. On the other, execution had to remain compliant with internal standards, security requirements, and operational boundaries between teams.

Script-based automation and CI pipelines could trigger actions, but they didn’t provide a clear answer to fundamental questions:

Who triggered this?

What exactly ran?

How is progress tracked?

Where is the audit trail?

Automation without visibility quickly becomes operational risk.


## Why Kestra

Kestra stood out because it aligned with how the organization already operates.

It can be **fully self-hosted**, deployed on **OpenShift**, and integrated with enterprise identity systems. Governance features like role-based access, separation between teams, and execution traceability are built in, not bolted on.

> “Being able to build and manage workflows directly in the UI, while keeping everything on our own infrastructure, was a key differentiator.”
> 
> 
> *Platform Architect*
> 

Another decisive factor was usability. Workflows can be authored and evolved directly in the portal experience, reducing friction for platform teams while keeping execution controlled.

Kestra provided a balance that was difficult to achieve with scripts or traditional CI tooling: **modern automation with enforceable governance**.

## The solution: a self-hosted orchestration control plane

Kestra was adopted as the orchestration layer for the private cloud platform.

The initial use case focuses on **API-driven VM provisioning**, but the architecture is designed to scale beyond a single workflow type. The team validated a pattern where:

- An external system creates and tracks a request
- Kestra orchestrates the long-running workflow
- Execution state and results are reported back for traceability

This keeps systems of record outside Kestra, while Kestra provides reliable execution, visibility, and control.

Event-driven integration plays a central role as well, with Kafka treated as a foundational requirement for triggering and connecting workflows.

## What they run on the platform

Today, the platform is built around:

- **API-driven orchestration workflows**
- **Kafka-based event handling**
- **Kubernetes-native execution on OpenShift**
- **PostgreSQL** as the workflow backend
- **S3-compatible internal object storage**
- **OIDC-based enterprise identity integration**

This setup allows workflows to scale safely while maintaining clear operational boundaries between teams and services.

## The outcome: controlled automation that can grow

The benefits are clear:

- The organization now has a **single orchestration control plane** aligned with public-sector constraints.
- Automation is **observable and traceable by default**, reducing operational ambiguity.
- Platform teams can deliver new workflows without bypassing governance.
- The foundation is in place to expand orchestration beyond VM provisioning without re-architecting later.

Or as the team summarized the win:

> “Kestra lets us move forward with cloud automation, while staying fully in control.”
> 
> 
> *Platform Team*
> 

---

## What’s next

After validating the core orchestration patterns, the team plans to extend Kestra to additional workflows within the private cloud platform.

The long-term goal is clear: a **standardized orchestration control plane** that government teams can rely on for secure, auditable cloud operations.

**What would change if your public-sector cloud automation ran through a self-hosted orchestration control plane—built for governance, visibility, and scale?**

→ [Explore governed automation with Kestra.](https://kestra.io/demo)

