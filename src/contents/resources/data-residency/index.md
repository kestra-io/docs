---
title: "Data Residency Explained: Definition, Requirements & Orchestration"
description: "Learn what data residency means, how it differs from sovereignty and localization, and how to enforce regional compliance across your data pipelines."
metaTitle: "Data Residency: Definition, Requirements & Compliance Guide"
metaDescription: "Understand data residency requirements, compliance frameworks, and how to enforce geographic data storage constraints in modern enterprise pipelines."
tag: "infrastructure"
date: 2026-10-14
slug: "data-residency"
faq:
  - question: "What does 'data residency' mean?"
    answer: "Data residency refers to the physical or geographic location where an organization's data is stored and processed. It is typically driven by corporate policy, contractual obligations, or specific regulatory frameworks requiring data to remain within designated national or regional boundaries."
  - question: "How does data residency differ from data sovereignty?"
    answer: "Data residency simply dictates the physical or geographic location of stored data. Data sovereignty goes further, dictating that data is subject to the laws, regulations, and legal jurisdiction of the country where it is physically located."
  - question: "Does GDPR apply to US residents?"
    answer: "GDPR protects individuals who are in the European Economic Area (EEA), regardless of nationality, so it does not protect US residents in the US. It can still apply to a US-based organization that offers goods or services to people in the EU or monitors their behavior there."
  - question: "Why must work data reside within company-approved locations?"
    answer: "Company-approved locations ensure adherence to internal compliance policies, prevent unauthorized data exfiltration, reduce legal liability, and satisfy contractual stipulations agreed upon with enterprise customers and regulatory bodies."
  - question: "What are the primary requirements for data residency compliance?"
    answer: "Key requirements include maintaining clear data inventories, mapping data flows across cloud and on-premise systems, enforcing strict geographic boundaries on storage targets, and retaining verifiable audit logs for regulatory inspections."
  - question: "What are three best practices for complying with data privacy laws?"
    answer: "First, keep an up-to-date map of what personal data you hold and where it flows. Second, enforce location and access rules in code (infrastructure and workflow definitions) rather than in documents. Third, encrypt data at rest and in transit, and keep audit logs that show who accessed what, where, and when."
---

> **TL;DR** — Data residency is the requirement that data be stored and processed in a specific country or region. It comes from laws, sector rules, or customer contracts. Meeting it takes more than picking a cloud region: every pipeline step, backup, and processing location must stay inside the approved boundary, and you must be able to prove it.

If your organization operates across multiple countries, knowing where your databases live is no longer just an IT checklist item. It is a core governance requirement. Whether responding to European privacy regulations or enterprise customer contracts, data teams must ensure that sensitive customer records do not cross unauthorized borders during ETL processing, backup generation, or analytics queries. 

Data residency is often treated as a static configuration setting within cloud storage buckets. In reality, modern data pipelines ingest, replicate, and transform data continuously across diverse environments. Enforcing residency requires treating geographic boundaries as a first-class constraint across your entire workflow orchestration layer.

## Defining data residency and its core distinctions

Understanding the precise terminology is the first step toward compliance. Data residency, sovereignty, and localization are related but distinct concepts with different technical and legal implications.

### Data residency: where your data lives

Data residency refers to the physical or geographical location where an organization's data is stored. For example, a policy might state that all customer data from European users must be stored in data centers located within the European Union. This requirement is typically driven by regulations, corporate policy, or customer contracts. It answers the simple question: "In which country or region are our servers located?"

### Data residency vs. data sovereignty vs. data localization

These terms are often used interchangeably, but their differences are critical for legal and architectural planning.

| Concept | Core Question | Implication |
|---|---|---|
| **Data Residency** | Where is the data physically stored? | A geographic constraint on storage location. |
| **Data Sovereignty** | What country's laws apply to the data? | A legal constraint. Data is subject to the laws of the country in which it is stored, including government access requests. |
| **Data Localization** | Can the data leave the country's borders? | A strict requirement that data must be stored, processed, and remain within a specific country. It's the strongest form of data residency. |

In short, residency is about the *location*, sovereignty is about the *law*, and localization is a strict mandate to *keep data within borders*. The three do not always line up. Data stored in a Frankfurt region meets a German residency requirement, but if the provider is a US company, US law can still reach it: the [CLOUD Act](https://www.justice.gov/criminal/cloud-act-resources) lets US authorities compel US providers to disclose data they control, wherever it is stored. That gap is why sovereignty questions focus on who operates the infrastructure, not only where it sits.

## Why data residency dictates modern architecture

Data residency is not just a legal hurdle; it's a foundational principle that influences security posture, customer relationships, and architectural design.

### Ensuring compliance with global and regional laws

The primary driver for data residency is legal compliance. Some laws require it outright: Russia and China, for example, impose localization rules on certain categories of personal data. Others, such as the EU's General Data Protection Regulation (GDPR) and Brazil's LGPD, do not mandate local storage but restrict transfers to other countries, which pushes many organizations to keep data in-region as the simplest way to comply. Sector rules, public-sector procurement, and customer contracts add requirements of their own. GDPR fines can reach 4% of annual global turnover or 20 million euros, whichever is higher.

### Protecting data privacy and reducing enterprise risk

By keeping data within specific jurisdictions, organizations can limit exposure to foreign laws and government surveillance that may conflict with their users' privacy rights. Storing data locally reduces the complexity of cross-border data transfer agreements and minimizes the risk of data being intercepted or accessed inappropriately while in transit between countries.

### Building trust with customers and auditors

Demonstrating a clear and enforceable data residency policy is a powerful way to build trust. For enterprise customers, particularly in finance and healthcare, proof of data residency is often a non-negotiable contractual requirement. For auditors, having a system that produces clear, auditable evidence of where data is stored and processed simplifies compliance verification. Maintaining detailed [audit logs through orchestration](/resources/infrastructure/audit-logs-orchestration) becomes a key enabler for proving that residency policies are being met.

## Regulatory frameworks shaping the data residency landscape

The global regulatory environment is a complex patchwork of national and regional laws. While not exhaustive, a few key frameworks define the modern approach to data residency.

### Understanding GDPR and regional privacy mandates

GDPR is the most influential data privacy regulation globally, and it is often misread as a residency law. It is not: GDPR does not require personal data to stay in the EU. What it regulates is [transfers outside the European Economic Area](https://www.edpb.europa.eu/sme-data-protection-guide/international-data-transfers_en). A transfer is allowed when the destination has an [adequacy decision](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en) from the European Commission, or when the organization puts safeguards in place, such as standard contractual clauses plus a transfer impact assessment.

In practice, many companies still choose EU hosting, because it removes the transfer question entirely and is easier to explain to customers and auditors. That choice is a design decision, not a legal obligation, and it only works if every copy of the data, including backups, logs, and intermediate files, stays in the EU as well.

### The regulatory landscape in the United States

The U.S. has no federal privacy law equivalent to GDPR. State laws such as the California Consumer Privacy Act (CCPA, amended by the CPRA), and laws in Virginia, Colorado, and other states, focus on consumer rights, notice, and opt-outs. They do not require data to be stored in a particular state. Residency requirements in the U.S. usually come from elsewhere: federal contracts and government cloud programs, sector-specific obligations, and enterprise customers who write location clauses into their contracts.

### How data residency impacts cloud and SaaS models

Cloud providers like AWS, Google Cloud, and Azure have built their infrastructure to accommodate data residency requirements. They offer data centers in numerous geographic "regions," allowing customers to select where their data will be stored and processed. For example, a company can choose the `eu-central-1` (Frankfurt) region in AWS to ensure its data resides within Germany. The responsibility for configuring applications and data pipelines to *use* these regional endpoints correctly still falls on the customer.

## Implementing data residency best practices in production

Achieving compliance is an ongoing process of auditing, enforcement, and strategic planning.

### Conducting regular data audits and mapping lineage

You can't enforce residency if you don't know where your data is or where it's going. The first step is to create and maintain an inventory of your data assets. This involves mapping data flows from ingestion to storage, processing, and analytics. Effective [workflow governance](/resources/infrastructure/workflow-governance) requires tools that can automatically track data lineage and provide a clear picture of your data's journey.

### Selecting compliant cloud regions and storage providers

When choosing a cloud or SaaS vendor, verify their data residency capabilities. Ensure they offer data centers in the required jurisdictions and provide clear contractual guarantees about where your data will be stored. Scrutinize their terms of service to understand how they handle backups, disaster recovery, and support access, as these can inadvertently cause data to cross borders.

### Enforcing company-approved data storage boundaries

Policies must be enforced through technical controls. This can include:
-   **Identity and Access Management (IAM) policies** that restrict users or services from creating resources outside of approved regions.
-   **Network controls** like VPC endpoints and firewalls to block traffic to unauthorized regions.
-   **Automated guardrails** in your infrastructure-as-code (IaC) and orchestration platforms that validate and enforce regional constraints before deployment.

## Managing multi-jurisdictional complexity through orchestration

As data pipelines become more complex, manual enforcement of data residency becomes untenable. The solution is to embed residency rules directly into your automation and orchestration layer.

### Addressing cross-border data transfer challenges

A common failure point is a workflow that reads data from a compliant database in one region (e.g., Ireland) but processes it using a tool hosted in another (e.g., a US-based analytics service). This temporary transfer can violate residency rules. An orchestration platform must be able to manage the entire lifecycle of a workflow within a single, compliant geographic boundary.

### Enforcing regional isolation with declarative pipelines

By defining infrastructure and workflows as code, you can make data residency an explicit, auditable part of your system. A declarative workflow can specify not only the tasks to be run but also the environment in which they must execute. This includes the cloud region, the storage buckets, the database endpoints, and the compute resources, ensuring that every component of the pipeline adheres to the same residency constraints. One layer is easy to forget: the orchestrator itself. Files passed between tasks, execution logs, and secrets all live in the orchestrator's own storage, so that storage has to sit inside the boundary too.

## Orchestrating region-aware data pipelines with Kestra

Kestra can run self-hosted in the region or private cloud of your choice, so the control plane, the workers, and the internal storage that holds files passed between tasks can all sit inside the same boundary. Within one instance, the Enterprise Edition adds three controls that matter for residency:

- **Worker groups:** tasks declare a `workerSelector` with tags such as `eu`, and Kestra routes them only to [workers subscribed to that queue](/docs/enterprise/scalability/worker-group). A queue can be restricted to specific tenants, and a default selector can be set for a whole namespace so no task runs outside the region by accident.
- **Tenants with dedicated storage and secrets:** each [tenant](/docs/enterprise/governance/tenants) can use its own internal storage bucket and secrets backend, for example one tenant per region. See [multi-tenancy orchestration](/resources/infrastructure/multi-tenancy-orchestration) for the isolation models.
- **Policies:** a [policy](/docs/enterprise/governance/policies) can add the regional selector to every task in a namespace, so the rule is enforced by the platform instead of by each flow author.

Public-sector organizations use this kind of setup when control over location is non-negotiable: [Dataport](/customers/dataport), Germany's public-sector IT services provider, standardized API-driven cloud orchestration on private cloud with Kestra, a government-grade orchestration control plane.

### Example: Enforcing regional storage constraints in YAML

The following flow processes EU customer files without leaving the EU: it reads from an EU bucket, pseudonymizes the records on EU workers, and writes the result to another EU bucket.

```yaml
id: eu-customer-data-processing
namespace: company.compliance.eu

tasks:
  - id: download-raw
    type: io.kestra.plugin.aws.s3.Download
    region: eu-central-1
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    bucket: acme-eu-raw
    key: "customers/{{ trigger.date | date('yyyy-MM-dd') }}.csv"
    workerSelector:
      tags: [eu]

  - id: pseudonymize
    type: io.kestra.plugin.scripts.python.Script
    workerSelector:
      tags: [eu]
    inputFiles:
      customers.csv: "{{ outputs['download-raw'].uri }}"
    outputFiles:
      - customers_pseudonymized.csv
    script: |
      import csv, hashlib

      with open("customers.csv") as src, open("customers_pseudonymized.csv", "w", newline="") as dst:
          reader = csv.DictReader(src)
          writer = csv.DictWriter(dst, fieldnames=reader.fieldnames)
          writer.writeheader()
          for row in reader:
              row["email"] = hashlib.sha256(row["email"].lower().encode()).hexdigest()
              writer.writerow(row)

  - id: upload-curated
    type: io.kestra.plugin.aws.s3.Upload
    region: eu-central-1
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    bucket: acme-eu-curated
    key: "customers/{{ trigger.date | date('yyyy-MM-dd') }}.csv"
    from: "{{ outputs.pseudonymize.outputFiles['customers_pseudonymized.csv'] }}"
    workerSelector:
      tags: [eu]

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 5 * * *"
    timezone: Europe/Berlin
```

A few things are worth noticing in this workflow:
*   **Region pinned at every step:** both buckets are addressed in `eu-central-1`, and each task carries `workerSelector: {tags: [eu]}`, so it can only run on workers in the EU queue. If no EU worker is available, the task fails instead of silently running elsewhere (the 2.0 default `fallback: FAIL`). Worker selectors are an Enterprise Edition feature; with the open-source edition, the equivalent is to run the whole Kestra instance in the region.
*   **Processing stays in-region:** the email column is pseudonymized by a script that runs on the same EU workers, so no raw record is sent to an external service.
*   **The orchestrator's storage counts too:** the downloaded file and the script output pass through Kestra's internal storage. Pointing that storage, or the tenant's dedicated storage, at an EU bucket keeps those intermediate copies in the boundary.
*   **Evidence for auditors:** the flow is versioned YAML, and every execution records which task ran, when, and with which inputs, which gives auditors a traceable record of where data was processed.

## Where data residency pays off

Data residency requirements show up most often in these domains:
-   **Financial Services:** Regulators and outsourcing rules often require banks to know and control where data and processing are located, and some countries add local storage rules for payment data.
-   **Healthcare:** Patient data is often subject to national hosting rules or hospital contracts that require in-country storage.
-   **Government & Public Sector:** Ensuring citizen data remains within national borders under government control.
-   **Global E-commerce:** Building trust with international customers by respecting their local data privacy laws.
-   **SaaS Platforms:** Offering data residency as a premium feature to attract enterprise customers in regulated industries.

## Related concepts

- [**Data Lineage**](/resources/data/data-lineage): Track the flow of data across systems to prove residency and simplify audits.
- [**European Data Orchestration Platform**](/resources/data/european-data-orchestration-platform): What to look for in an orchestrator when data must stay in Europe.
- [**SOC 2 Compliance**](/resources/infrastructure/soc2-compliance): Learn how orchestration helps meet security and availability controls, which often overlap with residency requirements.
- [**Self-Hosted Workflow Orchestration**](/resources/infrastructure/self-hosted-workflow-orchestration): Run the orchestrator on infrastructure you control, in the region you choose.
- [**Workflow Orchestration Security**](/resources/infrastructure/workflow-orchestration-security): Secrets, access control, and isolation practices that support residency policies.

---

Kestra provides the declarative control plane to enforce data residency, security, and governance policies across all your data and infrastructure workflows. By defining compliance as code, you can move from manual checks to automated, auditable enforcement.
