---
title: "Upsert Explained: Combining Update and Insert for Data Consistency"
description: "Understand what upsert means in databases, how it works across different SQL dialects, and how Kestra orchestrates idempotent upsert operations for reliable data pipelines."
metaTitle: "Upsert: Update or Insert for Data Consistency"
metaDescription: "Learn what the upsert database operation is, its SQL syntax in PostgreSQL, MySQL, and Snowflake, and how Kestra orchestrates idempotent upserts."
tag: "data"
date: 2026-08-03
slug: "upsert"
faq:
  - question: "What does upsert mean?"
    answer: "Upsert is a portmanteau of 'update' and 'insert.' It's a database operation that attempts to update an existing row if a specified unique key already exists in a table. If no matching key is found, it inserts a new row. This combines two operations into one, simplifying data synchronization and conflict resolution logic."
  - question: "What's the difference between upsert and update?"
    answer: "An UPDATE operation only modifies existing rows that match a specified condition. If no matching row exists, an UPDATE does nothing. In contrast, an UPSERT will update a row if it exists, but it will insert a new row if no matching record is found. This makes upsert suitable for scenarios where you need to both modify and create records."
  - question: "Is upsert a good practice for data synchronization?"
    answer: "Yes, upsert operations are highly recommended for data synchronization and conflict resolution. They ensure data consistency by preventing duplicates and efficiently handling scenarios where data might already exist or needs to be newly added. This is crucial for maintaining accurate datasets across disparate systems."
  - question: "Is 'upsert' a real word in databases?"
    answer: "While 'upsert' is a portmanteau and not a traditional dictionary word, it has become a widely accepted and standard term within the database and data engineering communities. Many modern relational and NoSQL databases, like PostgreSQL and MongoDB, directly support or provide syntax to achieve upsert functionality."
  - question: "When should you use an upsert operation?"
    answer: "You should use upsert when performing incremental data loads, synchronizing data between systems, or resolving data conflicts where a record might either need to be updated or inserted. It's ideal for maintaining an up-to-date view of data without complex conditional logic in your application or pipeline."
---

> **TL;DR** — Upsert is a database operation that intelligently combines "update" and "insert." If a record with a specified key already exists, it updates that record; otherwise, it inserts a new one. This ensures data consistency and prevents duplicates, making it crucial for synchronizing data across systems and handling conflict resolution efficiently.

In the world of data, ensuring accuracy and avoiding duplicates is paramount. As data flows between applications, warehouses, and analytics platforms, records are constantly being created, updated, and sometimes deleted. The challenge lies in efficiently handling these changes: how do you insert a new record if it doesn't exist, or update an existing one without writing complex conditional logic?

This is the problem the "upsert" operation solves. By intelligently combining the "update" and "insert" actions into a single atomic operation, upsert simplifies data synchronization, simplifies pipeline logic, and guarantees data integrity. This article will demystify upsert, explore its implementations across various databases, and demonstrate how Kestra orchestrates these critical operations for reliable data management.

## Understanding the Upsert Operation

### What is an Upsert and why does it matter?

Upsert, a blend of "update" and "insert," is a database operation that modifies a row if it already exists or creates a new one if it doesn't. This conditional logic is handled directly by the database engine based on a unique key or constraint. Instead of first querying the database to check for a record's existence and then deciding whether to run an `INSERT` or `UPDATE` statement, an upsert performs this in a single, atomic step.

This atomicity is critical for building reliable [data pipelines](/resources/data/data-pipeline). It prevents race conditions where two processes might check for the same record simultaneously, leading to duplicate entries or failed updates. The primary benefits of using upsert include:

-   **Data Synchronization:** Keeps data consistent between different systems by ensuring records are always current.
-   **Idempotency:** Allows an operation to be repeated multiple times without changing the result beyond the initial application. This is essential for fault-tolerant data ingestion.
-   **Conflict Resolution:** Simplifies handling scenarios where incoming data might already exist, preventing duplicate key errors.
-   **Performance:** Reduces network latency by combining two potential database calls into one.

### Upsert vs. traditional SQL operations (INSERT, UPDATE, DELETE)

To fully appreciate the value of upsert, it's helpful to compare it with standard SQL commands.

| Operation | Action | Behavior if Record Exists | Behavior if Record Doesn't Exist |
| --- | --- | --- | --- |
| `INSERT` | Adds a new row. | Fails (unique constraint violation). | Creates the new row. |
| `UPDATE` | Modifies an existing row. | Modifies the matching row(s). | Does nothing. |
| `DELETE` | Removes an existing row. | Removes the matching row(s). | Does nothing. |
| `UPSERT` | Adds or modifies a row. | Modifies the matching row. | Creates the new row. |

A typical workflow without upsert would require a `SELECT` statement to check for the record, followed by conditional application logic to run either `INSERT` or `UPDATE`. This multi-step process is less efficient and more prone to errors, especially in concurrent environments. Upsert simplifies this entire flow into a single, declarative statement, which is a core principle of modern [data orchestration](/resources/data/data-orchestration).

## How Databases Implement Upsert

While the concept of upsert is universal, the specific SQL syntax varies across different database systems. Most modern relational databases provide a dedicated command or clause to perform this operation.

### PostgreSQL's `ON CONFLICT` clause

PostgreSQL implements upsert using the `INSERT ... ON CONFLICT` clause, which is highly flexible. You specify what to do when an insert would violate a unique constraint.

```sql
INSERT INTO customers (id, name, email)
VALUES (1, 'Alice', 'alice@example.com')
ON CONFLICT (id)
DO UPDATE SET email = EXCLUDED.email;
```

Here, if a customer with `id = 1` already exists, the database updates their email. Otherwise, it inserts the new record.

### MySQL's `ON DUPLICATE KEY UPDATE` and `REPLACE` statement

MySQL offers two primary ways to perform an upsert. The most common is `INSERT ... ON DUPLICATE KEY UPDATE`.

```sql
INSERT INTO customers (id, name, email)
VALUES (1, 'Alice', 'alice@example.com')
ON DUPLICATE KEY UPDATE email = VALUES(email);
```

This statement requires a `PRIMARY KEY` or `UNIQUE` index. If a duplicate key is found, the `UPDATE` clause is executed. MySQL also has a `REPLACE` statement, which first deletes the old row and then inserts the new one. This approach can be less efficient as it involves a `DELETE` and an `INSERT`, which can have cascading effects on related tables.

### Snowflake's `MERGE` statement for data warehousing

In data warehousing, upsert operations are fundamental to loading dimension tables and fact tables. Snowflake uses the powerful `MERGE` statement, which aligns with the SQL standard.

```sql
MERGE INTO customers AS target
USING source_data AS source
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET target.email = source.email
WHEN NOT MATCHED THEN
    INSERT (id, name, email) VALUES (source.id, source.name, source.email);
```

The `MERGE` statement is highly expressive, allowing you to define actions for matched and unmatched rows, making it ideal for complex synchronization logic. You can find a range of [Snowflake](/plugins/plugin-jdbc-snowflake) tasks and blueprints in Kestra.

### Other approaches: SQLite and NoSQL databases

-   **SQLite:** Uses the `INSERT ... ON CONFLICT` syntax, similar to PostgreSQL, often with `DO UPDATE SET`.
-   **NoSQL Databases (e.g., MongoDB):** Most NoSQL databases have built-in upsert functionality. MongoDB's `updateOne()` and `updateMany()` methods accept an `{ upsert: true }` option to achieve this.

## Orchestrate Upsert with Kestra: Idempotent Data Synchronization

In a production environment, an upsert operation is rarely a one-off task. It's typically part of a scheduled, automated workflow that keeps a target system synchronized with a source. Kestra excels at orchestrating these processes declaratively.

Consider a common scenario: you need to sync product inventory data from a source file into a Snowflake data warehouse every hour. The workflow must be idempotent, meaning running it multiple times with the same input data won't create duplicates or errors. The [Snowflake Incremental MERGE Upsert blueprint](/blueprints/snowflake-incremental-merge-upsert) provides a perfect template for this.

```yaml
id: snowflake-incremental-upsert
namespace: prod.inventory

tasks:
  - id: generate_source_data
    type: io.kestra.plugin.scripts.shell.Commands
    runner: DOCKER
    commands:
      # This task simulates generating a new data file.
      # In a real workflow, this could be a file download or API call.
      - |
        cat > products.json <<'EOF'
        {"id": 101, "product_name": "Wireless Mouse", "stock": 95}
        {"id": 102, "product_name": "Mechanical Keyboard", "stock": 50}
        {"id": 103, "product_name": "USB-C Hub", "stock": 120}
        EOF
    outputFiles:
      - products.json

  - id: stage_and_merge
    type: io.kestra.plugin.jdbc.snowflake.Query
    url: "{{ secret('SNOWFLAKE_URL') }}"
    username: "{{ secret('SNOWFLAKE_USER') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    from: "{{ outputs.generate_source_data.outputFiles['products.json'] }}"
    sql: |
      -- Create a temporary stage for the source data
      CREATE OR REPLACE TEMPORARY STAGE kestra_stage
        FILE_FORMAT = (TYPE = JSON);

      -- Put the source file into the stage
      PUT file://{{ workingDir }}/products.json @kestra_stage;

      -- Merge the staged data into the target table
      MERGE INTO product_inventory AS target
      USING (SELECT $1:id::int AS id, $1:product_name::string AS product_name, $1:stock::int AS stock FROM @kestra_stage) AS source
      ON target.id = source.id
      WHEN MATCHED AND target.stock <> source.stock THEN
          UPDATE SET target.stock = source.stock
      WHEN NOT MATCHED THEN
          INSERT (id, product_name, stock) VALUES (source.id, source.product_name, source.stock);

triggers:
  - id: hourly_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 * * * *"
```

### Key Advantages of Kestra for Upsert Workflows

This Kestra flow demonstrates how orchestration elevates a simple upsert into a reliable data process:

-   **Declarative & Versioned:** The entire logic is defined in a simple YAML file. It can be version-controlled in Git, reviewed, and deployed like any other piece of code.
-   **State Management:** Kestra handles the transfer of data between tasks. The file generated by the shell script is passed directly to the Snowflake task.
-   **Scheduling:** The `Schedule` trigger ensures the synchronization runs automatically every hour, requiring no manual intervention.
-   **Error Handling & Retries:** Kestra's built-in retry mechanisms can automatically re-run a failed task, adding resilience to the pipeline. If the `MERGE` fails due to a temporary network issue, Kestra can handle it gracefully.
-   **Observability:** Every execution is logged, with detailed metrics and outputs available in the UI. You can easily track when the sync ran, what data was processed, and whether it succeeded.

## Where Upsert Pays Off in Modern Data Stacks

Upsert operations are a cornerstone of many data-intensive applications and workflows:

-   **Change Data Capture (CDC):** As changes are captured from a source database, an upsert operation is the most efficient way to apply those inserts, updates, and deletes to a target warehouse. Learn more about [Change Data Capture](/resources/data/change-data-capture).
-   **Search Index Synchronization:** Keeping search indexes like Algolia, Typesense, or Pinecone up-to-date requires constant upserts to reflect changes in the source data. Kestra offers plugins for [Pinecone](/plugins/plugin-pinecone/io.kestra.plugin.pinecone.upsert), [Typesense](/plugins/plugin-typesense), and a blueprint for [syncing with Algolia](/blueprints/algolia-index-sync).
-   **CRM/ERP Data Integration:** When syncing customer or order data between systems, upserts ensure that records are not duplicated and that the latest information is always available.
-   **Real-time Analytics:** Ingesting streaming data into analytical databases often relies on high-frequency upserts to maintain an accurate, real-time view of business metrics.

## Related concepts

-   [Data Orchestration for Modern Data Engineers](/data)
-   [ETL vs. ELT: Understanding the Differences](/resources/data/etl-vs-elt)
-   [What is Data Lineage and Why is it Important?](/resources/data/data-lineage)
-   [Ensuring Data Quality in your Pipelines](/resources/data/data-quality)
-   [Explore Data Engineering Resources](/resources/data)
