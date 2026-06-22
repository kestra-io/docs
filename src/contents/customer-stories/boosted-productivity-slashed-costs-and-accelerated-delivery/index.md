---
title: How One Engineer Manages 50+ Production Pipelines for 2,800 Automotive Clients
rank: 1
description: This is the story of how Foundation Data consolidated their entire data stack on Kestra, replacing three tools, cutting toolchain costs by more than 90%, and giving one engineer the leverage to keep up with 40% client growth.
metaTitle: "Foundation Data & Kestra: One Engineer, 50+ Pipelines, 2,800 Clients"
metaDescription: Foundation Data replaced SuperMetrics, Prefect, and dbt Cloud with Kestra, cutting toolchain costs by more than 90% and enabling a solo engineer to serve 2,800 automotive dealerships.
heroImage: ./hero.png
featured: false
featuredImage: ./hero.png
logo: ./logo.png
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.dbt.cli.DbtCLI
  - io.kestra.plugin.gcp.bigquery.Query
  - io.kestra.plugin.git.Clone
kpi1: |-
  ##### 50+
  workflows in production
kpi2: |-
  ##### 10x
  faster to build
kpi3: |-
  ##### >90%
  toolchain cost reduction
kpi4: |-
  ##### 99%
  pipeline success rate
quote: Kestra completely transformed our operational workflows. We now deploy new pipelines rapidly, easily manage our integrations, and have vastly improved our productivity and cost efficiency.
quotePerson: Jack Perry
quotePersonTitle: Head of Data Operations
industry: Advertising
headquarter: Leesburg, VA
region: Americas
companySize: "< 100"
solution: Foundation Data is a technology company that powers marketing analytics and digital advertising intelligence for automotive dealerships across the United States. They handle the data infrastructure behind OEM integrations, dbt transformations, BigQuery analytics, and Looker dashboards for over 2,800 dealership clients.
tagline: Data and analytics partner for automotive dealerships
companyName: Foundation Data
useCase: Data Orchestration
deployment: Kestra Cloud
intro: "Foundation Data serves over 2,800 automotive dealerships across the United States. One engineer runs the entire data stack. That ratio became possible because of two decisions made early in the company's life as an independent entity: commit to Infrastructure as Code from day one, and find an orchestrator that could run Go. Both pointed to Kestra."
cta: "What would change if one engineer could orchestrate 50+ pipelines, serve 2,800 clients, and still have time to innovate?"
---

## The problem

<div class="problem-list">
<div class="problem-item">
<span class="problem-number">01</span>
<div class="problem-title">Python-only orchestration couldn't run the language the workload required</div>
<div class="problem-desc">Foundation Data's OEM data extraction jobs query dealership APIs that are rate-limited. Python's threading model capped concurrent requests at 3. Go's concurrency model supports 50 to 60 simultaneous requests. For extraction jobs that were taking 2 to 3 hours, that difference meant finishing in under an hour or missing SLAs entirely. The orchestrator needed to run Go natively, not as a workaround but as a first-class execution target.</div>
</div>
<div class="problem-item">
<span class="problem-number">02</span>
<div class="problem-title">A three-tool stack with mounting costs and no path to Infrastructure as Code</div>
<div class="problem-desc">As Foundation Data spun out as an independent company in mid-2025, the cost structure needed to work at the new entity's scale. The existing toolchain carried significant fixed costs: SuperMetrics for data fetching, dbt Cloud for transformations, and Prefect workspace environments on top. The orchestration layer had no Terraform support, which blocked Foundation Data's commitment to deploy everything as versioned, rollback-able infrastructure. The toolchain wasn't just expensive; it was architecturally incompatible with how the team wanted to build.</div>
</div>
<div class="problem-item">
<span class="problem-number">03</span>
<div class="problem-title">Non-technical users needed to trigger complex workflows without engineering help</div>
<div class="problem-desc">Foundation Data's measurement team (four or five analysts who monitor Google Analytics across 2,800 dealership websites) needed to trigger workflows on demand: updating tags, running audits, syncing changes across hundreds of dealer sites simultaneously. These workflows involve 30 to 40 conditional inputs and six or seven underlying subflows. The team couldn't route every request through the engineering queue, and they couldn't give analysts access to raw pipeline tooling.</div>
</div>
</div>

<div class="problem-close">
<div class="problem-close-prefix">// The requirement</div>
An orchestrator that could run <strong class="problem-close-key">any language, deploy via Terraform, and give non-engineers controlled access to complex workflows</strong>, without requiring a second engineer to manage it.
</div>

## What Kestra fixed

<div class="fix-list">
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Language-agnostic task runners: Go, Python, Bash, SQL in the same pipeline</div>
<div class="fix-desc">Kestra's task runners execute code in isolated containers, without forcing a single runtime. Foundation Data's OEM extraction jobs now run as Go containers. dbt transformations run as dbt Core. Python and Bash tasks run alongside them in the same flow. <em class="inline-quote">"That's really what enabled us to do what we want to do"</em>: task runners were the capability that made the switch worth evaluating. Extraction time dropped from 2 to 3 hours to under an hour.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Full toolchain consolidation: SuperMetrics, Prefect, and dbt Cloud all replaced</div>
<div class="fix-desc">SuperMetrics was decommissioned. dbt Cloud was replaced with dbt Core, orchestrated directly by Kestra. Prefect workspace fees were eliminated. The monthly toolchain cost fell by more than 90%, leaving almost entirely BigQuery compute.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Full infrastructure managed through Terraform, including Kestra itself</div>
<div class="fix-desc">Foundation Data's entire Kestra environment (namespaces, secrets, users, flows, and Apps) is declared in Terraform and deployed from Git. That was a hard requirement from day one of the company's independent existence. Kestra was the only orchestrator in the evaluation that supported it.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Kestra Apps: non-engineers triggering complex workflows with guardrails</div>
<div class="fix-desc">The measurement team uses a Kestra App built by Jack to manage Google Analytics across all 2,800 dealership websites. The App presents 30 to 40 conditional inputs, routes users through the right options, and handles six or seven underlying subflows automatically. Concurrency controls cap execution at Google Tag Manager's rate limit of 200 requests per minute, queuing simultaneous runs rather than letting them collide. <em class="inline-quote">"That queuing system is really key. If someone triggered two runs at once, we'd hit their rate limits right away. Now it queues them up."</em></div>
</div>
</div>
</div>

## Outcomes

<div class="results-list">
<div class="result-item">
<div class="result-metric">>90% toolchain cost reduction</div>
<div class="result-desc">Foundation Data replaced a three-tool stack with a single orchestration platform. Consolidating onto Kestra cut toolchain costs by more than 90%, leaving almost entirely BigQuery compute. That shift funded the operational model that lets one engineer run the whole thing.</div>
</div>
<div class="result-item">
<div class="result-metric">40% client growth at 10% cloud cost increase</div>
<div class="result-desc">Foundation Data grew from 2,000 dealership clients to 2,800 between 2024 and 2025. Their cloud bill grew roughly 10%. The architecture scaled horizontally without requiring proportional infrastructure spend or additional headcount. <em class="inline-quote">"We went from 2,000 to 2,800 dealers — 40% growth — and our cloud bill went up maybe 10%. I don't think people realize how much Jack has made our systems efficient."</em> — Mike Heidner, SVP Analytics</div>
</div>
<div class="result-item">
<div class="result-metric">99% pipeline success rate</div>
<div class="result-desc">Under the previous orchestrator, pipeline failures came roughly every other day. Kestra has had one failure in fourteen months. <em class="inline-quote">"Before this last stretch, I hadn't touched Kestra in four months. It just runs."</em></div>
</div>
<div class="result-item">
<div class="result-metric">One engineer, 50+ production workflows</div>
<div class="result-desc">Jack Perry manages the full data stack as Foundation Data's sole data engineer. Three outsourced data contractors were let go. Mike Heidner, Foundation Data's SVP of Analytics, monitors pipeline health and executes flows himself from the Kestra UI daily. <em class="inline-quote">"Today I approved five flows in Kestra just sitting there. Two clicks of a button. I feel like I'm more aware of what's going on with our data pipelines than I ever was before."</em></div>
</div>
</div>

## Kestra at Foundation Data

Foundation Data runs on Kestra Cloud (GCP US Central, dedicated instance). Jack Perry manages the environment entirely through Terraform: namespaces, secrets, user permissions, flow definitions, and Kestra Apps are all declared in code and deployed from Git. Adding a new OEM data source means writing Go code for the extraction logic and a Kestra flow definition for the orchestration; the infrastructure is a merge.

OEM extraction jobs run in containerized Go workers that query dealership APIs with 50 to 60 concurrent requests. The previous Python-based approach was limited to 3 concurrent requests, turning a rate-limited API into a multi-hour bottleneck. dbt Core runs directly inside Kestra, replacing dbt Cloud without changing any transformation logic. BigQuery is the analytics target; Looker dashboards sit on top for client-facing reporting.

The measurement team's workflow (monitoring and updating Google Analytics across 2,800 dealership websites) runs through a Kestra App. Analysts trigger updates on demand through a guided interface. Concurrency controls and API rate-limit queuing are declared in the flow definition, not written into application code, which means they're visible, reviewable, and consistent regardless of who triggers the workflow.

<div class="stack-row">
<span class="stack-pill">Kestra Cloud</span>
<span class="stack-pill">Go</span>
<span class="stack-pill">Python</span>
<span class="stack-pill">BigQuery</span>
<span class="stack-pill">dbt Core</span>
<span class="stack-pill">Terraform</span>
<span class="stack-pill">Looker</span>
<span class="stack-pill">Google Tag Manager</span>
</div>
