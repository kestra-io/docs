---
title: Sopht Scales Its Green ITOps Platform with Kestra
description: This is the story of Sopht’s partnership with DataFlooder to
  redesign and scale their data architecture with Kestra, enabling reliable
  orchestration and customer-level automation for their Green ITOps platform.
metaTitle: Sopht Scales Its Green ITOps Platform with Kestra
metaDescription: This is the story of Sopht’s partnership with DataFlooder to
  redesign and scale their data architecture with Kestra, enabling reliable
  orchestration and customer-level automation for their Green ITOps platform.
heroImage: ./hero.png
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.terraform.cli.TerraformCLI
  - io.kestra.plugin.docker.Build
  - io.kestra.plugin.kubernetes.PodCreate
  - io.kestra.plugin.jdbc.duckdb.Query
  - io.kestra.plugin.scripts.python.Script
kpi1: |-
  ##### Plug & Play Terraform
  Managed Flow Activation
kpi2: |-
  ##### 99.5%
  Job Success Rate
kpi3: |-
  ##### Multi-Tenant
  Customer Isolated Orchestration
quote: Kestra’s declarative model and Terraform integration gave us exactly what
  we needed to build customer-specific pipelines, automate deployment, and
  monitor everything reliably.
quotePerson: Lirav Duvshani
quotePersonTitle: CEO/Data Architect @DataFlooder
industry: Green IT
headquarter: Lyon, France
solution: Sopht is a French startup focused on Green ITOps. Their platform helps
  organizations automate decarbonization strategies and track their
  environmental and financial performance.
companyName: Sopht
---

This is the story of how **[Sopht](https://sopht.com/)**, a fast-growing Green ITOps startup, partnered with **[DataFlooder](https://www.dataflooder.com/)** to build a scalable, customer-isolated data platform — powered by Kestra.

They needed orchestration that wasn’t just reliable, but flexible, event-driven, and ready to scale with their customers. Within six months, their production workflows grew from **1,240 to over 6,200 daily jobs**, while maintaining a **99.5% success rate**. All automated. All observable.

> “We needed orchestration built for scale and flexibility — and we found it in Kestra. It fits naturally into Sopht stack, and lets them go fast without breaking things.”
> 
> — Lirav Duvshani, CEO @DataFlooder

## From cron to control

Sopht’s initial architecture used cron jobs — simple to set up, but unfit for scale. As they onboarded more customers, they needed to guarantee execution reliability, isolate workflows per tenant, and automate deployment through Terraform.

That meant replacing cron with something far more powerful. They needed infrastructure-aware orchestration. That’s where Kestra came in.

Kestra offered a declarative, event-based engine that could:

- Run containerized jobs in Kubernetes
- Dynamically enable or disable tasks per customer
- Trigger flows on events instead of static schedules
- Provide real-time execution observability
- Fit into a Terraform-driven infrastructure

> “Kestra was the only tool that combined event-based orchestration, multi-tenant isolation, and Terraform-native flow deployment. It gave us the foundation to build a platform, not just pipelines.”


## Built and Delivered with DataFlooder

Sopht partnered with **DataFlooder**, a specialist in modern data platforms, to design and implement the full Kestra integration. The orchestration was split into two layers:

- A **global DAG** with all available sources and transformations
- **Customer-specific DAGs**, activated on-demand based on their data environment

Everything is managed through Terraform using a custom `kestra_flow` module. Each tenant has its own namespace, and only the relevant data sources are activated. The result: true multi-tenancy, with isolated executions and reproducible deployments.

> “Terraform + Kestra is our golden combo. We onboard a new customer with a few lines of config, and their entire orchestration stack is up — isolated, traceable, and observable.”

## Operational Impact

Kestra changed how the Sopht team worked. What used to take manual triggers, log parsing, and duplicated YAML was now streamlined, observable, and automated.

Every morning, the team could review the full state of customer executions in a single UI. Failures were automatically handled, and performance issues became easier to spot and fix.

New pipelines were added declaratively. Customers onboarded faster. And engineering time was focused where it mattered.

## Scaling with confidence

Since the go-live in October 2024, Sopht’s orchestration layer has grown with the platform:

- From **1,240** to **6,200**+ jobs per day
- Execution success rate improved from **98.12%** to **99.54%**
- All powered by Kestra, and deployed through Terraform

> “We don’t spend time managing workflows anymore. We just write them, deploy them, and trust that Kestra will do the rest.”

## What’s Next

With Kestra at the core of their orchestration layer, Sopht is now focused on optimizing performance, extending automation coverage, and refining its observability stack. Future plans include more granular monitoring, cross-service correlation with OpenTelemetry, and dynamic DAG updates based on real-time customer configurations.

With Kestra as the orchestration backbone and DataFlooder as the implementation partner, they’ve built a system that is fast, resilient, and ready for whatever comes next.

Thanks to **[DataFlooder](https://www.dataflooder.com/)** for their technical guidance in this integration and to  **[Sopht](https://sopht.com/)** for their trust in Kestra.

