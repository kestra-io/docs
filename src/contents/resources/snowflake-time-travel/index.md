---
title: "Snowflake Time Travel: Recover, Audit, and Analyze Data with Kestra"
description: "Explore Snowflake Time Travel's capabilities for data recovery, historical auditing, and advanced analytics. Learn how Kestra orchestrates these powerful features for robust data management."
metaTitle: "Snowflake Time Travel: Recover & Audit Data"
metaDescription: "Snowflake Time Travel recovers historical data, audits changes, and analyzes past states. Learn how Kestra orchestrates advanced Time Travel workflows in YAML."
tag: "data"
date: 2026-07-07
slug: "snowflake-time-travel"
faq:
  - question: "What is Snowflake Time Travel?"
    answer: "Snowflake Time Travel is a powerful feature that allows users to access historical data (data that has been changed or deleted) at any point within a defined period. This enables querying, cloning, or restoring data as it existed previously, without needing to maintain separate backups."
  - question: "How does Snowflake Time Travel work?"
    answer: "Snowflake maintains historical versions of data, including micro-partitions that were updated or deleted. When you use Time Travel, Snowflake queries this historical data based on internal timestamps or query IDs, reconstructing the data's state at the specified point in time. This is done transparently without requiring manual snapshots."
  - question: "What are the default and maximum retention periods for Time Travel?"
    answer: "By default, Time Travel retains data for 1 day (24 hours) for standard tables. For Enterprise Edition accounts, this can be extended up to 90 days. Beyond the Time Travel retention period, Snowflake offers a 7-day Fail-safe period for disaster recovery, where data is recoverable by Snowflake support."
  - question: "Can I restore a dropped table using Time Travel?"
    answer: "Yes, Snowflake Time Travel allows you to restore dropped tables, schemas, and even databases. Using the `UNDROP` command with `AT | BEFORE` clauses, you can recover these objects to a specific point in time, minimizing data loss from accidental deletions."
  - question: "What are the cost implications of Extended Time Travel?"
    answer: "Extended Time Travel, beyond the standard 1-day retention, incurs additional storage costs. Snowflake charges for the storage of historical data. Organizations should carefully evaluate their data retention needs against the associated costs to optimize their storage strategy."
  - question: "How does Kestra enhance Snowflake Time Travel?"
    answer: "Kestra orchestrates Snowflake Time Travel by embedding `AT | BEFORE` queries within automated workflows. This enables scheduled data recovery, automated auditing, and dynamic data versioning. Kestra's declarative YAML makes these complex workflows auditable, versionable, and easily integrated into broader data pipelines, ensuring reliable data management."
  - question: "Is Time Travel the same as traditional backups?"
    answer: "While Time Travel provides similar data recovery capabilities to backups, it's fundamentally different. Time Travel is built into Snowflake's architecture, allowing instant access to historical data without needing to restore from external backup files. It's more granular and integrated, offering point-in-time recovery directly within the live system."
---

> **TL;DR** — Snowflake Time Travel is a built-in feature that enables users to query, clone, and restore historical data (including changed or deleted data) at any point within a configurable retention period. It acts as a safety net for data recovery, auditing, and analysis without requiring manual backups.

Accidental data deletion, corrupt updates, or the need to audit historical states are common challenges in data platforms. Recovering from these incidents often involves complex manual processes, leading to downtime and potential data loss. Snowflake's Time Travel feature offers a powerful solution, allowing data engineers to access and restore data as it existed at any point in the past.

However, leveraging Time Travel effectively in production requires more than just knowing the SQL commands. It demands a robust orchestration layer that can automate recovery workflows, integrate historical data for analysis, and manage retention policies. This article explores Snowflake Time Travel and demonstrates how Kestra provides the control plane to operationalize this critical feature.

## How Snowflake Time Travel works: A built-in safety net
Snowflake Time Travel isn't an add-on; it's a core part of the platform's architecture. When data in a table is modified or deleted, Snowflake doesn't immediately overwrite the old data. Instead, it preserves the previous state of the micro-partitions for a defined period. This creates an immutable history of the data that can be queried directly.

This process is managed by Snowflake's metadata layer, which tracks all versions of the micro-partitions. When you execute a query with an `AT` or `BEFORE` clause, Snowflake uses this metadata to reconstruct the state of the table at that specific point in time. This can be a timestamp, a query ID, or an offset in seconds. The beauty of this approach is its efficiency—you can access historical data without restoring from a backup or maintaining manual snapshots. You can find detailed information on the Kestra [Snowflake plugin](/plugins/plugin-jdbc-snowflake) to see how these queries are executed.

## Why data platforms need robust Time Travel orchestration
While running manual SQL queries for Time Travel is useful for ad-hoc recovery, production data platforms require a more systematic approach. Orchestration turns Time Travel from a reactive tool into a proactive, automated component of your data management strategy.

- **Automated Data Recovery:** Instead of a frantic, manual `UNDROP` after an incident, an orchestration platform can detect anomalies—like a sudden drop in row count or a missing table—and trigger a recovery workflow automatically.
- **Simplified Auditing:** For compliance, you can schedule workflows that periodically query historical states of critical tables and store snapshots, creating a verifiable audit trail.
- **Consistent Historical Snapshots:** Machine learning and analytics often require point-in-time snapshots. Orchestration ensures these snapshots are created consistently and reliably.
- **Streamlined Development:** Automate the creation of development or testing environments by cloning a production database from a specific point in the past, ensuring realistic test data.
- **Data Loss Prevention:** By integrating Time Travel into your [data orchestration](/resources/data/data-orchestration) workflows, you build a resilient system that minimizes the impact of human error or application bugs.

By codifying these processes, you ensure they are version-controlled, auditable, and repeatable, which is essential for any modern [data platform](/data). You can explore more resources in our [data engineering hub](/resources/data).

## Orchestrate Snowflake Time Travel with Kestra: Automated data recovery
Kestra allows you to define complex data recovery and auditing logic as a simple, declarative YAML workflow. This example demonstrates a flow that runs every hour to check if a critical table exists. If the table has been dropped, it automatically restores it using Time Travel and sends a notification to a Slack channel.

```yaml
id: snowflake-auto-restore-critical-table
namespace: production.disaster_recovery

tasks:
  - id: check_if_table_exists
    type: io.kestra.plugin.jdbc.snowflake.Query
    sql: SHOW TABLES LIKE 'CRITICAL_CUSTOMER_DATA';
    fetchOne: true
    snowflake:
      url: "{{ secret('SNOWFLAKE_URL') }}"
      username: "{{ secret('SNOWFLAKE_USER') }}"
      password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
      warehouse: "{{ secret('SNOWFLAKE_WAREHOUSE') }}"
      database: "{{ secret('SNOWFLAKE_DATABASE') }}"
      schema: "{{ secret('SNOWFLAKE_SCHEMA') }}"

  - id: if_table_is_missing
    type: io.kestra.plugin.core.flow.If
    condition: "{{ outputs.check_if_table_exists.row == null }}"
    then:
      - id: restore_table
        type: io.kestra.plugin.jdbc.snowflake.Query
        sql: UNDROP TABLE CRITICAL_CUSTOMER_DATA;
        snowflake:
          url: "{{ secret('SNOWFLAKE_URL') }}"
          username: "{{ secret('SNOWFLAKE_USER') }}"
          password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
          warehouse: "{{ secret('SNOWFLAKE_WAREHOUSE') }}"
          database: "{{ secret('SNOWFLAKE_DATABASE') }}"
          schema: "{{ secret('SNOWFLAKE_SCHEMA') }}"

      - id: send_alert
        type: io.kestra.plugin.notifications.slack.SlackSimpleMessage
        url: "{{ secret('SLACK_WEBHOOK_URL') }}"
        message: "🚨 Critical table `CRITICAL_CUSTOMER_DATA` was dropped and has been automatically restored by Kestra."

triggers:
  - id: hourly_check
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 * * * *"
```

A few things are worth noticing in this workflow:
*   **Declarative Logic:** The entire recovery process is defined in a single YAML file, making it easy to read, version, and audit.
*   **Stateful Conditions:** Kestra's `If` task uses the output from the `check_if_table_exists` task to decide whether to execute the recovery steps.
*   **Automated Action:** The `UNDROP TABLE` command is executed automatically, minimizing the time to recovery.
*   **Integrated Alerting:** The workflow immediately notifies the team via Slack, ensuring visibility into automated actions.

This simple pattern can be extended for more complex scenarios, such as restoring data to a specific query ID or timestamp. For more examples, you can explore our [Snowflake blueprints](/blueprints/snowflake) and see how to [orchestrate Snowflake with Kestra](/orchestration/snowflake).

### Deciding on Time Travel retention policies
A critical aspect of using Time Travel is configuring the data retention period. Snowflake offers two main options:
*   **Standard Time Travel:** By default, this is 1 day (24 hours). It is available on all Snowflake editions and provides a short-term safety net for immediate recovery needs.
*   **Extended Time Travel:** Available for Snowflake Enterprise Edition and above, this allows you to set the retention period from 1 up to 90 days. This is crucial for organizations with stricter compliance requirements or longer data recovery windows.

Beyond the configured Time Travel period, Snowflake provides a 7-day **Fail-safe** period. This is a non-configurable, last-resort disaster recovery mechanism where data can only be recovered by Snowflake support.

Choosing the right retention period is a trade-off between recovery needs and cost. Extended Time Travel incurs additional storage costs for maintaining historical data. It's essential to analyze your data's criticality and regulatory requirements to set an appropriate policy. For insights into managing storage costs and configurations, refer to Kestra's documentation on [runtime and storage](/docs/configuration/runtime-and-storage).

## Beyond simple recovery: Advanced Time Travel use cases with Kestra
Orchestration unlocks advanced use cases for Time Travel that go far beyond simple disaster recovery.

*   **Automated Data Versioning:** Schedule workflows to create zero-copy clones of tables at specific intervals, effectively creating immutable versions for analytics. This concept is similar to the versioning capabilities discussed in the context of [Apache Iceberg on AWS](/blogs/iceberg-for-aws-users).
*   **Blue/Green Deployments for Data:** Before applying a major schema change or data transformation, create a clone of the production table. You can then test the changes on the clone. If issues arise, the orchestration workflow can instantly swap back to the original table.
*   **Compliance-Driven Snapshots:** For regulations like GDPR or SOX, you can build Kestra workflows that use Time Travel to create and archive snapshots of data as it existed at specific audit points.
*   **Data Quality Validation:** Run scheduled workflows that compare the current state of a table with its state 24 hours prior. This can help detect unexpected data drift or quality issues before they impact downstream systems. Many Kestra [customers](/customers) leverage such automated checks for data assurance.

## Snowflake Time Travel vs. other temporal data features
While other databases offer temporal data features, such as SQL Server's temporal tables or Oracle's Flashback technology, Snowflake's implementation has distinct advantages. The key differentiator is its integration with Snowflake's architecture, particularly zero-copy cloning. This allows you to create full, writable copies of historical data instantly without duplicating storage, which is a powerful feature for development and testing.

Furthermore, Time Travel applies not just to data within tables but to the objects themselves, including tables, schemas, and entire databases. This object-level recovery is a significant advantage for recovering from major structural errors. As modern data stacks evolve with tools like dbt and SQLMesh, having robust, built-in temporal capabilities becomes a cornerstone of reliable data modeling. You can read more about our [partnership with Snowflake](/blogs/2023-09-25-kestra-snowflake-partnership) and how to [orchestrate Snowflake with Kestra](/blogs/2024-03-21-orchestrate-snowflake-with-kestra).

## Related concepts
- [Data Lineage](/resources/data/data-lineage)
- [Data Quality](/resources/data/data-quality)
- [Disaster Recovery](/resources/infrastructure/disaster-recovery)
- [Data Orchestration](/resources/data/data-orchestration)

Ready to streamline your Snowflake operations? Explore Kestra's [Snowflake blueprints](/blueprints/snowflake) and start building resilient data workflows today.
