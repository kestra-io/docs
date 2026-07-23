---
title: "Quadis Drives Innovation: Transforming Car Retail Operations with Kestra"
rank: 3
description: This is the story of how Quadis consolidated financial reporting and customer communication onto Kestra, replacing a legacy in-house and Pentaho ETL stack.
metaTitle: "Quadis Drives Innovation: Transforming Car Retail Operations with Kestra"
metaDescription: How Spain's largest car retailer consolidated financial reporting and customer communication onto Kestra, replacing a legacy in-house and Pentaho ETL stack.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
logoIcon: ./icon.svg
tasks:
  - io.kestra.plugin.azure.cli.AzCLI
  - io.kestra.plugin.docker.Build
  - io.kestra.plugin.scripts.python.Commands
kpi1: |
  ZERO
  downtime
kpi2: |
  50%
  cost reduction in processing
kpi3: |
  +250
  datasets orchestrated
quote: We're convinced to have chosen the right tool. The support and communication are great, it's easy to adapt to any tool and for any people to understand
quotePerson: Rubén Boniz Martinez
quotePersonTitle: Software Architect
industry: Automotive
headquarter: Madrid, Spain
region: Europe
companySize: "501–5,000"
solution: Spain's largest car retailer, providing a diverse range of vehicles from prestigious manufacturers.
tagline: Spain's largest car retailer
companyName: Quadis
intro: Quadis, Spain's largest car retailer, relies on orchestration to keep everything from financial reporting to car delivery alerts running across its dealership network. When its in-house system paired with Pentaho ETL tools couldn't keep pace with the company's growth, causing disruptions that rippled across every department, Quadis consolidated its financial-reporting and customer-communication workflows onto Kestra.
deployment: Self-hosted · Docker · AWS EC2
useCase: Automating daily financial reports and customer communications for Spain's largest car retailer after consolidating off Pentaho ETL tools
useCaseShort: Business Automation
cta: "What would change if your automotive retail operations were fully automated, from inventory to customer experience, orchestrated end-to-end?"
---

## The problem

As Quadis expanded its dealership network, the complexity of its operations grew with it. Financial reporting, car delivery alerts, and customer communication all ran through orchestration, and the legacy stack behind it was struggling to keep pace.

<div class="problem-list">
<div class="problem-item">
<span class="problem-number">01</span>
<div class="problem-title">Downtime on the legacy system disrupted every department</div>
<div class="problem-desc">When Quadis's in-house orchestration system went down, the disruption spread from sales to customer service, since every department depended on it running smoothly. The setup, an in-house solution paired with Pentaho ETL tools, had no infrastructure monitoring to catch problems before they spread.</div>
</div>
<div class="problem-item">
<span class="problem-number">02</span>
<div class="problem-title">A GUI that made scaling and debugging painful</div>
<div class="problem-desc">Pentaho's graphical interface wasn't built for the scale Quadis needed. Testing pipelines was complex, and the legacy stack offered no lineage or observability that could span multiple teams.</div>
</div>
<div class="problem-item">
<span class="problem-number">03</span>
<div class="problem-title">Growing complexity outpaced what the legacy stack could handle</div>
<div class="problem-desc">As Quadis's dealership network grew, so did its reliance on orchestration, from financial reporting to car delivery alerts. The in-house and Pentaho combination increasingly struggled to keep up, and the engineering team needed a platform that could scale with the business instead of against it.</div>
</div>
</div>

<div class="problem-close">
<div class="problem-close-prefix">// The requirement</div>
Quadis needed to <strong class="problem-close-key">consolidate its financial-reporting and customer-communication workflows onto one scalable, observable orchestration platform</strong>, without asking non-technical teams to relearn how they worked.
</div>

## What Kestra fixed

<div class="fix-list">
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Automated financial reporting straight from the ERP</div>
<div class="fix-desc">Kestra pulls transaction data directly from Quadis's ERP using API calls and FTP tasks, then generates financial reports automatically every day at 9:00 AM. Comprehensive logging and execution tracking let the finance team troubleshoot issues quickly instead of chasing them by hand.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Real-time customer notifications through Salesforce</div>
<div class="fix-desc">When a customer's parts order is prepared and shipped, Kestra triggers an automatic Salesforce notification, closing a communication gap that used to leave customers waiting. <em class="inline-quote">"The platform is fluid on the web, and it's easy for non-technical people to understand."</em></div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Everything as code, without giving up the UI</div>
<div class="fix-desc">Kestra let Quadis apply standard software practices, code versioning and decoupling orchestration from business logic, while keeping day-to-day operations accessible through the UI for less technical users.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">A Git-based workflow wired into Azure DevOps</div>
<div class="fix-desc">Developers push flows from Kestra straight to Git, and Azure DevOps CI/CD pipelines handle deployment from there. <em class="inline-quote">"It's easy to adapt to any tool thanks to the plugins."</em></div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Docker containers for custom transformation logic</div>
<div class="fix-desc">Kestra's Docker integration isolates resources and dependencies for Quadis's data processes, supporting multiple languages, including C# and Python, for data transformation tasks.</div>
</div>
</div>
</div>

## Outcomes

<div class="results-list">
<div class="result-item">
<div class="result-metric">Zero downtime</div>
<div class="result-desc">Kestra's scalable, reliable architecture removed the single point of failure that used to disrupt every department when the legacy system went down.</div>
</div>
<div class="result-item">
<div class="result-metric">50% cost reduction</div>
<div class="result-desc">Automating financial-report processing cut the cost of running it in half compared to the legacy in-house and Pentaho ETL setup.</div>
</div>
<div class="result-item">
<div class="result-metric">+250 datasets orchestrated</div>
<div class="result-desc">Kestra now orchestrates more than 250 datasets across financial reporting and customer communication, up from a legacy stack that struggled to keep pace with Quadis's growth.</div>
</div>
<div class="result-item">
<div class="result-metric">5+ developers onboarded in under 3 months</div>
<div class="result-desc">Quadis onboarded more than five developers onto Kestra in under three months, running separate development and production instances on AWS.</div>
</div>
</div>

## Kestra at Quadis

Quadis runs Kestra self-hosted on AWS, deployed in Docker containers on EC2 instances backed by an Amazon RDS database. Development and production run as separate instances, and as usage has grown, Quadis has added a dedicated non-production environment to test upgrades independently of day-to-day development, without touching the production flows the rest of the business depends on.

Custom transformation logic runs in Docker containers, giving Quadis's engineers the flexibility to write tasks in C# and Python alongside Kestra's built-in plugins. Flows are version-controlled in Git and deployed through Azure DevOps CI/CD pipelines, so changes move from a developer's branch to production the same way any other code change would.

The financial-reporting flows call Quadis's ERP over API and FTP tasks, while a Salesforce integration handles customer-facing notifications when parts orders ship. As Quadis expands past Spain and prepares to onboard more than 30 additional users, including non-technical staff, it's building on this foundation to support a new data lake architecture for broader analytics.

<div class="stack-row">
<span class="stack-pill">Docker</span>
<span class="stack-pill">AWS EC2</span>
<span class="stack-pill">Amazon RDS</span>
<span class="stack-pill">Azure DevOps</span>
<span class="stack-pill">Git</span>
<span class="stack-pill">Salesforce</span>
<span class="stack-pill">Azure CLI</span>
<span class="stack-pill">Python</span>
<span class="stack-pill">C#</span>
</div>
