---
title: Building a Government-Grade Orchestration Control Plane with Kestra
rank: 1
description: How Dataport, Germany's public-sector IT services provider, consolidated API-driven cloud orchestration onto Kestra on a fully self-hosted private cloud.
metaTitle: "Dataport & Kestra: Building a Government-Grade Orchestration Control Plane"
metaDescription: How Dataport, Germany's public-sector IT services provider, consolidated API-driven cloud orchestration onto Kestra on a fully self-hosted private cloud.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
logoIcon: ./icon.svg
tasks:
  - io.kestra.plugin.ee.kubernetes.runner.Kubernetes
  - io.kestra.plugin.kafka.Trigger
  - io.kestra.plugin.core.http.Trigger
  - io.kestra.plugin.scripts.python.Script
  - io.kestra.plugin.scripts.shell.Script
  - io.kestra.plugin.jdbc.postgresql.Trigger
kpi1: |
  1 control plane
  for private-cloud automation
kpi2: |
  3 weeks
  to validate compliancy
kpi3: |
  0 dependency
  fully self-hosted by design
quote: Kestra gives us a modern orchestration platform we can run ourselves without compromising on governance.
quotePerson: Platform Architect
quotePersonTitle: ""
industry: Public Sector
industry2: Government IT Services
headquarter: Altenholz - Germany
region: Europe
solution: Dataport is the IT integrator for Germany's northern federal states, operating shared data centers and digital infrastructure on their behalf. It is building a private government cloud, exposed to public administrations through a cloud service portal, entirely on infrastructure it controls.
tagline: Germany's public-sector IT integrator, owned by six federal states
companyName: Dataport
companySize: "501–5,000"
intro: Dataport is the IT integrator for Germany's northern federal states, running the shared data centers and digital infrastructure that public administrations depend on. As part of a government cloud initiative, the team needed to expose infrastructure services through a self-service portal without giving up the governance, auditability, and on-premises control a public-sector deployment requires. They ran a rapid, hands-on evaluation before building their private-cloud control plane on top of Kestra.
deployment: Self-hosted · OpenShift · Kubernetes
useCase: Building a fully self-hosted, auditable private-cloud control plane for Germany's public-sector IT services provider Dataport
useCaseShort: Infrastructure Orchestration
cta: "What would change if your public-sector cloud automation ran through a self-hosted orchestration control plane, built for governance, visibility, and scale?"
---

## The problem

Dataport was building a private cloud service portal to expose infrastructure services to public administrations across six German federal states. Automation was essential to make that portal work, but in a government environment, automation that can't be audited is a liability, not a shortcut.

<div class="problem-list">
<div class="problem-item">
<span class="problem-number">01</span>
<div class="problem-title">Workloads couldn't leave Dataport's own infrastructure</div>
<div class="problem-desc">As a government IT integrator bound by BSI (Germany's federal information security agency) standards, Dataport could not move workloads to a commercial cloud for compliance reasons. Any orchestration tool that required external connectivity for core functionality was automatically disqualified.</div>
</div>
<div class="problem-item">
<span class="problem-number">02</span>
<div class="problem-title">Automation without an audit trail was a governance risk</div>
<div class="problem-desc">Script-based automation and CI pipelines could trigger infrastructure actions, but they couldn't answer basic governance questions: who triggered this, what exactly ran, and where is the audit trail. In a public-sector environment, that gap is not acceptable.</div>
</div>
<div class="problem-item">
<span class="problem-number">03</span>
<div class="problem-title">Multiple teams needed to build workflows without one breaking another's</div>
<div class="problem-desc">As more teams started designing workflows for the platform, a mistake in one team's flow couldn't be allowed to take down another team's production environment. The team needed clear separation between development and production before onboarding grew.</div>
</div>
</div>

<div class="problem-close">
<div class="problem-close-prefix">// The requirement</div>
Dataport needed an orchestration layer it could <strong class="problem-close-key">run entirely on its own infrastructure, with governance and audit trails built in, not bolted on</strong>.
</div>

## What Kestra fixed

<div class="fix-list">
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Fully self-hosted, no external connectivity required</div>
<div class="fix-desc">Kestra runs entirely on Dataport's own infrastructure with no dependency on external services to function, meeting the BSI compliance bar that ruled out most commercial alternatives.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Flows built directly in the portal, no compiled code required</div>
<div class="fix-desc"><em class="inline-quote">"The key feature that I think is most important for us is that you can create all of the flows from the portal experience directly, and you don't need necessarily to write code or compile code beforehand,"</em> the team said, comparing it against another tool already in use at Dataport that lacked this capability.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Kubernetes-native execution on OpenShift</div>
<div class="fix-desc">Kestra's Kubernetes task runner replaced Docker-in-Docker as the execution model, running cleanly on Dataport's OpenShift cluster once namespace-level UID range configuration was in place.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Kafka-based status visibility for every workflow stage</div>
<div class="fix-desc">Each stage of a workflow, running, succeeded, or failed, publishes a status update onto Dataport's Kafka message bus, giving surrounding systems asynchronous visibility into infrastructure-provisioning progress without polling Kestra directly.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Enterprise identity and infrastructure-as-code integration</div>
<div class="fix-desc">SSO runs through an OIDC-based enterprise identity provider, and the deployment itself is defined as code, keeping the control plane's own configuration auditable.</div>
</div>
</div>
</div>

## Outcomes

<div class="results-list">
<div class="result-item">
<div class="result-metric">Zero cloud dependency</div>
<div class="result-desc">The control plane runs entirely on Dataport-owned OpenShift infrastructure, satisfying BSI government security requirements without exception.</div>
</div>
<div class="result-item">
<div class="result-metric">6 weeks from evaluation to decision</div>
<div class="result-desc">Dataport moved from first discovery call to a confirmed decision to proceed with Kestra in about six weeks.</div>
</div>
<div class="result-item">
<div class="result-metric">Production-grade Kubernetes deployment on OpenShift</div>
<div class="result-desc">What started as Kubernetes/OKD testing during the proof of concept became a standardized OpenShift deployment, with early workflows already in use by other teams ahead of a broader rollout.</div>
</div>
</div>

## Kestra at Dataport

Kestra runs self-hosted on Dataport's OpenShift cluster, on x86 infrastructure the organization already operates. Tasks execute through Kestra's Kubernetes task runner rather than Docker-in-Docker, Postgres serves as the workflow backend, and an S3-compatible internal object store handles internal storage.

The core workflow pattern sits behind Dataport's existing API management layer. An incoming request creates a tracking ID, triggers the relevant Kestra flow, and Kestra executes a subflow, for example, provisioning a virtual machine, while publishing status updates to Kafka at each stage so downstream systems stay informed without needing to poll Kestra directly. That pattern was validated first for VM provisioning, with the architecture designed to extend to other infrastructure and access-management workflows as the platform grows.

Enterprise identity runs through an OIDC-based identity provider, and secrets are managed through a centralized secrets manager, scoped to Kestra namespaces. Deployment is defined as code and managed through the team's CI/CD pipeline, keeping the control plane's own configuration under the same governance model as the workflows it orchestrates.

<div class="stack-row">
<span class="stack-pill">OpenShift</span>
<span class="stack-pill">Kubernetes</span>
<span class="stack-pill">Kafka</span>
<span class="stack-pill">PostgreSQL</span>
<span class="stack-pill">S3</span>
<span class="stack-pill">OIDC</span>
</div>
