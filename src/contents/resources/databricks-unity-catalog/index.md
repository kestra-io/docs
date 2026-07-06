---
title: "Databricks Unity Catalog: Unified Governance for Your Lakehouse"
description: "Explore Databricks Unity Catalog, its role in unifying data and AI governance across your lakehouse, and how Kestra enhances its capabilities for end-to-end orchestration."
metaTitle: "Databricks Unity Catalog: Lakehouse Governance | Kestra"
metaDescription: "Understand Databricks Unity Catalog for unified data and AI governance. Learn its features, how it differs from Metastore, and how to orchestrate UC workflows."
tag: "data"
date: 2026-07-10
slug: "databricks-unity-catalog"
faq:
  - question: "What is the difference between Databricks Metastore and Unity Catalog?"
    answer: "Hive Metastore is a workspace-level, legacy metadata store built for Hadoop-era workflows. Unity Catalog, on the other hand, is Databricks' account-level governance layer designed for the modern data lakehouse. It covers tables, ML models, and AI assets across clouds under a single access control model, offering superior scalability and centralized management."
  - question: "Does Databricks charge for Unity Catalog?"
    answer: "All Unity Catalog features are provided at no charge to customers, provided they are using a Premium or Enterprise SKU of Databricks. This makes advanced data governance accessible without additional licensing costs for eligible users."
  - question: "What is a catalog table in Databricks Unity?"
    answer: "In Unity Catalog's three-level namespace (catalog.schema.table), 'catalog' is the top organizational layer. Catalogs contain schemas, which in turn can hold tables, views, volumes, models, and functions. These catalogs are registered within a Unity Catalog metastore in your Databricks account, providing a logical grouping for your data assets."
  - question: "How to enable Databricks in Unity Catalog?"
    answer: "Enabling Unity Catalog in Databricks involves configuring a metastore for your Databricks account, assigning it to workspaces, and then granting permissions. This typically requires an account admin to set up the metastore in the Databricks account console and connect it to your cloud storage."
  - question: "Why do we use Unity Catalog in Databricks?"
    answer: "Unity Catalog is used in Databricks to centralize data governance, simplify access control, and provide a unified view of data and AI assets across multiple workspaces and clouds. It streamlines security, auditing, and data sharing, crucial for modern data lakehouse architectures."
  - question: "How does Unity Catalog support AI assets?"
    answer: "Unity Catalog extends beyond traditional data tables to govern AI assets, including ML models, functions, and volumes. This allows data and ML teams to apply consistent access policies and lineage tracking to all assets, ensuring reproducibility and compliance in MLOps workflows."
  - question: "What are the benefits of Unity Catalog for data governance?"
    answer: "Unity Catalog offers fine-grained access control, centralized auditing, and simplified data sharing across an organization. It provides a single source of truth for metadata and permissions, making it easier to manage compliance, track data lineage, and ensure data quality and security."
  - question: "Can Unity Catalog integrate with external tools?"
    answer: "While Unity Catalog provides robust governance within the Databricks ecosystem, its open interfaces and API allow for integration with external tools. This enables broader data pipelines and orchestration platforms like Kestra to interact with and manage governed assets, extending reach beyond Databricks."
---

> **TL;DR** — Databricks Unity Catalog is a unified governance solution for the Databricks Lakehouse Platform, providing centralized access control, auditing, and lineage for data tables, ML models, and other AI assets across multiple workspaces and clouds. It simplifies security and compliance, ensuring a single source of truth for metadata.

Managing data and AI assets across a sprawling lakehouse environment often leads to fragmented governance, inconsistent access controls, and a lack of unified visibility. Data teams struggle to ensure compliance and security when metadata lives in silos and permissions are applied haphazardly across multiple workspaces.

Databricks Unity Catalog emerges as a solution to this challenge, offering a centralized governance layer that unifies access control, auditing, and lineage for all data and AI assets. This article explores how Unity Catalog works, its key benefits, and how Kestra can orchestrate workflows that leverage and extend its powerful governance capabilities.

## How Databricks Unity Catalog Works for Lakehouse Governance

Databricks Unity Catalog provides a centralized, account-level governance layer for all assets within the Databricks Lakehouse. Instead of managing permissions and metadata separately in each workspace, Unity Catalog consolidates these functions at the account level, creating a single source of truth that applies everywhere.

Its architecture is built on a three-level namespace: `catalog.schema.object`.
-   **Metastore:** The top-level container for all objects, attached at the account level. Each region has one metastore.
-   **Catalog:** The first layer of the namespace, used to organize assets logically, often by business unit or environment (e.g., `prod`, `dev`).
-   **Schema (Database):** The second layer, containing tables, views, volumes, models, and functions.
-   **Objects:** The assets themselves, such as tables, views, and ML models.

This structure allows for fine-grained access control using standard ANSI SQL commands (`GRANT`, `REVOKE`). Permissions can be set at any level, from the entire catalog down to individual columns and rows. A key feature is its ability to automatically capture [data lineage](resources/data/data-lineage) across all workloads, whether they are run in SQL, Python, R, or Scala. This provides a clear audit trail of how data is transformed, which is crucial for compliance and debugging in complex [data orchestration](resources/data/data-orchestration) environments.

## Unity Catalog's Core Features and Why They Matter

Unity Catalog moves beyond basic metadata management to provide a comprehensive governance framework for both data and AI. Its features are designed to address the complexities of modern data platforms.

-   **Centralized Metadata and Security:** By managing metadata and access policies at the account level, Unity Catalog ensures consistency across all workspaces. This eliminates the risk of conflicting permissions and simplifies administration.
-   **Unified Governance for Data and AI:** Unity Catalog governs not just tables and files but also AI assets like ML models and feature stores. This unified approach is critical for effective [MLOps](resources/ai/what-is-mlops), as it allows teams to manage the entire lifecycle of an AI application under one security model.
-   **Secure Data Sharing:** Built-in Delta Sharing allows organizations to securely share live data with external partners without copying or moving it, all while maintaining granular control over access.
-   **Rich Auditing and Lineage:** Detailed audit logs track all actions performed against governed assets, while automatic lineage provides visibility into data flows. This combination is essential for maintaining [data quality](resources/data/data-quality) and meeting regulatory requirements.

A common point of confusion is the difference between the legacy Hive Metastore and Unity Catalog. The Hive Metastore is a workspace-level service inherited from the Hadoop ecosystem. It lacks centralized governance, fine-grained access controls, and support for AI assets. Unity Catalog is the modern, account-level replacement designed specifically for the lakehouse, offering superior scalability, security, and a unified view across the entire Databricks account.

## Why Databricks Unity Catalog Needs External Orchestration

Unity Catalog excels at governing assets *within* the Databricks ecosystem. However, real-world data pipelines are rarely confined to a single platform. They involve a diverse set of tools for ingestion, transformation, and delivery, spanning multiple cloud services and on-premise systems.

This is where the need for an external orchestrator becomes clear. Unity Catalog can't:
-   Trigger and manage workflows in external systems like Snowflake, BigQuery, or SaaS applications.
-   Handle complex, cross-platform dependencies, such as waiting for a file to land in S3 before launching a Databricks job.
-   Implement sophisticated error handling, retries, and alerting that span the entire end-to-end process.
-   Provide a single pane of glass for monitoring and managing a pipeline that includes both Databricks and non-Databricks components.

An orchestration platform like Kestra complements Unity Catalog by managing the entire workflow from end to end. It can interact with the Unity Catalog API to manage governed assets as part of a larger, more complex [ETL orchestration tool alternative](resources/data/etl-orchestration-tool-alternatives).

## Orchestrate Databricks Unity Catalog with Kestra: Managing Data Assets

You can use Kestra to automate the management of your Databricks Unity Catalog assets. The following workflow demonstrates how to create a new schema, upload a local Parquet file to DBFS, and then create and query a table within that schema—all defined in a single, declarative YAML file.

```yaml
id: manage-unity-catalog-assets
namespace: company.team.databricks

tasks:
  - id: create_schema
    type: io.kestra.plugin.databricks.sql.Query
    host: "{{ secret('DATABRICKS_HOST') }}"
    token: "{{ secret('DATABRICKS_TOKEN') }}"
    sql: |
      CREATE SCHEMA IF NOT EXISTS my_catalog.new_schema
      COMMENT 'Schema created by Kestra orchestration';
    httpWarehouseId: "{{ secret('DATABRICKS_WAREHOUSE_ID') }}"

  - id: upload_data
    type: io.kestra.plugin.databricks.dbfs.Upload
    host: "{{ secret('DATABRICKS_HOST') }}"
    token: "{{ secret('DATABRICKS_TOKEN') }}"
    from: "data/raw/users.parquet"
    to: "/FileStore/kestra_uploads/users.parquet"
    overwrite: true
    dependsOn:
      - create_schema

  - id: create_and_query_table
    type: io.kestra.plugin.databricks.sql.Query
    host: "{{ secret('DATABRICKS_HOST') }}"
    token: "{{ secret('DATABRICKS_TOKEN') }}"
    sql: |
      CREATE TABLE IF NOT EXISTS my_catalog.new_schema.users
      USING PARQUET
      LOCATION '/FileStore/kestra_uploads/users.parquet';

      SELECT * FROM my_catalog.new_schema.users LIMIT 10;
    httpWarehouseId: "{{ secret('DATABRICKS_WAREHOUSE_ID') }}"
    fetch: true
    dependsOn:
      - upload_data
```

What's worth noticing in this flow:
-   **Declarative Asset Management:** The entire lifecycle of creating a schema and table is defined as code, making it versionable, auditable, and repeatable.
-   **Seamless Integration:** Kestra uses the native [Databricks plugin](plugins/plugin-databricks) to interact with both DBFS for file storage and Databricks SQL for DDL/DML operations, all within one workflow.
-   **Credential Security:** All sensitive information like hostnames, tokens, and warehouse IDs are managed securely using Kestra's secrets management.
-   **End-to-End Visibility:** Kestra provides centralized logging, execution tracking, and outputs for each step, offering a complete picture of the asset management process, which you can see in this guide on [interacting with Databricks using Kestra](blogs/2024-03-12-kestra-databricks). You can find more examples in our [Databricks SQL blueprint](blueprints/databricks-sql).

## Where Databricks Unity Catalog Pays Off for Data & AI Teams

By centralizing governance, Unity Catalog delivers significant value across various use cases, especially when combined with a robust orchestration layer.

-   **Streamlined Compliance:** For regulated industries, UC provides the auditing and lineage tracking necessary to demonstrate compliance with standards like GDPR and HIPAA.
-   **Secure Data Sharing:** It enables a "data mesh" architecture by allowing different business domains to securely share data assets with each other and with external partners.
-   **Governed MLOps:** Teams can manage the entire model lifecycle—from feature engineering to deployment—under a consistent governance framework, ensuring reproducibility and security. Check our list of [Databricks alternatives](resources/data/databricks-alternatives) to see how this compares with other platforms.
-   **Multi-Cloud Strategy:** Organizations operating across multiple clouds can use Unity Catalog to apply consistent governance policies, simplifying management and reducing risk.
-   **Reduced Operational Overhead:** Centralizing metadata eliminates redundant administrative work across workspaces, freeing up data teams to focus on higher-value tasks. This is a key consideration when evaluating [Databricks Workflows alternatives](resources/data/databricks-workflows-alternatives).

By acting as the single source of truth for governance, Unity Catalog empowers data and AI teams to innovate faster while maintaining control and security over their most valuable assets.

## Related concepts
- [Snowflake Tasks Alternatives](/resources/data/snowflake-tasks-alternatives)
- [Best Cloud Composer Alternatives](/resources/data/cloud-composer-alternatives)
- [Microsoft Fabric Alternatives](/resources/data/microsoft-fabric-alternatives)
- [Declarative Orchestration for Modern Data Engineers](/data)
- [What is a Data Pipeline?](/resources/data/data-pipeline)
- [Understanding GitOps](/resources/infrastructure/gitops)
