---
title: Amdocs Delivers Integration Environments as a Service with Kestra
rank: 1
description: How Amdocs' Foundation team uses Kestra to orchestrate end-to-end environment provisioning, deployment, and automated validation at scale.
metaTitle: Amdocs Delivers Integration Environments as a Service with Kestra
metaDescription: How Amdocs' Foundation team uses Kestra to orchestrate end-to-end environment provisioning, deployment, and automated validation at scale.
heroImage: ./hero.png
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.scripts.shell.Commands
  - io.kestra.plugin.core.flow.Subflow
  - io.kestra.plugin.core.http.Request
  - io.kestra.plugin.core.flow.Parallel
kpi1: |-
  ##### Days → Hours
  Environment delivery time
kpi2: |-
  ##### Validated on Delivery
  Test-ready environments out of the box
kpi3: |-
  ##### 2 Months
  From evaluation to production
quote: From a technical point of view, Kestra sits at the first place.
quotePerson: Alex Lernerman
quotePersonTitle: DevOps Engineer, Amdocs
industry: Telecom & Technology Services
headquarter: Chesterfield, Missouri, United States
region: North America
solution: Infrastructure Orchestration & Environment-as-a-Service
companyName: Amdocs
cta: "What would change if your developers could request a fully provisioned, deployed, and validated environment with one click — instead of spending days assembling it by hand?"
---

## The context: environments are the product

Amdocs' Foundation delivery team needed an orchestration backbone for a platform initiative: **deliver fully provisioned, deployed, and validated integration environments as a service** to developers and testers.

They were building an internal capability spanning **VM provisioning, application installation and updates, integrations, and automated testing** — with a hard calendar constraint: they needed an orchestrator that could go into production in two months.

Their users don't want to spend days assembling integration environments by hand, chasing dependencies, and figuring out which steps failed. They want something simpler: click a button, get an environment that's already built, deployed, updated, and validated — so they can focus on their actual work.

> "The users should get environments that are already created, deployed, updated, and all automation tests already verified, so they can concentrate on tests or small changes."

But the reality is messy in the way infrastructure always is:

- Sometimes an environment is one VM. Sometimes it's several.
- Sometimes the workflow is straightforward. Sometimes it needs conditional paths.
- Sometimes the process must pause for a decision or manual intervention, then resume safely.

And the team knew this wasn't a one-off automation effort. It needed to become a platform.

> "Our requirements will grow. It should be a system open for a lot of functionalities, starting with deployment and environment creation."

## The pain: when "automation" becomes a tangle

Amdocs already had orchestration needs across multiple products and scenarios. What started as scripts, pipelines, or point tools had become hard to reason about:

- Logic split across systems.
- Scale changes broke assumptions.
- Operational control became fragile.
- The effort shifted from "automating" to "keeping automation alive."

They described the kind of orchestration they needed as **end-to-end** — not "run a job once."

They needed to orchestrate:

- **Provisioning and cloning environments** — create new VMs (sometimes more than one), wire systems together, prepare baseline dependencies.
- **Deploy, install, and update application components** — install Amdocs applications, integrate with internal systems, apply updates driven by parameters.
- **Release an environment to users with confidence** — run automated tests so the environment is handed over in a validated state.

They also described recurring heavy processes:

- **Full regression**, including full environment recreation across all products
- **Daily smaller tests** for continuous validation

That combination — variable topology, end-to-end depth, recurring heavy workloads — puts pressure on any orchestration approach that isn't designed to behave like infrastructure.

## The decision point: choosing an orchestrator that can keep pace

When the Amdocs team spoke with Kestra, they had already done the work that matters most: multiple orchestration solutions had been put on the table and evaluated side by side.

The key differentiator was clear: **can it handle infrastructure orchestration at their pace**, as a foundation capability that would grow over time?

They summarized their conclusion plainly:

> "From a technical point of view, Kestra sits at the first place."

## Why Kestra fit the way they work

What Amdocs needed was infrastructure delivery: a chain of provisioning, deployment, installation, integration, and validation. Kestra aligned with three requirements that surfaced repeatedly in their evaluation:

### A single control plane for many products and scenarios

They needed one orchestration layer that could be reused broadly. Their platform serves multiple products and multiple workflow types — a single tool that governs all of them was non-negotiable.

### A dynamic execution model driven by parameters

The same "create environment" concept might expand to one VM or many VMs depending on the request. Flows that **scale horizontally based on input parameters**, adjusting execution trees dynamically to match workload needs.

That prevents orchestration from becoming brittle: the workflow model stays stable while the execution adapts.

### A platform that can evolve without re-platforming

The team framed this use case as a "foundation." Today it's environment creation. Tomorrow it's broader processes, more complexity, more end-to-end control. Kestra's architecture around **tasks and plugins** makes it natural to extend capabilities over time without turning the orchestrator into a monolith.

## What they run with Kestra: a central flow manager across products

Amdocs uses Kestra as a central flow manager across multiple products within their infrastructure. In practice, their workflows orchestrate a full delivery chain.

### Multi-product flow management

Kestra serves as the orchestration engine for running multiple workflows across different scenarios and products. A single platform governs all of them.

### Dynamic flows that scale with the workload

The flows automatically adjust the number of execution trees based on input parameters. When creating or cloning environments, the flow structure adapts to handle anywhere from a single VM to complex multi-VM environments — without duplicating logic or maintaining separate workflow definitions.

### Application lifecycle management

On top of environment provisioning, they orchestrate application installation and updates. These operations are driven by input parameters, allowing for flexible deployment configurations across products.

### Automated validation before hand-off

Automation tests and regression cycles run before any environment is released: weekly heavy runs and daily smaller runs. Users receive something stable. The outcome is a service boundary: a finished environment that the end user can trust.

## The human outcome: less friction, more confidence

Before Kestra, delivering an integration environment was a multi-day, multi-team effort. Engineers assembled infrastructure manually, chased failed steps through scattered logs, and handed off environments without certainty that everything worked.

After Kestra, the team treats environment delivery as a governed, repeatable process — one that scales with requests, not collapses under them. Environments arrive provisioned, deployed, and validated. The time developers and testers spend waiting has dropped from days to hours. The engineering hours consumed per environment have shrunk dramatically.

And the team shipped it to production in the two months they had — because Kestra didn't require them to slow down their infrastructure roadmap to adopt an orchestrator.

> A big thank you to [Alex Lernerman](https://www.linkedin.com/in/alexler/) from the Amdocs Foundation Delivery Team for sharing his story with us.

**What would change if your developers could request a fully provisioned, deployed, and validated environment with one click — instead of spending days assembling it by hand?**

→ [Discover how Kestra powers infrastructure orchestration in production.](https://kestra.io/infra-automation)
