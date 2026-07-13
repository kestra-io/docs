---
title: "What Is Change Data Capture (CDC) — and How to Orchestrate It"
description: "Change data capture (CDC) detects and streams row-level database changes — inserts, updates, and deletes — in real time, powering real-time analytics, warehouse synchronization, and event-driven architectures."
metaTitle: "What Is Change Data Capture (CDC)? Definition & Orchestration Guide"
metaDescription: "Change Data Capture (CDC) streams row-level database changes in real time. Learn how CDC works — and orchestrate a full Postgres → Snowflake CDC pipeline in YAML."
tag: data
date: 2026-07-03
faq:
  - question: "Is change data capture real-time?"
    answer: "Log-based CDC is near-real-time: changes appear in the transaction log within milliseconds of commit. End-to-end latency depends on the pipeline — sub-second with a real-time trigger, or the polling interval with batch capture."
  - question: "What's the difference between CDC and ETL?"
    answer: "ETL moves data in scheduled bulk loads, while CDC streams individual row-level changes continuously. They are complementary: CDC feeds increments and an orchestrator coordinates both."
  - question: "Does CDC impact the performance of the source database?"
    answer: "Log-based CDC has minimal impact because it reads the transaction log the database already writes. Query-based CDC is heavier since every poll scans tables."
  - question: "Do I need Kafka to run Debezium?"
    answer: "No. Debezium is often deployed via Kafka Connect, but Kestra's Debezium plugins embed the engine directly, providing capture, state management and downstream processing in one declarative flow without a Kafka cluster."
---

> **TL;DR** — Change data capture (CDC) is a data integration pattern that detects and streams row-level changes — inserts, updates, and deletes — from a database as they happen, instead of re-copying entire tables on a schedule. CDC powers real-time analytics, data warehouse synchronization, and event-driven architectures while keeping the load on source systems minimal.

Most data teams meet CDC the day a nightly full-table copy stops scaling: the sync window grows, the warehouse bill climbs, and the business asks why yesterday's orders aren't in this morning's dashboard. CDC fixes all three at once — you move only what changed, seconds after it changed.

This guide covers how CDC works, and then does what most CDC articles don't: it shows a **complete, runnable pipeline** that captures changes from PostgreSQL and merges them into Snowflake.

## How CDC works

There are three ways to detect changes in a database, and they are not equal:

| Method | How it detects changes | Load on source | Captures deletes? | Latency |
| :-- | :-- | :-- | :-- | :-- |
| **Log-based** (the standard) | Reads the database's transaction log (the [WAL](/resources/data/postgres-wal) in Postgres) | Minimal — no queries against tables | ✅ Yes | Seconds |
| **Query-based** | Polls tables on a timestamp/version column | A full scan per poll | ❌ No (a deleted row simply disappears) | Poll interval |
| **Trigger-based** | Database triggers write changes to an audit table | Adds write overhead to every transaction | ✅ Yes | Seconds |

Log-based CDC won this comparison years ago, and **[Debezium](https://debezium.io/)** is its de-facto open-source implementation: it reads the transaction log of Postgres, MySQL, SQL Server, MongoDB, Oracle, or DB2 and emits one structured change event per row.

## Why CDC needs orchestration

Capturing changes is the easy half. A production CDC pipeline also needs to:

- **transform** raw change events (handle deletes, deduplicate, enrich);
- **load** them into a destination with correct upsert semantics ([MERGE](/resources/data/snowflake-merge), not blind inserts);
- **recover** from failures without losing or double-processing events;
- **alert** someone when the pipeline breaks — not when the business notices.

That layer is orchestration. Here is what it looks like as one declarative flow.

## Orchestrate CDC with Kestra: Postgres → Snowflake

This flow uses the [Debezium PostgreSQL trigger](https://kestra.io/plugins/plugin-debezium-postgres) to poll for change events (one execution per batch), cleans them in Python, stages the result in Snowflake, and merges it into the target table. Deleted rows are flagged by Debezium (`deleted` field) and handled explicitly.

```yaml
id: postgres-cdc-to-snowflake
namespace: company.data

triggers:
  - id: postgres_cdc
    type: io.kestra.plugin.debezium.postgres.Trigger
    hostname: "{{ secret('PG_HOST') }}"
    port: "5432"
    database: production
    username: "{{ secret('PG_USERNAME') }}"
    password: "{{ secret('PG_PASSWORD') }}"
    includedTables:
      - public.orders
    format: INLINE
    splitTable: "OFF"
    snapshotMode: INITIAL
    interval: PT1M

tasks:
  - id: to_json
    type: io.kestra.plugin.serdes.json.IonToJson
    from: "{{ trigger.uris.data }}"

  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    inputFiles:
      changes.jsonl: "{{ outputs.to_json.uri }}"
    outputFiles:
      - orders_clean.csv
    script: |
      import csv, json

      with open("changes.jsonl") as src, open("orders_clean.csv", "w", newline="") as out:
          writer = None
          for line in src:
              row = json.loads(line)
              row["is_deleted"] = bool(row.pop("deleted", False))
              if writer is None:
                  writer = csv.DictWriter(out, fieldnames=row.keys())
                  writer.writeheader()
              writer.writerow(row)

  - id: stage
    type: io.kestra.plugin.jdbc.snowflake.Upload
    url: "jdbc:snowflake://{{ secret('SNOWFLAKE_ACCOUNT') }}.snowflakecomputing.com"
    username: "{{ secret('SNOWFLAKE_USERNAME') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    from: "{{ outputs.transform.outputFiles['orders_clean.csv'] }}"
    fileName: orders_changes.csv
    prefix: cdc
    stageName: "@analytics.public.%orders_staging"

  - id: merge
    type: io.kestra.plugin.jdbc.snowflake.Queries
    url: "jdbc:snowflake://{{ secret('SNOWFLAKE_ACCOUNT') }}.snowflakecomputing.com"
    username: "{{ secret('SNOWFLAKE_USERNAME') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    sql: |
      COPY INTO analytics.public.orders_staging;
      MERGE INTO analytics.public.orders t
      USING analytics.public.orders_staging s ON t.order_id = s.order_id
      WHEN MATCHED AND s.is_deleted THEN DELETE
      WHEN MATCHED THEN UPDATE SET t.status = s.status, t.updated_at = s.updated_at
      WHEN NOT MATCHED AND NOT s.is_deleted THEN
        INSERT (order_id, status, updated_at) VALUES (s.order_id, s.status, s.updated_at);

errors:
  - id: alert
    type: io.kestra.plugin.notifications.slack.SlackExecution
    url: "{{ secret('SLACK_WEBHOOK') }}"
    channel: "#data-alerts"
```

A few things worth noticing — because they are exactly the parts a raw Debezium deployment leaves you to build yourself:

- **State is managed for you.** The trigger stores Debezium offsets in Kestra's KV Store, so a restart resumes from the last committed position instead of re-snapshotting the table.
- **Deletes are first-class.** `deleted: ADD_FIELD` (the default) flags removed rows, and the MERGE handles them — the failure mode of query-based CDC simply doesn't exist here.
- **Failure has a path.** The `errors` block alerts Slack on any failed execution; add [retries with exponential backoff](/resources/data/exponential-backoff) per task if the destination is flaky.

### Batch or real-time? Two triggers, one decision

The flow above uses `Trigger` — it polls every minute (`interval: PT1M`) and creates **one execution per batch** of changes. Its sibling [`RealtimeTrigger`](https://kestra.io/plugins/plugin-debezium-postgres) creates **one execution per row**, within milliseconds.

Rule of thumb: warehouse sync and analytics want the batch trigger (fewer, larger MERGEs are cheaper in Snowflake); operational reactions — fraud checks, cache invalidation, notifications — want the real-time trigger. It's a one-line change, which is the point of keeping CDC logic in declarative YAML rather than in connector configuration files.

## Where CDC pays off

- **Warehouse synchronization** — replace nightly full loads with minute-level freshness (this page's flow; see also [blueprint #194](https://kestra.io/blueprints/194-use-debezium-to-trigger-a-flow-whenever-new-entries-hit-a-postgres-database-then-send-notification-to-slack-and-process-data-in-python): Debezium → Slack notification → Python processing).
- **Event-driven architectures** — turn database changes into triggers for downstream [workflows](/resources/data/event-driven-orchestration) without touching application code.
- **Audit trails & compliance** — an immutable stream of every change, with metadata, for free.
- **Cache and search-index invalidation** — update Redis or Elasticsearch the moment a row changes, via the same pattern with a different final task.

Kestra ships Debezium plugins for **PostgreSQL, MySQL, SQL Server, MongoDB, Oracle, and DB2** — the flow above ports to any of them by swapping the trigger type.

---

**Related concepts:** [Postgres logical replication](/resources/data/postgres-logical-replication) · [Postgres WAL](/resources/data/postgres-wal) · [Snowflake streams](/resources/data/snowflake-streams) · [ETL vs ELT](/resources/data/etl-vs-elt) · [Dead letter queue](/resources/data/dead-letter-queue) · [Data orchestration](/resources/data/data-orchestration)

**▶ Run this flow in minutes** — [try Kestra Cloud](https://kestra.io/cloud) or `docker run kestra/kestra` and paste the YAML above.
