---
title: Scaling Secure Infrastructure at Crédit Agricole with Kestra
description: This is the story of how CAGIP, the IT production arm of Crédit
  Agricole, transformed infrastructure operations and scaled data workflows
  across more than 100 clusters using Kestra.
metaTitle: Scaling Secure Infrastructure at Crédit Agricole with Kestra
metaDescription: This is the story of how CAGIP, the IT production arm of Crédit
  Agricole, transformed infrastructure operations and scaled data workflows
  across more than 100 clusters using Kestra.
heroImage: ./hero.png
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.terraform.cli.TerraformCLI
  - io.kestra.plugin.jdbc.postgresql.CopyOut
  - io.kestra.plugin.git.SyncFlows
  - io.kestra.plugin.scripts.python.Script
kpi1: |+
  ##### 7
  Data Teams Unified 


kpi2: |-
  ##### 100+
  Managed Clusters
kpi3: |-
  ##### Security-First
  Orchestration
quote: Kestra allowed us to move from fragmented automation to a unified control
  plane—secure, scalable, and manageable by all our teams.
quotePerson: Julien Legrand
quotePersonTitle: "PO Data "
industry: Banking
headquarter: Paris, France
solution: CAGIP manage the whole infrastructure ecosystem for the Credit Agricole Group
companyName: Crédit Agricole
---

CAGIP is the central IT production provider for Crédit Agricole, one of Europe’s largest banking groups. Within the data team, the challenge was clear: keep up with the rising demand from internal entities while maintaining the group’s high standards for security, availability, and compliance.

Legacy automation, largely built on Jenkins and Ansible, had served well for years. But scale was becoming a problem. The team was now managing over 50 MongoDB clusters, alongside critical services in MLOps, streaming, and analytics. Infrastructure tasks were becoming slower to coordinate, harder to monitor, and more painful to secure.

> “We had to scale horizontally, but our tools weren’t designed for that kind of elasticity. They were showing their limits.”
> 

Kestra entered as an experiment. A lightweight test deployment was enough to convince the team. YAML-based flows made orchestration legible. The UI was intuitive. And Kestra’s API-first architecture meant they could enforce strict CI/CD pipelines and secret management practices from day one.

### Building a Shared Platform for Seven Data Teams

Rather than roll it out all at once, the team chose to build Kestra the right way: defining access rules, building reusable subflows, and integrating it tightly with HashiCorp Vault, Git, and their internal alerting stack.

Flows are first designed and tested in isolated namespaces. Once validated, they’re committed to Git, and synced automatically to production. Vault provides secret rotation at scale. Alerting hooks provide immediate feedback when something breaks.

> “It took us time to set things up properly. But we wanted to be confident that what we put in place was scalable and secure enough to be used across all seven data teams.”
> 

Now, Kestra runs in production as a shared orchestration backbone—self-hosted on their private cloud infrastructure, managing hundreds of parallel workflows across clusters, services, and tenants.

### Infrastructure Automation Without the Scripting Overhead

What used to be scripted in Ansible and chained manually with Jenkins has now been translated into modular Kestra flows. Instead of rebuilding logic each time, teams use templates to deploy, update, test, and monitor infrastructure at scale.

Backups, configuration tests, billing jobs, security checks—all now run as declarative, API-triggered pipelines. When something breaks, alerting flows kick in. When a new cluster is added, its workflows are instantly integrated.

> “We’re not just automating tasks anymore. We’re building a platform that any of our teams can use to operate independently and with confidence.”
> 

One of the early use cases being replaced: Kubernetes cron jobs calculating billing. Those are now replaced with Kestra flows orchestrating Python scripts, HTTP calls, and MongoDB queries—cleaner, traceable, and easier to evolve.

### What’s Next: Expanding Coverage, Increasing Resilience

CAGIP’s adoption of Kestra is far from finished. The team is now rolling it out more widely across data and infra pipelines. Certificate management, event-driven deployments, integration testing—these are the next steps.

And because everything runs in Kestra, it’s observable by default. The team can track executions across services, identify bottlenecks, and ensure policies are enforced—without needing to stitch together dashboards manually.

> “We used to spend too much time on orchestration itself. Now we focus on delivering features and keeping the platform stable. That’s where we create value.”
> 

### A Foundation for Reliable Infrastructure at Scale

For an organization as large and complex as Crédit Agricole, orchestration is about trust, auditability, and long-term maintainability. With Kestra, CAGIP now operates with more visibility, more structure, and less manual effort.

> “Kestra gave us a foundation to scale infrastructure and data operations without compromise. It’s become part of how we deliver critical services to the group.”
>
