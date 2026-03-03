---
title: Orchestrating Cybersecurity for 100+ Users and Billions of Rows
description: In under 3 months, a global financial institution empowered 100+
  users, ran thousands of API pulls weekly, and processed billions of rows
  securely with Trino, dbt, and AWS thanks to Kestra.
metaTitle: Global Bank Orchestrates Cybersecurity for 100+ Users and Billions of Rows
metaDescription: In under 3 months, a global financial institution empowered
  100+ users, ran thousands of API pulls weekly, and processed billions of rows
  securely with Trino, dbt, and AWS thanks to Kestra.
heroImage: ./hero.png
featuredImage: ./hero.png
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.aws.s3.Trigger
  - io.kestra.plugin.jdbc.trino.Query
  - io.kestra.plugin.aws.cli.AwsCLI
  - io.kestra.plugin.dbt.cli.Build
kpi1: |-
  ##### Billions
  of cybersecurity records processed
kpi2: |-
  ##### 100+
  users empowered to run secure workflows
kpi3: |-
  ##### 4,000+
  API pulls per week orchestrated 
quote: For the first time, with Kestra, our analysts weren’t waiting for
  engineering to catch up. They could define the workflows themselves. That
  changed everything.
quotePerson: Product Owner
quotePersonTitle: ""
industry: Banking & Investment
headquarter: New York City, USA
solution: Helping power economic growth by creating opportunities for all
  through business and community investments, local collaborations and policy
  advocacy.
companyName: Global Leading Banking Company
---

For a **global financial institution**, protecting customers against fraud and malicious activity is not simply an IT challenge; **it is the backbone of trust**. For one of the world’s largest and most influential banks, the stakes could not be higher. Every day, billions of transactions pass through its systems, and behind each one is the constant threat of cyberattacks, fraud, and data breaches.

Within this Global Leading Financial Company, the cybersecurity and technology division was given the responsibility to rethink how threat intelligence and fraud detection data were collected, enriched, analyzed, and disseminated across the enterprise. The mission was ambitious: **create a secure and scalable data orchestration environment** capable of supporting hundreds of users, dozens of external data sources, and multiple business-critical products, all under strict compliance rules and aggressive deadlines.

> “We needed more than a workflow engine. We needed a backbone, something to move data seamlessly so our teams could focus on fighting fraud, not writing scripts.”, Cybersecurity Product Owner
> 

## A Program in Motion

The division counted more than **100 active users**, split between product owners, analysts, and engineers. Many were highly technical, but not all were comfortable writing Python or maintaining custom code bases. The company had made the directive clear: **the orchestration layer should not depend on Python**.

The teams wanted a **middle ground** between no-code drag-and-drop interfaces and heavy code-first frameworks. They needed something expressive enough for engineers, yet accessible to cybersecurity specialists who worked closer to the data.

The challenge became clearer:

- **External APIs:** dozens of vendor feeds delivering millions of records daily (malicious domains, leaked credentials, dark web intelligence).
- **Internal datasets:** billions of rows of logs on suspicious transactions and user activity.
- **Scheduling needs:** some feeds pulled every hour, others every six hours, others daily.

Their stack was already sophisticated:

- **Trino** for querying massive datasets.
- **dbt** for modeling and transformations.
- **AWS** for infrastructure, with S3 as the storage layer.

What was missing was the **glue**. The company needed something to orchestrate the ingestion of APIs, the transformation of data, and the dissemination of intelligence. And it had to be secure, resilient, and fast enough to handle thousands of workflows a week.

## The Challenge of Scale and Compliance

The cybersecurity and fraud detection workflows followed a clear sequence:

1. **Ingestion**: APIs, vendor feeds, and internal data sources.
2. **Enrichment**: dbt transformations, cleansing, schema alignment.
3. **Analysis**: Trino queries to detect anomalies or threats.
4. **Storage**: secure long-term repositories, compliant with regulations.
5. **Dissemination**: results routed to products, dashboards, or business units.

Each stage required different technologies. The orchestration had to tie them together without slowing anyone down.

The scale was daunting:

- **Millions of URLs and IPs** ingested from external feeds.
- **Billions of rows** processed in internal datasets.
- **Hundreds of ingestion jobs per day**, each needing retries, monitoring, and low latency.

And because this was a **highly regulated institution**, security was paramount:

- Role-Based Access Control (RBAC) for over 100 users.
- Integration with **AWS Secrets Manager** to protect credentials.
- Full **auditability** of every workflow execution.

They also mandated a **multi-cloud strategy**. AWS was the first step, but the system needed to be ready for the firm’s private cloud and even future deployments on GCP or Azure. Disaster recovery requirements were uncompromising: at least one **hot** environment running continuously, with multiple **warm** environments ready for failover.

> “If one pipeline breaks, the risk is measured in millions. Reliability wasn’t optional , it was the entire point.” , Engineering Lead
> 

## Building the Orchestration Layer

The teams had tried open-source orchestrators before. Some were too **code-heavy**, forcing every workflow into Python. Others were too **rigid**, limited to specific automation tasks. The company needed something in between: a **declarative, YAML-first approach** that remained extensible.

That’s when **Kestra** entered the picture.

For product owners and analysts, Kestra became the **“wizard behind the curtain”** , a system that handled ingestion, enrichment, analysis, and dissemination invisibly, without requiring Python. For engineers, it offered the flexibility to integrate with Trino, dbt, and internal APIs.

The first alpha  mapped directly to the company’s milestones:

- **Ingestion**: hourly API pulls, defined declaratively instead of scripted.
- **Enrichment**: dbt transformations adding geolocation, categories, and context to raw feeds.
- **Analysis**: Trino queries run through Kestra workflows to match suspicious activity against logs.
- **Storage**: automated pushes to S3 for raw and curated datasets.
- **Dissemination**: results routed to dashboards, apps, or external partners.

The orchestration wasn’t just about technology , it was about people.

- **Product owners** could experiment with new data sources without waiting weeks.
- **Analysts** could run and test transformations independently.
- **Engineers** could focus on higher-value tasks like writing plugins instead of maintaining brittle scripts.

## Results and Impact

Despite the complexity, the results were delivered in **under three months. Kestra** unified every stage of the cybersecurity data lifecycle while meeting compliance and resilience demands.

The impact was measurable:

- **100+ users empowered**: workflows defined and executed without relying on Python.
- **Thousands of API pulls per week** executed reliably, with retries and monitoring.
- **dbt models ran every 6 hours**, enriching new data continuously.
- **Minutes reduced to seconds**: pipeline turnaround times dropped dramatically thanks to Trino + dbt orchestration.
- **Data stored securely in S3**, satisfying compliance and audit requirements.
- **Intelligence disseminated faster**, reaching fraud detection products and business units in near real-time.

The cultural shift was just as significant as the technical one.

> “For the first time, our analysts weren’t waiting for engineering to catch up. They could define the workflows themselves. That changed everything.”  Product Owner
> 

Product owners no longer had to rely on engineers to code ingestion jobs. Analysts could enrich and test data directly. Engineers could dedicate their time to extending the system, confident that the orchestration layer would keep running.

## Looking Ahead

The vision is to scale this orchestration backbone across **more divisions, more feeds, and more use cases**.

The team summarized it best:

> “Pretty much all of our cyber automations and analytics jobs should eventually run through this platform. It’s not just a tool , it’s becoming part of how we work.”
> 

For one of the world’s largest financial institutions, Kestra is the backbone of cybersecurity data.
Fraud and threat detection decisions now run on reliable, compliant workflows that deliver intelligence at scale and on time.
