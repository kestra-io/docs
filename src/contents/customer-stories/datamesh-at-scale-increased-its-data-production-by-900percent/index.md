---
title: How Leroy Merlin France Replaced Airflow and Built a Data Mesh at Scale
rank: 1
description: Leroy Merlin France replaced a fragmented legacy scheduling stack and a failing Airflow deployment with Kestra, scaling data production by 900% and growing to 5,000+ flows across 250+ engineers since May 2020.
metaTitle: "Leroy Merlin France & Kestra: Data Mesh at Scale, 900% More Data Production"
metaDescription: How Leroy Merlin France replaced Airflow and legacy schedulers with Kestra, scaling to 5,000+ flows across 250+ active engineers and cutting pipeline deployment from days to hours.
heroImage: ./hero.png
featured: true
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.gcp.cli.GCloudCLI
  - io.kestra.plugin.gcp.bigquery.Trigger
  - io.kestra.plugin.gcp.gcs.UpdateBucket
  - io.kestra.plugin.git.Clone
kpi1: |-
  ##### +900%
  in data production
kpi2: |-
  ##### +250
  active users
kpi3: |-
  ##### +5,000
  flows orchestrated
quote: Kestra is the unifying layer for our data and workflows. You can start small, but then there is no limit to the possibilities and scalability of such an open architecture.
quotePerson: Julien Henrion
quotePersonTitle: Head of Data
industry: Retail
headquarter: "Lezennes, France"
region: Europe
companySize: "5,000+"
solution: Leroy Merlin France is the French subsidiary of ADEO Group, one of the world's largest home improvement and gardening retailers. Their data platform team orchestrates hundreds of pipelines across multiple engineering squads, underpinning product analytics, customer data, and retail operations for 80,000+ employees and 140 stores across France.
tagline: Global home improvement and gardening retailer
companyName: Leroy Merlin France
useCase: Replacing Airflow to build a self-service data mesh serving 250+ engineers across 140 stores
useCaseShort: Data Orchestration
deployment: Self-hosted (Kubernetes)
intro: "Leroy Merlin France, a subsidiary of ADEO Group managing data operations for 80,000+ employees across 140 stores, needed to replace a fragmented legacy scheduling stack and a failing Airflow deployment with a platform that could support self-service data engineering at scale. Starting in May 2020, they built a full DataOps lifecycle on Kestra: GitOps deployment, a custom ingest plugin, Enterprise RBAC, and a Data Mesh architecture where individual squads publish their own data products. Today the platform orchestrates 5,000+ flows, serves 250+ active engineers, and has been a cornerstone of LMFR's data operations for over six years."
cta: "What would change if your data mesh produced 9× more data, automating the pipelines that power your entire retail operation?"
---

## The problem

<div class="problem-list">
<div class="problem-item">
<span class="problem-number">01</span>
<div class="problem-title">A legacy stack built for on-prem that couldn't reach cloud-native GCP</div>
<div class="problem-desc">Leroy Merlin France had set a hard deadline: full cloud migration by 2022. The existing stack (Teradata for warehousing, Stambia for ELT, Dollar U and Automic Workload Automation for scheduling) was built for a world that no longer matched their architecture. None of it was designed for serverless, cloud-native workloads on GCP. A new orchestration layer wasn't optional; it was the prerequisite for everything else.</div>
</div>
<div class="problem-item">
<span class="problem-number">02</span>
<div class="problem-title">Airflow failed in benchmarks and couldn't support self-service</div>
<div class="problem-desc">The team tried Google Cloud Composer, then self-hosted Airflow on Kubernetes. Both failed. In a benchmark of 1,000 tasks running <code>sleep 1</code>, tasks failed. A single badly-written DAG introduced code evaluated every five seconds by every Airflow component, slowing the entire cluster. For the same pipeline, Airflow ran 20 times slower than Stambia. Sensors consumed one worker slot each. XCOM couldn't pass meaningful data between tasks. RBAC was scoped to individual DAG owners with no way to share access across a team. The conclusion was stark: they couldn't let engineers write DAGs without mandatory code review, because one bad DAG could crash the cluster. That ruled out the self-service data platform they were trying to build. <em class="inline-quote">"After suffering with Airflow to schedule different treatments, Kestra's arrival was more than saving. The ecosystem of plugins is evolving rapidly and greatly facilitates integration with different bricks, especially on GCP (BQ, GCS, Cloud SQL, etc.). A tool that deserves to be known more."</em></div>
</div>
<div class="problem-item">
<span class="problem-number">03</span>
<div class="problem-title">Deploying a pipeline took days and required four teams</div>
<div class="problem-desc">Before Kestra, getting a new pipeline into production meant coordinating a transfer team, an orchestration team, a data team, and an internal ticketing process across multiple systems. Elapsed time: days. Each new data product required the same coordination overhead, regardless of complexity. The team couldn't scale with the business at that pace.</div>
</div>
</div>

<div class="problem-close">
<div class="problem-close-prefix">// The requirement</div>
An orchestration platform that could support <strong class="problem-close-key">self-service data engineering at scale</strong>, without the risk that one team's workflow could destabilize the whole platform.
</div>

## What Kestra fixed

<div class="fix-list">
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Declarative workflows any engineer can write, without framework lock-in</div>
<div class="fix-desc">Kestra's YAML-based workflow definitions gave every team a consistent, readable way to express pipeline logic, without Python-only constraints or proprietary abstractions. Engineers working in Python, SQL, or Bash could define their workflows in YAML and run existing code as-is. <em class="inline-quote">"Kestra is the first tool that allowed us to develop without installation, use your browser and start to build a true business use case within a few hours. Since the learning curve is easy, you can easily onboard new teammates due to its descriptive language. And, moreover, it handles all parts of the data pipeline: the transport, load, transform, data modeling, data quality and monitoring of all our data pipeline."</em> — Julien Henrion, Head of Data</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">A custom ingest plugin that collapsed the full pipeline lifecycle into one task</div>
<div class="fix-desc">The team built a custom <code>DataPlatformIngest</code> plugin that handled every step of the ingestion lifecycle in a single reusable task: archive raw data to GCS, validate against an Avro schema, version breaking changes, append lineage columns, load to an ODS table, and apply business quality rules (deduplication, referential checks, bounds validation). Source systems trigger ingestion via a simple HTTPS call to the Kestra API, with no Python dependency required on the source side. That mattered for legacy systems that couldn't install Python 3. <em class="inline-quote">"The tool responds perfectly to the need. Very easy to use; it manages all the complexity behind to offer a saving of time and huge savings."</em> — Julien Henrion, Head of Data</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">GitOps deployment: a git push deploys the full stack</div>
<div class="fix-desc">The team adopted a full DataOps lifecycle from the start. Workflows are sourced in GitHub, infrastructure defined in Terraform, and Kestra resources deployed via the Terraform provider. A single git push triggers the entire stack atomically. Pipeline deployment time dropped from days to hours.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Enterprise RBAC and SSO that scale across teams, not per-DAG</div>
<div class="fix-desc">Airflow's per-DAG-owner access model made it impossible to share workflows across a team without giving individuals ownership they didn't control. Kestra Enterprise's role-based access control and SSO support let LMFR give 250+ engineers access to the platform with appropriate guardrails, enabling a Data Mesh architecture where individual squads own and publish their own data products without a central team becoming a bottleneck. <em class="inline-quote">"Since the tool offers strong role-based access and security on the Enterprise Edition, we are safe to share it as Software as a Service to all applications allowing us to also embrace the Data Mesh pattern."</em> — Julien Henrion, Head of Data</div>
</div>
</div>
</div>

## Outcomes

<div class="results-list">
<div class="result-item">
<div class="result-metric">+900% data production</div>
<div class="result-desc">Data production increased ninefold from the platform's original baseline, driven by squads publishing their own data products independently rather than waiting for a central pipeline team. <em class="inline-quote">"Kestra has streamlined our data processes, reduced costs, and significantly enhanced our scalability and efficiency. It has truly been a critical asset in our digital transformation journey."</em> — Julien Henrion, Head of Data</div>
</div>
<div class="result-item">
<div class="result-metric">5,000+ flows in production</div>
<div class="result-desc">From the initial deployment in May 2020, the platform has grown to 5,000+ orchestrated flows across 250+ active engineers, processing millions of tasks per month for retail operations, product analytics, and customer data at national scale. <em class="inline-quote">"Kestra is a tool that is very easy to use with constant improvement in functionality. It covers almost all data pipeline setup needs."</em> — Julien Henrion, Head of Data</div>
</div>
<div class="result-item">
<div class="result-metric">Days to hours for pipeline deployment</div>
<div class="result-desc">Before Kestra, shipping a new pipeline required coordinating across four separate teams over multiple days. GitOps deployment via Terraform reduced that to a single git push, same day. Individual squads now own and publish their own data products without waiting on a central team.</div>
</div>
</div>

## Kestra at Leroy Merlin France

Kestra runs self-hosted on Kubernetes across four clusters, one per environment. The architecture supports a Data Mesh model: rather than a central data engineering team owning all pipelines, individual product squads define and deploy their own data products, governed by the platform's access controls and operational standards.

The `DataPlatformIngest` plugin sits at the center of the ingestion layer. It handles the full ingestion lifecycle in a single reusable task: schema validation, lineage tracking, quality rules, and ODS loading. New data sources connect to the platform via HTTPS API call, with no runtime dependencies required on the source side.

Deployment follows a fully automated GitOps model: code merged to the main branch triggers Terraform, which provisions or updates Kestra resources across environments. The same model governs infrastructure and workflow definitions equally. <em class="inline-quote">"Kestra is very easy to learn, with a large number of functionalities covering a large number of use cases (scheduled workflows, API calls, triggers, flow synchronization, data and file transfers, etc.). The Web interface facilitates the monitoring of flows and the consultation of logs. New features are added very regularly, often in response to needs. Kestra is evolving rapidly."</em> — Julien Henrion, Head of Data

<div class="stack-row">
<span class="stack-pill">Kestra Enterprise</span>
<span class="stack-pill">Kubernetes (GKE)</span>
<span class="stack-pill">Google Cloud Platform</span>
<span class="stack-pill">BigQuery</span>
<span class="stack-pill">Google Cloud Storage</span>
<span class="stack-pill">Kafka</span>
<span class="stack-pill">Terraform</span>
<span class="stack-pill">GitHub</span>
</div>
