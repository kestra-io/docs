---
title: "ERP Transformation: Smarter, Faster, Fully Automated"
rank: 1
description: How Fila, a global sportswear brand, consolidated ERP, PLM, and e-commerce data onto Kestra, letting one engineer run a self-hosted integration layer processing 2 million executions a month.
metaTitle: "Fila & Kestra: ERP Transformation, Smarter, Faster, Fully Automated"
metaDescription: Fila consolidated ERP, PLM, and e-commerce integrations onto Kestra, letting one engineer run a self-hosted platform at 2 million executions a month.
heroImage: ./hero.png
featured: true
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.docker.Build
  - io.kestra.plugin.jdbc.sqlserver.Query
  - io.kestra.plugin.aws.sqs.Trigger
  - io.kestra.plugin.notifications.teams.TeamsIncomingWebhook
  - io.kestra.plugin.scripts.node.Script
  - io.kestra.plugin.scripts.powershell.Script
kpi1: |-
  ##### 2 Million
  monthly executions
kpi2: |-
  ##### 2000+
  workflows
kpi3: |-
  ##### 25+
  engineers working with Kestra
quote: Kestra has changed how we handle data orchestration. Instead of spending
  days fixing issues, we now have full visibility and control. As we scale,
  having a system that grows with us is invaluable
quotePerson: John Kim
quotePersonTitle: IT Lead
industry: Retail
industry2: Manufacturing
headquarter: Seoul, South Korea
region: Asia Pacific
companySize: "5,000+"
solution: Fila has evolved into a global sportswear brand, known for its high-quality and stylish clothing and accessories.
tagline: Global sportswear brand with a century-long legacy
companyName: Fila
useCase: Orchestrating ERP, PLM, and e-commerce integrations across a global IT transformation, managed by a single engineer on self-hosted infrastructure
useCaseShort: Business Automation
deployment: Self-hosted (Docker)
intro: "Fila, the century-old sportswear brand now headquartered in Seoul, is in the middle of a multi-year overhaul of its ERP and PLM systems, a project that has since grown to include e-commerce and infrastructure automation. One IT lead built and runs the entire Kestra integration layer on self-managed Docker infrastructure, syncing dozens of database tables in near real time."
cta: "What would change if your ERP, PLM, and e-commerce systems all spoke the same orchestration language, no matter who's on call?"
---

## The problem

<div class="problem-list">
<div class="problem-item">
<span class="problem-number">01</span>
<div class="problem-title">Dozens of ERP and PLM tables needed real-time sync, with no way to trace a failure</div>
<div class="problem-desc">As Fila rebuilt its ERP and PLM systems from the ground up, 40 to 50 database tables needed continuous synchronization between the two, while both systems were still under construction. The prior integration approach, an in-house EAI tool, kept no execution history. When a sync broke partway through, there was no way to see which row failed or resume from that point without redoing the batch.</div>
</div>
<div class="problem-item">
<span class="problem-number">02</span>
<div class="problem-title">A single production instance left little room to test changes safely</div>
<div class="problem-desc">Fila initially ran its Kestra environment as a single production instance, a natural starting point for a project that grew organically alongside a fast-moving ERP rollout. As integrations multiplied, the team worked with Kestra to introduce dedicated non-production environments so upgrades and new flows could be validated before reaching production.</div>
</div>
<div class="problem-item">
<span class="problem-number">03</span>
<div class="problem-title">One engineer built and ran the entire integration layer alone</div>
<div class="problem-desc">For most of the project, Fila's IT lead was the only person at the company who understood how the integration flows worked, spanning ERP and PLM sync and, later, e-commerce. A language barrier between the IT team and its contracted development partner made it hard to spread that knowledge further, leaving a system now central to Fila's supply chain resting on one person.</div>
</div>
</div>

<div class="problem-close">
<div class="problem-close-prefix">// The requirement</div>
An orchestration layer that could run on infrastructure Fila already controlled, connect databases and e-commerce systems without custom glue code, and let <strong class="problem-close-key">one engineer build, debug, and eventually hand off an entire integration layer</strong>.
</div>

## What Kestra fixed

<div class="fix-list">
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">A broader plugin ecosystem and a clearer scaling story beat Airflow and NiFi</div>
<div class="fix-desc">Fila evaluated Apache Airflow and Apache NiFi before choosing Kestra. <em class="inline-quote">"We looked at Airflow and NiFi, but Kestra's architecture made the most sense for us in terms of scalability. The wide range of plugins and the ability to integrate with our systems was a key factor in our decision."</em> — John Kim, IT Lead, Fila</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Event-driven workflows handle multi-step integrations with automatic retries</div>
<div class="fix-desc">Rather than a simple database-to-database copy, Fila's integrations chain together multiple systems in a single flow. <em class="inline-quote">"One of our workflows isn't just about moving data from one database to another. It involves reading from a source database, downloading and uploading files across servers, calling multiple APIs, and inserting data into the final destination. Kestra's event-driven model ensures each step happens correctly and automatically retries when issues occur. This is critical for us because so many external systems are involved."</em> — John Kim, IT Lead, Fila</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">An API-first design let one engineer build automation on top of Kestra</div>
<div class="fix-desc">Rather than hand-writing each database sync, Fila's IT lead built a middleware service that reads database schemas and constructs workflow definitions automatically. <em class="inline-quote">"Kestra doesn't generate workflows automatically, but its API-first approach allowed me to build automation on top of it. We now have a system that dynamically creates workflows for standard database integrations, making deployment across different regions much faster."</em> — John Kim</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Row-level execution history turns ERP syncs into replayable transactions</div>
<div class="fix-desc">Every database row moving between PLM and ERP is tracked as its own execution. <em class="inline-quote">"In our ERP, even a single corrupted row can trigger a chain of failures down the line. With Kestra, I can trace every execution, see exactly where things went wrong, and rerun the workflow after fixing the issue. This level of control is something I didn't have before."</em> — John Kim</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Automated monitoring catches and restarts jobs before they need manual intervention</div>
<div class="fix-desc">Failed tasks trigger a Microsoft Teams alert with a direct link to the execution, and workflows that run long due to database locks are automatically terminated and retried. <em class="inline-quote">"If a workflow gets stuck, I don't have to manually intervene. Our system detects long-running jobs, kills them, and retries. This kind of automation significantly reduces downtime and improves operational efficiency."</em> — John Kim</div>
</div>
</div>
</div>

## Outcomes

<div class="results-list">
<div class="result-item">
<div class="result-metric">2 million monthly executions</div>
<div class="result-desc">Fila's Kestra environment processes roughly 2 million workflow executions a month across ERP, PLM, and e-commerce integrations, scaling to seasonal order spikes without added infrastructure.</div>
</div>
<div class="result-item">
<div class="result-metric">2000+ workflows</div>
<div class="result-desc">What began as a single ERP-to-PLM sync grew into over 2,000 workflows running across four tenants, one per environment in Fila's ERP rollout: development, QA, staging, and production.</div>
</div>
<div class="result-item">
<div class="result-metric">25+ engineers working with Kestra</div>
<div class="result-desc">Fila's IT lead built the original integration layer, then onboarded engineers from its development partner and its own team as new use cases, like e-commerce, expanded who needed to build and maintain flows.</div>
</div>
<div class="result-item">
<div class="result-metric">Self-hosted on Docker Swarm, zero managed-cloud dependency</div>
<div class="result-desc">Fila runs its entire Kestra environment on self-managed Docker Swarm infrastructure, keeping control in-house rather than handing the integration layer to a managed cloud service. <em class="inline-quote">"Scaling our operations used to be a challenge. With Kestra, we now have a reliable orchestration layer that adapts to different environments, ensuring smooth integration as we expand internationally."</em> — John Kim</div>
</div>
</div>

## Kestra at Fila

Fila runs Kestra on a self-managed Docker Swarm cluster, with the web server, worker, executor, and scheduler deployed as separate, replicated services rather than a single standalone container. S3-compatible object storage handles internal storage and PostgreSQL backs the workflow metadata. Access runs through enterprise single sign-on with role-based access control, and a namespace-per-tenant structure maps to Fila's ERP environments across development, QA, staging, and production.

The core integration pattern is a master flow that queries a source table for rows flagged as not yet interfaced, fans them out in parallel to a worker sub-flow that upserts each row into the destination ERP database, then marks the source row as processed. The same pattern extended to legacy batch jobs, triggered on a schedule against Fila's existing batch servers, and to e-commerce, where a queue-triggered flow ingests Shopify order and inventory events into the ERP.

Beyond data integration, Fila is exploring Kestra for infrastructure automation, including automated certificate renewal, and is evaluating Kestra's AI Copilot to accelerate flow development further.

<div class="stack-row">
<span class="stack-pill">Docker Swarm</span>
<span class="stack-pill">SQL Server</span>
<span class="stack-pill">S3-Compatible Storage</span>
<span class="stack-pill">PostgreSQL</span>
<span class="stack-pill">Enterprise SSO</span>
<span class="stack-pill">Microsoft Teams</span>
<span class="stack-pill">Shopify</span>
<span class="stack-pill">Message Queue</span>
</div>
