---
title: How Acxiom Built a Multi-Tenant Data Platform on Kestra
rank: 2
description: Acxiom embedded Kestra as the orchestration layer across its Axiom Cloud platform, using Kestra's multi-tenancy model to run each enterprise client's data pipelines in a fully isolated environment at scale.
metaTitle: Acxiom Builds a Multi-Tenant Data Platform on Kestra
metaDescription: How Acxiom uses Kestra's multi-tenancy and hub-and-spoke architecture to power Axiom Cloud, with isolated pipelines for 50+ enterprise clients on AWS and Databricks.
heroImage: ./hero.png
featured: true
featuredImage: ./featured.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
logoIcon: ./icon.svg
tasks:
  - io.kestra.plugin.databricks.job.CreateJob
  - io.kestra.plugin.kubernetes.PodCreate
  - io.kestra.plugin.terraform.cli.TerraformCLI
  - io.kestra.plugin.scripts.python.Script
kpi1: |
  ##### Declarative
  dynamic & metadata-driven workflows
kpi2: |-
  ##### 120+
  engineers empowered
kpi3: |-
  ##### 50+
  customers isolated in multi-tenant environments
quote: Kestra was the only tool that combined true multi-tenant isolation, metadata-driven orchestration, and easy integration with our existing AWS and Databricks environments. It provided the foundation we needed to scale confidently.
quotePerson: Director of Engineering
quotePersonTitle: ""
industry: Customer Intelligence
industry2: Marketing
headquarter: "Conway, Arkansas, USA"
region: North America
companySize: "5,000+"
solution: Acxiom is a data technology company that provides customer data management, data integration, and marketing intelligence to global enterprise brands. Through its Axiom Cloud platform, Acxiom helps clients ingest, validate, cleanse, and enrich data at scale, with each client running as an isolated tenant in a dedicated pipeline environment.
tagline: Global leader in customer intelligence and AI-driven marketing
companyName: Acxiom
useCase: Running 50+ enterprise clients in fully isolated multi-tenant pipelines on the Axiom Cloud platform
useCaseShort: Data Orchestration
deployment: Self-hosted (Kubernetes)
intro: Most orchestration deployments start as internal tools. Acxiom built something different. The company embedded Kestra as the orchestration layer at the base of its Axiom Cloud product suite, where every enterprise client runs as an isolated tenant with dedicated workers, secrets, and storage. What began as a single data ingestion product has expanded into a multi-product platform, with Kestra providing the shared foundation beneath all of it, serving 50+ enterprise clients from a single, consistent deployment model.
cta: "What would your data operations look like if every enterprise client ran on its own isolated pipeline environment?"
---

## The problem

<div class="problem-list">
<div class="problem-item">
<span class="problem-number">01</span>
<div class="problem-title">In-house orchestration couldn't meet enterprise-grade isolation requirements</div>
<div class="problem-desc">Acxiom's enterprise clients handle sensitive customer data and require strict separation at every layer: storage, compute, secrets, and access controls. The internal orchestration system the team had built couldn't support true per-client isolation without substantial custom engineering for each new customer. As the client base grew, that approach became untenable.</div>
</div>
<div class="problem-item">
<span class="problem-number">02</span>
<div class="problem-title">Existing Scala and Python pipelines needed to run without being rewritten</div>
<div class="problem-desc">Acxiom's data engineers had built pipelines in Scala and Python over years. Any new orchestration layer would need to wrap that existing code, not replace it. Tools that required migrating to a proprietary runtime or rewriting workflows in a new framework were disqualified before evaluation began. The constraint was non-negotiable: existing code runs as-is, or the tool doesn't make the cut.</div>
</div>
<div class="problem-item">
<span class="problem-number">03</span>
<div class="problem-title">Metadata-driven workflows at scale had no clean implementation path</div>
<div class="problem-desc">Axiom Cloud is a multi-product platform. Different clients receive different data products, each with different schemas, schedules, and business rules. Hardcoding logic per client was the only path available with the existing tooling, and it didn't scale. Acxiom needed parameterized, metadata-driven workflows that could adapt to each client's configuration without rebuilding pipelines from scratch.</div>
</div>
</div>

<div class="problem-close">
<div class="problem-close-prefix">// The requirement</div>
An orchestration layer that could serve as the <strong class="problem-close-key">foundation for a commercial multi-tenant SaaS platform</strong>, not just an internal tool.
</div>

## What Kestra fixed

<div class="fix-list">
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Per-client tenant isolation without rebuilding the platform for each customer</div>
<div class="fix-desc">Kestra's multi-tenancy model gave Acxiom a way to run each enterprise client in a dedicated environment with separate AWS VPCs, S3 storage buckets, EKS worker pools, and secrets management, all provisioned through a consistent Terraform-based process rather than custom engineering. Onboarding a new client means running the same deployment playbook, not writing new infrastructure code.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">YAML-first orchestration that wraps existing code without rewriting it</div>
<div class="fix-desc">Kestra's declarative workflow definitions let Acxiom's engineers express pipeline logic in YAML while running the underlying Scala and Python code unchanged. <em class="inline-quote">"We no longer manage workflows manually, we define them clearly in YAML, deploy, and trust Kestra to run them smoothly. This dramatically improved our productivity and scalability."</em> The orchestration layer sits on top of the existing code, not inside it.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Metadata-driven parameterization across the full client base</div>
<div class="fix-desc">Rather than maintaining separate pipeline definitions per client, Acxiom uses Kestra's dynamic expression language to parameterize workflows from a central metadata store. A single flow template adapts to each client's schema, schedule, and business rules at runtime, without branching into per-client codebases. <em class="inline-quote">"Kestra's YAML-based approach is intuitive for our engineers and powerful enough to dynamically handle metadata-driven automation at scale. It changed the way we operate."</em></div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Terraform-managed deployment across every environment</div>
<div class="fix-desc">Kestra's Terraform provider lets Acxiom declare, version, and deploy flows across all client environments programmatically. A change to a shared workflow propagates to every tenant through the same CI/CD pipeline, with infrastructure and orchestration managed as a single, consistent stack.</div>
</div>
</div>
</div>

## Outcomes

<div class="results-list">
<div class="result-item">
<div class="result-metric">120+ engineers self-serving</div>
<div class="result-desc">Engineers across Acxiom's data teams define and deploy workflows without waiting on a central platform team. The declarative YAML model lowered the floor for who can contribute, and Kestra's RBAC keeps each team scoped to their own namespace.</div>
</div>
<div class="result-item">
<div class="result-metric">50+ enterprise clients, fully isolated</div>
<div class="result-desc">Each of Acxiom's enterprise clients runs in its own provisioned environment, with dedicated storage, secrets, and compute. Onboarding is handled through the same Terraform deployment process every time, with no bespoke infrastructure work per customer.</div>
</div>
<div class="result-item">
<div class="result-metric">Kestra as the foundation of Axiom Cloud</div>
<div class="result-desc">What started as orchestration for one data ingestion product now spans the full Axiom Cloud platform. Kestra handles pipeline orchestration across multiple products, with the same multi-tenant model scaling to support new products as they launch. <em class="inline-quote">"Kestra gives us a scalable foundation for innovation. We're now positioned to handle today's complexity and future advancements in AI-driven analytics and real-time orchestration."</em></div>
</div>
</div>

## Kestra at Acxiom

Acxiom runs a hub-and-spoke architecture on AWS. A central Kestra instance serves as the control plane, orchestrating workflows that execute across per-client spoke environments. Each spoke is a dedicated EKS cluster with its own worker pool, S3 storage, and secrets configuration, isolated at the network and IAM level from every other client.

Databricks handles compute-intensive data processing jobs. Kestra orchestrates job creation and sequencing via the Databricks plugin, while managing the surrounding pipeline logic: parameter injection from metadata, dependency resolution, error handling, and retry policies. Custom plugins extend the stack for client-specific integrations, including a purpose-built AWS Glue connector for specialized transformation workloads.

The Terraform provider governs the full deployment lifecycle. Flow definitions, namespace configurations, and environment variables are all declared in code, versioned in Git, and deployed atomically across the environment fleet. Adding a new client tenant or updating a shared workflow follows the same path: a pull request, a review, and a Terraform apply.

<div class="stack-row">
<span class="stack-pill">Kestra Enterprise</span>
<span class="stack-pill">Kubernetes (EKS)</span>
<span class="stack-pill">AWS</span>
<span class="stack-pill">S3</span>
<span class="stack-pill">Databricks</span>
<span class="stack-pill">AWS Glue</span>
<span class="stack-pill">Terraform</span>
<span class="stack-pill">Python</span>
<span class="stack-pill">Scala</span>
</div>
