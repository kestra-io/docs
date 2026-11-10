---
title: "Fivetran + dbt Merger & Fusion Engine: What It Means for ETL/ELT"
description: "Fivetran and dbt Labs have merged and dbt Core v2.0 open-sources the Fusion engine. Here's what changes for your ETL/ELT pipelines, costs, and lock-in."
metaTitle: "Fivetran + dbt Merger & Fusion Engine Explained"
metaDescription: "The Fivetran and dbt Labs merger is complete, and dbt Core v2.0 introduces the Fusion engine. Discover the impact on your ETL/ELT, costs, and data stack."
tag: data
date: 2026-06-01
faq:
  - question: "Is dbt still open source after the Fivetran merger?"
    answer: "Yes, dbt Core v2.0, including the new Fusion engine, remains open source under the Apache 2.0 license. The merger between Fivetran and dbt Labs aims to accelerate innovation while maintaining dbt's open-source commitment."
  - question: "What is the dbt Fusion engine?"
    answer: "The dbt Fusion engine is a complete rewrite of dbt's core logic in Rust, designed as a true SQL compiler. It dramatically accelerates SQL parsing and validation, offering features like real-time SQL validation without a warehouse run and State-Aware Orchestration for optimized compute."
  - question: "How much faster is dbt Fusion than dbt Core?"
    answer: "The dbt Fusion engine can parse SQL up to 30 times faster than dbt Core, particularly on large projects with 10,000 or more models. This speedup primarily applies to parsing and validation, not necessarily the end-to-end execution time of warehouse queries."
  - question: "What is the difference between dbt State and State-Aware Orchestration?"
    answer: "dbt State refers to a new feature for smarter dbt runs, leveraging caching and skipping unchanged models. State-Aware Orchestration, powered by the Fusion engine, is the underlying capability that rebuilds only what has changed in your data models, leading to significant compute cost savings."
  - question: "What is the Agents Schema?"
    answer: "The Agents Schema is a new open-source standard designed to provide a dedicated context layer for AI agents interacting with data. It aims to standardize how AI agents understand and utilize data assets within the dbt ecosystem for more reliable and governed AI workflows."
  - question: "Do I have to migrate to the dbt Fusion engine?"
    answer: "Migration to the dbt Fusion engine is not immediately mandatory. dbt Core v2.0, which includes Fusion, is currently in an alpha state. Teams should evaluate the benefits, such as performance gains and cost savings, against their current operational stability and specific use cases before planning a migration."
  - question: "What is the AI Connector Builder?"
    answer: "The AI Connector Builder is a new tool from the merged Fivetran and dbt Labs entity that allows users to generate new data connectors from API documentation in minutes. This aims to speed up data ingestion by automating the creation of connectors for various data sources."
---

The data world just got a seismic shift. On June 1, 2026, Fivetran and dbt Labs officially completed their merger, an announcement first made on October 13, 2025. But that's not the only news: dbt Core v2.0 was simultaneously unveiled, featuring the highly anticipated open-source dbt Fusion engine. This dual announcement marks a pivotal moment for anyone building and orchestrating ETL/ELT pipelines, promising a new era of "Open Data Infrastructure for AI agents."

This article dives deep into what these changes mean for your data stack. We'll explore the technical innovations behind the Fusion engine, analyze the implications for cost and portability, and provide a clear decision framework for whether — and when — to consider migrating your existing dbt and Fivetran workflows. Understand the true impact of this merger on your data operations and how Kestra complements this evolving landscape.

## TL;DR: What was announced on June 1, 2026

For those short on time, here are the key takeaways from the [official Fivetran announcement](https://www.fivetran.com/press/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents) and [dbt Labs blog post](https://www.getdbt.com/blog/fivetran-and-dbt-are-one-company-now-here-s-what-that-means):

*   **Fivetran and dbt Labs Merger is Complete:** The all-stock merger, first announced on October 13, 2025, is now official. The combined company will be led by CEO George Fraser (from Fivetran) and President Tristan Handy (from dbt Labs).
*   **dbt Fusion Engine is Open-Sourced:** The new, high-performance dbt Fusion engine is now part of dbt Core v2.0 (**alpha**), released under the Apache 2.0 license. This ensures the core transformation technology remains open-source.
*   **Five Joint Product Launches:** The merged entity announced a suite of new tools aimed at the "agentic era" of AI:
    1.  dbt Core v2.0 with the Fusion engine (**alpha**)
    2.  dbt Wizard (**beta**), an agentic development environment
    3.  dbt State (**preview**), for more efficient dbt runs
    4.  Agents Schema, an open-source standard for AI context
    5.  AI Connector Builder, for rapid connector creation

This combination of corporate consolidation and open-source innovation signals a major strategic move to define the future of the modern data stack. You can explore more hands-on guides in our [data engineering resources](/resources/data).

## Fivetran + dbt: Why This Merger, and Why Now?

The central thesis behind the merger is to build the "Open Data Infrastructure for AI agents." As enterprise spending on AI accelerates, the demand for reliable, well-structured, and fresh data has become the primary bottleneck. The combined company argues that AI agents need a trusted data foundation to function effectively.

This merger combines two critical pieces of that foundation:

*   **Fivetran:** Brings best-in-class automated data movement. Its strength lies in reliably and efficiently getting raw data from hundreds of sources into a central data warehouse, ensuring data freshness.
*   **dbt Labs:** Brings best-in-class data transformation. Its strength is in turning that raw data into governed, well-defined, and business-ready data models that can serve as reliable context for analytics and AI.

By integrating these two layers, the new entity aims to create a seamless experience from ingestion to transformation, providing a single, governed source of truth for both human analysts and AI agents. The timing is no coincidence; it’s a direct response to the [rise of the workflow engineer](/blogs/2026-03-05-data-eng-trends-2026) and the explosion in AI applications that demand more than just raw data—they require orchestrated, reliable context. Kestra helps teams [stop writing glue code around AI pipelines](/ai-automation) by coordinating these tools with the rest of the stack.

## The dbt Fusion Engine, Explained

At the heart of the announcement is the dbt Fusion engine, a ground-up rewrite of dbt's core logic in Rust. This isn't just a performance tweak; it's a fundamental architectural shift that redefines dbt as a true SQL compiler. Here’s what that means in practice.

### A True SQL Compiler, Built on Rust

Previous versions of dbt used a combination of Python and Jinja for parsing and compiling SQL. The Fusion engine replaces this with a dedicated Rust-based compiler. According to the [official Fusion product page](https://www.getdbt.com/product/fusion), this results in significant performance gains, particularly in the parsing phase. For a large project with 10,000 models, parsing can be **up to 30 times faster**.

This speed allows for new capabilities that were previously impractical:

*   **Real-time SQL Validation:** Fusion can validate your SQL logic and dependencies locally, without needing to connect to a data warehouse. This tightens the development loop, catching errors faster and reducing wasted compute on invalid queries.

### State-Aware Orchestration for Lower Compute Costs

One of the most impactful features powered by Fusion is State-Aware Orchestration (**preview**). This intelligent system tracks the state of your data models and rebuilds only the parts of your DAG that have actually changed.

The potential cost savings are substantial. Early customer evidence suggests a **30% or greater reduction in compute costs**:
*   **Fanatics** reported a ~15% reduction in Snowflake costs and a 25-30% increase in model reuse.
*   **Obie Insurance** saw a 30%+ reduction in compute costs.
*   **EQT** achieved a 50% reduction in costs and a 60% reduction in runtime.

This move directly addresses the rising costs of cloud data warehousing by ensuring that compute resources are used more efficiently, a critical aspect of modern [data orchestration](/resources/data/data-orchestration).

### AI-Ready Metadata and Open Source Commitment

The Fusion engine is designed with AI in mind. It exposes a rich metadata layer and a dbt Model Configuration Protocol (MCP) server, allowing AI agents and other tools to interact with dbt projects programmatically.

Crucially, the entire Fusion engine is being released as part of dbt Core v2.0 (**alpha**) under the Apache 2.0 license. This reaffirms a commitment to open source, ensuring that the core transformation power remains accessible to the entire community. This approach aligns with Kestra's philosophy of providing a [simpler, more powerful orchestration](/docs/why-kestra) layer that builds upon open standards.

## The Other Product Launches That Matter

Beyond the Fusion engine, four other product announcements signal the new company's direction:

1.  **dbt Wizard (beta):** An agentic development environment that helps users build and debug dbt models using natural language. It aims to lower the barrier to entry for data transformation.
2.  **dbt State (preview):** A feature that enables smarter, more efficient dbt runs by leveraging caching and intelligently skipping unchanged models. This is the user-facing feature powered by the underlying State-Aware Orchestration capability.
3.  **Agents Schema:** An open-source standard for creating a dedicated schema (`AGENTS`) in the data warehouse. This schema is designed to provide a clean, governed context layer for AI agents, separating AI-generated data from core business models. This is key for building reliable [RAG pipelines](/resources/ai/rag-pipeline).
4.  **AI Connector Builder:** A new tool that uses AI to generate Fivetran connectors from API documentation in minutes, dramatically accelerating the process of ingesting data from new sources.

These launches collectively point to a future where AI agents are first-class citizens in the data stack, from ingestion to transformation.

## What It Means for Your ETL/ELT Workflows

These announcements have significant, practical implications for data teams.

### Lock-in & Portability

The company strongly emphasizes its commitment to "no lock-in," citing the open-sourcing of the Fusion engine as proof. While this is a positive step, the merger also consolidates two of the most critical components of the modern data stack under a single commercial entity.

Previously, teams could mix and match Fivetran with other transformation tools, or dbt with other ingestion tools. Now, the product roadmap, integration points, and commercial incentives will naturally favor a more tightly-coupled Fivetran + dbt experience. While the core remains open, the ecosystem around it may become more centralized. Teams should critically evaluate how this strategic alignment affects their long-term architectural flexibility.

### Cost Impact

The most immediate and positive impact is on cost. The State-Aware Orchestration in Fusion promises to significantly reduce data warehouse compute bills by eliminating redundant model builds. For teams running large, complex dbt projects on a frequent schedule, these savings could be substantial, justifying the effort to migrate. Designing an efficient [ETL workflow](/resources/data/etl-workflow) has always been a balance of performance and cost, and Fusion shifts that balance favorably.

### Should You Migrate to Fusion? A Decision Checklist

Migrating to dbt Core v2.0 and the Fusion engine is a significant step. Before you jump in, consider the following:

*   **[ ] Assess Project Scale:** Are your dbt projects large enough (hundreds or thousands of models) that parsing speed is a noticeable bottleneck?
*   **[ ] Analyze Compute Costs:** Is your data warehouse bill a major concern? Can you quantify the potential savings from a 30%+ reduction in dbt-related compute?
*   **[ ] Evaluate Stability Needs:** dbt Core v2.0 is in **alpha**. Are you comfortable adopting an early-stage release for your production workloads, or should you wait for a stable version?
*   **[ ] Review Team Skills:** Does your team have the capacity to test, validate, and manage a migration to a new engine?
*   **[ ] Consider Your Orchestration Layer:** How does this change fit into your broader orchestration strategy? Does your current orchestrator support the new dbt version and its features?

This decision is a classic [ETL vs. ELT](/resources/data/etl-vs-elt) trade-off: the potential for greater efficiency versus the stability of a mature system.

## Where Kestra Fits in This Landscape

The Fivetran and dbt merger creates a powerful, integrated platform for data ingestion and transformation. However, it doesn't solve the end-to-end orchestration challenge. This is where Kestra provides a complementary and essential layer.

The Fusion engine optimizes what happens *inside* a `dbt run`. Kestra orchestrates the entire process *around* that run. A typical modern data pipeline involves more than just Fivetran and dbt. It includes triggering Fivetran syncs, running dbt transformations only after the syncs complete, handling data quality checks, loading results into other systems, and notifying stakeholders.

Kestra is engine-agnostic. Whether you're using dbt Core v1.x or the new Fusion-powered v2.0, Kestra can manage the workflow. Our declarative YAML interface allows you to define, version, and manage complex, multi-tool pipelines as code.

With Kestra, you can:
*   **[Orchestrate dbt with Kestra](/orchestration/dbt-core)** alongside Fivetran, Airbyte, or any custom ingestion script.
*   Use event-driven triggers to run dbt models as soon as Fivetran loads fresh data, using blueprints like our [Fivetran and dbt Cloud integration](/blueprints/fivetran-dbt-cloud).
*   Integrate data transformation with infrastructure tasks, AI model training, and business notifications in a single, unified workflow.

The merger of Fivetran and dbt streamlines two important steps in the data value chain. Kestra provides the overarching control plane to connect those steps with everything else your business depends on, creating a truly robust and observable [data platform](/data).
