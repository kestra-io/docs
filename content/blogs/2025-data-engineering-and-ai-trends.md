---
title: "2025 Data Engineering & AI Trends"
description: "How Generative AI, new data regulations, and open table formats affect the data engineering landscape in 2025 and beyond"
date: 2025-01-24T13:00:00
category: Solutions
author:
  name: Anna Geller
  image: "ageller"
image: /blogs/2025-data-engineering-and-ai-trends.png
---

Many trends that began shaping [data engineering in 2024](https://kestra.io/blogs/2024-01-24-2024-data-engineering-trends) continue to affect data teams in 2025. AI keeps accelerating, and data lakes—along with open table formats—are more popular than ever. Below is our take on the trends influencing data engineering and AI today, and how they impact data professionals.

---

## **1. Generative AI as an Efficiency Driver**

Last year’s prediction that AI would turn data teams [from cost into profit centers](https://kestra.io/blogs/2024-01-24-2024-data-engineering-trends#data-teams-as-profit-centers) has collided with reality. While generative AI is delivering measurable productivity gains, its impact on **revenue generation remains limited outside hyperscalers and niche applications**.

Coding assistants (e.g., Cursor, GitHub Copilot) accelerate development, while AI chatbots and search tools streamline workflows—enabling teams to achieve more with fewer hires.

Tech giants (Nvidia, AWS, Azure, Google) and LLM vendors profit from selling shovels in this gold rush, but [most industries](https://cloud.google.com/transform/ai-impact-industries-2025) use GenAI to trim operational costs rather than create new income streams. For example, many deploy chatbots to cut support expenses, not to monetize the bots themselves.

---

## 2. AI Agents Will Keep Improving

Many data teams in 2025 are experimenting with agentic AI – systems that plan tasks and make decisions autonomously. These AI agents can break tasks into smaller steps, execute those tasks, and interact with other tools.

That said, current agents still struggle with complex tasks. When faced with ambiguity or multi-layered problems, they might misinterpret context, hallucinate or continue running endlessly without knowing when to stop.

The next wave of improvements will likely focus on two areas: more robust frameworks to balance agent’s autonomy with control, and new models with built-in **inference time computation**, letting AI dynamically adjust its processing depth based on problem complexity. Techniques like chain-of-thought reasoning (where models explicitly outline their logic) show particular promise. We already see exciting developments in this field in early 2025 with open-source models such as [DeepSeek-R1](https://github.com/deepseek-ai/DeepSeek-R1).

---

## 3. Gigantic **and Small LLMs**

The scale of model sizes continues to diverge. On one end, the big LLM providers, such as OpenAI, build their [own data centers](https://www.theverge.com/2025/1/21/24348816/openai-softbank-ai-data-center-stargate-project) to power **enormously large models** which soon might reach trillions of parameters. Those LLMs can solve broad, complex problems. On the other end, **small models** (many of which are open-source) can run on laptops or phones and are perfect for specialized tasks. Both approaches broaden how (and where) data teams can deploy generative AI.

Modern models can now also retain entire conversations or documents in memory. The latest Gemini models, for example, handle up to 1 million tokens. While this reduces reliance on retrieval-augmented generation (*RAG*) for basic tasks, most teams will still use RAG for two reasons:

1. **Cost control**: Processing massive contexts gets expensive
2. **Precision**: RAG grounds models in proprietary data (e.g., internal company docs).

These LLM advancements, paired with autonomous agents, enable new use cases like:

- Customer service bots resolving multi-issue tickets end-to-end
- Cybersecurity systems rewriting firewall rules in real time during attacks.

But the risks scale too. Larger context windows could inadvertently memorize sensitive user data, while smaller models’ accessibility lowers the barrier for spam campaigns or targeted disinformation.

---

## 4. EU AI Act Makes Data Governance Non-Negotiable

The **EU AI Act** entered force in August 2024, with strict rules for high-risk AI systems (e.g., hiring tools, credit scoring) taking full effect by [**August 2026**](https://commission.europa.eu/news/ai-act-enters-force-2024-08-01_en). This forces teams to rethink data practices in 2025 in two key areas:

**1. Fighting Bias at the Source —** AI systems must now document training data origins and implement bias safeguards. Teams need audit trails showing exactly how data moves from raw sources to model inputs.

**2. Granular Control —** [Article 10](https://artificialintelligenceact.eu/article/10/) requires tracking *who* accesses sensitive data and *why*. Apache Iceberg’s [merge/delete capabilities](https://iceberg.apache.org/spec/) can help satisfy GDPR’s right to be forgotten, while integrations with [AWS Lake Formation](https://aws.amazon.com/blogs/big-data/interact-with-apache-iceberg-tables-using-amazon-athena-and-cross-account-fine-grained-permissions-using-aws-lake-formation/) enable column-level permissions.

With tools like [Kestra](https://kestra.io/docs/enterprise), you can build compliance into workflows through built-in [custom RBAC](https://kestra.io/docs/enterprise/rbac), [SSO](https://kestra.io/docs/enterprise/sso), [SCIM](https://kestra.io/docs/enterprise/scim), [audit logs](https://kestra.io/docs/enterprise/audit-logs), [outputs](https://kestra.io/docs/workflow-components/outputs) and [metrics](https://kestra.io/docs/workflow-components/tasks/scripts/outputs-metrics) tracking, and [manual approval](https://kestra.io/docs/how-to-guides/pause-resume) features.

---

## 5. Cloud Costs Under the Microscope

As more AI and data workloads [enter production](https://cloud.google.com/transform/2025-and-the-next-chapters-of-ai), cloud costs rise. Data leaders keep a closer eye on how often they run jobs and how much storage they consume. Hidden costs like data egress, idle services, or frequent transformations can add up fast if not closely monitored. Open table formats and smarter data orchestration with on-demand compute (like **Kestra’s [task runners](https://kestra.io/docs/enterprise/task-runners)**) can help cut costs.

---

## 6. Demand for Data Lakes and Open Table Formats

Cost optimization continues to drive renewed interest in data lakes, with teams combining **open table formats** like Apache Iceberg with object storage to balance governance and flexibility. The architecture often leverages Parquet files for columnar storage, while Iceberg’s (metadata layer](https://iceberg.apache.org/spec/)) adds critical features:

- Row-level deletions for GDPR compliance
- Schema evolution to handle evolving data structures
- RBAC integration through catalogs like [AWS Lake Formation](https://aws.amazon.com/blogs/big-data/interact-with-apache-iceberg-tables-using-amazon-athena-and-cross-account-fine-grained-permissions-using-aws-lake-formation/).

This setup allows teams to query data directly in object storage using [engines like DuckDB](https://kestra.io/blogs/2023-08-11-dataframes) (ad hoc analysis), Polars (complex transformations), or [chDB](https://kestra.io/blogs/embedded-databases) (lightweight aggregations). While data warehouses remain common for managing mission-critical data, the trend favors open **hybrid lakehouse architectures** – Iceberg-governed lakes handle raw data storage and governance, while warehouses manage curated data marts.

Notably, major platforms like Databricks and Snowflake now support Iceberg, reducing vendor lock-in risks as teams prioritize interoperability alongside cost control.

---

## 7. PostgreSQL Continues Its Rise as a Universal Database

The database world’s “Swiss Army knife” keeps getting sharper. In 2025, **PostgreSQL** isn’t just competing with specialized databases – it’s *absorbing* their capabilities through a thriving ecosystem of extensions and integrations. Three trends define this evolution:

1. **AI/ML/OLAP extensions**: Vector search (`pgvector`) and direct querying of data lakes (ParadeDB’s `pg_analytics`) let teams build RAG and analyze Iceberg tables and S3 data without leaving PostgreSQL.
2. **Hybrid workloads**: DuckDB integrations enable JOINs between operational tables and external Parquet datasets, while serverless Postgres options (like Neon) simplify scaling.
3. **Protocol standardization**: many databases like Timescale and distributed systems (CockroachDB, YugabyteDB) prioritize PostgreSQL compatibility to leverage its developer ecosystem.

The [2024 Stack Overflow survey](https://survey.stackoverflow.co/2024/) found 49% of developers now use PostgreSQL – surpassing MySQL for the first time. This growth stems from its *ecosystem-first* strategy: instead of forcing users to adopt new tools, PostgreSQL integrates them, becoming what many call *the Linux of databases* – boringly reliable, and infinitely adaptable.


![postgres](/blogs/2025-data-engineering-and-ai-trends/postgres.png)

Source: [Postgres is eating the database world](https://medium.com/@fengruohang/postgres-is-eating-the-database-world-157c204dcfc4)

---

## 8. Migrations Are Still Painful, But AI Can Help

Even though many developers love PostgreSQL, migrating databases or moving workloads between on-prem and cloud still takes a lot of work due to existing dependencies on proprietary systems. Data gravity is a powerful force, and legacy applications often can’t just be swapped out the same way as modular components of a Modern Data Stack. As a result, many data engineering teams stay on older platforms for years, despite the appeal of modern technology.

There’s a bright spot, though. AI is starting to make certain migrations much easier. [AWS Database Migration Service (DMS)](https://aws.amazon.com/blogs/aws/aws-data-migration-service-improves-database-schema-conversion-with-generative-ai/) now uses generative AI to automate many of the time-consuming schema conversion tasks needed to move from commercial databases like Oracle to PostgreSQL. It won’t handle every edge case—proprietary functions and special data types can still be tricky—but it can significantly reduce the pain of database migration. This is a welcome trend for data engineers who typically face long, painstaking processes to convert and migrate data manually.

![aws_dms](/blogs/2025-data-engineering-and-ai-trends/aws_dms.png)

---

## 9. **The Engineering Efficiency Paradox**

Some large tech companies like Salesforce [have declared](https://news.ycombinator.com/item?id=42639417) they will hire no new software engineers in 2025. Meta’s CEO has even suggested that AI might [replace entire layers of mid-level software engineers](https://www.businessinsider.com/mark-zuckerberg-meta-ai-replace-engineers-coders-joe-rogan-podcast-2025-1) soon. AI-based tools for writing code, building prototypes, generating tests, and automating documentation make it possible to move faster with smaller teams.

Yet this doesn’t signal engineering’s decline—it’s a recalibration. **Jevons’ Paradox** plays out here: as AI lowers the cost of basic coding, demand for *experienced senior engineers* grows.

---

## 10. Doing More with Fewer Tools

Companies face a proliferation of specialized data tools. To combat this complexity, teams are consolidating workflows into unified platforms—a trend often called *platformization*. Modern data orchestration now spans real-time streams, dynamic ML pipelines, and enterprise automation, going far [beyond traditional batch ETL](https://kestra.io/blogs/data-orchestration-beyond-analytics).

Open-source platforms like [Kestra](https://github.com/kestra-io/kestra) exemplify this shift by unifying:

- Workflow orchestration (code-first or UI-driven)
- Infrastructure management (scaling, deployments)
- API and process automation (approval workflows, AI pipelines).

You can orchestrate workflows as code or configure them in the UI, using any language or deployment pattern. This consolidation reduces the overhead of maintaining disparate tools while accelerating development. Teams can collaborate on a single system instead of juggling siloed point solutions for scheduling, transforming, and automating data workflows.

---

## 11. AI in BI: Generative BI & Analytics

Generative AI now powers many BI dashboards. Instead of manually creating every report or writing SQL queries from scratch, analysts can describe what they need in plain language. Tools like [Databricks Assistants](https://www.databricks.com/blog/introducing-databricks-assistant), [Snowflake Cortex](https://www.snowflake.com/en/blog/use-ai-snowflake-cortex/), [Microsoft Fabric](https://www.microsoft.com/en-us/microsoft-fabric), or [Amazon Q in AWS QuickSight](https://aws.amazon.com/quicksight/q/) help generate polished visuals automatically thanks to integrated AI copilots.

Still, human oversight is critical. AI can jumpstart a chart or query, but domain expertise is needed to confirm correctness or adjust misinterpreted metrics.

---

## 12. Evolving Data Roles

Generative AI continues to help data teams work more efficiently. Many routine tasks—like writing transformation code, unit tests, or basic ETL pipelines—can be sped up by AI-driven coding assistants. This frees data professionals to focus on more strategic projects, such as designing cost-effective data architectures and building data platforms to enable less technical stakeholders to build data pipelines in a self-served manner.

These changing roles also call for more unified tooling. Open-source solutions like Kestra bring orchestration across data pipelines, microservices, infrastructure, and analytics workflows under one roof, helping teams move faster with less complexity.

---

## Next Steps

As the data field continues to evolve, staying adaptable, embracing automation, and relying on proven patterns can help teams thrive. Data professionals who focus on domain expertise and stakeholder collaboration will do well in 2025 and beyond.

We’d love to hear your thoughts. Are these trends shaping your data stack? Join the [Kestra community](https://kestra.io/) and share your perspective—or suggest a trend we might have missed.

If you want to learn more about Kestra, check out our [documentation](https://kestra.io/docs) or [request a demo](https://kestra.io/demo), and if you like the project, become our next star on [GitHub](https://github.com/kestra-io/kestra).